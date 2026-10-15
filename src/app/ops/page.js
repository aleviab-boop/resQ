'use client'
import Link from 'next/link'
import { PLATFORM_KPIS, CASES, PARTS_INVENTORY, AI_INSIGHTS } from '@/lib/platformData'

// ── SVG icons ─────────────────────────────────────────────────────────────────
const Icons = {
  inbox: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth={2.5} /></svg>,
  customer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>,
  cases: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M9 7h6M9 11h6M9 15h4" /></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth={2.5} /></svg>,
  dispatch: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>,
  parts: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
  engineer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /><path d="M16 3.5c.8.4 1.5 1 2 1.8" strokeWidth={2} /></svg>,
  ai: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></svg>,
  survey: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>,
  fraud: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 8v4M12 16h.01" strokeWidth={2.5} /></svg>,
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
  brand: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>,
  admin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>,
  alert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" strokeWidth={2.5} /></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M20 6L9 17l-5-5" /></svg>,
  arrow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7" /></svg>,
}

// ── Module card ────────────────────────────────────────────────────────────────
function ModuleCard({ icon, title, desc, stat, statColor = 'text-[#00a1e1]', href, iconBg = 'bg-blue-50', iconColor = 'text-[#00a1e1]' }) {
  return (
    <Link href={href}
      className="group bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden"
      style={{ transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(19,52,123,0.10)'; e.currentTarget.style.borderColor = '#dde8f5' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f3f4f6' }}
    >
      <div className="flex items-start gap-4 p-5 flex-1">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor} mt-0.5 group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-[13px] leading-tight group-hover:text-[#13347b] transition-colors duration-150">{title}</p>
          <p className="text-gray-400 text-[11px] mt-1 leading-snug">{desc}</p>
        </div>
      </div>
      <div className="mx-5 mb-4 flex items-center justify-between border-t border-gray-50 pt-3">
        <span className={`text-[11px] font-semibold ${statColor}`}>{stat}</span>
        <span className="text-gray-300 group-hover:text-[#00a1e1] group-hover:translate-x-1 transition-all duration-200">
          {Icons.arrow}
        </span>
      </div>
    </Link>
  )
}

// ── Module section ─────────────────────────────────────────────────────────────
function ModuleSection({ letter, label, badge, badgeColor = 'bg-[#13347b]/8 text-[#13347b]', children, cols = 3 }) {
  const colClass = cols === 4
    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-6 rounded-lg bg-[#13347b] flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-extrabold text-white tracking-tight">{letter}</span>
        </div>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500">{label}</h2>
        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
        )}
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      <div className={`grid ${colClass} gap-3`}>
        {children}
      </div>
    </div>
  )
}

