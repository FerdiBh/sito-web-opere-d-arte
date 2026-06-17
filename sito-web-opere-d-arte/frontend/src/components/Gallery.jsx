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

export default function Gallery({ addToCart }) {
  const { t, lang } = useLanguage()
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState(null)

  useEffect(() => {
    fetch('/api/artworks')
      .then((res) => res.json())
      .then((data) => {
        setArtworks(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const handleAdd = (artwork) => {
    addToCart(artwork)
    setAddedId(artwork.id)
    setTimeout(() => setAddedId(null), 2000)
  }

  if (loading) {
    return (
      <section id="gallery" className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">Loading artworks...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">{t('gallery.title')}</h2>
          <p className="section-subtitle">{t('gallery.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className="glass-card overflow-hidden group hover:border-gold/30 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="relative aspect-square overflow-hidden bg-darker">
                <div className={`absolute inset-0 bg-gradient-to-br ${PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length]} flex items-center justify-center`}>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto mb-3 opacity-30">
                      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full text-white">
                        <path d="M32 4L40 20L56 22L44 34L48 52L32 42L16 52L20 34L8 22L24 20L32 4Z" fill="currentColor" />
                      </svg>
                    </div>
                    <p className="text-white/20 text-xs font-mono">{artwork.image?.split('/').pop()}</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-serif font-semibold text-white">
                    {artwork.title?.[lang] || artwork.title?.en}
                  </h3>
                  <span className="text-gold font-semibold whitespace-nowrap ml-2">
                    €{artwork.price}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                  {artwork.description?.[lang] || artwork.description?.en}
                </p>
                <button
                  onClick={() => handleAdd(artwork)}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    addedId === artwork.id
                      ? 'bg-green-500 text-white'
                      : 'btn-outline text-sm py-2.5'
                  }`}
                >
                  {addedId === artwork.id ? t('shop.added') : t('gallery.add_to_cart')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
