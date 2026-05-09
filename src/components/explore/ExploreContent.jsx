'use client'

import Link from 'next/link'

import { Container } from '@/components/Container'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'

import { PhoneMockupPlaceholder } from '@/components/explore/PhoneMockupPlaceholder'
import { JournalistMonetizationSection } from '@/components/explore/JournalistMonetizationSection'

/** Order matches `t.explore.forUsers.items` (4 cards). Reorder to swap screenshots. */
const EXPLORE_USER_SCREENSHOTS = [
  '/Screenshots/HomeScreenSH.png',
  '/Screenshots/AuthorScreenSH.png',
  '/Screenshots/DiscussionLaneSH.png',
  '/Screenshots/ExpertSH.png',
]

/** Order matches `t.explore.forJournalists.items` (3 cards). */
const EXPLORE_JOURNALIST_SCREENSHOTS = [
  '/Screenshots/PublishSH.png',
  '/Screenshots/JournalistSH.png',
  '/Screenshots/UserProfileSH.png',
]

function StoreButtons() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  return (
    <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:mt-14 sm:flex-row sm:gap-6">
      <Link
        href="/app-launch"
        className="group flex w-full max-w-[15rem] items-center gap-3 rounded-xl bg-[#2A241C] px-5 py-3.5 text-white shadow-lg shadow-black/15 ring-1 ring-black/10 transition hover:bg-[#1f1812] sm:w-auto"
      >
        <svg
          className="h-9 w-9 shrink-0 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 4.23 7.6 9.83 7.37c1.15.13 2.1.72 3.12.8 1.18-.15 2.29-.66 3.52-.6 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
        <div className="min-w-0 text-left">
          <div className="text-[0.7rem] leading-tight text-white/85">
            {t.contribute.appStore.downloadOn}
          </div>
          <div className="font-semibold leading-tight tracking-tight">
            {t.contribute.appStore.name}
          </div>
        </div>
      </Link>

      <Link
        href="/app-launch"
        className="group flex w-full max-w-[15rem] items-center gap-3 rounded-xl bg-[#2A241C] px-5 py-3.5 text-white shadow-lg shadow-black/15 ring-1 ring-black/10 transition hover:bg-[#1f1812] sm:w-auto"
      >
        <svg
          className="h-9 w-9 shrink-0 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
        </svg>
        <div className="min-w-0 text-left">
          <div className="text-[0.7rem] leading-tight text-white/85">
            {t.contribute.googlePlay.getItOn}
          </div>
          <div className="font-semibold leading-tight tracking-tight">
            {t.contribute.googlePlay.name}
          </div>
        </div>
      </Link>
    </div>
  )
}

function FeatureGrid({ title, items, columns, phonePlaceholder, phoneScreens }) {
  const grid =
    columns === 4
      ? 'grid gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-4 lg:gap-x-6'
      : 'grid gap-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-16 lg:grid-cols-3 lg:gap-x-12'

  return (
    <div>
      <h2 className="font-hero text-center text-[2rem] font-semibold leading-tight tracking-tight text-[#2A241C] sm:text-4xl md:text-[2.35rem]">
        {title}
      </h2>
      <ul className={`mt-14 ${grid} list-none p-0`}>
        {items.map((item, i) => {
          const screen = phoneScreens?.[i]
          const hasScreen = Boolean(screen)

          return (
            <li key={i} className="flex flex-col items-center text-center">
              <h3 className="text-base font-semibold leading-snug text-[#2A241C] sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-[#2A241C]/85 sm:text-[0.9375rem]">
                {item.description}
              </p>
              <div className="mt-8 w-full">
                <PhoneMockupPlaceholder
                  label={hasScreen ? undefined : phonePlaceholder}
                  src={hasScreen ? screen : undefined}
                  alt={hasScreen ? `${item.title} — Sikiya app` : undefined}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function ExploreContent() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  const userScreens = EXPLORE_USER_SCREENSHOTS
  const journalistScreens = EXPLORE_JOURNALIST_SCREENSHOTS

  return (
    <div className="text-[#2A241C]">
      <section className="bg-[#F9F8F6] py-20 sm:py-24 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-hero text-[2.15rem] font-semibold leading-tight tracking-tight text-[#2A241C] sm:text-4xl md:text-5xl">
              {t.explore.startContributing.title}
            </h1>
            <p className="mt-8 text-base leading-relaxed text-[#2A241C] sm:text-lg">
              {t.explore.startContributing.paragraph1}
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#2A241C] sm:text-lg">
              {t.explore.startContributing.paragraph2}
            </p>
            <StoreButtons />
          </div>
        </Container>
      </section>

      <section className="bg-[#FDFCF8] py-20 sm:py-24 md:py-28">
        <Container>
          <FeatureGrid
            title={t.explore.forUsers.title}
            items={t.explore.forUsers.items}
            columns={4}
            phonePlaceholder={t.explore.phonePlaceholder}
            phoneScreens={userScreens}
          />
        </Container>
      </section>

      <section className="bg-[#F9F8F6] py-20 sm:py-24 md:pb-32 md:pt-28">
        <Container>
          <FeatureGrid
            title={t.explore.forJournalists.title}
            items={t.explore.forJournalists.items}
            columns={3}
            phonePlaceholder={t.explore.phonePlaceholder}
            phoneScreens={journalistScreens}
          />
        </Container>
      </section>

      <JournalistMonetizationSection t={t} />
    </div>
  )
}
