import Link from 'next/link'
import '@/app/globals.css'

export default function NotFound() {
  return (
    <html lang="pt">
      <body style={{ margin: 0 }}>
        <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#F5F2EE' }}>
          <div className="max-w-lg text-center">
            <p className="text-xs tracking-[0.18em] uppercase text-[#6B6560] mb-4">Erro 404</p>
            <h1 className="text-4xl md:text-5xl text-[#1A1A1A] mb-5" style={{ fontFamily: 'Georgia, serif' }}>Página não encontrada</h1>
            <p className="text-base text-[#6B6560] leading-relaxed mb-10">
              A página que procura pode ter sido movida ou removida. Se guardou uma vaga que entretanto foi preenchida ou retirada, é natural que já não esteja disponível.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/pt" className="text-xs tracking-[0.12em] uppercase bg-[#1A1A1A] text-[#F5F2EE] px-6 py-3 hover:bg-[#333] transition-colors">
                Voltar ao início
              </Link>
              <Link href="/pt/oportunidades" className="text-xs tracking-[0.12em] uppercase border border-[#1A1A1A] text-[#1A1A1A] px-6 py-3 hover:bg-[#1A1A1A] hover:text-[#F5F2EE] transition-colors">
                Ver oportunidades
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
