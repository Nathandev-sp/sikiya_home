import { Container } from '@/components/Container'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Faqs } from '@/components/Faqs'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'

const values = [
  {
    name: 'Truth & Accuracy',
    summary: 'We deliver verified facts and hold journalists accountable for accurate reporting.',
    description:
      'Every story matters. We spotlight events that shape our communities and ensure that information is verified and trustworthy.',
  },
  {
    name: 'Coverage',
    summary:
      'Every story matters. We spotlight events that shape our communities.',
    description:
      'We believe in comprehensive coverage of African stories, from local events to continental issues that impact our communities.',
  },
  {
    name: 'Open Dialogue',
    summary:
      'We welcome diverse voices and encourage meaningful, constructive conversations.',
    description:
      'We foster a safe environment where every perspective is valued and heard. Join the conversation and share your insights.',
  },
]

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

export default function LearnMorePage() {
  return (
    <>
      <Header />
      <main className="flex-auto">


          <SecondaryFeatures />

          <Faqs />

          
      </main>
      <Footer />
    </>
  )
}

