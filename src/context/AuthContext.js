'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const DEMO_DEVICES = [
  {
    id: 1001,
    type: 'Air Conditioner',
    brand: 'Daikin',
    model: 'FTKF35TV',
    purchaseDate: '2024-10-15',
    warrantyYears: '2',
    serialNo: 'DK-AC-2024-00193',
    serviceHistory: [
      { date: '12 Aug 2026', service: 'Split AC Jet Service', tech: 'Rahul Sharma', cost: '₹599', status: 'Completed' },
      { date: '3 May 2026', service: 'Split AC Dry Service', tech: 'Vikram Patel', cost: '₹249', status: 'Completed' },
    ],
  },
  {
    id: 1002,
    type: 'Washing Machine',
    brand: 'LG',
    model: 'FHM1207SDL',
    purchaseDate: '2023-06-20',
    warrantyYears: '3',
    serialNo: 'LG-WM-2023-55821',
    serviceHistory: [],
  },
  {
    id: 1003,
    type: 'Refrigerator',
    brand: 'Samsung',
    model: 'RT42T5C68S9',
    purchaseDate: '2022-01-10',
    warrantyYears: '1',
    serialNo: 'SAM-RF-2022-11405',
    serviceHistory: [
      { date: '8 Jan 2026', service: 'Refrigerator Deep Cleaning', tech: 'Suresh Kumar', cost: '₹349', status: 'Completed' },
    ],
  },
]

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
    // Seed demo devices on first login so the demo has pre-populated data
    try {
      const existing = localStorage.getItem('resq_devices')
      if (!existing || JSON.parse(existing).length === 0) {
        setDevices(DEMO_DEVICES)
        localStorage.setItem('resq_devices', JSON.stringify(DEMO_DEVICES))
      }
    } catch {}
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
