'use client'

import { motion } from 'framer-motion'
import type { Dictionary } from '@/lib/getDictionary'

type Props = { dict: Dictionary }

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
})

export default function Team({ dict }: Props) {
  const t = dict.team

  return (
    <section id="equipa" className="py-24 px-6 md:px-12" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560] mb-6">{t.label}</p>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <h2 className="font-playfair text-4xl md:text-5xl text-[#1A1A1A]">{t.headline}</h2>
          <p className="font-sans text-sm text-[#6B6560] max-w-sm md:text-right">{t.subtext}</p>
        </div>

        {/* Placeholder grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[0, 1, 2, 3].map(i => (
            <motion.div key={i} {...fadeUp(i)} className="flex flex-col gap-3">
              <div
                className="w-full aspect-square"
                style={{ backgroundColor: '#2A2A2A' }}
              />
              <p className="font-playfair text-base text-[#1A1A1A]">—</p>
              <p className="font-sans text-xs text-[#6B6560] tracking-wide">—</p>
            </motion.div>
          ))}
        </div>

        <p className="font-sans text-xs text-[#6B6560] tracking-[0.12em] uppercase">{t.coming_soon}</p>
      </div>
    </section>
  )
}
