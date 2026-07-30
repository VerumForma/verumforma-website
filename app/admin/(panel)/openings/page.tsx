import { createClient } from '@/lib/supabase/server'
import OpeningsManager from '@/components/admin/OpeningsManager'

export const dynamic = 'force-dynamic'

export default async function OpeningsAdminPage() {
  const supabase = createClient()
  const { data } = await supabase.from('openings').select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  return <OpeningsManager initial={data ?? []} />
}
