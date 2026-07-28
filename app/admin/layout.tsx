import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Playfair_Display } from 'next/font/google'
import '@/app/globals.css'

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
  title: 'VerumForma · Administração',
  robots: { index: false, follow: false },
}

// Admin section renders its own <html>/<body> because it lives outside the
// [lang] segment (the public root layout is a passthrough).
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt" className={`${geist.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
