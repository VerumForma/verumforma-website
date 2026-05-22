'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Dictionary } from '@/lib/getDictionary'

type Props = { dict: Dictionary }

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
})

export default function Process({ dict }: Props) {
  const p = dict.process

  return (
    <section id="processo" className="py-24 px-6 md:px-12" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="max-w-7xl mx-auto">
        {/* Label */}
        <p className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560] mb-16">
          {p.label}
        </p>

        {/* Steps — horizontal on desktop, stacked on mobile */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-0">
          {p.steps.map((step, i) => (
            <div key={i} className="flex lg:flex-col flex-row flex-1">
              {/* Step content */}
              <motion.div {...fadeUp(i)} className="flex-1 lg:pr-6">
                <p className="font-playfair text-5xl text-[rgba(255,255,255,0.12)] leading-none mb-6">
                  {step.number}
                </p>
                <h3 className="font-sans text-sm font-medium tracking-wide text-white mb-3">
                  {step.title}
                </h3>
                <p className="font-sans text-xs text-[#6B6560] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Connector — arrow between steps, hidden on last */}
              {i < p.steps.length - 1 && (
                <div className="flex items-start lg:items-center lg:flex-row flex-col">
                  {/* Mobile: vertical line */}
                  <div className="lg:hidden w-px h-12 bg-[rgba(255,255,255,0.08)] mx-4 mt-4" />
                  {/* Desktop: horizontal line + arrow */}
                  <div className="hidden lg:flex items-center gap-0 mt-10">
                    <div className="w-8 h-px bg-[rgba(255,255,255,0.12)]" />
                    <ArrowRight size={12} className="text-[rgba(255,255,255,0.12)] -ml-1" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
