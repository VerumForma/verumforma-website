import { getDictionary } from '@/lib/getDictionary'
import { mergeDictionaryWithContent } from '@/lib/content'
import { getPublishedProjects, getPublishedTeam, getPublishedTestimonials, getPublishedOpenings, getPublishedSocial } from '@/lib/data'
import type { Locale } from '@/middleware'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import Projects from '@/components/sections/Projects'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import Process from '@/components/sections/Process'
import Testimonial from '@/components/sections/Testimonial'
import Team from '@/components/sections/Team'
import Openings from '@/components/sections/Openings'
import SocialCarousel from '@/components/sections/SocialCarousel'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/layout/Footer'

export default async function HomePage({ params }: { params: { lang: Locale } }) {
  const [rawDict, projects, team, testimonials, openings, social] = await Promise.all([
    getDictionary(params.lang),
    getPublishedProjects(),
    getPublishedTeam(),
    getPublishedTestimonials(),
    getPublishedOpenings(),
    getPublishedSocial(),
  ])
  const dict = await mergeDictionaryWithContent(rawDict, params.lang)
  return (
    <>
      <Navbar dict={dict} lang={params.lang} />
      <Hero dict={dict} />
      <Projects dict={dict} lang={params.lang} projects={projects} />
      <About dict={dict} />
      <Services dict={dict} />
      <Process dict={dict} />
      <Testimonial dict={dict} testimonials={testimonials} />
      <Team dict={dict} team={team} />
      <Openings dict={dict} lang={params.lang} openings={openings} />
      <SocialCarousel dict={dict} items={social} />
      <Contact dict={dict} />
      <Footer dict={dict} lang={params.lang} />
    </>
  )
}
