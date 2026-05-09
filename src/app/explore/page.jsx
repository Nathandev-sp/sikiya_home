import { ExploreContent } from '@/components/explore/ExploreContent'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export const metadata = {
  title: 'Explore',
}

export default function ExplorePage() {
  return (
    <>
      <Header />
      <main className="flex-auto">
        <ExploreContent />
      </main>
      <Footer />
    </>
  )
}
