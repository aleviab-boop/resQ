'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const APPLIANCE_TYPES = ['Air Conditioner', 'Washing Machine', 'Refrigerator', 'LED TV', 'Water Purifier', 'Air Cooler', 'Microwave', 'Dishwasher', 'Geyser', 'Other']
const BRANDS = { 'Air Conditioner': ['Daikin', 'Voltas', 'LG', 'Samsung', 'Hitachi', 'Blue Star', 'Carrier', 'Other'], 'Washing Machine': ['LG', 'Samsung', 'Whirlpool', 'IFB', 'Bosch', 'Haier', 'Other'], 'Refrigerator': ['LG', 'Samsung', 'Whirlpool', 'Godrej', 'Haier', 'Bosch', 'Other'], 'LED TV': ['Sony', 'LG', 'Samsung', 'Vu', 'TCL', 'Mi', 'Other'], 'Water Purifier': ['Kent', 'Pureit', 'Aquaguard', 'AO Smith', 'Other'], 'Air Cooler': ['Symphony', 'Bajaj', 'Crompton', 'Usha', 'Other'], 'Microwave': ['LG', 'Samsung', 'IFB', 'Panasonic', 'Other'], 'Dishwasher': ['Bosch', 'IFB', 'Siemens', 'Other'], 'Geyser': ['Racold', 'AO Smith', 'Havells', 'Bajaj', 'Other'], 'Other': ['Other'] }

const MOCK_HISTORY = [
  { date: '12 Aug 2026', service: 'Split AC Jet Service', tech: 'Rahul Sharma', cost: '₹599', status: 'Completed' },
  { date: '3 May 2026', service: 'Split AC Dry Service', tech: 'Vikram Patel', cost: '₹249', status: 'Completed' },
]

const DEVICE_ICONS = { 'Air Conditioner': '❄️', 'Washing Machine': '🫧', 'Refrigerator': '🧊', 'LED TV': '📺', 'Water Purifier': '💧', 'Air Cooler': '🌬️', 'Microwave': '📡', 'Dishwasher': '🍽️', 'Geyser': '🚿', 'Other': '🔌' }

function warrantyStatus(purchaseDate, warrantyYears) {
  if (!purchaseDate || !warrantyYears) return null
  const start = new Date(purchaseDate)
  const expiry = new Date(purchaseDate)
  expiry.setFullYear(expiry.getFullYear() + parseInt(warrantyYears))
  const today = new Date()
  const totalDays = Math.ceil((expiry - start) / (1000 * 60 * 60 * 24))
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  const daysUsed = totalDays - daysLeft
  const pctUsed = Math.min(100, Math.max(0, Math.round((daysUsed / totalDays) * 100)))
  return { expiry: expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), daysLeft, pctUsed, totalDays }
}

