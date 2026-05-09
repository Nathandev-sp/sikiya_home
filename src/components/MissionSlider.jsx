'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'

/**
 * Mission slides use four wide images from `public/Images` (paired with `mission.slides` in order).
 * 1 Where Africa Speaks → discussion | 2 Beyond the Headlines | 3 Trust | 4 Africa-focused network
 */
const SLIDE_VISUAL = [
  {
    image: '/Images/Where_discussion_starts.jpg',
    alt: '',
    imageRight: false,
    variant: 'cream',
    iconSrc: '/icons/mission/conversation.svg',
  },
  {
    image: '/Images/Beyond_the_headlines.jpg',
    alt: '',
    imageRight: true,
    variant: 'white',
    iconSrc: '/icons/mission/loudspeaker.svg',
  },
  {
    image: '/Images/Accountability.jpg',
    alt: '',
    imageRight: true,
    variant: 'white',
    icon: 'shield',
  },
  {
    image: '/Images/African_Continent.jpg',
    alt: '',
    imageRight: false,
    variant: 'cream',
    iconSrc: '/icons/mission/map.svg',
  },
]

function ShieldIcon({ className }) {
  const cn = clsx('h-7 w-7 shrink-0 text-[#8D6242]', className)
  return (
    <svg className={cn} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      />
    </svg>
  )
}

function MissionSlideIcon({ meta }) {
  if (meta.iconSrc) {
    return (
      <Image
        src={meta.iconSrc}
        alt=""
        width={28}
        height={28}
        className="mt-0.5 h-7 w-7 shrink-0 object-contain"
        unoptimized
      />
    )
  }
  if (meta.icon === 'shield') {
    return <ShieldIcon className="mt-0.5" />
  }
  return null
}

function MissionScrollReveal({ direction, children }) {
  const ref = useRef(null)
  const revealTimeoutRef = useRef(null)
  const [shown, setShown] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reduced = mq.matches
    setReduceMotion(reduced)
    if (reduced) {
      setShown(true)
      return undefined
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          io.unobserve(entry.target)
          revealTimeoutRef.current = window.setTimeout(() => {
            revealTimeoutRef.current = null
            requestAnimationFrame(() => setShown(true))
          }, 180)
        })
      },
      {
        threshold: 0.22,
        rootMargin: '0px 0px -18% 0px',
      },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (revealTimeoutRef.current != null) {
        window.clearTimeout(revealTimeoutRef.current)
        revealTimeoutRef.current = null
      }
    }
  }, [])

  const fromLeft = direction === 'left'
  const settled = reduceMotion || shown
  const slideAmount = 'min(7rem, 18vw)'

  return (
    <div
      ref={ref}
      className="[backface-visibility:hidden]"
      style={{
        opacity: settled ? 1 : 0,
        transform: settled
          ? 'translate3d(0, 0, 0)'
          : fromLeft
            ? `translate3d(calc(-1 * ${slideAmount}), 0, 0)`
            : `translate3d(${slideAmount}, 0, 0)`,
        transition: reduceMotion
          ? 'none'
          : 'transform 1.65s cubic-bezier(0.2, 0.85, 0.25, 1), opacity 1.25s cubic-bezier(0.25, 0.1, 0.25, 1)',
        willChange: settled ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}

export function MissionSlider() {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const slides = t.mission?.slides ?? []
  const count = Math.min(slides.length, SLIDE_VISUAL.length)

  if (!slides.length || !count) return null

  const paired = slides
    .slice(0, count)
    .map((slide, i) => ({ slide, meta: SLIDE_VISUAL[i] }))
    .reverse()

  return (
    <div
      id="our-mission"
      className="scroll-mt-24 bg-[#F6F3EF] py-16 sm:py-24 lg:py-28"
    >
      <Container>
        <h2 className="font-display text-center text-3xl font-semibold tracking-tight text-[#2A1B14] sm:text-4xl md:text-5xl">
          {t.hero.missionTitle}
        </h2>

        <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-8 sm:mt-14 sm:gap-10 lg:mt-16 lg:gap-11">
          {paired.map(({ slide, meta }, index) => {
            if (!meta) return null
            const isExternal = typeof meta.image === 'string'
            const shiftLeft = index % 2 === 0
            const bg = meta.variant === 'cream' ? 'bg-[#F9F9F7]' : 'bg-white'

            return (
              <MissionScrollReveal key={slide.title} direction={shiftLeft ? 'left' : 'right'}>
              <article
                className={clsx(
                  'w-full max-w-5xl rounded-2xl shadow-lg shadow-black/[0.06] ring-1 ring-black/[0.06]',
                  bg,
                  shiftLeft
                    ? 'mr-auto -translate-x-1 sm:-translate-x-4 md:-translate-x-6 lg:-translate-x-10'
                    : 'ml-auto translate-x-1 sm:translate-x-4 md:translate-x-6 lg:translate-x-10',
                )}
              >
                <div
                  className={clsx(
                    'grid gap-4 px-4 py-4 sm:gap-5 sm:px-5 sm:py-5 md:grid-cols-2 md:items-center md:gap-6 lg:gap-7 lg:px-5 lg:py-6',
                  )}
                >
                  <div
                    className={clsx(
                      'relative aspect-[16/11] w-full overflow-hidden rounded-xl shadow-md ring-1 ring-black/[0.04]',
                      meta.imageRight && 'md:order-2',
                    )}
                  >
                    {isExternal ? (
                      <Image
                        src={meta.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 46vw"
                      />
                    ) : (
                      <Image
                        src={meta.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 46vw"
                      />
                    )}
                  </div>

                  <div
                    className={clsx(
                      'flex flex-col justify-center',
                      meta.imageRight && 'md:order-1',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <MissionSlideIcon meta={meta} />
                      <h3 className="font-hero text-left text-2xl font-medium leading-snug tracking-tight text-[#2A1B14] sm:text-3xl lg:text-[2rem]">
                        {slide.title}
                      </h3>
                    </div>
                    <p className="mt-3 text-left text-[0.9375rem] leading-relaxed text-[#4A3829] sm:mt-3.5 sm:text-base">
                      {slide.body}
                    </p>
                    {slide.ctaLabel && slide.ctaHref ? (
                      <div className="mt-4 sm:mt-4">
                        <Button
                          href={slide.ctaHref}
                          color="blue"
                          className="rounded-lg px-5 py-2.5 text-[0.9375rem]"
                        >
                          {slide.ctaLabel}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
              </MissionScrollReveal>
            )
          })}
        </div>
      </Container>
    </div>
  )
}
