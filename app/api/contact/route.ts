import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? 'orcamentos@verumforma.pt'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, projectType, message, locale } = body

  if (!name?.trim() || !email?.trim() || !projectType?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const lang = locale === 'en' ? 'en' : 'pt'

  const timestamp = new Date().toLocaleString('pt-PT', {
    timeZone: 'Europe/Lisbon',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  const internalHtml = `
    <!DOCTYPE html>
    <html><body style="font-family:sans-serif;color:#1A1A1A;max-width:600px;margin:0 auto;padding:32px 24px">
      <h2 style="font-size:20px;margin-bottom:24px">Novo pedido de contacto — ${projectType}</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;width:140px">Nome</td><td style="padding:10px 0;border-bottom:1px solid #eee">${name}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">Email</td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">Tipo de projeto</td><td style="padding:10px 0;border-bottom:1px solid #eee">${projectType}</td></tr>
        <tr><td style="padding:10px 0;font-weight:600;vertical-align:top">Mensagem</td><td style="padding:10px 0;white-space:pre-wrap">${message}</td></tr>
      </table>
      <p style="margin-top:32px;color:#888;font-size:12px">Recebido em ${timestamp}</p>
      <p style="color:#888;font-size:12px">Este email foi enviado automaticamente pelo formulário de contacto de verumforma.pt</p>
    </body></html>
  `

  const confirmationHtml = lang === 'pt'
    ? `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1A1A1A;max-width:600px;margin:0 auto;padding:32px 24px"><p>Olá ${name},</p><p>Recebemos o seu pedido e entraremos em contacto em breve.</p><p>Obrigado por escolher a VerumForma.</p><p style="margin-top:48px;color:#888;font-size:12px">VerumForma · O futuro constrói-se com verdade.</p></body></html>`
    : `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1A1A1A;max-width:600px;margin:0 auto;padding:32px 24px"><p>Hello ${name},</p><p>We have received your request and will be in touch shortly.</p><p>Thank you for choosing VerumForma.</p><p style="margin-top:48px;color:#888;font-size:12px">VerumForma · The future is built with truth.</p></body></html>`

  try {
    await Promise.all([
      resend.emails.send({
        from: 'VerumForma Website <noreply@verumforma.pt>',
        to: CONTACT_EMAIL,
        subject: `Novo pedido de contacto — ${projectType}`,
        html: internalHtml,
      }),
      resend.emails.send({
        from: 'VerumForma <noreply@verumforma.pt>',
        to: email,
        subject: lang === 'pt'
          ? 'Recebemos o seu pedido — VerumForma'
          : 'We received your request — VerumForma',
        html: confirmationHtml,
      }),
    ])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
