import { getDictionary } from '@/lib/getDictionary'
import type { Locale } from '@/middleware'
import LegalLayout, { type LegalSection } from '@/components/layout/LegalLayout'

const CONTACT = 'administracao@verumforma.pt'
const mail = '<a href="mailto:' + CONTACT + '" style="text-decoration:underline">' + CONTACT + '</a>'

const content: Record<string, { title: string; updated: string; intro: string; sections: LegalSection[] }> = {
  pt: {
    title: 'Política de Cookies',
    updated: 'Última atualização: julho de 2026',
    intro: 'Esta política explica o que são cookies e como são utilizados no website da VerumForma.',
    sections: [
      { heading: 'O que são cookies', paragraphs: ['Cookies são pequenos ficheiros de texto guardados no seu dispositivo quando visita um website. Servem para o fazer funcionar corretamente e para melhorar a experiência de navegação.'] },
      { heading: 'Cookies que utilizamos', paragraphs: ['Este website utiliza apenas cookies estritamente necessários e funcionais, indispensáveis ao seu funcionamento (por exemplo, para gerir a sessão e as preferências de idioma). Não utilizamos cookies de publicidade nem de rastreamento de terceiros.'] },
      { heading: 'Gestão de cookies', paragraphs: ['Pode configurar o seu navegador para bloquear ou eliminar cookies. Note que a desativação de cookies necessários poderá afetar o funcionamento de algumas partes do website. A gestão faz-se nas definições do navegador (Chrome, Safari, Firefox, Edge, entre outros).'] },
      { heading: 'Alterações', paragraphs: ['Esta política poderá ser atualizada. Quaisquer alterações produzem efeitos a partir da sua publicação neste website.'] },
      { heading: 'Contactos', paragraphs: ['Para questões sobre esta política, contacte ' + mail + '.'] },
    ],
  },
  en: {
    title: 'Cookie Policy',
    updated: 'Last updated: July 2026',
    intro: 'This policy explains what cookies are and how they are used on the VerumForma website.',
    sections: [
      { heading: 'What are cookies', paragraphs: ['Cookies are small text files stored on your device when you visit a website. They help it work properly and improve your browsing experience.'] },
      { heading: 'Cookies we use', paragraphs: ['This website uses only strictly necessary and functional cookies, essential to its operation (for example, to manage the session and language preferences). We do not use advertising or third-party tracking cookies.'] },
      { heading: 'Managing cookies', paragraphs: ['You can set your browser to block or delete cookies. Note that disabling necessary cookies may affect parts of the website. This is managed in your browser settings (Chrome, Safari, Firefox, Edge, among others).'] },
      { heading: 'Changes', paragraphs: ['This policy may be updated. Any changes take effect upon publication on this website.'] },
      { heading: 'Contact', paragraphs: ['For questions about this policy, contact ' + mail + '.'] },
    ],
  },
}

export default async function CookiesPage({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang)
  const c = content[params.lang] ?? content.pt
  return <LegalLayout dict={dict} lang={params.lang} title={c.title} updated={c.updated} intro={c.intro} sections={c.sections} />
}
