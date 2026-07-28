import { createClient } from '@/lib/supabase/server'
import TeamManager from '@/components/admin/TeamManager'

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  const supabase = createClient()
  const { data } = await supabase.from('team_members').select('*').order('sort_order', { ascending: true })
  return <TeamManager initial={data ?? []} />
}
