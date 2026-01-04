import { Container } from '@/components/Container'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function ContributePage() {
  return (
    <>
      <Header />
      <main className="flex-auto">
        <Container className="mt-16 pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-6xl">
              Start Contributing
            </h1>
            <p className="mt-6 text-lg tracking-tight text-slate-700">
              Join the Sikiya community and start sharing your stories, articles, and insights about Africa. Download our mobile app to get started.
            </p>
          </div>

          <div className="mt-16 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
            {/* App Store Button */}
            <a
              href="https://apps.apple.com/app/sikiya"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center transition-transform hover:scale-105"
            >
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-slate-900 p-6 shadow-xl ring-1 ring-slate-900/5 hover:bg-slate-800">
                <svg
                  className="h-12 w-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 4.23 7.6 9.83 7.37c1.15.13 2.1.72 3.12.8 1.18-.15 2.29-.66 3.52-.6 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="text-center">
                  <div className="text-xs text-slate-400">Download on the</div>
                  <div className="text-xl font-semibold text-white">App Store</div>
                </div>
              </div>
            </a>

            {/* Google Play Store Button */}
            <a
              href="https://play.google.com/store/apps/details?id=com.sikiya"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center transition-transform hover:scale-105"
            >
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-slate-900 p-6 shadow-xl ring-1 ring-slate-900/5 hover:bg-slate-800">
                <svg
                  className="h-12 w-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-center">
                  <div className="text-xs text-slate-400">Get it on</div>
                  <div className="text-xl font-semibold text-white">Google Play</div>
                </div>
              </div>
            </a>
          </div>

          <div className="mt-16 rounded-2xl bg-[#F6F3EF] p-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              What you can do on Sikiya
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
                <div className="text-3xl mb-3">📰</div>
                <h3 className="font-semibold text-slate-900">Share Articles</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Publish your articles and stories about political, economic, social, and cultural dimensions shaping Africa.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
                <div className="text-3xl mb-3">🎥</div>
                <h3 className="font-semibold text-slate-900">Create Videos</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Share short videos and engage with the community through visual storytelling.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-semibold text-slate-900">Join Discussions</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Engage in meaningful conversations, comment on articles, and connect with journalists and readers.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}

