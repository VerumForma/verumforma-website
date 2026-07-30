-- ============================================================
-- VerumForma — placeholders de redes sociais (para pré-visualizar)
-- Correr UMA vez, DEPOIS de 009_social.sql. Apaga estes itens no admin
-- quando tiveres conteúdo real. Sem thumbnail, aparecem como cinzento.
-- ============================================================

insert into public.social_media (platform, title, link, sort_order, published) values
('instagram', 'Post exemplo 1', '#', 1, true),
('youtube',   'Vídeo exemplo 1', '#', 2, true),
('instagram', 'Post exemplo 2', '#', 3, true),
('youtube',   'Vídeo exemplo 2', '#', 4, true),
('instagram', 'Post exemplo 3', '#', 5, true),
('youtube',   'Vídeo exemplo 3', '#', 6, true),
('instagram', 'Post exemplo 4', '#', 7, true),
('youtube',   'Vídeo exemplo 4', '#', 8, true),
('instagram', 'Post exemplo 5', '#', 9, true),
('youtube',   'Vídeo exemplo 5', '#', 10, true),
('instagram', 'Post exemplo 6', '#', 11, true),
('youtube',   'Vídeo exemplo 6', '#', 12, true);

-- Links de perfil de EXEMPLO (edita no admin → Redes sociais)
insert into public.site_content (section, locale, data)
values ('social_links', 'pt', '{"instagram":"https://instagram.com/verumforma","facebook":"https://facebook.com/verumforma","youtube":"https://youtube.com/@verumforma","linkedin":"https://linkedin.com/company/verumforma","email":"geral@verumforma.pt"}'::jsonb)
on conflict (section, locale) do update set data = excluded.data;
