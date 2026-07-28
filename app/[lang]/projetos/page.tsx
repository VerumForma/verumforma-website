import { getDictionary } from '@/lib/getDictionary'
import { getPublishedProjects } from '@/lib/data'
import type { Locale } from '@/middleware'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProjectsExplorer from '@/components/sections/ProjectsExplorer'

export default async function AllProjectsPage({ params }: { params: { lang: Locale } }) {
  const [dict, projects] = await Promise.all([
    getDictionary(params.lang),
    getPublishedProjects(),
  ])
  return (
    <>
      <Navbar dict={dict} lang={params.lang} />
      <ProjectsExplorer dict={dict} lang={params.lang} projects={projects} />
      <Footer dict={dict} />
    </>
  )
}
