begin;

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  short_name text not null,
  slug text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint schools_name_not_blank check (length(btrim(name)) > 0),
  constraint schools_short_name_not_blank check (length(btrim(short_name)) > 0),
  constraint schools_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

alter table public.schools enable row level security;

insert into public.schools (name, short_name, slug)
values
  ('University of Lagos (UNILAG)', 'UNILAG', 'unilag'),
  ('University of Ibadan (UI)', 'UI', 'ui'),
  ('Obafemi Awolowo University (OAU)', 'OAU', 'oau'),
  ('University of Nigeria, Nsukka (UNN)', 'UNN', 'unn'),
  ('Covenant University', 'Covenant', 'covenant-university'),
  ('Babcock University', 'Babcock', 'babcock-university'),
  ('Lagos State University (LASU)', 'LASU', 'lasu'),
  ('Federal University of Technology, Akure (FUTA)', 'FUTA', 'futa')
on conflict (slug) do update
set name = excluded.name,
    short_name = excluded.short_name;

alter table public.profiles add column if not exists school_id uuid;
alter table public.orders add column if not exists school_id uuid;

update public.profiles p
set school_id = s.id
from public.schools s
where p.school_id is null
  and lower(btrim(p.school)) = lower(btrim(s.name));

update public.orders o
set school_id = p.school_id
from public.vendors v
join public.profiles p on p.id = v.user_id
where o.vendor_id = v.id
  and o.school_id is null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_school_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_school_id_fkey
      foreign key (school_id) references public.schools(id);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_school_id_fkey'
  ) then
    alter table public.orders
      add constraint orders_school_id_fkey
      foreign key (school_id) references public.schools(id);
  end if;
end;
$$;

alter table public.orders alter column school_id set not null;

create index if not exists profiles_school_id_idx on public.profiles (school_id);
create index if not exists vendors_user_id_idx on public.vendors (user_id);
create index if not exists delivery_agents_user_id_idx on public.delivery_agents (user_id);
create index if not exists menu_items_vendor_id_idx on public.menu_items (vendor_id);
create index if not exists carts_user_id_idx on public.carts (user_id);
create index if not exists carts_menu_item_id_idx on public.carts (menu_item_id);
create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_vendor_id_idx on public.orders (vendor_id);
create index if not exists orders_delivery_agent_id_idx on public.orders (delivery_agent_id);
create index if not exists orders_school_status_available_idx
  on public.orders (school_id, status)
  where delivery_agent_id is null;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.current_school_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.school_id
  from public.profiles p
  where p.id = (select auth.uid());
$$;

create or replace function private.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = (select auth.uid());
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'ADMIN'
  );
$$;

