import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar({ cartCount, activeSection, setActiveSection }) {
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { key: 'hero', label: t('nav.home') },
    { key: 'gallery', label: t('nav.gallery') },
    { key: 'shop', label: t('nav.shop') },
    { key: 'cart', label: t('nav.cart') },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-darker/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" onClick={() => setActiveSection('hero')} className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold text-gold tracking-wide">Cristalli d'Artista</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <button
                key={link.key}
                onClick={() => setActiveSection(link.key)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeSection === link.key
                    ? 'text-gold'
                    : 'text-gray-300 hover:text-gold'
                }`}
              >
                {link.label}
                {link.key === 'cart' && cartCount > 0 && (
                  <span className="ml-1 bg-gold text-darker text-xs rounded-full px-1.5 py-0.5">
                    {cartCount}
                  </span>
                )}
              </button>
            ))}
            <LanguageSwitcher />
          </div>

          <button
            className="md:hidden text-gray-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map((link) => (
              <button
                key={link.key}
                onClick={() => { setActiveSection(link.key); setMenuOpen(false) }}
                className="block w-full text-left text-sm text-gray-300 hover:text-gold py-2"
              >
                {link.label}
                {link.key === 'cart' && cartCount > 0 && (
                  <span className="ml-1 bg-gold text-darker text-xs rounded-full px-1.5 py-0.5">
                    {cartCount}
                  </span>
                )}
              </button>
            ))}
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
