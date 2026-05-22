'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Square } from 'lucide-react'
import type { Dictionary } from '@/lib/getDictionary'

type Props = { dict: Dictionary }

const projects = [
  { title: 'Complexo de escritórios Avenida Norte', category: 'Comercial', location: 'Lisboa', year: '2024' },
  { title: 'Moradia privada Cascais', category: 'Residencial', location: 'Cascais', year: '2023' },
  { title: 'Centro logístico Setúbal', category: 'Industrial', location: 'Setúbal', year: '2023' },
  { title: 'Desenvolvimento misto Parque das Nações', category: 'Misto', location: 'Lisboa', year: 'Em curso' },
  { title: 'Reabilitação Ponte Ribeira', category: 'Civil', location: 'Porto', year: '2022' },
]

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
})

export default function Projects({ dict }: Props) {
  const p = dict.projects

  return (
    <section id="projetos" className="py-24 px-6 md:px-12" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 border-b border-[rgba(26,26,26,0.1)] pb-6">
          <span className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560]">{p.label}</span>
          <a href="#" className="flex items-center gap-2 text-xs tracking-[0.12em] uppercase font-sans text-[#1A1A1A] hover:opacity-60 transition-opacity">
            {p.cta} <ArrowRight size={14} />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div key={i} {...fadeUp(i)} className="group cursor-pointer">
              {/* Image placeholder */}
              <div
                className="relative w-full aspect-[4/3] flex items-center justify-center mb-4 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
                style={{ backgroundColor: '#2A2A2A' }}
              >
                <Square size={24} className="text-[rgba(255,255,255,0.15)]" />
              </div>
              {/* Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-playfair text-base text-[#1A1A1A] leading-snug mb-1">{project.title}</h3>
                  <p className="font-sans text-xs text-[#6B6560] tracking-wide">
                    {project.category} · {project.location} · {project.year}
                  </p>
                </div>
                <ArrowRight size={16} className="text-[#6B6560] mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
