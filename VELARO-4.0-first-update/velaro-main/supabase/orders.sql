create sequence if not exists public.velaro_order_number_seq start 1;
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default ('VLR-' || lpad(nextval('public.velaro_order_number_seq')::text, 6, '0')),
  customer_name text not null,
  customer_phone text not null,
  delivery_method text not null,
  delivery_city text,
  delivery_branch text,
  comment text,
  items jsonb not null default '[]'::jsonb,
  total numeric(12,2) not null default 0,
  status text not null default 'new' check (status in ('new','processing','sent','completed','cancelled')),
  is_new boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;
-- Доступ до таблиці виконується тільки серверним ключем service_role через /api.
