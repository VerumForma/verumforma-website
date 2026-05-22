import type { Dictionary } from '@/lib/getDictionary'

type Props = { dict: Dictionary }

export default function Footer({ dict }: Props) {
  const f = dict.footer

  return (
    <footer
      className="px-6 md:px-12 py-10 border-t"
      style={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-playfair text-base text-white">VerumForma</p>
          <p className="font-sans text-xs text-[#6B6560]">{f.tagline}</p>
        </div>
        <p className="font-sans text-xs text-[#6B6560]">
          © {new Date().getFullYear()} VerumForma. {f.rights}
        </p>
      </div>
    </footer>
  )
}
