import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export const locales = ['pt', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'pt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static assets (api excluded by matcher below).
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // --- Admin: refresh session + gate access ---
  if (pathname.startsWith('/admin')) {
    const { response, user } = await updateSession(request)
    const isLogin = pathname === '/admin/login'
    if (!user && !isLogin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    if (user && isLogin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
    return response
  }

  // --- i18n: ensure a locale prefix on public routes ---
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (pathnameHasLocale) return NextResponse.next()

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}
