'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Dictionary } from '@/lib/getDictionary'

type Props = { dict: Dictionary }

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
})

export default function Services({ dict }: Props) {
  const s = dict.services

  return (
    <section id="servicos" className="py-24 px-6 md:px-12" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Label */}
        <p className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560] mb-16">
          {s.label}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {s.items.map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp(i)}
              className="group border-t border-[rgba(26,26,26,0.12)] pt-8 pb-10 pr-8"
            >
              <p className="font-sans text-xs text-[#6B6560] tracking-widest mb-6">{item.number}</p>
              <div className="flex items-start gap-2">
                <h3 className="font-playfair text-xl text-[#1A1A1A] leading-snug group-hover:translate-x-1 transition-transform duration-300">
                  {item.title}
                </h3>
                <ArrowRight
                  size={16}
                  className="text-[#1A1A1A] mt-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <p className="font-sans text-sm text-[#6B6560] leading-relaxed mt-3">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
