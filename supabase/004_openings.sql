-- ============================================================
-- VerumForma — migration 004: oportunidades de trabalho (openings)
-- Corre no Supabase → SQL Editor. Seguro re-correr.
-- ============================================================

create table if not exists public.openings (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  location        text,
  department      text,
  employment_type text,
  description     text,
  requirements    jsonb not null default '[]'::jsonb,
  deadline        date,
  apply_email     text,
  sort_order      int not null default 0,
  published       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists openings_updated_at on public.openings;
create trigger openings_updated_at before update on public.openings
  for each row execute function public.set_updated_at();

alter table public.openings enable row level security;

drop policy if exists openings_public_read on public.openings;
create policy openings_public_read on public.openings
  for select using (published = true or auth.role() = 'authenticated');

drop policy if exists openings_staff_write on public.openings;
create policy openings_staff_write on public.openings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
