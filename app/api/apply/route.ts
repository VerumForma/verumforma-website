import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient, supabaseConfigured } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)
const DEFAULT_EMAIL = process.env.CONTACT_EMAIL ?? 'administracao@verumforma.pt'

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

  const { openingId, openingTitle, applyEmail, name, email, phone, cvUrl, message, company, locale } = body

  // Honeypot: humanos não preenchem "company".
  if (company && company.trim()) return NextResponse.json({ success: true })

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Nome e email são obrigatórios.' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
  }

  const lang = locale === 'en' ? 'en' : 'pt'
  const position = openingTitle || (lang === 'pt' ? 'Candidatura espontânea' : 'General application')
  const recruiter = applyEmail && isValidEmail(applyEmail) ? applyEmail : DEFAULT_EMAIL

  // Guardar candidatura (best-effort — nunca bloqueia o email).
  if (supabaseConfigured()) {
    try {
      const supabase = createClient()
      await supabase.from('job_applications').insert({
        opening_id: openingId || null,
        opening_title: openingTitle || null,
        name,
        email,
        phone: phone || null,
        message: message || null,
        cv_url: cvUrl || null,
        locale: lang,
      })
    } catch (err) {
      console.error('job_applications insert failed:', err)
    }
  }

  const timestamp = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon', dateStyle: 'full', timeStyle: 'short' })

  const internalHtml = `
    <!DOCTYPE html>
    <html><body style="font-family:sans-serif;color:#1A1A1A;max-width:600px;margin:0 auto;padding:32px 24px">
      <h2 style="font-size:20px;margin-bottom:24px">Nova candidatura — ${position}</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;width:140px">Nome</td><td style="padding:10px 0;border-bottom:1px solid #eee">${name}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">Email</td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">Telefone</td><td style="padding:10px 0;border-bottom:1px solid #eee">${phone || '—'}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">CV / Link</td><td style="padding:10px 0;border-bottom:1px solid #eee">${cvUrl ? `<a href="${cvUrl}">${cvUrl}</a>` : '—'}</td></tr>
        <tr><td style="padding:10px 0;font-weight:600;vertical-align:top">Mensagem</td><td style="padding:10px 0;white-space:pre-wrap">${message || '—'}</td></tr>
      </table>
      <p style="margin-top:32px;color:#888;font-size:12px">Recebido em ${timestamp} · via formulário de oportunidades de verumforma.pt</p>
    </body></html>`

  const confirmationHtml = lang === 'pt'
    ? `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1A1A1A;max-width:600px;margin:0 auto;padding:32px 24px"><p>Olá ${name},</p><p>Recebemos a tua candidatura para <strong>${position}</strong>. Obrigado pelo teu interesse — vamos analisar e entrar em contacto.</p><p style="margin-top:48px;color:#888;font-size:12px">VerumForma · O futuro constrói-se com verdade.</p></body></html>`
    : `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1A1A1A;max-width:600px;margin:0 auto;padding:32px 24px"><p>Hello ${name},</p><p>We've received your application for <strong>${position}</strong>. Thank you for your interest — we'll review it and get back to you.</p><p style="margin-top:48px;color:#888;font-size:12px">VerumForma · The future is built with truth.</p></body></html>`

  try {
    await Promise.all([
      resend.emails.send({
        from: 'VerumForma <noreply@verumforma.pt>',
        to: recruiter,
        replyTo: email,
        subject: `Nova candidatura — ${position}`,
        html: internalHtml,
      }),
      resend.emails.send({
        from: 'VerumForma <noreply@verumforma.pt>',
        to: email,
        subject: lang === 'pt' ? 'Recebemos a tua candidatura — VerumForma' : 'We received your application — VerumForma',
        html: confirmationHtml,
      }),
    ])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Resend error (apply):', err)
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
