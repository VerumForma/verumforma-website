'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={signOut}
      className="text-xs text-[#9E9994] hover:text-white underline underline-offset-2 transition-colors"
    >
      Terminar sessão
    </button>
  )
}
