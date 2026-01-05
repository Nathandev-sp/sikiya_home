'use client'

import { Container } from '@/components/Container'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'

export function Faqs() {
  const { language } = useLanguage()
  const t = getTranslation(language)

    const faqs = t.faqs.questions.map((faq) => ({
    question: faq.question,
    answer: faq.answer,
  }))

  // Split FAQs into 3 columns
  const faqsColumns = []
  for (let i = 0; i < faqs.length; i += 3) {
    faqsColumns.push(faqs.slice(i, i + 3))
  }

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-white py-16 sm:py-4"
    >
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            {t.faqs.title}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            {t.faqs.subtitle}
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqsColumns.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg/7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
