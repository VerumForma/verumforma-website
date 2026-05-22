import type { Locale } from '@/middleware'

const dictionaries = {
  pt: () => import('@/lib/dictionaries/pt.json').then(m => m.default),
  en: () => import('@/lib/dictionaries/en.json').then(m => m.default),
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries['pt']()