create or replace function private.vendor_school_id(p_vendor_id uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.school_id
  from public.vendors v
  join public.profiles p on p.id = v.user_id
  where v.id = p_vendor_id;
$$;

create or replace function private.menu_item_school_id(p_menu_item_id uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select p.school_id
  from public.menu_items mi
  join public.vendors v on v.id = mi.vendor_id
  join public.profiles p on p.id = v.user_id
  where mi.id = p_menu_item_id;
$$;

revoke all on all functions in schema private from public;
grant execute on function private.current_school_id() to authenticated;
grant execute on function private.current_role() to authenticated;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.vendor_school_id(uuid) to authenticated;
grant execute on function private.menu_item_school_id(uuid) to authenticated;

drop policy if exists schools_select_active on public.schools;
drop policy if exists schools_select_assigned on public.schools;
drop policy if exists schools_select_admin on public.schools;
drop policy if exists schools_select_authenticated on public.schools;
drop policy if exists schools_insert_admin on public.schools;
drop policy if exists schools_update_admin on public.schools;
drop policy if exists schools_delete_admin on public.schools;

create policy schools_select_active
on public.schools for select
to anon
using (active);

create policy schools_select_authenticated
on public.schools for select
to authenticated
using (
  active
  or id = (select private.current_school_id())
  or (select private.is_admin())
);

create policy schools_insert_admin
on public.schools for insert
to authenticated
with check ((select private.is_admin()));

create policy schools_update_admin
on public.schools for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy schools_delete_admin
on public.schools for delete
to authenticated
using ((select private.is_admin()));

revoke all on public.schools from anon, authenticated;
grant select on public.schools to anon, authenticated;
grant insert, update, delete on public.schools to authenticated;

create or replace function private.protect_profile_authorization_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_school_name text;
begin
  if new.role is distinct from old.role and not private.is_admin() then
    raise exception 'Profile role cannot be changed';
  end if;

  if new.school_id is distinct from old.school_id then
    if not private.is_admin()
       and not (old.school_id is null and new.id = (select auth.uid())) then
      raise exception 'School changes require administrator approval';
    end if;

    if new.school_id is not null then
      select s.name into v_school_name
      from public.schools s
      where s.id = new.school_id and s.active;

      if v_school_name is null then
        raise exception 'School is invalid or inactive';
      end if;
      new.school := v_school_name;
    else
      new.school := null;
    end if;
  elsif new.school is distinct from old.school then
    raise exception 'School must be changed using school_id';
  end if;

  return new;
end;
$$;

drop trigger if exists protect_profile_authorization_fields on public.profiles;
create trigger protect_profile_authorization_fields
before update on public.profiles
for each row execute function private.protect_profile_authorization_fields();

create or replace function private.protect_order_school_assignment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_agent_id uuid;
  v_agent_school_id uuid;
begin
  if new.user_id is distinct from old.user_id
     or new.vendor_id is distinct from old.vendor_id
     or new.school_id is distinct from old.school_id then
    raise exception 'Order parties and school cannot be changed';
  end if;

  if new.delivery_agent_id is distinct from old.delivery_agent_id
     and not private.is_admin() then
    select da.id, p.school_id
    into v_agent_id, v_agent_school_id
    from public.delivery_agents da
    join public.profiles p on p.id = da.user_id
    where da.user_id = (select auth.uid())
      and da.verification_status = 'verified';

    if old.delivery_agent_id is not null
       or new.delivery_agent_id is distinct from v_agent_id
       or new.school_id is distinct from v_agent_school_id
       or old.status is distinct from 'ready' then
      raise exception 'Delivery agent assignment is not allowed';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists protect_order_school_assignment on public.orders;
create trigger protect_order_school_assignment
before update on public.orders
for each row execute function private.protect_order_school_assignment();

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles for insert
to authenticated
with check (
  id = (select auth.uid())
  and role = 'USER'
);

drop policy if exists vendors_select_public on public.vendors;
drop policy if exists vendors_select_same_school on public.vendors;
create policy vendors_select_same_school
on public.vendors for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select private.is_admin())
  or (
    (select private.current_school_id()) is not null
    and (select private.vendor_school_id(id)) = (select private.current_school_id())
  )
);

drop policy if exists menu_items_select_public on public.menu_items;
drop policy if exists menu_items_select_same_school on public.menu_items;
create policy menu_items_select_same_school
on public.menu_items for select
to authenticated
using (
  vendor_id = (select public.current_vendor_id())
  or (select private.is_admin())
  or (
    (select private.current_school_id()) is not null
    and (select private.vendor_school_id(vendor_id)) = (select private.current_school_id())
  )
);

drop policy if exists carts_all_own_or_admin on public.carts;
drop policy if exists carts_all_own_same_school_or_admin on public.carts;
create policy carts_all_own_same_school_or_admin
on public.carts for all
to authenticated
using (
  (select private.is_admin())
  or (
    user_id = (select auth.uid())
    and (select private.current_school_id()) is not null
    and (select private.menu_item_school_id(menu_item_id)) = (select private.current_school_id())
  )
)
with check (
  (select private.is_admin())
  or (
    user_id = (select auth.uid())
    and (select private.current_school_id()) is not null
    and (select private.menu_item_school_id(menu_item_id)) = (select private.current_school_id())
  )
);

drop policy if exists orders_select_available_for_agents on public.orders;
create policy orders_select_available_for_agents
on public.orders for select
to authenticated
using (
  status = 'ready'
  and delivery_agent_id is null
  and school_id = (select private.current_school_id())
  and (select public.is_verified_agent())
);

