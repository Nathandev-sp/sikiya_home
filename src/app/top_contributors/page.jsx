'use client'

import Image from 'next/image'
import { Container } from '@/components/Container'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { getImageUrl } from '@/utils/imageUtils'

const people = [
  {
    name: 'Arcade Cibonga',
    logoUrl: getImageUrl('web/top_journalists/1/logo.jpeg'),
    imageUrl:getImageUrl('web/top_journalists/1/profile.jpeg'),
    groups: ['Sport'],
  },
  {
    name: 'Floyd Miles',
    logoUrl: null,
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    groups: ['Culture', 'Economy'],
  },
  {
    name: 'Emily Selman',
    logoUrl: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    imageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    groups: ['Politics', 'Sport', 'Culture'],
  },
  
  
  
]

export default function TopContributorsPage() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  return (
    <>
      <Header />
      <main className="flex-auto">
        <Container className="mt-16 pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-6xl">
              {t.topContributors.title}
            </h1>
            <p className="mt-6 text-lg tracking-tight text-slate-700">
              {t.topContributors.subtitle}
            </p>
          </div>

          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8"
          >
            {people.map((person) => (
              <li key={person.name} className="rounded-2xl bg-[#F6F3EF] px-8 py-10">
                <div className="relative mx-auto size-48 rounded-full outline-1 -outline-offset-1 outline-black/5 md:size-56 overflow-hidden">
                  <Image
                    src={person.imageUrl}
                    alt={person.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, 224px"
                  />
                </div>
                <h3 className="mt-6 text-center text-base/7 font-semibold tracking-tight text-gray-900">{person.name}</h3>
                {person.logoUrl ? (
                  <div className="mt-3 flex justify-center">
                    <div className="relative h-14 w-44 rounded-xl overflow-hidden">
                      <Image
                        src={person.logoUrl}
                        alt={`${person.name} logo`}
                        fill
                        className="object-cover"
                        sizes="176px"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-center text-sm/6 text-gray-600">{t.topContributors.independentJournalist}</p>
                )}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {person.groups.map((group) => (
                    <span
                      key={group}
                      className="inline-flex items-center rounded-full bg-[#66462C] px-3 py-1 text-xs font-medium text-white"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <Footer />
    </>
  )
}
