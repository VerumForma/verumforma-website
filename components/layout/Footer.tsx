import Link from 'next/link'
import { Mail } from 'lucide-react'
import type { Dictionary } from '@/lib/getDictionary'
import { getSocialLinks } from '@/lib/data'
import { IgIcon, FbIcon, YtIcon, InIcon } from '@/components/icons/social'

type Props = { dict: Dictionary; lang?: string }

export default async function Footer({ dict, lang = 'pt' }: Props) {
  const f = dict.footer
  const social = await getSocialLinks()
  const isPt = lang !== 'en'

  const links = isPt
    ? [
        { href: '/pt/privacidade', label: 'Privacidade' },
        { href: '/pt/termos', label: 'Termos' },
        { href: '/pt/cookies', label: 'Cookies' },
        { href: '/pt/aviso-legal', label: 'Aviso Legal' },
      ]
    : [
        { href: '/en/privacy', label: 'Privacy' },
        { href: '/en/termos', label: 'Terms' },
        { href: '/en/cookies', label: 'Cookies' },
        { href: '/en/aviso-legal', label: 'Legal Notice' },
      ]

  const socials = [
    social.instagram ? { href: social.instagram, Icon: IgIcon, label: 'Instagram' } : null,
    social.facebook ? { href: social.facebook, Icon: FbIcon, label: 'Facebook' } : null,
    social.youtube ? { href: social.youtube, Icon: YtIcon, label: 'YouTube' } : null,
    social.linkedin ? { href: social.linkedin, Icon: InIcon, label: 'LinkedIn' } : null,
    social.email ? { href: `mailto:${social.email}`, Icon: Mail, label: 'Email' } : null,
  ].filter(Boolean) as { href: string; Icon: (p: { size?: number; className?: string }) => JSX.Element; label: string }[]

  return (
    <footer className="px-6 md:px-12 py-10 border-t" style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="font-playfair text-base text-white">VerumForma</p>
            <p className="font-sans text-xs text-[#6B6560]">{f.tagline}</p>
          </div>
          {socials.length > 0 && (
            <div className="flex items-center gap-4">
              {socials.map(s => (
                <a key={s.label} href={s.href} target={s.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" aria-label={s.label} className="text-[#6B6560] hover:text-white transition-colors">
                  <s.Icon size={18} />
                </a>
              ))}
            </div>
          )}
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="font-sans text-xs text-[#6B6560] hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="font-sans text-xs text-[#6B6560]">
          © {new Date().getFullYear()} VerumForma. {f.rights}
        </p>
      </div>
    </footer>
  )
}
