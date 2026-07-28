-- ============================================================
-- VerumForma — limpar dados de teste antes do lançamento.
-- Corre no Supabase → SQL Editor.
-- NÃO apaga utilizadores nem perfis — o teu login de admin mantém-se.
-- Depois disto, o site volta a mostrar os placeholders até adicionares
-- conteúdo real; à medida que publicas, os placeholders desaparecem.
-- ============================================================

delete from public.site_content;         -- textos editados (volta aos defaults)
delete from public.contact_submissions;  -- pedidos de contacto de teste
delete from public.testimonials;
delete from public.projects;
delete from public.team_members;
delete from public.categories;

-- Nota: as imagens de teste ficam no bucket "media" (Storage).
-- Podes apagá-las manualmente em Supabase → Storage → media, se quiseres.
