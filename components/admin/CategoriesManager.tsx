'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/supabase/types'

const input =
  'w-full bg-white text-sm px-3 py-2 border border-[rgba(26,26,26,0.15)] outline-none focus:border-[#1A1A1A] transition-colors'

export default function CategoriesManager({ initial }: { initial: Category[] }) {
  const supabase = createClient()
  const [rows, setRows] = useState<Category[]>(initial)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function refresh() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    setRows(data ?? [])
  }

  async function add() {
    if (!name.trim()) return
    setBusy(true); setError('')
    const { error } = await supabase.from('categories').insert({ name: name.trim() })
    setBusy(false)
    if (error) { setError(error.message); return }
    setName(''); refresh()
  }

  async function rename(row: Category) {
    const next = prompt('Novo nome da categoria:', row.name)
    if (!next || !next.trim() || next === row.name) return
    const { error } = await supabase.from('categories').update({ name: next.trim() }).eq('id', row.id)
    if (error) { alert(error.message); return }
    refresh()
  }

  async function remove(id: string) {
    if (!confirm('Eliminar esta categoria? Projetos já classificados mantêm o texto atual.')) return
    await supabase.from('categories').delete().eq('id', id)
    refresh()
  }

  return (
    <div>
      <h1 className="font-playfair text-3xl mb-1">Categorias</h1>
      <p className="text-sm text-[#6B6560] mb-8">As categorias disponíveis ao classificar projetos e a filtrar no site.</p>

      <div className="flex gap-3 mb-8 max-w-md">
        <input
          className={input}
          placeholder="Nova categoria (ex: Comercial)"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') add() }}
        />
        <button onClick={add} disabled={busy} className="text-xs uppercase tracking-wider bg-[#1A1A1A] text-white px-5 hover:opacity-80 disabled:opacity-50 shrink-0">
          Adicionar
        </button>
      </div>
      {error && <p className="text-xs text-red-500 -mt-6 mb-6">{error}</p>}

      <div className="flex flex-col divide-y divide-[rgba(26,26,26,0.08)] bg-white border border-[rgba(26,26,26,0.08)] max-w-md">
        {rows.length === 0 && <p className="text-sm text-[#6B6560] p-6">Ainda não há categorias.</p>}
        {rows.map(row => (
          <div key={row.id} className="flex items-center gap-4 p-4">
            <span className="flex-1 text-sm">{row.name}</span>
            <button onClick={() => rename(row)} className="text-xs text-[#1A1A1A] hover:underline">Renomear</button>
            <button onClick={() => remove(row.id)} className="text-xs text-red-500 hover:underline">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  )
}
