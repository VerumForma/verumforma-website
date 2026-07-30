-- ============================================================
-- VerumForma — limpeza pré-lançamento
-- MANTÉM: oportunidades (openings), candidaturas, contactos, utilizadores.
-- APAGA: conteúdo de teste que a Ana vai criar de raiz.
-- Corre no Supabase → SQL Editor. Revê antes: se já tiveres algum
-- projeto/equipa/testemunho REAL que queiras manter, comenta essa linha.
-- ============================================================

delete from public.social_media;      -- placeholders do carrossel
delete from public.testimonials;      -- testemunhos de teste
delete from public.projects;          -- projetos de teste
delete from public.team_members;      -- equipa de teste
delete from public.categories;        -- categorias de teste
delete from public.site_content;      -- textos editados de teste + links sociais de exemplo

-- (openings, job_applications, contact_submissions e profiles ficam intactos)
