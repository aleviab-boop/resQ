'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TrackIndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/track/JB001')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-sm text-gray-500">Loading tracking page…</div>
      </div>
    </div>
  )
}
