'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  value: string | null
  onChange: (url: string | null) => void
  folder: string
  aspect?: string
}

export default function ImageUpload({ value, onChange, folder, aspect = 'aspect-[4/3]' }: Props) {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: upErr } = await supabase.storage.from('media').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (upErr) {
      setError(upErr.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('media').getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div>
      <div className={`relative w-full ${aspect} bg-[#2A2A2A] overflow-hidden mb-2 flex items-center justify-center`}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-[#6B6560]">sem imagem</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <label className="text-xs uppercase tracking-wider text-[#1A1A1A] border border-[#1A1A1A] px-3 py-2 cursor-pointer hover:bg-[#1A1A1A] hover:text-white transition-colors">
          {uploading ? 'A carregar…' : value ? 'Substituir' : 'Carregar imagem'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-[#6B6560] hover:text-red-500 transition-colors"
          >
            Remover
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
