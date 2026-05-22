import { getDictionary } from '@/lib/getDictionary'
import type { Locale } from '@/middleware'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import Projects from '@/components/sections/Projects'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import Process from '@/components/sections/Process'
import Testimonial from '@/components/sections/Testimonial'
import Team from '@/components/sections/Team'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/layout/Footer'

export default async function HomePage({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang)
  return (
    <>
      <Navbar dict={dict} lang={params.lang} />
      <Hero dict={dict} />
      <Projects dict={dict} />
      <About dict={dict} />
      <Services dict={dict} />
      <Process dict={dict} />
      <Testimonial dict={dict} />
      <Team dict={dict} />
      <Contact dict={dict} />
      <Footer dict={dict} />
    </>
  )
}
