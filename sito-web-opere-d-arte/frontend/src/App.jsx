import React, { useState } from 'react'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import Shop from './components/Shop'
import Cart from './components/Cart'
import Footer from './components/Footer'

export default function App() {
  const [activeSection, setActiveSection] = useState('hero')
  const [cart, setCart] = useState([])

  const addToCart = (artwork) => {
    setCart((prev) => {
      if (prev.find((item) => item.id === artwork.id)) return prev
      return [...prev, artwork]
    })
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => setCart([])

  const scrollTo = (sectionId) => {
    setActiveSection(sectionId)
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-dark">
        <Navbar
          cartCount={cart.length}
          activeSection={activeSection}
          setActiveSection={scrollTo}
        />
        <main>
          <Hero
            onExplore={() => scrollTo('gallery')}
            onShop={() => scrollTo('shop')}
          />
          <Gallery addToCart={addToCart} />
          <Shop addToCart={addToCart} />
          <Cart
            cart={cart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
          />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}
