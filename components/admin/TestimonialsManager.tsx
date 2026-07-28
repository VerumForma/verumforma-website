'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Testimonial } from '@/lib/supabase/types'

const input =
  'w-full bg-white text-sm px-3 py-2 border border-[rgba(26,26,26,0.15)] outline-none focus:border-[#1A1A1A] transition-colors'
const label = 'block text-xs uppercase tracking-wider text-[#6B6560] mb-1'

type Draft = Partial<Testimonial>
const empty: Draft = { quote: '', author_name: '', author_role: '', project: '', sort_order: 0, published: false }

export default function TestimonialsManager({ initial }: { initial: Testimonial[] }) {
  const supabase = createClient()
  const [rows, setRows] = useState<Testimonial[]>(initial)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function refresh() {
    const { data } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true })
    setRows(data ?? [])
  }

  async function save() {
    if (!draft?.quote?.trim() || !draft?.author_name?.trim()) { setError('Citação e autor são obrigatórios.'); return }
    setSaving(true); setError('')
    const payload = {
      quote: draft.quote,
      author_name: draft.author_name,
      author_role: draft.author_role || null,
      project: draft.project || null,
      sort_order: Number(draft.sort_order) || 0,
      published: !!draft.published,
    }
    const { error } = draft.id
      ? await supabase.from('testimonials').update(payload).eq('id', draft.id)
      : await supabase.from('testimonials').insert(payload)
    setSaving(false)
    if (error) { setError(error.message); return }
    setDraft(null); refresh()
  }

  async function remove(id: string) {
    if (!confirm('Eliminar este testemunho?')) return
    await supabase.from('testimonials').delete().eq('id', id); refresh()
  }
  async function togglePublish(row: Testimonial) {
    await supabase.from('testimonials').update({ published: !row.published }).eq('id', row.id); refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl">Testemunhos</h1>
          <p className="text-sm text-[#6B6560]">{rows.length} no total · o primeiro publicado aparece no site</p>
        </div>
        <button onClick={() => { setDraft({ ...empty }); setError('') }} className="text-xs uppercase tracking-wider bg-[#1A1A1A] text-white px-4 py-2 hover:opacity-80">
          Novo testemunho
        </button>
      </div>

      {draft && (
        <div className="bg-white border border-[rgba(26,26,26,0.12)] p-6 mb-8">
          <h2 className="font-playfair text-xl mb-4">{draft.id ? 'Editar' : 'Novo'} testemunho</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={label}>Citação *</label>
              <textarea rows={3} className={input} value={draft.quote ?? ''} onChange={e => setDraft({ ...draft, quote: e.target.value })} />
            </div>
            <div>
              <label className={label}>Autor *</label>
              <input className={input} value={draft.author_name ?? ''} onChange={e => setDraft({ ...draft, author_name: e.target.value })} />
            </div>
            <div>
              <label className={label}>Cargo / relação</label>
              <input className={input} value={draft.author_role ?? ''} onChange={e => setDraft({ ...draft, author_role: e.target.value })} />
            </div>
            <div>
              <label className={label}>Projeto</label>
              <input className={input} value={draft.project ?? ''} onChange={e => setDraft({ ...draft, project: e.target.value })} />
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
        {rows.length === 0 && <p className="text-sm text-[#6B6560] p-6">Ainda não há testemunhos.</p>}
        {rows.map(row => (
          <div key={row.id} className="flex items-start gap-4 p-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm italic truncate">&ldquo;{row.quote}&rdquo;</p>
              <p className="text-xs text-[#6B6560] truncate">{[row.author_name, row.author_role, row.project].filter(Boolean).join(' · ')}</p>
            </div>
            <button onClick={() => togglePublish(row)} className={`text-[10px] uppercase tracking-wider px-2 py-1 ${row.published ? 'bg-green-100 text-green-800' : 'bg-[rgba(26,26,26,0.06)] text-[#6B6560]'}`}>
              {row.published ? 'Publicado' : 'Rascunho'}
            </button>
            <button onClick={() => { setDraft(row); setError('') }} className="text-xs text-[#1A1A1A] hover:underline">Editar</button>
            <button onClick={() => remove(row.id)} className="text-xs text-red-500 hover:underline">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  )
}
