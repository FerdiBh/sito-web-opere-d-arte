import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const PLACEHOLDER_COLORS = [
  'from-amber-800/40 to-amber-900/60',
  'from-red-700/40 to-red-900/60',
  'from-blue-300/20 to-blue-500/40',
  'from-amber-600/40 to-amber-800/60',
  'from-green-400/30 to-green-700/50',
  'from-red-500/30 to-red-700/50',
  'from-slate-300/30 to-slate-500/50',
  'from-gold/20 to-amber-700/50',
]

export default function Shop({ addToCart }) {
  const { t, lang } = useLanguage()
  const [artworks, setArtworks] = useState([])
  const [addedId, setAddedId] = useState(null)

  useEffect(() => {
    fetch('/api/artworks')
      .then((res) => res.json())
      .then(setArtworks)
      .catch(() => {})
  }, [])

  const handleBuy = (artwork) => {
    addToCart(artwork)
    setAddedId(artwork.id)
    setTimeout(() => setAddedId(null), 2000)
  }

  return (
    <section id="shop" className="py-24 px-4 bg-darker/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">{t('shop.title')}</h2>
          <p className="section-subtitle">{t('shop.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className="glass-card overflow-hidden group hover:border-gold/30 transition-all duration-500"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-darker">
                <div className={`absolute inset-0 bg-gradient-to-br ${PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length]} flex items-center justify-center`}>
                  <div className="text-center p-4">
                    <p className="text-white/30 text-4xl font-serif font-bold">€{artwork.price}</p>
                    <p className="text-white/10 text-xs font-mono mt-2">{artwork.image?.split('/').pop()}</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-base font-serif font-semibold text-white mb-1">
                  {artwork.title?.[lang] || artwork.title?.en}
                </h3>
                <p className="text-gold font-bold text-xl mb-3">
                  €{artwork.price}
                </p>
                <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
                  {artwork.description?.[lang] || artwork.description?.en}
                </p>
                <button
                  onClick={() => handleBuy(artwork)}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    addedId === artwork.id
                      ? 'bg-green-500 text-white'
                      : 'btn-primary text-sm py-2.5'
                  }`}
                >
                  {addedId === artwork.id ? t('shop.added') : t('shop.buy')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
