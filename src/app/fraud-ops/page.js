'use client'
import { useState } from 'react'
import Link from 'next/link'

const FRAUD_FLAGS = [
  {
    id: 'F001', type: 'multi-trip',
    desc: 'Same job registered 3 times',
    customer: 'Priya Mehta', phone: '+91 98201 44321',
    appliance: 'Split AC', area: 'Andheri East',
    engineer: 'Arjun Mehta (E001)',
    dates: ['Oct 12 10:15', 'Oct 12 14:30', 'Oct 13 09:05'],
    totalCharged: '₹1,797', expectedCharge: '₹599',
    overcharge: '₹1,198', severity: 'high', status: 'open',
  },
  {
    id: 'F002', type: 'cancellation-fraud',
    desc: 'DDU call cancelled, customer received cancellation call instead of service',
    customer: 'Ramesh Iyer', phone: '+91 98765 11223',
    appliance: 'Refrigerator', area: 'Malad West',
    engineer: 'Delivery Co. (DL-022)',
    dates: ['Oct 11 11:00'],
    totalCharged: '₹0', expectedCharge: '₹0',
    overcharge: '₹0', severity: 'medium', status: 'open',
    note: 'Customer did not receive installation — order marked delivered.',
  },
  {
    id: 'F003', type: 'multi-trip',
    desc: 'Washing machine repair logged twice by same engineer',
    customer: 'Sunita Patel', phone: '+91 91234 56789',
    appliance: 'Washing Machine', area: 'Borivali',
    engineer: 'Suresh Kumar (E004)',
    dates: ['Oct 10 14:00', 'Oct 10 18:30'],
    totalCharged: '₹1,198', expectedCharge: '₹599',
    overcharge: '₹599', severity: 'high', status: 'resolved',
  },
  {
    id: 'F004', type: 'imei-mismatch',
    desc: 'Device IMEI during inspection does not match registered appliance serial',
    customer: 'Vikram Nair', phone: '+91 87654 32100',
    appliance: 'LED TV', area: 'Powai',
    engineer: 'Manoj Tiwari (E006)',
    dates: ['Oct 09 10:30'],
    totalCharged: '₹189', expectedCharge: '₹189',
    overcharge: '₹0', severity: 'medium', status: 'open',
    note: 'Registered serial: SN-SVY-2022-0193, Scanned at visit: SN-SVY-2021-8841.',
  },
  {
    id: 'F005', type: 'cancellation-fraud',
    desc: 'AC installation cancelled by delivery partner after 3 failed attempts — customer never informed',
    customer: 'Anita Sharma', phone: '+91 99887 76655',
    appliance: 'Air Conditioner', area: 'Thane West',
    engineer: 'Delivery Co. (DL-047)',
    dates: ['Oct 08', 'Oct 09', 'Oct 10'],
    totalCharged: '₹0', expectedCharge: '₹0',
    overcharge: '₹0', severity: 'high', status: 'open',
    note: 'Customer called helpline 3 times. No callback received.',
  },
  {
    id: 'F006', type: 'multi-trip',
    desc: 'Geyser installation billed to 2 different brand codes (Reliance + V-Guard) for same visit',
    customer: 'Deepak Joshi', phone: '+91 98100 23456',
    appliance: 'Geyser', area: 'Navi Mumbai',
    engineer: 'Rohan Nair (E007)',
    dates: ['Oct 07 09:00'],
    totalCharged: '₹1,100', expectedCharge: '₹550',
    overcharge: '₹550', severity: 'high', status: 'open',
    note: 'Same visit logged under Reliance job code AND V-Guard SLA, collecting from both.',
  },
]

const TYPE_LABELS = {
  'multi-trip':         { label: 'Multi-trip',          color: 'bg-red-100 text-red-700' },
  'cancellation-fraud': { label: 'Cancellation Fraud',  color: 'bg-orange-100 text-orange-700' },
  'imei-mismatch':      { label: 'IMEI Mismatch',       color: 'bg-purple-100 text-purple-700' },
}

const SEVERITY = {
  high:   'bg-red-500',
  medium: 'bg-amber-400',
  low:    'bg-gray-300',
}

