'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Dictionary } from '@/lib/getDictionary'

type Props = {
  dict: Dictionary
  lang: string
}

const navLinks = (dict: Dictionary['nav'], lang: string) => [
  { href: `/${lang}#projetos`, label: dict.projects },
  { href: `/${lang}#servicos`, label: dict.services },
  { href: `/${lang}#sobre`, label: dict.about },
  { href: `/${lang}#processo`, label: dict.process },
  { href: `/${lang}#equipa`, label: dict.team },
]

export default function Navbar({ dict, lang }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const switchLocale = (locale: string) => {
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      animate={{ backgroundColor: scrolled ? 'rgba(245,242,238,0.95)' : 'transparent' }}
      style={{ borderBottom: scrolled ? '1px solid rgba(26,26,26,0.08)' : '1px solid transparent' }}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Logotype */}
        <Link href={`/${lang}`} className="font-playfair text-xl font-medium tracking-wide text-[#1A1A1A]">
          VerumForma
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks(dict.nav, lang).map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-xs tracking-[0.12em] uppercase font-sans text-[#6B6560] hover:text-[#1A1A1A] transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language toggle */}
          <div className="flex items-center gap-1 text-xs tracking-widest font-sans text-[#6B6560]">
            <button
              onClick={() => switchLocale('pt')}
              className={lang === 'pt' ? 'text-[#1A1A1A] font-semibold' : 'hover:text-[#1A1A1A] transition-colors'}
            >PT</button>
            <span className="opacity-40">|</span>
            <button
              onClick={() => switchLocale('en')}
              className={lang === 'en' ? 'text-[#1A1A1A] font-semibold' : 'hover:text-[#1A1A1A] transition-colors'}
            >EN</button>
          </div>
          {/* Contact CTA */}
          <a
            href="#contacto"
            className="text-xs tracking-[0.12em] uppercase font-sans bg-[#1A1A1A] text-[#F5F2EE] px-5 py-2 hover:bg-[#333] transition-colors"
            style={{ borderRadius: '2px' }}
          >
            {dict.nav.contact}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`w-6 h-px bg-[#1A1A1A] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-px bg-[#1A1A1A] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-px bg-[#1A1A1A] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-[#F5F2EE] border-t border-[rgba(26,26,26,0.08)] px-6 py-8 flex flex-col gap-6"
        >
          {navLinks(dict.nav, lang).map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-[0.12em] uppercase font-sans text-[#1A1A1A]"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-3 pt-4 border-t border-[rgba(26,26,26,0.08)]">
            <button onClick={() => { switchLocale('pt'); setMenuOpen(false) }} className={`text-xs tracking-widest uppercase ${lang === 'pt' ? 'font-semibold text-[#1A1A1A]' : 'text-[#6B6560]'}`}>PT</button>
            <span className="text-[#6B6560] opacity-40">|</span>
            <button onClick={() => { switchLocale('en'); setMenuOpen(false) }} className={`text-xs tracking-widest uppercase ${lang === 'en' ? 'font-semibold text-[#1A1A1A]' : 'text-[#6B6560]'}`}>EN</button>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