drop policy if exists orders_update_related_or_admin on public.orders;
create policy orders_update_related_or_admin
on public.orders for update
to authenticated
using (
  vendor_id = (select public.current_vendor_id())
  or delivery_agent_id = (select public.current_agent_id())
  or (select private.is_admin())
)
with check (
  vendor_id = (select public.current_vendor_id())
  or delivery_agent_id = (select public.current_agent_id())
  or (select private.is_admin())
);

drop policy if exists orders_insert_own_or_admin on public.orders;
drop policy if exists order_items_insert_own_order_or_admin on public.order_items;
revoke insert on public.orders from anon, authenticated;
revoke insert on public.order_items from anon, authenticated;

create or replace function private.create_order_internal(
  p_vendor_id uuid,
  p_hostel text,
  p_landmark text,
  p_items jsonb
)
returns table(id uuid, total_amount numeric)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_user_school_id uuid;
  v_vendor_school_id uuid;
  v_order_id uuid;
  v_delivery_fee numeric;
  v_subtotal numeric := 0;
  v_item record;
  v_price numeric;
  v_item_vendor uuid;
  v_available boolean;
  v_pin text;
  v_total numeric;
  v_hostel text := btrim(coalesce(p_hostel, ''));
  v_landmark text := nullif(btrim(coalesce(p_landmark, '')), '');
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select p.school_id into v_user_school_id
  from public.profiles p
  where p.id = v_user_id and p.role = 'USER';

  if v_user_school_id is null then
    raise exception 'Select your school before placing an order';
  end if;

  select v.delivery_fee, vp.school_id
  into v_delivery_fee, v_vendor_school_id
  from public.vendors v
  join public.profiles vp on vp.id = v.user_id
  where v.id = p_vendor_id;

  if v_vendor_school_id is null then
    raise exception 'Vendor not found';
  end if;
  if v_vendor_school_id is distinct from v_user_school_id then
    raise exception 'You can only order from vendors in your school';
  end if;
  if length(v_hostel) < 2 or length(v_hostel) > 160 then
    raise exception 'Enter a valid delivery location';
  end if;
  if v_landmark is not null and length(v_landmark) > 240 then
    raise exception 'Landmark is too long';
  end if;
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  v_pin := lpad((floor(random() * 10000))::int::text, 4, '0');

  insert into public.orders (
    user_id, vendor_id, school_id, hostel, landmark,
    delivery_fee, total_amount, delivery_pin, status
  )
  values (
    v_user_id, p_vendor_id, v_vendor_school_id, v_hostel, v_landmark,
    v_delivery_fee, 0, v_pin, 'pending'
  )
  returning orders.id into v_order_id;

  for v_item in
    select * from jsonb_to_recordset(p_items) as x(menu_item_id uuid, quantity int)
  loop
    select mi.price, mi.vendor_id, mi.available
    into v_price, v_item_vendor, v_available
    from public.menu_items mi
    where mi.id = v_item.menu_item_id;

    if v_price is null then
      raise exception 'Menu item not found: %', v_item.menu_item_id;
    end if;
    if v_item_vendor is distinct from p_vendor_id then
      raise exception 'Item % does not belong to this vendor', v_item.menu_item_id;
    end if;
    if not coalesce(v_available, false) then
      raise exception 'Menu item is unavailable: %', v_item.menu_item_id;
    end if;
    if v_item.quantity is null or v_item.quantity < 1 or v_item.quantity > 50 then
      raise exception 'Invalid quantity for item %', v_item.menu_item_id;
    end if;

    insert into public.order_items (order_id, menu_item_id, quantity, unit_price)
    values (v_order_id, v_item.menu_item_id, v_item.quantity, v_price);

    v_subtotal := v_subtotal + (v_price * v_item.quantity);
  end loop;

  if v_subtotal <= 0 then
    raise exception 'Order must contain at least one item';
  end if;

  v_total := v_subtotal + coalesce(v_delivery_fee, 0) + 150 + 100;

  update public.orders
  set total_amount = v_total
  where orders.id = v_order_id;

  delete from public.carts where user_id = v_user_id;

  return query select v_order_id, v_total;
