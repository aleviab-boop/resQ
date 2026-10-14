'use client'

import { useState } from 'react'
import { AI_INSIGHTS, PLATFORM_KPIS, CASES, PARTS_INVENTORY } from '@/lib/platformData'

const SKY   = '#00a1e1'
const NAVY  = '#13347b'

const TYPE_LABELS = {
  'anomaly':      { label: 'Anomaly',       bg: 'bg-orange-100 text-orange-700 border border-orange-200' },
  'parts-demand': { label: 'Parts Demand',  bg: 'bg-amber-100 text-amber-700 border border-amber-200' },
  'assignment':   { label: 'Assignment',    bg: 'bg-sky-100 text-sky-700 border border-sky-200' },
  'fraud-risk':   { label: 'Fraud Risk',    bg: 'bg-red-100 text-red-700 border border-red-200' },
  'recovery':     { label: 'Recovery',      bg: 'bg-purple-100 text-purple-700 border border-purple-200' },
}

const SOURCE_LABELS = {
  'rules+pattern': 'Rules + Pattern',
  'ml-forecast':   'ML Forecast',
  'ai-assignment': 'AI Assignment',
  'rules':         'Rules Engine',
}

const AUTOMATION_RULES = [
  { id: 'AR01', trigger: 'NPS < 5',            action: 'Auto-trigger recovery case',                        team: 'CX' },
  { id: 'AR02', trigger: 'SLA breach',          action: 'Escalate to manager + WhatsApp alert',              team: 'OPS' },
  { id: 'AR03', trigger: 'No-show (technician)', action: 'Auto-reschedule + compensation to customer',      team: 'OPS' },
  { id: 'AR04', trigger: 'Parts ETA > 7 days',  action: 'Proactive customer notification via WhatsApp',      team: 'CX' },
]

function getInsightResult(id) {
  switch (id) {
    case 'AI001': return (
      <span>Action queued: Redeploy T002 to Andheri for 3 days. Requires dispatch manager approval.{' '}
        <a href="/ops/dispatch" className="underline font-semibold">View dispatch →</a>
      </span>
    )
    case 'AI002': return 'Purchase order raised for 10x BRN-BSH-WM-01 (simulated). Parts team notified.'
    case 'AI003': return 'T005 Rohan Nair assigned to CS001. Slot: 15 Oct 10:00–12:00. Customer WhatsApp queued (simulated).'
    case 'AI004': return (
      <span>CS001 job records flagged for review. Payment hold activated (simulated).{' '}
        <a href="/fraud-ops" className="underline font-semibold">View fraud ops →</a>
      </span>
    )
    case 'AI005': return 'Recovery case CS006 escalated. Auto-apology WhatsApp + ₹300 goodwill coupon queued (simulated). Requires manager approval.'
    default: return 'Action applied (simulated).'
  }
}

function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100)
  const color = pct >= 90 ? '#10b981' : pct >= 75 ? SKY : '#f59e0b'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }}></div>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{pct}% confidence</span>
    </div>
  )
}

