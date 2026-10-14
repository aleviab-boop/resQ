'use client'
import { useState } from 'react'
import Link from 'next/link'

const FRAUD_FLAGS = [
  {
    id: 'F001', type: 'multi-trip',
    desc: 'Same job registered 3 times',
    pattern: 'Pattern: 3 visits same address in 7 days',
    customer: 'Priya Mehta', phone: '+91 98201 44321',
    appliance: 'Split AC', area: 'Andheri East',
    engineer: 'Arjun Mehta (E001)',
    dates: ['Oct 12 10:15', 'Oct 12 14:30', 'Oct 13 09:05'],
    totalCharged: '₹1,797', expectedCharge: '₹599',
    overcharge: '₹1,198', severity: 'high', status: 'open',
    raisedAt: '2026-10-13T09:10:00', raisedBy: 'Rule: duplicate-job-same-address',
    evidence: [
      { id: 'E1', label: 'Job log screenshot', type: 'image', note: 'Shows 3 entries for same address on same day' },
      { id: 'E2', label: 'GPS coordinates log', type: 'document', note: 'All 3 check-ins originate within 50m of same lat/lng' },
    ],
    timeline: [
      { time: 'Oct 12 10:15', event: 'Job JB-E001-01 registered — AC repair, Andheri East' },
      { time: 'Oct 12 14:30', event: 'Job JB-E001-02 registered — AC repair, same address (4h gap)' },
      { time: 'Oct 13 09:05', event: 'Job JB-E001-03 registered — AC repair, same address (next day)' },
      { time: 'Oct 13 09:10', event: 'Fraud flag F001 auto-raised by duplicate-job rule' },
    ],
    techResponse: 'First visit was for diagnosis, second for gas refill, third to check cooling. Customer requested all three separately.',
  },
  {
    id: 'F002', type: 'cancellation-fraud',
    desc: 'DDU call cancelled, customer received cancellation call instead of service',
    pattern: 'Pattern: Cancelled after tech-arrival confirmed',
    customer: 'Ramesh Iyer', phone: '+91 98765 11223',
    appliance: 'Refrigerator', area: 'Malad West',
    engineer: 'Delivery Co. (DL-022)',
    dates: ['Oct 11 11:00'],
    totalCharged: '₹0', expectedCharge: '₹0',
    overcharge: '₹0', severity: 'medium', status: 'open',
    note: 'Customer did not receive installation — order marked delivered.',
    raisedAt: '2026-10-11T12:00:00', raisedBy: 'Rule: cancellation-after-arrival-confirmed',
    evidence: [
      { id: 'E1', label: 'Delivery partner app log', type: 'document', note: 'Job marked cancelled 45 min after arrival scan' },
      { id: 'E2', label: 'Customer call recording', type: 'audio', note: 'Customer confirms no visit occurred; received cancellation SMS only' },
    ],
    timeline: [
      { time: 'Oct 11 10:45', event: 'Technician DL-022 arrival scanned — Malad West' },
      { time: 'Oct 11 11:00', event: 'Job marked "customer not available" — cancelled' },
      { time: 'Oct 11 11:05', event: 'Customer called helpline; confirmed they were home all morning' },
      { time: 'Oct 11 12:00', event: 'Fraud flag F002 auto-raised by cancellation-after-arrival rule' },
    ],
    techResponse: 'Customer did not open the door despite multiple calls. Waited 20 minutes before marking absent.',
  },
  {
    id: 'F003', type: 'multi-trip',
    desc: 'Washing machine repair logged twice by same engineer',
    pattern: 'Pattern: 2 job completions same address within 4 hours',
    customer: 'Sunita Patel', phone: '+91 91234 56789',
    appliance: 'Washing Machine', area: 'Borivali',
    engineer: 'Suresh Kumar (E004)',
    dates: ['Oct 10 14:00', 'Oct 10 18:30'],
    totalCharged: '₹1,198', expectedCharge: '₹599',
    overcharge: '₹599', severity: 'high', status: 'resolved',
    raisedAt: '2026-10-10T18:45:00', raisedBy: 'Rule: duplicate-job-same-address',
    evidence: [
      { id: 'E1', label: 'Job completion receipts', type: 'document', note: 'Two receipts for ₹599 each — same date, same address' },
      { id: 'E2', label: 'Tech GPS log', type: 'document', note: 'Single continuous stay at location; no departure between jobs' },
    ],
    timeline: [
      { time: 'Oct 10 14:00', event: 'Job JB-E004-07 completed — WM repair, Borivali' },
      { time: 'Oct 10 18:30', event: 'Job JB-E004-08 completed — WM repair, same address' },
      { time: 'Oct 10 18:45', event: 'Fraud flag F003 auto-raised; duplicate billing confirmed' },
      { time: 'Oct 11 09:00', event: 'Manager reviewed; second charge reversed; engineer warned' },
    ],
    techResponse: 'Second entry was a mistake; accidentally submitted twice. Did not intend to double-bill.',
  },
  {
    id: 'F004', type: 'imei-mismatch',
    desc: 'Device serial during inspection does not match registered appliance serial',
    pattern: 'Pattern: Serial mismatch between registration and field scan',
    customer: 'Vikram Nair', phone: '+91 87654 32100',
    appliance: 'LED TV', area: 'Powai',
    engineer: 'Manoj Tiwari (E006)',
    dates: ['Oct 09 10:30'],
    totalCharged: '₹189', expectedCharge: '₹189',
    overcharge: '₹0', severity: 'medium', status: 'open',
    note: 'Registered serial: SN-SVY-2022-0193, Scanned at visit: SN-SVY-2021-8841.',
    raisedAt: '2026-10-09T11:00:00', raisedBy: 'Rule: serial-mismatch-on-scan',
    evidence: [
      { id: 'E1', label: 'Technician scan image', type: 'image', note: 'Photo shows serial SN-SVY-2021-8841 on the device at Powai' },
      { id: 'E2', label: 'Order registration record', type: 'document', note: 'Original order ORD006 shows SN-SVY-2022-0193' },
    ],
    timeline: [
      { time: 'Oct 09 10:30', event: 'Tech Manoj Tiwari scanned device serial at Powai' },
      { time: 'Oct 09 10:32', event: 'System detected serial mismatch — auto-flag triggered' },
      { time: 'Oct 09 11:00', event: 'Fraud flag F004 raised; job paused pending review' },
    ],
    techResponse: 'The serial on the TV looked different from the order details. I scanned what was physically there. Possible that the original device was swapped by customer.',
  },
  {
    id: 'F005', type: 'cancellation-fraud',
    desc: 'AC installation cancelled by delivery partner after 3 failed attempts — customer never informed',
    pattern: 'Pattern: 3 no-show cancellations, no outbound contact logged',
    customer: 'Anita Sharma', phone: '+91 99887 76655',
    appliance: 'Air Conditioner', area: 'Thane West',
    engineer: 'Delivery Co. (DL-047)',
    dates: ['Oct 08', 'Oct 09', 'Oct 10'],
    totalCharged: '₹0', expectedCharge: '₹0',
    overcharge: '₹0', severity: 'high', status: 'open',
    note: 'Customer called helpline 3 times. No callback received.',
    raisedAt: '2026-10-10T18:00:00', raisedBy: 'Rule: 3-cancellations-no-contact',
    evidence: [
      { id: 'E1', label: 'Call log — Anita Sharma', type: 'document', note: '3 inbound calls from customer; 0 outbound calls by delivery partner' },
      { id: 'E2', label: 'Delivery partner cancellation notes', type: 'document', note: 'All 3 marked "customer not available" — no call timestamps, no photo' },
    ],
    timeline: [
      { time: 'Oct 08', event: 'First installation attempt — cancelled "customer not home"' },
      { time: 'Oct 09', event: 'Second attempt — cancelled "customer not home"' },
      { time: 'Oct 10', event: 'Third attempt — cancelled; installation marked failed' },
      { time: 'Oct 10 14:00', event: 'Customer calls helpline (third complaint) — escalated to ops' },
      { time: 'Oct 10 18:00', event: 'Fraud flag F005 raised; partner DL-047 escalation triggered' },
    ],
    techResponse: 'No response logged from DL-047. Under investigation by delivery partner ops team.',
  },
  {
    id: 'F006', type: 'multi-trip',
    desc: 'Geyser installation billed to 2 different brand codes (Reliance + V-Guard) for same visit',
    pattern: 'Pattern: Same visit billed under 2 brand SLA codes simultaneously',
    customer: 'Deepak Joshi', phone: '+91 98100 23456',
    appliance: 'Geyser', area: 'Navi Mumbai',
    engineer: 'Rohan Nair (E007)',
    dates: ['Oct 07 09:00'],
    totalCharged: '₹1,100', expectedCharge: '₹550',
    overcharge: '₹550', severity: 'high', status: 'open',
    note: 'Same visit logged under Reliance job code AND V-Guard SLA, collecting from both.',
    raisedAt: '2026-10-07T11:30:00', raisedBy: 'Rule: dual-brand-billing-same-timestamp',
    evidence: [
      { id: 'E1', label: 'Billing system export', type: 'document', note: 'Two invoices at identical timestamp — Reliance ₹550, V-Guard ₹550' },
      { id: 'E2', label: 'Tech GPS log Oct 07', type: 'document', note: 'Single visit at address; continuous stay 09:00–10:45' },
    ],
    timeline: [
      { time: 'Oct 07 09:00', event: 'Tech Rohan Nair checked in at Navi Mumbai address' },
      { time: 'Oct 07 10:45', event: 'Job completed; two completion events submitted simultaneously' },
      { time: 'Oct 07 11:30', event: 'Fraud flag F006 auto-raised — dual-brand billing on same timestamp' },
    ],
    techResponse: 'Geyser was a V-Guard unit installed under a Reliance plan. Logged under both because the system accepted both codes without error.',
  },
]

