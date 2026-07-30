-- ============================================================
-- VerumForma — atualização completa das oportunidades (005+006+007)
-- Idempotente (seguro correr as vezes que quiseres).
-- Corre ISTO primeiro; depois corre 008_seed_openings.sql.
-- ============================================================

-- (005) modalidade + tabela de candidaturas -----------------
alter table public.openings add column if not exists work_mode text;

create table if not exists public.job_applications (
  id            uuid primary key default uuid_generate_v4(),
  opening_id    uuid references public.openings(id) on delete set null,
  opening_title text,
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
drop policy if exists applications_public_insert on public.job_applications;
create policy applications_public_insert on public.job_applications for insert with check (true);
drop policy if exists applications_staff_read on public.job_applications;
create policy applications_staff_read on public.job_applications for select using (auth.role() = 'authenticated');
drop policy if exists applications_staff_update on public.job_applications;
create policy applications_staff_update on public.job_applications for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- (006) requisitos estruturados -----------------------------
alter table public.openings add column if not exists requirement_specs jsonb not null default '{}'::jsonb;

-- (007) salário ---------------------------------------------
alter table public.openings add column if not exists salary_min int;
alter table public.openings add column if not exists salary_max int;
alter table public.openings add column if not exists salary_currency text default 'EUR';
alter table public.openings add column if not exists salary_period text default 'month';
