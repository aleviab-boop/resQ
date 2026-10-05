'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CartPage() {
  const { user, cart, removeFromCart, hydrated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (hydrated && !user) router.push('/login')
  }, [hydrated, user, router])

  if (!hydrated || !user) return null

  const subtotal = cart.reduce((sum, s) => {
    const num = parseInt(s.price.replace(/[^0-9]/g, ''))
    return sum + (isNaN(num) ? 0 : num)
  }, 0)
  const discount = Math.round(subtotal * 0.1)
  const total = subtotal - discount

  if (orderPlaced) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
        <p className="text-gray-500 text-sm mb-6">Our team will contact you shortly to confirm your appointment.</p>
        <Link href="/my-bookings"
          className="inline-block bg-navy text-white font-bold px-8 py-3 rounded-xl text-sm">
          View My Bookings
        </Link>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-sm mb-6">Add services to get started</p>
        <Link href="/all-services"
          className="inline-block bg-navy text-white font-bold px-8 py-3 rounded-xl text-sm">
          Browse services
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})</h1>

      {/* Cart items */}
      <div className="space-y-3">
        {cart.map(service => (
          <div key={service.name} className="bg-white rounded-2xl shadow-card p-4 flex gap-4">
            <img src={service.img} alt={service.name}
              className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm">{service.name}</div>
              {service.badge && (
                <div className="text-xs text-sky mt-0.5">{service.badge}</div>
              )}
              <div className="text-navy font-bold text-sm mt-1">{service.price}</div>
            </div>
            <button
              onClick={() => removeFromCart(service.name)}
              className="text-gray-400 hover:text-red-400 transition self-start"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Price summary */}
      <div className="bg-white rounded-2xl shadow-card p-5 space-y-3">
        <h2 className="font-bold text-gray-900 mb-2">Price details</h2>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal ({cart.length} services)</span>
          <span>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount (10%)</span>
          <span>− ₹{discount.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Convenience fee</span>
          <span className="text-green-600">FREE</span>
        </div>
        <hr className="border-gray-100" />
        <div className="flex justify-between font-bold text-gray-900 text-base">
          <span>Total</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
        </div>
        <div className="text-xs text-green-600 font-medium">You save ₹{discount.toLocaleString('en-IN')} on this order 🎉</div>
      </div>

      {/* Address selector */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-gray-900">Service address</h2>
          <button className="text-sky text-sm font-semibold">Change</button>
        </div>
        <div className="flex gap-3">
          <span className="text-xl">🏠</span>
          <div>
            <div className="text-sm font-semibold text-gray-800">Home</div>
            <div className="text-xs text-gray-500">12, Sunset Residency, Lokhandwala Complex, Mumbai 400053</div>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <button
        onClick={() => setOrderPlaced(true)}
        className="w-full py-4 bg-navy text-white font-bold rounded-2xl text-sm hover:bg-navy/90 transition"
      >
        Proceed to Book · ₹{total.toLocaleString('en-IN')}
      </button>
    </div>
  )
}
