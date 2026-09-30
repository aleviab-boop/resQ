'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function BookButton({ serviceName }) {
  const { user } = useAuth()
  const router = useRouter()

  function handleBook() {
    if (!user) {
      router.push('/login')
    } else {
      alert(`Booking confirmed for "${serviceName}"!\nOur technician will contact you shortly.`)
    }
  }

  return (
    <button
      onClick={handleBook}
      className="w-full bg-navy text-white font-bold py-4 rounded-xl hover:bg-navy-dark transition text-base"
    >
      Book now
    </button>
  )
}
