-- ============================================================
-- VerumForma — migration 010: formato da imagem no carrossel social
-- Corre no Supabase → SQL Editor. Seguro re-correr.
-- Valores: 'square' | 'landscape' | 'portrait' (null = pelo padrão da plataforma)
-- ============================================================
alter table public.social_media add column if not exists aspect_ratio text;
