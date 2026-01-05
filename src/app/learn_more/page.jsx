import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Faqs } from '@/components/Faqs'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'

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

