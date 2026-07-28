import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/admin/SignOutButton'
import type { Profile } from '@/lib/supabase/types'

const nav = [
  { href: '/admin', label: 'Resumo' },
  { href: '/admin/projects', label: 'Projetos' },
  { href: '/admin/categories', label: 'Categorias' },
  { href: '/admin/content', label: 'Conteúdo' },
  { href: '/admin/team', label: 'Equipa' },
  { href: '/admin/testimonials', label: 'Testemunhos' },
  { href: '/admin/submissions', label: 'Contactos' },
]

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  const p = profile as Profile | null

  return (
    <div className="min-h-screen flex bg-[#F5F2EE] text-[#1A1A1A]">
      <aside className="w-56 shrink-0 bg-[#1A1A1A] text-white flex flex-col p-6">
        <div className="mb-10">
          <p className="font-playfair text-lg">VerumForma</p>
          <p className="text-xs text-[#6B6560]">Administração</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#9E9994] hover:text-white py-2 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-[rgba(255,255,255,0.08)] pt-4 mt-4">
          <p className="text-xs text-[#9E9994] truncate">{p?.full_name || user.email}</p>
          <p className="text-[10px] uppercase tracking-wider text-[#6B6560] mb-3">{p?.role ?? 'staff'}</p>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  )
}
