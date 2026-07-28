-- ============================================================
-- VerumForma website — Supabase schema
-- Run this in Supabase → SQL Editor (one shot). Safe to re-run.
-- ============================================================

-- ---------- extensions ----------
create extension if not exists "uuid-ossp";

-- ---------- helper: updated_at ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ============================================================
-- PROFILES (staff accounts + roles)
-- ============================================================
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'staff' check (role in ('admin','staff')),
  created_at timestamptz not null default now()
);

-- auto-create a profile when a new auth user is created
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ============================================================
-- PROJECTS
-- ============================================================
create table if not exists public.projects (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  category    text,
  location    text,
  year        text,
  description text,
  cover_image text,
  images      jsonb not null default '[]'::jsonb,
  featured    boolean not null default false,
  sort_order  int not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
create table if not exists public.team_members (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  role        text,
  bio         text,
  photo       text,
  sort_order  int not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists team_updated_at on public.team_members;
create trigger team_updated_at before update on public.team_members
  for each row execute function public.set_updated_at();

-- ============================================================
-- TESTIMONIALS
-- ============================================================
create table if not exists public.testimonials (
  id           uuid primary key default uuid_generate_v4(),
  quote        text not null,
  author_name  text not null,
  author_role  text,
  project      text,
  sort_order   int not null default 0,
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
drop trigger if exists testimonials_updated_at on public.testimonials;
create trigger testimonials_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ============================================================
-- CONTACT SUBMISSIONS (lead log)
-- ============================================================
create table if not exists public.contact_submissions (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  email        text not null,
  project_type text,
  message      text,
  locale       text,
  status       text not null default 'new' check (status in ('new','read','handled','archived')),
  created_at   timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles            enable row level security;
alter table public.projects            enable row level security;
alter table public.team_members        enable row level security;
alter table public.testimonials        enable row level security;
alter table public.contact_submissions enable row level security;

-- PROFILES: read own; admins read/manage all
drop policy if exists profiles_read_own on public.profiles;
create policy profiles_read_own on public.profiles
  for select using (auth.uid() = id or public.is_admin());
drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- PROJECTS: anyone reads published; signed-in staff read all + write
drop policy if exists projects_public_read on public.projects;
create policy projects_public_read on public.projects
  for select using (published = true or auth.role() = 'authenticated');
drop policy if exists projects_staff_write on public.projects;
create policy projects_staff_write on public.projects
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- TEAM
drop policy if exists team_public_read on public.team_members;
create policy team_public_read on public.team_members
  for select using (published = true or auth.role() = 'authenticated');
drop policy if exists team_staff_write on public.team_members;
create policy team_staff_write on public.team_members
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- TESTIMONIALS
drop policy if exists testimonials_public_read on public.testimonials;
create policy testimonials_public_read on public.testimonials
  for select using (published = true or auth.role() = 'authenticated');
drop policy if exists testimonials_staff_write on public.testimonials;
create policy testimonials_staff_write on public.testimonials
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- CONTACT SUBMISSIONS: anyone (anon) can INSERT; only staff can read/update
drop policy if exists contact_public_insert on public.contact_submissions;
create policy contact_public_insert on public.contact_submissions
  for insert with check (true);
drop policy if exists contact_staff_read on public.contact_submissions;
create policy contact_staff_read on public.contact_submissions
  for select using (auth.role() = 'authenticated');
drop policy if exists contact_staff_update on public.contact_submissions;
create policy contact_staff_update on public.contact_submissions
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE (images bucket: public read, staff write)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select using (bucket_id = 'media');
drop policy if exists media_staff_write on storage.objects;
create policy media_staff_write on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
drop policy if exists media_staff_update on storage.objects;
create policy media_staff_update on storage.objects
  for update using (bucket_id = 'media' and auth.role() = 'authenticated');
drop policy if exists media_staff_delete on storage.objects;
create policy media_staff_delete on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

-- ============================================================
-- DONE. Next steps (Supabase dashboard):
--  1. Authentication → Users → Add user (your email + password). That row
--     auto-creates a profile with role 'staff'.
--  2. To make yourself admin, run:
--       update public.profiles set role = 'admin' where email = 'you@verumforma.pt';
--  3. Add staff the same way (they default to role 'staff').
-- ============================================================
