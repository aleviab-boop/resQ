'use client'

import Link from 'next/link'
import OpsShell, { StatCard, SectionLabel, ActionBtn } from '@/components/OpsShell'
import {
  PLATFORM_KPIS,
  BRANDS,
  CASES,
  AI_INSIGHTS,
  PARTS_INVENTORY,
} from '@/lib/platformData'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatLakhs(n) {
  const abs = Math.abs(n)
  if (abs >= 100000) {
    const l = abs / 100000
    return (n < 0 ? '−' : '') + '₹' + l.toFixed(2) + 'L'
  }
  return (n < 0 ? '−' : '') + '₹' + abs.toLocaleString('en-IN')
}

function formatIndian(n) {
  return n.toLocaleString('en-IN')
}

function pct(n) {
  return Math.round(n * 100) + '%'
}

// ─── Derived Data ─────────────────────────────────────────────────────────────
const topLossBrands = BRANDS
  .filter((b) => !b.isOwn)
  .map((b) => ({
    ...b,
    margin:       b.paidPerJob - b.actualCost,
    monthlyImpact: (b.paidPerJob - b.actualCost) * b.jobsMonth,
  }))
  .sort((a, b) => a.monthlyImpact - b.monthlyImpact)
  .slice(0, 5)

const worstSLA = BRANDS
  .filter((b) => !b.isOwn)
  .sort((a, b) => b.slaBreaches - a.slaBreaches)
  .slice(0, 5)

const statusOrder  = ['open', 'in-progress', 'parts-awaited', 'scheduled', 'resolved', 'completed']
const statusLabels = {
  'open':          'Open',
  'in-progress':   'In Progress',
  'parts-awaited': 'Parts Awaited',
  'scheduled':     'Scheduled',
  'resolved':      'Resolved',
  'completed':     'Completed',
}
const statusColors = {
  'open':          'bg-red-500',
  'in-progress':   'bg-blue-500',
  'parts-awaited': 'bg-amber-400',
  'scheduled':     'bg-sky-400',
  'resolved':      'bg-green-500',
  'completed':     'bg-green-700',
}
const statusTextColors = {
  'open':          'text-red-600',
  'in-progress':   'text-blue-600',
  'parts-awaited': 'text-amber-600',
  'scheduled':     'text-sky-600',
  'resolved':      'text-green-600',
  'completed':     'text-green-700',
}

const caseStatusCounts = CASES.reduce((acc, c) => {
  acc[c.status] = (acc[c.status] || 0) + 1
  return acc
}, {})
const totalCases = CASES.length

const highInsights = AI_INSIGHTS.filter((a) => a.priority === 'high').slice(0, 3)
const recoveryCase = CASES.find((c) => c.type === 'recovery' && c.status === 'open')

const insightTypeBadge = {
  anomaly:       { label: 'Anomaly',    cls: 'bg-red-100 text-red-700' },
  'fraud-risk':  { label: 'Fraud Risk', cls: 'bg-purple-100 text-purple-700' },
  recovery:      { label: 'Recovery',   cls: 'bg-amber-100 text-amber-700' },
  assignment:    { label: 'Assignment', cls: 'bg-blue-100 text-blue-700' },
  'parts-demand':{ label: 'Parts',      cls: 'bg-sky-100 text-sky-700' },
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function PulsingDot() {
  return (
    <span className="relative flex items-center gap-1.5">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
      </span>
      <span className="text-green-600 text-xs font-semibold tracking-wide uppercase">Live</span>
    </span>
  )
}

function WarnIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}

const BRAND_PALETTE = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-amber-100 text-amber-700',
  'bg-red-100 text-red-700',
  'bg-sky-100 text-sky-700',
]

