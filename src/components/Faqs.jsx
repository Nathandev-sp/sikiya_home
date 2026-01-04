import { Container } from '@/components/Container'

const faqs = [
  [
    {
      question: 'How do I start contributing to Sikiya?',
      answer:
        'Download our mobile app from the App Store or Google Play Store. Once you create an account, you can start sharing articles, videos, and engaging with the community.',
    },
    {
      question: 'Who can contribute content to Sikiya?',
      answer: 'Anyone can contribute! We welcome journalists, writers, content creators, and anyone with insights about Africa. All content is subject to our community guidelines.',
    },
    {
      question: 'Is Sikiya free to use?',
      answer:
        'Yes, Sikiya is free for readers and contributors. We believe in making information accessible to everyone.',
    },
  ],
  [
    {
      question: 'How does Sikiya ensure content accuracy?',
      answer:
        'We have a verification process and hold journalists accountable for accurate reporting. Our community also helps flag any issues with content.',
    },
    {
      question:
        'What topics can I write about on Sikiya?',
      answer:
        'We focus on political, economic, social, and cultural dimensions shaping Africa. We welcome diverse perspectives and encourage meaningful dialogue.',
    },
    {
      question:
        'Can I use Sikiya on my computer?',
      answer:
        'Currently, Sikiya is available as a mobile app for iOS and Android. We are working on a web version for the future.',
    },
  ],
  [
    {
      question: 'How do I report inappropriate content?',
      answer:
        'You can report content directly through the app. Our moderation team reviews all reports to maintain a respectful and safe community environment.',
    },
    {
      question: 'How can I contact Sikiya support?',
      answer: 'You can reach out to us through the app or email us directly. We aim to respond to all inquiries within 24-48 hours.',
    },
    {
      question: 'Does Sikiya have a journalist verification program?',
      answer:
        'Yes, we have a verification program for journalists. Verified journalists have additional features and their content is highlighted on the platform.',
    },
  ],
]

export function Faqs() {
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
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            If you can't find what you're looking for, reach out to our support team through the app or email us directly.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
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
