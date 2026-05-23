'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type Props = { lang: string }

export default function CookieBanner({ lang }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected')
    setVisible(false)
  }

  const isPt = lang === 'pt'
  const privacyHref = isPt ? '/pt/privacidade' : '/en/privacy'
  const policyLabel = isPt ? 'política de privacidade' : 'privacy policy'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          className="fixed bottom-0 left-0 right-0 z-50 px-6 py-5 md:px-12"
          style={{ backgroundColor: '#1A1A1A', borderTop: '1px solid #2A2A2A' }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="font-sans text-sm text-[#9E9994] leading-relaxed max-w-2xl">
              {isPt
                ? <>Utilizamos cookies para melhorar a sua experiência. Ao continuar, aceita a nossa{' '}<Link href={privacyHref} className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">{policyLabel}</Link>.</>
                : <>We use cookies to improve your experience. By continuing, you accept our{' '}<Link href={privacyHref} className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">{policyLabel}</Link>.</>
              }
            </p>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleReject}
                className="font-sans text-xs tracking-[0.1em] uppercase border border-white text-white px-5 py-2 hover:bg-white hover:text-[#1A1A1A] transition-colors duration-200"
                style={{ borderRadius: '2px' }}
              >
                {isPt ? 'Rejeitar' : 'Reject'}
              </button>
              <button
                onClick={handleAccept}
                className="font-sans text-xs tracking-[0.1em] uppercase bg-white text-[#1A1A1A] px-5 py-2 hover:bg-[#F5F2EE] transition-colors duration-200"
                style={{ borderRadius: '2px' }}
              >
                {isPt ? 'Aceitar' : 'Accept'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
