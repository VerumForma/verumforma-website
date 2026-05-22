import type { ReactNode } from 'react'

// Root layout is a passthrough. The [lang] nested layout renders
// <html> and <body> so Next.js can set lang per locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
