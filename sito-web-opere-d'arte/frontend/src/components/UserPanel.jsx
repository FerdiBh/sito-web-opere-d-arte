import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function UserPanel({ user, onLogin, onLogout, onBack, onGoAdmin }) {
  const { t, lang, toggleLang } = useLanguage()
  const [mode, setMode] = useState(user ? 'dashboard' : 'login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (user && user.id) {
      fetch(`/api/orders/user/${user.id}`)
        .then((r) => r.json())
        .then(setOrders)
        .catch(() => {})
    }
  }, [user])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok) {
        if (data.is_admin) {
          onGoAdmin()
          return
        }
        onLogin(data.user)
        setMode('dashboard')
      } else {
        setError(t('user.wrong'))
      }
    } catch {
      setError(t('user.wrong'))
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          name,
          surname,
          address,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        onLogin(data.user)
        setMode('dashboard')
      } else {
        setError(data.error || t('user.error_register'))
      }
    } catch {
      setError(t('user.error_register'))
    }
  }

  const handleLogout = () => {
    onLogout()
    setMode('login')
    setUsername('')
    setPassword('')
    setOrders([])
  }

  if (mode === 'dashboard' && user) {
    return (
      <div className="min-h-screen bg-dark">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-serif font-bold text-gold">{t('user.title')}</h1>
            <div className="flex items-center gap-4">
              <button onClick={toggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-sm font-medium text-gray-300 hover:text-gold hover:border-gold/50 transition-all duration-200">
              <span className={`${lang === 'en' ? 'text-gold' : 'text-gray-400'}`}>EN</span>
              <span className="text-gray-500">/</span>
              <span className={`${lang === 'it' ? 'text-gold' : 'text-gray-400'}`}>IT</span>
            </button>
              <button onClick={onBack} className="btn-outline text-sm py-2 px-4">{t('admin.back')}</button>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-sm transition-colors">{t('user.logout')}</button>
            </div>
          </div>

          <div className="glass-card p-6 mb-8">
            <h2 className="text-lg font-serif text-white mb-1">{t('user.welcome')}, {user.name || user.username}</h2>
            <p className="text-gray-400 text-sm">@{user.username}</p>
          </div>

          <h2 className="text-lg font-serif font-semibold text-white mb-4">{t('user.my_orders')}</h2>
          {orders.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-gray-400">{t('user.no_orders')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gold font-mono font-semibold">#{order.id}</span>
                    <span className="text-xs uppercase tracking-wider text-green-400 border border-green-500/30 rounded px-2 py-0.5">{order.status}</span>
                  </div>
                  <div className="text-gray-400 text-sm space-y-1">
                    <p>{t('user.items_ordered')}: {order.items?.length || 0}</p>
                    <p>{t('user.total_paid')}: {order.total?.toFixed(2) || '0.00'}€</p>
                    {order.shipping && (
                      <p className="text-gray-500 text-xs">
                        {order.shipping.name} {order.shipping.surname} — {order.shipping.address}, {order.shipping.city}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-gold">
            {mode === 'login' ? t('user.login_title') : t('user.register_title')}
          </h1>
          <button onClick={toggleLang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-sm font-medium text-gray-300 hover:text-gold hover:border-gold/50 transition-all duration-200">
              <span className={`${lang === 'en' ? 'text-gold' : 'text-gray-400'}`}>EN</span>
              <span className="text-gray-500">/</span>
              <span className={`${lang === 'it' ? 'text-gold' : 'text-gray-400'}`}>IT</span>
            </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-1">{t('user.username')}</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1">{t('user.password')}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full">{t('user.login_btn')}</button>
            <p className="text-gray-500 text-sm text-center">
              {t('user.no_account')}{' '}
              <button type="button" onClick={() => { setMode('register'); setError('') }} className="text-gold hover:underline">
                {t('user.register_here')}
              </button>
            </p>
            <p className="text-gray-600 text-xs text-center">admin / password — {t('user.admin_panel')}</p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 text-sm block mb-1">{t('user.name')}</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">{t('user.surname')}</label>
                <input value={surname} onChange={(e) => setSurname(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1">{t('user.address')}</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1">{t('user.username')}</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-1">{t('user.password')}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/50" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full">{t('user.register_btn')}</button>
            <p className="text-gray-500 text-sm text-center">
              {t('user.has_account')}{' '}
              <button type="button" onClick={() => { setMode('login'); setError('') }} className="text-gold hover:underline">
                {t('user.login_here')}
              </button>
            </p>
          </form>
        )}

        <button onClick={onBack} className="text-gray-500 text-sm mt-4 hover:text-gold transition-colors block">
          &larr; {t('admin.back')}
        </button>
      </div>
    </div>
  )
}
