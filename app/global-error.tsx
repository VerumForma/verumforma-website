'use client'

import '@/app/globals.css'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt">
      <body style={{ margin: 0 }}>
        <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#F5F2EE' }}>
          <div className="max-w-lg text-center">
            <p className="text-xs tracking-[0.18em] uppercase text-[#6B6560] mb-4">Erro</p>
            <h1 className="text-4xl md:text-5xl text-[#1A1A1A] mb-5" style={{ fontFamily: 'Georgia, serif' }}>Algo correu mal</h1>
            <p className="text-base text-[#6B6560] leading-relaxed mb-10">
              Ocorreu um erro inesperado. Pode tentar novamente ou voltar ao início. Se o problema persistir, contacte-nos por <a href="mailto:administracao@verumforma.pt" className="text-[#1A1A1A] underline underline-offset-2">administracao@verumforma.pt</a>.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={() => reset()} className="text-xs tracking-[0.12em] uppercase bg-[#1A1A1A] text-[#F5F2EE] px-6 py-3 hover:bg-[#333] transition-colors">
                Tentar novamente
              </button>
              <a href="/pt" className="text-xs tracking-[0.12em] uppercase border border-[#1A1A1A] text-[#1A1A1A] px-6 py-3 hover:bg-[#1A1A1A] hover:text-[#F5F2EE] transition-colors">
                Voltar ao início
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
