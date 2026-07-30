import { createClient } from '@/lib/supabase/server'
import ApplicationsManager from '@/components/admin/ApplicationsManager'

export const dynamic = 'force-dynamic'

export default async function ApplicationsAdminPage() {
  const supabase = createClient()
  const { data } = await supabase.from('job_applications').select('*').order('created_at', { ascending: false })
  return <ApplicationsManager initial={data ?? []} />
}
