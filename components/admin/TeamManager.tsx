'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { TeamMember } from '@/lib/supabase/types'
import ImageUpload from './ImageUpload'

const input =
  'w-full bg-white text-sm px-3 py-2 border border-[rgba(26,26,26,0.15)] outline-none focus:border-[#1A1A1A] transition-colors'
const label = 'block text-xs uppercase tracking-wider text-[#6B6560] mb-1'

type Draft = Partial<TeamMember>
const empty: Draft = { name: '', role: '', bio: '', photo: null, sort_order: 0, published: false }

export default function TeamManager({ initial }: { initial: TeamMember[] }) {
  const supabase = createClient()
  const [rows, setRows] = useState<TeamMember[]>(initial)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function refresh() {
    const { data } = await supabase.from('team_members').select('*').order('sort_order', { ascending: true })
    setRows(data ?? [])
  }

  async function save() {
    if (!draft?.name?.trim()) { setError('O nome é obrigatório.'); return }
    setSaving(true); setError('')
    const payload = {
      name: draft.name,
      role: draft.role || null,
      bio: draft.bio || null,
      photo: draft.photo || null,
      sort_order: Number(draft.sort_order) || 0,
      published: !!draft.published,
    }
    const { error } = draft.id
      ? await supabase.from('team_members').update(payload).eq('id', draft.id)
      : await supabase.from('team_members').insert(payload)
    setSaving(false)
    if (error) { setError(error.message); return }
    setDraft(null); refresh()
  }

  async function remove(id: string) {
    if (!confirm('Eliminar este membro?')) return
    await supabase.from('team_members').delete().eq('id', id); refresh()
  }
  async function togglePublish(row: TeamMember) {
    await supabase.from('team_members').update({ published: !row.published }).eq('id', row.id); refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl">Equipa</h1>
          <p className="text-sm text-[#6B6560]">{rows.length} no total</p>
        </div>
        <button onClick={() => { setDraft({ ...empty }); setError('') }} className="text-xs uppercase tracking-wider bg-[#1A1A1A] text-white px-4 py-2 hover:opacity-80">
          Novo membro
        </button>
      </div>

      {draft && (
        <div className="bg-white border border-[rgba(26,26,26,0.12)] p-6 mb-8">
          <h2 className="font-playfair text-xl mb-4">{draft.id ? 'Editar' : 'Novo'} membro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>Nome *</label>
              <input className={input} value={draft.name ?? ''} onChange={e => setDraft({ ...draft, name: e.target.value })} />
            </div>
            <div>
              <label className={label}>Cargo</label>
              <input className={input} value={draft.role ?? ''} onChange={e => setDraft({ ...draft, role: e.target.value })} />
            </div>
            <div>
              <label className={label}>Ordem</label>
              <input type="number" className={input} value={draft.sort_order ?? 0} onChange={e => setDraft({ ...draft, sort_order: Number(e.target.value) })} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Bio</label>
              <textarea rows={3} className={input} value={draft.bio ?? ''} onChange={e => setDraft({ ...draft, bio: e.target.value })} />
            </div>
            <div className="md:col-span-2 max-w-xs">
              <label className={label}>Fotografia</label>
              <ImageUpload value={draft.photo ?? null} folder="team" aspect="aspect-[3/4]" onChange={url => setDraft({ ...draft, photo: url })} />
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
        {rows.length === 0 && <p className="text-sm text-[#6B6560] p-6">Ainda não há membros.</p>}
        {rows.map(row => (
          <div key={row.id} className="flex items-center gap-4 p-4">
            <div className="w-10 h-12 bg-[#2A2A2A] shrink-0 overflow-hidden">
              {row.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.photo} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{row.name}</p>
              <p className="text-xs text-[#6B6560] truncate">{row.role}</p>
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
