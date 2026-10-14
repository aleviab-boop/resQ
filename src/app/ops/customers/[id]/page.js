'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  CUSTOMERS,
  ORDERS,
  CASES,
  JOBS,
  CONVERSATIONS,
  SURVEYS,
  getProductsForCustomer,
  getCasesForCustomer,
  getOrdersForCustomer,
  getJobsForCase,
  getConversationForCase,
  CASE_STATUS_COLORS,
  CHANNEL_ICONS,
} from '@/lib/platformData'

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtTime(d) {
  if (!d) return '—'
  const dt = new Date(d)
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' + dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function rupees(n) {
  return '₹' + (n || 0).toLocaleString('en-IN')
}

const TIER_STYLES = {
  Platinum: 'bg-purple-100 text-purple-700 border border-purple-300',
  Gold:     'bg-amber-100  text-amber-700  border border-amber-300',
  Silver:   'bg-gray-100   text-gray-600   border border-gray-300',
  Bronze:   'bg-orange-100 text-orange-700 border border-orange-300',
}

function warrantyStatus(expiry) {
  if (!expiry) return { label: 'Unknown', cls: 'bg-gray-100 text-gray-500' }
  const exp = new Date(expiry)
  const now = new Date()
  const diffDays = Math.ceil((exp - now) / 86400000)
  if (diffDays < 0)   return { label: 'Expired',   cls: 'bg-red-100   text-red-700'   }
  if (diffDays < 90)  return { label: `Expiring in ${diffDays}d`, cls: 'bg-amber-100 text-amber-700' }
  return { label: `Valid till ${fmt(expiry)}`, cls: 'bg-green-100 text-green-700' }
}

// ─── timeline builder ────────────────────────────────────────────────────────

function buildTimeline(customerId) {
  const events = []

  // Orders
  getOrdersForCustomer(customerId).forEach(o => {
    events.push({
      key:   o.id,
      date:  o.date,
      ts:    new Date(o.date).getTime(),
      icon:  '📦',
      type:  'order',
      color: 'border-blue-400',
      bg:    'bg-blue-50',
      title: `Order ${o.id} — ${o.status === 'completed' ? 'Delivered & Installed' : 'Pending'}`,
      body:  `${rupees(o.amount)} · ${o.deliveryPartner} · ${o.channel}`,
      sub:   o.installDate ? `Installed ${fmt(o.installDate)}` : 'Not yet installed',
    })
  })

  // Cases
  getCasesForCustomer(customerId).forEach(cs => {
    events.push({
      key:   cs.id,
      date:  cs.createdAt,
      ts:    new Date(cs.createdAt).getTime(),
      icon:  '🔧',
      type:  'case',
      color: 'border-red-400',
      bg:    'bg-red-50',
      title: `Case ${cs.id} — ${cs.title}`,
      body:  `Type: ${cs.type} · Priority: ${cs.priority} · Status: ${cs.status}`,
      link:  `/ops/cases/${cs.id}`,
    })

    // Jobs under this case
    getJobsForCase(cs.id).forEach(j => {
      ;(j.visits || []).forEach(v => {
        events.push({
          key:   `${j.id}-v${v.visitNo}`,
          date:  v.date,
          ts:    new Date(v.date).getTime(),
          icon:  '👷',
          type:  'job',
          color: 'border-sky-400',
          bg:    'bg-sky-50',
          title: `Visit #${v.visitNo} — ${j.type} (${j.id})`,
          body:  v.diagnosis || 'In progress',
          sub:   `Arrived ${v.arrivedAt || '—'} · ${v.notes || ''}`,
        })
      })
    })

    // Conversations
    const conv = getConversationForCase(cs.id)
    if (conv && conv.messages.length) {
      const first = conv.messages[0]
      const last  = conv.messages[conv.messages.length - 1]
      events.push({
        key:   conv.id,
        date:  first.time,
        ts:    new Date(first.time).getTime(),
        icon:  '💬',
        type:  'conversation',
        color: 'border-indigo-400',
        bg:    'bg-indigo-50',
        title: `Conversation ${conv.id} — ${conv.channel.toUpperCase()} (${conv.messages.length} messages)`,
        body:  `First: "${first.text.slice(0, 90)}${first.text.length > 90 ? '…' : ''}"`,
        sub:   first.time !== last.time
          ? `Last: "${last.text.slice(0, 80)}${last.text.length > 80 ? '…' : ''}"`
          : undefined,
      })
    }
  })

  // Survey responses
  SURVEYS.forEach(sv => {
    sv.responses
      .filter(r => r.customerId === customerId)
      .forEach(r => {
        events.push({
          key:   r.id,
          date:  r.submittedAt,
          ts:    new Date(r.submittedAt).getTime(),
          icon:  '⭐',
          type:  'survey',
          color: 'border-yellow-400',
          bg:    'bg-yellow-50',
          title: `Survey — ${sv.name}`,
          body:  `NPS: ${r.answers.q1}/10`,
          sub:   r.answers.q4 ? `"${r.answers.q4}"` : undefined,
        })
      })
  })

  // Sort newest first
  events.sort((a, b) => b.ts - a.ts)
  return events
}

