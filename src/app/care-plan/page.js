'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const PLANS = [
  { appliance: 'Air Conditioner', icon: '❄️', price: 2999, duration: '1 year', coverage: '1–5 Ton Split & Window AC', popular: true,
    includes: ['All functional parts', 'Gas refilling (1x)', 'Free pickup & drop', '80% buyback', 'Unlimited repairs'] },
  { appliance: 'Refrigerator', icon: '🧊', price: 1999, duration: '1 year', coverage: 'Single & Double Door',
    includes: ['Compressor coverage', 'Electrical failures', 'Free pickup & drop', '80% buyback', 'PCB replacement'] },
  { appliance: 'Washing Machine', icon: '🫧', price: 1799, duration: '1 year', coverage: 'Front & Top Load',
    includes: ['Motor & drum coverage', 'PCB failures', 'Free pickup & drop', '80% buyback', 'Unlimited repairs'] },
  { appliance: 'LED TV', icon: '📺', price: 1499, duration: '1 year', coverage: '24–75 inch all brands',
    includes: ['Panel coverage', 'Motherboard failures', 'Free pickup & drop', '80% buyback', 'On-site repair'] },
  { appliance: 'Laptop', icon: '💻', price: 2499, duration: '1 year', coverage: 'Any brand, any model',
    includes: ['Motherboard coverage', 'Screen replacement', 'Free pickup & drop', '80% buyback', 'Data backup service'] },
  { appliance: 'Water Purifier', icon: '💧', price: 999, duration: '1 year', coverage: 'RO, UV & UF purifiers',
    includes: ['Membrane & filter', 'Pump & motor', 'Free pickup & drop', '80% buyback', 'Annual service'] },
]

const STEPS = [
  { step: '01', icon: '🛒', title: 'Buy the Plan', desc: 'Select your appliance, enter your invoice details and purchase the resQ Care Plan online.' },
  { step: '02', icon: '📝', title: 'Register Device', desc: 'Register your appliance details — brand, model, serial number and purchase date.' },
  { step: '03', icon: '📞', title: 'Raise a Claim', desc: 'When your appliance needs repair, call us or book online. A technician visits within 24 hours.' },
  { step: '04', icon: '✅', title: 'Get it Fixed', desc: 'We repair or replace the appliance. If irreparable, you get 80% of the original value back.' },
]

const COVERED = [
  'All functional parts & components',
  'Electrical & mechanical failures',
  'Manufacturing defects post-warranty',
  'PCB & motherboard failures',
  'Compressor & motor failures',
  'Free pickup & drop (where applicable)',
  '80% buyback on irreparable damage',
  'Unlimited service calls',
]

const NOT_COVERED = [
  'Physical / accidental damage',
  'Cosmetic damage (scratches, dents)',
  'Damage due to misuse or negligence',
  'Theft or loss',
  'Consumables (batteries, bulbs)',
  'Pre-existing conditions at time of purchase',
]

const FAQS = [
  { q: 'When does the Care Plan start?', a: 'The resQ Care Plan starts immediately after the brand warranty ends — ensuring zero gap in coverage.' },
  { q: 'Can I buy a Care Plan for an old appliance?', a: 'The Care Plan must be purchased within 12 months of the appliance purchase date. It is not available for appliances older than 12 months at the time of purchase.' },
  { q: 'Is the Care Plan transferable?', a: 'Yes. If you sell your appliance, the Care Plan can be transferred to the new owner with a small transfer fee of ₹199.' },
  { q: 'How do I raise a claim?', a: 'Call 1800-889-1977, use the resQ app, or book online. A technician will visit within 24 hours of your request.' },
  { q: 'What is the 80% buyback guarantee?', a: 'If your appliance is declared beyond repair (BER), resQ will pay you 80% of the original purchase price, helping you upgrade to a new appliance.' },
]

