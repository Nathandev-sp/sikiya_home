import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'

import '@/styles/tailwind.css'
import { LanguageProvider } from '@/lib/LanguageContext'

export const metadata = {
  title: {
    template: '%s - Sikiya',
    default: 'Sikiya',
  },
  description:
    'A platform dedicated to dialogues on the political, economic, social, and cultural dimensions shaping the continent.',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable,
      )}
    >
      <body className="flex h-full flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
