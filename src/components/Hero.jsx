import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'

// Import hero images
import africanBaobab from '@/assets/Hero Images/African Baobab.jpg'
import africanCelebration from '@/assets/Hero Images/African celebration.jpg'
import africanChildren from '@/assets/Hero Images/African Children.jpg'
import africanSoccer from '@/assets/Hero Images/African Soccer.jpg'
import capetown from '@/assets/Hero Images/Capetown south africa.jpg'
import leopardImage from '@/assets/Hero Images/Leopard Image.jpg'
import michaelSchofield from '@/assets/Hero Images/michael-schofield-IhuzPxyBunQ-unsplash.jpg'

const posts = [
  {
    id: 1,
    title: 'Empower Communities with Knowledge',
    href: '#',
    description:
      'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
    imageUrl:
      'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80',
    date: 'Mar 16, 2020',
    datetime: '2020-03-16',
    author: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 2,
    title: 'Encourage Critical Thinking',
    href: '#',
    description: 'Optio cum necessitatibus dolor voluptatum provident commodi et. Qui aperiam fugiat nemo cumque.',
    imageUrl:
      'https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80',
    date: 'Mar 10, 2020',
    datetime: '2020-03-10',
    author: {
      name: 'Lindsay Walton',
      imageUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 3,
    title: 'Spark meaningful engagement',
    href: '#',
    description:
      'Cupiditate maiores ullam eveniet adipisci in doloribus nulla minus. Voluptas iusto libero adipisci rem et corporis.',
    imageUrl:
      'https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80',
    date: 'Feb 12, 2020',
    datetime: '2020-02-12',
    author: {
      name: 'Tom Cook',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
]

export function Hero() {
  return (
    <>
      <Container className="relative py-20 text-center sm:py-32 lg:py-40">
        {/* Decorative Image Placeholders - Scattered around the hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top Left */}
          <div className="absolute top-8 left-12 w-32 h-24 rounded-lg bg-[#E5E2DC] border-1.2 border-[#66462C]/20 shadow-lg opacity-80 hidden md:block overflow-hidden">
            <div className="relative w-full h-full">
              <Image src={africanBaobab} alt="African Baobab" fill className="object-cover rounded-lg" />
            </div>
          </div>
          
          {/* Top Right */}
          <div className="absolute top-4 right-8 w-32 h-24 rounded-lg bg-[#E5E2DC] border-1.2 border-[#66462C]/20 shadow-lg opacity-80 hidden lg:block overflow-hidden">
            <div className="relative w-full h-full">
              <Image src={capetown} alt="Cape Town, South Africa" fill className="object-cover rounded-lg" />
            </div>
          </div>
          
          {/* Left Side - Middle */}
          <div className="absolute top-1/2 -translate-y-20 left-28 w-32 h-24 rounded-lg bg-[#E5E2DC] border-1.2 border-[#66462C]/20 shadow-lg opacity-70 hidden xl:block overflow-hidden">
            <div className="relative w-full h-full">
              <Image src={africanChildren} alt="African Children" fill className="object-cover rounded-lg" />
            </div>
          </div>
          
          {/* Right Side - Middle */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-32 h-24 rounded-lg bg-[#E5E2DC] border-1.2 border-[#66462C]/20 shadow-lg opacity-70 hidden xl:block overflow-hidden">
            <div className="relative w-full h-full">
              <Image src={leopardImage} alt="Leopard" fill className="object-cover rounded-lg" />
            </div>
          </div>
          
          {/* Bottom Left */}
          <div className="absolute bottom-20 left-32 w-32 h-24 rounded-lg bg-[#E5E2DC] border-1.2 border-[#66462C]/20 shadow-lg opacity-75 hidden md:block overflow-hidden">
            <div className="relative w-full h-full">
              <Image src={africanSoccer} alt="African Soccer" fill className="object-cover rounded-lg" />
            </div>
          </div>
          
          {/* Bottom Right */}
          <div className="absolute bottom-24 right-24 w-32 h-24 rounded-lg bg-[#E5E2DC] border-1.2 border-[#66462C]/20 shadow-lg opacity-75 hidden lg:block overflow-hidden">
            <div className="relative w-full h-full">
              <Image src={africanCelebration} alt="African Celebration" fill className="object-cover rounded-lg" />
            </div>
          </div>
          
          {/* Additional smaller decorative elements */}
          <div className="absolute top-8 left-1/4 w-32 h-24 rounded-lg bg-[#E5E2DC] border-1.2 border-[#66462C]/20 shadow-md opacity-60 hidden lg:block overflow-hidden">
            <div className="relative w-full h-full">
              <Image src={michaelSchofield} alt="African Landscape" fill className="object-cover rounded-lg" />
            </div>
          </div>
          
          <div className="absolute top-32 right-45 w-32 h-24 rounded-lg bg-[#E5E2DC] border-1.2 border-[#66462C]/20 shadow-md opacity-60 hidden lg:block overflow-hidden">
            <div className="relative w-full h-full">
              <Image src={africanBaobab} alt="African Baobab" fill className="object-cover rounded-lg" />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Dialogues on{' '}
            <span className="relative whitespace-nowrap text-[#66462C]">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute top-2/3 left-0 h-[0.58em] w-full fill-[#AE8C6F]/70"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative">Africa's future</span>
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-600">
            A platform dedicated to dialogues on the political, economic, social, and cultural dimensions shaping the continent.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Button href="/contribute" color="blue" className="bg-[#66462C] hover:bg-[#563B25] focus-visible:outline-[#66462C]">
              Download Sikiya
            </Button>
          </div>
        </div>
      </Container>

      <div className="bg-[#F6F3EF] py-20 sm:py-32">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Our Mission
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-6 pt-60 pb-6 sm:pt-40 lg:pt-60"
              >
                <Image
                  alt=""
                  src={post.imageUrl}
                  fill
                  className="absolute inset-0 -z-10 object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-gray-900/10" />

                <div className="flex flex-col gap-y-2">
                  <h3 className="text-xl font-semibold text-white leading-snug">
                    <Link href={post.href}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm leading-6 text-gray-300">
                    {post.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </div>
    </>
  )
}
