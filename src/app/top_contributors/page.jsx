'use client'

import Image from 'next/image'

import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { getImageUrl } from '@/utils/imageUtils'

const AVATAR_PX = 112

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
            <p className="mt-5 font-sans text-base leading-relaxed text-[#6b635a] sm:text-lg">
              {tc.subtitle}
            </p>
          </header>

          <ul className="mx-auto mt-14 grid max-w-6xl list-none grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
            {(tc.profiles ?? []).map((person, idx) => {
              const key = `${idx + 1}`
              const remote =
                typeof person.profileImageUrl === 'string' &&
                person.profileImageUrl.trim().startsWith('http')
                  ? person.profileImageUrl.trim()
                  : null
              const keyPath =
                typeof person.profileImageKey === 'string' && person.profileImageKey.trim()
                  ? person.profileImageKey.trim()
                  : `web/top_journalists/${key}/profile.jpeg`
              const imageSrc = remote || getImageUrl(keyPath)

              return (
                <li key={key} className="list-none">
                  <article className="group flex h-full flex-col rounded-2xl border border-transparent bg-white p-6 pb-5 shadow-[0_12px_40px_-18px_rgba(24,16,10,0.18)] transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#a88366]/90 hover:shadow-[0_20px_48px_-20px_rgba(24,16,10,0.22)] focus-within:border-[#a88366]/90">
                    <div className="relative mx-auto" style={{ width: AVATAR_PX, height: AVATAR_PX }}>
                      <div className="relative h-full w-full overflow-hidden rounded-full border-[2px] border-[#1a1814] bg-[#e8e2da]">
                        <Image
                          src={imageSrc}
                          alt={person.name}
                          fill
                          className="object-cover"
                          sizes="112px"
                          unoptimized={Boolean(remote)}
                        />
                      </div>
                      <VerifiedShieldBadge
                        className="absolute bottom-[-4px] right-[-8px]"
                        ariaLabel={tc.verifiedProfile}
                      />
                    </div>

                    <div className="mt-4 text-center">
                      <h2 className="font-hero text-lg font-bold tracking-tight text-[#1a1814] sm:text-xl">
                        {person.name}
                      </h2>
                      <p className="mt-2 font-sans text-sm text-[#8a8178]">{person.role}</p>
                      <p className="mt-2 flex items-center justify-center gap-1.5 font-sans text-xs text-[#8a8178]">
                        <PinIcon className="h-3.5 w-3.5 shrink-0 text-[#a89888]" />
                        <span>{person.location}</span>
                      </p>
                    </div>

                    <div className="mt-5 border-t border-[#efe9e3] pt-5">
                      <p
                        title={person.bio}
                        className="font-sans text-sm leading-relaxed text-[#534c45] line-clamp-2"
                      >
                        {person.bio}
                      </p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {(person.tags ?? []).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#f0e8df] px-3 py-1 font-sans text-[11px] font-semibold text-[#5c4534]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </Container>
      </main>

      <Footer />
    </>
  )
}

function VerifiedShieldBadge({ className, ariaLabel }) {
  return (
    <span
      className={['inline-flex shrink-0', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={ariaLabel}
    >
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13 3.2 5 6v6c0 4.94 3.33 9.53 8 11 4.67-1.47 8-6.06 8-11V6l-8-2.8Z"
          fill="#9a734f"
          stroke="#7a583d"
          strokeWidth="1.1"
        />
        <path d="m9 13 2.25 2.25L17 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function PinIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 17.5s-5.75-5.925-5.75-9.75A5.75 5.75 0 0110 2a5.75 5.75 0 015.75 5.75c0 3.825-5.75 9.75-5.75 9.75Z" />
      <circle cx="10" cy="8" r="1.9" fill="currentColor" stroke="none" />
    </svg>
  )
}
