import { createClient } from '@/lib/supabase/server'
import SubmissionsManager from '@/components/admin/SubmissionsManager'

export const dynamic = 'force-dynamic'

export default async function SubmissionsPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
  return <SubmissionsManager initial={data ?? []} />
}
