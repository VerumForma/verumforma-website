'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Opening } from '@/lib/supabase/types'
import { EMPLOYMENT_TYPES, WORK_MODES, SALARY_PERIODS } from '@/lib/openingOptions'
import { EMPTY_SPECS } from '@/lib/requirements'
import RequirementsEditor from './RequirementsEditor'

const input =
  'w-full bg-white text-sm px-3 py-2 border border-[rgba(26,26,26,0.15)] outline-none focus:border-[#1A1A1A] transition-colors'
const label = 'block text-xs uppercase tracking-wider text-[#6B6560] mb-1'
const SITE_URL = 'https://www.verumforma.pt'
function shareUrl(id: string) { return `${SITE_URL}/pt/oportunidades/${id}` }

type Draft = Partial<Opening>
const empty: Draft = {
  title: '', location: '', department: '', employment_type: '', work_mode: '', description: '',
  requirements: [], requirement_specs: EMPTY_SPECS, deadline: null, apply_email: '',
  salary_min: null, salary_max: null, salary_currency: 'EUR', salary_period: 'month', sort_order: 0, published: false,
}

export default function OpeningsManager({ initial }: { initial: Opening[] }) {
  const supabase = createClient()
  const [rows, setRows] = useState<Opening[]>(initial)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function refresh() {
    const { data } = await supabase.from('openings').select('*')
      .order('sort_order', { ascending: true }).order('created_at', { ascending: false })
    setRows(data ?? [])
  }

  async function save() {
    if (!draft?.title?.trim()) { setError('O título é obrigatório.'); return }
    setSaving(true); setError('')
    const payload = {
      title: draft.title,
      location: draft.location || null,
      department: draft.department || null,
      employment_type: draft.employment_type || null,
      work_mode: draft.work_mode || null,
      description: draft.description || null,
      requirements: (draft.requirements ?? []).filter(r => r.trim()),
      requirement_specs: draft.requirement_specs ?? {},
      deadline: draft.deadline || null,
      apply_email: draft.apply_email || null,
      salary_min: draft.salary_min ? Number(draft.salary_min) : null,
      salary_max: draft.salary_max ? Number(draft.salary_max) : null,
      salary_currency: draft.salary_currency || 'EUR',
      salary_period: draft.salary_period || 'month',
      sort_order: Number(draft.sort_order) || 0,
      published: !!draft.published,
    }
    const { error } = draft.id
      ? await supabase.from('openings').update(payload).eq('id', draft.id)
      : await supabase.from('openings').insert(payload)
    setSaving(false)
    if (error) { setError(error.message); return }
    setDraft(null); refresh()
  }

  async function remove(id: string) {
    if (!confirm('Eliminar esta oportunidade?')) return
    await supabase.from('openings').delete().eq('id', id); refresh()
  }
  async function togglePublish(row: Opening) {
    await supabase.from('openings').update({ published: !row.published }).eq('id', row.id); refresh()
  }

  const reqs = draft?.requirements ?? []
  const setReqs = (arr: string[]) => setDraft(d => ({ ...(d as Draft), requirements: arr }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl">Oportunidades</h1>
          <p className="text-sm text-[#6B6560]">{rows.length} no total</p>
        </div>
        <button onClick={() => { setDraft({ ...empty }); setError('') }} className="text-xs uppercase tracking-wider bg-[#1A1A1A] text-white px-4 py-2 hover:opacity-80">
          Nova oportunidade
        </button>
      </div>

      {draft && (
        <div className="bg-white border border-[rgba(26,26,26,0.12)] p-6 mb-8">
          <h2 className="font-playfair text-xl mb-4">{draft.id ? 'Editar' : 'Nova'} oportunidade</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={label}>Título *</label>
              <input className={input} value={draft.title ?? ''} onChange={e => setDraft({ ...draft, title: e.target.value })} />
            </div>
            <div>
              <label className={label}>Tipo de contrato</label>
              <select className={input} value={draft.employment_type ?? ''} onChange={e => setDraft({ ...draft, employment_type: e.target.value })}>
                <option value="">—</option>
                {EMPLOYMENT_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Modalidade</label>
              <select className={input} value={draft.work_mode ?? ''} onChange={e => setDraft({ ...draft, work_mode: e.target.value })}>
                <option value="">—</option>
                {WORK_MODES.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Área / departamento</label>
              <input className={input} placeholder="Obra, Escritório…" value={draft.department ?? ''} onChange={e => setDraft({ ...draft, department: e.target.value })} />
            </div>
            <div>
              <label className={label}>Localização</label>
              <input className={input} value={draft.location ?? ''} onChange={e => setDraft({ ...draft, location: e.target.value })} />
            </div>
            <div>
              <label className={label}>Prazo de candidatura</label>
              <input type="date" className={input} value={draft.deadline ?? ''} onChange={e => setDraft({ ...draft, deadline: e.target.value || null })} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Descrição</label>
              <textarea rows={4} className={input} value={draft.description ?? ''} onChange={e => setDraft({ ...draft, description: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Requisitos (biblioteca reutilizável)</label>
              <RequirementsEditor value={draft.requirement_specs ?? {}} onChange={rs => setDraft({ ...draft, requirement_specs: rs })} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Outros requisitos (texto livre)</label>
              <div className="flex flex-col gap-2">
                {reqs.map((r, i) => (
                  <div key={i} className="flex gap-2">
                    <input className={input} value={r} onChange={e => { const n = [...reqs]; n[i] = e.target.value; setReqs(n) }} />
                    <button type="button" onClick={() => setReqs(reqs.filter((_, idx) => idx !== i))} className="text-xs text-red-500 shrink-0 px-2">×</button>
                  </div>
                ))}
                <button type="button" onClick={() => setReqs([...reqs, ''])} className="self-start text-xs uppercase tracking-wider text-[#1A1A1A] border border-[rgba(26,26,26,0.2)] px-3 py-1.5 hover:bg-[rgba(26,26,26,0.04)]">+ Adicionar requisito</button>
              </div>
            </div>
            <div>
              <label className={label}>Email de candidatura</label>
              <input className={input} placeholder="administracao@verumforma.pt" value={draft.apply_email ?? ''} onChange={e => setDraft({ ...draft, apply_email: e.target.value })} />
            </div>
            <div>
              <label className={label}>Salário mínimo (€/mês)</label>
              <input type="number" className={input} placeholder="ex: 1400" value={draft.salary_min ?? ''} onChange={e => setDraft({ ...draft, salary_min: e.target.value ? Number(e.target.value) : null })} />
            </div>
            <div>
              <label className={label}>Salário máximo (€/mês)</label>
              <input type="number" className={input} placeholder="ex: 2000" value={draft.salary_max ?? ''} onChange={e => setDraft({ ...draft, salary_max: e.target.value ? Number(e.target.value) : null })} />
            </div>
            <div>
              <label className={label}>Período do salário</label>
              <select className={input} value={draft.salary_period ?? 'month'} onChange={e => setDraft({ ...draft, salary_period: e.target.value })}>
                {SALARY_PERIODS.map(o => <option key={o.value} value={o.value}>{o.pt}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Ordem</label>
              <input type="number" className={input} value={draft.sort_order ?? 0} onChange={e => setDraft({ ...draft, sort_order: Number(e.target.value) })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!draft.published} onChange={e => setDraft({ ...draft, published: e.target.checked })} />
              Publicado
            </label>
          </div>
          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
          <div className="flex gap-3 mt-5">
            <button onClick={save} disabled={saving} className="text-xs uppercase tracking-wider bg-[#1A1A1A] text-white px-5 py-2 hover:opacity-80 disabled:opacity-50">
              {saving ? 'A guardar…' : 'Guardar'}
            </button>
            <button onClick={() => setDraft(null)} className="text-xs uppercase tracking-wider px-5 py-2 border border-[rgba(26,26,26,0.2)] hover:bg-[rgba(26,26,26,0.04)]">Cancelar</button>
          </div>
        </div>
      )}

      <div className="flex flex-col divide-y divide-[rgba(26,26,26,0.08)] bg-white border border-[rgba(26,26,26,0.08)]">
        {rows.length === 0 && <p className="text-sm text-[#6B6560] p-6">Ainda não há oportunidades.</p>}
        {rows.map(row => (
          <div key={row.id} className="flex items-center gap-4 p-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{row.title}</p>
              <p className="text-xs text-[#6B6560] truncate">
                {[row.employment_type, row.location, row.department].filter(Boolean).join(' · ')}
              </p>
            </div>
            <button onClick={() => togglePublish(row)} className={`text-[10px] uppercase tracking-wider px-2 py-1 ${row.published ? 'bg-green-100 text-green-800' : 'bg-[rgba(26,26,26,0.06)] text-[#6B6560]'}`}>
              {row.published ? 'Publicado' : 'Rascunho'}
            </button>
            {row.published && (
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#6B6560]">
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl(row.id))}`} target="_blank" rel="noreferrer" className="hover:text-[#1A1A1A]">LinkedIn</a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl(row.id))}`} target="_blank" rel="noreferrer" className="hover:text-[#1A1A1A]">Facebook</a>
                <button onClick={() => { navigator.clipboard.writeText(shareUrl(row.id)); }} className="hover:text-[#1A1A1A]">Copiar</button>
              </span>
            )}
            <button onClick={() => { setDraft(row); setError('') }} className="text-xs text-[#1A1A1A] hover:underline">Editar</button>
            <button onClick={() => remove(row.id)} className="text-xs text-red-500 hover:underline">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  )
}
