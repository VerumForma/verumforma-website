import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getDictionary } from '@/lib/getDictionary'
import { getProjectById } from '@/lib/data'
import type { Locale } from '@/middleware'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

type Params = { params: { lang: Locale; id: string } }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = await getProjectById(params.id)
  if (!project) return { title: 'VerumForma' }
  return {
    title: `${project.title} — VerumForma`,
    description: project.description ?? undefined,
    openGraph: project.cover_image ? { images: [{ url: project.cover_image }] } : undefined,
  }
}

export default async function ProjectDetailPage({ params }: Params) {
  const [dict, project] = await Promise.all([
    getDictionary(params.lang),
    getProjectById(params.id),
  ])
  if (!project) notFound()

  const t = dict.all_projects
  const gallery = Array.isArray(project.images) ? project.images : []

  return (
    <>
      <Navbar dict={dict} lang={params.lang} />
      <article className="pt-28 pb-24 px-6 md:px-12" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <Link href={`/${params.lang}/projetos`} className="inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase font-sans text-[#6B6560] hover:text-[#1A1A1A] transition-colors mb-10">
            <ArrowLeft size={14} /> {t.back}
          </Link>

          <p className="font-sans text-xs text-[#6B6560] tracking-wide mb-3">
            {[project.category, project.location, project.year].filter(Boolean).join(' · ')}
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl text-[#1A1A1A] mb-10 leading-tight">{project.title}</h1>

          {project.cover_image && (
            <div className="w-full aspect-[16/9] overflow-hidden mb-12" style={{ backgroundColor: '#2A2A2A' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}

          {project.description && (
            <div className="max-w-2xl mb-16">
              <p className="font-sans text-base text-[#3A3632] leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>
          )}

          {gallery.length > 0 && (
            <div>
              <p className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560] mb-6">{t.gallery}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gallery.map((url, i) => (
                  <div key={i} className="w-full aspect-[4/3] overflow-hidden" style={{ backgroundColor: '#2A2A2A' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`${project.title} — ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
      <Footer dict={dict} lang={params.lang} />
    </>
  )
}
