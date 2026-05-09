'use client'

import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'

export default function TopContributorsPage() {
  const { language } = useLanguage()
  const tc = getTranslation(language).topContributors

  return (
    <>
      <Header />

      <main className="relative grow shrink-0 overflow-x-clip bg-[#faf8f4] pb-28 sm:pb-36">
        <Container className="relative z-[1] mt-14 sm:mt-16">
          <header className="mx-auto max-w-3xl text-center">
            <h1 className="font-hero text-4xl font-bold tracking-tight text-[#1a1814] sm:text-[2.5rem] sm:leading-[1.15]">
              {tc.title}
            </h1>
            <p className="mt-5 font-sans text-base leading-relaxed text-[#6b635a] sm:text-lg">{tc.subtitle}</p>
          </header>

          <div className="mx-auto mt-14 max-w-2xl lg:mt-16">
            <div className="rounded-2xl border border-[#efe9e3] bg-white px-8 py-10 text-center shadow-[0_12px_40px_-18px_rgba(24,16,10,0.18)] sm:px-10 sm:py-12">
              <p className="font-hero text-lg leading-relaxed text-[#1a1814] sm:text-xl">{tc.recruitmentMessage}</p>
            </div>
          </div>

          {/*
            When featured journalists are ready, import and render:
            import { TopContributorCards } from '@/components/top_contributors/TopContributorCards'
            <TopContributorCards profiles={tc.profiles ?? []} verifiedProfileLabel={tc.verifiedProfile} />
          */}
        </Container>
      </main>

      <Footer />
    </>
  )
}
