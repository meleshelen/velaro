-- VELARO: структура та захист таблиці products.
-- Запустіть цей файл у Supabase: SQL Editor -> New query -> Run.

create table if not exists public.products (
  id bigint primary key,
  name text not null,
  article text,
  category text not null,
  type text not null,
  price numeric not null default 0,
  old_price numeric,
  image text,
  description text,
  badge text,
  sizes text,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Видалення старих політик з такими назвами, щоб скрипт можна було запускати повторно.
drop policy if exists "Public can read products" on public.products;
drop policy if exists "Authenticated admin can insert products" on public.products;
drop policy if exists "Authenticated admin can update products" on public.products;
drop policy if exists "Authenticated admin can delete products" on public.products;

-- Каталог доступний усім покупцям.
create policy "Public can read products"
on public.products for select
to anon, authenticated
using (true);

-- Змінювати товари можуть лише користувачі, які увійшли через Supabase Auth.
create policy "Authenticated admin can insert products"
on public.products for insert
to authenticated
with check (true);

create policy "Authenticated admin can update products"
on public.products for update
to authenticated
using (true)
with check (true);

create policy "Authenticated admin can delete products"
on public.products for delete
to authenticated
using (true);
