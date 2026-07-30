import { getPublishedOpenings } from '@/lib/data'

export const dynamic = 'force-dynamic'

const SITE = 'https://www.verumforma.pt'

function cdata(v: string | null | undefined) {
  return `<![CDATA[${v ?? ''}]]>`
}

export async function GET() {
  const openings = await getPublishedOpenings()
  const jobs = openings.map(o => {
    const url = `${SITE}/pt/oportunidades/${o.id}`
    const loc = o.location || 'Montijo'
    const salary = o.salary_min || o.salary_max
      ? `${o.salary_min ?? o.salary_max}-${o.salary_max ?? o.salary_min} ${o.salary_currency || 'EUR'}/${o.salary_period || 'month'}`
      : ''
    return `  <job>
    <title>${cdata(o.title)}</title>
    <date>${new Date(o.created_at).toUTCString()}</date>
    <referencenumber>${o.id}</referencenumber>
    <url>${cdata(url)}</url>
    <company>${cdata('VerumForma')}</company>
    <city>${cdata(loc)}</city>
    <country>${cdata('Portugal')}</country>
    <jobtype>${cdata(o.employment_type || '')}</jobtype>
    <salary>${cdata(salary)}</salary>
    <description>${cdata(o.description || o.title)}</description>
  </job>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<source>
  <publisher>VerumForma</publisher>
  <publisherurl>${SITE}</publisherurl>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${jobs}
</source>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
  })
}
