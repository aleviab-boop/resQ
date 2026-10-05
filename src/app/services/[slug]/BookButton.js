'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import BookingFlow from '@/components/BookingFlow'

export default function BookButton({ service }) {
  const { user } = useAuth()
  const router = useRouter()
  const [showFlow, setShowFlow] = useState(false)

  function handleBook() {
    if (!user) { router.push('/login'); return }
    setShowFlow(true)
  }

  return (
    <>
      <button
        onClick={handleBook}
        className="w-full bg-sky text-white font-bold py-4 rounded-xl hover:bg-sky/90 transition text-base"
      >
        Book Now
      </button>
      {showFlow && <BookingFlow service={service} onClose={() => setShowFlow(false)} />}
    </>
  )
}
