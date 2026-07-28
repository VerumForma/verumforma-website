'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-playfair text-2xl text-white mb-1">VerumForma</h1>
        <p className="text-sm text-[#9E9994] mb-8">Painel de administração</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#6B6560] mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#2A2A2A] text-white text-sm px-4 py-3 border border-[#3A3A3A] outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#6B6560] mb-2">Palavra-passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#2A2A2A] text-white text-sm px-4 py-3 border border-[#3A3A3A] outline-none focus:border-white transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-[#1A1A1A] text-sm uppercase tracking-wider py-3 mt-2 hover:bg-[#F5F2EE] transition-colors disabled:opacity-50"
          >
            {loading ? 'A entrar…' : 'Entrar'}
          </button>
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </form>
      </div>
    </div>
  )
}
