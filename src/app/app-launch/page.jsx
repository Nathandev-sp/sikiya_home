import { AppLaunchContent } from '@/components/AppLaunchContent'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export const metadata = {
  title: 'App launch',
}

export default function AppLaunchPage() {
  return (
    <>
      <Header />
      <main className="flex-auto">
        <AppLaunchContent />
      </main>
      <Footer />
    </>
  )
}
