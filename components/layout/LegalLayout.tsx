import type { Dictionary } from '@/lib/getDictionary'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export type LegalSection = { heading: string; paragraphs: string[] }

type Props = {
  dict: Dictionary
  lang: string
  title: string
  updated?: string
  intro?: string
  sections: LegalSection[]
}

export default function LegalLayout({ dict, lang, title, updated, intro, sections }: Props) {
  return (
    <>
      <Navbar dict={dict} lang={lang} />
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-12" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-5xl text-[#1A1A1A] mb-3">{title}</h1>
          {updated && <p className="font-sans text-xs uppercase tracking-wider text-[#6B6560] mb-10">{updated}</p>}
          {intro && <p className="font-sans text-base text-[#3A3632] leading-relaxed mb-10">{intro}</p>}
          <div className="font-sans text-base text-[#6B6560] leading-relaxed flex flex-col gap-8">
            {sections.map((s, i) => (
              <section key={i}>
                <h2 className="font-sans text-sm tracking-[0.12em] uppercase text-[#1A1A1A] mb-3">{s.heading}</h2>
                {s.paragraphs.map((p, j) => (
                  <p key={j} className={j > 0 ? 'mt-3' : ''} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer dict={dict} lang={lang} />
    </>
  )
}
