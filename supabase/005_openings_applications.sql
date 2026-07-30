-- ============================================================
-- VerumForma — migration 005: modalidade + candidaturas
-- Corre no Supabase → SQL Editor. Seguro re-correr.
-- ============================================================

-- Modalidade de trabalho (Presencial / Híbrido / Remoto)
alter table public.openings add column if not exists work_mode text;

-- Candidaturas (um único formulário para todas as vagas)
create table if not exists public.job_applications (
  id            uuid primary key default uuid_generate_v4(),
  opening_id    uuid references public.openings(id) on delete set null,
  opening_title text,                      -- snapshot: sobrevive se a vaga for apagada
  name          text not null,
  email         text not null,
  phone         text,
  message       text,
  cv_url        text,
  locale        text,
  status        text not null default 'new' check (status in ('new','read','handled','archived')),
  created_at    timestamptz not null default now()
);

alter table public.job_applications enable row level security;

-- Qualquer pessoa (anon) pode candidatar-se; só staff lê/atualiza.
drop policy if exists applications_public_insert on public.job_applications;
create policy applications_public_insert on public.job_applications
  for insert with check (true);
drop policy if exists applications_staff_read on public.job_applications;
create policy applications_staff_read on public.job_applications
  for select using (auth.role() = 'authenticated');
drop policy if exists applications_staff_update on public.job_applications;
create policy applications_staff_update on public.job_applications
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
