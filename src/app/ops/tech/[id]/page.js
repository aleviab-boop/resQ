'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  TECHNICIANS, JOBS, CASES, CUSTOMERS, PRODUCTS, PARTS_INVENTORY,
  getJobsForCase, getCustomer, getCase, getTechnician,
} from '@/lib/platformData'

const SKY  = '#00a1e1'
const NAVY = '#13347b'

const STAGE_META = [
  { id: 1, label: 'Job Accepted'             },
  { id: 2, label: 'Travelling'               },
  { id: 3, label: 'On Site / Diagnosing'     },
  { id: 4, label: 'Parts Requested'          },
  { id: 5, label: 'Repair in Progress'       },
  { id: 6, label: 'Customer Confirmation'    },
  { id: 7, label: 'Done'                     },
]

const SIMULATED_OTP = '4872'

function formatClock(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s.toString().padStart(2, '0')}s`
}

// ─── Stepper indicator ───────────────────────────────────────────────────────
function Stepper({ current, skipStage4 }) {
  const stages = skipStage4 ? STAGE_META.filter(s => s.id !== 4) : STAGE_META
  return (
    <div className="flex items-center gap-0 mb-6 overflow-x-auto pb-1">
      {stages.map((s, i) => {
        const done    = s.id < current
        const active  = s.id === current
        const future  = s.id > current
        return (
          <div key={s.id} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                  ${done   ? 'bg-green-500 border-green-500 text-white'
                  : active ? 'text-white border-transparent'
                  : 'bg-white border-gray-300 text-gray-400'}`}
                style={active ? { background: SKY, borderColor: SKY } : {}}
              >
                {done ? '✓' : s.id}
              </div>
              <span className={`text-[10px] text-center leading-tight max-w-[56px]
                ${done ? 'text-green-600' : active ? 'font-semibold text-gray-800' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div className={`w-5 h-0.5 mb-4 shrink-0 mx-0.5 ${s.id < current ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Stage card wrapper ───────────────────────────────────────────────────────
function StageCard({ stageId, current, label, children, completedSummary }) {
  const done   = stageId < current
  const active = stageId === current
  const future = stageId > current
  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 flex items-center gap-3">
        <span className="text-green-500 text-xl shrink-0">✓</span>
        <div>
          <p className="text-xs font-bold text-green-700 uppercase tracking-wide">{label} — Done</p>
          {completedSummary && <p className="text-xs text-green-600 mt-0.5">{completedSummary}</p>}
        </div>
      </div>
    )
  }
  if (future) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 opacity-50">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">Upcoming</p>
      </div>
    )
  }
  return (
    <div className="rounded-2xl border-2 bg-white shadow-md overflow-hidden" style={{ borderColor: SKY }}>
      <div className="px-4 py-3 text-white text-sm font-bold flex items-center gap-2" style={{ background: SKY }}>
        <span className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">{stageId}</span>
        {label}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TechJobPage() {
  const { id } = useParams()

  const tech     = getTechnician(id)
  const job      = JOBS.find(j => j.technicianId === id) ?? null
  const caseData = job ? getCase(job.caseId) : null
  const customer = caseData ? getCustomer(caseData.customerId) : null
  const product  = caseData ? PRODUCTS.find(p => p.id === caseData.productId) : null

  // ── Stage state ──────────────────────────────────────────────────────────
  const [stage, setStage]           = useState(1)
  const [diagnosis, setDiagnosis]   = useState('')
  const [partsSelected, setPartsSelected] = useState([])  // [{...part, qty}]
  const [partSearch, setPartSearch] = useState('')
  const [labourNotes, setLabourNotes] = useState('')
  const [otpInput, setOtpInput]     = useState('')
  const [otpConfirmed, setOtpConfirmed] = useState(false)
  const [jobRating, setJobRating]   = useState('')
  const [completedAt, setCompletedAt] = useState(null)

  // ── Timers ───────────────────────────────────────────────────────────────
  const [travelSecs, setTravelSecs] = useState(0)
  const [repairSecs, setRepairSecs] = useState(0)

  useEffect(() => {
    if (stage !== 2) return
    const t = setInterval(() => setTravelSecs(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [stage])

  useEffect(() => {
    if (stage !== 5) return
    const t = setInterval(() => setRepairSecs(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [stage])

  // ── Parts logic ──────────────────────────────────────────────────────────
  const addPart = (part) => {
    if (partsSelected.find(p => p.id === part.id)) return
    setPartsSelected(prev => [...prev, { ...part, qty: 1 }])
  }

  const removePart = (partId) => {
    setPartsSelected(prev => prev.filter(p => p.id !== partId))
  }

  const updateQty = (partId, qty) => {
    setPartsSelected(prev => prev.map(p => p.id === partId ? { ...p, qty: Math.max(1, Number(qty)) } : p))
  }

  const filteredParts = PARTS_INVENTORY.filter(p =>
    !partSearch.trim() ||
    p.name.toLowerCase().includes(partSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(partSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(partSearch.toLowerCase())
  )

  // ── Quote calculation ─────────────────────────────────────────────────────
  const LABOUR_BASE   = 299
  const LABOUR_EXTRA  = 100
  const labourTotal   = LABOUR_BASE + partsSelected.length * LABOUR_EXTRA
  const partsTotal    = partsSelected.reduce((sum, p) => sum + p.price * p.qty, 0)
  const grandTotal    = labourTotal + partsTotal

  // ── No-job / no-tech fallback ─────────────────────────────────────────────
  if (!tech || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-lg font-bold text-gray-700 mb-1">No active job assigned</h2>
          <p className="text-sm text-gray-400 mb-1">
            {tech ? `Technician: ${tech.name}` : `Tech ID: ${id}`}
          </p>
          <p className="text-xs text-gray-400 mb-5">There are no jobs linked to this technician right now.</p>
          <Link href="/ops/dispatch" className="inline-block px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: SKY }}>
            Back to Dispatch
          </Link>
        </div>
      </div>
    )
  }

  const skipStage4 = partsSelected.length === 0 && stage > 3

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile header */}
      <div className="text-white px-4 py-4 sticky top-0 z-30 shadow-md" style={{ background: NAVY }}>
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wider font-medium">Field App</p>
            <h1 className="text-base font-bold">{tech.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">Job</p>
            <p className="text-sm font-bold font-mono">{job.id}</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5 space-y-3">

        {/* Stepper */}
        <Stepper current={stage} skipStage4={skipStage4} />

        {/* ── Stage 1: Job Accepted ── */}
        <StageCard
          stageId={1} current={stage} label="Job Accepted"
          completedSummary={`${job.id} · ${caseData?.title}`}
        >
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">Job</p>
              <p className="text-sm font-bold text-gray-900">{job.id} — {job.type}</p>
              <p className="text-sm text-gray-600 mt-0.5 leading-snug">{caseData?.title}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400 shrink-0 w-20">Customer</span>
                <span className="font-medium text-gray-800">{customer?.name}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400 shrink-0 w-20">Address</span>
                <span className="text-gray-700">{customer?.address}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400 shrink-0 w-20">Pincode</span>
                <span className="font-mono font-semibold text-gray-800">{customer?.pincode}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400 shrink-0 w-20">Slot</span>
                <span className="font-medium text-gray-800">{job.scheduledDate} · {job.timeSlot}</span>
              </div>
            </div>
            <button
              onClick={() => setStage(2)}
              className="w-full py-3 rounded-xl text-sm font-bold text-white tracking-wide mt-1 active:scale-95 transition-transform"
              style={{ background: SKY }}
            >
              Start Travel →
            </button>
          </div>
        </StageCard>

        {/* ── Stage 2: Travelling ── */}
        <StageCard
          stageId={2} current={stage} label="Travelling"
          completedSummary={`Arrived after ${formatClock(travelSecs)}`}
        >
          <div className="space-y-4">
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-sky-700 uppercase tracking-wide mb-1">Destination</p>
              <p className="text-sm font-medium text-gray-800">{customer?.address}</p>
              <p className="text-sm text-gray-600">{customer?.city} — {customer?.pincode}</p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
              <span className="text-green-500 text-xl animate-pulse">📍</span>
              <div>
                <p className="text-xs font-semibold text-green-700">Simulated GPS tracking active</p>
                <p className="text-xs text-green-600">Route calculated · ETA {job.travelEta ?? '~20'} min</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Travel time</p>
              <p className="text-3xl font-bold tabular-nums" style={{ color: SKY }}>{formatClock(travelSecs)}</p>
            </div>
            <button
              onClick={() => setStage(3)}
              className="w-full py-3 rounded-xl text-sm font-bold text-white tracking-wide active:scale-95 transition-transform"
              style={{ background: SKY }}
            >
              I Have Arrived →
            </button>
          </div>
        </StageCard>

        {/* ── Stage 3: On Site / Diagnosing ── */}
        <StageCard
          stageId={3} current={stage} label="On Site / Diagnosing"
          completedSummary={`Diagnosis logged · ${partsSelected.length} part${partsSelected.length !== 1 ? 's' : ''} selected`}
        >
          <div className="space-y-4">
            {/* Customer + Product info */}
            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400 shrink-0 w-20">Customer</span>
                <span className="font-medium text-gray-800">{customer?.name}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400 shrink-0 w-20">Product</span>
                <span className="text-gray-700">{product?.brand} {product?.model}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400 shrink-0 w-20">Serial</span>
                <span className="font-mono text-xs text-gray-600">{product?.serial}</span>
              </div>
            </div>

            {/* Customer complaint */}
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Customer Complaint</p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-sm text-gray-700 leading-relaxed">{caseData?.description}</p>
              </div>
            </div>

            {/* Diagnosis textarea */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">
                Your Diagnosis
              </label>
              <textarea
                rows={3}
                placeholder="Describe what you found..."
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': SKY }}
              />
            </div>

            {/* Parts required */}
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Parts Required</p>
              <input
                type="text"
                placeholder="Search parts inventory..."
                value={partSearch}
                onChange={e => setPartSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': SKY }}
              />
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {filteredParts.map(p => {
                  const alreadyAdded = partsSelected.some(s => s.id === p.id)
                  const stockOk = p.stock > 0
                  return (
                    <div key={p.id} className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 ${alreadyAdded ? 'border-sky-400 bg-sky-50' : 'border-gray-200 bg-white'}`}>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.sku} · ₹{p.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!stockOk && <span className="text-xs text-red-500">Out of stock</span>}
                        {alreadyAdded ? (
                          <button
                            onClick={() => removePart(p.id)}
                            className="text-xs font-semibold text-red-600 border border-red-300 rounded-lg px-2 py-1"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => addPart(p)}
                            className="text-xs font-semibold text-white rounded-lg px-2 py-1"
                            style={{ background: SKY }}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Selected parts list */}
            {partsSelected.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Selected Parts</p>
                <div className="space-y-2">
                  {partsSelected.map(p => (
                    <div key={p.id} className="flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-xl px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                        <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-medium">Reserved</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <label className="text-xs text-gray-500">Qty</label>
                        <input
                          type="number"
                          min={1}
                          value={p.qty}
                          onChange={e => updateQty(p.id, e.target.value)}
                          className="w-12 border border-gray-300 rounded-lg text-center text-xs py-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photos placeholder */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 font-medium">[Upload before/after photos — simulated]</p>
              <p className="text-xs text-gray-300 mt-0.5">Camera access required in production</p>
            </div>

            {/* Action button */}
            <button
              onClick={() => {
                if (partsSelected.length > 0) {
                  setStage(4)
                } else {
                  setStage(5)
                }
              }}
              disabled={!diagnosis.trim()}
              className="w-full py-3 rounded-xl text-sm font-bold text-white tracking-wide disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform"
              style={{ background: SKY }}
            >
              {partsSelected.length > 0 ? 'Diagnosis Complete — Request Parts →' : 'Complete Job Directly →'}
            </button>
          </div>
        </StageCard>

        {/* ── Stage 4: Parts Requested ── */}
        {!skipStage4 && (
          <StageCard
            stageId={4} current={stage} label="Parts Requested"
            completedSummary="Parts received — repair underway"
          >
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <span className="text-amber-500 text-lg shrink-0">📦</span>
                <div>
                  <p className="text-xs font-bold text-amber-800">Parts requested from resQ Andheri Service Centre</p>
                  <p className="text-xs text-amber-600 mt-0.5">You will be notified when parts are dispatched</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Parts Status</p>
                <div className="space-y-2">
                  {partsSelected.map(p => {
                    const statuses = ['Reserved', 'In Transit', 'Delivered']
                    const statusColors = ['bg-sky-100 text-sky-700', 'bg-amber-100 text-amber-700', 'bg-green-100 text-green-700']
                    const statusIdx = 0 // simulated: all reserved when just requested
                    return (
                      <div key={p.id} className="flex items-center justify-between gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-white">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                          <p className="text-xs text-gray-400">Qty: {p.qty}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[statusIdx]}`}>
                          {statuses[statusIdx]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <button
                onClick={() => setStage(5)}
                className="w-full py-3 rounded-xl text-sm font-bold text-white tracking-wide active:scale-95 transition-transform"
                style={{ background: SKY }}
              >
                Parts Arrived — Begin Repair →
              </button>
            </div>
          </StageCard>
        )}

        {/* ── Stage 5: Repair in Progress ── */}
        <StageCard
          stageId={5} current={stage} label="Repair in Progress"
          completedSummary={`Total: ₹${grandTotal.toLocaleString()} · ${formatClock(repairSecs)}`}
        >
          <div className="space-y-4">
            {/* Timer */}
            <div className="text-center bg-gray-50 rounded-xl py-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Job Timer</p>
              <p className="text-3xl font-bold tabular-nums" style={{ color: NAVY }}>{formatClock(repairSecs)}</p>
              <p className="text-xs text-gray-400 mt-0.5">Elapsed since arrival</p>
            </div>

            {/* Parts used */}
            {partsSelected.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Parts Used</p>
                <div className="space-y-1.5">
                  {partsSelected.map(p => (
                    <div key={p.id} className="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2 bg-white text-xs">
                      <span className="text-gray-700 font-medium truncate flex-1">{p.name}</span>
                      <span className="text-gray-400 mx-2">×{p.qty}</span>
                      <span className="font-semibold text-gray-800">₹{(p.price * p.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Labour notes */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">Labour Notes</label>
              <textarea
                rows={2}
                placeholder="What work was performed..."
                value={labourNotes}
                onChange={e => setLabourNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': SKY }}
              />
            </div>

            {/* Quote breakdown */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Quote Breakdown</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Labour (base)</span>
                <span className="font-medium">₹{LABOUR_BASE}</span>
              </div>
              {partsSelected.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Labour (parts installation × {partsSelected.length})</span>
                  <span className="font-medium">₹{partsSelected.length * LABOUR_EXTRA}</span>
                </div>
              )}
              {partsSelected.map(p => (
                <div key={p.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate flex-1 mr-2">{p.name} ×{p.qty}</span>
                  <span className="font-medium shrink-0">₹{(p.price * p.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-gray-300 pt-2 flex justify-between text-sm font-bold">
                <span className="text-gray-800">Total</span>
                <span style={{ color: NAVY }}>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setStage(6)}
              className="w-full py-3 rounded-xl text-sm font-bold text-white tracking-wide active:scale-95 transition-transform"
              style={{ background: SKY }}
            >
              Job Completed — Get Confirmation →
            </button>
          </div>
        </StageCard>

        {/* ── Stage 6: Customer Confirmation ── */}
        <StageCard
          stageId={6} current={stage} label="Customer Confirmation"
          completedSummary="OTP confirmed — job closed"
        >
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-1.5">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Job Summary</p>
              <div className="text-sm text-gray-700 leading-relaxed">
                {diagnosis || 'Repair performed as diagnosed.'}
              </div>
              {partsSelected.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  Parts used: {partsSelected.map(p => p.name).join(', ')}
                </div>
              )}
              <div className="text-sm font-bold pt-1" style={{ color: NAVY }}>
                Total Charge: ₹{grandTotal.toLocaleString()}
              </div>
            </div>

            {/* OTP confirmation */}
            {!otpConfirmed ? (
              <div className="space-y-3">
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-sky-700 uppercase tracking-wide mb-2">Customer Signature / OTP Confirmation</p>
                  <p className="text-sm text-gray-600 mb-1">Ask customer to confirm:</p>
                  <p className="text-4xl font-black tracking-[0.25em] mt-1" style={{ color: NAVY }}>{SIMULATED_OTP}</p>
                  <p className="text-xs text-gray-400 mt-2">(Simulated — shared via WhatsApp in production)</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">Enter OTP from customer</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="- - - -"
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-2xl font-bold text-center tracking-widest focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': SKY }}
                  />
                </div>
                {otpInput.length === 4 && otpInput !== SIMULATED_OTP && (
                  <p className="text-xs text-red-600 font-medium text-center">Incorrect OTP. Ask customer to check again.</p>
                )}
                <button
                  onClick={() => {
                    if (otpInput === SIMULATED_OTP) {
                      setOtpConfirmed(true)
                      setCompletedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
                      setTimeout(() => setStage(7), 800)
                    }
                  }}
                  disabled={otpInput !== SIMULATED_OTP}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white tracking-wide disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform"
                  style={{ background: SKY }}
                >
                  Confirm OTP — Close Job
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-300 rounded-xl p-4 text-center">
                <p className="text-green-600 text-3xl mb-2">✓</p>
                <p className="text-sm font-bold text-green-800">OTP Confirmed — Job Closing...</p>
              </div>
            )}
          </div>
        </StageCard>

        {/* ── Stage 7: Done ── */}
        <StageCard stageId={7} current={stage} label="Done">
          <div className="space-y-4 text-center">
            <div>
              <div className="text-6xl mb-3">✅</div>
              <h2 className="text-lg font-bold text-gray-900">Job Completed!</h2>
              {completedAt && (
                <p className="text-sm text-gray-500 mt-1">Completed at {completedAt}</p>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-left space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Job ID</span>
                <span className="font-mono font-semibold text-gray-800">{job.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Customer</span>
                <span className="font-medium text-gray-800">{customer?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total charged</span>
                <span className="font-bold" style={{ color: NAVY }}>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Optional tech note */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1 text-left">
                Rate this job (optional note for ops)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Parts need reordering, customer was very cooperative..."
                value={jobRating}
                onChange={e => setJobRating(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 text-left"
                style={{ '--tw-ring-color': SKY }}
              />
            </div>

            <Link
              href="/ops/dispatch"
              className="block w-full py-3 rounded-xl text-sm font-bold text-white tracking-wide text-center"
              style={{ background: NAVY }}
            >
              ← Back to My Jobs
            </Link>
          </div>
        </StageCard>

      </div>
    </div>
  )
}
