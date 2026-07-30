-- ============================================================
-- VerumForma — migration 006: requisitos reutilizáveis (structured)
-- Corre no Supabase → SQL Editor. Seguro re-correr.
-- ============================================================
alter table public.openings add column if not exists requirement_specs jsonb not null default '{}'::jsonb;
