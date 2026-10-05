'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const ISSUE_TYPES = [
  { icon: '❄️', label: 'Not cooling / heating' },
  { icon: '💧', label: 'Water leakage' },
  { icon: '🔊', label: 'Unusual noise' },
  { icon: '⚡', label: 'Not turning on' },
  { icon: '🌡️', label: 'Temperature issues' },
  { icon: '📡', label: 'Display / remote issue' },
  { icon: '🔧', label: 'Physical damage' },
  { icon: '❓', label: 'Other issue' },
]

const DEVICES = [
  'Daikin FTKF35TV (AC)', 'LG GN-H702HLHU (Refrigerator)', 'Samsung WW80T (Washing Machine)'
]

export default function ClaimPage() {
  const { user, hydrated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1)
  const [device, setDevice] = useState('')
  const [issue, setIssue] = useState('')
  const [desc, setDesc] = useState('')
  const [photo, setPhoto] = useState(null)
  const [claimId] = useState('CL' + Math.floor(Math.random() * 9000000 + 1000000))

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { if (hydrated && !user) router.push('/login') }, [mounted, user, router])
  if (!hydrated || !user) return null

  if (step === 3) return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">✅</div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Claim Submitted!</h2>
      <p className="text-gray-500 mb-2">Your claim has been registered successfully.</p>
      <div className="bg-gray-50 rounded-2xl p-4 mb-6 inline-block">
        <div className="text-xs text-gray-400">Claim ID</div>
        <div className="text-xl font-extrabold text-navy">{claimId}</div>
      </div>
      <div className="bg-sky/10 rounded-2xl p-4 text-left mb-6">
        <div className="text-sm font-bold text-sky mb-2">What happens next?</div>
        <ol className="text-sm text-gray-600 space-y-1.5">
          <li>1. Our team reviews your claim within 4 hours</li>
          <li>2. A technician is assigned and contacts you</li>
          <li>3. Service is completed under your warranty / care plan</li>
        </ol>
      </div>
      <button onClick={() => router.push('/my-bookings')} className="w-full py-4 bg-navy text-white font-bold rounded-2xl hover:bg-navy/90 transition">
        Track Claim Status
      </button>
    </div>
  )

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => step > 1 ? setStep(s => s - 1) : router.back()} className="text-gray-400 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <div className="text-xs text-sky font-semibold uppercase tracking-wide">Step {step} of 2</div>
          <h1 className="font-extrabold text-gray-900 text-lg">{step === 1 ? 'What went wrong?' : 'Describe the issue'}</h1>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-sky rounded-full transition-all duration-500" style={{width: `${step * 50}%`}} />
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Select device</label>
            <select value={device} onChange={e => setDevice(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-sky">
              <option value="">Choose a device</option>
              {DEVICES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">What's the issue?</label>
            <div className="grid grid-cols-2 gap-2">
              {ISSUE_TYPES.map(t => (
                <button key={t.label} onClick={() => setIssue(t.label)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition ${issue === t.label ? 'border-sky bg-sky/5 text-sky' : 'border-gray-200 hover:border-sky/40 text-gray-700'}`}>
                  <span className="text-2xl">{t.icon}</span>
                  <span className="text-xs font-semibold leading-tight">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <button disabled={!device || !issue} onClick={() => setStep(2)}
            className={`w-full py-4 rounded-2xl font-bold text-white transition ${device && issue ? 'bg-sky hover:bg-sky/90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="bg-sky/5 border border-sky/20 rounded-2xl p-4 text-sm text-gray-600">
            <span className="font-semibold text-navy">{device}</span> · {issue}
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Describe the problem <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4}
              placeholder="E.g. The AC stopped cooling 2 days ago. It makes a clicking sound when starting..."
              className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-sky resize-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Add a photo <span className="text-gray-400 font-normal">(optional)</span></label>
            <label className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-sky/40 transition">
              {photo ? (
                <div className="text-center">
                  <div className="text-3xl mb-1">📷</div>
                  <div className="text-sm text-green-600 font-semibold">{photo}</div>
                </div>
              ) : (
                <>
                  <div className="text-3xl mb-2">📷</div>
                  <div className="text-sm text-gray-500">Tap to upload photo</div>
                  <div className="text-xs text-gray-400 mt-0.5">JPG, PNG up to 10MB</div>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={e => setPhoto(e.target.files[0]?.name || null)} />
            </label>
          </div>
          <button onClick={() => setStep(3)}
            className="w-full py-4 rounded-2xl font-bold text-white bg-sky hover:bg-sky/90 transition">
            Submit Claim
          </button>
        </div>
      )}
    </div>
  )
}
