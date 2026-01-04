import Image from 'next/image'
import { Container } from '@/components/Container'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const people = [
  {
    name: 'Leonard Krasner',
    role: 'Senior Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    groups: ['Sport', 'Politics'],
  },
  {
    name: 'Floyd Miles',
    role: 'Principal Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    groups: ['Culture', 'Economy'],
  },
  {
    name: 'Emily Selman',
    role: 'VP, User Experience',
    imageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    groups: ['Politics', 'Sport', 'Culture'],
  },
  {
    name: 'Kristin Watson',
    role: 'VP, Human Resources',
    imageUrl:
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    groups: ['Economy', 'Politics'],
  },
  {
    name: 'Emma Dorsey',
    role: 'Senior Developer',
    imageUrl:
      'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    groups: ['Sport', 'Culture'],
  },
  {
    name: 'Alicia Bell',
    role: 'Junior Copywriter',
    imageUrl:
      'https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    groups: ['Economy', 'Sport', 'Politics'],
  },
]

export default function TopContributorsPage() {
  return (
    <>
      <Header />
      <main className="flex-auto">
        <Container className="mt-16 pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-6xl">
              Top Journalists
            </h1>
            <p className="mt-6 text-lg tracking-tight text-slate-700">
              Meet the passionate journalists, writers, and content creators who are shaping the dialogue on Africa's future through their insightful articles and stories.
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
                <h3 className="mt-6 text-base/7 font-semibold tracking-tight text-gray-900">{person.name}</h3>
                <p className="text-sm/6 text-gray-600">{person.role}</p>
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
