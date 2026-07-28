'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { User, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Dictionary } from '@/lib/getDictionary'
import type { TeamMember } from '@/lib/supabase/types'

type Props = { dict: Dictionary; team?: TeamMember[] }

export default function Team({ dict, team }: Props) {
  const t = dict.team
  const hasData = team && team.length > 0
  const scroller = useRef<HTMLDivElement>(null)

  function page(dir: -1 | 1) {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <section id="equipa" className="py-24 px-6 md:px-12" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560] mb-6">{t.label}</p>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <h2 className="font-playfair text-4xl md:text-5xl text-[#1A1A1A]">{t.headline}</h2>
          <p className="font-sans text-sm text-[#6B6560] max-w-sm md:text-right">{t.subtext}</p>
        </div>

        {hasData ? (
          <div className="relative">
            {team!.length > 4 && (
              <div className="flex justify-end gap-2 mb-4">
                <button onClick={() => page(-1)} aria-label="Anterior" className="w-9 h-9 flex items-center justify-center border border-[rgba(26,26,26,0.15)] hover:border-[#1A1A1A] transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => page(1)} aria-label="Seguinte" className="w-9 h-9 flex items-center justify-center border border-[rgba(26,26,26,0.15)] hover:border-[#1A1A1A] transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
            <div
              ref={scroller}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
              style={{ scrollbarWidth: 'none' }}
            >
              {team!.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.06 }}
                  className="flex flex-col gap-3 flex-none snap-start w-[72%] sm:w-[45%] md:w-[30%] lg:w-[calc(25%-1.125rem)]"
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#2A2A2A' }}>
                    {member.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.photo} alt={member.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <User size={28} className="text-[rgba(255,255,255,0.15)]" />
                    )}
                  </div>
                  <p className="font-playfair text-base text-[#1A1A1A]">{member.name}</p>
                  {member.role && <p className="font-sans text-xs text-[#6B6560] tracking-wide -mt-2">{member.role}</p>}
                  {member.bio && <p className="font-sans text-xs text-[#6B6560] leading-relaxed">{member.bio}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="w-full aspect-[3/4]" style={{ backgroundColor: '#2A2A2A' }} />
                  <p className="font-playfair text-base text-[#1A1A1A]">—</p>
                  <p className="font-sans text-xs text-[#6B6560] tracking-wide">—</p>
                </div>
              ))}
            </div>
            <p className="font-sans text-xs text-[#6B6560] tracking-[0.12em] uppercase">{t.coming_soon}</p>
          </>
        )}
      </div>
    </section>
  )
}
