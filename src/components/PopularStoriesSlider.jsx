'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { POPULAR_STORY_META } from '@/data/popularStories'
import avatarImage1 from '@/images/avatars/avatar-1.png'
import avatarImage2 from '@/images/avatars/avatar-2.png'
import avatarImage3 from '@/images/avatars/avatar-3.png'
import avatarImage4 from '@/images/avatars/avatar-4.png'
import avatarImage5 from '@/images/avatars/avatar-5.png'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'

const AVATARS = [avatarImage1, avatarImage2, avatarImage3, avatarImage4, avatarImage5, avatarImage1]

function ChevronIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

function CarouselNavButton({ direction, onClick, disabled, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={clsx(
        'absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#7A5C45] text-white shadow-[0_4px_14px_rgba(42,27,20,0.22)] transition',
        'hover:bg-[#6B4F3B] disabled:pointer-events-none disabled:opacity-40',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A5C45] focus-visible:ring-offset-2',
        direction === 'prev' ? 'left-0 -translate-x-1/2 sm:left-1' : 'right-0 translate-x-1/2 sm:right-1',
      )}
    >
      <ChevronIcon className={clsx('h-5 w-5', direction === 'prev' && 'rotate-180')} />
    </button>
  )
}

function StoryCard({ story, meta, categoryLabel }) {
  const avatar = AVATARS[meta.avatarIndex % AVATARS.length]

  return (
    <li className="snap-start shrink-0 w-[min(88vw,21.5rem)] sm:w-[22rem]">
      <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_16px_rgba(24,16,10,0.08)] ring-1 ring-black/[0.04]">
        <Link
          href="/explore"
          className="group flex flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7A5C45]"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e8e2da]">
            <Image
              src={meta.image}
              alt={story.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width:640px) 88vw, 352px"
            />
            <span className="absolute left-3 top-3 rounded-full bg-[#8B6B4F]/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-[2px]">
              {categoryLabel}
            </span>
          </div>

          <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
            <h3 className="font-hero line-clamp-3 text-[1.125rem] font-bold leading-snug tracking-tight text-[#1a1814]">
              {story.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#6b6560]">{story.excerpt}</p>

            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#e8e2da] ring-1 ring-black/[0.06]">
                <Image src={avatar} alt="" fill className="object-cover" sizes="40px" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#1a1814]">{story.journalist}</p>
                <p className="truncate text-xs text-[#8a8178]">{story.role}</p>
              </div>
            </div>
          </div>
        </Link>
      </article>
    </li>
  )
}

export function PopularStoriesSlider() {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const copy = t.popularStories
  const stories = copy?.stories ?? []
  const scrollRef = useRef(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollPrev(scrollLeft > 8)
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 8)
  }, [])

  useEffect(() => {
    updateScrollButtons()
    window.addEventListener('resize', updateScrollButtons)
    return () => window.removeEventListener('resize', updateScrollButtons)
  }, [updateScrollButtons, stories.length])

  const scrollByPage = useCallback((direction) => {
    const el = scrollRef.current
    if (!el) return
    const card = el.querySelector('li')
    const gap = 20
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.85
    el.scrollBy({ left: direction * step, behavior: 'smooth' })
  }, [])

  const paired = POPULAR_STORY_META.map((meta, index) => ({
    meta,
    story: stories[index],
  })).filter(({ story }) => story?.title)

  if (!copy?.title || paired.length === 0) return null

  return (
    <section className="bg-[#F5F4F2] py-14 sm:py-20" aria-labelledby="popular-stories-heading">
      <Container>
        <header className="text-center">
          <h2
            id="popular-stories-heading"
            className="font-display text-[1.75rem] font-semibold tracking-tight text-[#1a1814] sm:text-4xl"
          >
            {copy.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-[#6b6560] sm:text-lg">
            {copy.subtitle}
          </p>
        </header>

        <div className="relative mt-10 sm:mt-12">
          <CarouselNavButton
            direction="prev"
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollPrev}
            label={copy.previous}
          />
          <CarouselNavButton
            direction="next"
            onClick={() => scrollByPage(1)}
            disabled={!canScrollNext}
            label={copy.next}
          />

          <ul
            ref={scrollRef}
            onScroll={updateScrollButtons}
            className={clsx(
              'flex list-none gap-5 overflow-x-auto scroll-smooth px-6 py-1 sm:gap-5 sm:px-14',
              'snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            )}
          >
            {paired.map(({ meta, story }) => {
              const categoryLabel = copy.categories?.[meta.category] ?? meta.category

              return (
                <StoryCard
                  key={meta.id}
                  story={story}
                  meta={meta}
                  categoryLabel={categoryLabel}
                />
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}
