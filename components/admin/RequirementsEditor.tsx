'use client'

import type { RequirementSpecs, LanguageItem } from '@/lib/requirements'
import { ACADEMIC_LEVELS, DRIVING_CATEGORIES, LANGUAGE_LEVELS, SKILL_SUGGESTIONS } from '@/lib/requirements'

const input =
  'w-full bg-white text-sm px-3 py-2 border border-[rgba(26,26,26,0.15)] outline-none focus:border-[#1A1A1A] transition-colors'
const sublabel = 'block text-[11px] uppercase tracking-wider text-[#6B6560] mb-1'

type Props = { value: RequirementSpecs; onChange: (v: RequirementSpecs) => void }

export default function RequirementsEditor({ value, onChange }: Props) {
  const v = value || {}
  const academic = v.academic ?? { enabled: false, level: '', field: '' }
  const driving = v.driving ?? { enabled: false, categories: [] }
  const experience = v.experience ?? { enabled: false, years: '', field: '' }
  const languages = v.languages ?? { enabled: false, items: [] }
  const skills = v.skills ?? { enabled: false, items: [] }

  const patch = (k: keyof RequirementSpecs, val: unknown) => onChange({ ...v, [k]: val })

  function Toggle({ on, label, onToggle }: { on: boolean; label: string; onToggle: (b: boolean) => void }) {
    return (
      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
        <input type="checkbox" checked={on} onChange={e => onToggle(e.target.checked)} />
        {label}
      </label>
    )
  }

  const card = 'border border-[rgba(26,26,26,0.12)] p-4'

  return (
    <div className="flex flex-col gap-3">
      {/* Habilitações */}
      <div className={card}>
        <Toggle on={academic.enabled} label="Habilitações académicas" onToggle={b => patch('academic', { ...academic, enabled: b })} />
        {academic.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className={sublabel}>Nível</label>
              <select className={input} value={academic.level} onChange={e => patch('academic', { ...academic, level: e.target.value })}>
                <option value="">—</option>
                {ACADEMIC_LEVELS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={sublabel}>Curso / área (opcional)</label>
              <input className={input} placeholder="Ex: Engenharia Civil" value={academic.field} onChange={e => patch('academic', { ...academic, field: e.target.value })} />
            </div>
          </div>
        )}
      </div>

      {/* Carta de condução */}
      <div className={card}>
        <Toggle on={driving.enabled} label="Carta de condução" onToggle={b => patch('driving', { ...driving, enabled: b })} />
        {driving.enabled && (
          <div className="flex flex-wrap gap-2 mt-3">
            {DRIVING_CATEGORIES.map(c => {
              const on = driving.categories.includes(c)
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => patch('driving', { ...driving, categories: on ? driving.categories.filter(x => x !== c) : [...driving.categories, c] })}
                  className={`text-xs uppercase tracking-wider px-3 py-1.5 border ${on ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-[rgba(26,26,26,0.15)] text-[#6B6560] hover:border-[#1A1A1A]'}`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Experiência */}
      <div className={card}>
        <Toggle on={experience.enabled} label="Experiência profissional" onToggle={b => patch('experience', { ...experience, enabled: b })} />
        {experience.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className={sublabel}>Anos mínimos</label>
              <input className={input} placeholder="Ex: 3+" value={experience.years} onChange={e => patch('experience', { ...experience, years: e.target.value })} />
            </div>
            <div>
              <label className={sublabel}>Área (opcional)</label>
              <input className={input} placeholder="Ex: Construção" value={experience.field} onChange={e => patch('experience', { ...experience, field: e.target.value })} />
            </div>
          </div>
        )}
      </div>

      {/* Línguas */}
      <div className={card}>
        <Toggle on={languages.enabled} label="Línguas" onToggle={b => patch('languages', { ...languages, enabled: b })} />
        {languages.enabled && (
          <div className="flex flex-col gap-2 mt-3">
            {languages.items.map((it: LanguageItem, i: number) => (
              <div key={i} className="flex gap-2">
                <input className={input} placeholder="Língua" value={it.lang} onChange={e => { const n = [...languages.items]; n[i] = { ...n[i], lang: e.target.value }; patch('languages', { ...languages, items: n }) }} />
                <select className={input} value={it.level} onChange={e => { const n = [...languages.items]; n[i] = { ...n[i], level: e.target.value }; patch('languages', { ...languages, items: n }) }}>
                  <option value="">Nível…</option>
                  {LANGUAGE_LEVELS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <button type="button" onClick={() => patch('languages', { ...languages, items: languages.items.filter((_, idx) => idx !== i) })} className="text-xs text-red-500 shrink-0 px-2">×</button>
              </div>
            ))}
            <button type="button" onClick={() => patch('languages', { ...languages, items: [...languages.items, { lang: '', level: '' }] })} className="self-start text-xs uppercase tracking-wider text-[#1A1A1A] border border-[rgba(26,26,26,0.2)] px-3 py-1.5 hover:bg-[rgba(26,26,26,0.04)]">+ Adicionar língua</button>
          </div>
        )}
      </div>

      {/* Competências */}
      <div className={card}>
        <Toggle on={skills.enabled} label="Competências / software" onToggle={b => patch('skills', { ...skills, enabled: b })} />
        {skills.enabled && (
          <div className="flex flex-col gap-3 mt-3">
            <div className="flex flex-wrap gap-2">
              {SKILL_SUGGESTIONS.map(sug => {
                const on = skills.items.includes(sug)
                return (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => patch('skills', { ...skills, items: on ? skills.items.filter(x => x !== sug) : [...skills.items, sug] })}
                    className={`text-xs px-3 py-1.5 border transition-colors ${on ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-[rgba(26,26,26,0.15)] text-[#6B6560] hover:border-[#1A1A1A]'}`}
                  >
                    {on ? sug : `+ ${sug}`}
                  </button>
                )
              })}
            </div>
            {skills.items.map((sk: string, i: number) => (
              <div key={i} className="flex gap-2">
                <input className={input} placeholder="Ex: AutoCAD" value={sk} onChange={e => { const n = [...skills.items]; n[i] = e.target.value; patch('skills', { ...skills, items: n }) }} />
                <button type="button" onClick={() => patch('skills', { ...skills, items: skills.items.filter((_, idx) => idx !== i) })} className="text-xs text-red-500 shrink-0 px-2">×</button>
              </div>
            ))}
            <button type="button" onClick={() => patch('skills', { ...skills, items: [...skills.items, ''] })} className="self-start text-xs uppercase tracking-wider text-[#1A1A1A] border border-[rgba(26,26,26,0.2)] px-3 py-1.5 hover:bg-[rgba(26,26,26,0.04)]">+ Adicionar competência</button>
          </div>
        )}
      </div>
    </div>
  )
}
