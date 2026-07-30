'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { JobApplication } from '@/lib/supabase/types'

const STATUSES: JobApplication['status'][] = ['new', 'read', 'handled', 'archived']
const statusLabel: Record<JobApplication['status'], string> = {
  new: 'Nova', read: 'Lida', handled: 'Tratada', archived: 'Arquivada',
}

export default function ApplicationsManager({ initial }: { initial: JobApplication[] }) {
  const supabase = createClient()
  const [rows, setRows] = useState<JobApplication[]>(initial)
  const [open, setOpen] = useState<string | null>(null)
  const [status, setStatus] = useState<'all' | JobApplication['status']>('all')
  const [vaga, setVaga] = useState<string>('__all')

  const vagas = useMemo(
    () => Array.from(new Set(rows.map(r => r.opening_title).filter(Boolean))) as string[],
    [rows]
  )

  async function setRowStatus(id: string, s: JobApplication['status']) {
    await supabase.from('job_applications').update({ status: s }).eq('id', id)
    setRows(rows.map(r => (r.id === id ? { ...r, status: s } : r)))
  }

  const visible = rows.filter(r =>
    (status === 'all' || r.status === status) &&
    (vaga === '__all' || r.opening_title === vaga)
  )

  return (
    <div>
      <h1 className="font-playfair text-3xl mb-1">Candidaturas</h1>
      <p className="text-sm text-[#6B6560] mb-6">Candidaturas recebidas pelo formulário das oportunidades.</p>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(['all', ...STATUSES] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`text-xs uppercase tracking-wider px-3 py-1.5 border ${status === s ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-[rgba(26,26,26,0.15)] text-[#6B6560] hover:border-[#1A1A1A]'}`}
          >
            {s === 'all' ? 'Todas' : statusLabel[s]}
          </button>
        ))}
        {vagas.length > 0 && (
          <select value={vaga} onChange={e => setVaga(e.target.value)} className="ml-auto text-xs uppercase tracking-wider bg-white border border-[rgba(26,26,26,0.15)] px-3 py-1.5 outline-none focus:border-[#1A1A1A]">
            <option value="__all">Todas as vagas</option>
            {vagas.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        )}
      </div>

      <div className="flex flex-col divide-y divide-[rgba(26,26,26,0.08)] bg-white border border-[rgba(26,26,26,0.08)]">
        {visible.length === 0 && <p className="text-sm text-[#6B6560] p-6">Sem candidaturas.</p>}
        {visible.map(row => (
          <div key={row.id} className="p-4">
            <div className="flex items-center gap-4">
              <button className="flex-1 min-w-0 text-left" onClick={() => setOpen(open === row.id ? null : row.id)}>
                <p className={`text-sm truncate ${row.status === 'new' ? 'font-semibold' : ''}`}>{row.name} · {row.opening_title || '—'}</p>
                <p className="text-xs text-[#6B6560] truncate">{row.email} · {new Date(row.created_at).toLocaleString('pt-PT')}</p>
              </button>
              <select
                value={row.status}
                onChange={e => setRowStatus(row.id, e.target.value as JobApplication['status'])}
                className="text-xs border border-[rgba(26,26,26,0.15)] px-2 py-1 bg-white"
              >
                {STATUSES.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
              </select>
            </div>
            {open === row.id && (
              <div className="mt-4 pt-4 border-t border-[rgba(26,26,26,0.08)] text-sm flex flex-col gap-2">
                <p><span className="text-[#6B6560]">Telefone:</span> {row.phone || '—'}</p>
                <p><span className="text-[#6B6560]">CV / Link:</span> {row.cv_url ? <a href={row.cv_url} target="_blank" rel="noreferrer" className="underline">{row.cv_url}</a> : '—'}</p>
                <p className="whitespace-pre-wrap mt-1">{row.message || '—'}</p>
                <a href={`mailto:${row.email}?subject=${encodeURIComponent(`Candidatura — ${row.opening_title ?? ''}`)}`} className="text-xs uppercase tracking-wider underline mt-2 self-start">Responder por email</a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
