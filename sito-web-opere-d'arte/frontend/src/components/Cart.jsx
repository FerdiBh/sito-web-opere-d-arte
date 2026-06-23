import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function Cart({ cart, removeFromCart, clearCart, onCheckoutComplete, user }) {
  const { t, lang } = useLanguage()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const [orderNum, setOrderNum] = useState('')
  const [showingForm, setShowingForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    surname: '',
    address: '',
    city: '',
    postal: '',
    country: '',
    shipping: 'standard',
    notes: '',
  })

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || '',
        surname: user.surname || '',
        address: user.address || '',
      }))
    }
  }, [user])

  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const shippingCost = form.shipping === 'express' ? 12.90 : 6.90
  const grandTotal = total + shippingCost

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCheckout = async () => {
    setCheckingOut(true)
    try {
      await Promise.all(
        cart.map((item) =>
          fetch(`/api/artworks/${item.id}/sell`, { method: 'PATCH' })
        )
      )
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            artwork_id: item.id,
            title: item.title,
            price: item.price,
          })),
          total: grandTotal,
          shipping: form,
          user_id: user?.id || null,
          language: lang,
        }),
      })
      const data = await res.json()
      setOrderNum(data.order_id)
      setOrderPlaced(true)
      clearCart()
      onCheckoutComplete()
    } catch {
      setOrderNum('N/A')
      setOrderPlaced(true)
      clearCart()
      onCheckoutComplete()
    }
  }

  const deliveryEstimate = form.shipping === 'express'
    ? (lang === 'it' ? '2-3 giorni lavorativi' : '2-3 business days')
    : (lang === 'it' ? '5-7 giorni lavorativi' : '5-7 business days')

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
            <p className="text-gray-300 mb-2">
              {t('cart.order_number')}: <span className="text-gold font-mono">#{orderNum}</span>
            </p>
            <p className="text-gray-400 text-sm">{t('cart.success_msg')}</p>
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
                      <p className="text-gold text-sm font-semibold">{item.price}€</p>
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

            {!showingForm ? (
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-serif font-semibold text-white">{t('cart.total')}</span>
                  <span className="text-2xl font-bold text-gold">{total.toLocaleString()}€</span>
                </div>
                <button
                  onClick={() => setShowingForm(true)}
                  className="btn-primary w-full text-center block"
                >
                  {t('cart.checkout')}
                </button>
              </div>
            ) : (
              <div className="glass-card p-6 space-y-6">
                <h3 className="text-xl font-serif font-semibold text-white">{t('cart.shipping_title')}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">{t('cart.name')}</label>
                    <input name="name" value={form.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">{t('cart.surname')}</label>
                    <input name="surname" value={form.surname} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">{t('cart.country')}</label>
                    <input name="country" value={form.country} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">{t('cart.postal')}</label>
                    <input name="postal" value={form.postal} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-gray-400 text-sm block mb-1">{t('cart.address')}</label>
                    <input name="address" value={form.address} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">{t('cart.city')}</label>
                    <input name="city" value={form.city} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-gray-400 text-sm block mb-1">{t('cart.shipping_time')}</label>
                    <select name="shipping" value={form.shipping} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50">
                      <option value="standard" className="bg-dark">{t('cart.standard')} — 6,90€</option>
                      <option value="express" className="bg-dark">{t('cart.express')} — 12,90€</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-gray-400 text-sm block mb-1">{t('cart.notes')}</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows="2" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" />
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('cart.items')} ({cart.length})</span>
                    <span className="text-white">{total.toLocaleString()}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('cart.shipping_cost')}</span>
                    <span className="text-white">{shippingCost.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-400">
                    <span>{t('cart.estimated_delivery')}</span>
                    <span>{deliveryEstimate}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-white/10">
                    <span className="text-white">{t('cart.total')}</span>
                    <span className="text-gold">{grandTotal.toFixed(2)}€</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut || !form.name || !form.surname || !form.address || !form.city}
                  className="btn-primary w-full text-center block disabled:opacity-50"
                >
                  {checkingOut ? '...' : t('cart.place_order')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
