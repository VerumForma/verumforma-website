'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Dictionary } from '@/lib/getDictionary'
import type { Opening } from '@/lib/supabase/types'

type Props = { dict: Dictionary; lang: string; openings: Opening[] }

const LIMIT = 3

function meta(o: Opening) {
  return [o.employment_type, o.work_mode, o.location, o.department].filter(Boolean).join(' · ')
}

export default function Openings({ dict, lang, openings }: Props) {
  const t = dict.openings
  if (!openings || openings.length === 0) return null

  const shown = openings.slice(0, LIMIT)

  return (
    <section id="oportunidades" className="py-24 px-6 md:px-12 border-t border-[rgba(26,26,26,0.06)]" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header — centrado, tom editorial */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560] mb-4">{t.label}</p>
          <h2 className="font-playfair text-3xl md:text-4xl text-[#1A1A1A] leading-tight">{t.home_teaser}</h2>
        </div>

        {/* Lista limitada de vagas, separada por linhas finas */}
        <div className="flex flex-col border-t border-[rgba(26,26,26,0.12)]">
          {shown.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/${lang}/oportunidades/${o.id}`}
                className="group flex items-center justify-between gap-6 py-6 border-b border-[rgba(26,26,26,0.12)]"
              >
                <div className="min-w-0">
                  <h3 className="font-playfair text-xl md:text-2xl text-[#1A1A1A] leading-snug group-hover:opacity-70 transition-opacity">{o.title}</h3>
                  <p className="font-sans text-xs text-[#6B6560] tracking-wide mt-1">{meta(o)}</p>
                </div>
                <ArrowUpRight size={20} className="text-[#6B6560] shrink-0 group-hover:text-[#1A1A1A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Botão para a página completa (como o do menu) */}
        <div className="mt-10 text-center">
          <Link
            href={`/${lang}/oportunidades`}
            className="inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase font-sans text-[#1A1A1A] border border-[#1A1A1A] px-6 py-3 hover:bg-[#1A1A1A] hover:text-[#F5F2EE] transition-colors"
          >
            {t.cta}{openings.length > LIMIT ? ` (${openings.length})` : ''} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
