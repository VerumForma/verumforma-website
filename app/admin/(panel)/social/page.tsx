import { createClient } from '@/lib/supabase/server'
import SocialManager from '@/components/admin/SocialManager'
import type { SocialLinks } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function SocialAdminPage() {
  const supabase = createClient()
  const [{ data: linkRow }, { data: media }] = await Promise.all([
    supabase.from('site_content').select('data').eq('section', 'social_links').limit(1).maybeSingle(),
    supabase.from('social_media').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
  ])
  return <SocialManager initialLinks={(linkRow?.data as SocialLinks) ?? {}} initialMedia={media ?? []} />
}
