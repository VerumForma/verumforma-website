import { createClient } from '@/lib/supabase/server'
import ProjectsManager from '@/components/admin/ProjectsManager'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const supabase = createClient()
  const [{ data: projects }, { data: categories }] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name', { ascending: true }),
  ])
  return <ProjectsManager initial={projects ?? []} categories={categories ?? []} />
}
