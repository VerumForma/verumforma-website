'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { IgIcon, YtIcon } from '@/components/icons/social'
import type { Dictionary } from '@/lib/getDictionary'
import type { SocialMedia } from '@/lib/supabase/types'

type Props = { dict: Dictionary; items: SocialMedia[] }
type Kind = 'portrait' | 'landscape' | 'square'

function kindOf(item: SocialMedia): Kind {
  const a = item.aspect_ratio || (item.platform === 'youtube' ? 'landscape' : 'square')
  return a === 'portrait' ? 'portrait' : a === 'landscape' ? 'landscape' : 'square'
}

export default function SocialCarousel({ dict, items }: Props) {
  const t = dict.social
  const scroller = useRef<HTMLDivElement>(null)
  if (!items || items.length === 0) return null

  function page(dir: -1 | 1) {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section id="social" className="py-24 px-6 md:px-12 border-t border-[rgba(26,26,26,0.06)]" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.18em] uppercase font-sans text-[#6B6560] mb-2">{t.label}</p>
            <h2 className="font-playfair text-3xl md:text-4xl text-[#1A1A1A]">{t.headline}</h2>
          </div>
          {items.length > 4 && (
            <div className="hidden sm:flex gap-2">
              <button onClick={() => page(-1)} aria-label="Anterior" className="w-9 h-9 flex items-center justify-center border border-[rgba(26,26,26,0.15)] hover:border-[#1A1A1A] transition-colors"><ChevronLeft size={16} /></button>
              <button onClick={() => page(1)} aria-label="Seguinte" className="w-9 h-9 flex items-center justify-center border border-[rgba(26,26,26,0.15)] hover:border-[#1A1A1A] transition-colors"><ChevronRight size={16} /></button>
            </div>
          )}
        </div>

        {/* Grelha 2 linhas × colunas infinitas. quadrado=1x1, vertical=1x2, horizontal=2x1.
            O grid-flow-col-dense empacota automaticamente. */}
        <div
          ref={scroller}
          className="grid grid-flow-col-dense grid-rows-2 gap-3 overflow-x-auto pb-2"
          style={{ gridAutoColumns: 'var(--cell)', gridTemplateRows: 'repeat(2, var(--cell))', ['--cell' as string]: 'clamp(150px, 22vw, 240px)', scrollbarWidth: 'none' }}
        >
          {items.map(item => {
            const k = kindOf(item)
            const isYt = item.platform === 'youtube'
            const span = k === 'portrait' ? 'row-span-2' : k === 'landscape' ? 'col-span-2' : ''
            return (
              <a
                key={item.id}
                href={item.link || '#'}
                target="_blank"
                rel="noreferrer"
                className={`group relative block overflow-hidden bg-[#2A2A2A] ${span}`}
              >
                {item.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.thumbnail_url} alt={item.title ?? ''} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20">
                    {isYt ? <Play size={36} /> : <IgIcon size={36} />}
                  </div>
                )}
                <span className="absolute top-3 left-3 text-white/90 drop-shadow">
                  {isYt ? <YtIcon size={20} /> : <IgIcon size={18} />}
                </span>
                {isYt && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white group-hover:bg-black/70 transition-colors"><Play size={20} /></span>
                  </span>
                )}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
