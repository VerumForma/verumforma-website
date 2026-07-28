-- ============================================================
-- VerumForma — migration 002: project categories
-- Run in Supabase → SQL Editor. Safe to re-run.
-- ============================================================

create table if not exists public.categories (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

-- Anyone can read categories (used by the public projects filter);
-- only signed-in staff can create/edit/delete.
drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
  for select using (true);

drop policy if exists categories_staff_write on public.categories;
create policy categories_staff_write on public.categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
