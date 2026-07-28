'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ContactSubmission } from '@/lib/supabase/types'

const STATUSES: ContactSubmission['status'][] = ['new', 'read', 'handled', 'archived']
const statusLabel: Record<ContactSubmission['status'], string> = {
  new: 'Novo', read: 'Lido', handled: 'Tratado', archived: 'Arquivado',
}

export default function SubmissionsManager({ initial }: { initial: ContactSubmission[] }) {
  const supabase = createClient()
  const [rows, setRows] = useState<ContactSubmission[]>(initial)
  const [open, setOpen] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | ContactSubmission['status']>('all')

  async function setStatus(id: string, status: ContactSubmission['status']) {
    await supabase.from('contact_submissions').update({ status }).eq('id', id)
    setRows(rows.map(r => (r.id === id ? { ...r, status } : r)))
  }

  const visible = filter === 'all' ? rows : rows.filter(r => r.status === filter)

  return (
    <div>
      <h1 className="font-playfair text-3xl mb-1">Contactos</h1>
      <p className="text-sm text-[#6B6560] mb-6">Pedidos recebidos pelo formulário do site.</p>

      <div className="flex gap-2 mb-6">
        {(['all', ...STATUSES] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs uppercase tracking-wider px-3 py-1.5 border ${filter === s ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-[rgba(26,26,26,0.15)] text-[#6B6560] hover:border-[#1A1A1A]'}`}
          >
            {s === 'all' ? 'Todos' : statusLabel[s]}
          </button>
        ))}
      </div>

      <div className="flex flex-col divide-y divide-[rgba(26,26,26,0.08)] bg-white border border-[rgba(26,26,26,0.08)]">
        {visible.length === 0 && <p className="text-sm text-[#6B6560] p-6">Sem contactos.</p>}
        {visible.map(row => (
          <div key={row.id} className="p-4">
            <div className="flex items-center gap-4">
              <button className="flex-1 min-w-0 text-left" onClick={() => setOpen(open === row.id ? null : row.id)}>
                <p className={`text-sm truncate ${row.status === 'new' ? 'font-semibold' : ''}`}>{row.name} · {row.project_type}</p>
                <p className="text-xs text-[#6B6560] truncate">{row.email} · {new Date(row.created_at).toLocaleString('pt-PT')}</p>
              </button>
              <select
                value={row.status}
                onChange={e => setStatus(row.id, e.target.value as ContactSubmission['status'])}
                className="text-xs border border-[rgba(26,26,26,0.15)] px-2 py-1 bg-white"
              >
                {STATUSES.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
              </select>
            </div>
            {open === row.id && (
              <div className="mt-4 pt-4 border-t border-[rgba(26,26,26,0.08)] text-sm">
                <p className="whitespace-pre-wrap mb-3">{row.message}</p>
                <a href={`mailto:${row.email}`} className="text-xs uppercase tracking-wider underline">Responder por email</a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
