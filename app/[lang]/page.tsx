import { getDictionary } from '@/lib/getDictionary'
import type { Locale } from '@/middleware'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import Projects from '@/components/sections/Projects'
import About from '@/components/sections/About'

export default async function HomePage({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang)
  return (
    <>
      <Navbar dict={dict} lang={params.lang} />
      <Hero dict={dict} />
      <Projects dict={dict} />
      <About dict={dict} />
    </>
  )
}
