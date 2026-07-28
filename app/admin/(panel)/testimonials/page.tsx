import { createClient } from '@/lib/supabase/server'
import TestimonialsManager from '@/components/admin/TestimonialsManager'

export const dynamic = 'force-dynamic'

export default async function TestimonialsPage() {
  const supabase = createClient()
  const { data } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true })
  return <TestimonialsManager initial={data ?? []} />
}
