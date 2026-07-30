import { getDictionary } from '@/lib/getDictionary'
import type { Locale } from '@/middleware'
import LegalLayout, { type LegalSection } from '@/components/layout/LegalLayout'

const CONTACT = 'administracao@verumforma.pt'
const mail = '<a href="mailto:' + CONTACT + '" style="text-decoration:underline">' + CONTACT + '</a>'

const content: Record<string, { title: string; updated: string; intro: string; sections: LegalSection[] }> = {
  pt: {
    title: 'Termos e Condições',
    updated: 'Última atualização: julho de 2026',
    intro: 'Ao aceder e utilizar o website da VerumForma, o utilizador aceita os presentes Termos e Condições. Recomendamos a sua leitura atenta.',
    sections: [
      { heading: 'Identificação', paragraphs: ['VerumForma é a marca comercial da Construzimbra, Lda., com sede na Rua Agostinho Fortes nº128, 2870-252 Montijo, Portugal. Contacto: ' + mail + '.'] },
      { heading: 'Objeto', paragraphs: ['Este website tem como finalidade divulgar a atividade, os projetos, a equipa e as oportunidades de emprego da VerumForma, bem como permitir o contacto e a candidatura por parte dos utilizadores.'] },
      { heading: 'Utilização do website', paragraphs: ['O utilizador compromete-se a utilizar o website de forma lícita e de acordo com a boa-fé, abstendo-se de qualquer uso que possa danificar, sobrecarregar ou comprometer o normal funcionamento do mesmo ou os direitos de terceiros.'] },
      { heading: 'Propriedade intelectual', paragraphs: ['Todos os conteúdos deste website — textos, imagens, logótipos, marcas e elementos gráficos — são propriedade da VerumForma ou de terceiros que autorizaram a sua utilização, estando protegidos pela legislação aplicável. É proibida a sua reprodução, distribuição ou modificação sem autorização prévia e por escrito.'] },
      { heading: 'Oportunidades e candidaturas', paragraphs: ['As oportunidades de emprego publicadas podem ser alteradas ou removidas a qualquer momento. A submissão de uma candidatura não constitui qualquer garantia de contratação. Os dados fornecidos nas candidaturas são tratados nos termos da nossa Política de Privacidade.'] },
      { heading: 'Ligações a terceiros', paragraphs: ['Este website pode conter ligações para sites de terceiros. A VerumForma não se responsabiliza pelos conteúdos nem pelas políticas de privacidade desses sites.'] },
      { heading: 'Limitação de responsabilidade', paragraphs: ['A VerumForma envida os seus melhores esforços para manter a informação atualizada e correta, não garantindo, contudo, a ausência de erros ou a disponibilidade permanente do website. A VerumForma não será responsável por quaisquer danos decorrentes da utilização ou da impossibilidade de utilização do website.'] },
      { heading: 'Alterações', paragraphs: ['A VerumForma reserva-se o direito de alterar os presentes Termos e Condições a qualquer momento. As alterações produzem efeitos a partir da sua publicação neste website.'] },
      { heading: 'Lei aplicável e resolução de litígios', paragraphs: ['Os presentes Termos regem-se pela lei portuguesa. Em caso de litígio de consumo, o utilizador pode recorrer ao Livro de Reclamações eletrónico (<a href="https://www.livroreclamacoes.pt" target="_blank" rel="noreferrer" style="text-decoration:underline">livroreclamacoes.pt</a>) e às entidades de Resolução Alternativa de Litígios competentes.'] },
      { heading: 'Contactos', paragraphs: ['Para qualquer questão relativa a estes Termos, contacte ' + mail + '.'] },
    ],
  },
  en: {
    title: 'Terms & Conditions',
    updated: 'Last updated: July 2026',
    intro: 'By accessing and using the VerumForma website, you accept these Terms & Conditions. Please read them carefully.',
    sections: [
      { heading: 'Company', paragraphs: ['VerumForma is the trade name of Construzimbra, Lda., registered office at Rua Agostinho Fortes nº128, 2870-252 Montijo, Portugal. Contact: ' + mail + '.'] },
      { heading: 'Purpose', paragraphs: ['This website presents VerumForma\'s activity, projects, team and job opportunities, and allows users to get in touch and apply.'] },
      { heading: 'Use of the website', paragraphs: ['You agree to use the website lawfully and in good faith, refraining from any use that could damage, overload or impair its normal operation or the rights of third parties.'] },
      { heading: 'Intellectual property', paragraphs: ['All content on this website — text, images, logos, trademarks and graphic elements — belongs to VerumForma or to third parties who authorised its use, and is protected by applicable law. Reproduction, distribution or modification without prior written consent is prohibited.'] },
      { heading: 'Opportunities and applications', paragraphs: ['Published job opportunities may be changed or removed at any time. Submitting an application does not guarantee employment. Data provided in applications is processed under our Privacy Policy.'] },
      { heading: 'Third-party links', paragraphs: ['This website may contain links to third-party sites. VerumForma is not responsible for their content or privacy practices.'] },
      { heading: 'Limitation of liability', paragraphs: ['VerumForma makes its best efforts to keep information accurate and up to date but does not guarantee the absence of errors or permanent availability. VerumForma shall not be liable for any damages arising from the use or inability to use the website.'] },
      { heading: 'Changes', paragraphs: ['VerumForma may change these Terms at any time. Changes take effect upon publication on this website.'] },
      { heading: 'Governing law and dispute resolution', paragraphs: ['These Terms are governed by Portuguese law. For consumer disputes, users may use the Portuguese electronic complaints book (<a href="https://www.livroreclamacoes.pt" target="_blank" rel="noreferrer" style="text-decoration:underline">livroreclamacoes.pt</a>) and the competent Alternative Dispute Resolution bodies.'] },
      { heading: 'Contact', paragraphs: ['For any question regarding these Terms, contact ' + mail + '.'] },
    ],
  },
}

export default async function TermosPage({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang)
  const c = content[params.lang] ?? content.pt
  return <LegalLayout dict={dict} lang={params.lang} title={c.title} updated={c.updated} intro={c.intro} sections={c.sections} />
}
