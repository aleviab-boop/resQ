'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [bookings, setBookings] = useState([])
  const [hydrated, setHydrated] = useState(false)

  // Restore user and bookings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('resq_user')
      if (saved) setUser(JSON.parse(saved))
    } catch {}
    try {
      const savedBookings = localStorage.getItem('resq_bookings')
      if (savedBookings) setBookings(JSON.parse(savedBookings))
    } catch {}
    setHydrated(true)
  }, [])

  function login(name, phone) {
    const u = { name, phone }
    setUser(u)
    try { localStorage.setItem('resq_user', JSON.stringify(u)) } catch {}
  }

  function logout() {
    setUser(null)
    setCart([])
    // bookings are kept in localStorage so they survive logout/login
    try { localStorage.removeItem('resq_user') } catch {}
  }

  function addBooking(booking) {
    setBookings(prev => {
      const updated = [booking, ...prev]
      try { localStorage.setItem('resq_bookings', JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  function addToCart(service) {
    setCart(prev => {
      if (prev.find(s => s.name === service.name)) return prev
      return [...prev, { ...service }]
    })
  }

  function removeFromCart(name) {
    setCart(prev => prev.filter(s => s.name !== name))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, cart, addToCart, removeFromCart, bookings, addBooking, hydrated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
