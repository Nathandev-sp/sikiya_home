'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Container } from '@/components/Container'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'

/** July 1, 2026 00:00:00 in the visitor's local timezone */
const LAUNCH_LOCAL = new Date(2026, 6, 1, 0, 0, 0, 0)

function getRemainingMs() {
  return Math.max(0, LAUNCH_LOCAL.getTime() - Date.now())
}

function msToParts(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const seconds = totalSeconds % 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  const minutes = totalMinutes % 60
  const totalHours = Math.floor(totalMinutes / 60)
  const hours = totalHours % 24
  const days = Math.floor(totalHours / 24)
  return { days, hours, minutes, seconds }
}

export function AppLaunchContent() {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const a = t.appLaunch

  const [parts, setParts] = useState(() => msToParts(getRemainingMs()))

  useEffect(() => {
    const tick = () => setParts(msToParts(getRemainingMs()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const isLive = getRemainingMs() === 0

  return (
    <section className="bg-[#F9F8F6] py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-hero text-[2rem] font-semibold leading-tight tracking-tight text-[#2A241C] sm:text-4xl md:text-5xl">
            {a.title}
          </h1>
          <p className="mt-8 text-base leading-relaxed text-[#2A241C]/90 sm:text-lg">{a.message}</p>

          {!isLive ? (
            <div
              className="mt-12 grid grid-cols-2 gap-4 sm:mx-auto sm:grid-cols-4 sm:gap-6"
              role="timer"
              aria-live="polite"
              aria-atomic="true"
            >
              {[
                { value: parts.days, label: a.days },
                { value: parts.hours, label: a.hours },
                { value: parts.minutes, label: a.minutes },
                { value: parts.seconds, label: a.seconds },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl bg-white px-4 py-6 shadow-md shadow-black/[0.06] ring-1 ring-[#2A241C]/10"
                >
                  <div className="font-hero text-3xl font-semibold tabular-nums text-[#2A241C] sm:text-4xl">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="mt-2 text-xs font-medium uppercase tracking-wide text-[#2A241C]/60">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-lg font-medium text-[#2A241C]">{a.live}</p>
          )}

          <p className="mt-14">
            <Link
              href="/"
              className="text-sm font-semibold text-[#8D6242] underline-offset-4 transition hover:text-[#2A241C] hover:underline"
            >
              {a.back}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  )
}
