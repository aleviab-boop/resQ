'use client'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/components/Toast'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import ServiceReport from '@/components/ServiceReport'
import RatingModal from '@/components/RatingModal'
import BookingFlow from '@/components/BookingFlow'
import TechChat from '@/components/TechChat'
import TechProfileModal from '@/components/TechProfileModal'
import BeforeAfterPhotos from '@/components/BeforeAfterPhotos'

function SkeletonBookingCard() {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
      <div className="flex gap-4 p-4">
        <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
          <div className="h-3 bg-gray-100 rounded w-1/2 mt-1" />
        </div>
        <div className="w-16 h-5 bg-gray-100 rounded-full" />
      </div>
      <div className="border-t border-gray-100 px-4 py-3 flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-100 rounded-lg" />
          <div className="h-6 w-20 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

const MOCK_BOOKINGS = [
  {
    id: 'BK2026005',
    service: 'Double Door Refrigerator Cleaning',
    appliance: 'Refrigerator',
    date: 'Mon, 5 Oct 2026',
    time: '12:00 PM – 2:00 PM',
    address: '12, Sunset Residency, Lokhandwala, Mumbai',
    status: 'live',
    price: '₹189',
    img: 'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/backend/compressed/DoubleDoorRefCleaning.webp',
    tech: { name: 'Arjun Mehta', rating: 4.9, jobs: 521, phone: '+91 98200 77889', eta: 12 },
  },
  {
    id: 'BK2026001',
    service: 'Split AC Jet Service',
    appliance: 'Air Conditioner',
    date: 'Fri, 2 Oct 2026',
    time: '10:00 AM – 12:00 PM',
    address: '12, Sunset Residency, Lokhandwala, Mumbai',
    status: 'upcoming',
    price: '₹599',
    img: 'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/backend/compressed/splite_ac_Split_AC_Jet_Service.webp',
    tech: { name: 'Rahul Sharma', rating: 4.8, jobs: 312, phone: '+91 98200 11223', eta: 18 },
  },
  {
    id: 'BK2026002',
    service: 'LED TV 40–55 inch Cleaning',
    appliance: 'LED TV',
    date: 'Sat, 20 Sep 2026',
    time: '2:00 PM – 4:00 PM',
    address: '12, Sunset Residency, Lokhandwala, Mumbai',
    status: 'completed',
    price: '₹189',
    img: 'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/backend/compressed/TV_Tv_cleanning_copy.webp',
    tech: { name: 'Vikram Patel', rating: 4.6, jobs: 198, phone: '+91 98200 33445' },
  },
  {
    id: 'BK2026003',
    service: 'Front Load WM Installation',
    appliance: 'Washing Machine',
    date: 'Mon, 15 Sep 2026',
    time: '11:00 AM – 1:00 PM',
    address: 'Reliance Corporate Park, Navi Mumbai',
    status: 'completed',
    price: '₹409',
    img: 'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/backend/compressed/front_Load_Washing_Machine_washing_machine_installation_.webp',
    tech: { name: 'Suresh Kumar', rating: 4.9, jobs: 450, phone: '+91 98200 55667' },
  },
  {
    id: 'BK2026004',
    service: 'Water Purifier Service with filter',
    appliance: 'Water Purifier',
    date: 'Thu, 10 Sep 2026',
    time: '9:00 AM – 11:00 AM',
    address: '12, Sunset Residency, Lokhandwala, Mumbai',
    status: 'cancelled',
    price: '₹309',
    img: 'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/backend/compressed/Water_Purifier_Water_Purifier_Service_with_Filter_(Parts_Extra).webp',
  },
]

const STATUS_CONFIG = {
  live:      { label: '🔴 Live',    color: 'bg-red-100 text-red-600 animate-pulse' },
  upcoming:  { label: 'Upcoming',  color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-500' },
}

// Simulated route waypoints for the technician map (Mumbai area)
const ROUTE = [
  [19.123, 72.846], [19.120, 72.842], [19.117, 72.838],
  [19.115, 72.835], [19.113, 72.832], [19.111, 72.829],
  [19.108, 72.825], [19.106, 72.822], [19.104, 72.820],
]
const DEST = [19.104, 72.820]

function Stars({ rating }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  )
}

// Simplified SVG map showing technician route (roadmap Q1/Q2: dynamic tracking + ETA)
function TrackingMap({ etaMinutes }) {
  const [step, setStep] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setStep(s => s < ROUTE.length - 1 ? s + 1 : s)
    }, 2000)
    return () => clearInterval(timerRef.current)
  }, [])

  const progress = step / (ROUTE.length - 1)
  const remainingEta = Math.max(0, Math.round(etaMinutes * (1 - progress)))

  // Normalize coords for SVG viewport
  const minLat = Math.min(...ROUTE.map(r => r[0])) - 0.002
  const maxLat = Math.max(...ROUTE.map(r => r[0])) + 0.002
  const minLng = Math.min(...ROUTE.map(r => r[1])) - 0.002
  const maxLng = Math.max(...ROUTE.map(r => r[1])) + 0.002

  function toSVG([lat, lng]) {
    const x = ((lng - minLng) / (maxLng - minLng)) * 300
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 180
    return [x, y]
  }

  const points = ROUTE.map(toSVG)
  const [tx, ty] = points[step]
  const [dx, dy] = toSVG(DEST)
  const polyline = points.map(([x, y]) => `${x},${y}`).join(' ')
  const travelledPts = points.slice(0, step + 1).map(([x, y]) => `${x},${y}`).join(' ')

  return (
    <div className="rounded-2xl overflow-hidden bg-blue-50 border border-sky/20">
      {/* ETA header */}
      <div className="bg-sky px-5 py-3 flex items-center justify-between">
        <div>
          <div className="text-white text-xs font-semibold opacity-80">Technician on the way</div>
          <div className="text-white text-xl font-extrabold">{remainingEta === 0 ? 'Arriving now!' : `${remainingEta} min away`}</div>
        </div>
        <div className="text-3xl">🛵</div>
      </div>

      {/* SVG map */}
      <div className="relative bg-[#e8f4fd] p-3">
        <svg viewBox="0 0 300 180" className="w-full rounded-xl" style={{background: 'linear-gradient(135deg, #e8f4fd 0%, #ddf0fb 100%)'}}>
          {/* Road grid */}
          {[40,80,120,160].map(y => <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#c5dff0" strokeWidth="1"/>)}
          {[60,120,180,240].map(x => <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="#c5dff0" strokeWidth="1"/>)}

          {/* Full route (grey) */}
          {points.length > 1 && <polyline points={polyline} fill="none" stroke="#aacbe8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3"/>}

          {/* Travelled route (blue) */}
          {step > 0 && <polyline points={travelledPts} fill="none" stroke="#00a1e1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>}

          {/* Destination pin */}
          <circle cx={dx} cy={dy} r="10" fill="#13347b" opacity="0.15"/>
          <circle cx={dx} cy={dy} r="6" fill="#13347b"/>
          <text x={dx} y={dy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="white">🏠</text>

          {/* Technician dot */}
          <circle cx={tx} cy={ty} r="12" fill="#00a1e1" opacity="0.2"/>
          <circle cx={tx} cy={ty} r="8" fill="#00a1e1" stroke="white" strokeWidth="2"/>
          <text x={tx} y={ty + 1} textAnchor="middle" dominantBaseline="middle" fontSize="8">🛵</text>
        </svg>

        {/* Progress bar */}
        <div className="mt-2 bg-white rounded-full h-1.5 overflow-hidden">
          <div className="bg-sky h-full rounded-full transition-all duration-1000" style={{width: `${progress * 100}%`}}/>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Technician location</span>
          <span>Your address</span>
        </div>
      </div>
    </div>
  )
}

const CANCEL_REASONS = [
  'Technician not available', 'Rescheduled to another day',
  'Issue resolved on its own', 'Found a better option', 'Other reason',
]

const TIME_SLOTS = ['8:00 AM – 10:00 AM','10:00 AM – 12:00 PM','12:00 PM – 2:00 PM','2:00 PM – 4:00 PM','4:00 PM – 6:00 PM','6:00 PM – 8:00 PM']

function getDates() {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return Array.from({length: 7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i)
    return { label: i===0?'Today':i===1?'Tomorrow':days[d.getDay()], date: `${d.getDate()} ${months[d.getMonth()]}` }
  })
}

export default function MyBookingsPage() {
  const { user, hydrated, bookings: userBookings } = useAuth()
  const { t } = useTheme()
  const showToast = useToast()
  const router = useRouter()
  const [tab, setTab] = useState('all')
  const [tracking, setTracking] = useState(null)
  const [reportBooking, setReportBooking] = useState(null)
  const [ratingBooking, setRatingBooking] = useState(null)
  const [rated, setRated] = useState({})
  const [mounted, setMounted] = useState(false)
  const [cancelBooking, setCancelBooking] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelledIds, setCancelledIds] = useState([])
  const [rescheduleBooking, setRescheduleBooking] = useState(null)
  const [rescheduleDate, setRescheduleDate] = useState(null)
  const [rescheduleSlot, setRescheduleSlot] = useState(null)
  const [rescheduledMap, setRescheduledMap] = useState({})
  const [bookAgainService, setBookAgainService] = useState(null)
  const [chatBooking, setChatBooking] = useState(null)
  const [techProfile, setTechProfile] = useState(null)
  const [photosBooking, setPhotosBooking] = useState(null)
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { const t = setTimeout(() => setLoadingSkeleton(false), 600); return () => clearTimeout(t) }, [])
  useEffect(() => { if (hydrated && !user) router.push('/login') }, [hydrated, user, router])
  if (!hydrated || !mounted) return null
  if (!user) return null

  function handleCancel() {
    setCancelledIds(prev => [...prev, cancelBooking.id])
    setCancelBooking(null)
    setCancelReason('')
    showToast('Booking cancelled successfully', 'info')
  }

  function handleReschedule() {
    if (!rescheduleDate || !rescheduleSlot) return
    setRescheduledMap(prev => ({ ...prev, [rescheduleBooking.id]: { date: `${rescheduleDate.label}, ${rescheduleDate.date}`, time: rescheduleSlot } }))
    setRescheduleBooking(null)
    setRescheduleDate(null)
    setRescheduleSlot(null)
    showToast('Booking rescheduled!', 'success')
  }

  function exportHistoryPDF() {
    const bookings = [...(userBookings || []), ...MOCK_BOOKINGS]
    const rows = bookings.map(b => `
      <tr>
        <td>${b.id}</td>
        <td>${b.service}</td>
        <td>${b.date || '—'}</td>
        <td>${b.tech?.name || '—'}</td>
        <td>${b.price}</td>
        <td style="text-transform:capitalize">${b.status}</td>
      </tr>`).join('')
    const html = `<!DOCTYPE html><html><head><title>resQ Service History</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 32px; color: #1a1a2e; }
      h1 { color: #13347b; margin-bottom: 4px; }
      p { color: #888; font-size: 13px; margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th { background: #13347b; color: white; padding: 10px 12px; text-align: left; }
      td { padding: 9px 12px; border-bottom: 1px solid #eee; }
      tr:nth-child(even) td { background: #f8faff; }
      .footer { margin-top: 32px; font-size: 11px; color: #aaa; text-align: center; }
    </style></head><body>
    <h1>resQ Service History</h1>
    <p>Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · Total bookings: ${bookings.length}</p>
    <table><thead><tr><th>Booking ID</th><th>Service</th><th>Date</th><th>Technician</th><th>Amount</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <div class="footer">Reliance resQ · 1800 267 0999 · resqservices.in</div>
    <script>window.onload=()=>window.print()</script>
    </body></html>`
    const win = window.open('', '_blank', 'width=900,height=700')
    win.document.write(html)
    win.document.close()
  }

  // Merge user-created bookings (newest first) with mock bookings
  const ALL_BOOKINGS = [...(userBookings || []), ...MOCK_BOOKINGS].map(b => {
    const rescheduled = rescheduledMap[b.id]
    const cancelled = cancelledIds.includes(b.id)
    return { ...b, ...(rescheduled || {}), status: cancelled ? 'cancelled' : b.status }
  })
  const filtered = tab === 'all' ? ALL_BOOKINGS : ALL_BOOKINGS.filter(b => b.status === tab)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{t.myBookings}</h1>
        <button onClick={exportHistoryPDF} className="flex items-center gap-1.5 text-xs font-semibold text-navy border border-navy/30 px-3 py-2 rounded-xl hover:bg-navy/5 transition">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Export PDF
        </button>
      </div>

      {/* Live booking banner */}
      {ALL_BOOKINGS.some(b => b.status === 'live') && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
          <span className="text-2xl">🛵</span>
          <div className="flex-1">
            <div className="text-white font-extrabold text-sm">{t.techOnWay}</div>
            <div className="text-white/80 text-xs mt-0.5">Arjun Mehta · ETA ~12 min · Track live below</div>
          </div>
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
        {[['all', t.tabAll], ['upcoming', t.tabUpcoming], ['completed', t.tabCompleted], ['cancelled', t.tabCancelled]].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setTab(val)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
              tab === val ? 'bg-white text-navy shadow-sm' : 'text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      {loadingSkeleton ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <SkeletonBookingCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">
            {tab === 'upcoming' ? '🗓️' : tab === 'completed' ? '✅' : tab === 'cancelled' ? '🚫' : '📋'}
          </div>
          <div className="font-bold text-gray-700 text-lg mb-1">
            {tab === 'upcoming' ? t.noUpcoming : tab === 'completed' ? t.noCompleted : tab === 'cancelled' ? t.noCancelled : t.noBookings}
          </div>
          <div className="text-sm text-gray-400 mb-5">
            {tab === 'upcoming' ? t.noUpcomingDesc : tab === 'completed' ? t.noCompletedDesc : tab === 'cancelled' ? t.noCancelledDesc : t.noBookingsDesc}
          </div>
          <button onClick={() => router.push('/all-services')}
            className="bg-sky text-white font-bold px-6 py-3 rounded-2xl hover:bg-sky/90 transition text-sm">
            {t.browseServices}
          </button>
        </div>
      ) : null}
      {!loadingSkeleton && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map(b => (
            <div key={b.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="flex gap-4 p-4">
                <img src={b.img} alt={b.service}
                  className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-gray-900 text-sm leading-tight">{b.service}</div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${STATUS_CONFIG[b.status].color}`}>
                      {STATUS_CONFIG[b.status].label}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Booking ID: {b.id}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current text-gray-400"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
                    <span className="text-xs text-gray-500">{b.date} · {b.time}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current text-gray-400"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/></svg>
                    <span className="text-xs text-gray-500 truncate">{b.address}</span>
                  </div>
                </div>
              </div>

              {/* Tracking view (Q1 roadmap: dynamic tracking link) */}
              {b.status === 'live' && tracking === b.id && b.tech && (
                <div className="px-4 pb-4 space-y-3">
                  <TrackingMap etaMinutes={b.tech.eta} />
                  {/* Technician card */}
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="w-11 h-11 rounded-full bg-navy text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                      {b.tech.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <button onClick={() => setTechProfile(b.tech)} className="font-semibold text-navy text-sm underline underline-offset-2 hover:text-sky transition text-left">{b.tech.name}</button>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Stars rating={b.tech.rating} />
                        <span className="text-xs text-gray-500">{b.tech.rating} · {b.tech.jobs} jobs</span>
                      </div>
                    </div>
                    <button onClick={() => setChatBooking(b)} className="w-9 h-9 bg-sky rounded-full flex items-center justify-center flex-shrink-0 hover:bg-sky/80 transition">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                    </button>
                    <a href={`tel:${b.tech.phone}`} className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-green-600 transition">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                    </a>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-bold text-navy">{b.price}</span>
                <div className="flex gap-2">
                  {b.status === 'live' && (
                    <>
                      <button
                        onClick={() => setChatBooking(b)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 bg-green-500 text-white hover:bg-green-600"
                      >
                        <span>💬</span> Chat
                      </button>
                      <button
                        onClick={() => setTracking(tracking === b.id ? null : b.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 bg-red-500 text-white hover:bg-red-600"
                      >
                        <span>📍</span> {tracking === b.id ? t.hideMap : t.trackLive}
                      </button>
                    </>
                  )}
                  {b.status === 'upcoming' && (
                    <>
                      <button onClick={() => { setRescheduleBooking(b); setRescheduleDate(null); setRescheduleSlot(null) }}
                        className="text-xs px-3 py-1.5 border border-sky text-sky rounded-lg font-semibold hover:bg-sky/10 transition">
                        {t.reschedule}
                      </button>
                      <button onClick={() => { setCancelBooking(b); setCancelReason('') }}
                        className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition">
                        {t.cancel}
                      </button>
                    </>
                  )}
                  {b.status === 'completed' && (
                    <>
                      <button onClick={() => {
                        const text = `I just got my ${b.service} serviced via resQ! Booking ID: ${b.id}. Book at https://res-q-sepia-pi.vercel.app`
                        if (navigator.share) {
                          navigator.share({ title: 'resQ Booking', text })
                        } else {
                          navigator.clipboard.writeText(text).then(() => showToast('Booking link copied!', 'success'))
                        }
                      }} className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                        {t.share}
                      </button>
                      <button onClick={() => setPhotosBooking(photosBooking === b.id ? null : b.id)} className="text-xs px-3 py-1.5 border border-purple-200 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center gap-1">
                        📷 Photos
                      </button>
                      <button onClick={() => setReportBooking(b)} className="text-xs px-3 py-1.5 border border-navy text-navy rounded-lg font-semibold hover:bg-navy/5 transition flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        {t.report}
                      </button>
                      {!rated[b.id] ? (
                        <button onClick={() => setRatingBooking(b)} className="text-xs px-3 py-1.5 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition flex items-center gap-1">
                          ⭐ {t.rate}
                        </button>
                      ) : (
                        <span className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-semibold">{t.rated}</span>
                      )}
                      <button onClick={() => setBookAgainService({ name: b.service, img: b.img, price: b.price, category: b.appliance })}
                        className="text-xs px-3 py-1.5 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90 transition">
                        {t.bookAgain}
                      </button>
                    </>
                  )}
                </div>
              </div>
              {/* Before/after photos inline */}
              {photosBooking === b.id && b.status === 'completed' && (
                <BeforeAfterPhotos service={b.service} />
              )}
            </div>
          ))}
        </div>
      )}
      {reportBooking && <ServiceReport booking={reportBooking} onClose={() => setReportBooking(null)} />}
      {ratingBooking && <RatingModal booking={ratingBooking} onClose={() => setRatingBooking(null)} onSubmit={() => { setRated(r => ({...r, [ratingBooking.id]: true})); setRatingBooking(null); showToast('Thanks for your rating! ⭐', 'success') }} />}

      {/* Cancel Modal */}
      {cancelBooking && (
        <div className="fixed inset-0 z-[400] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setCancelBooking(null)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-extrabold text-lg text-gray-900 mb-1">Cancel booking?</h3>
            <p className="text-sm text-gray-500 mb-4">{cancelBooking.service}</p>
            <div className="space-y-2 mb-5">
              {CANCEL_REASONS.map(r => (
                <button key={r} onClick={() => setCancelReason(r)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition ${cancelReason === r ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                  {cancelReason === r ? '● ' : '○ '}{r}
                </button>
              ))}
            </div>
            <button disabled={!cancelReason} onClick={handleCancel}
              className={`w-full py-4 rounded-2xl font-bold text-white transition mb-2 ${cancelReason ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              Confirm Cancellation
            </button>
            <button onClick={() => setCancelBooking(null)} className="w-full py-3 text-gray-500 text-sm font-semibold">Keep booking</button>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-[400] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setRescheduleBooking(null)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-extrabold text-lg text-gray-900 mb-1">Reschedule booking</h3>
            <p className="text-sm text-gray-500 mb-4">{rescheduleBooking.service}</p>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Pick a date</p>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {getDates().map(d => (
                <button key={d.date} onClick={() => setRescheduleDate(d)}
                  className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border-2 text-xs font-bold transition ${rescheduleDate?.date === d.date ? 'border-sky bg-sky/10 text-sky' : 'border-gray-200 text-gray-700 hover:border-sky/40'}`}>
                  <span className="text-gray-400 font-normal">{d.label}</span>
                  <span className="mt-0.5">{d.date}</span>
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Pick a time</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {TIME_SLOTS.map(slot => (
                <button key={slot} onClick={() => setRescheduleSlot(slot)}
                  className={`py-3 rounded-xl border-2 text-xs font-semibold transition ${rescheduleSlot === slot ? 'border-sky bg-sky/10 text-sky' : 'border-gray-200 text-gray-700 hover:border-sky/40'}`}>
                  {slot}
                </button>
              ))}
            </div>
            <button disabled={!rescheduleDate || !rescheduleSlot} onClick={handleReschedule}
              className={`w-full py-4 rounded-2xl font-bold text-white transition mb-2 ${rescheduleDate && rescheduleSlot ? 'bg-sky hover:bg-sky/90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              Confirm Reschedule
            </button>
            <button onClick={() => setRescheduleBooking(null)} className="w-full py-3 text-gray-500 text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      {/* Book again flow */}
      {bookAgainService && (
        <BookingFlow service={bookAgainService} onClose={() => setBookAgainService(null)} />
      )}
      {chatBooking && chatBooking.tech && (
        <TechChat booking={chatBooking} onClose={() => setChatBooking(null)} />
      )}
      {techProfile && (
        <TechProfileModal tech={techProfile} onClose={() => setTechProfile(null)} />
      )}
    </div>
  )
}
