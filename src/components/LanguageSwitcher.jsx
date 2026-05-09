'use client'

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import clsx from 'clsx'

import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'

const LANG_OPTIONS = [
  { code: 'en', flag: '\u{1F1EC}\u{1F1E7}', labelKey: 'en' },
  { code: 'fr', flag: '\u{1F1EB}\u{1F1F7}', labelKey: 'fr' },
]

function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.207l3.71-3.974a.75.75 0 111.08 1.04l-4.24 4.547a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01.02-1.06z" />
    </svg>
  )
}

export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()
  const t = getTranslation(language)

  const current = LANG_OPTIONS.find((o) => o.code === language) ?? LANG_OPTIONS[0]

  return (
    <Menu>
      <MenuButton
        type="button"
        aria-label={t.languageSwitcher.label}
        className={clsx(
          'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm transition',
          'border-[#8D6242]/30 bg-white text-[#4A3428] hover:border-[#8D6242]/50 hover:bg-[#F9F9F7]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D6242] focus-visible:ring-offset-2',
        )}
      >
        <span className="text-base leading-none" aria-hidden="true">
          {current.flag}
        </span>
        <span className="tracking-wide">{language.toUpperCase()}</span>
        <ChevronDownIcon className="h-4 w-4 shrink-0 text-[#8D6242]/70" />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        modal={false}
        className={clsx(
          'z-[100] min-w-[10.5rem] rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5',
          ' [--anchor-gap:0.35rem]',
          'data-closed:scale-95 data-closed:opacity-0',
          'data-enter:ease-out data-enter:duration-100',
          'data-leave:ease-in data-leave:duration-75',
          'outline-none origin-top-right',
        )}
      >
        {LANG_OPTIONS.map((option) => (
          <MenuItem key={option.code}>
            {({ focus }) => (
              <button
                type="button"
                className={clsx(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm',
                  language === option.code
                    ? 'bg-[#8D6242]/10 font-semibold text-[#8D6242]'
                    : 'text-[#4A3428]',
                  focus && 'bg-[#F9F9F7]',
                )}
                onClick={() => changeLanguage(option.code)}
              >
                <span className="text-base" aria-hidden="true">
                  {option.flag}
                </span>
                <span>{t.languageSwitcher[option.labelKey]}</span>
                {language === option.code && (
                  <span className="ml-auto text-xs font-medium text-[#8D6242]/80">
                    ✓
                  </span>
                )}
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}
