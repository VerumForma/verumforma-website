import { redirect } from 'next/navigation'

// Middleware redirects / → /pt before this renders, but keep it as a
// fallback so Next.js has a page at the root segment.
export default function RootPage() {
  redirect('/pt')
}
