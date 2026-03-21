import { useEffect, type ReactNode, useCallback } from 'react'

import type { Language, Translations } from '../types'
import { LanguageContext } from './useLanguage'
import { useLocalStorage } from './useLocalStorage'

interface LanguageProviderProps {
  storageKey: string
  defaultLanguage: Language
  translations: Translations
  children: ReactNode
}

export function LanguageProvider({
  storageKey,
  defaultLanguage,
  translations,
  children,
}: LanguageProviderProps) {
  const [language, setLanguage] = useLocalStorage<Language>(storageKey, defaultLanguage)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const t = useCallback(
    (key: string): string => {
      return translations[language]?.[key] || translations.en?.[key] || key
    },
    [language, translations]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
