'use client'

import { useLanguage } from '@/lib/LanguageContext'

export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1 rounded-md bg-gray-100 p-0.5 shadow-sm ring-1 ring-inset ring-gray-200">
      <button
        type="button"
        onClick={() => changeLanguage('en')}
        className={`rounded px-2 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#66462C] focus:ring-offset-2 ${
          language === 'en'
            ? 'bg-white text-[#66462C] shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => changeLanguage('fr')}
        className={`rounded px-2 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#66462C] focus:ring-offset-2 ${
          language === 'fr'
            ? 'bg-white text-[#66462C] shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        FR
      </button>
    </div>
  )
}

