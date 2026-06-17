import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function Cart({ cart, removeFromCart, clearCart }) {
  const { t, lang } = useLanguage()
  const [orderPlaced, setOrderPlaced] = useState(false)

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  const handleCheckout = async () => {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            artwork_id: item.id,
            title: item.title,
            price: item.price,
          })),
          total,
          language: lang,
        }),
      })
      setOrderPlaced(true)
      clearCart()
    } catch {
      setOrderPlaced(true)
      clearCart()
    }
  }

  return (
    <section id="cart" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title">{t('cart.title')}</h2>
        </div>

        {orderPlaced ? (
          <div className="glass-card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-gold mb-3">{t('cart.order_placed')}</h3>
            <p className="text-gray-400 text-sm">{t('cart.simulated')}</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-semibold text-gray-300 mb-2">{t('cart.empty')}</h3>
            <p className="text-gray-500">{t('cart.empty_msg')}</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div key={item.id} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gold/10 to-amber-800/30 flex items-center justify-center">
                      <span className="text-gold text-lg font-bold">€</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{item.title?.[lang] || item.title?.en}</h4>
                      <p className="text-gold text-sm font-semibold">€{item.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-serif font-semibold text-white">{t('cart.total')}</span>
                <span className="text-2xl font-bold text-gold">€{total.toLocaleString()}</span>
              </div>
              <button onClick={handleCheckout} className="btn-primary w-full text-center block">
                {t('cart.checkout')}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
