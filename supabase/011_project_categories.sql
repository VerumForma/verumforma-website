-- ============================================================
-- VerumForma — migration 011: múltiplas categorias por projeto
-- Corre no Supabase → SQL Editor. Seguro re-correr.
-- Mantém a coluna 'category' (primeira categoria) por compatibilidade.
-- ============================================================
alter table public.projects add column if not exists categories jsonb not null default '[]'::jsonb;

-- Passa a categoria única existente para o array (só se ainda vazio)
update public.projects
  set categories = jsonb_build_array(category)
  where category is not null and category <> '' and (categories is null or categories = '[]'::jsonb);
