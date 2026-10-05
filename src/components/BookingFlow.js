'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useRouter } from 'next/navigation'

const TECHNICIANS = [
  { id: 1, name: 'Rahul Sharma', rating: 4.9, jobs: 1243, exp: '6 yrs', specialization: 'AC & Cooling', avatar: 'RS', badge: 'Top Rated' },
  { id: 2, name: 'Vikram Patel', rating: 4.7, jobs: 876, exp: '4 yrs', specialization: 'White Goods', avatar: 'VP', badge: 'Verified' },
  { id: 3, name: 'Anil Kumar', rating: 4.8, jobs: 1102, exp: '5 yrs', specialization: 'Electronics', avatar: 'AK', badge: 'Expert' },
]

const TIME_SLOTS = [
  { label: '8:00 AM – 10:00 AM', slots: 0, total: 4 },
  { label: '10:00 AM – 12:00 PM', slots: 2, total: 4 },
  { label: '12:00 PM – 2:00 PM', slots: 4, total: 4 },
  { label: '2:00 PM – 4:00 PM', slots: 1, total: 4 },
  { label: '4:00 PM – 6:00 PM', slots: 3, total: 4 },
  { label: '6:00 PM – 8:00 PM', slots: 4, total: 4 },
]

const VALID_COUPONS = {
  'RESQ50': { discount: 50, label: '50% off applied!' },
  'FIRST100': { discount: 100, label: '₹100 off applied!' },
  'RELIANCE': { discount: 20, label: '20% off applied!' },
}

function getDates() {
  const dates = []
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dates.push({ label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()], date: `${d.getDate()} ${months[d.getMonth()]}`, full: d.toDateString() })
  }
  return dates
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// CSS-based confetti — no canvas sizing issues, works everywhere
const CONFETTI_COLORS = ['#00a1e1','#13347b','#fbbf24','#34d399','#f87171','#a78bfa','#fb923c','#f472b6']
const CONFETTI_PIECES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  left: Math.random() * 100,
  delay: Math.random() * 0.6,
  duration: 1.2 + Math.random() * 1.2,
  size: 6 + Math.random() * 8,
  rotate: Math.random() * 360,
  isRect: Math.random() > 0.5,
}))

