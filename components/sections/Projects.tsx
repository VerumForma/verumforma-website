'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Square } from 'lucide-react'
import type { Dictionary } from '@/lib/getDictionary'
import type { Project } from '@/lib/supabase/types'

type Props = { dict: Dictionary; lang: string; projects?: Project[] }

// Fallback shown before any real projects are published in the admin.
const placeholderProjects = [
  { title: 'Complexo de escritórios Avenida Norte', category: 'Comercial', location: 'Lisboa', year: '2024' },
  { title: 'Moradia privada Cascais', category: 'Residencial', location: 'Cascais', year: '2023' },
  { title: 'Centro logístico Setúbal', category: 'Industrial', location: 'Setúbal', year: '2023' },
]

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

function metaLine(parts: (string | null | undefined)[]) {
  return parts.filter(Boolean).join(' · ')
}

export default function Projects({ dict, lang, projects }: Props) {
  const p = dict.projects
  const hasData = projects && projects.length > 0
  const total = projects?.length ?? 0

  // One row only (3 on desktop).
  const items = hasData
    ? projects!.slice(0, 3).map(pr => ({
        id: pr.id,
        title: pr.title,
        meta: metaLine([(pr.categories && pr.categories.length ? pr.categories.join(', ') : pr.category), pr.location, pr.year]),
        image: pr.cover_image,
      }))
    : placeholderProjects.map(pr => ({
        id: null as string | null,
        title: pr.title,
        meta: metaLine([pr.category, pr.location, pr.year]),
        image: null as string | null,
      }))

  const CardInner = ({ item }: { item: (typeof items)[number] }) => (
    <>
      <div
        className="relative w-full aspect-[4/3] flex items-center justify-center mb-4 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
        style={{ backgroundColor: '#2A2A2A' }}
      >
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        ) : (
          <Square size={24} className="text-[rgba(255,255,255,0.15)]" />
        )}
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-playfair text-base text-[#1A1A1A] leading-snug mb-1">{item.title}</h3>
          <p className="font-sans text-xs text-[#6B6560] tracking-wide">{item.meta}</p>
        </div>
        <ArrowRight size={16} className="text-[#6B6560] mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </>
  )

  return (
    <section id="projetos" className="py-24 px-6 md:px-12" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 border-b border-[rgba(26,26,26,0.1)] pb-6">
          <span className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560]">{p.label}</span>
          <Link href={`/${lang}/projetos`} className="flex items-center gap-2 text-xs tracking-[0.12em] uppercase font-sans text-[#1A1A1A] hover:opacity-60 transition-opacity">
            {p.cta}{total > 3 ? ` (${total})` : ''} <ArrowRight size={14} />
          </Link>
        </div>

        {/* One-row grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div key={item.id ?? i} {...fadeUp(i)} className="group cursor-pointer">
              {item.id ? (
                <Link href={`/${lang}/projetos/${item.id}`} className="block">
                  <CardInner item={item} />
                </Link>
              ) : (
                <CardInner item={item} />
              )}
            </motion.div>
          ))}
        </div>

        {total > 3 && (
          <div className="mt-10 text-center">
            <Link
              href={`/${lang}/projetos`}
              className="inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase font-sans text-[#1A1A1A] border border-[#1A1A1A] px-6 py-3 hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              {p.cta} ({total}) <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
