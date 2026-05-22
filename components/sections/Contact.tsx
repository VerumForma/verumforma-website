'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin } from 'lucide-react'
import type { Dictionary } from '@/lib/getDictionary'

type Props = { dict: Dictionary }

const inputClass = `
  w-full bg-[#2A2A2A] text-white text-sm font-sans px-4 py-3
  border border-[#3A3A3A] outline-none
  focus:border-white transition-colors duration-200
  placeholder:text-[#6B6560]
`.trim()

export default function Contact({ dict }: Props) {
  const c = dict.contact
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', type: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="orcamento" className="py-24 px-6 md:px-12" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

        {/* Left — info */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          className="flex flex-col gap-6"
        >
          <p className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560]">{c.label}</p>
          <h2 className="font-playfair text-4xl md:text-5xl text-white leading-[1.1]">{c.headline}</h2>
          <p className="font-sans text-base text-[#9E9994] leading-relaxed max-w-sm">{c.subtext}</p>

          <div className="flex flex-col gap-4 pt-4 border-t border-[rgba(255,255,255,0.08)]">
            <a href={`mailto:${c.email_budgets}`} className="flex items-center gap-3 text-sm font-sans text-[#9E9994] hover:text-white transition-colors">
              <Mail size={16} className="text-[#6B6560] flex-shrink-0" />
              {c.email_budgets}
            </a>
            <a href={`mailto:${c.email_admin}`} className="flex items-center gap-3 text-sm font-sans text-[#9E9994] hover:text-white transition-colors">
              <Mail size={16} className="text-[#6B6560] flex-shrink-0" />
              {c.email_admin}
            </a>
            <div className="flex items-start gap-3 text-sm font-sans text-[#9E9994]">
              <MapPin size={16} className="text-[#6B6560] flex-shrink-0 mt-0.5" />
              <div>
                <p>{c.address}</p>
                <p>{c.city}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
        >
          {submitted ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <p className="font-playfair text-xl text-white text-center">{c.form_success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs tracking-[0.12em] uppercase font-sans text-[#6B6560] mb-2">{c.form_name}</label>
                <input
                  type="text"
                  required
                  placeholder={c.form_name_placeholder}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.12em] uppercase font-sans text-[#6B6560] mb-2">{c.form_email}</label>
                <input
                  type="email"
                  required
                  placeholder={c.form_email_placeholder}
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.12em] uppercase font-sans text-[#6B6560] mb-2">{c.form_type}</label>
                <select
                  required
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className={inputClass}
                >
                  <option value="" disabled>{c.form_select_placeholder}</option>
                  {c.form_types.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-[0.12em] uppercase font-sans text-[#6B6560] mb-2">{c.form_message}</label>
                <textarea
                  required
                  rows={4}
                  placeholder={c.form_message_placeholder}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-[#1A1A1A] font-sans text-sm tracking-[0.1em] uppercase py-4 hover:bg-[#F5F2EE] transition-colors duration-200 mt-2"
                style={{ borderRadius: '2px' }}
              >
                {c.form_submit}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
