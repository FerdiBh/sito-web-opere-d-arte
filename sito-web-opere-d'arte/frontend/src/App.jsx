import React, { useState, useCallback } from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Gallery from './components/Gallery'
import Shop from './components/Shop'
import Cart from './components/Cart'
import AdminPanel from './components/AdminPanel'
import UserPanel from './components/UserPanel'
import { useLanguage } from './contexts/LanguageContext'

function Hero({ onExplore, onShop }) {
  const { t } = useLanguage()
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-darker via-dark to-darker opacity-90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,168,83,0.08)_0%,_transparent_70%)]"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-gold mb-6 leading-tight">{t('hero.title')}</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">{t('hero.subtitle')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onExplore} className="btn-primary text-lg">{t('hero.cta')}</button>
          <button onClick={onShop} className="btn-outline text-lg">{t('hero.shop_cta')}</button>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </section>
  )
}

function Footer() {
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

export default function App() {
  const [activeSection, setActiveSection] = useState('hero')
  const [cart, setCart] = useState([])
  const [refetchKey, setRefetchKey] = useState(0)
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminPreAuth, setAdminPreAuth] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('art_user')
    return saved ? JSON.parse(saved) : null
  })

  const addToCart = (artwork) => setCart((prev) => (prev.find((item) => item.id === artwork.id) ? prev : [...prev, artwork]))
  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id))
  const clearCart = () => setCart([])
  const onCheckoutComplete = useCallback(() => setRefetchKey((k) => k + 1), [])
  const onAdminChange = useCallback(() => setRefetchKey((k) => k + 1), [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('art_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('art_user')
  }

  const scrollTo = (sectionId) => {
    if (sectionId === 'admin') { setShowAdmin(true); setAdminPreAuth(false); setShowUser(false); return }
    if (sectionId === 'login') { setShowUser(true); setShowAdmin(false); return }
    setShowAdmin(false); setShowUser(false); setActiveSection(sectionId)
    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  if (showAdmin) return <LanguageProvider><AdminPanel onBack={() => setShowAdmin(false)} onAdminChange={onAdminChange} preAuth={adminPreAuth} /></LanguageProvider>
  if (showUser) return <LanguageProvider><UserPanel user={user} onLogin={handleLogin} onLogout={handleLogout} onBack={() => setShowUser(false)} onGoAdmin={() => { setShowUser(false); setShowAdmin(true); setAdminPreAuth(true) }} /></LanguageProvider>

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-dark">
        <Navbar cartCount={cart.length} activeSection={activeSection} setActiveSection={scrollTo} user={user} />
        <main>
          <Hero onExplore={() => scrollTo('gallery')} onShop={() => scrollTo('shop')} />
          <Gallery refetchKey={refetchKey} />
          <Shop addToCart={addToCart} cart={cart} refetchKey={refetchKey} />
          <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} onCheckoutComplete={onCheckoutComplete} user={user} />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}
