import { createClient } from '@/lib/supabase/server'
import ContentManager from '@/components/admin/ContentManager'

export const dynamic = 'force-dynamic'

export default async function ContentPage() {
  const supabase = createClient()
  const { data } = await supabase.from('site_content').select('*')
  return <ContentManager initial={data ?? []} />
}