// ── KPI stat chip ──────────────────────────────────────────────────────────────
function KpiChip({ label, value, sub, color, bg, href }) {
  const inner = (
    <div className={`${bg} rounded-2xl px-5 py-4 flex flex-col gap-0.5 h-full`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className={`text-2xl font-extrabold leading-tight ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
  return href ? <Link href={href} className="hover:opacity-90 transition-opacity">{inner}</Link> : inner
}

// ── System health pill ─────────────────────────────────────────────────────────
function SystemPill({ name, status, note }) {
  const dot = status === 'green' ? 'bg-emerald-400' : status === 'amber' ? 'bg-amber-400' : 'bg-red-500'
  return (
    <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot} ${status === 'green' ? 'animate-pulse' : ''}`} />
      <span className="text-[11px] font-semibold text-gray-700 whitespace-nowrap">{name}</span>
      <span className="text-[10px] text-gray-400 whitespace-nowrap hidden sm:inline">· {note}</span>
    </div>
  )
}

// ── PAGE ───────────────────────────────────────────────────────────────────────
export default function OpsHub() {
  const openCases      = CASES.filter(c => !['resolved', 'completed', 'closed'].includes(c.status)).length
  const slaBreached    = CASES.filter(c => c.slaBreached === true).length
  const partsShortages = PARTS_INVENTORY.filter(p => p.stock === 0).length
  const highAlerts     = AI_INSIGHTS.filter(a => a.priority === 'high').length

  const systems = [
    { name: 'Case Engine',   status: 'green', note: 'Simulated' },
    { name: 'Dispatch',      status: 'green', note: 'Simulated' },
    { name: 'Parts',         status: partsShortages > 0 ? 'amber' : 'green', note: partsShortages > 0 ? `${partsShortages} OOS` : 'In stock' },
    { name: 'AI Insights',   status: 'green', note: 'Rule-based' },
    { name: 'Notifications', status: 'amber', note: 'Not connected' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f5f7fb' }}>

      {/* ── Hero header ─────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0d2060 0%, #13347b 60%, #1a4fa0 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 bg-white/10 px-2.5 py-1 rounded-full">Enterprise Ops</span>
                <span className="text-[10px] text-blue-300/70 font-medium">October 2026 · MTD</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                resQ Ops Centre
              </h1>
              <p className="text-blue-200/70 text-sm mt-1.5 font-medium">
                Field service · Customer care · Brand intelligence
              </p>
            </div>
            {/* Quick alert badges */}
            <div className="flex flex-wrap gap-2">
              {openCases > 0 && (
                <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-400/30 text-red-200 rounded-full px-3 py-1.5 text-[11px] font-semibold">
                  {Icons.alert} {openCases} open cases
                </div>
              )}
              {slaBreached > 0 && (
                <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 text-amber-200 rounded-full px-3 py-1.5 text-[11px] font-semibold">
                  {Icons.alert} {slaBreached} SLA breach{slaBreached !== 1 ? 'es' : ''}
                </div>
              )}
              {highAlerts > 0 && (
                <div className="flex items-center gap-1.5 bg-violet-500/20 border border-violet-400/30 text-violet-200 rounded-full px-3 py-1.5 text-[11px] font-semibold">
                  {Icons.alert} {highAlerts} AI alert{highAlerts !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          {/* System health pills */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400/60 mr-1">Systems</span>
            {systems.map(s => <SystemPill key={s.name} {...s} />)}
          </div>
        </div>

        {/* KPI strip — bleeds into the white area below */}
        <div className="max-w-7xl mx-auto px-6 pb-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 translate-y-6">
            <KpiChip
              label="Revenue MTD"
              value={`₹${(PLATFORM_KPIS.totalRevenueMTD / 100000).toFixed(1)}L`}
              sub="across all brands"
              color="text-[#13347b]"
              bg="bg-white"
              href="/ops/dashboard"
            />
            <KpiChip
              label="Open Cases"
              value={openCases}
              sub={`${slaBreached} SLA breach${slaBreached !== 1 ? 'es' : ''}`}
              color={openCases > 5 ? 'text-red-600' : 'text-amber-600'}
              bg="bg-white"
              href="/ops/cases"
            />
            <KpiChip
              label="First Visit Resolution"
              value={`${PLATFORM_KPIS.firstVisitResolution * 100}%`}
              sub="resolved on first visit"
              color="text-emerald-600"
              bg="bg-white"
            />
            <KpiChip
              label="Parts Out-of-Stock"
              value={partsShortages}
              sub={`of ${PARTS_INVENTORY.length} SKUs tracked`}
              color={partsShortages > 0 ? 'text-orange-600' : 'text-emerald-600'}
              bg="bg-white"
              href="/parts"
            />
          </div>
        </div>
      </div>

      {/* ── Page body ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-14">

        {/* MODULE A */}
        <ModuleSection letter="A" label="Customer Operations" badge="Customer-facing">
          <ModuleCard
            href="/ops/inbox"
            icon={Icons.inbox}
            iconBg="bg-emerald-50" iconColor="text-emerald-600"
            title="Omnichannel Inbox"
            desc="WhatsApp, app, email and phone threads in one queue"
            stat={`${CASES.filter(c => c.status === 'open').length} open conversations`}
            statColor="text-red-500"
          />
          <ModuleCard
            href="/ops/customers"
            icon={Icons.customer}
            iconBg="bg-sky-50" iconColor="text-[#00a1e1]"
            title="Customer 360"
            desc="Full customer timeline — orders, devices, cases, NPS"
            stat="6 customers in system"
            statColor="text-[#00a1e1]"
          />
          <ModuleCard
            href="/ops/cases"
            icon={Icons.cases}
            iconBg="bg-indigo-50" iconColor="text-[#13347b]"
            title="Case Management"
            desc="Create, assign, track and escalate service cases"
            stat={`${openCases} active · ${PLATFORM_KPIS.slaBreachRate * 100}% SLA breach rate`}
            statColor={PLATFORM_KPIS.slaBreachRate > 0.2 ? 'text-red-500' : 'text-amber-500'}
          />
        </ModuleSection>

        {/* MODULE B */}
        <ModuleSection letter="B" label="Service Delivery" badge="Field ops" cols={4}>
          <ModuleCard
            href="/ops/dispatch#promise-engine"
            icon={Icons.calendar}
            iconBg="bg-cyan-50" iconColor="text-cyan-600"
            title="Promise Engine"
            desc="Pincode-level slot availability — skills, capacity, parts"
            stat="Check available windows"
            statColor="text-cyan-600"
          />
          <ModuleCard
            href="/ops/dispatch"
            icon={Icons.dispatch}
            iconBg="bg-amber-50" iconColor="text-amber-600"
            title="Dispatch Console"
            desc="Technician status board and job assignment"
            stat="4 available · 3 on job"
            statColor="text-amber-600"
          />
          <ModuleCard
            href="/parts"
            icon={Icons.parts}
            iconBg="bg-sky-50" iconColor="text-[#00a1e1]"
            title="Spare Parts"
            desc="Stock levels, demand forecast, reorder alerts"
            stat={`${partsShortages} OOS · ${PARTS_INVENTORY.length} SKUs`}
            statColor={partsShortages > 0 ? 'text-red-500' : 'text-green-600'}
          />
          <ModuleCard
            href="/engineer-ops"
            icon={Icons.engineer}
            iconBg="bg-teal-50" iconColor="text-teal-600"
            title="Engineer Ops"
            desc="Area load, technician ratings and heatmap"
            stat="Andheri 14-job backlog"
            statColor="text-amber-600"
          />
        </ModuleSection>

        {/* MODULE C */}
        <ModuleSection letter="C" label="Quality & Intelligence" badge="AI-powered" badgeColor="bg-violet-100 text-violet-700">
          <ModuleCard
            href="/ops/ai"
            icon={Icons.ai}
            iconBg="bg-violet-50" iconColor="text-violet-600"
            title="AI Operations"
            desc="Smart insights, anomaly detection and auto-assignment"
            stat={`${highAlerts} high-priority alerts`}
            statColor={highAlerts > 0 ? 'text-red-500' : 'text-green-600'}
          />
          <ModuleCard
            href="/ops/surveys"
            icon={Icons.survey}
            iconBg="bg-rose-50" iconColor="text-rose-500"
            title="Surveys & Recovery"
            desc="NPS analytics and auto-recovery triggers"
            stat={`NPS ${PLATFORM_KPIS.serviceNps} · ${PLATFORM_KPIS.recoveryPending} pending recovery`}
            statColor="text-rose-500"
          />
          <ModuleCard
            href="/fraud-ops"
            icon={Icons.fraud}
            iconBg="bg-red-50" iconColor="text-red-500"
            title="Fraud Review"
            desc="Multi-trip flags, duplicate billing, IMEI mismatches"
            stat={`${PLATFORM_KPIS.openFraudFlags} open flags · ₹2,347 flagged`}
            statColor="text-red-600"
          />
        </ModuleSection>

        {/* MODULE D */}
        <ModuleSection letter="D" label="Business Intelligence" badge="Leadership" badgeColor="bg-purple-100 text-purple-700">
          <ModuleCard
            href="/ops/dashboard"
            icon={Icons.dashboard}
            iconBg="bg-indigo-50" iconColor="text-[#13347b]"
            title="Leadership Dashboard"
            desc="Real-time KPIs, SLA health and revenue attribution"
            stat={`₹${(PLATFORM_KPIS.totalRevenueMTD / 100000).toFixed(1)}L MTD · ${PLATFORM_KPIS.firstVisitResolution * 100}% FVR`}
            statColor="text-[#13347b]"
          />
          <ModuleCard
            href="/brand-ops"
            icon={Icons.brand}
            iconBg="bg-purple-50" iconColor="text-purple-600"
            title="Brand Operations"
            desc="Per-brand P&L, SLA compliance and contract health"
            stat={`${PLATFORM_KPIS.lossMakingBrands} loss-making brands`}
            statColor="text-red-600"
          />
          <ModuleCard
            href="/ops/admin"
            icon={Icons.admin}
            iconBg="bg-gray-100" iconColor="text-gray-500"
            title="Rules & Admin"
            desc="SLA policies, message templates, roles and contracts"
            stat="7 active SLA rules · 5 templates"
            statColor="text-gray-500"
          />
        </ModuleSection>

        {/* Footer */}
        <div className="mt-2 pt-6 border-t border-gray-200 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">resQ Enterprise Ops · © 2026 Reliance Industries · Data as of Oct 2026</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            All systems nominal
          </div>
        </div>
      </div>
    </div>
  )
}
