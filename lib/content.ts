import { createClient, supabaseConfigured } from './supabase/server'

type Dict = Record<string, unknown>

// Deep-merge override onto base. Objects merge recursively; arrays and
// primitives from override replace base. Empty/undefined override values
// are ignored so a blank field never wipes the default.
export function deepMerge<T extends Dict>(base: T, override: Dict): T {
  const out: Dict = Array.isArray(base) ? [...(base as unknown[])] as unknown as Dict : { ...base }
  for (const [k, v] of Object.entries(override ?? {})) {
    if (v === undefined || v === null) continue
    if (v === '' ) continue
    const b = (out as Dict)[k]
    if (
      typeof v === 'object' && !Array.isArray(v) &&
      typeof b === 'object' && b !== null && !Array.isArray(b)
    ) {
      out[k] = deepMerge(b as Dict, v as Dict)
    } else {
      out[k] = v
    }
  }
  return out as T
}

// Fetch all edited-copy overrides for a locale, keyed by section.
export async function getSiteContentOverrides(locale: string): Promise<Record<string, Dict>> {
  if (!supabaseConfigured()) return {}
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('site_content')
      .select('section, data')
      .eq('locale', locale)
    if (error || !data) return {}
    const map: Record<string, Dict> = {}
    for (const row of data as { section: string; data: Dict }[]) {
      map[row.section] = row.data ?? {}
    }
    return map
  } catch {
    return {}
  }
}

// Returns the base dictionary with any edited copy merged in per section.
export async function mergeDictionaryWithContent<T extends Dict>(dict: T, locale: string): Promise<T> {
  const overrides = await getSiteContentOverrides(locale)
  if (Object.keys(overrides).length === 0) return dict
  const merged: Dict = { ...dict }
  for (const [section, data] of Object.entries(overrides)) {
    const base = merged[section]
    if (base && typeof base === 'object' && !Array.isArray(base)) {
      merged[section] = deepMerge(base as Dict, data)
    }
  }
  return merged as T
}
