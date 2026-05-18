'use client'

import { Container } from '@/components/Container'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'

export function AboutPrivacyPolicy() {
  const { language } = useLanguage()
  const privacy = getTranslation(language).aboutPage?.privacyPolicy

  if (!privacy) return null

  const paragraphs = privacy.paragraphs ?? []
  const contactEmail = privacy.contactEmail || 'nathan.cibonga@sikiya.org'

  return (
    <section className="bg-[#F5F1EB] pb-16 sm:pb-20 lg:pb-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h2 className="font-hero text-center text-2xl font-semibold tracking-tight text-[#2a2520] sm:text-[1.75rem]">
            {privacy.title}
          </h2>

          <div className="mt-8 space-y-6 rounded-2xl border border-[#e8e0d6] bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="font-sans text-[0.9375rem] leading-relaxed text-[#5c554c] sm:text-base"
              >
                {paragraph}
              </p>
            ))}

            <p className="font-sans text-[0.9375rem] leading-relaxed text-[#5c554c] sm:text-base">
              {privacy.contactLabel}{' '}
              <a
                href={`mailto:${contactEmail}`}
                className="font-medium text-[#66462C] underline decoration-[#66462C]/40 underline-offset-2 hover:text-[#563B25] hover:decoration-[#563B25]"
              >
                {contactEmail}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
