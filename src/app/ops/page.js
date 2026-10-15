'use client'
import Link from 'next/link'
import { PLATFORM_KPIS, CASES, PARTS_INVENTORY, AI_INSIGHTS } from '@/lib/platformData'

// ── System health bar ─────────────────────────────────────────────────────────
function getSystems(partsShortages) {
  return [
    { name: 'Case Engine',    status: 'green',                                  note: 'Simulated' },
    { name: 'Dispatch',       status: 'green',                                  note: 'Simulated' },
    { name: 'Parts',          status: partsShortages > 0 ? 'amber' : 'green',  note: partsShortages > 0 ? `${partsShortages} out of stock` : 'In stock' },
    { name: 'AI Insights',    status: 'green',                                  note: 'Rule-based' },
    { name: 'Surveys',        status: 'green',                                  note: 'Simulated' },
    { name: 'Notifications',  status: 'amber',                                  note: 'Not connected' },
  ]
}

function HealthBar({ systems }) {
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
        {systems.map(s => (
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
function ModuleCard({ icon, title, desc, stat, statColor = 'text-[#00a1e1]', href, iconBg = 'bg-[#f0f7ff]', iconColor = 'text-[#00a1e1]', accent = 'from-[#00a1e1] to-[#13347b]' }) {
  return (
    <Link href={href}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition group overflow-hidden border border-gray-100">
      <div className={`h-0.5 bg-gradient-to-r ${accent}`} />
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor} group-hover:scale-105 transition-transform`}>
            {icon}
          </div>
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

// ── SVG icons ─────────────────────────────────────────────────────────────────
const Icons = {
  inbox: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth={2.5} />
    </svg>
  ),
  customer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  cases: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth={2.5} />
    </svg>
  ),
  dispatch: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  parts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  engineer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      <path d="M16 3.5c.8.4 1.5 1 2 1.8" strokeWidth={2} />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M12 17a2 2 0 0 1 2 2v1a2 2 0 0 1-4 0v-1a2 2 0 0 1 2-2zM4.22 10.22a2 2 0 0 1 2.83 0l.71.71a2 2 0 0 1-2.83 2.83l-.71-.71a2 2 0 0 1 0-2.83zM17.66 7.76a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.71.71a2 2 0 0 1-2.83-2.83zM2 12a2 2 0 0 1 2-2h1a2 2 0 0 1 0 4H4a2 2 0 0 1-2-2zM19 12a2 2 0 0 1 2-2h1a2 2 0 0 1 0 4h-1a2 2 0 0 1-2-2zM4.22 17.66a2 2 0 0 1 0-2.83l.71-.71a2 2 0 0 1 2.83 2.83l-.71.71a2 2 0 0 1-2.83 0zM16.24 5.76a2 2 0 0 1 0-2.83l.71-.71a2 2 0 0 1 2.83 2.83l-.71.71a2 2 0 0 1-2.83 0z" />
    </svg>
  ),
  survey: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z" />
      <path d="M7 5h.01M7 12h.01M7 19h.01" strokeWidth={2.5} />
    </svg>
  ),
  fraud: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4M12 16h.01" strokeWidth={2.5} />
    </svg>
  ),
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  brand: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  admin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  ),
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
  const openCases       = CASES.filter(c => !['resolved', 'completed', 'closed'].includes(c.status)).length
  const slaBreached     = CASES.filter(c => c.slaBreached === true).length
  const partsShortages  = PARTS_INVENTORY.filter(p => p.stock === 0).length
  const highAlerts      = AI_INSIGHTS.filter(a => a.priority === 'high').length
  const systems         = getSystems(partsShortages)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#13347b]">resQ Ops Centre</h1>
        <p className="text-gray-400 mt-1">Enterprise Service Operations</p>
      </div>

      {/* System health */}
      <HealthBar systems={systems} />

      {/* MODULE A — Customer Operations */}
      <ModuleSection label="A — Customer Operations" badge="Customer-facing">
        <ModuleCard
          href="/ops/inbox"
          icon={Icons.inbox}
          iconBg="bg-emerald-50" iconColor="text-emerald-600"
          title="Omnichannel Inbox"
          desc="WhatsApp, app, email and phone threads in one queue"
          stat={`${CASES.filter(c => c.status === 'open').length} open conversations`}
          statColor="text-red-500"
          accent="from-emerald-400 to-emerald-600"
        />
        <ModuleCard
          href="/ops/customers"
          icon={Icons.customer}
          iconBg="bg-sky-50" iconColor="text-[#00a1e1]"
          title="Customer 360"
          desc="Full customer timeline — orders, devices, cases, NPS"
          stat="6 customers in system"
          accent="from-[#00a1e1] to-sky-500"
        />
        <ModuleCard
          href="/ops/cases"
          icon={Icons.cases}
          iconBg="bg-indigo-50" iconColor="text-[#13347b]"
          title="Case Management"
          desc="Create, assign, track and escalate service cases"
          stat={`${openCases} active cases · ${PLATFORM_KPIS.slaBreachRate * 100}% SLA breach rate`}
          statColor={PLATFORM_KPIS.slaBreachRate > 0.2 ? 'text-red-500' : 'text-amber-500'}
          accent="from-[#13347b] to-indigo-600"
        />
      </ModuleSection>

      {/* MODULE B — Service Delivery */}
      <ModuleSection label="B — Service Delivery" badge="Field ops">
        <ModuleCard
          href="/ops/dispatch#promise-engine"
          icon={Icons.calendar}
          iconBg="bg-cyan-50" iconColor="text-cyan-600"
          title="Promise Engine"
          desc="Pincode-level slot availability — skills, capacity, parts check"
          stat="Check available windows by pincode"
          accent="from-cyan-400 to-sky-500"
        />
        <ModuleCard
          href="/ops/dispatch"
          icon={Icons.dispatch}
          iconBg="bg-amber-50" iconColor="text-amber-600"
          title="Dispatch Console"
          desc="Technician status board, job assignment and schedule"
          stat="4 available · 3 on job today"
          accent="from-amber-400 to-orange-500"
        />
        <ModuleCard
          href="/parts"
          icon={Icons.parts}
          iconBg="bg-sky-50" iconColor="text-[#00a1e1]"
          title="Spare Parts"
          desc="Stock levels by centre, demand forecast, reorder alerts"
          stat={`${partsShortages} out-of-stock · ${PARTS_INVENTORY.length} SKUs tracked`}
          statColor={partsShortages > 0 ? 'text-red-500' : 'text-green-600'}
          accent="from-[#00a1e1] to-sky-600"
        />
        <ModuleCard
          href="/engineer-ops"
          icon={Icons.engineer}
          iconBg="bg-teal-50" iconColor="text-teal-600"
          title="Engineer Ops"
          desc="Area load, technician ratings and performance heatmap"
          stat="Andheri 14-job backlog flagged"
          statColor="text-amber-600"
          accent="from-teal-400 to-cyan-600"
        />
      </ModuleSection>

      {/* MODULE C — Quality & Intelligence */}
      <ModuleSection label="C — Quality & Intelligence" badge="AI-powered">
        <ModuleCard
          href="/ops/ai"
          icon={Icons.ai}
          iconBg="bg-violet-50" iconColor="text-violet-600"
          title="AI Operations"
          desc="Smart insights, anomaly detection and auto-assignment"
          stat={`${highAlerts} high-priority AI alerts`}
          statColor={highAlerts > 0 ? 'text-red-500' : 'text-green-600'}
          accent="from-violet-500 to-purple-600"
        />
        <ModuleCard
          href="/ops/surveys"
          icon={Icons.survey}
          iconBg="bg-rose-50" iconColor="text-rose-500"
          title="Surveys & Recovery"
          desc="NPS surveys, response analytics and auto-recovery triggers"
          stat={`Avg NPS ${PLATFORM_KPIS.serviceNps} · ${PLATFORM_KPIS.recoveryPending} recovery pending`}
          statColor={PLATFORM_KPIS.serviceNps < 7 ? 'text-amber-500' : 'text-green-600'}
          accent="from-rose-400 to-pink-600"
        />
        <ModuleCard
          href="/fraud-ops"
          icon={Icons.fraud}
          iconBg="bg-red-50" iconColor="text-red-500"
          title="Fraud Review"
          desc="Multi-trip flags, duplicate billing, IMEI mismatches"
          stat={`${PLATFORM_KPIS.openFraudFlags} open flags · ₹2,347 overcharge`}
          statColor="text-red-600"
          accent="from-red-400 to-rose-600"
        />
      </ModuleSection>

      {/* MODULE D — Business Intelligence */}
      <ModuleSection label="D — Business Intelligence" badge="Leadership">
        <ModuleCard
          href="/ops/dashboard"
          icon={Icons.dashboard}
          iconBg="bg-indigo-50" iconColor="text-[#13347b]"
          title="Leadership Dashboard"
          desc="Real-time KPIs, SLA health and revenue attribution"
          stat={`₹${(PLATFORM_KPIS.totalRevenueMTD / 100000).toFixed(1)}L MTD · ${PLATFORM_KPIS.firstVisitResolution * 100}% FVR`}
          accent="from-[#13347b] to-indigo-700"
        />
        <ModuleCard
          href="/brand-ops"
          icon={Icons.brand}
          iconBg="bg-purple-50" iconColor="text-purple-600"
          title="Brand Operations"
          desc="Per-brand P&L, SLA compliance and contract health"
          stat={`${PLATFORM_KPIS.lossMakingBrands} loss-making brands`}
          statColor="text-red-600"
          accent="from-purple-500 to-indigo-600"
        />
        <ModuleCard
          href="/ops/admin"
          icon={Icons.admin}
          iconBg="bg-gray-100" iconColor="text-gray-600"
          title="Rules & Admin"
          desc="SLA policies, message templates, roles and contracts"
          stat="7 active SLA rules · 5 templates"
          accent="from-gray-500 to-gray-700"
        />
      </ModuleSection>

      {/* Quick stats footer */}
      <div className="mt-4 border-t border-gray-100 pt-6">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Stats</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Open Cases',           value: openCases,       color: 'text-red-600',   bg: 'bg-red-50'    },
            { label: 'SLA Breached',         value: slaBreached,     color: 'text-amber-600', bg: 'bg-amber-50'  },
            { label: 'Parts Shortages',      value: partsShortages,  color: 'text-orange-600',bg: 'bg-orange-50' },
            { label: 'Recovery Pending',     value: 1,               color: 'text-purple-600',bg: 'bg-purple-50' },
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
