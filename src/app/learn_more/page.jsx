import { AboutSections } from '@/components/AboutSections'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function LearnMorePage() {
  return (
    <>
      <Header />
      <main className="flex-auto overflow-x-clip">
        <AboutSections />
      </main>
      <Footer />
    </>
  )
}
