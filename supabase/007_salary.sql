-- ============================================================
-- VerumForma — migration 007: salário nas oportunidades
-- Corre no Supabase → SQL Editor. Seguro re-correr.
-- ============================================================
alter table public.openings add column if not exists salary_min int;
alter table public.openings add column if not exists salary_max int;
alter table public.openings add column if not exists salary_currency text default 'EUR';
alter table public.openings add column if not exists salary_period text default 'month';
