'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SocialMedia } from '@/lib/supabase/types'
import type { SocialLinks } from '@/lib/data'
import ImageUpload from './ImageUpload'

const input =
  'w-full bg-white text-sm px-3 py-2 border border-[rgba(26,26,26,0.15)] outline-none focus:border-[#1A1A1A] transition-colors'
const label = 'block text-xs uppercase tracking-wider text-[#6B6560] mb-1'

type Draft = Partial<SocialMedia>
const ASPECT: Record<string,string> = { square: 'aspect-square', landscape: 'aspect-video', portrait: 'aspect-[9/16]' }
const empty: Draft = { platform: 'instagram', aspect_ratio: 'square', title: '', thumbnail_url: null, link: '', sort_order: 0, published: false }

export default function SocialManager({ initialLinks, initialMedia }: { initialLinks: SocialLinks; initialMedia: SocialMedia[] }) {
  const supabase = createClient()

  // --- profile links ---
  const [links, setLinks] = useState<SocialLinks>(initialLinks || {})
  const [linksMsg, setLinksMsg] = useState('')
  const [savingLinks, setSavingLinks] = useState(false)
  async function saveLinks() {
    setSavingLinks(true); setLinksMsg('')
    const { error } = await supabase.from('site_content').upsert({ section: 'social_links', locale: 'pt', data: links }, { onConflict: 'section,locale' })
    setSavingLinks(false)
    setLinksMsg(error ? 'Erro: ' + error.message : 'Guardado ✓')
  }
  const setLink = (k: keyof SocialLinks, v: string) => setLinks(l => ({ ...l, [k]: v }))

  // --- carousel media ---
  const [rows, setRows] = useState<SocialMedia[]>(initialMedia)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  async function refresh() {
    const { data } = await supabase.from('social_media').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false })
    setRows(data ?? [])
  }
  async function save() {
    if (!draft?.link?.trim()) { setError('O link é obrigatório.'); return }
    setSaving(true); setError('')
    const payload = {
      platform: draft.platform || 'instagram',
      aspect_ratio: draft.aspect_ratio || null,
      title: draft.title || null,
      thumbnail_url: draft.thumbnail_url || null,
      link: draft.link,
      sort_order: Number(draft.sort_order) || 0,
      published: !!draft.published,
    }
    const { error } = draft.id
      ? await supabase.from('social_media').update(payload).eq('id', draft.id)
      : await supabase.from('social_media').insert(payload)
    setSaving(false)
    if (error) { setError(error.message); return }
    setDraft(null); refresh()
  }
  async function remove(id: string) {
    if (!confirm('Eliminar este item?')) return
    await supabase.from('social_media').delete().eq('id', id); refresh()
  }
  async function togglePublish(row: SocialMedia) {
    await supabase.from('social_media').update({ published: !row.published }).eq('id', row.id); refresh()
  }

  return (
    <div>
      <h1 className="font-playfair text-3xl mb-1">Redes sociais</h1>
      <p className="text-sm text-[#6B6560] mb-8">Links dos perfis (rodapé) e itens do carrossel na página inicial.</p>

      {/* Perfis */}
      <div className="bg-white border border-[rgba(26,26,26,0.12)] p-6 mb-10 max-w-2xl">
        <h2 className="font-playfair text-xl mb-4">Perfis (rodapé)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([['instagram','Instagram'],['facebook','Facebook'],['youtube','YouTube'],['linkedin','LinkedIn'],['email','Email']] as const).map(([k, lbl]) => (
            <div key={k}>
              <label className={label}>{lbl}</label>
              <input className={input} placeholder={k === 'email' ? 'geral@verumforma.pt' : 'https://…'} value={(links[k] as string) ?? ''} onChange={e => setLink(k, e.target.value)} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-5">
          <button onClick={saveLinks} disabled={savingLinks} className="text-xs uppercase tracking-wider bg-[#1A1A1A] text-white px-5 py-2 hover:opacity-80 disabled:opacity-50">{savingLinks ? 'A guardar…' : 'Guardar perfis'}</button>
          {linksMsg && <span className="text-xs text-[#6B6560]">{linksMsg}</span>}
        </div>
      </div>

      {/* Carrossel */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-playfair text-xl">Carrossel ({rows.length})</h2>
        <button onClick={() => { setDraft({ ...empty }); setError('') }} className="text-xs uppercase tracking-wider bg-[#1A1A1A] text-white px-4 py-2 hover:opacity-80">Novo item</button>
      </div>

      {draft && (
        <div className="bg-white border border-[rgba(26,26,26,0.12)] p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label}>Plataforma</label>
              <select className={input} value={draft.platform ?? 'instagram'} onChange={e => setDraft({ ...draft, platform: e.target.value as SocialMedia['platform'] })}>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <div>
              <label className={label}>Formato da imagem</label>
              <select className={input} value={draft.aspect_ratio ?? 'square'} onChange={e => setDraft({ ...draft, aspect_ratio: e.target.value })}>
                <option value="square">Quadrado (1:1)</option>
                <option value="landscape">Horizontal (16:9)</option>
                <option value="portrait">Vertical / telemóvel (9:16)</option>
              </select>
            </div>
            <div>
              <label className={label}>Ordem</label>
              <input type="number" className={input} value={draft.sort_order ?? 0} onChange={e => setDraft({ ...draft, sort_order: Number(e.target.value) })} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Link (para o post / vídeo) *</label>
              <input className={input} placeholder="https://…" value={draft.link ?? ''} onChange={e => setDraft({ ...draft, link: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className={label}>Legenda / título (opcional)</label>
              <input className={input} value={draft.title ?? ''} onChange={e => setDraft({ ...draft, title: e.target.value })} />
            </div>
            <div className="md:col-span-2 max-w-sm">
              <label className={label}>Imagem (thumbnail)</label>
              <ImageUpload value={draft.thumbnail_url ?? null} folder="social" aspect={ASPECT[draft.aspect_ratio ?? ''] ?? (draft.platform === 'youtube' ? 'aspect-video' : 'aspect-square')} onChange={url => setDraft({ ...draft, thumbnail_url: url })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!draft.published} onChange={e => setDraft({ ...draft, published: e.target.checked })} />
              Mostrar no carrossel
            </label>
          </div>
          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
          <div className="flex gap-3 mt-5">
            <button onClick={save} disabled={saving} className="text-xs uppercase tracking-wider bg-[#1A1A1A] text-white px-5 py-2 hover:opacity-80 disabled:opacity-50">{saving ? 'A guardar…' : 'Guardar'}</button>
            <button onClick={() => setDraft(null)} className="text-xs uppercase tracking-wider px-5 py-2 border border-[rgba(26,26,26,0.2)] hover:bg-[rgba(26,26,26,0.04)]">Cancelar</button>
          </div>
        </div>
      )}

      <div className="flex flex-col divide-y divide-[rgba(26,26,26,0.08)] bg-white border border-[rgba(26,26,26,0.08)]">
        {rows.length === 0 && <p className="text-sm text-[#6B6560] p-6">Ainda não há itens.</p>}
        {rows.map(row => (
          <div key={row.id} className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 bg-[#2A2A2A] shrink-0 overflow-hidden">
              {row.thumbnail_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.thumbnail_url} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{row.platform === 'youtube' ? 'YouTube' : 'Instagram'}{row.title ? ' · ' + row.title : ''}</p>
              <p className="text-xs text-[#6B6560] truncate">{row.link}</p>
            </div>
            <button onClick={() => togglePublish(row)} className={`text-[10px] uppercase tracking-wider px-2 py-1 ${row.published ? 'bg-green-100 text-green-800' : 'bg-[rgba(26,26,26,0.06)] text-[#6B6560]'}`}>
              {row.published ? 'Visível' : 'Oculto'}
            </button>
            <button onClick={() => { setDraft(row); setError('') }} className="text-xs text-[#1A1A1A] hover:underline">Editar</button>
            <button onClick={() => remove(row.id)} className="text-xs text-red-500 hover:underline">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  )
}
