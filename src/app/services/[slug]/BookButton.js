'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function BookButton({ service }) {
  const { user, addToCart, cart } = useAuth()
  const router = useRouter()
  const [added, setAdded] = useState(false)

  const inCart = cart.some(s => s.name === service?.name)

  function handleAddToCart() {
    if (!user) {
      router.push('/login')
      return
    }
    if (!inCart) {
      addToCart(service)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  function handleViewCart() {
    router.push('/CartDetails')
  }

  if (inCart) {
    return (
      <button
        onClick={handleViewCart}
        className="w-full bg-sky text-white font-bold py-4 rounded-xl hover:bg-sky/90 transition text-base"
      >
        View Cart →
      </button>
    )
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`w-full font-bold py-4 rounded-xl transition text-base ${
        added ? 'bg-green-500 text-white' : 'bg-navy text-white hover:bg-navy/90'
      }`}
    >
      {added ? '✓ Added to Cart' : 'Add to Cart'}
    </button>
  )
}
