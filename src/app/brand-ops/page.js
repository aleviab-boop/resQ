'use client'

import { useState, useMemo } from 'react'
import { CASES, PRODUCTS, CUSTOMERS } from '@/lib/platformData'
import OpsShell, { StatCard, SectionLabel, ActionBtn } from '@/components/OpsShell'

// ─── Brand data ────────────────────────────────────────────────────────────────
const BRANDS = [
  { id: 'B001', name: 'Reliance (Own)',  logo: '🏠', category: 'Own Brand',   jobsThisMonth: 8420, paidPerJob: 0,    actualCost: 420, slaDays: 1, slaBreaches: 12,  nps: 78, revenue: 0,       isOwnBrand: true  },
  { id: 'B002', name: 'Sony',            logo: '📺', category: 'Electronics', jobsThisMonth: 1240, paidPerJob: 400,  actualCost: 620, slaDays: 2, slaBreaches: 38,  nps: 64, revenue: 496000,  isOwnBrand: false },
  { id: 'B003', name: 'LG',              logo: '⚙️', category: 'White Goods', jobsThisMonth: 2180, paidPerJob: 480,  actualCost: 590, slaDays: 2, slaBreaches: 29,  nps: 71, revenue: 1046400, isOwnBrand: false },
  { id: 'B004', name: 'Samsung',         logo: '📱', category: 'Electronics', jobsThisMonth: 1890, paidPerJob: 450,  actualCost: 600, slaDays: 2, slaBreaches: 52,  nps: 62, revenue: 850500,  isOwnBrand: false },
  { id: 'B005', name: 'Daikin',          logo: '❄️', category: 'HVAC',        jobsThisMonth: 940,  paidPerJob: 550,  actualCost: 580, slaDays: 3, slaBreaches: 8,   nps: 74, revenue: 517000,  isOwnBrand: false },
  { id: 'B006', name: 'Whirlpool',       logo: '🌀', category: 'White Goods', jobsThisMonth: 1320, paidPerJob: 420,  actualCost: 570, slaDays: 2, slaBreaches: 44,  nps: 67, revenue: 554400,  isOwnBrand: false },
  { id: 'B007', name: 'Bosch',           logo: '🔧', category: 'White Goods', jobsThisMonth: 680,  paidPerJob: 600,  actualCost: 610, slaDays: 2, slaBreaches: 6,   nps: 79, revenue: 408000,  isOwnBrand: false },
  { id: 'B008', name: 'IFB',             logo: '🫧', category: 'White Goods', jobsThisMonth: 510,  paidPerJob: 380,  actualCost: 560, slaDays: 3, slaBreaches: 21,  nps: 58, revenue: 193800,  isOwnBrand: false },
  { id: 'B009', name: 'Voltas',          logo: '💨', category: 'HVAC',        jobsThisMonth: 1640, paidPerJob: 430,  actualCost: 575, slaDays: 2, slaBreaches: 67,  nps: 61, revenue: 705200,  isOwnBrand: false },
  { id: 'B010', name: 'Godrej',          logo: '🏭', category: 'White Goods', jobsThisMonth: 890,  paidPerJob: 390,  actualCost: 555, slaDays: 3, slaBreaches: 33,  nps: 65, revenue: 347100,  isOwnBrand: false },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────
const grossProfit = (b) => b.isOwnBrand ? null : (b.paidPerJob - b.actualCost) * b.jobsThisMonth
const plPerJob    = (b) => b.isOwnBrand ? null : b.paidPerJob - b.actualCost
const fmt         = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.abs(n))
const fmtCrore    = (n) => {
  const abs = Math.abs(n)
  if (abs >= 1e7) return `${(n / 1e7).toFixed(2)} Cr`
  if (abs >= 1e5) return `${(n / 1e5).toFixed(1)} L`
  return `₹${fmt(n)}`
}
const npsColor = (nps) =>
  nps > 74 ? 'text-emerald-600 font-semibold' : nps >= 60 ? 'text-amber-600 font-semibold' : 'text-red-600 font-semibold'
const plColor = (val) =>
  val > 0 ? 'text-emerald-600 font-bold' : val < 0 ? 'text-red-600 font-bold' : 'text-gray-500'

// ─── Brand initial circle ──────────────────────────────────────────────────────
const BRAND_PALETTE = [
  { bg: '#e0f2fe', color: '#0369a1' },
  { bg: '#fce7f3', color: '#9d174d' },
  { bg: '#dcfce7', color: '#166534' },
  { bg: '#fef3c7', color: '#92400e' },
  { bg: '#ede9fe', color: '#6d28d9' },
  { bg: '#ffedd5', color: '#9a3412' },
  { bg: '#dbeafe', color: '#1e40af' },
  { bg: '#f0fdf4', color: '#15803d' },
  { bg: '#fdf4ff', color: '#7e22ce' },
  { bg: '#fff1f2', color: '#9f1239' },
]

