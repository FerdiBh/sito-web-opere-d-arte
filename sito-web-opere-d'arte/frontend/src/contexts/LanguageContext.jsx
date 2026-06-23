import React, { createContext, useContext, useState } from 'react'
import translations from '../i18n/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')
  const t = (path) => {
    const keys = path.split('.')
    let value = translations[lang]
    for (const key of keys) value = value?.[key]
    return value || path
  }
  const toggleLang = () => setLang((p) => (p === 'en' ? 'it' : 'en'))
  return <LanguageContext.Provider value={{ lang, t, toggleLang }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
