'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [bookings, setBookings] = useState([])
  const [devices, setDevices] = useState([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('resq_user')
      if (saved) setUser(JSON.parse(saved))
    } catch {}
    try {
      const savedBookings = localStorage.getItem('resq_bookings')
      if (savedBookings) setBookings(JSON.parse(savedBookings))
    } catch {}
    try {
      const savedDevices = localStorage.getItem('resq_devices')
      if (savedDevices) setDevices(JSON.parse(savedDevices))
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

  function updateUser(updates) {
    setUser(prev => {
      const updated = { ...prev, ...updates }
      try { localStorage.setItem('resq_user', JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  function addBooking(booking) {
    setBookings(prev => {
      const updated = [booking, ...prev]
      try { localStorage.setItem('resq_bookings', JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  function addDevice(device) {
    setDevices(prev => {
      const updated = [...prev, { ...device, id: Date.now() }]
      try { localStorage.setItem('resq_devices', JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  function removeDevice(id) {
    setDevices(prev => {
      const updated = prev.filter(d => d.id !== id)
      try { localStorage.setItem('resq_devices', JSON.stringify(updated)) } catch {}
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
    <AuthContext.Provider value={{ user, login, logout, updateUser, cart, addToCart, removeFromCart, bookings, addBooking, devices, addDevice, removeDevice, hydrated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
