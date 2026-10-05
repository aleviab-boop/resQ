'use client'
import { useState, useEffect } from 'react'
import { getSLAFromPincode } from '@/lib/sla'

const COLOR = {
  green: 'bg-green-50 text-green-700 border-green-200',
  blue: 'bg-sky/10 text-sky border-sky/20',
  gray: 'bg-gray-100 text-gray-500 border-gray-200',
}

export default function SlaBadge({ pincode: propPincode, className = '' }) {
  const [pincode, setPincode] = useState(propPincode || '')

  useEffect(() => {
    if (!propPincode) {
      // Try to read saved pincode from localStorage
      try {
        const saved = localStorage.getItem('resq_pincode') || ''
        if (/^\d{6}$/.test(saved)) setPincode(saved)
      } catch {}
    }
  }, [propPincode])

  const sla = getSLAFromPincode(pincode)
  if (!sla) return null

  return (
    <div className={`inline-flex items-center gap-2 border rounded-xl px-4 py-2.5 ${COLOR[sla.color]} ${className}`}>
      <span className="text-base">{sla.urgent ? '⚡' : '📅'}</span>
      <div>
        <div className="text-sm font-bold">{sla.label}</div>
        <div className="text-xs opacity-70">{sla.sublabel}</div>
      </div>
    </div>
  )
}
