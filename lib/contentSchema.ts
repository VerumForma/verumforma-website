// Describes which site copy is editable in the admin "Conteúdo" panel.
// Each section maps to a key in the dictionaries (pt.json / en.json).

export type SimpleField = { key: string; label: string; type: 'text' | 'textarea' }
export type ListField = {
  key: string
  label: string
  type: 'list'
  itemFields: SimpleField[]
}
export type StringListField = { key: string; label: string; type: 'stringlist' }
export type Field = SimpleField | ListField | StringListField

export type SectionSchema = { id: string; label: string; fields: Field[] }

export const CONTENT_SCHEMA: SectionSchema[] = [
  {
    id: 'hero',
    label: 'Destaque (Hero)',
    fields: [
      { key: 'badge', label: 'Etiqueta', type: 'text' },
      { key: 'headline', label: 'Título', type: 'text' },
      { key: 'subtext', label: 'Subtítulo', type: 'textarea' },
      { key: 'cta_primary', label: 'Botão principal', type: 'text' },
      { key: 'cta_secondary', label: 'Botão secundário', type: 'text' },
    ],
  },
  {
    id: 'stats',
    label: 'Números',
    fields: [
      { key: 'founded_label', label: 'Fundação — etiqueta', type: 'text' },
      { key: 'founded_value', label: 'Fundação — valor', type: 'text' },
      { key: 'projects_label', label: 'Obras — etiqueta', type: 'text' },
      { key: 'projects_value', label: 'Obras — valor', type: 'text' },
      { key: 'clients_label', label: 'Clientes — etiqueta', type: 'text' },
      { key: 'clients_value', label: 'Clientes — valor', type: 'text' },
      { key: 'experience_label', label: 'Experiência — etiqueta', type: 'text' },
      { key: 'experience_value', label: 'Experiência — valor', type: 'text' },
    ],
  },
  {
    id: 'about',
    label: 'Sobre a VerumForma',
    fields: [
      { key: 'label', label: 'Etiqueta', type: 'text' },
      { key: 'headline', label: 'Título', type: 'text' },
      { key: 'body1', label: 'Parágrafo 1', type: 'textarea' },
      { key: 'body2', label: 'Parágrafo 2', type: 'textarea' },
      { key: 'cta', label: 'Botão', type: 'text' },
      { key: 'value1_title', label: 'Valor 1 — título', type: 'text' },
      { key: 'value1_desc', label: 'Valor 1 — descrição', type: 'textarea' },
      { key: 'value2_title', label: 'Valor 2 — título', type: 'text' },
      { key: 'value2_desc', label: 'Valor 2 — descrição', type: 'textarea' },
      { key: 'value3_title', label: 'Valor 3 — título', type: 'text' },
      { key: 'value3_desc', label: 'Valor 3 — descrição', type: 'textarea' },
      { key: 'value4_title', label: 'Valor 4 — título', type: 'text' },
      { key: 'value4_desc', label: 'Valor 4 — descrição', type: 'textarea' },
      { key: 'value5_title', label: 'Valor 5 — título', type: 'text' },
      { key: 'value5_desc', label: 'Valor 5 — descrição', type: 'textarea' },
    ],
  },
  {
    id: 'services',
    label: 'O que fazemos (Serviços)',
    fields: [
      { key: 'label', label: 'Etiqueta', type: 'text' },
      {
        key: 'items',
        label: 'Serviços',
        type: 'list',
        itemFields: [
          { key: 'number', label: 'Nº', type: 'text' },
          { key: 'title', label: 'Título', type: 'text' },
          { key: 'description', label: 'Descrição', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'process',
    label: 'Como trabalhamos (Processo)',
    fields: [
      { key: 'label', label: 'Etiqueta', type: 'text' },
      {
        key: 'steps',
        label: 'Passos',
        type: 'list',
        itemFields: [
          { key: 'number', label: 'Nº', type: 'text' },
          { key: 'title', label: 'Título', type: 'text' },
          { key: 'description', label: 'Descrição', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'contact',
    label: 'Fale connosco (Contacto)',
    fields: [
      { key: 'label', label: 'Etiqueta', type: 'text' },
      { key: 'headline', label: 'Título', type: 'text' },
      { key: 'subtext', label: 'Subtítulo', type: 'textarea' },
      { key: 'email_budgets', label: 'Email — orçamentos', type: 'text' },
      { key: 'email_admin', label: 'Email — administração', type: 'text' },
      { key: 'address', label: 'Morada', type: 'text' },
      { key: 'city', label: 'Cidade / código postal', type: 'text' },
      { key: 'form_types', label: 'Tipos de projeto (opções do formulário)', type: 'stringlist' },
    ],
  },
]
