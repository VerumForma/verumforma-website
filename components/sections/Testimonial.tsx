'use client'

import { motion } from 'framer-motion'
import type { Dictionary } from '@/lib/getDictionary'
import type { Testimonial as TestimonialRow } from '@/lib/supabase/types'

type Props = { dict: Dictionary; testimonials?: TestimonialRow[] }

export default function Testimonial({ dict, testimonials }: Props) {
  const t = dict.testimonial
  const featured = testimonials && testimonials.length > 0 ? testimonials[0] : null
  const quote = featured ? featured.quote : t.quote
  const author = featured ? featured.author_name : t.author
  const role = featured ? (featured.author_role ?? featured.project ?? '') : t.role

  return (
    <section className="py-24 px-6 md:px-12" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560] mb-16">{t.label}</p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Opening quote mark */}
          <p className="font-playfair text-8xl text-[rgba(26,26,26,0.12)] leading-none -mb-6">&ldquo;</p>

          {/* Quote */}
          <blockquote className="font-playfair text-2xl md:text-3xl lg:text-4xl italic text-[#1A1A1A] leading-[1.3] mb-12">
            {quote}
          </blockquote>

          {/* Attribution */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-px bg-[rgba(26,26,26,0.2)]" />
            <p className="font-sans text-sm font-medium text-[#1A1A1A]">{author}</p>
            {role && <p className="font-sans text-xs text-[#6B6560] tracking-wide">{role}</p>}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
