'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Dictionary } from '@/lib/getDictionary'

type Props = { dict: Dictionary }

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
})

export default function About({ dict }: Props) {
  const a = dict.about

  const values = [
    { title: a.value1_title, desc: a.value1_desc },
    { title: a.value2_title, desc: a.value2_desc },
    { title: a.value3_title, desc: a.value3_desc },
    { title: a.value4_title, desc: a.value4_desc },
    { title: a.value5_title, desc: a.value5_desc },
  ].filter(v => v.title || v.desc)

  return (
    <section id="sobre" className="py-24 px-6 md:px-12" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="max-w-7xl mx-auto">
        {/* Label */}
        <motion.p {...fadeUp(0)} className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560] mb-12">
          {a.label}
        </motion.p>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — copy */}
          <div className="flex flex-col gap-6 justify-between">
            <motion.h2 {...fadeUp(0.1)} className="font-playfair text-4xl md:text-5xl text-white leading-[1.1]">
              {a.headline}
            </motion.h2>
            <motion.p {...fadeUp(0.2)} className="font-sans text-base text-[#9E9994] leading-relaxed">
              {a.body1}
            </motion.p>
            <motion.p {...fadeUp(0.25)} className="font-sans text-base text-[#9E9994] leading-relaxed">
              {a.body2}
            </motion.p>
            <motion.a
              {...fadeUp(0.35)}
              href="#equipa"
              className="flex items-center gap-2 text-xs tracking-[0.12em] uppercase font-sans text-white hover:opacity-60 transition-opacity w-fit mt-2"
            >
              {a.cta} <ArrowRight size={14} />
            </motion.a>
          </div>

          {/* Right — values */}
          <div className="flex flex-col">
            {values.map((val, i) => (
              <motion.div
                key={i}
                {...fadeUp(0.1 + i * 0.08)}
                className={`py-6 ${i > 0 ? 'border-t border-[rgba(255,255,255,0.08)]' : ''}`}
              >
                <p className="font-playfair text-2xl md:text-3xl text-white mb-1.5">{val.title}</p>
                <p className="font-sans text-sm text-[#9E9994] leading-relaxed max-w-md">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
