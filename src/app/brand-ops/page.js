'use client'

import { useState, useMemo } from 'react'

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
const grossProfit = (b) =>
  b.isOwnBrand ? null : (b.paidPerJob - b.actualCost) * b.jobsThisMonth

const plPerJob = (b) =>
  b.isOwnBrand ? null : b.paidPerJob - b.actualCost

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.abs(n))

const fmtCrore = (n) => {
  const abs = Math.abs(n)
  if (abs >= 1e7) return `${(n / 1e7).toFixed(2)} Cr`
  if (abs >= 1e5) return `${(n / 1e5).toFixed(1)} L`
  return `₹${fmt(n)}`
}

const npsColor = (nps) => {
  if (nps > 74) return 'text-emerald-600 font-semibold'
  if (nps >= 60) return 'text-amber-600 font-semibold'
  return 'text-red-600 font-semibold'
}

const plColor = (val) =>
  val > 0 ? 'text-emerald-600 font-bold' : val < 0 ? 'text-red-600 font-bold' : 'text-gray-500'

// ─── Summary tile ──────────────────────────────────────────────────────────────
function Tile({ label, value, sub, accent, children }) {
  return (
    <div className={`bg-white rounded-2xl shadow-card p-5 flex flex-col gap-1 ${accent ? 'border-l-4 ' + accent : ''}`}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
      {children}
    </div>
  )
}

// ─── Bar chart (div-based) ─────────────────────────────────────────────────────
const CHART_MAX = Math.max(...BRANDS.filter(b => !b.isOwnBrand).flatMap(b => [b.paidPerJob, b.actualCost]))

