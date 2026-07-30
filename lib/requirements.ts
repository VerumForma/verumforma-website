// Biblioteca de requisitos reutilizáveis para as oportunidades.

export const ACADEMIC_LEVELS = ['9º ano', '12º ano', 'Licenciatura', 'Mestrado', 'Doutoramento'] as const
export const DRIVING_CATEGORIES = [
  'Ligeiros',
  'Pesados de mercadorias',
  'Pesados de passageiros',
  'Reboque / atrelado',
  'Manobrador de máquinas de construção',
] as const
export const LANGUAGE_LEVELS = ['Básico', 'Intermédio', 'Avançado', 'Nativo'] as const

// Sugestões de competências/software mais comuns no setor da construção
// (curadas a partir das mais procuradas em anúncios/LinkedIn). Servem de
// template para escolher rapidamente; o texto livre continua disponível.
export const SKILL_SUGGESTIONS = [
  'AutoCAD',
  'AutoCAD Civil 3D',
  'Revit (BIM)',
  'ArchiCAD',
  'SketchUp',
  'Navisworks',
  'CYPE',
  'Presto (orçamentação)',
  'STAAD.Pro',
  'Robot Structural Analysis',
  'Primavera P6',
  'MS Project',
  'Microsoft Excel',
  'QGIS / SIG',
  'Gestão de obra',
  'Orçamentação e medições',
  'Leitura e interpretação de projeto',
  'Planeamento e controlo de prazos',
  'Fiscalização de obra',
  'Coordenação de segurança (CSS)',
  'Gestão de equipas',
] as const

export type LanguageItem = { lang: string; level: string }

export type RequirementSpecs = {
  academic?: { enabled: boolean; level: string; field: string }
  driving?: { enabled: boolean; categories: string[] }
  experience?: { enabled: boolean; years: string; field: string }
  languages?: { enabled: boolean; items: LanguageItem[] }
  skills?: { enabled: boolean; items: string[] }
}

export const EMPTY_SPECS: RequirementSpecs = {
  academic: { enabled: false, level: '', field: '' },
  driving: { enabled: false, categories: [] },
  experience: { enabled: false, years: '', field: '' },
  languages: { enabled: false, items: [] },
  skills: { enabled: false, items: [] },
}

type Labels = {
  r_academic: string; r_driving: string; r_experience: string
  r_languages: string; r_skills: string; r_years: string; r_in: string
}

// Converte specs estruturados em linhas prontas a mostrar {label, value}.
export function specLines(specs: RequirementSpecs | null | undefined, t: Labels): { label: string; value: string }[] {
  if (!specs) return []
  const lines: { label: string; value: string }[] = []
  const a = specs.academic
  if (a?.enabled && a.level) {
    lines.push({ label: t.r_academic, value: a.field ? `${a.level} ${t.r_in} ${a.field}` : a.level })
  }
  const d = specs.driving
  if (d?.enabled && d.categories?.length) {
    lines.push({ label: t.r_driving, value: d.categories.join(', ') })
  }
  const e = specs.experience
  if (e?.enabled && (e.years || e.field)) {
    const yrs = e.years ? `${e.years} ${t.r_years}` : ''
    lines.push({ label: t.r_experience, value: [yrs, e.field ? `${t.r_in} ${e.field}` : ''].filter(Boolean).join(' ') })
  }
  const l = specs.languages
  if (l?.enabled && l.items?.length) {
    lines.push({ label: t.r_languages, value: l.items.filter(i => i.lang).map(i => i.level ? `${i.lang} (${i.level})` : i.lang).join(', ') })
  }
  const s = specs.skills
  if (s?.enabled && s.items?.length) {
    lines.push({ label: t.r_skills, value: s.items.filter(Boolean).join(', ') })
  }
  return lines
}
