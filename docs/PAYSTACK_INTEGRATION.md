# Paystack integration — current state & implementation plan

This doc covers two things: **what's already built** for student checkout
(so you know what you're plugging into), and **how to wire in real Paystack
payments** when that work is ready to start.

It assumes a Supabase project (Postgres + Edge Functions) and the existing
Next.js student app in this repo.

---

## 1. What's already built

### Order creation is real; payment is stubbed

Checkout (`screens/student/checkout.tsx`) does two things on submit:

1. Calls the Postgres function `public.create_order` via
   `supabase.rpc("create_order", {...})`. This function (added in migration
   `add_create_order_function`):
   - Looks up the **current price of every menu item server-side** from
     `menu_items.price` — it never trusts a client-supplied price. This
     matters: a tampered request could otherwise under-price an order.
   - Validates every item belongs to the vendor being ordered from.
   - Computes `total_amount = subtotal + vendor.delivery_fee + 150 (service charge) + 100 (platform fee)`.
     Those two flat fees mirror `SERVICE_CHARGE`/`PLATFORM_FEE` in
     `helpers/student.helpers.ts` — if you ever change one, change both.
   - Generates a random 4-digit `delivery_pin`.
   - Inserts the `orders` row and all `order_items` rows atomically (it's a
     single Postgres function call, so either all of it commits or none of
     it does).
   - Clears the student's `carts` rows for them.
   - Returns `{ id, total_amount }` for the new order.

2. Calls `initiatePayment(orderId, amount)` from
   `lib/payments/paystack.ts`. **This is the swap point.** Today it just
   inserts a `transactions` row with `status: "completed"` — no real money
   moves. This was done so the rest of the order lifecycle (creation,
   tracking, vendor acceptance) could be built and tested without blocking
   on payments.

After both calls succeed, checkout clears the local cart state and redirects
to `/user-dashboard/orders/[id]`, which already has live order tracking via
Supabase Realtime (`screens/student/order-tracking.tsx`).

### Schema relevant to payments

- `transactions` — `id, order_id, amount, transaction_type, status, created_at`.
  No `reference` column yet — **you'll need to add one** (see §3).
- `orders.total_amount` — already computed correctly server-side; this is
  the amount to charge.
- `orders.status` — fulfillment workflow (`pending → preparing → ready →
  completed`, or `rejected`). **This is separate from payment status.**
  Payment status lives only in `transactions.status`. Don't conflate the
  two — a `completed` order means "delivered," not "paid."

### What's NOT done yet (known gaps for whoever picks this up)

- The vendor dashboard (`screens/vendor/dashboard.tsx`) shows every order
  regardless of payment status, because today every order's transaction is
  immediately `"completed"`. Once real payment is async, **you should
  filter the vendor's order list to only show orders with a completed
  transaction** (or otherwise make non-paid orders visually distinct), or
  vendors will see and start prepping unpaid orders.
- The "Wallet" payment option in checkout's UI has no backend at all — it's
  a placeholder. Only "Card" should map to the Paystack flow described
  below.
- There's no `payment_status` surfaced anywhere in the student-facing UI
  (order tracking just shows fulfillment status). Once payment becomes
  async, the tracking page should show something like "Confirming
  payment…" between order creation and the webhook landing.

---

## 2. Target architecture

```
Student clicks "Place order"
        │
        ▼
create_order RPC  →  orders + order_items rows created, cart cleared
        │
        ▼
Edge Function: paystack-initialize
   - looks up order, computes amount in kobo
   - calls Paystack POST /transaction/initialize
   - inserts transactions row: status="pending", reference=<paystack ref>
   - returns authorization_url to the client
        │
        ▼
Client redirects browser to authorization_url (Paystack-hosted checkout)
        │
        ▼
Student pays on Paystack's page
        │
        ├──────────────────────────────┐
        ▼                              ▼
Paystack redirects browser      Paystack sends webhook
to your callback_url             (charge.success, etc.)
(UX only — NOT trusted               │
 to confirm payment)                 ▼
        │                    Edge Function: paystack-webhook
        │                       - verifies x-paystack-signature
        │                       - idempotently flips the matching
        │                         transactions row to "completed"/"failed"
        │                       - this is the SOURCE OF TRUTH
        ▼
Order tracking page shows
"Confirming payment…" until
the transaction flips to
completed (poll or realtime)
```

The key principle: **the webhook confirms payment, not the redirect.** The
browser redirect back from Paystack is just navigation — a user can close
the tab, lose connection, or the redirect can be spoofed. Only the
server-to-server webhook (with a verified signature) is trustworthy.

---

## 3. Step-by-step implementation

### 3.1 Schema change: add a reference column

```sql
alter table public.transactions
  add column if not exists reference text unique;

create index if not exists transactions_reference_idx
  on public.transactions (reference);
```

The `reference` is what ties a Paystack transaction back to our row, and
the `unique` constraint is half of your idempotency story (see §4).

### 3.2 Secrets

Store these as Supabase Edge Function secrets (`supabase secrets set`), never
in client-side code or `NEXT_PUBLIC_*` env vars:

- `PAYSTACK_SECRET_KEY` — used both to call the Paystack API and to verify
  webhook signatures.

If you ever need the public key client-side (e.g. for Paystack's inline JS
popup instead of a redirect), that one's safe to expose — but the redirect
flow described here doesn't need it at all, and keeps card data entirely
off our infrastructure.

### 3.3 Edge Function: `paystack-initialize`

Deploy via `mcp__supabase__deploy_edge_function` or the Supabase CLI. Input:
`{ order_id }`. Logic:

1. Auth-check the caller (use the user's JWT, don't accept an arbitrary
   `order_id` from an unauthenticated request).
2. Fetch the order: `select id, total_amount, user_id from orders where id = :order_id`.
   Reject if it doesn't belong to the caller.
3. Fetch the student's email from `profiles`.
4. Generate a unique reference, e.g. `order_${order_id}_${Date.now()}`.
5. Call Paystack:

   ```
   POST https://api.paystack.co/transaction/initialize
   Authorization: Bearer <PAYSTACK_SECRET_KEY>
   Content-Type: application/json

   {
     "email": "<student email>",
     "amount": <total_amount * 100>,   // Paystack expects kobo, not naira
     "reference": "<the reference you generated>",
     "callback_url": "https://yourapp.com/user-dashboard/orders/<order_id>"
   }
   ```

6. On success, Paystack returns `{ authorization_url, access_code, reference }`.
   Insert a `transactions` row: `order_id`, `amount: total_amount`,
   `transaction_type: "payment"`, `status: "pending"`, `reference`.
7. Return `authorization_url` to the client.

Then update `lib/payments/paystack.ts`'s `initiatePayment` to call this Edge
Function instead of inserting a fake-completed row, and have
`checkout.tsx` redirect (`window.location.href = authorization_url`) instead
of immediately navigating to the order page.

### 3.4 Edge Function: `paystack-webhook`

This is a public endpoint (Paystack calls it directly, no user session) —
configure its URL in the Paystack dashboard under Settings → API Keys &
Webhooks.

1. **Verify the signature before doing anything else.** Paystack signs the
   raw request body with your secret key and sends it in the
   `x-paystack-signature` header:

   ```ts
   import { createHmac } from "node:crypto";

   const signature = req.headers.get("x-paystack-signature");
   const computed = createHmac("sha512", PAYSTACK_SECRET_KEY)
     .update(rawBody) // the raw, unparsed request body — not re-serialized JSON
     .digest("hex");

   if (computed !== signature) {
     return new Response("Invalid signature", { status: 401 });
   }
   ```

   Use the **raw** request body for this, not `JSON.stringify(parsedBody)` —
   re-serializing can produce a different byte sequence (key order,
   whitespace) and break the comparison.

2. Parse the event. The one that matters here is `charge.success`. The
   payload includes `data.reference`, `data.status`, `data.amount` (in
   kobo).

3. **Idempotently** update the transaction (see §4 for why the `where
   status = 'pending'` matters):

   ```sql
   update transactions
   set status = 'completed'
   where reference = :reference and status = 'pending';
   ```

4. As an optional extra safety net, call Paystack's **Verify Transaction**
   endpoint (`GET https://api.paystack.co/transaction/verify/:reference`)
   and cross-check the amount/status before trusting the webhook payload
   blindly. Signature verification already protects you, but this guards
   against bugs in your own verification code.

5. **Always return `200 OK` once you've handled the event**, even if it
   turned out to be a duplicate/no-op. Paystack retries undelivered (non-200)
   webhooks for up to 72 hours — returning anything else will cause repeated
   redelivery.

### 3.5 Client-side: the callback page

When Paystack redirects the browser back to `callback_url`, that page
should **not** assume payment succeeded just because the redirect happened.
Show a "Confirming payment…" state and either:

- Poll `transactions.status` for that order every couple of seconds until
  it's `completed` or `failed`, or
- Subscribe to Realtime on the `transactions` table filtered by `order_id`
  (same pattern already used in `screens/student/order-tracking.tsx` for
  the `orders` table).

Only show "Order confirmed" once the transaction is actually `completed`.

---

## 4. Idempotency — why it matters here specifically

Webhooks are **at-least-once delivery**, not exactly-once. Paystack will
redeliver the same event if your endpoint doesn't return `200` fast enough,
and network retries can also cause genuine duplicates to arrive. Two things
make the webhook handler safe to run more than once with the same payload:

1. **The `reference` column is `unique`.** A given Paystack transaction can
   only ever correspond to one `transactions` row. There's no scenario where
   processing the same reference twice creates two rows.
2. **The update is conditional on current state**
   (`where status = 'pending'`). The first time the webhook arrives, it
   flips `pending → completed`. Every subsequent delivery of the same event
   matches zero rows (status is no longer `pending`) and does nothing. You
   never need a separate "have I seen this event before" table — the state
   transition itself is the dedup mechanism.

The one thing this doesn't protect against is processing a *different*
event type that races with itself (e.g. `charge.success` arriving while a
manual "mark as failed" admin action is in flight) — for this app's scope,
that's an acceptable risk, but if it ever matters, make every transition
explicit about its expected starting state the same way (e.g.
`where status = 'pending'` for `failed` too).

---

## 5. Quick reference

| Concern | Where |
|---|---|
| Order creation (atomic, server-priced) | `public.create_order` Postgres function |
| Payment seam to swap | `lib/payments/paystack.ts` → `initiatePayment` |
| Checkout flow that calls it | `screens/student/checkout.tsx` |
| Payment status | `transactions.status` (separate from `orders.status`) |
| Order tracking realtime pattern to copy for payment confirmation | `screens/student/order-tracking.tsx` |
| Paystack Initialize Transaction | `POST https://api.paystack.co/transaction/initialize` |
| Paystack Verify Transaction | `GET https://api.paystack.co/transaction/verify/:reference` |
| Paystack webhook signature header | `x-paystack-signature` (HMAC-SHA512 of raw body, your secret key) |
| Paystack webhook retry window | up to 72 hours if you don't return `200` |

Official docs: [Accept Payments](https://paystack.com/docs/payments/accept-payments/),
[Transaction API](https://paystack.com/docs/api/transaction/),
[Webhooks](https://paystack.com/docs/payments/webhooks/).
