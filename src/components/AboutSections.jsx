'use client'

import { AboutFaq } from '@/components/AboutFaq'
import { AboutPrivacyPolicy } from '@/components/AboutPrivacyPolicy'
import { Container } from '@/components/Container'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'

function CheckCircleIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="8.25" stroke="#A67C52" strokeWidth="1.35" />
      <path
        d="M6 10.25 8.75 13 14 7.75"
        stroke="#A67C52"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AboutSections() {
  const { language } = useLanguage()
  const about = getTranslation(language).aboutPage

  if (!about) return null

  const locations = about.builtForAfrica?.locations ?? []

  return (
    <>
      <section className="bg-[#2a261c] py-20 sm:py-28 lg:py-32">
        <Container>
          <div className="mx-auto max-w-3xl px-1 text-center">
            <h1 className="font-hero text-balance text-3xl font-medium leading-[1.2] tracking-tight text-white sm:text-4xl md:text-[2.65rem] md:leading-[1.15]">
              {about.hero.title}
            </h1>
            <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-relaxed text-white/90 sm:text-lg">
              {about.hero.subtitle}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-[#F5F1EB] py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-10">
            <div>
              <h2 className="font-hero text-2xl font-semibold tracking-tight text-[#1a1a1a] sm:text-[1.75rem]">
                {about.problemResponse.problemTitle}
              </h2>
              <ul className="mt-8 space-y-6 pl-1">
                {(about.problemResponse.problemItems ?? []).map((item) => (
                  <li
                    key={item.title}
                    className="relative pl-6 font-sans text-[0.9375rem] leading-relaxed text-[#3d3834] before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#1a1a1a] sm:text-base"
                  >
                    <p className="font-semibold text-[#2c2824]">{item.title}</p>
                    <p className="mt-1.5">{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-hero text-2xl font-semibold tracking-tight text-[#A67C52] sm:text-[1.75rem]">
                {about.problemResponse.responseTitle}
              </h2>
              <p className="mt-6 font-sans text-[0.9375rem] leading-relaxed text-[#3d3834] sm:text-base">
                {about.problemResponse.responseIntro}
              </p>
              <ul className="mt-8 space-y-6">
                {(about.problemResponse.responseItems ?? []).map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <CheckCircleIcon className="mt-1 h-5 w-5 shrink-0" />
                    <div className="font-sans text-[0.9375rem] leading-relaxed text-[#3d3834] sm:text-base">
                      <p className="font-semibold text-[#2c2824]">{item.title}</p>
                      <p className="mt-1.5">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#f8f5f0] py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="font-hero text-3xl font-bold tracking-tight text-[#2a2520] sm:text-[2.125rem]">
              {about.builtForAfrica.title}
            </h2>
            <p className="mx-auto mt-6 max-w-3xl font-sans text-base leading-relaxed text-[#6b635a] sm:text-lg">
              {about.builtForAfrica.subtitle}
            </p>
            <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-8">
              {locations.map((loc) => (
                <div key={`${loc.city}-${loc.country}`}>
                  <p className="font-hero text-lg font-semibold tracking-tight text-[#66462C] sm:text-xl">
                    {loc.city}
                  </p>
                  <p className="mt-1.5 font-sans text-sm text-[#5c554c]">{loc.country}</p>
                  <p className="mt-3">
                    <span className="inline-block rounded-full border border-[#A67C52]/45 bg-[#A67C52]/12 px-2.5 py-1 font-sans text-[0.6875rem] font-medium uppercase tracking-wide text-[#5a4528]">
                      {about.builtForAfrica.comingSoon}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <AboutFaq />
      <AboutPrivacyPolicy />
    </>
  )
}
