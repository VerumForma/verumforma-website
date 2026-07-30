'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase } from 'lucide-react'
import type { Dictionary } from '@/lib/getDictionary'
import type { Opening } from '@/lib/supabase/types'

type Props = { dict: Dictionary; lang: string; openings: Opening[] }
type Sort = 'title' | 'deadline'

export default function OpeningsExplorer({ dict, lang, openings }: Props) {
  const t = dict.openings
  const [type, setType] = useState('__all')
  const [dept, setDept] = useState('__all')
  const [sort, setSort] = useState<Sort>('title')

  const types = useMemo(
    () => Array.from(new Set(openings.map(o => o.employment_type).filter(Boolean))) as string[],
    [openings]
  )
  const depts = useMemo(
    () => Array.from(new Set(openings.map(o => o.department).filter(Boolean))) as string[],
    [openings]
  )

  const visible = useMemo(() => {
    let list = openings.filter(o =>
      (type === '__all' || o.employment_type === type) &&
      (dept === '__all' || o.department === dept)
    )
    list = [...list].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      const da = a.deadline ? Date.parse(a.deadline) : Infinity
      const db = b.deadline ? Date.parse(b.deadline) : Infinity
      return da - db
    })
    return list
  }, [openings, type, dept, sort])

  const pill = (active: boolean) =>
    `text-xs uppercase tracking-wider px-3 py-1.5 border transition-colors ${
      active ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-[rgba(26,26,26,0.15)] text-[#6B6560] hover:border-[#1A1A1A]'
    }`
  const select =
    'text-xs uppercase tracking-wider bg-transparent border border-[rgba(26,26,26,0.15)] px-3 py-1.5 outline-none focus:border-[#1A1A1A]'

  return (
    <section className="py-28 px-6 md:px-12 min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560] mb-4">{t.label}</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-[rgba(26,26,26,0.1)] pb-6">
          <h1 className="font-playfair text-4xl md:text-5xl text-[#1A1A1A]">{t.title}</h1>
          <p className="font-sans text-sm text-[#6B6560] max-w-sm md:text-right">{t.subtitle}</p>
        </div>

        {openings.length > 0 && (types.length > 0 || depts.length > 0) && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              <button className={pill(type === '__all')} onClick={() => setType('__all')}>{t.all}</button>
              {types.map(c => (
                <button key={c} className={pill(type === c)} onClick={() => setType(c)}>{c}</button>
              ))}
            </div>
            <div className="flex gap-3 shrink-0">
              {depts.length > 0 && (
                <select className={select} value={dept} onChange={e => setDept(e.target.value)}>
                  <option value="__all">{t.filter_department}: {t.all}</option>
                  {depts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              )}
              <select className={select} value={sort} onChange={e => setSort(e.target.value as Sort)}>
                <option value="title">{t.sort_title}</option>
                <option value="deadline">{t.sort_deadline}</option>
              </select>
            </div>
          </div>
        )}

        {visible.length === 0 ? (
          <p className="text-sm text-[#6B6560] py-16 text-center">{t.empty}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((o, i) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.04 }}
              >
                <Link href={`/${lang}/oportunidades/${o.id}`} className="group block h-full border border-[rgba(26,26,26,0.12)] p-6 hover:border-[#1A1A1A] transition-colors">
                  <Briefcase size={18} className="text-[#6B6560] mb-4" />
                  <h3 className="font-playfair text-xl text-[#1A1A1A] leading-snug mb-2">{o.title}</h3>
                  <p className="font-sans text-xs text-[#6B6560] tracking-wide">
                    {[o.employment_type, o.work_mode, o.location, o.department].filter(Boolean).join(' · ')}
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase font-sans text-[#1A1A1A] mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.apply} <ArrowRight size={13} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