export default function FraudOps() {
  const [filter, setFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = FRAUD_FLAGS.filter(f => {
    const typeOk   = filter === 'all' || f.type === filter
    const statusOk = statusFilter === 'all' || f.status === statusFilter
    return typeOk && statusOk
  })

  const open     = FRAUD_FLAGS.filter(f => f.status === 'open').length
  const highSev  = FRAUD_FLAGS.filter(f => f.severity === 'high' && f.status === 'open').length
  const totalLoss = FRAUD_FLAGS.reduce((sum, f) => {
    const n = parseInt(f.overcharge.replace(/[^0-9]/g, '')) || 0
    return sum + n
  }, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Link href="/ops" className="text-sm text-gray-400 hover:text-navy transition">← Ops Hub</Link>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Fraud & Anomaly Detection</h1>
        <p className="text-gray-400 text-sm mt-1">Multi-trip scams · Cancellation fraud · IMEI mismatches · Duplicate billing</p>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Open flags',       value: open,      color: 'text-red-600',   bg: 'bg-red-50',   icon: '🚩' },
          { label: 'High severity',    value: highSev,   color: 'text-red-600',   bg: 'bg-red-50',   icon: '🔴' },
          { label: 'Total overcharge', value: `₹${totalLoss.toLocaleString('en-IN')}`, color: 'text-red-700', bg: 'bg-red-50', icon: '💸' },
          { label: 'Resolved',         value: FRAUD_FLAGS.filter(f => f.status === 'resolved').length, color: 'text-green-700', bg: 'bg-green-50', icon: '✅' },
        ].map(t => (
          <div key={t.label} className={`${t.bg} rounded-2xl p-4`}>
            <div className="text-2xl mb-1">{t.icon}</div>
            <div className={`text-2xl font-extrabold ${t.color}`}>{t.value}</div>
            <div className="text-xs text-gray-500 mt-0.5 font-medium">{t.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { key: 'all',               label: 'All types' },
          { key: 'multi-trip',        label: 'Multi-trip' },
          { key: 'cancellation-fraud',label: 'Cancellation Fraud' },
          { key: 'imei-mismatch',     label: 'IMEI Mismatch' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === f.key ? 'bg-navy text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-navy/40'}`}>
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          {['all','open','resolved'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition capitalize ${statusFilter === s ? 'bg-sky text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Flag cards */}
      <div className="space-y-3">
        {filtered.map(f => {
          const typeTag = TYPE_LABELS[f.type]
          return (
            <div key={f.id}
              className={`bg-white rounded-2xl shadow-card border-l-4 p-5 cursor-pointer hover:shadow-lg transition ${f.severity === 'high' ? 'border-red-500' : f.severity === 'medium' ? 'border-amber-400' : 'border-gray-200'} ${f.status === 'resolved' ? 'opacity-60' : ''}`}
              onClick={() => setSelected(selected?.id === f.id ? null : f)}>

              <div className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${SEVERITY[f.severity]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-gray-900 text-sm">{f.id}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeTag.color}`}>{typeTag.label}</span>
                    {f.status === 'resolved' && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Resolved</span>}
                    {f.status === 'open' && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Open</span>}
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{f.desc}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    <span>👤 {f.customer}</span>
                    <span>🔧 {f.appliance}</span>
                    <span>📍 {f.area}</span>
                    <span>👨‍🔧 {f.engineer}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {parseInt(f.overcharge.replace(/[^0-9]/g,'')) > 0 && (
                    <div className="text-red-600 font-extrabold text-sm">{f.overcharge}</div>
                  )}
                  {parseInt(f.overcharge.replace(/[^0-9]/g,'')) > 0 && (
                    <div className="text-xs text-gray-400">overcharge</div>
                  )}
                </div>
              </div>

              {/* Expanded detail */}
              {selected?.id === f.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-gray-400 mb-0.5">Customer phone</div>
                      <div className="font-bold text-gray-800">{f.phone}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-gray-400 mb-0.5">Total charged</div>
                      <div className="font-bold text-gray-800">{f.totalCharged}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-gray-400 mb-0.5">Expected charge</div>
                      <div className="font-bold text-gray-800">{f.expectedCharge}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-1 font-semibold">Event timestamps</div>
                    <div className="flex flex-wrap gap-2">
                      {f.dates.map((d, i) => (
                        <span key={i} className="text-xs bg-navy/10 text-navy font-semibold px-2 py-1 rounded-lg">{d}</span>
                      ))}
                    </div>
                  </div>

                  {f.note && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                      <span className="font-bold">Note: </span>{f.note}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button className="flex-1 bg-red-50 text-red-600 font-bold text-xs py-2.5 rounded-xl hover:bg-red-100 transition">
                      Escalate & Block Engineer
                    </button>
                    <button className="flex-1 bg-green-50 text-green-700 font-bold text-xs py-2.5 rounded-xl hover:bg-green-100 transition">
                      Mark Resolved
                    </button>
                    <button className="flex-1 bg-sky/10 text-sky font-bold text-xs py-2.5 rounded-xl hover:bg-sky/20 transition">
                      Initiate Refund
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">✅</div>
          <div className="font-semibold">No flags for this filter</div>
        </div>
      )}
    </div>
  )
}
