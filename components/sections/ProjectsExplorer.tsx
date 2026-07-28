'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Square } from 'lucide-react'
import type { Dictionary } from '@/lib/getDictionary'
import type { Project } from '@/lib/supabase/types'

type Props = { dict: Dictionary; lang: string; projects: Project[] }
type Sort = 'name' | 'year' | 'location'

function yearNum(y: string | null) {
  const n = parseInt((y ?? '').replace(/\D/g, ''), 10)
  return isNaN(n) ? -1 : n
}

export default function ProjectsExplorer({ dict, lang, projects }: Props) {
  const t = dict.all_projects
  const [category, setCategory] = useState<string>('__all')
  const [year, setYear] = useState<string>('__all')
  const [sort, setSort] = useState<Sort>('name')

  const categories = useMemo(
    () => Array.from(new Set(projects.map(p => p.category).filter(Boolean))) as string[],
    [projects]
  )
  const years = useMemo(
    () => Array.from(new Set(projects.map(p => p.year).filter(Boolean))).sort((a, b) => yearNum(b as string) - yearNum(a as string)) as string[],
    [projects]
  )

  const visible = useMemo(() => {
    let list = projects.filter(p =>
      (category === '__all' || p.category === category) &&
      (year === '__all' || p.year === year)
    )
    list = [...list].sort((a, b) => {
      if (sort === 'name') return a.title.localeCompare(b.title)
      if (sort === 'location') return (a.location ?? '').localeCompare(b.location ?? '')
      return yearNum(b.year) - yearNum(a.year)
    })
    return list
  }, [projects, category, year, sort])

  const pill = (active: boolean) =>
    `text-xs uppercase tracking-wider px-3 py-1.5 border transition-colors ${
      active ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-[rgba(26,26,26,0.15)] text-[#6B6560] hover:border-[#1A1A1A]'
    }`
  const select =
    'text-xs uppercase tracking-wider bg-transparent border border-[rgba(26,26,26,0.15)] px-3 py-1.5 outline-none focus:border-[#1A1A1A]'

  return (
    <section className="py-28 px-6 md:px-12 min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560] mb-4">{dict.projects.label}</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-[rgba(26,26,26,0.1)] pb-6">
          <h1 className="font-playfair text-4xl md:text-5xl text-[#1A1A1A]">{t.title}</h1>
          <p className="font-sans text-sm text-[#6B6560] max-w-sm md:text-right">{t.subtitle}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            <button className={pill(category === '__all')} onClick={() => setCategory('__all')}>{t.all}</button>
            {categories.map(c => (
              <button key={c} className={pill(category === c)} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <div className="flex gap-3 shrink-0">
            <select className={select} value={year} onChange={e => setYear(e.target.value)}>
              <option value="__all">{t.filter_year}: {t.all}</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select className={select} value={sort} onChange={e => setSort(e.target.value as Sort)}>
              <option value="name">{t.sort_name}</option>
              <option value="year">{t.sort_year}</option>
              <option value="location">{t.sort_location}</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <p className="text-sm text-[#6B6560] py-16 text-center">{t.empty}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((pr, i) => (
              <motion.div
                key={pr.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.04 }}
                className="group"
              >
                <Link href={`/${lang}/projetos/${pr.id}`} className="block cursor-pointer">
                  <div className="relative w-full aspect-[4/3] flex items-center justify-center mb-4 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]" style={{ backgroundColor: '#2A2A2A' }}>
                    {pr.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pr.cover_image} alt={pr.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <Square size={24} className="text-[rgba(255,255,255,0.15)]" />
                    )}
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-playfair text-base text-[#1A1A1A] leading-snug mb-1">{pr.title}</h3>
                      <p className="font-sans text-xs text-[#6B6560] tracking-wide">
                        {[pr.category, pr.location, pr.year].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-[#6B6560] mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
