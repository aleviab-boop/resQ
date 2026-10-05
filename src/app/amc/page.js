'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const PLANS = [
  {
    id: 'silver',
    name: 'Silver',
    price: 1499,
    period: 'year',
    color: 'from-gray-400 to-gray-600',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-200',
    devices: 1,
    services: 2,
    features: [
      '2 scheduled services/year',
      'Free labour on all visits',
      'Priority booking (24hr)',
      '30-day service warranty',
      'Genuine spare parts',
    ],
    notIncluded: ['Parts cost covered', 'Unlimited emergency calls', '80% buyback guarantee'],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 2799,
    period: 'year',
    color: 'from-yellow-400 to-amber-500',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-300',
    devices: 1,
    services: 4,
    popular: true,
    features: [
      '4 scheduled services/year',
      'Free labour on all visits',
      'Parts cost up to ₹2,000 covered',
      'Priority booking (4hr)',
      '60-day service warranty',
      'Unlimited emergency calls',
      'Genuine spare parts',
    ],
    notIncluded: ['80% buyback guarantee'],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 4999,
    period: 'year',
    color: 'from-sky to-navy',
    textColor: 'text-navy',
    borderColor: 'border-sky',
    devices: 2,
    services: 6,
    features: [
      '6 scheduled services/year',
      'Free labour on all visits',
      'All parts cost covered',
      'Priority booking (2hr)',
      '90-day service warranty',
      'Unlimited emergency calls',
      'Genuine spare parts',
      '80% buyback guarantee',
      'Covers 2 appliances',
    ],
    notIncluded: [],
  },
]

const SCHEDULE_MONTHS = [
  { month: 'Jan', service: 'Pre-summer check' },
  { month: 'Mar', service: 'AC deep clean' },
  { month: 'Jun', service: 'Monsoon prep' },
  { month: 'Oct', service: 'Post-monsoon service' },
]

export default function AMCPage() {
  const [selected, setSelected] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [paid, setPaid] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleSelect(plan) {
    setSelected(plan)
    setPaid(false)
    setShowConfirm(true)
  }

  function handlePay() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setPaid(true)
    }, 1500)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-block bg-sky/10 text-sky text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">Annual Maintenance Contract</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">One plan. Zero worries.</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Get scheduled servicing, priority technician access, and full repair coverage — all under one annual plan. Trusted by 50L+ Reliance customers.</p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {PLANS.map(plan => (
          <div key={plan.id} className={`relative bg-white rounded-3xl border-2 shadow-card overflow-hidden flex flex-col ${plan.popular ? 'border-amber-400 shadow-amber-100 shadow-xl scale-[1.02]' : plan.borderColor}`}>
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-amber-400 text-white text-xs font-extrabold text-center py-1.5 uppercase tracking-wider">
                Most Popular
              </div>
            )}
            <div className={`bg-gradient-to-br ${plan.color} px-6 py-6 ${plan.popular ? 'pt-9' : ''}`}>
              <div className="text-white font-extrabold text-xl">{plan.name}</div>
              <div className="text-white/80 text-sm mt-0.5">Up to {plan.devices} appliance{plan.devices > 1 ? 's' : ''}</div>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-extrabold text-white">₹{plan.price.toLocaleString()}</span>
                <span className="text-white/70 text-sm mb-1">/{plan.period}</span>
              </div>
              <div className="text-white/70 text-xs mt-1">{plan.services} scheduled services included</div>
            </div>
            <div className="px-6 py-5 flex-1">
              <ul className="space-y-2.5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <span className="text-green-500 font-bold flex-shrink-0">✓</span>{f}
                  </li>
                ))}
                {plan.notIncluded.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400 line-through">
                    <span className="text-gray-300 flex-shrink-0">✗</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 pb-6">
              <button onClick={() => handleSelect(plan)}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition ${plan.popular ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-navy text-white hover:bg-navy/90'}`}>
                Choose {plan.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service calendar */}
      <div className="bg-white rounded-3xl shadow-card p-6 mb-8">
        <h2 className="font-extrabold text-gray-900 text-lg mb-1">Your service calendar</h2>
        <p className="text-sm text-gray-500 mb-5">Gold plan — 4 scheduled visits per year, automatically booked for you.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SCHEDULE_MONTHS.map((s, i) => (
            <div key={i} className="bg-sky/5 border border-sky/20 rounded-2xl p-4 text-center">
              <div className="text-sky font-extrabold text-lg">{s.month}</div>
              <div className="text-xs text-gray-500 mt-1 leading-snug">{s.service}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[['50L+', 'Customers protected'],['200+', 'Cities covered'],['15 min', 'Avg response time'],['4.8★', 'Customer rating']].map(([v, l]) => (
          <div key={l} className="bg-white rounded-2xl shadow-card p-4 text-center">
            <div className="text-2xl font-extrabold text-navy">{v}</div>
            <div className="text-xs text-gray-500 mt-0.5">{l}</div>
          </div>
        ))}
      </div>

      {/* Confirm / Success modal */}
      {showConfirm && selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => { if (!loading) setShowConfirm(false) }}>
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>

            {!paid ? (
              <>
                <h3 className="font-extrabold text-xl text-gray-900 mb-1">Confirm {selected.name} Plan</h3>
                <p className="text-gray-500 text-sm mb-5">Starting from today, valid for 1 year.</p>
                <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Plan price</span>
                    <span className="font-semibold">₹{selected.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-semibold">₹{Math.round(selected.price * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-extrabold text-navy">
                    <span>Total</span>
                    <span>₹{Math.round(selected.price * 1.18).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={handlePay} disabled={loading}
                  className="w-full py-4 bg-sky text-white font-bold rounded-2xl hover:bg-sky/90 transition mb-3 flex items-center justify-center gap-2 disabled:opacity-70">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Processing…
                    </>
                  ) : 'Pay & Activate Plan'}
                </button>
                <button onClick={() => setShowConfirm(false)} className="w-full py-3 text-gray-500 text-sm font-semibold">Cancel</button>
              </>
            ) : (
              <>
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-1">{selected.name} Plan Activated!</h3>
                  <p className="text-gray-500 text-sm mb-5">Your plan is active. Valid till {new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>
                  <div className="bg-sky/5 rounded-2xl p-4 text-left mb-5 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Plan</span><span className="font-bold text-navy">{selected.name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Services/year</span><span className="font-semibold">{selected.services} visits</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Amount paid</span><span className="font-semibold">₹{Math.round(selected.price * 1.18).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Plan ID</span><span className="font-mono text-xs font-semibold">AMC{Math.floor(Math.random()*900000+100000)}</span></div>
                  </div>
                  <button onClick={() => { setShowConfirm(false); router.push('/') }}
                    className="w-full py-4 bg-navy text-white font-bold rounded-2xl hover:bg-navy/90 transition">
                    Back to Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
