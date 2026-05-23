import { getDictionary } from '@/lib/getDictionary'
import type { Locale } from '@/middleware'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default async function PrivacyPage({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang)
  return (
    <>
      <Navbar dict={dict} lang={params.lang} />
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-12" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-5xl text-[#1A1A1A] mb-12">Privacy Policy</h1>
          <div className="font-sans text-base text-[#6B6560] leading-relaxed flex flex-col gap-8">
            <section>
              <h2 className="font-sans text-sm tracking-[0.12em] uppercase text-[#1A1A1A] mb-3">Data Controller</h2>
              <p>VerumForma (Construzimbra Lda)<br />Rua Agostinho Fortes nº128, 2870-252 Montijo, Portugal<br />Contact: <a href="mailto:administracao@verumforma.pt" className="text-[#1A1A1A] underline underline-offset-2">administracao@verumforma.pt</a></p>
            </section>
            <section>
              <h2 className="font-sans text-sm tracking-[0.12em] uppercase text-[#1A1A1A] mb-3">Data Collected</h2>
              <p>Name, email address, project type and message — only through the website contact form.</p>
            </section>
            <section>
              <h2 className="font-sans text-sm tracking-[0.12em] uppercase text-[#1A1A1A] mb-3">Purpose</h2>
              <p>Data collected is used solely to respond to contact requests submitted by the user.</p>
            </section>
            <section>
              <h2 className="font-sans text-sm tracking-[0.12em] uppercase text-[#1A1A1A] mb-3">Data Retention</h2>
              <p>Data is retained for the legally required period and deleted after the end of the commercial relationship, unless otherwise required by law.</p>
            </section>
            <section>
              <h2 className="font-sans text-sm tracking-[0.12em] uppercase text-[#1A1A1A] mb-3">Your Rights</h2>
              <p>You have the right to access, rectify and delete your personal data. To exercise these rights, contact <a href="mailto:administracao@verumforma.pt" className="text-[#1A1A1A] underline underline-offset-2">administracao@verumforma.pt</a>.</p>
            </section>
            <section>
              <h2 className="font-sans text-sm tracking-[0.12em] uppercase text-[#1A1A1A] mb-3">Cookies</h2>
              <p>This website uses only session and functional cookies necessary for its operation. No advertising or tracking cookies are used.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  )
}
