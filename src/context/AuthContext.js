'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [hydrated, setHydrated] = useState(false)

  // Restore user from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('resq_user')
      if (saved) setUser(JSON.parse(saved))
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
    try { localStorage.removeItem('resq_user') } catch {}
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
    <AuthContext.Provider value={{ user, login, logout, cart, addToCart, removeFromCart, hydrated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
