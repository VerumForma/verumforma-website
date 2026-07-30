// Opções fixas usadas nos formulários de oportunidades.
export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Estágio',
  'Prestação de serviços',
  'Temporário',
] as const

export const WORK_MODES = ['Presencial', 'Híbrido', 'Remoto'] as const

export const SALARY_PERIODS = [
  { value: 'month', pt: 'por mês', en: 'per month' },
  { value: 'year', pt: 'por ano', en: 'per year' },
  { value: 'hour', pt: 'por hora', en: 'per hour' },
] as const

export function formatSalary(
  min: number | null | undefined,
  max: number | null | undefined,
  currency: string | null | undefined,
  period: string | null | undefined,
  lang: string
): string | null {
  if (!min && !max) return null
  const cur = currency || 'EUR'
  const sym = cur === 'EUR' ? '€' : cur === 'USD' ? '$' : cur + ' '
  const fmt = (n: number) => `${sym}${n.toLocaleString(lang === 'pt' ? 'pt-PT' : 'en-GB')}`
  const p = SALARY_PERIODS.find(x => x.value === (period || 'month'))
  const per = p ? (lang === 'pt' ? p.pt : p.en) : ''
  const range = min && max ? `${fmt(min)}–${fmt(max)}` : fmt((min || max) as number)
  return `${range} ${per}`.trim()
}
