'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CONTENT_SCHEMA } from '@/lib/contentSchema'
import type { SiteContent } from '@/lib/supabase/types'
import ImageUpload from './ImageUpload'
import ptDict from '@/lib/dictionaries/pt.json'
import enDict from '@/lib/dictionaries/en.json'

type Locale = 'pt' | 'en'
type Data = Record<string, unknown>
type Item = Record<string, string>

const defaults: Record<Locale, Record<string, unknown>> = {
  pt: ptDict as Record<string, unknown>,
  en: enDict as Record<string, unknown>,
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

// ---- editable field styled to look like the live site ----
function Box({
  n, value, onChange, cls, dark = false, area = false, placeholder,
}: {
  n: number; value: string; onChange: (v: string) => void; cls: string
  dark?: boolean; area?: boolean; placeholder?: string
}) {
  const border = dark
    ? 'border-white/25 focus:border-white/70'
    : 'border-[rgba(26,26,26,0.2)] focus:border-[#1A1A1A]'
  const chip = dark ? 'bg-white text-[#1A1A1A]' : 'bg-[#1A1A1A] text-white'
  const common = `w-full bg-transparent border border-dashed ${border} outline-none rounded-[2px] px-3 pt-3.5 pb-2 transition-colors ${cls}`
  return (
    <div className="relative">
      <span className={`absolute -top-2 left-2 z-10 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] ${chip}`}>
        Caixa {n}
      </span>
      {area ? (
        <textarea rows={3} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className={common} />
      ) : (
        <input value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className={common} />
      )}
    </div>
  )
}

export default function ContentManager({ initial }: { initial: SiteContent[] }) {
  const supabase = createClient()

  const [overrideMap, setOverrideMap] = useState<Record<Locale, Record<string, Data>>>(() => {
    const m: Record<Locale, Record<string, Data>> = { pt: {}, en: {} }
    for (const row of initial) {
      const loc = (row.locale === 'en' ? 'en' : 'pt') as Locale
      m[loc][row.section] = (row.data as Data) ?? {}
    }
    return m
  })

  const [locale, setLocale] = useState<Locale>('pt')
  const [sectionId, setSectionId] = useState<string>(CONTENT_SCHEMA[0].id)
  const [draft, setDraft] = useState<Data>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const def = (defaults[locale][sectionId] as Data) ?? {}
    const ov = overrideMap[locale][sectionId] ?? {}
    setDraft({ ...clone(def), ...clone(ov) })
    setMsg('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, sectionId])

  const v = (k: string) => (draft[k] as string) ?? ''
  const set = (k: string, val: string) => setDraft(d => ({ ...d, [k]: val }))

  const list = (k: string) => (Array.isArray(draft[k]) ? (draft[k] as Item[]) : [])
  const setList = (k: string, arr: Item[]) => setDraft(d => ({ ...d, [k]: arr }))
  const setItem = (k: string, i: number, sub: string, val: string) =>
    setList(k, list(k).map((it, idx) => (idx === i ? { ...it, [sub]: val } : it)))
  const moveItem = (k: string, i: number, dir: -1 | 1) => {
    const arr = [...list(k)]; const j = i + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[i], arr[j]] = [arr[j], arr[i]]; setList(k, arr)
  }
  const removeItem = (k: string, i: number) => setList(k, list(k).filter((_, idx) => idx !== i))
  const addItem = (k: string, template: Item) => setList(k, [...list(k), { ...template }])

  const strList = (k: string) => (Array.isArray(draft[k]) ? (draft[k] as string[]) : [])
  const setStr = (k: string, arr: string[]) => setDraft(d => ({ ...d, [k]: arr }))

  async function save() {
    setSaving(true); setMsg('')
    const { error } = await supabase
      .from('site_content')
      .upsert({ section: sectionId, locale, data: draft }, { onConflict: 'section,locale' })
    setSaving(false)
    if (error) { setMsg('Erro: ' + error.message); return }
    setOverrideMap(m => ({ ...m, [locale]: { ...m[locale], [sectionId]: clone(draft) } }))
    setMsg('Guardado ✓')
  }

  // sequential "Caixa N" counter, reset each render
  let cx = 0
  const N = () => ++cx

  const itemControls = (k: string, i: number, dark: boolean) => (
    <div className={`flex gap-3 text-[10px] ${dark ? 'text-white/50' : 'text-[#6B6560]'} mb-2`}>
      <button type="button" onClick={() => moveItem(k, i, -1)} className="hover:opacity-70">↑</button>
      <button type="button" onClick={() => moveItem(k, i, 1)} className="hover:opacity-70">↓</button>
      <button type="button" onClick={() => removeItem(k, i)} className="hover:text-red-400">eliminar</button>
    </div>
  )

  function renderSection() {
    switch (sectionId) {
      case 'hero':
        return (
          <div className="p-8 md:p-12" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="mb-8 pb-6 border-b border-dashed border-[rgba(26,26,26,0.25)]">
              <p className="text-[11px] uppercase tracking-wider text-[#6B6560] mb-2">Imagem de fundo (opcional)</p>
              <div className="max-w-md">
                <ImageUpload value={v('bg_image') || null} folder="hero" aspect="aspect-video" onChange={url => set('bg_image', url || '')} />
              </div>
              <div className="mt-4 max-w-xs">
                <label className="block text-[11px] uppercase tracking-wider text-[#6B6560] mb-1">Filtro claro por cima: {v('bg_overlay') || '62'}%</label>
                <input type="range" min={0} max={100} value={Number(v('bg_overlay') || 62)} onChange={e => set('bg_overlay', e.target.value)} className="w-full accent-[#1A1A1A]" />
              </div>
            </div>
            <div className="flex flex-col gap-7 max-w-3xl">
              <div className="max-w-xs"><Box n={N()} value={v('badge')} onChange={x => set('badge', x)} cls="text-xs tracking-[0.18em] uppercase text-[#6B6560]" /></div>
              <Box n={N()} area value={v('headline')} onChange={x => set('headline', x)} cls="font-playfair text-4xl md:text-5xl text-[#1A1A1A] leading-[1.05]" />
              <div className="max-w-md"><Box n={N()} area value={v('subtext')} onChange={x => set('subtext', x)} cls="font-sans text-base text-[#6B6560] leading-relaxed" /></div>
              <div className="flex gap-4 flex-wrap max-w-lg">
                <div className="flex-1 min-w-[160px]"><Box n={N()} value={v('cta_primary')} onChange={x => set('cta_primary', x)} cls="text-sm tracking-[0.1em] uppercase text-[#1A1A1A]" /></div>
                <div className="flex-1 min-w-[160px]"><Box n={N()} value={v('cta_secondary')} onChange={x => set('cta_secondary', x)} cls="text-sm tracking-[0.1em] uppercase text-[#1A1A1A]" /></div>
              </div>
            </div>
          </div>
        )
      case 'stats':
        return (
          <div className="p-8 md:p-12" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {['founded', 'projects', 'clients', 'experience'].map(key => (
                <div key={key} className="flex flex-col gap-2 border-t border-[rgba(26,26,26,0.12)] pt-5">
                  <Box n={N()} value={v(`${key}_value`)} onChange={x => set(`${key}_value`, x)} cls="font-playfair text-3xl text-[#1A1A1A]" />
                  <Box n={N()} value={v(`${key}_label`)} onChange={x => set(`${key}_label`, x)} cls="text-xs tracking-wider uppercase text-[#6B6560]" />
                </div>
              ))}
            </div>
          </div>
        )
      case 'about':
        return (
          <div className="p-8 md:p-12" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="max-w-xs mb-10"><Box n={N()} value={v('label')} onChange={x => set('label', x)} cls="text-xs tracking-[0.18em] uppercase text-[#6B6560]" /></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="flex flex-col gap-6">
                <Box n={N()} area value={v('headline')} onChange={x => set('headline', x)} cls="font-playfair text-4xl text-[#1A1A1A] leading-[1.1]" />
                <Box n={N()} area value={v('body1')} onChange={x => set('body1', x)} cls="font-sans text-base text-[#6B6560] leading-relaxed" />
                <Box n={N()} area value={v('body2')} onChange={x => set('body2', x)} cls="font-sans text-base text-[#6B6560] leading-relaxed" />
                <div className="max-w-[220px]"><Box n={N()} value={v('cta')} onChange={x => set('cta', x)} cls="text-xs tracking-[0.12em] uppercase text-[#1A1A1A]" /></div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="max-w-xs"><Box n={N()} value={v('values_label')} onChange={x => set('values_label', x)} cls="text-xs tracking-[0.18em] uppercase text-[#6B6560]" /></div>
                {['value1', 'value2', 'value3', 'value4', 'value5'].map(s => (
                  <div key={s} className="flex flex-col gap-2 border-t border-[rgba(26,26,26,0.12)] pt-4">
                    <Box n={N()} value={v(`${s}_title`)} onChange={x => set(`${s}_title`, x)} cls="font-playfair text-2xl text-[#1A1A1A]" />
                    <Box n={N()} area value={v(`${s}_desc`)} onChange={x => set(`${s}_desc`, x)} cls="font-sans text-sm text-[#6B6560] leading-relaxed" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'services':
        return (
          <div className="p-8 md:p-12" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="max-w-xs mb-10"><Box n={N()} value={v('label')} onChange={x => set('label', x)} cls="text-xs tracking-[0.18em] uppercase text-[#6B6560]" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              {list('items').map((item, i) => (
                <div key={i} className="border-t border-[rgba(26,26,26,0.12)] pt-5">
                  {itemControls('items', i, false)}
                  <div className="flex flex-col gap-3">
                    <div className="max-w-[80px]"><Box n={N()} value={item.number ?? ''} onChange={x => setItem('items', i, 'number', x)} cls="font-sans text-xs text-[#6B6560] tracking-widest" /></div>
                    <Box n={N()} value={item.title ?? ''} onChange={x => setItem('items', i, 'title', x)} cls="font-playfair text-xl text-[#1A1A1A]" />
                    <Box n={N()} area value={item.description ?? ''} onChange={x => setItem('items', i, 'description', x)} cls="font-sans text-sm text-[#6B6560] leading-relaxed" />
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => addItem('items', { number: '', title: '', description: '' })} className="mt-8 text-xs uppercase tracking-wider text-[#1A1A1A] border border-[rgba(26,26,26,0.2)] px-4 py-2 hover:bg-[rgba(26,26,26,0.04)]">+ Adicionar serviço</button>
          </div>
        )
      case 'process':
        return (
          <div className="p-8 md:p-12" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="max-w-xs mb-10"><Box n={N()} value={v('label')} onChange={x => set('label', x)} cls="text-xs tracking-[0.18em] uppercase text-[#6B6560]" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {list('steps').map((step, i) => (
                <div key={i} className="border-t border-[rgba(26,26,26,0.12)] pt-5">
                  {itemControls('steps', i, false)}
                  <div className="flex flex-col gap-3">
                    <div className="max-w-[80px]"><Box n={N()} value={step.number ?? ''} onChange={x => setItem('steps', i, 'number', x)} cls="font-playfair text-3xl text-[#6B6560]" /></div>
                    <Box n={N()} value={step.title ?? ''} onChange={x => setItem('steps', i, 'title', x)} cls="font-sans text-sm font-medium text-[#1A1A1A] tracking-wide" />
                    <Box n={N()} area value={step.description ?? ''} onChange={x => setItem('steps', i, 'description', x)} cls="font-sans text-xs text-[#6B6560] leading-relaxed" />
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => addItem('steps', { number: '', title: '', description: '' })} className="mt-8 text-xs uppercase tracking-wider text-[#1A1A1A] border border-[rgba(26,26,26,0.2)] px-4 py-2 hover:bg-[rgba(26,26,26,0.04)]">+ Adicionar passo</button>
          </div>
        )
      case 'contact': {
        const types = strList('form_types')
        return (
          <div className="p-8 md:p-12" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="max-w-2xl flex flex-col gap-6">
              <div className="max-w-xs"><Box n={N()} value={v('label')} onChange={x => set('label', x)} cls="text-xs tracking-[0.18em] uppercase text-[#6B6560]" /></div>
              <Box n={N()} area value={v('headline')} onChange={x => set('headline', x)} cls="font-playfair text-4xl text-[#1A1A1A] leading-[1.1]" />
              <Box n={N()} area value={v('subtext')} onChange={x => set('subtext', x)} cls="font-sans text-base text-[#6B6560] leading-relaxed" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Box n={N()} value={v('email_budgets')} onChange={x => set('email_budgets', x)} cls="font-sans text-sm text-[#6B6560]" />
                <Box n={N()} value={v('email_admin')} onChange={x => set('email_admin', x)} cls="font-sans text-sm text-[#6B6560]" />
                <Box n={N()} value={v('address')} onChange={x => set('address', x)} cls="font-sans text-sm text-[#6B6560]" />
                <Box n={N()} value={v('city')} onChange={x => set('city', x)} cls="font-sans text-sm text-[#6B6560]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6B6560] mb-3">Tipos de projeto (opções do formulário)</p>
                <div className="flex flex-col gap-2">
                  {types.map((s, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="flex-1"><Box n={N()} value={s} onChange={x => { const nx = [...types]; nx[i] = x; setStr('form_types', nx) }} cls="font-sans text-sm text-[#1A1A1A]" /></div>
                      <button type="button" onClick={() => setStr('form_types', types.filter((_, idx) => idx !== i))} className="text-[#6B6560] hover:text-red-500 text-sm shrink-0">×</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setStr('form_types', [...types, ''])} className="self-start text-xs uppercase tracking-wider text-[#1A1A1A] border border-[rgba(26,26,26,0.2)] px-3 py-1.5 hover:bg-[rgba(26,26,26,0.04)] mt-1">+ Adicionar opção</button>
                </div>
              </div>
            </div>
          </div>
        )
      }
      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-playfair text-3xl">Conteúdo</h1>
        <div className="flex border border-[rgba(26,26,26,0.15)]">
          {(['pt', 'en'] as Locale[]).map(l => (
            <button key={l} onClick={() => setLocale(l)} className={`text-xs uppercase tracking-wider px-4 py-2 ${locale === l ? 'bg-[#1A1A1A] text-white' : 'text-[#6B6560]'}`}>
              {l === 'pt' ? 'Português' : 'English'}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-[#6B6560] mb-8">Edite o texto tal como aparece no site. Cada caixa é um campo editável.</p>

      <div className="flex gap-8 items-start">
        <div className="w-52 shrink-0 flex flex-col gap-1 sticky top-6">
          {CONTENT_SCHEMA.map(s => (
            <button key={s.id} onClick={() => setSectionId(s.id)} className={`text-left text-sm px-3 py-2 border-l-2 transition-colors ${sectionId === s.id ? 'border-[#1A1A1A] bg-white' : 'border-transparent text-[#6B6560] hover:text-[#1A1A1A]'}`}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <div className="border border-[rgba(26,26,26,0.12)] overflow-hidden">{renderSection()}</div>
          <div className="flex items-center gap-4 mt-6">
            <button onClick={save} disabled={saving} className="text-xs uppercase tracking-wider bg-[#1A1A1A] text-white px-6 py-2.5 hover:opacity-80 disabled:opacity-50">
              {saving ? 'A guardar…' : 'Guardar'}
            </button>
            {msg && <span className="text-xs text-[#6B6560]">{msg}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