function Confetti() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(t)
  }, [])
  if (!visible) return null
  return (
    <div className="pointer-events-none" style={{ position: 'fixed', inset: 0, zIndex: 99999, overflow: 'hidden' }}>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {CONFETTI_PIECES.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.left}%`,
          top: '-20px',
          width: p.isRect ? `${p.size}px` : `${p.size * 0.7}px`,
          height: p.isRect ? `${p.size * 0.45}px` : `${p.size * 0.7}px`,
          borderRadius: p.isRect ? '2px' : '50%',
          background: p.color,
          animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
          transform: `rotate(${p.rotate}deg)`,
        }} />
      ))}
    </div>
  )
}

function applyDiscount(price, couponData) {
  if (!price || !couponData) return price
  const num = parseInt(price.replace(/[^0-9]/g, ''))
  if (!num) return price
  if (couponData.discount <= 100 && couponData.label.includes('%')) {
    const discounted = Math.round(num * (1 - couponData.discount / 100))
    return `₹${discounted}`
  }
  const discounted = Math.max(0, num - couponData.discount)
  return `₹${discounted}`
}

export default function BookingFlow({ service, onClose }) {
  const { user, addBooking } = useAuth()
  const { t } = useTheme()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedTech, setSelectedTech] = useState(null)
  const [address, setAddress] = useState('12, Sunset Residency, Lokhandwala, Mumbai 400053')
  const [bookingId] = useState('BK' + Math.floor(Math.random() * 9000000 + 1000000))
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  const dates = getDates()

  function applyCoupon() {
    const code = couponCode.trim().toUpperCase()
    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ code, ...VALID_COUPONS[code] })
      setCouponError('')
    } else {
      setCouponError(t.invalidCoupon)
      setAppliedCoupon(null)
    }
  }

  const finalPrice = appliedCoupon ? applyDiscount(service?.price, appliedCoupon) : service?.price

  // Step 1: Date & Time
  if (step === 1) return (
    <div className="fixed inset-0 z-[300] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <div>
            <div className="text-xs text-sky font-semibold uppercase tracking-wide">{t.step1}</div>
            <h2 className="font-bold text-gray-900 text-lg">{t.pickDateTime}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="px-6 pt-4">
          <button
            onClick={() => { setSelectedDate(dates[0]); setSelectedSlot('10:00 AM – 12:00 PM'); setStep(2) }}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl p-4 flex items-center gap-3 hover:from-orange-600 hover:to-amber-600 transition mb-5"
          >
            <span className="text-3xl">⚡</span>
            <div className="text-left">
              <div className="font-extrabold text-base">{t.needToday}</div>
              <div className="text-xs opacity-90 mt-0.5">{t.urgentDesc}</div>
            </div>
            <span className="ml-auto text-sm font-bold bg-white/20 px-2 py-1 rounded-lg">On Demand</span>
          </button>
        </div>

        <div className="px-6 pt-1 pb-2">
          <p className="text-sm font-semibold text-gray-700 mb-3">{t.pickDate}</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dates.map(d => (
              <button key={d.full} onClick={() => setSelectedDate(d)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border-2 transition ${
                  selectedDate?.full === d.full ? 'border-sky bg-sky/5 text-sky' : 'border-gray-200 text-gray-700 hover:border-sky/50'
                }`}>
                <span className="text-xs font-semibold">{d.label}</span>
                <span className="text-sm font-bold mt-0.5">{d.date}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pt-3 pb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">{t.selectSlot}</p>
          <div className="grid grid-cols-2 gap-2">
            {TIME_SLOTS.map(slot => {
              const full = slot.slots === 0
              const scarce = slot.slots === 1
              const isSelected = selectedSlot === slot.label
              return (
                <button key={slot.label}
                  disabled={full}
                  onClick={() => !full && setSelectedSlot(slot.label)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition relative ${
                    full ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                    : isSelected ? 'border-sky bg-sky/5 text-sky font-semibold'
                    : 'border-gray-200 text-gray-700 hover:border-sky/50'
                  }`}>
                  <div>{slot.label}</div>
                  {full && <div className="text-xs text-gray-400 font-normal mt-0.5">{t.fullyBooked}</div>}
                  {!full && scarce && <div className="text-xs text-orange-500 font-semibold mt-0.5">Only 1 slot left!</div>}
                  {!full && slot.slots === 2 && <div className="text-xs text-amber-500 font-semibold mt-0.5">2 slots left</div>}
                </button>
              )
            })}
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            disabled={!selectedDate || !selectedSlot}
            onClick={() => setStep(2)}
            className={`w-full py-4 rounded-xl font-bold text-white transition ${
              selectedDate && selectedSlot ? 'bg-sky hover:bg-sky/90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
            {t.continueBtn}
          </button>
        </div>
      </div>
    </div>
  )

  // Step 2: Technician selection
  if (step === 2) return (
    <div className="fixed inset-0 z-[300] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <div>
            <div className="text-xs text-sky font-semibold uppercase tracking-wide">{t.step2}</div>
            <h2 className="font-bold text-gray-900 text-lg">{t.chooseTech}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="px-6 py-4 bg-sky/5 border-b border-sky/10 text-sm text-gray-600">
          📅 {selectedDate?.label}, {selectedDate?.date} &nbsp;·&nbsp; 🕐 {selectedSlot}
        </div>

        <div className="px-6 py-4 space-y-3">
          {TECHNICIANS.map(tech => (
            <button key={tech.id} onClick={() => setSelectedTech(tech)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition ${
                selectedTech?.id === tech.id ? 'border-sky bg-sky/5' : 'border-gray-200 hover:border-sky/40'
              }`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-navy text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {tech.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900">{tech.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      tech.badge === 'Top Rated' ? 'bg-yellow-100 text-yellow-700' :
                      tech.badge === 'Expert' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>{tech.badge}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Stars rating={tech.rating} />
                    <span className="text-xs font-semibold text-gray-700 ml-1">{tech.rating}</span>
                    <span className="text-xs text-gray-400">({tech.jobs.toLocaleString()} jobs)</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{tech.specialization} · {tech.exp} experience</div>
                </div>
                {selectedTech?.id === tech.id && (
                  <div className="w-6 h-6 rounded-full bg-sky flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:border-gray-300 transition">← Back</button>
          <button disabled={!selectedTech} onClick={() => setStep(3)}
            className={`flex-1 py-4 rounded-xl font-bold text-white transition ${
              selectedTech ? 'bg-sky hover:bg-sky/90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>{t.continueBtn}</button>
        </div>
      </div>
    </div>
  )

  // Step 3: Confirm booking
  if (step === 3) return (
    <div className="fixed inset-0 z-[300] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <div>
            <div className="text-xs text-sky font-semibold uppercase tracking-wide">{t.step3}</div>
            <h2 className="font-bold text-gray-900 text-lg">{t.confirmBooking}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">×</button>
        </div>

        {/* Coupon strip — shown right at the top of step 3 */}
        <div className="px-6 pt-4">
          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-green-50 border-2 border-green-300 rounded-xl px-4 py-3 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <div className="text-xs font-bold text-green-700">{appliedCoupon.code}</div>
                  <div className="text-xs text-green-600">{appliedCoupon.label}</div>
                </div>
              </div>
              <button onClick={() => { setAppliedCoupon(null); setCouponCode('') }} className="text-xs text-red-400 font-semibold">Remove</button>
            </div>
          ) : (
            <div className="flex gap-2 mb-1">
              <input
                type="text"
                value={couponCode}
                onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError('') }}
                placeholder={t.couponPlaceholder}
                className="flex-1 border-2 border-dashed border-sky/40 bg-sky/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky font-mono tracking-wider"
              />
              <button onClick={applyCoupon} disabled={!couponCode.trim()}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${couponCode.trim() ? 'bg-sky text-white hover:bg-sky/90' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                {t.applyBtn}
              </button>
            </div>
          )}
          {couponError && <p className="text-xs text-red-500 mb-2">{couponError}</p>}
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Service summary */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <img src={service?.img} alt={service?.name} className="w-12 h-12 object-contain" />
              <div>
                <div className="font-bold text-gray-900 text-sm">{service?.name}</div>
                <div className="text-sky font-semibold text-sm">{service?.price}</div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Date & Time</span>
                <span className="font-semibold text-gray-800">{selectedDate?.date} · {selectedSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Technician</span>
                <span className="font-semibold text-gray-800">{selectedTech?.name} ⭐ {selectedTech?.rating}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">{t.serviceAddress}</p>
            <div className="border-2 border-gray-200 rounded-xl p-4 text-sm text-gray-700 flex justify-between items-start">
              <span>{address}</span>
              <button className="text-sky text-xs font-semibold ml-2 flex-shrink-0">Change</button>
            </div>
          </div>

          {/* Price summary */}
          <div className="bg-navy/5 rounded-2xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>{t.serviceCharge}</span><span>{service?.price}</span></div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount ({appliedCoupon.code})</span>
                <span>– saved!</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600"><span>{t.visitFee}</span><span className="text-green-600 font-semibold">{t.free}</span></div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>{t.total}</span>
              <span className={appliedCoupon ? 'text-green-600' : ''}>{finalPrice}</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={() => setStep(2)} className="flex-1 py-4 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:border-gray-300 transition">← Back</button>
          <button onClick={() => {
            addBooking({
              id: bookingId,
              service: service?.name,
              appliance: service?.category || 'Appliance',
              date: selectedDate?.date ? `${selectedDate.label === 'Today' ? 'Today' : selectedDate.label}, ${selectedDate.date}` : '',
              time: selectedSlot,
              address,
              status: 'upcoming',
              price: finalPrice || service?.price,
              img: service?.img,
              tech: { name: selectedTech?.name, rating: selectedTech?.rating, jobs: selectedTech?.jobs, phone: '+91 98200 00000' },
              createdAt: new Date().toISOString(),
            })
            setStep(4)
          }} className="flex-1 py-4 rounded-xl font-bold text-white bg-sky hover:bg-sky/90 transition">{t.confirmBtn}</button>
        </div>
      </div>
    </div>
  )

  // Step 4: Confirmed (with confetti!)
  return (
    <div className="fixed inset-0 z-[300] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] relative">
        <Confetti />
        <div className="relative" style={{ zIndex: 2 }}>
          <div className="px-6 pt-8 pb-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">{t.bookingConfirmed}</h2>
            <p className="text-gray-500 text-sm">{t.techArrival}</p>
            <div className="mt-3 bg-gray-50 rounded-xl px-4 py-2 inline-block">
              <span className="text-xs text-gray-500">{t.bookingId}</span>
              <div className="font-bold text-navy text-sm">{bookingId}</div>
            </div>
          </div>

          <div className="px-6 pb-4 space-y-2 text-sm">
            <div className="bg-sky/5 rounded-xl p-4 space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-semibold">{service?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-semibold">{selectedDate?.date}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-semibold">{selectedSlot}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Technician</span><span className="font-semibold">{selectedTech?.name}</span></div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Amount</span>
                  <span className="font-bold">{finalPrice} <span className="text-xs line-through text-gray-400">{service?.price}</span></span>
                </div>
              )}
            </div>
          </div>

          {/* RCP Upsell */}
          <div className="mx-6 mb-4 bg-gradient-to-r from-navy to-sky rounded-2xl p-4 text-white">
            <div className="text-xs font-semibold opacity-80 mb-1">💡 Protect your appliance</div>
            <div className="font-bold text-sm mb-1">Add resQ Care Plan — save up to 80%</div>
            <p className="text-xs opacity-80 mb-3">Cover all future repairs with one plan. Customers add it most right after a service.</p>
            <button onClick={() => { onClose(); router.push('/care-plan') }}
              className="bg-white text-navy text-xs font-bold px-4 py-2 rounded-lg hover:bg-sky-light transition">
              View Plans →
            </button>
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <button onClick={() => { onClose(); router.push('/my-bookings') }}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 text-sm hover:border-gray-300 transition">
              My Bookings
            </button>
            <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-sky text-white font-bold text-sm hover:bg-sky/90 transition">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