function BrandBar({ brand }) {
  const paidPct = (brand.paidPerJob / CHART_MAX) * 100
  const costPct  = (brand.actualCost  / CHART_MAX) * 100
  const isLoss   = brand.actualCost > brand.paidPerJob

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {/* Brand label */}
      <div className="w-24 shrink-0 flex items-center gap-1.5 pt-1">
        <span className="text-lg leading-none">{brand.logo}</span>
        <span className="text-xs font-semibold text-gray-700 leading-tight">{brand.name}</span>
      </div>

      {/* Bars */}
      <div className="flex-1 flex flex-col gap-1.5">
        {/* Paid per job */}
        <div className="flex items-center gap-2">
          <div
            className="h-5 rounded-full bg-sky flex items-center justify-end pr-2 transition-all"
            style={{ width: `${paidPct}%`, minWidth: '2px', backgroundColor: '#00a1e1' }}
          >
            <span className="text-[10px] font-bold text-white whitespace-nowrap">₹{fmt(brand.paidPerJob)}</span>
          </div>
        </div>
        {/* Actual cost */}
        <div className="flex items-center gap-2">
          <div
            className="h-5 rounded-full flex items-center justify-end pr-2 transition-all"
            style={{
              width: `${costPct}%`,
              minWidth: '2px',
              backgroundColor: isLoss ? '#ef4444' : '#10b981',
            }}
          >
            <span className="text-[10px] font-bold text-white whitespace-nowrap">₹{fmt(brand.actualCost)}</span>
          </div>
        </div>
      </div>

      {/* P&L badge */}
      <div className="w-20 shrink-0 text-right pt-1">
        <span className={`text-xs font-bold ${isLoss ? 'text-red-600' : 'text-emerald-600'}`}>
          {isLoss ? '−' : '+'}₹{fmt(Math.abs(plPerJob(brand)))} / job
        </span>
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

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function BrandOpsPage() {
  const [categoryFilter, setCategoryFilter] = useState('All')

  // ── Derived summary ──────────────────────────────────────────────────────────
  const totalJobs       = BRANDS.reduce((s, b) => s + b.jobsThisMonth, 0)
  const relianceJobs    = BRANDS.find(b => b.isOwnBrand)?.jobsThisMonth ?? 0
  const ownSharePct     = Math.round((relianceJobs / totalJobs) * 100)
  const totalBreaches   = BRANDS.reduce((s, b) => s + b.slaBreaches, 0)
  const lossBrands      = BRANDS.filter(b => !b.isOwnBrand && b.actualCost > b.paidPerJob)
  const totalRevenue    = BRANDS.reduce((s, b) => s + (b.revenue ?? 0), 0)

  // ── Table rows: own brand first, then by total P&L desc ─────────────────────
  const categories = ['All', ...Array.from(new Set(BRANDS.filter(b => !b.isOwnBrand).map(b => b.category)))]

  const tableRows = useMemo(() => {
    const own   = BRANDS.filter(b => b.isOwnBrand)
    const third = BRANDS.filter(b => !b.isOwnBrand)
      .filter(b => categoryFilter === 'All' || b.category === categoryFilter)
      .sort((a, b) => (grossProfit(b) ?? 0) - (grossProfit(a) ?? 0))
    return [...own, ...third]
  }, [categoryFilter])

  // ── SLA leaderboard top 5 ───────────────────────────────────────────────────
  const slaTop5 = [...BRANDS]
    .sort((a, b) => b.slaBreaches - a.slaBreaches)
    .slice(0, 5)

  // ── Chart brands (non-own only) ─────────────────────────────────────────────
  const chartBrands = BRANDS.filter(b => !b.isOwnBrand)
    .sort((a, b) => (b.paidPerJob - b.actualCost) - (a.paidPerJob - a.actualCost))

  return (
    <div className="min-h-screen" style={{ background: '#f5f7fa' }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #13347b 0%, #00a1e1 100%)' }}
            >
              🤝
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                Brand Operations
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Multi-brand SLA&nbsp;&nbsp;·&nbsp;&nbsp;Cost Attribution&nbsp;&nbsp;·&nbsp;&nbsp;P&amp;L
              </p>
            </div>
          </div>

          {/* Period badge */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white rounded-xl shadow-card px-4 py-2 text-sm text-gray-600">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            October 2026&nbsp;&nbsp;·&nbsp;&nbsp;Month to date
          </div>
        </div>

        {/* ── Summary tiles ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">

          <Tile label="Total Brands" value="10" sub="1 own + 9 third-party" />

          <Tile
            label="Total Jobs (MTD)"
            value={new Intl.NumberFormat('en-IN').format(totalJobs)}
            sub="across all brands"
          />

          <div className="bg-white rounded-2xl shadow-card p-5 flex flex-col gap-1 col-span-2 sm:col-span-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Own Brand Share</p>
            <p className="text-2xl font-extrabold" style={{ color: '#13347b' }}>{ownSharePct}%</p>
            <p className="text-xs text-gray-500">{new Intl.NumberFormat('en-IN').format(relianceJobs)} Reliance jobs</p>
            <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${ownSharePct}%`, background: 'linear-gradient(90deg, #13347b, #00a1e1)' }}
              />
            </div>
          </div>

          <Tile
            label="Loss-making Brands"
            value={lossBrands.length}
            sub={`of ${BRANDS.length - 1} third-party`}
            accent="border-amber-400"
          >
            <p className="text-xs text-amber-600 font-medium mt-1">Renegotiation needed</p>
          </Tile>

          <Tile
            label="Total SLA Breaches"
            value={new Intl.NumberFormat('en-IN').format(totalBreaches)}
            sub="this month"
            accent="border-red-400"
          >
            <p className="text-xs text-red-500 font-medium mt-1">Review breach SLAs</p>
          </Tile>
        </div>

        {/* ── Revenue vs Cost chart ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900">Paid Rate vs Actual Cost — per Job</h2>
              <p className="text-xs text-gray-500 mt-0.5">Third-party brands only · sorted by margin</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#00a1e1' }} />
                Paid rate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full inline-block bg-red-400" />
                Actual cost (loss)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full inline-block bg-emerald-500" />
                Actual cost (profit)
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {chartBrands.map(b => <BrandBar key={b.id} brand={b} />)}
          </div>
        </div>

        {/* ── Brand roster table ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900">Brand Roster</h2>
              <p className="text-xs text-gray-500 mt-0.5">Own brand first · third-party sorted by P&amp;L</p>
            </div>
            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    categoryFilter === cat
                      ? 'text-white border-transparent'
                      : 'text-gray-600 border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  style={categoryFilter === cat ? { background: '#13347b', borderColor: '#13347b' } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    'Brand', 'Category', 'Jobs', 'Revenue', 'Paid / Job',
                    'Cost / Job', 'P&L / Job', 'Total P&L', 'SLA Days',
                    'SLA Breaches', 'NPS'
                  ].map(col => (
                    <th key={col} className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pr-4 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map(b => {
                  const pl      = plPerJob(b)
                  const totalPl = grossProfit(b)
                  const isOwn   = b.isOwnBrand

                  return (
                    <tr
                      key={b.id}
                      className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors ${isOwn ? '' : ''}`}
                      style={isOwn ? { background: '#f0f9ff' } : {}}
                    >
                      {/* Brand */}
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className="text-xl leading-none">{b.logo}</span>
                          <div>
                            <p className="font-semibold text-gray-900 text-xs">{b.name}</p>
                            {isOwn && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: '#13347b' }}>
                                Own
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 pr-4 text-xs text-gray-500 whitespace-nowrap">{b.category}</td>

                      {/* Jobs */}
                      <td className="py-3 pr-4 text-xs font-semibold text-gray-800">
                        {new Intl.NumberFormat('en-IN').format(b.jobsThisMonth)}
                      </td>

                      {/* Revenue */}
                      <td className="py-3 pr-4 text-xs text-gray-700">
                        {isOwn ? <span className="text-gray-400 italic">—</span> : fmtCrore(b.revenue)}
                      </td>

                      {/* Paid / job */}
                      <td className="py-3 pr-4 text-xs text-gray-700">
                        {isOwn ? <span className="text-gray-400 italic">—</span> : `₹${b.paidPerJob}`}
                      </td>

                      {/* Actual cost / job */}
                      <td className="py-3 pr-4 text-xs text-gray-700">₹{b.actualCost}</td>

                      {/* P&L / job */}
                      <td className="py-3 pr-4 text-xs whitespace-nowrap">
                        {pl === null ? (
                          <span className="text-gray-400 italic">Cost centre</span>
                        ) : (
                          <span className={plColor(pl)}>
                            {pl >= 0 ? '+' : '−'}₹{fmt(Math.abs(pl))}
                          </span>
                        )}
                      </td>

                      {/* Total P&L */}
                      <td className="py-3 pr-4 text-xs whitespace-nowrap">
                        {totalPl === null ? (
                          <span className="text-gray-400 italic">—</span>
                        ) : (
                          <span className={plColor(totalPl)}>
                            {totalPl >= 0 ? '+' : '−'}{fmtCrore(Math.abs(totalPl))}
                          </span>
                        )}
                      </td>

                      {/* SLA days */}
                      <td className="py-3 pr-4 text-xs text-center">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          {b.slaDays}d
                        </span>
                      </td>

                      {/* SLA breaches */}
                      <td className="py-3 pr-4 text-xs text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          b.slaBreaches > 40 ? 'bg-red-50 text-red-700' :
                          b.slaBreaches > 20 ? 'bg-amber-50 text-amber-700' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          {b.slaBreaches}
                        </span>
                      </td>

                      {/* NPS */}
                      <td className="py-3 pr-4 text-xs text-center">
                        <NpsBadge nps={b.nps} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Bottom row: Alert + SLA leaderboard ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Alert: Renegotiation Needed */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-amber-400" style={{ background: 'linear-gradient(90deg, #fffbeb, #fff)' }}>
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <h2 className="text-base font-bold text-amber-800">Renegotiation Needed</h2>
              </div>
              <p className="text-xs text-amber-700 mt-0.5">
                {lossBrands.length} brand{lossBrands.length !== 1 ? 's' : ''} paying below actual service cost — every job loses money
              </p>
            </div>

            <div className="p-5 flex flex-col gap-3">
              {lossBrands
                .sort((a, b) => (a.paidPerJob - a.actualCost) - (b.paidPerJob - b.actualCost))
                .map(b => {
                  const lossPerJob   = b.actualCost - b.paidPerJob
                  const totalLoss    = lossPerJob * b.jobsThisMonth

                  return (
                    <div
                      key={b.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-red-100"
                      style={{ background: '#fff5f5' }}
                    >
                      <span className="text-2xl leading-none shrink-0">{b.logo}</span>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{b.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{b.category}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                          <span className="text-xs text-gray-600">
                            Paid <strong className="text-gray-800">₹{b.paidPerJob}</strong>
                          </span>
                          <span className="text-xs text-gray-600">
                            Cost <strong className="text-gray-800">₹{b.actualCost}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-500 mb-1">Loss / job</p>
                        <p className="text-lg font-extrabold text-red-600">−₹{fmt(lossPerJob)}</p>
                        <p className="text-xs text-red-500 font-semibold mt-0.5">
                          −{fmtCrore(totalLoss)} / month
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Intl.NumberFormat('en-IN').format(b.jobsThisMonth)} jobs
                        </p>
                      </div>
                    </div>
                  )
                })}

              {/* Total loss footer */}
              <div
                className="flex items-center justify-between p-4 rounded-xl mt-1"
                style={{ background: 'linear-gradient(90deg, #fef2f2, #fff5f5)', border: '1px solid #fecaca' }}
              >
                <p className="text-sm font-bold text-red-800">Total monthly loss on loss-making brands</p>
                <p className="text-xl font-extrabold text-red-700">
                  −{fmtCrore(
                    lossBrands.reduce((s, b) => s + (b.actualCost - b.paidPerJob) * b.jobsThisMonth, 0)
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* SLA breach leaderboard */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100" style={{ background: 'linear-gradient(90deg, #eff6ff, #fff)' }}>
              <div className="flex items-center gap-2">
                <span className="text-lg">🚨</span>
                <h2 className="text-base font-bold text-gray-900">SLA Breach Leaders</h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Top 5 brands by breach count this month</p>
            </div>

            <div className="p-5 flex flex-col gap-3">
              {slaTop5.map((b, idx) => {
                const rankColors = ['#ef4444', '#f97316', '#f59e0b', '#6b7280', '#9ca3af']
                const rankBg     = ['bg-red-50', 'bg-orange-50', 'bg-amber-50', 'bg-gray-50', 'bg-gray-50']

                return (
                  <div
                    key={b.id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${rankBg[idx]}`}
                  >
                    {/* Rank */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0"
                      style={{ background: rankColors[idx] }}
                    >
                      {idx + 1}
                    </div>

                    {/* Brand */}
                    <span className="text-xl leading-none shrink-0">{b.logo}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{b.name}</p>
                      <p className="text-xs text-gray-500">{b.category}</p>
                    </div>

                    {/* Badge */}
                    <div className="text-right shrink-0">
                      <span
                        className="text-sm font-extrabold px-2.5 py-1 rounded-full"
                        style={{ background: rankColors[idx] + '20', color: rankColors[idx] }}
                      >
                        {b.slaBreaches}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-0.5">breaches</p>
                    </div>
                  </div>
                )
              })}

              {/* Total */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-1">
                <p className="text-xs text-gray-500 font-medium">All brands combined</p>
                <span className="text-sm font-extrabold text-red-600">{totalBreaches} breaches</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-10">
          Brand Ops · resQ by Reliance · Data as of Oct 2026
        </p>

      </div>
    </div>
  )
}
