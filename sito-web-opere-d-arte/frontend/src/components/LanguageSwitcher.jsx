import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage()

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-sm font-medium text-gray-300 hover:text-gold hover:border-gold/50 transition-all duration-200"
    >
      <span className={`${lang === 'en' ? 'text-gold' : 'text-gray-400'}`}>EN</span>
      <span className="text-gray-500">/</span>
      <span className={`${lang === 'it' ? 'text-gold' : 'text-gray-400'}`}>IT</span>
    </button>
  )
}
