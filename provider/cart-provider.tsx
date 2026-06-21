"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { SERVICE_CHARGE, PLATFORM_FEE } from "@/helpers/student.helpers";

/** Minimum shape needed to add a menu item to the cart. */
export interface CartLineInput {
  id: string;
  name: string;
  price: number;
  vendorId: string;
  vendorName: string;
  imageUrl?: string | null;
}

export interface CartMenuItem extends CartLineInput {
  imageUrl: string | null;
  deliveryFee: number;
}

export interface CartItem {
  /** carts row id */
  id: string;
  menuItem: CartMenuItem;
  qty: number;
}

export interface AddResult {
  ok: boolean;
  /** True when the cart already holds items from a different vendor. */
  conflict?: boolean;
  error?: string;
}

interface CartContextValue {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  count: number;
  subtotal: number;
  deliveryFee: number;
  serviceCharge: number;
  platformFee: number;
  total: number;
  add: (
    item: CartLineInput,
    qty?: number,
    opts?: { replaceVendor?: boolean },
  ) => Promise<AddResult>;
  remove: (menuItemId: string) => Promise<void>;
  setQty: (menuItemId: string, qty: number) => Promise<void>;
  clear: () => Promise<void>;
}

interface CartRow {
  id: string;
  quantity: number | null;
  menu_items: {
    id: string;
    name: string | null;
    price: number | null;
    image_url: string | null;
    vendor_id: string | null;
    vendors: { business_name: string | null; delivery_fee: number | null } | null;
  } | null;
}

function toCartItem(row: CartRow): CartItem | null {
  const mi = row.menu_items;
  if (!mi) return null;
  return {
    id: row.id,
    qty: row.quantity ?? 1,
    menuItem: {
      id: mi.id,
      name: mi.name ?? "",
      price: Number(mi.price ?? 0),
      vendorId: mi.vendor_id ?? "",
      vendorName: mi.vendors?.business_name ?? "Vendor",
      imageUrl: mi.image_url,
      deliveryFee: Number(mi.vendors?.delivery_fee ?? 0),
    },
  };
}

const CartContext = React.createContext<CartContextValue | null>(null);
const CART_SELECT =
  "id, quantity, menu_items(id, name, price, image_url, vendor_id, vendors(business_name, delivery_fee))";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const userIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!active) return;
      if (!userData.user) {
        setLoading(false);
        return;
      }
      userIdRef.current = userData.user.id;

      const { data, error: fetchError } = await supabase
        .from("carts")
        .select(CART_SELECT)
        .eq("user_id", userData.user.id);

      if (!active) return;
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setItems(((data ?? []) as unknown as CartRow[]).map(toCartItem).filter((i): i is CartItem => i !== null));
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const clear = React.useCallback(async () => {
    const userId = userIdRef.current;
    if (!userId) return;
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("carts").delete().eq("user_id", userId);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setItems([]);
  }, []);

  const add = React.useCallback(
    async (
      item: CartLineInput,
      qty = 1,
      opts?: { replaceVendor?: boolean },
    ): Promise<AddResult> => {
      const userId = userIdRef.current;
      if (!userId) return { ok: false, error: "You must be signed in to order." };

      const existingVendor = items[0]?.menuItem.vendorId;
      if (existingVendor && existingVendor !== item.vendorId) {
        if (!opts?.replaceVendor) return { ok: false, conflict: true };
        await clear();
      }

      const supabase = createClient();
      const currentItems = opts?.replaceVendor ? [] : items;
      const existingRow = currentItems.find((i) => i.menuItem.id === item.id);

      if (existingRow) {
        const nextQty = existingRow.qty + qty;
        const { error: updateError } = await supabase
          .from("carts")
          .update({ quantity: nextQty })
          .eq("id", existingRow.id);
        if (updateError) return { ok: false, error: updateError.message };
        setItems((prev) =>
          prev.map((i) => (i.id === existingRow.id ? { ...i, qty: nextQty } : i)),
        );
        return { ok: true };
      }

      const { data, error: insertError } = await supabase
        .from("carts")
        .insert({ user_id: userId, menu_item_id: item.id, quantity: qty })
        .select(CART_SELECT)
        .single();

      if (insertError || !data) {
        return { ok: false, error: insertError?.message ?? "Could not add item to cart." };
      }

      const newItem = toCartItem(data as unknown as CartRow);
      if (newItem) setItems((prev) => [...prev, newItem]);
      return { ok: true };
    },
    [items, clear],
  );

  const setQty = React.useCallback(
    async (menuItemId: string, qty: number) => {
      const row = items.find((i) => i.menuItem.id === menuItemId);
      if (!row) return;
      const supabase = createClient();

      if (qty <= 0) {
        const { error: deleteError } = await supabase.from("carts").delete().eq("id", row.id);
        if (deleteError) {
          setError(deleteError.message);
          return;
        }
        setItems((prev) => prev.filter((i) => i.id !== row.id));
        return;
      }

      const { error: updateError } = await supabase
        .from("carts")
        .update({ quantity: qty })
        .eq("id", row.id);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setItems((prev) => prev.map((i) => (i.id === row.id ? { ...i, qty } : i)));
    },
    [items],
  );

  const remove = React.useCallback(
    async (menuItemId: string) => {
      const row = items.find((i) => i.menuItem.id === menuItemId);
      if (!row) return;
      const supabase = createClient();
      const { error: deleteError } = await supabase.from("carts").delete().eq("id", row.id);
      if (deleteError) {
        setError(deleteError.message);
        return;
      }
      setItems((prev) => prev.filter((i) => i.id !== row.id));
    },
    [items],
  );

  const value = React.useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, i) => sum + i.menuItem.price * i.qty, 0);
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const deliveryFee = items[0]?.menuItem.deliveryFee ?? 0;
    const serviceCharge = items.length ? SERVICE_CHARGE : 0;
    const platformFee = items.length ? PLATFORM_FEE : 0;
    return {
      items,
      loading,
      error,
      count,
      subtotal,
      deliveryFee,
      serviceCharge,
      platformFee,
      total: subtotal + deliveryFee + serviceCharge + platformFee,
      add,
      remove,
      setQty,
      clear,
    };
  }, [items, loading, error, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
