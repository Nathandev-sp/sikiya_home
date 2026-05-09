'use client'

import { Container } from '@/components/Container'

const accent = '#8B5E3C'
const headingBrown = '#4A3728'
const bodyMuted = '#444444'

function IconDocument({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.75" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconEye({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.75" aria-hidden>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconChat({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.75" aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconShieldCheck({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.75" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCalendar({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7v-5z" />
    </svg>
  )
}

const IconCalendarRepeat = IconCalendar

function IconUsers({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  )
}

function CircleIcon({ children }) {
  return (
    <div
      className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white sm:h-14 sm:w-14"
      style={{ backgroundColor: accent }}
    >
      {children}
    </div>
  )
}

export function JournalistMonetizationSection({ t }) {
  const j = t.explore.journalistMonetization

  const monetizationItems = [
    { icon: IconDocument, item: j.monetization.items.articles },
    { icon: IconEye, item: j.monetization.items.views },
    { icon: IconChat, item: j.monetization.items.engagement },
  ]

  const paidBetterItems = [
    {
      key: 'consistent',
      icon: <IconCalendar className="h-6 w-6 sm:h-7 sm:w-7" />,
      title: j.paidBetter.columns.consistent.title,
      description: j.paidBetter.columns.consistent.description,
    },
    {
      key: 'buildTrust',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: j.paidBetter.columns.buildTrust.title,
      description: j.paidBetter.columns.buildTrust.description,
    },
    {
      key: 'engageAudience',
      icon: <IconUsers className="h-6 w-6 sm:h-7 sm:w-7" />,
      title: j.paidBetter.columns.engageAudience.title,
      description: j.paidBetter.columns.engageAudience.description,
    },
  ]

  return (
    <section className="bg-[#FDFCF8] py-16 sm:py-20 md:py-24">
      <Container>
        <h2
          className="font-hero mx-auto max-w-3xl text-center text-[1.5rem] font-semibold leading-snug sm:text-[1.75rem] md:text-[2rem]"
          style={{ color: headingBrown }}
        >
          {j.mainTitle}
        </h2>

        <div className="mx-auto mt-10 max-w-3xl space-y-6 md:mt-12 md:space-y-7">
          {/* How you earn */}
          <article
            className="rounded-2xl bg-white px-6 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/[0.04] sm:px-8 sm:py-7"
            style={{ color: bodyMuted }}
          >
            <h3 className="font-hero text-left text-lg font-semibold sm:text-xl" style={{ color: headingBrown }}>
              {j.monetization.title}
            </h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed sm:text-base">{j.monetization.intro}</p>
            <ul className="mt-6 space-y-4">
              {monetizationItems.map(({ icon: Icon, item }) => (
                <li key={item.title} className="flex gap-3.5 sm:gap-4">
                  <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#8B5E3C]/[0.09]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-[0.9375rem] font-semibold leading-snug text-[#2A241C] sm:text-base">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#2A241C]/75">{item.hint}</p>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          {/* Trust score — emphasized */}
          <article
            className="relative overflow-hidden rounded-2xl border-l-[5px] px-6 py-6 shadow-[0_10px_36px_rgb(0,0,0,0.08)] sm:px-8 sm:py-7"
            style={{
              borderLeftColor: accent,
              background: 'linear-gradient(135deg, #EDE6DD 0%, #F5EFE8 55%, #FAF6F1 100%)',
              color: bodyMuted,
            }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/90 shadow-sm ring-1 ring-black/[0.06] sm:h-[4.5rem] sm:w-[4.5rem]">
                <IconShieldCheck className="h-10 w-10 sm:h-11 sm:w-11" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-hero text-left text-lg font-semibold sm:text-xl" style={{ color: headingBrown }}>
                  {j.trustScore.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed sm:text-base">{j.trustScore.body}</p>

                <div className="mt-5 rounded-xl bg-white/85 px-4 py-3 shadow-sm ring-1 ring-black/[0.05]">
                  <div className="flex items-center justify-between gap-3 text-xs font-medium text-[#4A3728]/85 sm:text-[0.8125rem]">
                    <span>{j.trustScore.visualLabel}</span>
                    <span style={{ color: accent }}>{j.trustScore.visualValue}</span>
                  </div>
                  <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-black/[0.08]">
                    <div className="h-full w-[72%] rounded-full bg-[#8B5E3C]" aria-hidden />
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Grow earnings */}
          <article
            className="rounded-2xl bg-white px-6 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/[0.04] sm:px-8 sm:py-7"
            style={{ color: bodyMuted }}
          >
            <h3 className="font-hero text-left text-lg font-semibold sm:text-xl" style={{ color: headingBrown }}>
              {j.paidBetter.title}
            </h3>
            <div className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6">
              {paidBetterItems.map(({ key, icon, title, description }) => (
                <div key={key} className="text-center">
                  <CircleIcon>{icon}</CircleIcon>
                  <p className="mt-4 text-[0.9375rem] font-semibold leading-snug text-[#2A241C] sm:text-base">{title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#2A241C]/80 sm:text-[0.9375rem]">{description}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </Container>
    </section>
  )
}