// ─── Quick action button ─────────────────────────────────────────────────────

function QBtn({ icon, label, href, onClick, variant = 'default' }) {
  const base = 'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors w-full justify-center'
  const variants = {
    primary:  'bg-navy text-white hover:bg-navy-dark',
    sky:      'bg-sky  text-white hover:opacity-90',
    default:  'bg-gray-100 text-gray-700 hover:bg-gray-200',
  }
  if (href) {
    return (
      <Link href={href} className={`${base} ${variants[variant]}`}>
        <span>{icon}</span>{label}
      </Link>
    )
  }
  return (
    <button className={`${base} ${variants[variant]}`} onClick={onClick}>
      <span>{icon}</span>{label}
    </button>
  )
}

// ─── main component ──────────────────────────────────────────────────────────

export default function Customer360Page() {
  const { id } = useParams()
  const customer = CUSTOMERS.find(c => c.id === id)

  // ── Not found ────────────────────────────────────────────────────────────
  if (!customer) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800">Customer not found</h2>
        <p className="text-gray-400 mt-2 mb-6">No customer with ID <code className="bg-gray-100 px-2 py-0.5 rounded">{id}</code> exists.</p>
        <Link href="/ops/customers" className="text-sky hover:underline font-semibold">
          ← Back to Customers
        </Link>
      </div>
    )
  }

  const devices   = getProductsForCustomer(id)
  const allCases  = getCasesForCustomer(id)
  const openCases = allCases.filter(cs =>
    ['open', 'in-progress', 'parts-awaited', 'scheduled'].includes(cs.status)
  )
  const timeline  = buildTimeline(id)

  // Channels used across conversations
  const channelSet = new Set(
    CONVERSATIONS
      .filter(cv => cv.customerId === id)
      .flatMap(cv => cv.messages.map(m => m.channel))
      .filter(ch => ch !== 'internal')
  )

  // First & last contact
  const allDates = allCases.map(cs => cs.createdAt).sort()
  const firstContact = allDates[0]
  const lastContact  = allDates[allDates.length - 1]

  // NPS color
  const npsColor =
    customer.nps === null ? 'text-gray-400' :
    customer.nps >= 8  ? 'text-green-600' :
    customer.nps >= 6  ? 'text-amber-600' :
                         'text-red-600'

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="text-sm text-gray-400 mb-6">
        <Link href="/ops/customers" className="hover:text-sky">Customers</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700 font-medium">{customer.name}</span>
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ════════════════════════════════════════════════════════════
            LEFT COLUMN — 65%
        ════════════════════════════════════════════════════════════ */}
        <div className="flex-[2] min-w-0 space-y-6">

          {/* ── Identity card ────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              {/* Name + badges */}
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">{customer.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${TIER_STYLES[customer.tier]}`}>
                    {customer.tier}
                  </span>
                  {customer.carePlan && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-sky-light text-sky border border-sky/30">
                      Care Plan ✓
                    </span>
                  )}
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {customer.tags.map(tag => (
                    <span
                      key={tag}
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium
                        ${tag === 'at-risk'    ? 'bg-red-100 text-red-600'     :
                          tag === 'high-value' ? 'bg-amber-100 text-amber-700' :
                          tag === 'corporate'  ? 'bg-indigo-100 text-indigo-700' :
                          'bg-gray-100 text-gray-500'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* NPS circle */}
              <div className="flex flex-col items-center">
                <div className={`text-4xl font-extrabold ${npsColor}`}>
                  {customer.nps ?? '—'}
                </div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">NPS Score</div>
                <div className={`text-xs font-semibold mt-1
                  ${customer.tags.includes('at-risk') ? 'text-red-600' :
                    customer.tags.includes('repeat-customer') ? 'text-green-600' :
                    'text-gray-500'}`}>
                  {customer.tags.includes('at-risk')          ? 'At Risk'         :
                   customer.tags.includes('repeat-customer')  ? 'Repeat customer' : '—'}
                </div>
              </div>
            </div>

            {/* Contact + address */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-base">📞</span> {customer.phone}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">📧</span> {customer.email}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">📍</span>
                {customer.address}, {customer.city} — {customer.pincode}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">🗓</span>
                Member since {fmt(customer.since)}
              </div>
            </div>

            {/* Spend highlight */}
            <div className="mt-5 inline-block bg-navy rounded-xl px-6 py-3">
              <div className="text-white/60 text-xs font-semibold uppercase tracking-widest">Total Spend</div>
              <div className="text-white text-2xl font-extrabold mt-0.5">
                {rupees(customer.totalSpend)}
              </div>
            </div>
          </div>

          {/* ── Service lifecycle timeline ────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              Service Lifecycle
              <span className="bg-navy text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                {timeline.length} events
              </span>
            </h2>

            {timeline.length === 0 && (
              <div className="text-gray-400 text-sm py-6 text-center">No events recorded yet.</div>
            )}

            <div className="space-y-3">
              {timeline.map(ev => (
                <div
                  key={ev.key}
                  className={`flex gap-3 rounded-xl p-4 border-l-4 ${ev.color} ${ev.bg}`}
                >
                  {/* Icon */}
                  <div className="text-xl mt-0.5 shrink-0">{ev.icon}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-1">
                      <div className="font-semibold text-gray-800 text-sm">
                        {ev.link
                          ? <Link href={ev.link} className="hover:text-sky">{ev.title}</Link>
                          : ev.title}
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap">{fmtTime(ev.date)}</div>
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">{ev.body}</div>
                    {ev.sub && (
                      <div className="text-xs text-gray-500 mt-0.5 italic">{ev.sub}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            RIGHT COLUMN — 35%
        ════════════════════════════════════════════════════════════ */}
        <div className="flex-[1] min-w-0 lg:min-w-[320px] space-y-5">

          {/* ── Devices ──────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              Registered Devices
              <span className="bg-sky text-white text-xs px-2 py-0.5 rounded-full">
                {devices.length}
              </span>
            </h3>

            {devices.length === 0 && (
              <div className="text-gray-400 text-xs">No devices registered.</div>
            )}

            <div className="space-y-3">
              {devices.map(d => {
                const ws = warrantyStatus(d.warrantyExpiry)
                return (
                  <div key={d.id} className="rounded-xl bg-gray-50 p-3 text-sm">
                    <div className="font-semibold text-gray-800">{d.brand} {d.model}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{d.type} · {d.serial}</div>
                    <div className="text-gray-400 text-xs">Purchased {fmt(d.purchaseDate)}</div>
                    <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${ws.cls}`}>
                      {ws.label}
                    </span>
                  </div>
                )
              })}
            </div>

            <button className="mt-4 w-full text-center text-sky text-sm font-semibold border border-sky/30 rounded-xl py-2 hover:bg-sky-light transition-colors">
              + Register Device
            </button>
          </div>

          {/* ── Open Cases ───────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              Open Cases
              {openCases.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {openCases.length}
                </span>
              )}
            </h3>

            {openCases.length === 0 && (
              <div className="text-gray-400 text-xs py-2">No open cases. All clear!</div>
            )}

            <div className="space-y-2">
              {openCases.map(cs => (
                <div key={cs.id} className="rounded-xl bg-gray-50 p-3 flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-gray-500">{cs.id}</div>
                    <div className="text-sm font-medium text-gray-800 line-clamp-2 mt-0.5">{cs.title}</div>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold ${CASE_STATUS_COLORS[cs.status] || 'bg-gray-100 text-gray-500'}`}>
                      {cs.status}
                    </span>
                  </div>
                  <Link href={`/ops/cases/${cs.id}`} className="text-sky hover:text-navy text-xs font-semibold whitespace-nowrap mt-1">
                    Open →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ── Quick Actions ─────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <QBtn icon="🔧" label="New Case"          variant="primary" href={`/ops/cases/new?customerId=${id}`} />
              <QBtn icon="📅" label="Book Service"       variant="sky"     href={`/ops/jobs/new?customerId=${id}`} />
              <QBtn icon="💬" label="Send WhatsApp"      variant="default" href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`} />
              <QBtn icon="📥" label="View Conversations" variant="default" href="/ops/inbox" />
            </div>
          </div>

          {/* ── Contact History Summary ──────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h3 className="font-bold text-gray-900 mb-4">Contact History</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Total cases</span>
                <span className="font-semibold text-gray-900">{allCases.length}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>First contact</span>
                <span className="font-semibold text-gray-900">{fmt(firstContact)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Last contact</span>
                <span className="font-semibold text-gray-900">{fmt(lastContact)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Channels used</span>
                <div className="flex gap-1.5">
                  {channelSet.size === 0
                    ? <span className="text-gray-400">—</span>
                    : [...channelSet].map(ch => (
                        <span key={ch} title={ch} className="text-base">
                          {CHANNEL_ICONS[ch] || '•'}
                        </span>
                      ))}
                </div>
              </div>
            </div>
          </div>

        </div>
        {/* end right column */}
      </div>
    </div>
  )
}
