import { getDictionary } from '@/lib/getDictionary'
import { getPublishedOpenings } from '@/lib/data'
import type { Locale } from '@/middleware'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import OpeningsExplorer from '@/components/sections/OpeningsExplorer'

export default async function OpeningsPage({ params }: { params: { lang: Locale } }) {
  const [dict, openings] = await Promise.all([
    getDictionary(params.lang),
    getPublishedOpenings(),
  ])
  return (
    <>
      <Navbar dict={dict} lang={params.lang} />
      <OpeningsExplorer dict={dict} lang={params.lang} openings={openings} />
      <Footer dict={dict} lang={params.lang} />
    </>
  )
}
