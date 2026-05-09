'use client'

import Image from 'next/image'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { MissionSlider } from '@/components/MissionSlider'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'

/** Five small collage tiles around the headline (order: top-left → top-center → top-right → bottom-left → bottom-right). */
const HERO_COLLAGE = [
  { src: '/Images/Okapi_image.jpg', sizes: '132px' },
  { src: '/Images/Gold_mines.jpg', sizes: '144px', priority: true },
  { src: '/Images/capetown.jpg', sizes: '132px' },
  { src: '/Images/African_business.jpg', sizes: '148px' },
  { src: '/Images/African_celebration.jpg', sizes: '148px' },
]

export function Hero() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  return (
    <>
      <section className="relative isolate min-h-[36rem] w-full overflow-x-clip bg-[#F9F9F7] pb-24 pt-10 sm:min-h-[40rem] sm:pb-32 sm:pt-12 md:pb-36 md:pt-14 lg:min-h-[42rem] lg:pb-40 lg:pt-16">
        {/* Collage anchored to same centered band as copy (max-w-7xl ≈ Container) */}
        <div
          className="pointer-events-none absolute inset-x-4 inset-y-8 overflow-visible sm:inset-x-6 lg:inset-x-8"
          aria-hidden="true"
        >
          <div className="relative mx-auto h-full max-w-7xl">
            {/* Top left — inner edge of hero band */}
            <div className="absolute left-6 top-2 hidden h-24 w-[6.75rem] overflow-hidden rounded-[1.125rem] shadow-lg shadow-black/12 sm:left-8 sm:block sm:h-[5.75rem] md:top-4 md:h-28 md:w-32 lg:left-12 lg:top-6 lg:w-[8.75rem]">
              <Image
                src={HERO_COLLAGE[0].src}
                alt=""
                fill
                sizes={HERO_COLLAGE[0].sizes}
                className="object-cover"
              />
            </div>
            {/* Top center — Gold mines (largest tile); visible from sm so it isn’t missing on tablet */}
            <div className="absolute left-1/2 top-0 hidden h-28 w-32 max-w-[calc(100%-2rem)] -translate-x-1/2 overflow-hidden rounded-2xl shadow-md shadow-black/10 sm:block sm:h-[7.25rem] sm:w-[8.25rem] lg:h-32 lg:w-36">
              <Image
                src={HERO_COLLAGE[1].src}
                alt=""
                fill
                priority={HERO_COLLAGE[1].priority === true}
                sizes={HERO_COLLAGE[1].sizes}
                className="object-cover"
              />
            </div>
            {/* Top right */}
            <div className="absolute right-6 top-3 hidden h-24 w-[6.75rem] overflow-hidden rounded-[1.125rem] shadow-lg shadow-black/12 sm:right-8 sm:block sm:h-[6.25rem] md:top-5 md:h-28 md:w-32 lg:right-12 lg:top-7 lg:w-[8.75rem]">
              <Image
                src={HERO_COLLAGE[2].src}
                alt=""
                fill
                sizes={HERO_COLLAGE[2].sizes}
                className="object-cover"
              />
            </div>
            {/* Lower left — flanking the copy block */}
            <div className="absolute bottom-[8%] left-5 hidden h-[7rem] w-[7.75rem] overflow-hidden rounded-[1.125rem] shadow-lg shadow-black/12 sm:left-8 sm:block md:bottom-[10%] lg:bottom-[12%] lg:left-12 lg:h-32 lg:w-36">
              <Image
                src={HERO_COLLAGE[3].src}
                alt=""
                fill
                sizes={HERO_COLLAGE[3].sizes}
                className="object-cover"
              />
            </div>
            {/* Lower right */}
            <div className="absolute right-5 bottom-[6%] hidden h-[7rem] w-[7.75rem] overflow-hidden rounded-[1.125rem] shadow-lg shadow-black/12 sm:right-8 sm:block md:bottom-[8%] lg:bottom-[10%] lg:right-12 lg:h-32 lg:w-36">
              <Image
                src={HERO_COLLAGE[4].src}
                alt=""
                fill
                sizes={HERO_COLLAGE[4].sizes}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <Container className="relative w-full">
          {/* Pad clears center tile (h ~7.25–8rem) + gap so subtitle never sits under the photo */}
          <div className="relative z-10 mx-auto w-full max-w-3xl text-center md:max-w-4xl md:pt-[9.75rem] lg:pt-[10.75rem]">
            <p className="text-xs font-semibold uppercase leading-relaxed tracking-[0.16em] text-[#8D6242] sm:text-sm">
              {t.hero.tagline}
            </p>

            <h1 className="font-hero mt-9 text-balance text-[2rem] font-medium leading-[1.2] tracking-tight text-[#2A1B14] sm:mt-10 sm:text-4xl sm:leading-[1.15] md:mt-12 md:text-5xl lg:mt-14 lg:text-6xl lg:leading-[1.1]">
              {t.hero.titleLead}{' '}
              <span className="relative inline-block">
                <span className="relative z-[1]">{t.hero.titleAccent}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className={`pointer-events-none absolute top-full mt-2 h-[0.42em] w-full fill-[#8D6242]/50 sm:h-[0.48em] ${
                    language === 'en'
                      ? 'left-0 -translate-x-[0.2em] sm:-translate-x-[0.28em] md:-translate-x-[0.35em]'
                      : 'left-0'
                  }`}
                  preserveAspectRatio="none"
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </svg>
              </span>
            </h1>

            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:mt-16 sm:flex-row sm:gap-10 lg:mt-[4.25rem]">
              <Button
                href="/explore"
                color="blue"
                className="rounded-[0.65rem] px-6 py-2.5 text-[0.9375rem] font-semibold shadow-sm"
              >
                {t.hero.downloadButton}
              </Button>
              <Button
                href="/top_contributors"
                variant="outline"
                color="slate"
                className="rounded-[0.65rem] px-6 py-2.5 text-[0.9375rem] font-semibold text-[#4A3428] ring-[#D4C9BE] hover:bg-[#F3F0EB] hover:text-[#2A1B14]"
              >
                {t.hero.topJournalistsButton}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <MissionSlider />
    </>
  )
}