export default function CarePlanPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selected, setSelected] = useState(null)
  const [purchaseStep, setPurchaseStep] = useState(null) // null | 'details' | 'confirm' | 'success'
  const [deviceForm, setDeviceForm] = useState({ brand: '', model: '', serial: '', invoice: '' })

  function handleBuy(plan) {
    if (!user) { router.push('/login'); return }
    setSelected(plan)
    setPurchaseStep('details')
  }

  function handleConfirm(e) {
    e.preventDefault()
    setPurchaseStep('success')
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy via-[#1a4080] to-sky py-16 px-4 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Extended Warranty
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">resQ Care Plan (RCP)</h1>
          <p className="text-white/80 text-base leading-relaxed mb-8 max-w-2xl mx-auto">
            Protection beyond the brand warranty — covering all functional parts, electrical & mechanical failures, with an 80% buyback guarantee if your appliance is beyond repair.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {['₹999 onwards/year', 'Unlimited repairs', '365-day coverage', '80% Buyback'].map(t => (
              <div key={t} className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full">
                <span className="text-green-300 font-bold">✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative bg-white rounded-2xl shadow-card p-6 text-center">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="absolute top-4 right-4 text-xs font-bold text-gray-200">{s.step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-300 text-xl z-10">→</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Plans */}
        <section>
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-2">Choose your plan</h2>
          <p className="text-gray-500 text-sm text-center mb-8">Available for appliances purchased from Reliance Digital, JioMart, or reliancedigital.in</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLANS.map(p => (
              <div key={p.appliance}
                className={`bg-white rounded-2xl shadow-card border-2 flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover ${
                  p.popular ? 'border-sky' : 'border-transparent'
                }`}
              >
                {p.popular && (
                  <div className="bg-sky text-white text-xs font-bold text-center py-2 tracking-wide uppercase">
                    Most Popular
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{p.icon}</div>
                    <div>
                      <div className="font-bold text-gray-900">{p.appliance}</div>
                      <div className="text-xs text-gray-400">{p.coverage}</div>
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-navy mb-1">
                    ₹{p.price.toLocaleString('en-IN')}
                    <span className="text-sm font-normal text-gray-400">/{p.duration}</span>
                  </div>
                  <ul className="space-y-2 my-4 flex-1">
                    {p.includes.map(item => (
                      <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleBuy(p)}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                      p.popular
                        ? 'bg-sky text-white hover:bg-sky/90'
                        : 'bg-navy text-white hover:bg-navy/90'
                    }`}
                  >
                    Buy now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Covered / Not covered */}
        <section>
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">What's covered</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                Covered
              </h3>
              <ul className="space-y-2.5">
                {COVERED.map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-green-800">
                    <span className="text-green-500 flex-shrink-0">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-red-400 text-white rounded-full flex items-center justify-center text-xs font-bold">✕</span>
                Not covered
              </h3>
              <ul className="space-y-2.5">
                {NOT_COVERED.map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-red-700">
                    <span className="text-red-400 flex-shrink-0">✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">Frequently asked questions</h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map(item => (
              <details key={item.q} className="bg-white rounded-2xl shadow-card px-6 py-4 group">
                <summary className="font-semibold text-gray-800 text-sm cursor-pointer list-none flex justify-between items-center gap-4">
                  {item.q}
                  <span className="text-sky flex-shrink-0 group-open:rotate-180 transition-transform duration-200">▾</span>
                </summary>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-navy to-sky rounded-3xl p-10 text-white text-center">
          <h2 className="text-2xl font-extrabold mb-2">Protect your appliance today</h2>
          <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
            Plans starting at just ₹999/year. One-time payment, zero deductibles, unlimited claims.
          </p>
          <button
            onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' }) || window.scrollTo({top: 400, behavior: 'smooth'})}
            className="inline-block bg-white text-navy font-bold px-8 py-4 rounded-xl text-sm hover:bg-gray-100 transition"
          >
            View all plans ↑
          </button>
        </section>

      </div>

      {/* Purchase Modal */}
      {purchaseStep && selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setPurchaseStep(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

            {purchaseStep === 'details' && (
              <form onSubmit={handleConfirm}>
                <div className="bg-gradient-to-br from-navy to-sky px-6 pt-6 pb-8 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-white/60 mb-1">resQ Care Plan</div>
                      <div className="text-xl font-extrabold">{selected.appliance}</div>
                      <div className="text-white/70 text-sm mt-1">₹{selected.price.toLocaleString('en-IN')} / year</div>
                    </div>
                    <button type="button" onClick={() => setPurchaseStep(null)} className="text-white/60 hover:text-white text-2xl leading-none">×</button>
                  </div>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <h3 className="font-bold text-gray-900">Enter device details</h3>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Brand</label>
                    <input required value={deviceForm.brand} onChange={e => setDeviceForm(f => ({...f, brand: e.target.value}))}
                      placeholder="e.g. Samsung, LG, Daikin"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Model number</label>
                    <input required value={deviceForm.model} onChange={e => setDeviceForm(f => ({...f, model: e.target.value}))}
                      placeholder="e.g. AR18AY4ZAUR"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Serial number</label>
                    <input required value={deviceForm.serial} onChange={e => setDeviceForm(f => ({...f, serial: e.target.value}))}
                      placeholder="Found on the back of the appliance"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Invoice number</label>
                    <input required value={deviceForm.invoice} onChange={e => setDeviceForm(f => ({...f, invoice: e.target.value}))}
                      placeholder="From Reliance Digital / JioMart receipt"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky" />
                  </div>
                  <button type="submit"
                    className="w-full bg-navy text-white font-bold py-4 rounded-xl hover:bg-navy/90 transition">
                    Continue to Payment · ₹{selected.price.toLocaleString('en-IN')}
                  </button>
                </div>
              </form>
            )}

            {purchaseStep === 'success' && (
              <div className="p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto">🛡️</div>
                <h3 className="text-xl font-extrabold text-gray-900">Plan Activated!</h3>
                <p className="text-gray-500 text-sm">Your resQ Care Plan for <b>{selected.appliance}</b> is now active. A confirmation has been sent to your registered number.</p>
                <div className="bg-gray-50 rounded-xl p-4 text-left text-xs space-y-1.5">
                  <div className="flex justify-between"><span className="text-gray-400">Plan</span><span className="font-semibold">{selected.appliance} Care Plan</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Valid until</span><span className="font-semibold">30 Sep 2027</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Amount paid</span><span className="font-semibold text-navy">₹{selected.price.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Plan ID</span><span className="font-semibold">RCP{Math.floor(Math.random()*90000)+10000}</span></div>
                </div>
                <button onClick={() => { setPurchaseStep(null); setSelected(null) }}
                  className="w-full bg-navy text-white font-bold py-4 rounded-xl hover:bg-navy/90 transition">
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
