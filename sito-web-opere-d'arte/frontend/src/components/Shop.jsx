import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const SHOP_COLORS = [
  'from-amber-700/50 to-amber-900/80',
  'from-red-600/50 to-red-900/80',
  'from-blue-400/40 to-blue-700/70',
  'from-amber-500/50 to-amber-800/80',
  'from-green-500/40 to-green-800/70',
  'from-rose-500/40 to-rose-800/70',
]

export default function Shop({ addToCart, cart, refetchKey }) {
  const { t, lang } = useLanguage()
  const [artworks, setArtworks] = useState([])
  const [addedId, setAddedId] = useState(null)

  useEffect(() => {
    fetch('/api/artworks')
      .then((res) => res.json())
      .then((data) => {
        const available = data.filter((a) => a.available !== false)
        setArtworks(available)
      })
      .catch(() => {})
  }, [refetchKey])

  const inCart = (id) => cart.some((item) => item.id === id)

  if (artworks.length === 0) {
    return (
      <section id="shop" className="py-24 px-4 bg-darker/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="section-title">{t('shop.title')}</h2>
          <p className="section-subtitle">{t('shop.subtitle')}</p>
          <div className="glass-card p-12 max-w-lg mx-auto">
            <p className="text-gray-400 text-lg">{t('shop.no_stock')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="shop" className="py-24 px-4 bg-darker/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">{t('shop.title')}</h2>
          <p className="section-subtitle">{t('shop.subtitle')}</p>
        </div>

        <div className="space-y-6">
          {artworks.map((artwork, index) => {
            const inCartItem = inCart(artwork.id)

            return (
              <div
                key={artwork.id}
                className="glass-card overflow-hidden group hover:border-gold/30 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-48 shrink-0 overflow-hidden bg-darker">
                    <img
                      src={artwork.image}
                      alt={artwork.title?.[lang] || artwork.title?.en}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${SHOP_COLORS[index % SHOP_COLORS.length]} hidden items-center justify-center`}>
                      <div className="text-center">
                        <p className="text-white/40 text-3xl font-bold">{artwork.price}€</p>
                        <p className="text-white/10 text-xs font-mono mt-1">{artwork.image?.split('/').pop()}</p>
                      </div>
                    </div>
                    {inCartItem && (
                      <div className="absolute top-2 right-2 bg-amber-500/90 text-darker text-xs font-bold px-2 py-1 rounded">
                        {t('gallery.in_cart')}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-lg font-sans font-semibold text-white">
                          {artwork.title?.[lang] || artwork.title?.en}
                        </h3>
                        <span className="text-gold font-bold text-xl ml-2">{artwork.price}€</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs uppercase tracking-wider text-gray-500 border border-white/10 rounded px-2 py-0.5">
                          {artwork.category}
                        </span>
                        <span className="text-xs text-green-400">● {t('shop.buy')}</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                        {artwork.description?.[lang] || artwork.description?.en}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      {inCartItem ? (
                        <span className="text-amber-400 text-sm font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {t('gallery.in_cart')}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            addToCart(artwork)
                            setAddedId(artwork.id)
                            setTimeout(() => setAddedId(null), 2000)
                          }}
                          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                            addedId === artwork.id
                              ? 'bg-green-500 text-white'
                              : 'btn-primary text-sm'
                          }`}
                        >
                          {addedId === artwork.id ? t('shop.added') : t('shop.buy')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