function WarrantyRing({ pctUsed, daysLeft, expiry }) {
  const radius = 36
  const circ = 2 * Math.PI * radius
  const offset = circ * (1 - pctUsed / 100)
  const color = pctUsed >= 100 ? '#ef4444' : pctUsed >= 75 ? '#f59e0b' : '#34d399'
  return (
    <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 mt-4">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle cx="44" cy="44" r={radius} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-extrabold text-gray-900" style={{ color }}>{pctUsed}%</span>
          <span className="text-[10px] text-gray-400 font-medium">used</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="font-bold text-gray-800 text-sm">Warranty status</div>
        <div className={`text-xs font-semibold mt-1 ${pctUsed >= 100 ? 'text-red-500' : pctUsed >= 75 ? 'text-amber-500' : 'text-green-600'}`}>
          {pctUsed >= 100 ? 'Warranty expired' : `${Math.max(0, daysLeft)} days remaining`}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">Valid till {expiry}</div>
        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pctUsed}%`, background: color }} />
        </div>
      </div>
    </div>
  )
}

export default function MyDevicesPage() {
  const { user, hydrated } = useAuth()
  const { t } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [devices, setDevices] = useState([
    { id: 1, type: 'Air Conditioner', brand: 'Daikin', model: 'FTKF35TV', serial: 'DK2024001', purchaseDate: '2024-03-15', warrantyYears: '2', expanded: false },
  ])
  const [showAdd, setShowAdd] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [form, setForm] = useState({ type: '', brand: '', model: '', serial: '', purchaseDate: '', warrantyYears: '1' })

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { if (hydrated && !user) router.push('/login') }, [mounted, user, router])
  if (!hydrated || !user) return null

  function addDevice() {
    if (!form.type || !form.brand || !form.model) return
    setDevices(prev => [...prev, { ...form, id: Date.now(), expanded: false }])
    setForm({ type: '', brand: '', model: '', serial: '', purchaseDate: '', warrantyYears: '1' })
    setShowAdd(false)
  }

  function removeDevice(id) {
    setDevices(prev => prev.filter(d => d.id !== id))
    if (selectedDevice?.id === id) setSelectedDevice(null)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t.myDevices}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{devices.length} {devices.length !== 1 ? t.appliances : t.appliance} {t.registered}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-sky text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-sky/90 transition flex items-center gap-2">
          <span className="text-lg leading-none">+</span> {t.addDevice.replace('+ ', '')}
        </button>
      </div>

      {/* Device list */}
      <div className="space-y-4">
        {devices.map(device => {
          const ws = warrantyStatus(device.purchaseDate, device.warrantyYears)
          const isExpired = ws && ws.daysLeft <= 0
          const isExpiring = ws && ws.daysLeft > 0 && ws.daysLeft <= 30
          return (
            <div key={device.id} className={`bg-white rounded-2xl shadow-card overflow-hidden border-2 ${selectedDevice?.id === device.id ? 'border-sky' : 'border-transparent'}`}>
              <button className="w-full text-left p-5 flex items-center gap-4" onClick={() => setSelectedDevice(selectedDevice?.id === device.id ? null : device)}>
                <div className="w-14 h-14 rounded-2xl bg-sky/10 flex items-center justify-center text-3xl flex-shrink-0">
                  {DEVICE_ICONS[device.type] || '🔌'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900">{device.brand} {device.model}</span>
                    {isExpired && <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">{t.warrantyExpired}</span>}
                    {isExpiring && <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">⏰ {ws.daysLeft}d</span>}
                    {ws && !isExpired && !isExpiring && <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">{t.underWarranty}</span>}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">{device.type}</div>
                  {ws && <div className="text-xs text-gray-400 mt-0.5">{isExpired ? t.warrantyExpiredOn : t.warrantyTill} {ws.expiry}</div>}
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${selectedDevice?.id === device.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </button>

              {selectedDevice?.id === device.id && (
                <div className="border-t border-gray-100 px-5 pb-5">
                  {/* Device details */}
                  <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                    {[['Type', device.type], ['Brand', device.brand], ['Model', device.model], ['Serial No.', device.serial || '—'], ['Purchase Date', device.purchaseDate ? new Date(device.purchaseDate).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'}) : '—'], ['Warranty', device.warrantyYears ? `${device.warrantyYears} year${device.warrantyYears > 1 ? 's' : ''}` : '—']].map(([k, v]) => (
                      <div key={k} className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs text-gray-400 font-medium">{k}</div>
                        <div className="font-semibold text-gray-800 mt-0.5 truncate">{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Warranty progress ring */}
                  {ws && <WarrantyRing pctUsed={ws.pctUsed} daysLeft={ws.daysLeft} expiry={ws.expiry} />}

                  {/* Warranty expiry nudge */}
                  {(isExpired || isExpiring) && (
                    <div className="mt-4 bg-gradient-to-r from-navy to-sky rounded-xl p-4 text-white">
                      <div className="text-sm font-bold mb-1">{isExpired ? '⚠️ Warranty expired' : `⏰ Warranty expiring in ${ws.daysLeft} days`}</div>
                      <p className="text-xs opacity-80 mb-3">Protect your device with resQ Care Plan before the next breakdown.</p>
                      <Link href="/care-plan" className="bg-white text-navy text-xs font-bold px-3 py-1.5 rounded-lg inline-block hover:bg-sky-light transition">Get Care Plan →</Link>
                    </div>
                  )}

                  {/* Service history timeline */}
                  <div className="mt-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">{t.serviceHistory}</h3>
                    <div className="relative">
                      {/* Vertical line */}
                      <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-gray-200" />
                      <div className="space-y-4">
                        {MOCK_HISTORY.map((h, i) => (
                          <div key={i} className="flex gap-4 items-start relative">
                            {/* Dot */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-xs font-bold ${i === 0 ? 'bg-sky text-white' : 'bg-green-100 text-green-700'}`}>
                              {i === 0 ? '🔧' : '✓'}
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                              <div className="flex justify-between items-start">
                                <div className="font-semibold text-gray-800 text-sm leading-tight">{h.service}</div>
                                <div className="text-sm font-bold text-navy ml-2 flex-shrink-0">{h.cost}</div>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <div className="text-xs text-gray-400">{h.date} · {h.tech}</div>
                                <span className="text-xs text-green-600 font-semibold">{h.status}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {/* "Device added" event at the end */}
                        <div className="flex gap-4 items-start relative">
                          <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 z-10 text-sm">📦</div>
                          <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                            <div className="font-semibold text-gray-700 text-sm">{t.devicePurchased}</div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {device.purchaseDate ? new Date(device.purchaseDate).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'}) : 'Date not set'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <Link href="/all-services" className="flex-1 text-center py-2.5 rounded-xl bg-sky text-white text-sm font-bold hover:bg-sky/90 transition">{t.bookService}</Link>
                    <button onClick={() => removeDevice(device.id)} className="px-4 py-2.5 rounded-xl border-2 border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition">{t.remove}</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {devices.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📦</div>
            <div className="font-semibold text-gray-600">No devices added yet</div>
            <p className="text-sm mt-1">Add your appliances to track warranty & service history</p>
            <button onClick={() => setShowAdd(true)} className="mt-4 bg-sky text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-sky/90 transition">{t.addDevice}</button>
          </div>
        )}
      </div>

      {/* Add device modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">Add a device</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Appliance type *</label>
                <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value, brand: ''}))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky">
                  <option value="">Select type</option>
                  {APPLIANCE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              {form.type && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Brand *</label>
                  <select value={form.brand} onChange={e => setForm(f => ({...f, brand: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky">
                    <option value="">Select brand</option>
                    {(BRANDS[form.type] || BRANDS['Other']).map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Model name *</label>
                <input value={form.model} onChange={e => setForm(f => ({...f, model: e.target.value}))} placeholder="e.g. FTKF35TV" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Serial number (optional)</label>
                <input value={form.serial} onChange={e => setForm(f => ({...f, serial: e.target.value}))} placeholder="Found on device label" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Purchase date</label>
                  <input type="date" value={form.purchaseDate} onChange={e => setForm(f => ({...f, purchaseDate: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Warranty (years)</label>
                  <select value={form.warrantyYears} onChange={e => setForm(f => ({...f, warrantyYears: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky">
                    {[1,2,3,5].map(y => <option key={y} value={y}>{y} year{y > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={addDevice} disabled={!form.type || !form.brand || !form.model} className={`w-full py-4 rounded-xl font-bold text-white transition ${form.type && form.brand && form.model ? 'bg-sky hover:bg-sky/90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                Add Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
