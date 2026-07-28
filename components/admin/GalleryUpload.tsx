'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  value: string[]
  onChange: (urls: string[]) => void
  folder: string
}

// Manages an ordered list of gallery image URLs (Supabase Storage).
export default function GalleryUpload({ value, onChange, folder }: Props) {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setUploading(true); setError('')
    const uploaded: string[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage.from('media').upload(path, file, { cacheControl: '3600', upsert: false })
      if (upErr) { setError(upErr.message); continue }
      uploaded.push(supabase.storage.from('media').getPublicUrl(path).data.publicUrl)
    }
    onChange([...value, ...uploaded])
    setUploading(false)
    e.target.value = ''
  }

  function move(i: number, dir: -1 | 1) {
    const next = [...value]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-3">
        {value.map((url, i) => (
          <div key={url + i} className="relative group">
            <div className="aspect-[4/3] bg-[#2A2A2A] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-[#6B6560]">
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} className="hover:text-[#1A1A1A]">←</button>
                <button type="button" onClick={() => move(i, 1)} className="hover:text-[#1A1A1A]">→</button>
              </div>
              <button type="button" onClick={() => removeAt(i)} className="hover:text-red-500">remover</button>
            </div>
          </div>
        ))}
      </div>
      <label className="text-xs uppercase tracking-wider text-[#1A1A1A] border border-[#1A1A1A] px-3 py-2 cursor-pointer hover:bg-[#1A1A1A] hover:text-white transition-colors inline-block">
        {uploading ? 'A carregar…' : 'Adicionar imagens'}
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" disabled={uploading} />
      </label>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
