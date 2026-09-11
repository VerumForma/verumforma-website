import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import '@/app/globals.css'
import type { Locale } from '@/middleware'
import CookieBanner from '@/components/ui/CookieBanner'

// Montserrat matches the VerumForma wordmark (Montserrat Light).
// Used site-wide for both body and display type.
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const isPt = params.lang === 'pt'
  return {
    title: isPt ? 'VerumForma | Construção com Verdade' : 'VerumForma | Construction with Truth',
    description: isPt
      ? 'Construção habitacional, comercial e industrial em Portugal desde 1998. Mais de 250 obras concluídas com rigor, transparência e entrega no prazo.'
      : 'Residential, commercial and industrial construction in Portugal since 1998. Over 250 completed projects with rigour, transparency and on-time delivery.',
    keywords: isPt
      ? ['construção civil', 'construção habitacional', 'construção comercial', 'reabilitação', 'investimento imobiliário', 'mediação imobiliária', 'Montijo', 'Portugal', 'VerumForma']
      : ['construction', 'residential construction', 'commercial construction', 'renovation', 'real estate investment', 'Portugal', 'VerumForma'],
    openGraph: {
      type: 'website',
      url: 'https://www.verumforma.pt',
      siteName: 'VerumForma',
      title: isPt ? 'VerumForma | Construção com Verdade' : 'VerumForma | Construction with Truth',
      description: isPt
        ? 'Construção habitacional, comercial e industrial em Portugal desde 1998.'
        : 'Residential, commercial and industrial construction in Portugal since 1998.',
      images: [{ url: '/logos/verumforma-black-transparent.svg', width: 800, height: 600, alt: 'VerumForma' }],
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://www.verumforma.pt/${params.lang}`,
      languages: {
        pt: 'https://www.verumforma.pt/pt',
        en: 'https://www.verumforma.pt/en',
      },
    },
  }
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  return (
    <html lang={params.lang} className={montserrat.variable}>
      <body className="font-sans antialiased">
        {children}
        <CookieBanner lang={params.lang} />
      </body>
    </html>
  )
}
