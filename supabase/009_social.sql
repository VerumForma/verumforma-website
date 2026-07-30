-- ============================================================
-- VerumForma — migration 009: redes sociais (feed/carrossel)
-- Corre no Supabase → SQL Editor. Seguro re-correr.
-- Os links de perfil (Instagram/Facebook/etc.) guardam-se em
-- site_content (section='social_links') — não precisa de nova tabela.
-- ============================================================

create table if not exists public.social_media (
  id            uuid primary key default uuid_generate_v4(),
  platform      text not null check (platform in ('instagram','youtube')),
  title         text,
  thumbnail_url text,
  link          text,
  sort_order    int not null default 0,
  published     boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table public.social_media enable row level security;

drop policy if exists social_public_read on public.social_media;
create policy social_public_read on public.social_media
  for select using (published = true or auth.role() = 'authenticated');
drop policy if exists social_staff_write on public.social_media;
create policy social_staff_write on public.social_media
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
