import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-darker border-t border-white/5 py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gold font-serif text-lg mb-2">Cristalli d'Artista</p>
        <p className="text-gray-400 text-sm mb-4">{t('footer.tagline')}</p>
        <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} Cristalli d'Artista. {t('footer.rights')}.</p>
      </div>
    </footer>
  )
}
