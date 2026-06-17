import React, { createContext, useContext, useState } from 'react'
import en from '../i18n/en.json'
import it from '../i18n/it.json'

const translations = { en, it }

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  const t = (path) => {
    const keys = path.split('.')
    let value = translations[lang]
    for (const key of keys) {
      value = value?.[key]
    }
    return value || path
  }

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'it' : 'en'))
  }

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