const TYPE_LABELS = {
  'multi-trip':         { label: 'Multi-trip',          color: 'bg-red-100 text-red-700' },
  'cancellation-fraud': { label: 'Cancellation Fraud',  color: 'bg-orange-100 text-orange-700' },
  'imei-mismatch':      { label: 'IMEI Mismatch',       color: 'bg-purple-100 text-purple-700' },
}

const SEVERITY = {
  high:   'bg-red-500',
  medium: 'bg-amber-400',
  low:    'bg-gray-300',
}

export default function FraudOps() {
  const [filter, setFilter]                       = useState('all')
  const [statusFilter, setStatusFilter]           = useState('all')
  const [selected, setSelected]                   = useState(null)
  const [investigationStatus, setInvestigationStatus] = useState({}) // flagId -> 'open'|'under-review'|'cleared'|'confirmed'|'more-info'
  const [decisions, setDecisions]                 = useState({})     // flagId -> { outcome, at }
  const [customerConfirmed, setCustomerConfirmed] = useState({})     // flagId -> bool
  const [cancelReason, setCancelReason]           = useState({})     // orderId -> reason string
  const [cancelOutcome, setCancelOutcome]         = useState({})     // orderId -> 'approved'|'blocked'

  const filtered = FRAUD_FLAGS.filter(f => {
    const typeOk   = filter === 'all' || f.type === filter
    const statusOk = statusFilter === 'all' || f.status === statusFilter
    return typeOk && statusOk
  })

  const open          = FRAUD_FLAGS.filter(f => f.status === 'open').length
  const underReview   = Object.values(investigationStatus).filter(s => s === 'under-review').length
  const clearedCount  = Object.values(decisions).filter(d => d.outcome === 'cleared').length
  const confirmedCount = Object.values(decisions).filter(d => d.outcome === 'confirmed').length
  const highSev       = FRAUD_FLAGS.filter(f => f.severity === 'high' && f.status === 'open').length
  const totalLoss     = FRAUD_FLAGS.reduce((sum, f) => {
    const n = parseInt(f.overcharge.replace(/[^0-9]/g, '')) || 0
    return sum + n
  }, 0)

  function startInvestigation(flagId, e) {
    e.stopPropagation()
    setInvestigationStatus(prev => ({ ...prev, [flagId]: 'under-review' }))
  }
  function makeDecision(flagId, outcome, e) {
    e.stopPropagation()
    const at = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
    setDecisions(prev => ({ ...prev, [flagId]: { outcome, at } }))
    setInvestigationStatus(prev => ({ ...prev, [flagId]: outcome }))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Link href="/ops" className="text-sm text-gray-400 hover:text-navy transition">← Ops Hub</Link>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Fraud & Anomaly Detection</h1>
        <p className="text-gray-400 text-sm mt-1">Multi-trip scams · Cancellation fraud · IMEI mismatches · Duplicate billing</p>
      </div>

      {/* Active Fraud Prevention Rules */}
      <div className="mb-6">
        <h2 className="text-lg font-extrabold text-gray-900 mb-3">Active Fraud Prevention Rules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-sm leading-tight">High-value cancellation block</h3>
              <span className="ml-2 flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">ACTIVE</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">TV/appliance orders &gt;₹50,000: cancellation requires manager approval after delivery.</p>
            <div className="text-xs text-gray-400 mb-1">Trigger: order value &gt; ₹50,000 + delivery confirmed</div>
            <div className="text-xs text-gray-400 mb-2">Coverage: 3 active orders (ORD003, ORD006 both pending install)</div>
            <div className="text-xs text-gray-400 mb-3">Last triggered: Never</div>
            <Link href="/ops/admin" className="text-xs text-[#00a1e1] hover:underline font-semibold">Edit rule →</Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-sm leading-tight">Multi-trip detection</h3>
              <span className="ml-2 flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">ACTIVE</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">Same address + same technician within 7 days: auto-flag for review.</p>
            <div className="text-xs text-gray-400 mb-1">Trigger: duplicate address + technician within 7-day window</div>
            <div className="text-xs text-gray-400 mb-3">Last triggered: JB001 flagged — CS002 reviewed CS005</div>
            <Link href="/ops/admin" className="text-xs text-[#00a1e1] hover:underline font-semibold">Edit rule →</Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-sm leading-tight">Duplicate billing check</h3>
              <span className="ml-2 flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">ACTIVE</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">Same customer + same appliance + repair within 30 days: flag for review.</p>
            <div className="text-xs text-gray-400 mb-1">Trigger: customer + appliance match within 30-day window</div>
            <div className="text-xs text-gray-400 mb-3">Last triggered: F003 (Sunita Patel, WM, Oct 10)</div>
            <Link href="/ops/admin" className="text-xs text-[#00a1e1] hover:underline font-semibold">Edit rule →</Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-sm leading-tight">Cancellation after technician dispatch</h3>
              <span className="ml-2 flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">ACTIVE</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">Cancellation request after job status = in-progress: requires customer OTP confirmation.</p>
            <div className="text-xs text-gray-400 mb-1">Trigger: cancellation when job status = in-progress</div>
            <div className="text-xs text-gray-400 mb-3">Last triggered: F002 (Ramesh Iyer, Oct 11)</div>
            <Link href="/ops/admin" className="text-xs text-[#00a1e1] hover:underline font-semibold">Edit rule →</Link>
          </div>
        </div>
      </div>

      {/* Pending Approvals — cancellation block */}
      <div className="mb-6">
        <h2 className="text-lg font-extrabold text-gray-900 mb-1">Pending Approvals</h2>
        <div className="mb-3 flex items-start gap-2 rounded-lg px-3 py-2 border border-amber-200 bg-amber-50 text-xs text-amber-800">
          Cancellation of delivered items requires manager sign-off. Customer must be contacted before approval.
        </div>
        <div className="space-y-3">
          {[
            { orderId: 'ORD003', customer: 'Ramesh Iyer', product: 'Samsung AC (AR18TYHYCWK)', amount: '₹36,999', deliveryDate: '20 May 2024', daysSince: '513 days' },
            { orderId: 'ORD006', customer: 'Vikram Nair',  product: 'Sony TV (KD-55X75L)',      amount: '₹89,000', deliveryDate: '20 Jan 2024', daysSince: '634 days' },
          ].map(order => (
            <div key={order.orderId} className="bg-white rounded-2xl border border-amber-200 shadow-sm p-4">
              <div className="flex flex-wrap items-start gap-2 mb-3">
                <span className="font-bold text-gray-900">{order.orderId}</span>
                <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">Pending manager approval</span>
                <div className="w-full text-sm text-gray-700 font-medium">{order.customer} — {order.product}</div>
                <div className="text-xs text-gray-400">Amount: <span className="font-bold text-gray-700">{order.amount}</span> · Delivered: {order.deliveryDate} · {order.daysSince} ago</div>
              </div>
              {cancelOutcome[order.orderId] ? (
                <div className={`text-sm font-bold px-3 py-2 rounded-lg ${cancelOutcome[order.orderId] === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {cancelOutcome[order.orderId] === 'approved' ? 'Cancellation approved (simulated)' : 'Cancellation blocked — customer informed'}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 items-center">
                  <select
                    value={cancelReason[order.orderId] || ''}
                    onChange={e => setCancelReason(r => ({ ...r, [order.orderId]: e.target.value }))}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#00a1e1] flex-1 min-w-[200px]"
                  >
                    <option value="">Select reason for decision…</option>
                    <option value="customer-request">Customer request — genuine</option>
                    <option value="product-defect">Product defect confirmed</option>
                    <option value="delayed-install">Installation not completed</option>
                    <option value="fraud-suspected">Fraud suspected</option>
                    <option value="policy-reject">Policy — reject cancellation</option>
                  </select>
                  <button
                    disabled={!cancelReason[order.orderId]}
                    onClick={() => setCancelOutcome(o => ({ ...o, [order.orderId]: 'approved' }))}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Approve cancellation
                  </button>
                  <button
                    disabled={!cancelReason[order.orderId]}
                    onClick={() => setCancelOutcome(o => ({ ...o, [order.orderId]: 'blocked' }))}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Block cancellation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Review notice banner */}
      <div className="mb-6 flex items-start gap-3 rounded-xl px-5 py-4 border border-amber-200 bg-amber-50">
        <span className="text-xl mt-0.5">⚖️</span>
        <p className="text-sm font-medium text-amber-800">
          Flags require review before adverse action. Do not block engineers, initiate refunds, or escalate to partners until an investigation is complete and a decision is recorded in the audit log.
        </p>
      </div>

      {/* Fraud summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Open flags',        value: open,          color: 'text-red-600',    bg: 'bg-red-50',    icon: '🚩', sub: `${highSev} high severity` },
          { label: 'Under review',      value: underReview,   color: 'text-blue-700',   bg: 'bg-blue-50',   icon: '🔍', sub: 'active investigations' },
          { label: 'Cleared this month', value: clearedCount, color: 'text-green-700',  bg: 'bg-green-50',  icon: '✅', sub: 'no fraud found' },
          { label: 'Confirmed fraud',   value: confirmedCount, color: 'text-red-700',   bg: 'bg-red-50',    icon: '⛔', sub: `₹${totalLoss.toLocaleString('en-IN')} total overcharge` },
        ].map(t => (
          <div key={t.label} className={`${t.bg} rounded-2xl p-4`}>
            <div className="text-2xl mb-1">{t.icon}</div>
            <div className={`text-2xl font-extrabold ${t.color}`}>{t.value}</div>
            <div className="text-xs text-gray-600 mt-0.5 font-semibold">{t.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{t.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { key: 'all',               label: 'All types' },
          { key: 'multi-trip',        label: 'Multi-trip' },
          { key: 'cancellation-fraud',label: 'Cancellation Fraud' },
          { key: 'imei-mismatch',     label: 'IMEI Mismatch' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === f.key ? 'bg-navy text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-navy/40'}`}>
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          {['all','open','resolved'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition capitalize ${statusFilter === s ? 'bg-sky text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Flag cards */}
      <div className="space-y-3">
        {filtered.map(f => {
          const typeTag = TYPE_LABELS[f.type]
          return (
            <div key={f.id}
              className={`bg-white rounded-2xl shadow-card border-l-4 p-5 cursor-pointer hover:shadow-lg transition ${f.severity === 'high' ? 'border-red-500' : f.severity === 'medium' ? 'border-amber-400' : 'border-gray-200'} ${f.status === 'resolved' ? 'opacity-60' : ''}`}
              onClick={() => setSelected(selected?.id === f.id ? null : f)}>

              <div className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${SEVERITY[f.severity]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-gray-900 text-sm">{f.id}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeTag.color}`}>{typeTag.label}</span>
                    {f.status === 'resolved' && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Resolved</span>}
                    {f.status === 'open' && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Open</span>}
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{f.desc}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    <span>👤 {f.customer}</span>
                    <span>🔧 {f.appliance}</span>
                    <span>📍 {f.area}</span>
                    <span>👨‍🔧 {f.engineer}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {parseInt(f.overcharge.replace(/[^0-9]/g,'')) > 0 && (
                    <div className="text-red-600 font-extrabold text-sm">{f.overcharge}</div>
                  )}
                  {parseInt(f.overcharge.replace(/[^0-9]/g,'')) > 0 && (
                    <div className="text-xs text-gray-400">overcharge</div>
                  )}
                </div>
              </div>

              {/* Expanded detail */}
              {selected?.id === f.id && (() => {
                const invStatus = investigationStatus[f.id] ?? 'open'
                const dec       = decisions[f.id]
                return (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">

                    {/* Pattern label */}
                    <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">
                      <span className="text-xs text-gray-400">🔎</span>
                      <span className="text-xs font-semibold text-gray-600">{f.pattern}</span>
                    </div>

                    {/* Charge info */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-gray-400 mb-0.5">Customer phone</div>
                        <div className="font-bold text-gray-800">{f.phone}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-gray-400 mb-0.5">Total charged</div>
                        <div className="font-bold text-gray-800">{f.totalCharged}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-gray-400 mb-0.5">Expected charge</div>
                        <div className="font-bold text-gray-800">{f.expectedCharge}</div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div>
                      <div className="text-xs text-gray-400 mb-1.5 font-semibold">Event timestamps</div>
                      <div className="flex flex-wrap gap-2">
                        {f.dates.map((d, i) => (
                          <span key={i} className="text-xs bg-navy/10 text-navy font-semibold px-2 py-1 rounded-lg">{d}</span>
                        ))}
                      </div>
                    </div>

                    {f.note && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                        <span className="font-bold">Note: </span>{f.note}
                      </div>
                    )}

                    {/* ── Investigation workflow ── */}
                    {dec ? (
                      /* Decision recorded */
                      <div className={`rounded-xl p-4 border text-sm ${
                        dec.outcome === 'cleared'   ? 'bg-green-50 border-green-200'
                        : dec.outcome === 'confirmed' ? 'bg-red-50 border-red-200'
                        : 'bg-amber-50 border-amber-200'
                      }`}>
                        <p className={`font-bold mb-1 ${
                          dec.outcome === 'cleared'   ? 'text-green-800'
                          : dec.outcome === 'confirmed' ? 'text-red-800'
                          : 'text-amber-800'
                        }`}>
                          {dec.outcome === 'cleared'   ? 'Cleared — No fraud found'
                           : dec.outcome === 'confirmed' ? 'Confirmed fraud — Engineer flagged'
                           : 'More information requested'}
                        </p>
                        <p className="text-xs text-gray-500">Reviewed by Agent on {dec.at} · Decision recorded in audit log</p>
                      </div>
                    ) : invStatus === 'open' ? (
                      /* Not yet started */
                      <button
                        onClick={e => startInvestigation(f.id, e)}
                        className="w-full py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                        style={{ backgroundColor: '#00a1e1' }}>
                        Start Investigation
                      </button>
                    ) : (
                      /* Under review — full investigation panel */
                      <div className="border border-blue-100 rounded-2xl p-4 space-y-4" style={{ backgroundColor: 'rgba(0,161,225,0.04)' }}>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse"></span>
                          <span className="text-xs font-bold text-blue-700">Investigation in progress</span>
                        </div>

                        {/* Evidence */}
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-2">Evidence</p>
                          <div className="space-y-2">
                            {f.evidence.map(ev => (
                              <div key={ev.id} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-gray-100">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-50 text-base">
                                  {ev.type === 'image' ? '🖼️' : ev.type === 'audio' ? '🎙️' : '📄'}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-gray-800">{ev.label}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{ev.note}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Timeline */}
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-2">Event timeline</p>
                          <div className="space-y-2">
                            {f.timeline.map((ev, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <span className="text-xs text-gray-400 whitespace-nowrap w-28 flex-shrink-0 pt-0.5 font-mono">{ev.time}</span>
                                <p className="text-xs text-gray-700 leading-snug">{ev.event}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Technician response */}
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-1.5">Technician response</p>
                          <div className="bg-white rounded-xl p-3 border border-gray-100 text-xs text-gray-700 italic leading-relaxed">
                            &ldquo;{f.techResponse}&rdquo;
                          </div>
                        </div>

                        {/* Customer confirmation */}
                        <label
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={customerConfirmed[f.id] ?? false}
                            onChange={e => {
                              e.stopPropagation()
                              setCustomerConfirmed(prev => ({ ...prev, [f.id]: e.target.checked }))
                            }}
                            className="w-4 h-4 rounded accent-blue-500"
                            onClick={e => e.stopPropagation()}
                          />
                          <span className="text-xs font-medium text-gray-700">
                            Customer confirmed the visit / charge
                          </span>
                        </label>

                        {/* Decision buttons */}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={e => makeDecision(f.id, 'cleared', e)}
                            className="flex-1 bg-green-50 text-green-700 font-bold text-xs py-2.5 rounded-xl hover:bg-green-100 transition">
                            Clear — No fraud
                          </button>
                          <button
                            onClick={e => makeDecision(f.id, 'confirmed', e)}
                            className="flex-1 bg-red-50 text-red-600 font-bold text-xs py-2.5 rounded-xl hover:bg-red-100 transition">
                            Confirm fraud — Flag technician
                          </button>
                          <button
                            onClick={e => makeDecision(f.id, 'more-info', e)}
                            className="flex-1 bg-amber-50 text-amber-700 font-bold text-xs py-2.5 rounded-xl hover:bg-amber-100 transition">
                            Request more info
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ── Audit History ── */}
                    <div className="border border-gray-100 rounded-xl p-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Audit History</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex gap-3">
                          <span className="text-gray-400 whitespace-nowrap w-24 flex-shrink-0">Flag raised</span>
                          <span className="text-gray-700">
                            {new Date(f.raisedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-gray-400 whitespace-nowrap w-24 flex-shrink-0">Triggered by</span>
                          <span className="text-gray-700 font-mono">{f.raisedBy}</span>
                        </div>
                        {invStatus === 'under-review' && (
                          <div className="flex gap-3">
                            <span className="text-gray-400 whitespace-nowrap w-24 flex-shrink-0">Review started</span>
                            <span className="text-gray-700">Investigation in progress · Agent</span>
                          </div>
                        )}
                        {dec && (
                          <div className="flex gap-3">
                            <span className="text-gray-400 whitespace-nowrap w-24 flex-shrink-0">Decision</span>
                            <span className={`font-semibold ${
                              dec.outcome === 'cleared'   ? 'text-green-700'
                              : dec.outcome === 'confirmed' ? 'text-red-700'
                              : 'text-amber-700'
                            }`}>
                              {dec.outcome === 'cleared'    ? 'Cleared — No fraud'
                               : dec.outcome === 'confirmed'  ? 'Confirmed fraud'
                               : 'More information requested'}
                              {' — Reviewed by Agent on '}{dec.at}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                )
              })()}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">✅</div>
          <div className="font-semibold">No flags for this filter</div>
        </div>
      )}
    </div>
  )
}
