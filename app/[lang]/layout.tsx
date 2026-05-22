import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Playfair_Display } from 'next/font/google'
import '@/app/globals.css'
import type { Locale } from '@/middleware'

// Geist is bundled by create-next-app as a local font; it is not on
// Google Fonts, so we use next/font/local with the pre-installed woff.
const geist = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist',
  weight: '100 900',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'VerumForma | Construção com Verdade',
  description: 'O futuro constrói-se com verdade. Construção habitacional, comercial e industrial em Portugal desde 1998.',
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  return (
    <html lang={params.lang} className={`${geist.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