end;
$$;

create or replace function public.create_order(
  p_vendor_id uuid,
  p_hostel text,
  p_landmark text,
  p_items jsonb
)
returns table(id uuid, total_amount numeric)
language sql
security invoker
set search_path = ''
as $$
  select *
  from private.create_order_internal(p_vendor_id, p_hostel, p_landmark, p_items);
$$;

create or replace function private.claim_order_internal(p_order_id uuid)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_agent_id uuid;
  v_agent_school_id uuid;
  v_verification text;
  v_order public.orders;
begin
  select da.id, da.verification_status, p.school_id
  into v_agent_id, v_verification, v_agent_school_id
  from public.delivery_agents da
  join public.profiles p on p.id = da.user_id
  where da.user_id = (select auth.uid());

  if v_agent_id is null then
    raise exception 'No delivery agent profile found for this account';
  end if;
  if v_verification is distinct from 'verified' then
    raise exception 'Your agent account is pending verification';
  end if;
  if v_agent_school_id is null then
    raise exception 'Your delivery agent account has no school assigned';
  end if;

  update public.orders
  set delivery_agent_id = v_agent_id,
      delivery_stage = 'assigned'
  where id = p_order_id
    and delivery_agent_id is null
    and status = 'ready'
    and school_id = v_agent_school_id
  returning * into v_order;

  if v_order.id is null then
    raise exception 'Order is no longer available in your school';
  end if;

  return v_order;
end;
$$;

create or replace function public.claim_order(p_order_id uuid)
returns public.orders
language sql
security invoker
set search_path = ''
as $$
  select private.claim_order_internal(p_order_id);
$$;

revoke all on function private.create_order_internal(uuid, text, text, jsonb) from public;
revoke all on function private.claim_order_internal(uuid) from public;
grant execute on function private.create_order_internal(uuid, text, text, jsonb) to authenticated;
grant execute on function private.claim_order_internal(uuid) to authenticated;

revoke all on function public.create_order(uuid, text, text, jsonb) from public;
revoke all on function public.claim_order(uuid) from public;
grant execute on function public.create_order(uuid, text, text, jsonb) to authenticated;
grant execute on function public.claim_order(uuid) to authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_role public.user_role;
  v_school_id uuid;
  v_school_name text;
begin
  new_role := case upper(coalesce(new.raw_user_meta_data->>'role', ''))
    when 'VENDOR' then 'VENDOR'::public.user_role
    when 'DELIVERY_AGENT' then 'DELIVERY_AGENT'::public.user_role
    else 'USER'::public.user_role
  end;

  begin
    v_school_id := nullif(new.raw_user_meta_data->>'school_id', '')::uuid;
  exception when invalid_text_representation then
    v_school_id := null;
  end;

  if v_school_id is not null then
    select s.name into v_school_name
    from public.schools s
    where s.id = v_school_id and s.active;

    if v_school_name is null then
      v_school_id := null;
    end if;
  end if;

  insert into public.profiles (
    id, role, full_name, email, phone_number,
    school_id, school, hostel
  )
  values (
    new.id,
    new_role,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'phone_number',
    v_school_id,
    v_school_name,
    nullif(btrim(new.raw_user_meta_data->>'hostel'), '')
  );

  if new_role = 'VENDOR' then
    insert into public.vendors (user_id, business_name, address, cac_number)
    values (
      new.id,
      new.raw_user_meta_data->>'business_name',
      new.raw_user_meta_data->>'address',
      new.raw_user_meta_data->>'cac_number'
    );
  elsif new_role = 'DELIVERY_AGENT' then
    insert into public.delivery_agents (user_id, matric_number, hostel)
    values (
      new.id,
      new.raw_user_meta_data->>'matric_number',
      nullif(btrim(new.raw_user_meta_data->>'hostel'), '')
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

drop function if exists public.handle_new_user();
revoke all on function private.handle_new_user() from public, anon, authenticated;
revoke all on function private.protect_profile_authorization_fields() from public, anon, authenticated;
revoke all on function private.protect_order_school_assignment() from public, anon, authenticated;

commit;