function BrandInitial({ name, size = 'md' }) {
  const idx     = (name?.charCodeAt(0) ?? 0) % BRAND_PALETTE.length
  const sizeCls = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'
  return (
    <span className={`${sizeCls} ${BRAND_PALETTE[idx]} rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
      {name?.charAt(0) ?? '?'}
    </span>
  )
}

// Inline section header with optional link (matches SectionLabel style but adds link)
function SectionRow({ children, linkLabel, linkHref }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 whitespace-nowrap">{children}</p>
      <div className="flex-1 h-px bg-gray-100" />
      {linkLabel && linkHref && (
        <Link href={linkHref} className="text-xs text-[#00a1e1] font-medium hover:underline whitespace-nowrap">
          {linkLabel}
        </Link>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OpsDashboardPage() {
  const totalBrandLoss = topLossBrands.reduce((s, b) => s + b.monthlyImpact, 0)

  return (
    <OpsShell
      title="Leadership Dashboard"
      subtitle="Real-time KPIs · SLA health · Revenue attribution"
      breadcrumb={[{ label: 'Dashboard' }]}
      actions={
        <>
          <PulsingDot />
          <ActionBtn>Export</ActionBtn>
          <ActionBtn variant="primary">Share Brief</ActionBtn>
        </>
      }
    >

      {/* ── KPI Strip ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard
          label="Open Cases"
          value={PLATFORM_KPIS.totalCasesOpen}
          sub="vs last week +2"
          color="text-red-600"
        />
        <StatCard
          label="SLA Breach Rate"
          value={pct(PLATFORM_KPIS.slaBreachRate)}
          sub="25% of cases breached"
          color="text-amber-600"
        />
        <StatCard
          label="First-Visit Resolution"
          value={pct(PLATFORM_KPIS.firstVisitResolution)}
          sub="Target: 75%"
          color="text-green-600"
        />
        <StatCard
          label="Avg Resolution"
          value={`${PLATFORM_KPIS.avgResolutionHours}h`}
          sub="Target: 36h"
          color="text-[#00a1e1]"
        />
        <StatCard
          label="Service NPS"
          value={PLATFORM_KPIS.serviceNps.toFixed(1)}
          sub="Target: 8.0 / 10"
          color="text-red-500"
        />
        <StatCard
          label="Brand Loss / Mo"
          value={formatLakhs(Math.abs(totalBrandLoss))}
          sub="Top 5 loss brands"
          color="text-red-700"
        />
      </div>

      {/* ── Second Row: Utilization / Backlog / Parts ──────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-5">

        {/* Technician Utilization */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Technician Utilization</p>
            <span className="text-xl font-extrabold text-[#00a1e1]">{pct(PLATFORM_KPIS.technicianUtilization)}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-[#00a1e1] transition-all"
              style={{ width: `${PLATFORM_KPIS.technicianUtilization * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-gray-400">
            <span>0%</span>
            <span className="text-amber-500 font-medium">Target 85%</span>
            <span>100%</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            17 / 24 engineers active across 5 service centres
          </div>
        </div>

        {/* Installation Backlog */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Installation Backlog</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-red-600">{PLATFORM_KPIS.installationBacklog}</span>
                <span className="text-sm text-gray-500">cases</span>
              </div>
            </div>
            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">URGENT</span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-500">Oldest: 5 months (CS001)</span>
            <Link href="/ops/cases" className="text-xs text-[#00a1e1] font-semibold hover:underline">View</Link>
          </div>
        </div>

        {/* Parts Shortages */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Parts Shortages</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-amber-600">{PLATFORM_KPIS.partsShortages}</span>
                <span className="text-sm text-gray-500">SKUs</span>
              </div>
            </div>
            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">ACTION NEEDED</span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-500">Drum Bearing, Bosch Motor</span>
            <Link href="/parts" className="text-xs text-[#00a1e1] font-semibold hover:underline">View</Link>
          </div>
        </div>
      </div>

      {/* ── Brand P&L Table ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <SectionRow linkLabel="View Full Report" linkHref="/brand-ops">
          Brand P&L — This Month
        </SectionRow>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 pr-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand</th>
              <th className="text-right py-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Jobs / Mo</th>
              <th className="text-right py-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Paid / Job</th>
              <th className="text-right py-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Actual Cost</th>
              <th className="text-right py-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Margin / Job</th>
              <th className="text-right py-2 pl-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Monthly Impact</th>
              <th className="w-6" />
            </tr>
          </thead>
          <tbody>
            {topLossBrands.map((b) => {
              const isWorst = b.id === 'B002'
              return (
                <tr
                  key={b.id}
                  className={`border-b border-gray-50 ${isWorst ? 'bg-red-50/60' : 'hover:bg-gray-50'}`}
                >
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <BrandInitial name={b.name} />
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{b.name}</div>
                        <div className="text-xs text-gray-400">{b.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-2.5 px-3 text-gray-700 font-mono text-xs">
                    {formatIndian(b.jobsMonth)}
                  </td>
                  <td className="text-right py-2.5 px-3 text-gray-700 font-mono text-xs">
                    ₹{b.paidPerJob}
                  </td>
                  <td className="text-right py-2.5 px-3 text-gray-700 font-mono text-xs">
                    ₹{b.actualCost}
                  </td>
                  <td className="text-right py-2.5 px-3 font-mono text-xs font-bold text-red-600">
                    −₹{Math.abs(b.margin)}
                  </td>
                  <td className="text-right py-2.5 pl-3 font-mono text-xs font-bold text-red-600">
                    {formatLakhs(b.monthlyImpact)}/mo
                  </td>
                  <td className="text-center py-2.5">
                    {b.flagged && (
                      <span title={b.flagReason} className="text-amber-500 cursor-help inline-flex items-center">
                        <WarnIcon className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="bg-red-50 border-t-2 border-red-200">
              <td colSpan={4} className="py-2 text-xs font-bold text-red-700 pr-4">
                Total loss from top 5 loss-making brands
              </td>
              <td />
              <td className="text-right py-2 pl-3 text-xs font-bold text-red-700 font-mono">
                {formatLakhs(totalBrandLoss)}/mo
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
        <div className="mt-3 flex items-center gap-2">
          <WarnIcon className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span className="text-xs text-gray-500">
            Sony flagged as worst: ₹400 paid / ₹620 cost = −₹220/job → −₹2.73L/month loss
          </span>
        </div>
      </div>

      {/* ── SLA + Case Status + Recovery ──────────────────────────────────────── */}
      <div className="grid grid-cols-5 gap-4 mb-5">

        {/* LEFT 60%: SLA Performance by Brand */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <SectionRow linkLabel="All Brands" linkHref="/brand-ops">
            SLA Performance by Brand
          </SectionRow>
          <div className="space-y-3">
            {worstSLA.map((b) => {
              const breachRate = b.slaBreaches / b.jobsMonth
              const onTimeRate = 1 - breachRate
              return (
                <div key={b.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <BrandInitial name={b.name} size="sm" />
                      <span className="text-xs font-semibold text-gray-700">{b.name}</span>
                      {b.contractStatus === 'Review' && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">REVIEW</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-red-600 font-bold">{b.slaBreaches} breaches</span>
                      <span className="text-xs text-gray-400 font-mono w-10 text-right">
                        {(breachRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full flex overflow-hidden">
                    <div
                      className="h-full bg-green-400 rounded-l-full transition-all"
                      style={{ width: `${onTimeRate * 100}%` }}
                    />
                    <div
                      className="h-full bg-red-400 transition-all"
                      style={{ width: `${breachRate * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-0.5">
                    <span className="text-[10px] text-green-600">{(onTimeRate * 100).toFixed(1)}% on-time</span>
                    <span className="text-[10px] text-gray-400">{formatIndian(b.jobsMonth)} jobs</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 bg-green-400 rounded" />
              <span className="text-xs text-gray-500">On-time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 bg-red-400 rounded" />
              <span className="text-xs text-gray-500">SLA Breached</span>
            </div>
            <span className="text-xs text-gray-400 ml-auto">5 worst brands by breach count</span>
          </div>
        </div>

        {/* RIGHT 40%: Case Status Distribution + Recovery Queue */}
        <div className="col-span-2 space-y-4">

          {/* Case Status Distribution */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <SectionLabel>Case Status Distribution</SectionLabel>
            {/* Stacked bar */}
            <div className="w-full h-4 rounded-full flex overflow-hidden mb-3">
              {statusOrder.map((status) => {
                const count = caseStatusCounts[status] || 0
                const widthPct = (count / totalCases) * 100
                if (count === 0) return null
                return (
                  <div
                    key={status}
                    className={`h-full ${statusColors[status]} transition-all`}
                    style={{ width: `${widthPct}%` }}
                    title={`${statusLabels[status]}: ${count}`}
                  />
                )
              })}
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {statusOrder.map((status) => {
                const count = caseStatusCounts[status] || 0
                if (count === 0) return null
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
                      <span className="text-xs text-gray-600">{statusLabels[status]}</span>
                    </div>
                    <span className={`text-xs font-bold ${statusTextColors[status]}`}>{count}</span>
                  </div>
                )
              })}
            </div>
            <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
              {totalCases} total cases · {PLATFORM_KPIS.totalCasesOpen} active
            </div>
          </div>

          {/* Recovery Queue */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <SectionLabel>Recovery Queue</SectionLabel>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-extrabold text-amber-600">
                {PLATFORM_KPIS.recoveryPending}
              </span>
              <span className="text-xs text-gray-500">open recovery case</span>
            </div>
            {recoveryCase && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-amber-800">{recoveryCase.id}</div>
                    <div className="text-xs text-gray-700 mt-0.5 leading-snug">
                      {recoveryCase.title}
                    </div>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        SLA BREACHED
                      </span>
                      <span className="text-[10px] text-gray-400">· callback overdue 72h</span>
                    </div>
                  </div>
                  <Link
                    href={`/ops/cases/${recoveryCase.id}`}
                    className="text-xs text-[#00a1e1] font-semibold hover:underline whitespace-nowrap"
                  >
                    Review
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── NPS + AI Flags ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-5 gap-4 mb-6">

        {/* LEFT: NPS Trend */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <SectionLabel>NPS Trend</SectionLabel>
          <div className="space-y-4">

            {/* Service NPS */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-600">Service NPS</span>
                <span className="text-sm font-bold text-red-500">
                  {PLATFORM_KPIS.serviceNps.toFixed(1)}
                  <span className="text-xs text-gray-400 font-normal"> / 10</span>
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-5 relative">
                <div
                  className="h-5 rounded-full bg-red-400 transition-all"
                  style={{ width: `${(PLATFORM_KPIS.serviceNps / 10) * 100}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-multiply">
                  {PLATFORM_KPIS.serviceNps.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Store NPS */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-600">Store NPS</span>
                <span className="text-sm font-bold text-amber-500">
                  {PLATFORM_KPIS.storeNps.toFixed(1)}
                  <span className="text-xs text-gray-400 font-normal"> / 10</span>
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-5 relative">
                <div
                  className="h-5 rounded-full bg-amber-400 transition-all"
                  style={{ width: `${(PLATFORM_KPIS.storeNps / 10) * 100}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-multiply">
                  {PLATFORM_KPIS.storeNps.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Target */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-600">Target</span>
                <span className="text-sm font-bold text-green-600">
                  8.0
                  <span className="text-xs text-gray-400 font-normal"> / 10</span>
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-5 relative">
                <div
                  className="h-5 rounded-full bg-green-400 transition-all"
                  style={{ width: '80%' }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-multiply">
                  8.0
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
              Service NPS below target by 1.8 pts · 68% response rate
            </div>
          </div>
        </div>

        {/* RIGHT: AI Flags Today */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 whitespace-nowrap">AI Flags Today</p>
            <div className="flex-1 h-px bg-gray-100" />
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {highInsights.length} HIGH
            </span>
            <Link href="/ops/ai" className="text-xs text-[#00a1e1] font-medium hover:underline">
              All flags
            </Link>
          </div>
          <div className="space-y-2.5">
            {highInsights.map((insight) => {
              const badge = insightTypeBadge[insight.type] || { label: insight.type, cls: 'bg-gray-100 text-gray-600' }
              return (
                <div
                  key={insight.id}
                  className="border border-red-100 bg-red-50/40 rounded-xl p-3 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${badge.cls}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {(insight.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-gray-800 leading-snug">
                      {insight.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">
                      {insight.recommendation}
                    </div>
                  </div>
                  <Link
                    href="/ops/ai"
                    className="text-xs bg-[#13347b] hover:bg-[#0f2860] text-white px-2.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors"
                  >
                    Review
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 pb-4 text-xs text-gray-400">
        <span>resQ Ops Platform · Senior Leadership View · Data refreshed live</span>
        <span>14 Oct 2026 · Mumbai Region</span>
      </div>

    </OpsShell>
  )
}
