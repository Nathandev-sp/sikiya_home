'use client'

import { useState } from 'react'

import { Container } from '@/components/Container'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'

function ChevronIcon({ open }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-[#66462C] transition-transform duration-200 ${
        open ? 'rotate-180' : ''
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export function AboutFaq() {
  const { language } = useLanguage()
  const faq = getTranslation(language).aboutPage?.faq
  const [openIndex, setOpenIndex] = useState(null)

  if (!faq) return null

  const items = faq.items ?? []
  const supportEmail = faq.supportEmail || 'nathan.cibonga@sikiya.org'

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="bg-[#F5F1EB] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-hero text-3xl font-semibold tracking-tight text-[#2a2520] sm:text-[2.125rem]">
            {faq.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-base leading-relaxed text-[#6b635a] sm:text-lg">
            {faq.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[#e8e0d6] bg-white px-2 py-2 shadow-sm sm:px-4 sm:py-4">
          <ul className="divide-y divide-[#ebe4da]">
            {items.map((item, index) => {
              const isOpen = openIndex === index
              const panelId = `about-faq-panel-${index}`
              const buttonId = `about-faq-button-${index}`

              return (
                <li key={item.question}>
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(index)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-5 text-left sm:px-6"
                    >
                      <span className="font-hero text-base font-medium leading-snug text-[#2a2520] sm:text-lg">
                        {item.question}
                      </span>
                      <ChevronIcon open={isOpen} />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`overflow-hidden transition-all duration-200 ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-4 pb-5 font-sans text-[0.9375rem] leading-relaxed text-[#5c554c] sm:px-6 sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="mx-auto mt-10 max-w-3xl text-center">
          <p className="font-sans text-base text-[#5c554c] sm:text-lg">{faq.stillHaveQuestions}</p>
          <p className="mt-3 font-sans text-base text-[#5c554c] sm:text-lg">
            {faq.reachOut}{' '}
            <a
              href={`mailto:${supportEmail}`}
              className="font-medium text-[#66462C] underline decoration-[#66462C]/40 underline-offset-2 hover:text-[#563B25] hover:decoration-[#563B25]"
            >
              {supportEmail}
            </a>
          </p>
        </div>
      </Container>
    </section>
  )
}
