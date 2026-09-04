-- VELARO 5.1 — додаткові поля для адмінки
-- Supabase → SQL Editor → New query → вставити весь код → Run

alter table public.products
  add column if not exists color text;

alter table public.products
  add column if not exists sort_order bigint;

update public.products
set sort_order = id
where sort_order is null or sort_order = 0;

alter table public.products
  alter column sort_order set default 0;

-- Перевірка
select id, name, color, sort_order
from public.products
order by sort_order, id
limit 20;
