-- VELARO 5.0 — виправлення автонумерації products.id
-- Запустіть у Supabase: SQL Editor -> New query -> Run

DO $$
DECLARE
  seq_name text;
  max_id bigint;
BEGIN
  -- Якщо для id ще немає sequence/default, створюємо його.
  seq_name := pg_get_serial_sequence('public.products', 'id');

  IF seq_name IS NULL THEN
    CREATE SEQUENCE IF NOT EXISTS public.products_id_seq;
    ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;
    ALTER TABLE public.products
      ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq');
    seq_name := 'public.products_id_seq';
  END IF;

  SELECT COALESCE(MAX(id), 0) INTO max_id FROM public.products;

  -- Наступний INSERT без id отримає max(id)+1 і не зіткнеться з duplicate key.
  PERFORM setval(seq_name::regclass, max_id + 1, false);
END $$;

-- Перевірка: показує поточний максимум і sequence.
SELECT
  (SELECT COALESCE(MAX(id), 0) FROM public.products) AS current_max_id,
  pg_get_serial_sequence('public.products', 'id') AS id_sequence;
