'use client'
import { useState, useEffect } from 'react'
import { getSLAFromPincode } from '@/lib/sla'

// Default SLA when pincode not set — metro assumption
const DEFAULT_SLA = {
  label: 'Available today',
  sublabel: 'Book before 2 PM for same-day slot',
  color: 'green',
  urgent: true,
}

const COLOR = {
  green: 'bg-green-50 text-green-700 border-green-200',
  blue: 'bg-sky/10 text-sky border-sky/20',
  gray: 'bg-gray-100 text-gray-500 border-gray-200',
}

export default function SlaBadge({ pincode: propPincode, className = '' }) {
  const [sla, setSla] = useState(DEFAULT_SLA)

  useEffect(() => {
    try {
      const saved = propPincode || localStorage.getItem('resq_pincode') || ''
      const result = getSLAFromPincode(saved)
      if (result) setSla(result)
    } catch {}
  }, [propPincode])

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
