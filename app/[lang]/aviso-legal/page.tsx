import { getDictionary } from '@/lib/getDictionary'
import type { Locale } from '@/middleware'
import LegalLayout, { type LegalSection } from '@/components/layout/LegalLayout'

const CONTACT = 'administracao@verumforma.pt'
const mail = '<a href="mailto:' + CONTACT + '" style="text-decoration:underline">' + CONTACT + '</a>'

const content: Record<string, { title: string; updated: string; sections: LegalSection[] }> = {
  pt: {
    title: 'Aviso Legal',
    updated: 'Última atualização: julho de 2026',
    sections: [
      { heading: 'Identificação da empresa', paragraphs: ['VerumForma é a marca comercial da Construzimbra, Lda.', 'Sede: Rua Agostinho Fortes nº128, 2870-252 Montijo, Portugal.', 'NIPC: (a completar). Email: ' + mail + '.'] },
      { heading: 'Propriedade intelectual', paragraphs: ['A marca VerumForma, o logótipo e todos os conteúdos deste website estão protegidos por direitos de propriedade intelectual. A sua utilização não autorizada é proibida.'] },
      { heading: 'Segurança', paragraphs: ['Adotamos medidas técnicas e organizativas adequadas para proteger a informação, incluindo ligação cifrada (HTTPS) e acesso restrito aos dados. Nenhum sistema é, contudo, totalmente imune a riscos; comprometemo-nos a atuar com diligência na proteção da informação que nos é confiada.'] },
      { heading: 'Proteção de dados', paragraphs: ['O tratamento de dados pessoais é feito nos termos da nossa Política de Privacidade, em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD). A autoridade de controlo competente em Portugal é a Comissão Nacional de Proteção de Dados (CNPD).'] },
      { heading: 'Resolução alternativa de litígios', paragraphs: ['Em caso de litígio de consumo, está disponível o Livro de Reclamações eletrónico em <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noreferrer" style="text-decoration:underline">livroreclamacoes.pt</a>.'] },
      { heading: 'Legislação aplicável', paragraphs: ['Este website e a atividade da VerumForma regem-se pela legislação portuguesa.'] },
    ],
  },
  en: {
    title: 'Legal Notice',
    updated: 'Last updated: July 2026',
    sections: [
      { heading: 'Company identification', paragraphs: ['VerumForma is the trade name of Construzimbra, Lda.', 'Registered office: Rua Agostinho Fortes nº128, 2870-252 Montijo, Portugal.', 'Company number (NIPC): (to be completed). Email: ' + mail + '.'] },
      { heading: 'Intellectual property', paragraphs: ['The VerumForma brand, logo and all content on this website are protected by intellectual property rights. Unauthorised use is prohibited.'] },
      { heading: 'Security', paragraphs: ['We adopt appropriate technical and organisational measures to protect information, including encrypted connection (HTTPS) and restricted data access. No system is entirely risk-free; we commit to acting diligently to protect the information entrusted to us.'] },
      { heading: 'Data protection', paragraphs: ['Personal data is processed under our Privacy Policy, in accordance with the General Data Protection Regulation (GDPR). The competent supervisory authority in Portugal is the CNPD.'] },
      { heading: 'Alternative dispute resolution', paragraphs: ['For consumer disputes, the Portuguese electronic complaints book is available at <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noreferrer" style="text-decoration:underline">livroreclamacoes.pt</a>.'] },
      { heading: 'Applicable law', paragraphs: ['This website and VerumForma\'s activity are governed by Portuguese law.'] },
    ],
  },
}

export default async function AvisoLegalPage({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang)
  const c = content[params.lang] ?? content.pt
  return <LegalLayout dict={dict} lang={params.lang} title={c.title} updated={c.updated} sections={c.sections} />
}
