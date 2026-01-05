'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext(undefined)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('fr')

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('sikiya-language')
    if (savedLanguage === 'fr' || savedLanguage === 'en') {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('sikiya-language', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

