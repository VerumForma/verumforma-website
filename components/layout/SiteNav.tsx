import Navbar from '@/components/layout/Navbar'
import { getPublishedTeam, getPublishedOpenings } from '@/lib/data'
import type { Dictionary } from '@/lib/getDictionary'

type Props = { dict: Dictionary; lang: string }

// Server wrapper: fetches published team & openings once so the navbar
// only shows the "Equipa" and "Oportunidades" links when those sections
// actually have content (matching the sections that hide themselves).
export default async function SiteNav({ dict, lang }: Props) {
  const [team, openings] = await Promise.all([
    getPublishedTeam(),
    getPublishedOpenings(),
  ])
  return (
    <Navbar
      dict={dict}
      lang={lang}
      showTeam={team.length > 0}
      showOpportunities={openings.length > 0}
    />
  )
}
