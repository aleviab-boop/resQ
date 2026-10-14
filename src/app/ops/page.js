'use client'
import Link from 'next/link'
import { PLATFORM_KPIS, CASES, PARTS_INVENTORY, AI_INSIGHTS } from '@/lib/platformData'

// ── System health bar ─────────────────────────────────────────────────────────
const SYSTEMS = [
  { name: 'Case Engine',    status: 'green',  note: 'Operational' },
  { name: 'Dispatch',       status: 'green',  note: 'Operational' },
  { name: 'Parts',          status: 'amber',  note: '2 shortages' },
  { name: 'AI Pipeline',    status: 'green',  note: 'Operational' },
  { name: 'Surveys',        status: 'green',  note: 'Operational' },
  { name: 'Notifications',  status: 'green',  note: 'Operational' },
]

function HealthBar() {
  const dot = (status) => {
    const cls =
      status === 'green' ? 'bg-green-400' :
      status === 'amber' ? 'bg-amber-400' :
      'bg-red-500'
    return <span className={`inline-block w-2 h-2 rounded-full ${cls} flex-shrink-0`} />
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 mb-8 shadow-sm">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">System Health</span>
        {SYSTEMS.map(s => (
          <div key={s.name} className="flex items-center gap-1.5">
            {dot(s.status)}
            <span className="text-xs font-medium text-gray-700">{s.name}</span>
            <span className="text-xs text-gray-400">— {s.note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Module card ───────────────────────────────────────────────────────────────
function ModuleCard({ icon, title, desc, stat, statColor = 'text-[#00a1e1]', href, accent = 'from-[#00a1e1] to-[#13347b]' }) {
  return (
    <Link href={href}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition group overflow-hidden border border-gray-100">
      <div className={`h-1 bg-gradient-to-r ${accent}`} />
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="text-3xl flex-shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-gray-900 group-hover:text-[#13347b] transition text-sm">{title}</div>
            <p className="text-gray-400 text-xs mt-0.5 leading-snug">{desc}</p>
            <div className={`text-xs font-bold mt-2 ${statColor}`}>{stat}</div>
          </div>
          <svg className="w-4 h-4 text-gray-300 group-hover:text-[#00a1e1] transition mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

// ── Module section ────────────────────────────────────────────────────────────
function ModuleSection({ label, badge, children }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</h2>
        {badge && <span className="text-xs bg-[#13347b]/10 text-[#13347b] px-2 py-0.5 rounded-full font-semibold">{badge}</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function OpsHub() {
  const openCases       = CASES.filter(c => c.status === 'open' || c.status === 'in-progress').length
  const partsShortages  = PARTS_INVENTORY.filter(p => p.stock === 0).length
  const highAlerts      = AI_INSIGHTS.filter(a => a.priority === 'high').length

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#13347b]">resQ Ops Centre</h1>
        <p className="text-gray-400 mt-1">Enterprise Service Operations</p>
      </div>

      {/* System health */}
      <HealthBar />

      {/* MODULE A — Customer Operations */}
      <ModuleSection label="A — Customer Operations" badge="Customer-facing">
        <ModuleCard
          href="/ops/inbox"
          icon="💬"
          title="Omnichannel Inbox"
          desc="WhatsApp, app, email and phone threads in one queue"
          stat={`${CASES.filter(c => c.status === 'open').length} open conversations`}
          statColor="text-red-500"
          accent="from-green-500 to-emerald-700"
        />
        <ModuleCard
          href="/ops/customers"
          icon="👤"
          title="Customer 360"
          desc="Full customer timeline — orders, devices, cases, NPS"
          stat="6 customers in system"
          accent="from-[#00a1e1] to-sky-600"
        />
        <ModuleCard
          href="/ops/cases"
          icon="📋"
          title="Case Management"
          desc="Create, assign, track and escalate service cases"
          stat={`${openCases} active cases · ${PLATFORM_KPIS.slaBreachRate * 100}% SLA breach rate`}
          statColor={PLATFORM_KPIS.slaBreachRate > 0.2 ? 'text-red-500' : 'text-amber-500'}
          accent="from-[#13347b] to-indigo-700"
        />
      </ModuleSection>

      {/* MODULE B — Service Delivery */}
      <ModuleSection label="B — Service Delivery" badge="Field ops">
        <ModuleCard
          href="/ops/dispatch"
          icon="📍"
          title="Dispatch Console"
          desc="Live technician map, job assignment and slot management"
          stat="4 available · 3 on job today"
          accent="from-amber-500 to-orange-600"
        />
        <ModuleCard
          href="/parts"
          icon="🔩"
          title="Spare Parts"
          desc="Stock levels by centre, demand forecast, reorder alerts"
          stat={`${partsShortages} out-of-stock · ${PARTS_INVENTORY.length} SKUs tracked`}
          statColor={partsShortages > 0 ? 'text-red-500' : 'text-green-600'}
          accent="from-sky-500 to-[#00a1e1]"
        />
        <ModuleCard
          href="/engineer-ops"
          icon="👨‍🔧"
          title="Engineer Ops"
          desc="Area load, technician ratings and performance heatmap"
          stat="Andheri 14-job backlog flagged"
          statColor="text-amber-600"
          accent="from-teal-500 to-cyan-700"
        />
      </ModuleSection>

      {/* MODULE C — Quality & Intelligence */}
      <ModuleSection label="C — Quality & Intelligence" badge="AI-powered">
        <ModuleCard
          href="/ops/ai"
          icon="🤖"
          title="AI Operations"
          desc="Smart insights, anomaly detection and auto-assignment"
          stat={`${highAlerts} high-priority AI alerts`}
          statColor={highAlerts > 0 ? 'text-red-500' : 'text-green-600'}
          accent="from-violet-500 to-purple-700"
        />
        <ModuleCard
          href="/ops/surveys"
          icon="📊"
          title="Surveys & Recovery"
          desc="NPS surveys, response analytics and auto-recovery triggers"
          stat={`Avg NPS ${PLATFORM_KPIS.serviceNps} · ${PLATFORM_KPIS.recoveryPending} recovery pending`}
          statColor={PLATFORM_KPIS.serviceNps < 7 ? 'text-amber-500' : 'text-green-600'}
          accent="from-rose-500 to-pink-700"
        />
        <ModuleCard
          href="/fraud-ops"
          icon="🚩"
          title="Fraud Review"
          desc="Multi-trip flags, duplicate billing, IMEI mismatches"
          stat={`${PLATFORM_KPIS.openFraudFlags} open flags · ₹2,347 overcharge`}
          statColor="text-red-600"
          accent="from-red-500 to-rose-700"
        />
      </ModuleSection>

      {/* MODULE D — Business Intelligence */}
      <ModuleSection label="D — Business Intelligence" badge="Leadership">
        <ModuleCard
          href="/ops/dashboard"
          icon="📈"
          title="Leadership Dashboard"
          desc="Real-time KPIs, SLA health and revenue attribution"
          stat={`₹${(PLATFORM_KPIS.totalRevenueMTD / 100000).toFixed(1)}L MTD · ${PLATFORM_KPIS.firstVisitResolution * 100}% FVR`}
          accent="from-[#13347b] to-navy"
        />
        <ModuleCard
          href="/brand-ops"
          icon="🏭"
          title="Brand Operations"
          desc="Per-brand P&L, SLA compliance and contract health"
          stat={`${PLATFORM_KPIS.lossMakingBrands} loss-making brands`}
          statColor="text-red-600"
          accent="from-purple-500 to-indigo-700"
        />
        <ModuleCard
          href="/ops/admin"
          icon="⚙️"
          title="Rules & Admin"
          desc="SLA policies, message templates, roles and contracts"
          stat="7 active SLA rules · 5 templates"
          accent="from-gray-600 to-gray-800"
        />
      </ModuleSection>

      {/* Quick stats footer */}
      <div className="mt-4 border-t border-gray-100 pt-6">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Stats</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Open Cases',           value: 5,  color: 'text-red-600',   bg: 'bg-red-50'    },
            { label: 'Installation Backlog', value: 14, color: 'text-amber-600', bg: 'bg-amber-50'  },
            { label: 'Parts Shortages',      value: 2,  color: 'text-orange-600',bg: 'bg-orange-50' },
            { label: 'Recovery Pending',     value: 1,  color: 'text-purple-600',bg: 'bg-purple-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3`}>
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
