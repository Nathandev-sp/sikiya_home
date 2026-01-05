'use client'

import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'

export function Footer() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  return (
    <footer className="bg-[#F6F3EF]">
      <Container>
        <div className="py-16">
          <Logo className="mx-auto h-32 w-auto" />
          <nav className="mt-10 text-sm" aria-label="quick links">
          </nav>
        </div>
        <div className="flex flex-col items-center border-t border-slate-300/20 py-10 sm:flex-row-reverse sm:justify-between">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <a
              href="mailto:contact@sikiya.com"
              className="text-sm text-slate-700 hover:text-[#66462C] transition-colors"
            >
              contact@sikiya.com
            </a>
            <Link
              href="https://instagram.com/sikiya"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              aria-label="Sikiya on Instagram"
            >
              <svg
                className="h-6 w-6 fill-slate-700 group-hover:fill-[#66462C] transition-colors"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-600 sm:mt-0">
            {t.footer.copyright.replace('{year}', new Date().getFullYear().toString())}
          </p>
        </div>
      </Container>
    </footer>
  )
}
