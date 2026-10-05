'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const STEPS = [
  {
    icon: '📱',
    title: 'Welcome to resQ!',
    desc: 'Your trusted expert for complete home appliance care. Book services, track technicians, and manage warranties — all in one place.',
    cta: 'Get started →',
    bg: 'from-navy to-sky',
  },
  {
    icon: '🔧',
    title: 'Book a service in 60 seconds',
    desc: 'Pick your appliance, choose a date and slot, select a verified technician, and confirm. We\'ll handle the rest.',
    cta: 'Next →',
    bg: 'from-sky to-blue-400',
  },
  {
    icon: '📍',
    title: 'Track your technician live',
    desc: 'Once your technician is on the way, track them live on the map with real-time ETA updates.',
    cta: 'Explore the app →',
    bg: 'from-blue-500 to-navy',
  },
]

export default function Onboarding() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!user) return
    try {
      const done = localStorage.getItem('resq_onboarded')
      if (!done) setShow(true)
    } catch {}
  }, [user])

  function finish() {
    try { localStorage.setItem('resq_onboarded', '1') } catch {}
    setShow(false)
  }

  function next() {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else finish()
  }

  if (!show) return null

  const s = STEPS[step]

  return (
    <div className="fixed inset-0 z-[500] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
        {/* Coloured hero */}
        <div className={`bg-gradient-to-br ${s.bg} px-8 py-10 text-center`}>
          <div className="text-6xl mb-4">{s.icon}</div>
          <h2 className="text-white font-extrabold text-xl leading-tight">{s.title}</h2>
        </div>

        {/* Body */}
        <div className="px-8 py-6 text-center">
          <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 my-5">
            {STEPS.map((_, i) => (
              <div key={i} className={`rounded-full transition-all duration-300 ${i === step ? 'w-6 h-2 bg-sky' : 'w-2 h-2 bg-gray-200'}`} />
            ))}
          </div>

          <button onClick={next}
            className="w-full py-4 bg-sky text-white font-bold rounded-2xl hover:bg-sky/90 transition text-sm">
            {s.cta}
          </button>
          <button onClick={finish} className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition">
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
