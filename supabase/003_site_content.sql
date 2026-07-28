-- ============================================================
-- VerumForma — migration 003: editable site copy
-- One JSON blob per (section, locale). Public reads; staff writes.
-- Run in Supabase → SQL Editor. Safe to re-run.
-- ============================================================

create table if not exists public.site_content (
  id         uuid primary key default uuid_generate_v4(),
  section    text not null,
  locale     text not null,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (section, locale)
);

drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at before update on public.site_content
  for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

drop policy if exists site_content_public_read on public.site_content;
create policy site_content_public_read on public.site_content
  for select using (true);

drop policy if exists site_content_staff_write on public.site_content;
create policy site_content_staff_write on public.site_content
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
