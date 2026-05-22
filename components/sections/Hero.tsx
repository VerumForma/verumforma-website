'use client'

import { motion } from 'framer-motion'
import type { Easing } from 'framer-motion'
import type { Dictionary } from '@/lib/getDictionary'

type Props = {
  dict: Dictionary
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as Easing },
})

export default function Hero({ dict }: Props) {
  const h = dict.hero
  const s = dict.stats

  const stats = [
    { label: s.founded_label, value: s.founded_value },
    { label: s.projects_label, value: s.projects_value },
    { label: s.clients_label, value: s.clients_value },
    { label: s.experience_label, value: s.experience_value },
  ]

  return (
    <section
      className="min-h-screen flex flex-col justify-between pt-32 pb-0 px-6 md:px-12"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
        {/* Badge */}
        <motion.div {...fadeUp(0.1)}>
          <span
            className="inline-block text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560] border border-[rgba(26,26,26,0.2)] px-4 py-1.5"
            style={{ borderRadius: '2px' }}
          >
            {h.badge}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.2)}
          className="font-playfair text-5xl md:text-7xl lg:text-8xl font-normal text-[#1A1A1A] leading-[1.05] max-w-4xl"
        >
          {h.headline}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          {...fadeUp(0.35)}
          className="font-sans text-base md:text-lg text-[#6B6560] max-w-md leading-relaxed"
        >
          {h.subtext}
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.5)} className="flex items-center gap-4 flex-wrap">
          <a
            href={`#projetos`}
            className="font-sans text-sm tracking-[0.1em] uppercase bg-[#1A1A1A] text-[#F5F2EE] px-8 py-3 hover:bg-[#333] transition-colors"
            style={{ borderRadius: '2px' }}
          >
            {h.cta_primary}
          </a>
          <a
            href={`#orcamento`}
            className="font-sans text-sm tracking-[0.1em] uppercase border border-[#1A1A1A] text-[#1A1A1A] px-8 py-3 hover:bg-[#1A1A1A] hover:text-[#F5F2EE] transition-colors"
            style={{ borderRadius: '2px' }}
          >
            {h.cta_secondary}
          </a>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        {...fadeUp(0.7)}
        className="max-w-7xl mx-auto w-full border-t border-[rgba(26,26,26,0.1)] mt-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`py-8 px-6 flex flex-col gap-1 ${i < stats.length - 1 ? 'border-r border-[rgba(26,26,26,0.1)]' : ''}`}
            >
              <span className="font-playfair text-2xl md:text-3xl text-[#1A1A1A]">{stat.value}</span>
              <span className="font-sans text-xs tracking-[0.1em] uppercase text-[#6B6560]">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
