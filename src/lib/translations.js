import enTranslations from '../../messages/en.json'
import frTranslations from '../../messages/fr.json'

const translations = {
  en: enTranslations,
  fr: frTranslations,
}

export function getTranslation(language = 'en') {
  return translations[language] || translations.en
}

// Helper function to get nested translation values
export function getNestedTranslation(keys, language = 'en') {
  const translation = getTranslation(language)
  return keys.reduce((obj, key) => obj?.[key], translation) || ''
}