export default function AIPage() {
  const [dismissed, setDismissed]   = useState([])
  const [filter, setFilter]         = useState('all')
  const [toggles, setToggles]       = useState({ AR01: true, AR02: true, AR03: true, AR04: true })
  const [refreshing, setRefreshing] = useState(false)
  const [appliedActions, setAppliedActions] = useState({})   // insightId -> result text

  function dismiss(id) { setDismissed(d => [...d, id]) }

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  function toggleRule(id) {
    setToggles(t => ({ ...t, [id]: !t[id] }))
  }

  // Sort by priority: HIGH first
  const sorted = [...AI_INSIGHTS]
    .filter(a => !dismissed.includes(a.id))
    .filter(a => filter === 'all' || a.priority === filter || a.type === filter)
    .sort((a, b) => (a.priority === 'high' ? -1 : 1))

  // Anomaly rows for monitor
  const anomalies = AI_INSIGHTS.filter(a => ['anomaly', 'fraud-risk'].includes(a.type))

  const openCases      = CASES.filter(c => c.status === 'open').length
  const slaBreaches    = CASES.filter(c => c.slaBreached).length
  const partsShortages = PARTS_INVENTORY.filter(p => p.stock === 0).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: NAVY }}>AI Operations Centre</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Powered by resQ Intelligence — 14 Oct 2026
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-xl transition"
            style={{ background: SKY }}
          >
            <span className={refreshing ? 'animate-spin inline-block' : ''}>⟳</span>
            {refreshing ? 'Refreshing…' : 'Refresh Insights'}
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-8">

        {/* SECTION 1 — DAILY BRIEF */}
        <section>
          <div className="rounded-2xl p-6" style={{ background: NAVY }}>
            <div className="flex items-start gap-4">
              <div className="text-3xl mt-0.5">🤖</div>
              <div className="flex-1">
                <p className="text-white font-semibold text-lg mb-3">
                  Good morning. Here's your daily ops brief for 14 October 2026.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-blue-100">
                    <span className="mt-0.5 text-red-400 font-bold">•</span>
                    <span><span className="text-white font-semibold">{openCases} open cases</span>, {slaBreaches} with SLA breaches — immediate attention needed</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-100">
                    <span className="mt-0.5 text-amber-400 font-bold">•</span>
                    <span><span className="text-white font-semibold">14 installation backlog</span> in Andheri (400053–400059) — engineer redeployment recommended</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-100">
                    <span className="mt-0.5 text-orange-400 font-bold">•</span>
                    <span><span className="text-white font-semibold">{partsShortages} parts shortages</span> — Drum Bearing (Bosch WM) and Motor (Bosch WM) out of stock</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-100">
                    <span className="mt-0.5 text-purple-400 font-bold">•</span>
                    <span><span className="text-white font-semibold">1 recovery case overdue</span> (CS006) — Deepak Joshi callback 72h overdue, complaint email received</span>
                  </li>
                </ul>

                <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                  <span className="text-blue-200 text-sm">
                    <span className="text-white font-bold">{AI_INSIGHTS.length} AI recommendations</span> waiting for your review
                  </span>
                  <span className="text-xs text-blue-300">Generated 14 Oct 2026 · 08:00 IST</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — AI INSIGHTS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">AI Insights</h2>
            {/* Filter pills */}
            <div className="flex gap-2">
              {['all','high','medium','anomaly','assignment','recovery'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1 rounded-full font-medium capitalize transition ${filter === f ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  style={filter === f ? { background: SKY } : {}}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {sorted.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-200">
              All insights dismissed or filtered out.
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {sorted.map(insight => {
              const typeInfo = TYPE_LABELS[insight.type] || { label: insight.type, bg: 'bg-gray-100 text-gray-600' }
              return (
                <div key={insight.id} className={`bg-white rounded-2xl border-2 shadow-sm p-5 flex flex-col gap-3 ${insight.priority === 'high' ? 'border-red-200' : 'border-amber-100'}`}>
                  {/* Priority + type badges */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${insight.priority === 'high' ? 'bg-red-500 text-white' : 'bg-amber-400 text-white'}`}>
                      {insight.priority.toUpperCase()}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${typeInfo.bg}`}>
                      {typeInfo.label}
                    </span>
                    <span className="ml-auto text-xs text-gray-400">{insight.id}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 leading-snug">{insight.title}</h3>

                  {/* Summary */}
                  <p className="text-sm text-gray-600 leading-relaxed">{insight.summary}</p>

                  {/* Recommendation box */}
                  <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-sky-700 mb-1">→ Recommended action:</p>
                    <p className="text-sm text-gray-700">{insight.recommendation}</p>
                  </div>

                  {/* Confidence */}
                  <ConfidenceBar value={insight.confidence} />

                  {/* Source */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Source: <span className="font-medium text-gray-600">{SOURCE_LABELS[insight.source] || insight.source}</span></span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setAppliedActions(a => ({ ...a, [insight.id]: true }))}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition"
                      style={{ background: appliedActions[insight.id] ? '#10b981' : SKY }}
                    >
                      {appliedActions[insight.id] ? 'Applied (simulated)' : 'Apply Recommendation'}
                    </button>
                    <button
                      onClick={() => dismiss(insight.id)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                    >
                      Dismiss
                    </button>
                  </div>
                  {appliedActions[insight.id] && (
                    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
                      {getInsightResult(insight.id)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* SECTION 3 — ANOMALY DETECTION PANEL */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold text-gray-800">Live Anomaly Monitor</h2>
            <span className="flex items-center gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block"></span>
              {anomalies.length} active
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['ID', 'Type', 'Location / Context', 'Severity', 'Detected At', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {anomalies.map((a, i) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{a.id}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_LABELS[a.type]?.bg || 'bg-gray-100 text-gray-600'}`}>
                        {TYPE_LABELS[a.type]?.label || a.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs">
                      <span className="line-clamp-2 text-xs">{a.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {a.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {i === 0 ? '14 Oct · 08:00' : '12 Oct · 09:30'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                        Under Review
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4 — AUTOMATION RULES */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Active Automation Rules</h2>
            <a href="/ops/admin" className="text-sm font-semibold" style={{ color: SKY }}>
              Manage Rules →
            </a>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            {AUTOMATION_RULES.map((rule, idx) => (
              <div key={rule.id} className={idx > 0 ? 'border-t border-gray-100' : ''}>
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${toggles[rule.id] ? 'bg-green-500' : 'bg-gray-200'}`}
                    role="switch"
                    aria-checked={toggles[rule.id]}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${toggles[rule.id] ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 font-mono">{rule.id}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{rule.team}</span>
                    </div>
                    <div className="mt-0.5">
                      <span className="text-sm font-semibold text-gray-800">
                        IF <span className="text-red-600 font-bold">{rule.trigger}</span>
                      </span>
                      <span className="text-sm text-gray-500"> → {rule.action}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-gray-400 italic">(rule-based, not connected to notification service)</div>
                  </div>

                  {/* Status + Edit */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${toggles[rule.id] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {toggles[rule.id] ? 'Active' : 'Paused'}
                    </span>
                    <button className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 px-2.5 py-1 rounded-lg transition">
                      Edit
                    </button>
                  </div>
                </div>
                {/* Side effects when rule is ON */}
                {toggles[rule.id] && rule.id === 'AR01' && (
                  <div className="mx-5 mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                    <span className="font-bold">1 customer meets this condition:</span> Deepak Joshi (NPS 3). Recovery case CS006 has been created (simulated).{' '}
                    <a href="/ops/cases/CS006" className="text-[#00a1e1] hover:underline font-semibold">View case →</a>
                  </div>
                )}
                {toggles[rule.id] && rule.id === 'AR02' && (
                  <div className="mx-5 mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                    <span className="font-bold">2 cases currently in breach:</span> CS001, CS006. Manager WhatsApp alert queued (simulated). No action taken — approval required.
                  </div>
                )}
                {toggles[rule.id] && rule.id === 'AR04' && (
                  <div className="mx-5 mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                    <span className="font-bold">1 case affected:</span> CS003 (drum bearing ETA ~5 days from order date). Customer notification queued (simulated).
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 px-1">Toggles are visual only. To activate changes in production, use the rule engine in /ops/admin.</p>
        </section>

      </div>
    </div>
  )
}
