import { getDictionary } from '@/lib/getDictionary'
import type { Locale } from '@/middleware'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default async function PrivacidadePage({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang)
  return (
    <>
      <Navbar dict={dict} lang={params.lang} />
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-12" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-5xl text-[#1A1A1A] mb-12">Política de Privacidade</h1>
          <div className="font-sans text-base text-[#6B6560] leading-relaxed flex flex-col gap-8">
            <section>
              <h2 className="font-sans text-sm tracking-[0.12em] uppercase text-[#1A1A1A] mb-3">Responsável pelo Tratamento</h2>
              <p>VerumForma (Construzimbra Lda)<br />Rua Agostinho Fortes nº128, 2870-252 Montijo, Portugal<br />Contacto: <a href="mailto:administracao@verumforma.pt" className="text-[#1A1A1A] underline underline-offset-2">administracao@verumforma.pt</a></p>
            </section>
            <section>
              <h2 className="font-sans text-sm tracking-[0.12em] uppercase text-[#1A1A1A] mb-3">Dados Recolhidos</h2>
              <p>Nome, endereço de email, tipo de projeto e mensagem — apenas através do formulário de contacto do website.</p>
            </section>
            <section>
              <h2 className="font-sans text-sm tracking-[0.12em] uppercase text-[#1A1A1A] mb-3">Finalidade</h2>
              <p>Os dados recolhidos têm como única finalidade responder aos pedidos de contacto submetidos pelo utilizador.</p>
            </section>
            <section>
              <h2 className="font-sans text-sm tracking-[0.12em] uppercase text-[#1A1A1A] mb-3">Conservação dos Dados</h2>
              <p>Os dados são conservados pelo período legalmente exigido e eliminados após o término da relação comercial, salvo obrigação legal contrária.</p>
            </section>
            <section>
              <h2 className="font-sans text-sm tracking-[0.12em] uppercase text-[#1A1A1A] mb-3">Direitos do Titular</h2>
              <p>Tem o direito de aceder, retificar e eliminar os seus dados pessoais. Para exercer estes direitos, contacte <a href="mailto:administracao@verumforma.pt" className="text-[#1A1A1A] underline underline-offset-2">administracao@verumforma.pt</a>.</p>
            </section>
            <section>
              <h2 className="font-sans text-sm tracking-[0.12em] uppercase text-[#1A1A1A] mb-3">Cookies</h2>
              <p>Este website utiliza apenas cookies de sessão e funcionais necessários ao seu funcionamento. Não são utilizados cookies de publicidade ou rastreamento.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  )
}
