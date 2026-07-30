import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, Briefcase, Building2, CalendarClock, Check, Home, Wallet } from 'lucide-react'
import { getDictionary } from '@/lib/getDictionary'
import { getOpeningById } from '@/lib/data'
import { specLines, type RequirementSpecs } from '@/lib/requirements'
import { formatSalary } from '@/lib/openingOptions'
import type { Locale } from '@/middleware'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ApplicationForm from '@/components/sections/ApplicationForm'

type Params = { params: { lang: Locale; id: string } }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const o = await getOpeningById(params.id)
  if (!o) return { title: 'VerumForma' }
  return { title: `${o.title} — VerumForma`, description: o.description ?? undefined }
}

export default async function OpeningDetailPage({ params }: Params) {
  const [dict, o] = await Promise.all([
    getDictionary(params.lang),
    getOpeningById(params.id),
  ])
  if (!o) notFound()

  const t = dict.openings
  const reqs = Array.isArray(o.requirements) ? o.requirements : []
  const specRows = specLines(o.requirement_specs as RequirementSpecs, t)
  const salary = formatSalary(o.salary_min, o.salary_max, o.salary_currency, o.salary_period, params.lang)

  const empMap: Record<string, string> = { 'Full-time': 'FULL_TIME', 'Part-time': 'PART_TIME', 'Estágio': 'INTERN', 'Prestação de serviços': 'CONTRACTOR', 'Temporário': 'TEMPORARY' }
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: o.title,
    description: o.description || o.title,
    datePosted: o.created_at,
    ...(o.deadline ? { validThrough: o.deadline } : {}),
    ...(o.employment_type && empMap[o.employment_type] ? { employmentType: empMap[o.employment_type] } : {}),
    hiringOrganization: { '@type': 'Organization', name: 'VerumForma', sameAs: 'https://www.verumforma.pt' },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: o.location || 'Montijo', addressCountry: 'PT' } },
    ...(o.work_mode === 'Remoto' ? { jobLocationType: 'TELECOMMUTE', applicantLocationRequirements: { '@type': 'Country', name: 'PT' } } : {}),
    ...((o.salary_min || o.salary_max) ? { baseSalary: { '@type': 'MonetaryAmount', currency: o.salary_currency || 'EUR', value: { '@type': 'QuantitativeValue', minValue: o.salary_min || o.salary_max, maxValue: o.salary_max || o.salary_min, unitText: (o.salary_period || 'month').toUpperCase() } } } : {}),
  }
  const email = o.apply_email || 'administracao@verumforma.pt'
  const chips = [
    o.employment_type ? { icon: Briefcase, text: o.employment_type } : null,
    o.work_mode ? { icon: Home, text: o.work_mode } : null,
    salary ? { icon: Wallet, text: salary } : null,
    o.location ? { icon: MapPin, text: o.location } : null,
    o.department ? { icon: Building2, text: o.department } : null,
    o.deadline ? { icon: CalendarClock, text: `${t.deadline}: ${new Date(o.deadline).toLocaleDateString(params.lang === 'pt' ? 'pt-PT' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}` } : null,
  ].filter(Boolean) as { icon: typeof Briefcase; text: string }[]

  return (
    <>
      <Navbar dict={dict} lang={params.lang} />
      <article className="pt-28 pb-24 px-6 md:px-12" style={{ backgroundColor: 'var(--bg)' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="max-w-3xl mx-auto">
          <Link href={`/${params.lang}/oportunidades`} className="inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase font-sans text-[#6B6560] hover:text-[#1A1A1A] transition-colors mb-10">
            <ArrowLeft size={14} /> {t.back}
          </Link>

          <p className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560] mb-3">{t.label}</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-[#1A1A1A] mb-6 leading-tight">{o.title}</h1>

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-10">
              {chips.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-xs font-sans text-[#6B6560]">
                  <c.icon size={14} /> {c.text}
                </span>
              ))}
            </div>
          )}

          {o.description && (
            <p className="font-sans text-base text-[#3A3632] leading-relaxed whitespace-pre-wrap mb-12">{o.description}</p>
          )}

          {(specRows.length > 0 || reqs.length > 0) && (
            <div className="mb-12">
              <p className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560] mb-5">{t.requirements}</p>
              <ul className="flex flex-col gap-3">
                {specRows.map((line, i) => (
                  <li key={`s${i}`} className="flex items-start gap-3 font-sans text-sm text-[#3A3632] leading-relaxed">
                    <Check size={16} className="text-[#1A1A1A] mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium text-[#1A1A1A]">{line.label}:</span> {line.value}</span>
                  </li>
                ))}
                {reqs.map((r, i) => (
                  <li key={`c${i}`} className="flex items-start gap-3 font-sans text-sm text-[#3A3632] leading-relaxed">
                    <Check size={16} className="text-[#1A1A1A] mt-0.5 flex-shrink-0" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-[rgba(26,26,26,0.1)] pt-10">
            <ApplicationForm dict={dict} lang={params.lang} openingId={o.id} openingTitle={o.title} applyEmail={email} />
          </div>
        </div>
      </article>
      <Footer dict={dict} lang={params.lang} />
    </>
  )
}
