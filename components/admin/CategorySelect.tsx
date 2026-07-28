'use client'

import { useState, useRef, useEffect } from 'react'
import type { Category } from '@/lib/supabase/types'

type Props = {
  value: string | null
  onChange: (name: string | null) => void
  categories: Category[]
}

// Searchable single-select dropdown for picking a category by name.
export default function CategorySelect({ value, onChange, categories }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full bg-white text-sm px-3 py-2 border border-[rgba(26,26,26,0.15)] text-left flex items-center justify-between focus:border-[#1A1A1A] outline-none"
      >
        <span className={value ? '' : 'text-[#6B6560]'}>{value || 'Selecionar categoria'}</span>
        <span className="text-[#6B6560] text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-[rgba(26,26,26,0.15)] shadow-lg max-h-64 overflow-y-auto">
          <input
            autoFocus
            className="w-full text-sm px-3 py-2 border-b border-[rgba(26,26,26,0.1)] outline-none"
            placeholder="Procurar…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {value && (
            <button
              type="button"
              onClick={() => { onChange(null); setOpen(false); setQuery('') }}
              className="w-full text-left text-xs text-[#6B6560] px-3 py-2 hover:bg-[rgba(26,26,26,0.04)]"
            >
              Limpar seleção
            </button>
          )}
          {categories.length === 0 && (
            <p className="text-xs text-[#6B6560] px-3 py-3">Sem categorias. Crie em “Categorias”.</p>
          )}
          {filtered.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => { onChange(c.name); setOpen(false); setQuery('') }}
              className={`w-full text-left text-sm px-3 py-2 hover:bg-[rgba(26,26,26,0.04)] ${value === c.name ? 'font-medium' : ''}`}
            >
              {c.name}
            </button>
          ))}
          {categories.length > 0 && filtered.length === 0 && (
            <p className="text-xs text-[#6B6560] px-3 py-3">Sem resultados.</p>
          )}
        </div>
      )}
    </div>
  )
}
