import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminHome() {
  const supabase = createClient()

  const [projects, team, testimonials, newLeads] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('team_members').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new'),
  ])

  const cards = [
    { label: 'Projetos', value: projects.count ?? 0, href: '/admin/projects' },
    { label: 'Equipa', value: team.count ?? 0, href: '/admin/team' },
    { label: 'Testemunhos', value: testimonials.count ?? 0, href: '/admin/testimonials' },
    { label: 'Contactos por ler', value: newLeads.count ?? 0, href: '/admin/submissions' },
  ]

  return (
    <div>
      <h1 className="font-playfair text-3xl mb-2">Resumo</h1>
      <p className="text-sm text-[#6B6560] mb-8">Gestão de conteúdo do site VerumForma.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <Link
            key={c.href}
            href={c.href}
            className="bg-white border border-[rgba(26,26,26,0.08)] p-6 hover:border-[#1A1A1A] transition-colors"
          >
            <p className="text-4xl font-playfair mb-1">{c.value}</p>
            <p className="text-xs uppercase tracking-wider text-[#6B6560]">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
