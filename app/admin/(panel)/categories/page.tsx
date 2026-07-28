import { createClient } from '@/lib/supabase/server'
import CategoriesManager from '@/components/admin/CategoriesManager'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  return <CategoriesManager initial={data ?? []} />
}
