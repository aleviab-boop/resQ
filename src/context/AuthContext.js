'use client'
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])

  function login(name, phone) {
    setUser({ name, phone })
  }

  function logout() {
    setUser(null)
    setCart([])
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
    <AuthContext.Provider value={{ user, login, logout, cart, addToCart, removeFromCart }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
