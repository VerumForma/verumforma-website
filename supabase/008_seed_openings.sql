-- ============================================================
-- VerumForma — seed das oportunidades (rascunho para revisão)
-- Correr UMA vez no Supabase → SQL Editor.
-- Ficam como RASCUNHO (published=false) — revê no admin (incl. salários
-- sugeridos) e publica quando quiseres. Salários = sugestão de mercado.
-- ============================================================

insert into public.openings
  (title, location, department, employment_type, work_mode, description, requirements, requirement_specs, apply_email, salary_min, salary_max, salary_currency, salary_period, sort_order, published)
values
(
  'Medidor-Orçamentista',
  'Montijo', 'Escritório', 'Full-time', 'Presencial',
  'Procuramos um Medidor-Orçamentista para o nosso escritório no Montijo, responsável por medições, mapas de quantidades e elaboração de orçamentos de obra. Valorizamos experiência na função, mas damos formação a quem tiver vontade de aprender e boa capacidade de leitura de projeto. Horário das 9h às 17h. Oferecemos salário acima da média de acordo com a experiência e forte incentivo à progressão de carreira.',
  '[]'::jsonb,
  '{"skills":{"enabled":true,"items":["Orçamentação e medições","Leitura e interpretação de projeto","Microsoft Excel"]}}'::jsonb,
  'anacatarina.rodrigues@verumforma.pt', 1500, 2100, 'EUR', 'month', 1, false
),
(
  'Encarregado de Obra',
  'Margem Sul e Lisboa', 'Obra', 'Full-time', 'Presencial',
  'Procuramos um Encarregado de Obra para coordenar equipas e frentes de trabalho em obras na Margem Sul e, pontualmente, em Lisboa. Responsável pela organização diária da obra, cumprimento de prazos e articulação com a direção de obra. Horário das 8h30 às 17h30. Carta de condução obrigatória. Oferecemos salário acima da média de acordo com a experiência e incentivo à progressão de carreira.',
  '[]'::jsonb,
  '{"driving":{"enabled":true,"categories":["Ligeiros"]},"experience":{"enabled":true,"years":"","field":"construção civil"},"skills":{"enabled":true,"items":["Gestão de obra","Leitura e interpretação de projeto","Gestão de equipas","Planeamento e controlo de prazos"]}}'::jsonb,
  'anacatarina.rodrigues@verumforma.pt', 1800, 2500, 'EUR', 'month', 2, false
),
(
  'Pedreiro',
  'Margem Sul e Lisboa', 'Obra', 'Full-time', 'Presencial',
  'Procuramos um Pedreiro para integrar as nossas equipas em obras na Margem Sul e, por vezes, em Lisboa. Trabalhos de alvenaria, estrutura e acabamentos, com rigor e atenção ao detalhe. Horário das 8h30 às 17h30. Carta de condução muito valorizada. Oferecemos salário acima da média de acordo com a experiência e incentivo à progressão de carreira.',
  '[]'::jsonb,
  '{"experience":{"enabled":true,"years":"","field":"alvenaria e construção"}}'::jsonb,
  'anacatarina.rodrigues@verumforma.pt', 1100, 1600, 'EUR', 'month', 3, false
),
(
  'Ladrilhador',
  'Margem Sul e Lisboa', 'Obra', 'Full-time', 'Presencial',
  'Procuramos um Ladrilhador para assentamento de cerâmica, ladrilhos e revestimentos em obras na Margem Sul e, por vezes, em Lisboa. Valorizamos rigor, método e bons acabamentos. Horário das 8h30 às 17h30. Carta de condução muito valorizada. Oferecemos salário acima da média de acordo com a experiência e incentivo à progressão de carreira.',
  '[]'::jsonb,
  '{"experience":{"enabled":true,"years":"","field":"assentamento de cerâmica e ladrilhos"}}'::jsonb,
  'anacatarina.rodrigues@verumforma.pt', 1200, 1700, 'EUR', 'month', 4, false
),
(
  'Servente',
  'Margem Sul e Lisboa', 'Obra', 'Full-time', 'Presencial',
  'Procuramos um Servente para apoiar as equipas em obras na Margem Sul e, por vezes, em Lisboa. Função ideal para quem quer entrar no setor da construção e crescer connosco — não é necessária experiência, apenas vontade de aprender e de trabalhar em equipa. Horário das 8h30 às 17h30. Carta de condução muito valorizada. Oferecemos salário acima da média e incentivo à progressão de carreira.',
  '[]'::jsonb,
  '{}'::jsonb,
  'anacatarina.rodrigues@verumforma.pt', 950, 1300, 'EUR', 'month', 5, false
);
