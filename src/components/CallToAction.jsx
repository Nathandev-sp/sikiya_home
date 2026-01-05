'use client'

import Image from 'next/image'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'
import backgroundImage from '@/images/background-call-to-action.jpg'

export function CallToAction() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-[#F6F3EF] py-32"
    >
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            {t.callToAction.title}
          </h2>
          <p className="mt-6 text-lg tracking-tight text-slate-600">
            {t.callToAction.subtitle}
          </p>
          <Button href="/contribute" color="blue" className="mt-10 bg-[#66462C] hover:bg-[#563B25]">
            {t.callToAction.button}
          </Button>
        </div>
      </Container>
    </section>
  )
}
