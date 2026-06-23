import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const PLACEHOLDER_COLORS = [
  'from-amber-800/40 to-amber-900/60',
  'from-red-700/40 to-red-900/60',
  'from-blue-300/20 to-blue-500/40',
  'from-amber-600/40 to-amber-800/60',
  'from-green-400/30 to-green-700/50',
  'from-red-500/30 to-red-700/50',
]

export default function AdminPanel({ onBack, onAdminChange, preAuth }) {
  const { t, lang, toggleLang } = useLanguage()
  const [loggedIn, setLoggedIn] = useState(!!preAuth)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [artworks, setArtworks] = useState([])
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    title_en: '', title_it: '', desc_en: '', desc_it: '',
    price: '', image: '', category: '',
  })

  const fetchArtworks = () => {
    fetch('/api/artworks')
      .then((r) => r.json())
      .then(setArtworks)
      .catch(() => {})
  }

  useEffect(() => {
    if (loggedIn) fetchArtworks()
  }, [loggedIn])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (res.ok) {
      setLoggedIn(true)
    } else {
      setError(t('admin.wrong'))
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setMessage('')
    const payload = {
      title: { en: form.title_en, it: form.title_it },
      description: { en: form.desc_en, it: form.desc_it },
      price: parseFloat(form.price),
      image: form.image,
      category: form.category,
    }
    const res = await fetch('/api/admin/artworks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setMessage(t('admin.added_ok'))
      setForm({ title_en: '', title_it: '', desc_en: '', desc_it: '', price: '', image: '', category: '' })
      fetchArtworks()
      onAdminChange()
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirm_remove'))) return
    await fetch(`/api/admin/artworks/${id}`, { method: 'DELETE' })
    setMessage(t('admin.removed_ok'))
    fetchArtworks()
    onAdminChange()
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="glass-card p-8 w-full max-w-sm">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-serif font-bold text-gold">{t('admin.login_title')}</h1>
            <button onClick={toggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-sm font-medium text-gray-300 hover:text-gold hover:border-gold/50 transition-all duration-200">
              <span className={`${lang === 'en' ? 'text-gold' : 'text-gray-400'}`}>EN</span>
              <span className="text-gray-500">/</span>
              <span className={`${lang === 'it' ? 'text-gold' : 'text-gray-400'}`}>IT</span>
            </button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-1">{t('admin.username')}</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1">{t('admin.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full">{t('admin.login')}</button>
          </form>
          <button onClick={onBack} className="text-gray-500 text-sm mt-4 hover:text-gold transition-colors">
            &larr; {t('admin.back')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gold">{t('admin.dashboard')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-sm font-medium text-gray-300 hover:text-gold hover:border-gold/50 transition-all duration-200">
              <span className={`${lang === 'en' ? 'text-gold' : 'text-gray-400'}`}>EN</span>
              <span className="text-gray-500">/</span>
              <span className={`${lang === 'it' ? 'text-gold' : 'text-gray-400'}`}>IT</span>
            </button>
            <button onClick={onBack} className="btn-outline text-sm py-2 px-4">{t('admin.back')}</button>
            <button onClick={() => setLoggedIn(false)} className="text-gray-400 hover:text-red-400 text-sm transition-colors">{t('admin.logout')}</button>
          </div>
        </div>

        {message && (
          <div className="glass-card p-4 mb-6 text-green-400 text-sm border-green-500/20">{message}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-card p-6">
              <h2 className="text-lg font-serif font-semibold text-white mb-1">{t('admin.add_title')}</h2>
              <p className="text-gray-500 text-sm mb-4">{t('admin.add_desc')}</p>
              <form onSubmit={handleAdd} className="space-y-3">
                <input placeholder={t('admin.title_en')} value={form.title_en} onChange={(e) => setForm({...form, title_en: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gold/50" />
                <input placeholder={t('admin.title_it')} value={form.title_it} onChange={(e) => setForm({...form, title_it: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gold/50" />
                <textarea placeholder={t('admin.desc_en')} value={form.desc_en} onChange={(e) => setForm({...form, desc_en: e.target.value})} rows="2" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gold/50" />
                <textarea placeholder={t('admin.desc_it')} value={form.desc_it} onChange={(e) => setForm({...form, desc_it: e.target.value})} rows="2" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gold/50" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder={t('admin.price')} type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gold/50" />
                  <input placeholder={t('admin.category')} value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gold/50" />
                </div>
                <input placeholder={t('admin.image_path')} value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-gold/50" />
                <button type="submit" className="btn-primary w-full">{t('admin.add_btn')}</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-lg font-serif font-semibold text-white mb-4">{t('admin.manage')} ({artworks.length})</h2>
            <div className="space-y-3">
              {artworks.map((artwork, i) => (
                <div key={artwork.id} className="glass-card p-4 flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length]} shrink-0 flex items-center justify-center overflow-hidden`}>
                    {artwork.image ? (
                      <img src={artwork.image} alt="" className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <span className="text-white/30 text-xs">img</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{artwork.title?.[lang] || artwork.title?.en}</p>
                    <p className="text-gold text-sm">€{artwork.price}</p>
                    {artwork.available === false && (
                      <span className="text-red-400 text-xs">{t('gallery.sold')}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(artwork.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-2 shrink-0"
                    title={t('admin.remove')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