function BrandInitial({ brand, size = 'sm' }) {
  const idx = parseInt(brand.id.replace('B', ''), 10) % BRAND_PALETTE.length
  const { bg, color } = BRAND_PALETTE[idx]
  const dim = size === 'lg' ? 40 : size === 'md' ? 32 : 24
  const font = size === 'lg' ? 15 : size === 'md' ? 12 : 10
  return (
    <div
      className="rounded-xl flex items-center justify-center font-extrabold shrink-0"
      style={{ width: dim, height: dim, background: bg, color, fontSize: font }}
    >
      {brand.name[0]}
    </div>
  )
}

// ─── Improved Paid vs Cost Chart ───────────────────────────────────────────────
const CHART_MAX = Math.max(...BRANDS.filter(b => !b.isOwnBrand).flatMap(b => [b.paidPerJob, b.actualCost])) * 1.08

function BrandBar({ brand, onRenegotiate }) {
  const isLoss    = brand.actualCost > brand.paidPerJob
  const gap       = Math.abs(brand.paidPerJob - brand.actualCost)
  const paidPct   = (brand.paidPerJob / CHART_MAX) * 100
  const costPct   = (brand.actualCost  / CHART_MAX) * 100
  const minPct    = Math.min(paidPct, costPct)
  const gapStart  = minPct
  const gapWidth  = Math.abs(paidPct - costPct)

  return (
    <div className="py-3.5 border-b border-gray-100 last:border-0 group">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-28 shrink-0 flex items-center gap-2">
          <BrandInitial brand={brand} size="md" />
          <div>
            <p className="text-xs font-bold text-gray-800">{brand.name}</p>
            <p className="text-[10px] text-gray-400">{brand.category}</p>
          </div>
        </div>
        <div className="flex-1 relative">
          {/* Axis background tracks */}
          <div className="relative h-10 flex flex-col justify-between py-0.5">
            {/* Paid bar */}
            <div className="flex items-center gap-2 h-4">
              <div
                className="h-4 rounded-r-full transition-all relative overflow-hidden"
                style={{ width: `${paidPct}%`, background: '#00a1e1' }}
              >
                <div className="absolute inset-0 bg-white/10" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 whitespace-nowrap">₹{brand.paidPerJob}</span>
            </div>
            {/* Cost bar */}
            <div className="flex items-center gap-2 h-4">
              <div
                className="h-4 rounded-r-full transition-all relative overflow-hidden"
                style={{ width: `${costPct}%`, background: isLoss ? '#ef4444' : '#10b981' }}
              >
                <div className="absolute inset-0 bg-white/10" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 whitespace-nowrap">₹{brand.actualCost}</span>
            </div>
          </div>
          {/* Gap highlight band */}
          <div
            className="absolute top-0 bottom-0 opacity-10 pointer-events-none rounded"
            style={{
              left:  `${gapStart}%`,
              width: `${gapWidth}%`,
              background: isLoss ? '#ef4444' : '#10b981',
            }}
          />
        </div>
        {/* Right: P&L + action */}
        <div className="w-36 shrink-0 flex flex-col items-end gap-1">
          <span className={`text-sm font-extrabold ${isLoss ? 'text-red-600' : 'text-emerald-600'}`}>
            {isLoss ? '−' : '+'}₹{fmt(gap)}/job
          </span>
          <span className={`text-[11px] font-semibold ${isLoss ? 'text-red-400' : 'text-emerald-400'}`}>
            {isLoss ? '−' : '+'}{fmtCrore(Math.abs(gap * brand.jobsThisMonth))}/mo
          </span>
          {isLoss && (
            <button
              onClick={() => onRenegotiate(brand)}
              className="mt-0.5 text-[10px] font-bold px-2.5 py-1 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all"
              style={{ background: '#13347b' }}
            >
              Renegotiate →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Renegotiation Journey Modal ───────────────────────────────────────────────
const MACROS = [
  {
    id: 'M1',
    label: 'Cost Recovery Proposal',
    description: 'Request rate increase to cover actual service cost + 10% margin',
    targetRate: (b) => Math.ceil(b.actualCost * 1.1 / 10) * 10,
    subject: (b) => `Service Rate Revision Request — ${b.name} × resQ`,
    body: (b, target) => `Dear ${b.name} Service Contracts Team,

We are writing to initiate a formal rate revision for our existing service agreement.

Current Agreement Summary:
  • Paid rate per job: ₹${b.paidPerJob}
  • Actual average service cost: ₹${b.actualCost}
  • Net position per job: −₹${b.actualCost - b.paidPerJob} (loss)
  • Jobs completed this month: ${b.jobsThisMonth.toLocaleString('en-IN')}
  • Monthly P&L impact: −${fmtCrore((b.actualCost - b.paidPerJob) * b.jobsThisMonth)}

Proposed Revised Rate: ₹${target} per job
Justification: Cost recovery + 10% operational margin to ensure sustainable service quality.

We request a meeting at your earliest convenience to finalise the revised contract.

Regards,
resQ Service Contracts Team`,
  },
  {
    id: 'M2',
    label: 'SLA Penalty Clause',
    description: 'Add SLA breach penalties to the existing contract',
    targetRate: (b) => b.paidPerJob + 50,
    subject: (b) => `SLA Amendment Proposal — ${b.name} Contract`,
    body: (b, target) => `Dear ${b.name} Service Contracts Team,

We wish to introduce a performance-linked SLA penalty clause to our service agreement, effective the next quarter.

SLA Breach Data (Current Month):
  • Total breaches: ${b.slaBreaches}
  • Contracted SLA: ${b.slaDays}-day resolution
  • Customer NPS impacted: ${b.nps} (below resQ standard of 75)

Proposed SLA Penalty Structure:
  • Breach within SLA+1 day: ₹200 credit per job
  • Breach beyond SLA+2 days: ₹400 credit per job

In parallel, we propose a modest rate revision to ₹${target}/job to offset the operational improvement investments required.

We look forward to aligning on this before month-end.

Regards,
resQ Service Contracts Team`,
  },
  {
    id: 'M3',
    label: 'Escalation Notice',
    description: '30-day notice of intent to suspend brand unless rate is revised',
    targetRate: (b) => Math.ceil(b.actualCost * 1.05 / 10) * 10,
    subject: (b) => `Notice of Contract Review — ${b.name} [Action Required]`,
    body: (b, target) => `Dear ${b.name} Leadership Team,

This letter constitutes formal notice that resQ is initiating a mandatory contract review for ${b.name}'s service agreement, effective immediately.

Grounds for Review:
  1. Rate deficit of ₹${b.actualCost - b.paidPerJob}/job sustained for 3+ consecutive months
  2. Monthly financial loss to resQ: ${fmtCrore((b.actualCost - b.paidPerJob) * b.jobsThisMonth)}
  3. SLA breaches: ${b.slaBreaches} this month (${b.slaDays}-day SLA)

Unless a revised rate of ₹${target}/job is agreed within 30 days, resQ reserves the right to suspend ${b.name} jobs from its field operations network pending contract renegotiation.

This notice is issued as a good-faith step to preserve the relationship. We remain open to discussion.

Regards,
VP — Brand Contracts, resQ by Reliance`,
  },
  {
    id: 'M4',
    label: 'Mutual Review Request',
    description: 'Invite the brand to a joint cost review meeting — collaborative tone',
    targetRate: (b) => Math.ceil((b.paidPerJob + b.actualCost) / 2 / 10) * 10,
    subject: (b) => `Joint Cost Review Invitation — ${b.name} × resQ`,
    body: (b, target) => `Dear ${b.name} Service Team,

As part of our quarterly brand health review, we would like to invite ${b.name} to a joint cost transparency session.

Agenda Items:
  1. Current rate structure: ₹${b.paidPerJob}/job vs actual cost ₹${b.actualCost}/job
  2. Service volume trends (${b.jobsThisMonth.toLocaleString('en-IN')} jobs this month)
  3. NPS performance and SLA health (${b.slaBreaches} breaches this month)
  4. Mutually agreed target rate — we propose ₹${target}/job as a starting point

We believe transparency on both sides leads to better outcomes for the end customer.

Please confirm your availability for a 45-minute virtual session at your earliest convenience.

Regards,
resQ Brand Partnerships Team`,
  },
]

const APPROVERS = [
  { id: 'A1', name: 'Priya Sharma',   role: 'VP — Service Contracts', avatar: 'PS' },
  { id: 'A2', name: 'Rahul Mehta',    role: 'CFO — resQ',             avatar: 'RM' },
  { id: 'A3', name: 'Ananya Iyer',    role: 'Legal Counsel',          avatar: 'AI' },
]

// Macro icon SVGs
function MacroIcon({ id }) {
  if (id === 'M1') return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
  if (id === 'M2') return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  )
  if (id === 'M3') return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function RenegotiationModal({ brand, onClose }) {
  const [step, setStep]           = useState(1)
  const [selectedMacro, setMacro] = useState(null)
  const [targetRate, setTarget]   = useState(brand ? Math.ceil(brand.actualCost * 1.1 / 10) * 10 : 0)
  const [emailBody, setEmailBody] = useState('')
  const [approver, setApprover]   = useState(null)
  const [note, setNote]           = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!brand) return null

  const lossPerJob  = brand.actualCost - brand.paidPerJob
  const totalLoss   = lossPerJob * brand.jobsThisMonth
  const gainPerJob  = targetRate - brand.actualCost
  const newMonthly  = gainPerJob * brand.jobsThisMonth

  function applyMacro(m) {
    setMacro(m)
    setTarget(m.targetRate(brand))
    setEmailBody(m.body(brand, m.targetRate(brand)))
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  const STEP_LABELS = ['Evidence', 'Macro', 'Draft', 'Approve', 'Send']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #13347b 0%, #00a1e1 100%)' }}>
          <div className="flex items-center gap-3">
            <BrandInitial brand={brand} size="lg" />
            <div>
              <h2 className="text-base font-extrabold text-white">Renegotiate — {brand.name}</h2>
              <p className="text-xs text-blue-200">Loss: −₹{lossPerJob}/job · −{fmtCrore(totalLoss)}/month</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl leading-none font-light">✕</button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center px-6 py-3 gap-0 border-b border-gray-100 bg-gray-50">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1
            const done    = n < step
            const current = n === step
            return (
              <div key={label} className="flex items-center">
                <button
                  onClick={() => !submitted && setStep(n)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    current ? 'text-white' : done ? 'text-emerald-700' : 'text-gray-400'
                  }`}
                  style={current ? { background: '#13347b' } : {}}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                    done ? 'bg-emerald-100 text-emerald-700' : current ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {done ? '✓' : n}
                  </span>
                  {label}
                </button>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`w-4 h-px mx-0.5 ${done ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* STEP 1 — Evidence */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Business case evidence</h3>
                <p className="text-xs text-gray-500">This data will be included in your renegotiation proposal.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Current rate',   value: `₹${brand.paidPerJob}`,           color: 'text-gray-800' },
                  { label: 'Actual cost',    value: `₹${brand.actualCost}`,           color: 'text-red-600'  },
                  { label: 'Loss / job',     value: `−₹${lossPerJob}`,                color: 'text-red-700'  },
                  { label: 'Jobs this month',value: brand.jobsThisMonth.toLocaleString('en-IN'), color: 'text-gray-800' },
                  { label: 'Monthly loss',   value: `−${fmtCrore(totalLoss)}`,        color: 'text-red-700'  },
                  { label: 'NPS',            value: brand.nps,                         color: brand.nps < 65 ? 'text-red-600' : 'text-amber-600' },
                  { label: 'SLA breaches',   value: `${brand.slaBreaches} this month`, color: brand.slaBreaches > 30 ? 'text-red-600' : 'text-amber-600' },
                  { label: 'SLA target',     value: `${brand.slaDays}-day resolution`, color: 'text-gray-700' },
                  { label: 'Category',       value: brand.category,                   color: 'text-gray-700' },
                ].map(row => (
                  <div key={row.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{row.label}</p>
                    <p className={`text-sm font-extrabold mt-0.5 ${row.color}`}>{row.value}</p>
                  </div>
                ))}
              </div>
              {/* Target rate slider */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700">Proposed target rate per job</label>
                  <span className="text-lg font-extrabold text-blue-700">₹{targetRate}</span>
                </div>
                <input
                  type="range"
                  min={brand.paidPerJob}
                  max={brand.actualCost + 200}
                  step={10}
                  value={targetRate}
                  onChange={e => setTarget(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Current ₹{brand.paidPerJob}</span>
                  <span>Cost + margin ₹{brand.actualCost + 200}</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 bg-white rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-gray-400">New margin / job</p>
                    <p className={`text-sm font-extrabold ${gainPerJob >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {gainPerJob >= 0 ? '+' : ''}₹{gainPerJob}
                    </p>
                  </div>
                  <div className="flex-1 bg-white rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-gray-400">New monthly P&L</p>
                    <p className={`text-sm font-extrabold ${newMonthly >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {newMonthly >= 0 ? '+' : ''}{fmtCrore(newMonthly)}
                    </p>
                  </div>
                  <div className="flex-1 bg-white rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-gray-400">Rate increase</p>
                    <p className="text-sm font-extrabold text-blue-600">
                      +{Math.round(((targetRate - brand.paidPerJob) / brand.paidPerJob) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Select macro */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Choose a negotiation macro</h3>
                <p className="text-xs text-gray-500">Macros pre-fill the email draft with the right tone and data.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MACROS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => applyMacro(m)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selectedMacro?.id === m.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        selectedMacro?.id === m.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <MacroIcon id={m.id} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{m.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{m.description}</p>
                        <p className="text-xs font-semibold text-blue-600 mt-1.5">
                          Proposes ₹{m.targetRate(brand)}/job
                        </p>
                      </div>
                    </div>
                    {selectedMacro?.id === m.id && (
                      <div className="mt-2 flex items-center gap-1 text-blue-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-bold">Selected</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — Draft email */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Review & edit draft</h3>
                  <p className="text-xs text-gray-500">Pre-filled from the macro — edit freely before routing for approval.</p>
                </div>
                {selectedMacro && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                    {selectedMacro.label}
                  </span>
                )}
              </div>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">To:</span>
                  <span className="text-xs text-gray-700">{brand.name} Service Contracts</span>
                </div>
                {selectedMacro && (
                  <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500">Subject:</span>
                    <span className="text-xs text-gray-700">{selectedMacro.subject(brand)}</span>
                  </div>
                )}
                <textarea
                  className="w-full p-4 text-xs text-gray-700 font-mono leading-relaxed resize-none focus:outline-none"
                  rows={16}
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  placeholder={selectedMacro ? '' : 'Select a macro in Step 2 to pre-fill this draft…'}
                />
              </div>
            </div>
          )}

          {/* STEP 4 — Route for approval */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Route for approval</h3>
                <p className="text-xs text-gray-500">Select the approver. They will receive a summary + the draft email.</p>
              </div>
              <div className="flex flex-col gap-3">
                {APPROVERS.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setApprover(a)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      approver?.id === a.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-extrabold shrink-0"
                      style={{ background: 'linear-gradient(135deg, #13347b, #00a1e1)' }}>
                      {a.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{a.name}</p>
                      <p className="text-xs text-gray-500">{a.role}</p>
                    </div>
                    {approver?.id === a.id && (
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Internal note (optional)</label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  rows={3}
                  placeholder="Add context for the approver — urgency, relationship notes, red lines…"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>
              {approver && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
                  <p className="font-bold mb-1.5">Approval packet will include:</p>
                  <ul className="space-y-0.5 list-disc list-inside text-amber-700">
                    <li>Brand loss summary: −{fmtCrore(totalLoss)}/month</li>
                    <li>Proposed rate: ₹{targetRate}/job (was ₹{brand.paidPerJob})</li>
                    <li>Macro selected: {selectedMacro?.label || 'None'}</li>
                    <li>Email draft (editable by approver)</li>
                    <li>Your note: {note || '(none)'}</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* STEP 5 — Send / confirm */}
          {step === 5 && !submitted && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Confirm and send for approval</h3>
                <p className="text-xs text-gray-500">Review the final packet before routing.</p>
              </div>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wide">Packet summary</div>
                {[
                  ['Brand', brand.name],
                  ['Current rate', `₹${brand.paidPerJob}/job`],
                  ['Proposed rate', `₹${targetRate}/job`],
                  ['Rate increase', `+${Math.round(((targetRate - brand.paidPerJob) / brand.paidPerJob) * 100)}%`],
                  ['Monthly recovery', `+${fmtCrore(newMonthly)}`],
                  ['Macro', selectedMacro?.label || '—'],
                  ['Approver', approver?.name || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center px-4 py-2.5 border-b border-gray-50 last:border-0 text-sm">
                    <span className="text-xs text-gray-500 w-32 shrink-0">{k}</span>
                    <span className="font-semibold text-gray-800">{v}</span>
                  </div>
                ))}
              </div>
              {!approver && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 font-medium">
                  Please go back to Step 4 and select an approver before sending.
                </div>
              )}
            </div>
          )}

          {/* SUBMITTED */}
          {submitted && (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">Renegotiation packet sent</h3>
              <p className="text-sm text-gray-500 max-w-xs mb-4">
                Routed to <strong>{approver?.name}</strong> for approval. A simulated email has been queued to {brand.name} contacts.
              </p>
              <div className="bg-gray-50 rounded-xl px-5 py-3 text-left w-full max-w-sm">
                <p className="text-xs font-bold text-gray-700 mb-2">Reference</p>
                <p className="text-xs text-gray-500">Case: <span className="font-mono font-bold text-gray-800">RNB-{brand.id}-{Date.now().toString().slice(-5)}</span></p>
                <p className="text-xs text-gray-500 mt-0.5">SLA: Response expected within 5 business days</p>
                <p className="text-xs text-gray-500 mt-0.5">Approver: {approver?.name} — {approver?.role}</p>
              </div>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 text-sm font-bold text-white rounded-xl" style={{ background: '#13347b' }}>
                Close
              </button>
            </div>
          )}

        </div>

        {/* Footer nav */}
        {!submitted && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="px-4 py-2 text-sm font-semibold text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Back
            </button>
            <span className="text-xs text-gray-400">Step {step} of 5</span>
            {step < 5 ? (
              <button
                onClick={() => setStep(s => Math.min(5, s + 1))}
                disabled={step === 2 && !selectedMacro}
                className="px-5 py-2 text-sm font-bold text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                style={{ background: '#13347b' }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!approver}
                className="px-5 py-2 text-sm font-bold text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                style={{ background: '#00a1e1' }}
              >
                Send for approval
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── NPS badge ────────────────────────────────────────────────────────────────
function NpsBadge({ nps }) {
  const bg = nps > 74 ? 'bg-emerald-50 text-emerald-700' : nps >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${bg}`}>{nps}</span>
  )
}

// ─── Parts cost estimates used by drill-down economics ────────────────────────
const DRILL_PARTS_COST = { 'CS002': 3080, 'CS003': 1800 }

// ─── Brand drill-down panel ────────────────────────────────────────────────────
function BrandDrillDown({ brand, onClose, onRenegotiate }) {
  const brandKey   = brand.name.split(' ')[0]
  const brandCases = CASES.filter(c => {
    const prod = PRODUCTS.find(p => p.id === c.productId)
    return prod?.brand === brand.name || prod?.brand === brandKey
  }).slice(0, 3)

  function buildRow(c) {
    const prod        = PRODUCTS.find(p => p.id === c.productId)
    const customer    = CUSTOMERS.find(cu => cu.id === c.customerId)
    const partsTotal  = DRILL_PARTS_COST[c.id] || 0
    const labour      = 299, travel = 85
    const totalCost   = labour + partsTotal + travel
    const revenue     = brand.paidPerJob
    const margin      = revenue - totalCost
    return { caseId: c.id, customerName: customer?.name || c.customerId, type: c.type, partsTotal, labour, totalCost, revenue, margin }
  }

  function syntheticRow(idx) {
    const types      = ['repair', 'installation', 'service']
    const type       = types[idx % 3]
    const partsTotal = type === 'repair' ? 1200 : 0
    const labour     = 299, travel = 85
    const totalCost  = labour + partsTotal + travel
    const revenue    = brand.paidPerJob
    const margin     = revenue - totalCost
    return { caseId: `SIM-0${idx + 1}`, customerName: 'Sample Customer', type, partsTotal, labour, totalCost, revenue, margin }
  }

  const rows = brandCases.map(c => buildRow(c))
  while (rows.length < 3) rows.push(syntheticRow(rows.length))

  const isLoss = brand.actualCost > brand.paidPerJob

  return (
    <div className="mt-5 border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100" style={{ background: '#eff6ff' }}>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Sample job economics — {brand.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">Derived from case data · simulated pricing</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors">
          ✕ Close
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[700px]">
          <thead>
            <tr style={{ background: '#f8faff' }}>
              {['Job ID', 'Customer', 'Type', 'Parts used', 'Labour', 'Total cost', 'Revenue', 'Margin'].map(col => (
                <th key={col} className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.caseId} className={`border-b border-gray-50 hover:bg-white transition-colors ${i % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'}`}>
                <td className="px-4 py-2.5 font-mono text-gray-500 whitespace-nowrap">{row.caseId}</td>
                <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">{row.customerName}</td>
                <td className="px-4 py-2.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 capitalize">{row.type}</span>
                </td>
                <td className="px-4 py-2.5 text-gray-600">{row.partsTotal > 0 ? `₹${fmt(row.partsTotal)}` : 'None'}</td>
                <td className="px-4 py-2.5 text-gray-600">₹{row.labour}</td>
                <td className="px-4 py-2.5 font-semibold text-gray-800">₹{fmt(row.totalCost)}</td>
                <td className="px-4 py-2.5 text-gray-600">{row.revenue > 0 ? `₹${row.revenue}` : '—'}</td>
                <td className="px-4 py-2.5">
                  <span className={`font-bold ${row.margin > 0 ? 'text-emerald-600' : row.margin < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                    {row.margin >= 0 ? '+' : '−'}₹{fmt(Math.abs(row.margin))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ background: '#fafafa' }}>
        <p className="text-xs text-gray-500 max-w-lg">
          Contract rate vs actual delivery — reviewed quarterly. Renegotiation requires VP approval.
        </p>
        {isLoss && (
          <button
            onClick={() => onRenegotiate(brand)}
            className="text-xs font-bold px-5 py-2.5 rounded-xl text-white transition hover:opacity-90 shrink-0"
            style={{ background: 'linear-gradient(135deg, #13347b, #00a1e1)' }}
          >
            Start Renegotiation Journey →
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function BrandOpsPage() {
  const [categoryFilter, setCategoryFilter]   = useState('All')
  const [selectedBrand, setSelectedBrand]     = useState(null)
  const [renegBrand, setRenegBrand]           = useState(null)

  const totalJobs     = BRANDS.reduce((s, b) => s + b.jobsThisMonth, 0)
  const relianceJobs  = BRANDS.find(b => b.isOwnBrand)?.jobsThisMonth ?? 0
  const ownSharePct   = Math.round((relianceJobs / totalJobs) * 100)
  const totalBreaches = BRANDS.reduce((s, b) => s + b.slaBreaches, 0)
  const lossBrands    = BRANDS.filter(b => !b.isOwnBrand && b.actualCost > b.paidPerJob)
  const totalRevenue  = BRANDS.filter(b => !b.isOwnBrand).reduce((s, b) => s + b.revenue, 0)

  const categories = ['All', ...Array.from(new Set(BRANDS.filter(b => !b.isOwnBrand).map(b => b.category)))]

  const tableRows = useMemo(() => {
    const own   = BRANDS.filter(b => b.isOwnBrand)
    const third = BRANDS.filter(b => !b.isOwnBrand)
      .filter(b => categoryFilter === 'All' || b.category === categoryFilter)
      .sort((a, b) => (grossProfit(b) ?? 0) - (grossProfit(a) ?? 0))
    return [...own, ...third]
  }, [categoryFilter])

  const slaTop5      = [...BRANDS].sort((a, b) => b.slaBreaches - a.slaBreaches).slice(0, 5)
  const chartBrands  = BRANDS.filter(b => !b.isOwnBrand).sort((a, b) => (b.paidPerJob - b.actualCost) - (a.paidPerJob - a.actualCost))

  return (
    <OpsShell
      title="Brand Operations"
      subtitle="Per-brand P&L · SLA compliance · Contract health"
      breadcrumb={[{ label: 'Brand Ops' }]}
      actions={
        <ActionBtn variant="primary" onClick={() => lossBrands[0] && setRenegBrand(lossBrands[0])}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Renegotiate
        </ActionBtn>
      }
    >
      {renegBrand && <RenegotiationModal brand={renegBrand} onClose={() => setRenegBrand(null)} />}

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Brands" value="10" sub="1 own · 9 third-party" />
        <StatCard label="Jobs (MTD)" value={new Intl.NumberFormat('en-IN').format(totalJobs)} sub="across all brands" />

        {/* Own brand share — custom card */}
        <div className="bg-white rounded-2xl px-5 py-4 border border-gray-100 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Own Brand Share</p>
          <p className="text-2xl font-extrabold leading-none" style={{ color: '#13347b' }}>{ownSharePct}%</p>
          <p className="text-[11px] text-gray-400 mt-1">{new Intl.NumberFormat('en-IN').format(relianceJobs)} Reliance jobs</p>
          <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${ownSharePct}%`, background: 'linear-gradient(90deg, #13347b, #00a1e1)' }} />
          </div>
        </div>

        <StatCard
          label="Loss-making Brands"
          value={lossBrands.length}
          sub={`of ${BRANDS.length - 1} third-party`}
          color="text-amber-600"
        />
        <StatCard
          label="SLA Breaches"
          value={new Intl.NumberFormat('en-IN').format(totalBreaches)}
          sub="this month"
          color="text-red-600"
        />
      </div>

      {/* ── Chart section ──────────────────────────────────────────────────────── */}
      <SectionLabel>Paid Rate vs Actual Cost — per Job</SectionLabel>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <p className="text-xs text-gray-500">Third-party brands only · sorted by margin (best to worst) · hover for action</p>
          <div className="flex items-center gap-5 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-10 h-2.5 rounded-full inline-block" style={{ background: '#00a1e1' }} />
              Paid rate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-10 h-2.5 rounded-full inline-block bg-red-400" />
              Cost (loss)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-10 h-2.5 rounded-full inline-block bg-emerald-500" />
              Cost (profit)
            </span>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex ml-28 sm:ml-36 mb-1">
          {[0, 25, 50, 75, 100].map(pct => (
            <div key={pct} className="flex-1 text-right">
              <span className="text-[10px] text-gray-300 font-medium">
                ₹{Math.round((CHART_MAX * pct) / 100 / 50) * 50}
              </span>
            </div>
          ))}
        </div>
        <div className="relative ml-28 sm:ml-36 mr-36 mb-1 h-px">
          <div className="absolute inset-0 flex">
            {[0, 25, 50, 75, 100].map(pct => (
              <div key={pct} className="flex-1 border-r border-gray-100 last:border-0" />
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {chartBrands.map(b => <BrandBar key={b.id} brand={b} onRenegotiate={setRenegBrand} />)}
        </div>
      </div>

      {/* ── Brand Roster ───────────────────────────────────────────────────────── */}
      <SectionLabel>Brand Roster</SectionLabel>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <p className="text-xs text-gray-500">Own brand first · third-party sorted by P&amp;L · click a row to expand economics</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  categoryFilter === cat ? 'text-white border-transparent' : 'text-gray-600 border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={categoryFilter === cat ? { background: '#13347b', borderColor: '#13347b' } : {}}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100">
                {['Brand', 'Category', 'Jobs', 'Revenue', 'Paid / Job', 'Cost / Job', 'P&L / Job', 'Total P&L', 'SLA Days', 'SLA Breaches', 'NPS'].map(col => (
                  <th key={col} className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pr-4 whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map(b => {
                const pl       = plPerJob(b)
                const totalPl  = grossProfit(b)
                const isOwn    = b.isOwnBrand
                const isSelected = selectedBrand?.id === b.id
                return (
                  <tr key={b.id}
                    onClick={() => setSelectedBrand(isSelected ? null : b)}
                    className={`border-b border-gray-50 hover:bg-sky-50/40 transition-colors cursor-pointer ${isSelected ? 'ring-1 ring-inset ring-sky-300' : ''}`}
                    style={isOwn && !isSelected ? { background: '#f0f9ff' } : isSelected ? { background: '#eff6ff' } : {}}>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5 whitespace-nowrap">
                        <BrandInitial brand={b} size="md" />
                        <div>
                          <p className="font-semibold text-gray-900 text-xs">{b.name}</p>
                          {isOwn && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: '#13347b' }}>Own</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-500 whitespace-nowrap">{b.category}</td>
                    <td className="py-3 pr-4 text-xs font-semibold text-gray-800">{new Intl.NumberFormat('en-IN').format(b.jobsThisMonth)}</td>
                    <td className="py-3 pr-4 text-xs text-gray-700">{isOwn ? <span className="text-gray-400 italic">—</span> : fmtCrore(b.revenue)}</td>
                    <td className="py-3 pr-4 text-xs text-gray-700">{isOwn ? <span className="text-gray-400 italic">—</span> : `₹${b.paidPerJob}`}</td>
                    <td className="py-3 pr-4 text-xs text-gray-700">₹{b.actualCost}</td>
                    <td className="py-3 pr-4 text-xs whitespace-nowrap">
                      {pl === null ? <span className="text-gray-400 italic">Cost centre</span> : (
                        <span className={plColor(pl)}>{pl >= 0 ? '+' : '−'}₹{fmt(Math.abs(pl))}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-xs whitespace-nowrap">
                      {totalPl === null ? <span className="text-gray-400 italic">—</span> : (
                        <span className={plColor(totalPl)}>{totalPl >= 0 ? '+' : '−'}{fmtCrore(Math.abs(totalPl))}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-xs text-center">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{b.slaDays}d</span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${b.slaBreaches > 40 ? 'bg-red-50 text-red-700' : b.slaBreaches > 20 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {b.slaBreaches}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-center"><NpsBadge nps={b.nps} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {selectedBrand && (
          <BrandDrillDown
            brand={selectedBrand}
            onClose={() => setSelectedBrand(null)}
            onRenegotiate={(b) => { setSelectedBrand(null); setRenegBrand(b) }}
          />
        )}
      </div>

      {/* ── Bottom row ─────────────────────────────────────────────────────────── */}
      <SectionLabel>Alerts & Leaderboards</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Renegotiation needed */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-100 flex items-center justify-between" style={{ background: 'linear-gradient(90deg, #fffbeb, #fff)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-amber-800">Renegotiation Needed</h2>
                <p className="text-xs text-amber-600">
                  {lossBrands.length} brand{lossBrands.length !== 1 ? 's' : ''} paying below actual service cost
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 flex flex-col gap-3">
            {lossBrands.sort((a, b) => (a.paidPerJob - a.actualCost) - (b.paidPerJob - b.actualCost)).map(b => {
              const lossPerJob = b.actualCost - b.paidPerJob
              const totalLoss  = lossPerJob * b.jobsThisMonth
              return (
                <div key={b.id} className="flex items-center gap-4 p-4 rounded-xl border border-red-100" style={{ background: '#fff5f5' }}>
                  <BrandInitial brand={b} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{b.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{b.category}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                      <span className="text-xs text-gray-600">Paid <strong className="text-gray-800">₹{b.paidPerJob}</strong></span>
                      <span className="text-xs text-gray-600">Cost <strong className="text-gray-800">₹{b.actualCost}</strong></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-500 mb-1">Loss / job</p>
                    <p className="text-lg font-extrabold text-red-600">−₹{fmt(lossPerJob)}</p>
                    <p className="text-xs text-red-500 font-semibold mt-0.5">−{fmtCrore(totalLoss)} / month</p>
                    <button
                      onClick={() => setRenegBrand(b)}
                      className="mt-2 text-[11px] font-bold px-3 py-1.5 rounded-lg text-white transition hover:opacity-90"
                      style={{ background: '#13347b' }}
                    >
                      Renegotiate →
                    </button>
                  </div>
                </div>
              )
            })}
            <div className="flex items-center justify-between p-4 rounded-xl mt-1"
              style={{ background: 'linear-gradient(90deg, #fef2f2, #fff5f5)', border: '1px solid #fecaca' }}>
              <p className="text-sm font-bold text-red-800">Total monthly loss on loss-making brands</p>
              <p className="text-xl font-extrabold text-red-700">
                −{fmtCrore(lossBrands.reduce((s, b) => s + (b.actualCost - b.paidPerJob) * b.jobsThisMonth, 0))}
              </p>
            </div>
          </div>
        </div>

        {/* SLA breach leaderboard */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5" style={{ background: 'linear-gradient(90deg, #eff6ff, #fff)' }}>
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">SLA Breach Leaders</h2>
              <p className="text-xs text-gray-500">Top 5 brands by breach count this month</p>
            </div>
          </div>
          <div className="p-5 flex flex-col gap-3">
            {slaTop5.map((b, idx) => {
              const rankColors = ['#ef4444', '#f97316', '#f59e0b', '#6b7280', '#9ca3af']
              const rankBg     = ['bg-red-50', 'bg-orange-50', 'bg-amber-50', 'bg-gray-50', 'bg-gray-50']
              return (
                <div key={b.id} className={`flex items-center gap-3 p-3 rounded-xl ${rankBg[idx]}`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0"
                    style={{ background: rankColors[idx] }}>{idx + 1}</div>
                  <BrandInitial brand={b} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold px-2.5 py-1 rounded-full"
                      style={{ background: rankColors[idx] + '20', color: rankColors[idx] }}>
                      {b.slaBreaches}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">breaches</p>
                  </div>
                </div>
              )
            })}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-1">
              <p className="text-xs text-gray-500 font-medium">All brands combined</p>
              <span className="text-sm font-extrabold text-red-600">{totalBreaches} breaches</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-10 pb-2">
        Brand Ops · resQ by Reliance · Data as of Oct 2026
      </p>
    </OpsShell>
  )
}
