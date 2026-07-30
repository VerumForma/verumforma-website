'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Project, Category } from '@/lib/supabase/types'
import ImageUpload from './ImageUpload'
import GalleryUpload from './GalleryUpload'

const input =
  'w-full bg-white text-sm px-3 py-2 border border-[rgba(26,26,26,0.15)] outline-none focus:border-[#1A1A1A] transition-colors'
const label = 'block text-xs uppercase tracking-wider text-[#6B6560] mb-1'

type Draft = Partial<Project>

const empty: Draft = {
  title: '',
  category: '',
  categories: [],
  location: '',
  year: '',
  description: '',
  cover_image: null,
  images: [],
  featured: false,
  sort_order: 0,
  published: false,
}

export default function ProjectsManager({ initial, categories }: { initial: Project[]; categories: Category[] }) {
  const supabase = createClient()
  const [rows, setRows] = useState<Project[]>(initial)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function refresh() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    setRows(data ?? [])
  }

  async function save() {
    if (!draft?.title?.trim()) {
      setError('O título é obrigatório.')
      return
    }
    setSaving(true)
    setError('')
    const payload = {
      title: draft.title,
      category: (draft.categories && draft.categories[0]) || draft.category || null,
      categories: draft.categories ?? [],
      location: draft.location || null,
      year: draft.year || null,
      description: draft.description || null,
      cover_image: draft.cover_image || null,
      images: draft.images ?? [],
      featured: !!draft.featured,
      sort_order: Number(draft.sort_order) || 0,
      published: !!draft.published,
    }
    const { error } = draft.id
      ? await supabase.from('projects').update(payload).eq('id', draft.id)
      : await supabase.from('projects').insert(payload)
    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    setDraft(null)
    refresh()
  }

  async function remove(id: string) {
    if (!confirm('Eliminar este projeto?')) return
    await supabase.from('projects').delete().eq('id', id)
    refresh()
  }

  async function togglePublish(row: Project) {
    await supabase.from('projects').update({ published: !row.published }).eq('id', row.id)
    refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl">Projetos</h1>
          <p className="text-sm text-[#6B6560]">{rows.length} no total</p>
        </div>
        <button
          onClick={() => { setDraft({ ...empty }); setError('') }}
          className="text-xs uppercase tracking-wider bg-[#1A1A1A] text-white px-4 py-2 hover:opacity-80 transition-opacity"
        >
          Novo projeto
        </button>
      </div>

      {draft && (
        <div className="bg-white border border-[rgba(26,26,26,0.12)] p-6 mb-8">
          <h2 className="font-playfair text-xl mb-4">{draft.id ? 'Editar' : 'Novo'} projeto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={label}>Título *</label>
              <input className={input} value={draft.title ?? ''} onChange={e => setDraft({ ...draft, title: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Categorias</label>
              {categories.length === 0 ? (
                <p className="text-xs text-[#6B6560]">Sem categorias. Crie em “Categorias”.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => {
                    const on = (draft.categories ?? []).includes(c.name)
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setDraft({ ...draft, categories: on ? (draft.categories ?? []).filter(x => x !== c.name) : [ ...(draft.categories ?? []), c.name ] })}
                        className={`text-xs px-3 py-1.5 border transition-colors ${on ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-[rgba(26,26,26,0.15)] text-[#6B6560] hover:border-[#1A1A1A]'}`}
                      >
                        {on ? c.name : `+ ${c.name}`}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <div>
              <label className={label}>Localização</label>
              <input className={input} value={draft.location ?? ''} onChange={e => setDraft({ ...draft, location: e.target.value })} />
            </div>
            <div>
              <label className={label}>Ano</label>
              <input className={input} value={draft.year ?? ''} onChange={e => setDraft({ ...draft, year: e.target.value })} />
            </div>
            <div>
              <label className={label}>Ordem</label>
              <input type="number" className={input} value={draft.sort_order ?? 0} onChange={e => setDraft({ ...draft, sort_order: Number(e.target.value) })} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Descrição</label>
              <textarea rows={3} className={input} value={draft.description ?? ''} onChange={e => setDraft({ ...draft, description: e.target.value })} />
            </div>
            <div className="md:col-span-2 max-w-sm">
              <label className={label}>Imagem de capa</label>
              <ImageUpload value={draft.cover_image ?? null} folder="projects" onChange={url => setDraft({ ...draft, cover_image: url })} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Galeria (fotos adicionais)</label>
              <GalleryUpload value={draft.images ?? []} folder="projects" onChange={imgs => setDraft({ ...draft, images: imgs })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!draft.featured} onChange={e => setDraft({ ...draft, featured: e.target.checked })} />
              Destaque
            </label>
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
            <button onClick={() => setDraft(null)} className="text-xs uppercase tracking-wider px-5 py-2 border border-[rgba(26,26,26,0.2)] hover:bg-[rgba(26,26,26,0.04)]">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col divide-y divide-[rgba(26,26,26,0.08)] bg-white border border-[rgba(26,26,26,0.08)]">
        {rows.length === 0 && <p className="text-sm text-[#6B6560] p-6">Ainda não há projetos.</p>}
        {rows.map(row => (
          <div key={row.id} className="flex items-center gap-4 p-4">
            <div className="w-16 h-12 bg-[#2A2A2A] shrink-0 overflow-hidden">
              {row.cover_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.cover_image} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{row.title}</p>
              <p className="text-xs text-[#6B6560] truncate">
                {[(row.categories && row.categories.length ? row.categories.join(', ') : row.category), row.location, row.year].filter(Boolean).join(' · ')}
              </p>
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
