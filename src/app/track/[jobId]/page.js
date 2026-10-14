'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  JOBS,
  CASES,
  TECHNICIANS,
  CUSTOMERS,
  PRODUCTS,
  getTechnician,
  getCase,
  getCustomer,
  getProduct,
} from '@/lib/platformData'

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function formatDateWindow(dateStr, slot) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  const label = isToday
    ? 'Today'
    : d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })
  return `${label}, ${slot}`
}

function formatVisitDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// ─── STEP DERIVATION ─────────────────────────────────────────────────────────
// Steps: 0=Order, 1=Confirmed, 2=On the way, 3=At your home, 4=Done

function getActiveStep(job) {
  if (!job) return 0
  const { status, visits } = job
  if (status === 'completed') return 4
  if (status === 'in-progress') {
    const latestVisit = visits?.[visits.length - 1]
    return latestVisit?.arrivedAt ? 3 : 2
  }
  if (status === 'scheduled') return 1
  return 0
}

const STEPS = ['Order', 'Confirmed', 'On the way', 'At your home', 'Done']

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function StepBar({ activeStep }) {
  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-start justify-between relative">
        {STEPS.map((label, i) => {
          const done = i < activeStep
          const active = i === activeStep
          const future = i > activeStep
          return (
            <div key={label} className="flex flex-col items-center flex-1 relative">
              {/* Connector line left */}
              {i > 0 && (
                <div
                  className="absolute top-[11px] right-1/2 w-full h-0.5 -translate-y-0 z-0"
                  style={{
                    backgroundColor: done || active ? '#00a1e1' : '#d1d5db',
                    right: '50%',
                    left: '-50%',
                  }}
                />
              )}
              {/* Circle */}
              <div
                className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  done
                    ? 'bg-sky-500 border-sky-500'
                    : active
                    ? 'bg-sky-500 border-sky-500 animate-pulse'
                    : 'bg-white border-gray-300'
                }`}
              >
                {done && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {active && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              {/* Label */}
              <div
                className={`mt-1.5 text-[10px] font-medium text-center leading-tight ${
                  done || active ? 'text-sky-700' : 'text-gray-400'
                }`}
                style={{ fontSize: '9px', maxWidth: '48px' }}
              >
                {label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TechnicianCard({ technician, activeStep }) {
  if (!technician) return null
  const onTheWay = activeStep === 2

  return (
    <div className="px-4 pb-4 pt-2 border-t border-gray-100">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Your technician</div>
      <div className="flex items-center gap-3 mb-2">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: '#13347b' }}
        >
          {initials(technician.name)}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 text-sm">{technician.name}</div>
          <div className="text-[11px] text-gray-500">
            ⭐ {technician.rating} &nbsp;·&nbsp; {technician.badge}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {technician.skills.slice(0, 2).map((s) => (
              <span key={s} className="text-[9px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-full font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {onTheWay && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl px-3 py-2.5 mt-1">
          <div className="flex items-center gap-2">
            {/* Animated dot */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
            <div>
              <div className="text-[12px] font-semibold text-sky-800">
                {technician.name.split(' ')[0]} is on his way — tracking is simulated
              </div>
              <div className="text-[11px] text-sky-600 mt-0.5">
                Estimated arrival: <span className="font-semibold">10–15 minutes</span>{' '}
                <span className="text-sky-400 font-normal">(Simulated)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function JobDetails({ job, caseData, customer, product }) {
  const TYPE_COLORS = {
    installation: 'bg-purple-100 text-purple-700',
    repair: 'bg-orange-100 text-orange-700',
    service: 'bg-blue-100 text-blue-700',
    maintenance: 'bg-teal-100 text-teal-700',
    diagnosis: 'bg-gray-100 text-gray-700',
    recovery: 'bg-pink-100 text-pink-700',
  }
  const typeBadge = TYPE_COLORS[caseData?.type] || 'bg-gray-100 text-gray-600'

  return (
    <div className="px-4 pb-4 pt-3 border-t border-gray-100">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Job details</div>
      <div className="space-y-2.5">
        {product && (
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] text-gray-500 flex-shrink-0">Product</span>
            <span className="text-[12px] font-medium text-gray-800 text-right">
              {product.brand} {product.model}
              <span className="ml-1 text-[10px] text-gray-400 font-normal">({product.type})</span>
            </span>
          </div>
        )}
        {customer && (
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] text-gray-500 flex-shrink-0">Address</span>
            <span className="text-[12px] font-medium text-gray-800 text-right leading-snug max-w-[60%]">
              {customer.address}, {customer.city}
            </span>
          </div>
        )}
        {job && (
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] text-gray-500 flex-shrink-0">Scheduled</span>
            <span className="text-[12px] font-medium text-gray-800 text-right">
              {formatDateWindow(job.scheduledDate, job.timeSlot)}
            </span>
          </div>
        )}
        {caseData?.type && (
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] text-gray-500 flex-shrink-0">Type</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${typeBadge}`}>
              {caseData.type}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function VisitTimeline({ visits }) {
  if (!visits || visits.length === 0) {
    return (
      <div className="px-4 pb-4 pt-3 border-t border-gray-100">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">What's happening</div>
        <p className="text-[12px] text-gray-400 italic">
          Your technician will update this when they arrive.
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 pb-4 pt-3 border-t border-gray-100">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">What's happening</div>
      <div className="space-y-3">
        {visits.map((v) => {
          const tech = getTechnician(v.techId)
          return (
            <div key={v.visitNo} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: v.status === 'completed' ? '#00a1e1' : '#f59e0b' }}
                />
                <div className="flex-1 w-px bg-gray-200 mt-1" />
              </div>
              <div className="pb-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-gray-800">Visit {v.visitNo}</span>
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                      v.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {v.status}
                  </span>
                  <span className="text-[10px] text-gray-400">{formatVisitDate(v.date)}</span>
                  {v.arrivedAt && (
                    <span className="text-[10px] text-gray-400">arrived {v.arrivedAt}</span>
                  )}
                </div>
                {tech && (
                  <div className="text-[11px] text-gray-500 mt-0.5">{tech.name}</div>
                )}
                {v.diagnosis && (
                  <div className="text-[11px] text-gray-700 mt-1 bg-gray-50 rounded-lg px-2 py-1.5 leading-snug">
                    {v.diagnosis}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CustomerActions({ customerName, jobId }) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="px-4 pb-4 pt-3 border-t border-gray-100">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Your actions</div>
      <div className="space-y-2.5">
        <button
          onClick={() => setConfirmed(true)}
          className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
            confirmed
              ? 'bg-green-500 text-white cursor-default'
              : 'text-white hover:opacity-90 active:scale-[0.98]'
          }`}
          style={confirmed ? {} : { backgroundColor: '#00a1e1' }}
          disabled={confirmed}
        >
          {confirmed ? '✓ Confirmed' : 'Confirm your visit'}
        </button>

        <button className="w-full py-2.5 rounded-xl font-medium text-sm text-gray-500 hover:text-gray-700 transition-colors">
          I need to reschedule
        </button>

        <a
          href="https://wa.me/918002670999"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-green-500 hover:bg-green-600 transition-colors active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat with resQ
        </a>
      </div>
    </div>
  )
}

function FeedbackSection({ jobId }) {
  const [rating, setRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="px-4 pb-4 pt-3 border-t border-gray-100">
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
          <div className="text-2xl mb-1">🙏</div>
          <p className="text-[13px] font-semibold text-green-800">Thank you!</p>
          <p className="text-[11px] text-green-700 mt-0.5">Your feedback helps us serve you better.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pb-4 pt-3 border-t border-gray-100">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Rate your experience</div>
      <p className="text-[12px] text-gray-600 mb-2">How was your experience?</p>

      {/* Stars */}
      <div className="flex gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="text-2xl transition-transform hover:scale-110 active:scale-95"
          >
            {star <= rating ? '⭐' : '☆'}
          </button>
        ))}
      </div>

      <textarea
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        placeholder="Tell us what we could do better…"
        rows={3}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400 resize-none"
      />

      <button
        onClick={() => rating > 0 && setSubmitted(true)}
        disabled={rating === 0}
        className={`mt-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
          rating > 0
            ? 'text-white hover:opacity-90 active:scale-[0.98]'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        style={rating > 0 ? { backgroundColor: '#00a1e1' } : {}}
      >
        Submit feedback
      </button>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function TrackJobPage() {
  const params = useParams()
  const jobId = params?.jobId

  const job = JOBS.find((j) => j.id === jobId)
  const caseData = job ? getCase(job.caseId) : null
  const technician = job ? getTechnician(job.technicianId) : null
  const customer = caseData ? getCustomer(caseData.customerId) : null
  const product = caseData ? getProduct(caseData.productId) : null

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-sm w-full text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Tracking link not valid</h2>
          <p className="text-[13px] text-gray-500">
            This link may have expired or the job ID is incorrect. Please contact resQ support.
          </p>
          <a
            href="https://wa.me/918002670999"
            className="mt-4 inline-block text-sm font-semibold text-green-600 hover:underline"
          >
            Chat with resQ on WhatsApp
          </a>
        </div>
      </div>
    )
  }

  const activeStep = getActiveStep(job)
  const allVisits = job.visits || []
  const isCompleted = job.status === 'completed'

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-2">
      <div className="max-w-sm mx-auto space-y-0">

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div
          className="rounded-t-2xl px-5 pt-6 pb-5"
          style={{ background: 'linear-gradient(135deg, #00a1e1 0%, #0081b4 100%)' }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-3xl font-extrabold text-white tracking-tight">resQ</span>
            <span className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">
              Part of Reliance Retail
            </span>
          </div>
          <p className="text-white/80 text-sm font-medium">Service Tracking</p>
          <p className="text-white/50 text-[11px] mt-1 font-mono">Job #{job.id}</p>
        </div>

        {/* ── MAIN CARD ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-b-2xl shadow-lg overflow-hidden">

          {/* Section 1: Progress stepper */}
          <StepBar activeStep={activeStep} />

          {/* Section 2: Technician */}
          <TechnicianCard technician={technician} activeStep={activeStep} />

          {/* Section 3: Job details */}
          <JobDetails
            job={job}
            caseData={caseData}
            customer={customer}
            product={product}
          />

          {/* Section 4: Visit timeline */}
          <VisitTimeline visits={allVisits} />

          {/* Section 5: Customer actions */}
          <CustomerActions customerName={customer?.name} jobId={job.id} />

          {/* Section 6: Feedback (only if completed) */}
          {isCompleted && <FeedbackSection jobId={job.id} />}
        </div>

        {/* ── FOOTER ─────────────────────────────────────────────────────── */}
        <p className="text-center text-[10px] text-gray-400 mt-4 pb-6">
          Powered by resQ &middot; Part of Reliance Retail
        </p>
      </div>
    </div>
  )
}
