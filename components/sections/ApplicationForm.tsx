'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { Dictionary } from '@/lib/getDictionary'

type Props = {
  dict: Dictionary
  lang: string
  openingId: string
  openingTitle: string
  applyEmail: string
}

const inputClass =
  'w-full bg-white text-sm font-sans px-4 py-3 border border-[rgba(26,26,26,0.15)] outline-none focus:border-[#1A1A1A] transition-colors placeholder:text-[#9E9994]'

export default function ApplicationForm({ dict, lang, openingId, openingTitle, applyEmail }: Props) {
  const t = dict.openings
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', cv: '', message: '', company: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          openingId,
          openingTitle,
          applyEmail,
          name: form.name,
          email: form.email,
          phone: form.phone,
          cvUrl: form.cv,
          message: form.message,
          company: form.company,
          locale: lang,
        }),
      })
      if (res.ok) setSubmitted(true)
      else setError(t.f_error)
    } catch {
      setError(t.f_error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div id="candidatar" className="border border-[rgba(26,26,26,0.12)] p-8 bg-white">
        <p className="font-playfair text-xl text-[#1A1A1A]">{t.f_success}</p>
      </div>
    )
  }

  return (
    <div id="candidatar" className="border border-[rgba(26,26,26,0.12)] p-6 md:p-8 bg-white">
      <h2 className="font-playfair text-2xl text-[#1A1A1A] mb-1">{t.apply_title}</h2>
      <p className="font-sans text-sm text-[#6B6560] mb-6">{t.apply_intro}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* honeypot */}
        <input
          type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true"
          value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        />

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#6B6560] mb-2">{t.f_position}</label>
          <input type="text" readOnly value={openingTitle} className={`${inputClass} bg-[rgba(26,26,26,0.04)] text-[#6B6560]`} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#6B6560] mb-2">{t.f_name}</label>
            <input type="text" required placeholder={t.f_name_ph} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#6B6560] mb-2">{t.f_email}</label>
            <input type="email" required placeholder={t.f_email_ph} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#6B6560] mb-2">{t.f_phone}</label>
            <input type="text" placeholder={t.f_phone_ph} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#6B6560] mb-2">{t.f_cv}</label>
            <input type="url" placeholder={t.f_cv_ph} value={form.cv} onChange={e => setForm(f => ({ ...f, cv: e.target.value }))} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#6B6560] mb-2">{t.f_message}</label>
          <textarea rows={4} placeholder={t.f_message_ph} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className={inputClass} />
        </div>

        <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 text-xs tracking-[0.12em] uppercase font-sans bg-[#1A1A1A] text-[#F5F2EE] px-6 py-3.5 hover:bg-[#333] transition-colors disabled:opacity-50 mt-1">
          {loading ? t.f_loading : t.f_submit} {!loading && <ArrowRight size={14} />}
        </button>
        {error && <p className="font-sans text-xs text-red-500">{error}</p>}
      </form>

      <p className="font-sans text-xs text-[#6B6560] mt-6 pt-6 border-t border-[rgba(26,26,26,0.08)]">
        {t.apply_email_b}{' '}
        <a href={`mailto:${applyEmail}?subject=${encodeURIComponent(`Candidatura — ${openingTitle}`)}`} className="text-[#1A1A1A] underline underline-offset-2 hover:opacity-70">{applyEmail}</a>
      </p>
    </div>
  )
}
