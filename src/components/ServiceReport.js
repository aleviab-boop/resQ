'use client'
import { useState } from 'react'

// Post-service PDF report (Task #15 — FY26 Q4: Spares brand warranty automation)
// Generates a printable job card / service report

export default function ServiceReport({ booking, onClose }) {
  const [downloading, setDownloading] = useState(false)

  const report = {
    bookingId: booking?.id || 'BK2026001',
    service: booking?.service || 'Split AC Jet Service',
    date: booking?.date || 'Fri, 2 Oct 2026',
    time: booking?.time || '10:00 AM – 12:00 PM',
    address: booking?.address || '12, Sunset Residency, Lokhandwala, Mumbai 400053',
    tech: { name: 'Rahul Sharma', id: 'TECH-2891', rating: 4.9, phone: '+91 98200 11223' },
    parts: [
      { name: 'Gas top-up (R32, 1kg)', qty: 1, price: 250 },
      { name: 'Condenser cleaning chemical', qty: 1, price: 80 },
    ],
    labour: 269,
    tax: 49,
    warrantyDays: 30,
    warrantyExpiry: '1 Nov 2026',
    notes: 'AC cooling restored to factory levels. Filter cleaned. Drainage pipe cleared. No further issues observed.',
  }

  const partsTotal = report.parts.reduce((s, p) => s + p.price * p.qty, 0)
  const total = partsTotal + report.labour + report.tax

  function handleDownload() {
    setDownloading(true)
    // Open print dialog — browser will offer Save as PDF
    setTimeout(() => {
      window.print()
      setDownloading(false)
    }, 300)
  }

  return (
    <div className="fixed inset-0 z-[500] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-navy to-sky px-6 py-5 rounded-t-3xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Service Report</div>
              <div className="text-white text-xl font-extrabold">Job Card #{report.bookingId}</div>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white text-2xl">×</button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-green-400 text-white text-xs font-bold px-3 py-1 rounded-full">✓ Service Completed</span>
            <span className="text-white/70 text-xs">{report.date}</span>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Service info */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
            <div className="font-bold text-gray-900">{report.service}</div>
            <div className="text-sm text-gray-500">📅 {report.date} · {report.time}</div>
            <div className="text-sm text-gray-500">📍 {report.address}</div>
          </div>

          {/* Technician */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Technician</div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
              <div className="w-11 h-11 rounded-full bg-navy text-white flex items-center justify-center font-bold text-base">
                {report.tech.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900">{report.tech.name}</div>
                <div className="text-xs text-gray-400">ID: {report.tech.id} · ⭐ {report.tech.rating}</div>
              </div>
              <div className="text-xs text-sky font-semibold">{report.tech.phone}</div>
            </div>
          </div>

          {/* Parts & labour */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cost Breakdown</div>
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500">Item</th>
                    <th className="text-center px-2 py-2.5 text-xs font-bold text-gray-500">Qty</th>
                    <th className="text-right px-4 py-2.5 text-xs font-bold text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.parts.map((p, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 text-gray-700">{p.name}</td>
                      <td className="px-2 py-3 text-center text-gray-500">{p.qty}</td>
                      <td className="px-4 py-3 text-right text-gray-800 font-medium">₹{p.price}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-700">Labour charges</td>
                    <td className="px-2 py-3 text-center text-gray-500">—</td>
                    <td className="px-4 py-3 text-right text-gray-800 font-medium">₹{report.labour}</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-500 text-xs">GST (18%)</td>
                    <td className="px-2 py-3 text-center text-gray-400 text-xs">—</td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">₹{report.tax}</td>
                  </tr>
                  <tr className="bg-navy/5 font-bold">
                    <td colSpan={2} className="px-4 py-3 text-navy font-extrabold">Total Paid</td>
                    <td className="px-4 py-3 text-right text-navy font-extrabold text-base">₹{total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Service warranty */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <div className="font-bold text-green-800 text-sm">Service Warranty Active</div>
              <div className="text-xs text-green-600 mt-0.5">Valid for {report.warrantyDays} days · Expires {report.warrantyExpiry}</div>
              <div className="text-xs text-green-600 mt-1">If the same issue recurs, we fix it free of cost.</div>
            </div>
          </div>

          {/* Technician notes */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Technician Notes</div>
            <div className="bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-600 italic">"{report.notes}"</div>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-4 bg-navy text-white font-bold rounded-2xl hover:bg-navy/90 transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            {downloading ? 'Opening PDF…' : 'Download PDF Report'}
          </button>
          <p className="text-center text-xs text-gray-400">Opens print dialog — choose "Save as PDF"</p>
        </div>
      </div>
    </div>
  )
}
