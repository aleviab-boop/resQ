'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  CASES,
  CONVERSATIONS,
  TICKETS,
  JOBS,
  CUSTOMERS,
  PRODUCTS,
  CHANNEL_ICONS,
  CASE_STATUS_COLORS,
  PARTS_INVENTORY,
  BRANDS,
  getTechnician,
  getCustomer,
  getProduct,
  getTicketsForCase,
  getJobsForCase,
  getConversationForCase,
  getCenter,
} from '@/lib/platformData'
import {
  getCaseStatus,
  setCaseStatus,
  getMessages as getLocalMessages,
  addMessage as persistMessage,
  getBookedSlot,
} from '@/lib/platformState'

const PRIORITY_DOT = {
  high:   'bg-red-500',
  medium: 'bg-amber-400',
  low:    'bg-gray-300',
}

const TYPE_BADGE = {
  installation: 'bg-purple-100 text-purple-700',
  repair:       'bg-orange-100 text-orange-700',
  service:      'bg-blue-100 text-blue-700',
  maintenance:  'bg-teal-100 text-teal-700',
  recovery:     'bg-pink-100 text-pink-700',
}

const TICKET_STATUS_PILL = {
  'done':             'bg-green-100 text-green-700',
  'open':             'bg-red-100 text-red-700',
  'in-transit':       'bg-blue-100 text-blue-700',
  'pending-approval': 'bg-amber-100 text-amber-700',
  'scheduled':        'bg-sky-100 text-sky-700',
  'closed':           'bg-gray-100 text-gray-500',
}

const TEAM_BADGE = {
  CX:    'bg-sky-100 text-sky-700',
  OPS:   'bg-purple-100 text-purple-700',
  FIELD: 'bg-orange-100 text-orange-700',
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateHeader(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase()
}

function formatDateShort(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

function formatDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  return `${date}, ${time}`
}

function slaCountdown(deadline) {
  if (!deadline) return null
  const now = new Date()
  const end = new Date(deadline)
  const diff = end - now
  if (diff <= 0) return { label: 'SLA Breached', color: 'text-red-600' }
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const color = h < 4 ? 'text-red-600' : h < 24 ? 'text-amber-600' : 'text-green-600'
  return { label: `${h}h ${m}m left`, color }
}

function getDayKey(iso) {
  return new Date(iso).toDateString()
}

function generateAISummary(caseData, tickets, jobs, conversation) {
  const statusPoints = []
  const nextSteps = []

  // Status bullets
  statusPoints.push(`Case ${caseData.id} raised on ${formatDate(caseData.createdAt)} via ${caseData.channel}`)

  const openTickets = tickets.filter(t => t.status !== 'done' && t.status !== 'closed')
  const doneTickets = tickets.filter(t => t.status === 'done')
  if (doneTickets.length > 0) statusPoints.push(`${doneTickets.length} ticket${doneTickets.length > 1 ? 's' : ''} resolved: ${doneTickets.map(t => t.title).join('; ')}`)

  const completedJobs = jobs.filter(j => j.status === 'completed')
  if (completedJobs.length > 0) {
    const v = completedJobs[0].visits?.[0]
    if (v?.diagnosis) statusPoints.push(`Diagnosis: ${v.diagnosis}`)
  }

  if (caseData.slaBreached) statusPoints.push('SLA breached — case flagged as critical')
  else {
    const countdown = slaCountdown(caseData.slaDeadline)
    if (countdown) statusPoints.push(`SLA: ${countdown.label}`)
  }

  if (caseData.tags?.includes('repeat-contact')) statusPoints.push('Customer has contacted support 3+ times')

  // Next steps
  openTickets.forEach(t => {
    if (t.type === 'scheduling') nextSteps.push(`Schedule ${t.title.toLowerCase()}`)
    else if (t.type === 'quote') nextSteps.push('Send repair quote to customer for approval')
    else if (t.type === 'parts-order') nextSteps.push('Await parts — update customer with ETA')
    else if (t.type === 'recovery') nextSteps.push('Senior agent callback to customer required')
    else if (t.type === 'compensation') nextSteps.push('Goodwill gesture pending manager approval')
    else nextSteps.push(t.title)
  })

  const scheduledJobs = jobs.filter(j => j.status === 'scheduled')
  if (scheduledJobs.length > 0) {
    nextSteps.push(`Next visit scheduled: ${scheduledJobs[0].scheduledDate} ${scheduledJobs[0].timeSlot}`)
  }

  if (nextSteps.length === 0) nextSteps.push('No immediate actions — monitor case progress')

  return { statusPoints: statusPoints.slice(0, 4), nextSteps: nextSteps.slice(0, 3) }
}

function buildTimeline(caseData, conversation, tickets, jobs) {
  const events = []

  // Case created
  events.push({
    id: 'ev-case-open',
    type: 'open',
    color: 'bg-green-500',
    title: `Case ${caseData.id} opened`,
    subtitle: `${formatDateTime(caseData.createdAt)} · ${caseData.channel}`,
    ts: caseData.createdAt,
  })

  // Conversation messages
  if (conversation?.messages) {
    conversation.messages.forEach((m, i) => {
      if (m.from === 'system') {
        events.push({
          id: `msg-${m.id}`,
          type: 'system',
          color: 'bg-gray-400',
          title: m.text.replace(/[⚠️]/g, '').trim(),
          subtitle: `${formatDateTime(m.time)} · system`,
          ts: m.time,
        })
      } else if (m.from === 'agent') {
        events.push({
          id: `msg-${m.id}`,
          type: 'agent',
          color: 'bg-sky-500',
          title: `Agent replied (${m.agent || conversation.agent})`,
          subtitle: `${formatDateTime(m.time)} · ${m.channel}`,
          ts: m.time,
        })
      } else if (m.from === 'customer') {
        events.push({
          id: `msg-${m.id}`,
          type: 'customer',
          color: 'bg-blue-400',
          title: `Customer message received`,
          subtitle: `${formatDateTime(m.time)} · ${m.channel}`,
          ts: m.time,
        })
      }
    })
  }

  // Tickets
  tickets.forEach(t => {
    events.push({
      id: `tkt-${t.id}`,
      type: 'ticket',
      color: 'bg-purple-500',
      title: `${t.id}: ${t.title}`,
      subtitle: `${formatDateTime(t.createdAt)} · ${t.team}`,
      ts: t.createdAt,
    })
  })

  // Jobs
  jobs.forEach(j => {
    const tech = getTechnician(j.technicianId)
    events.push({
      id: `job-${j.id}`,
      type: 'job',
      color: 'bg-orange-400',
      title: `${j.type.charAt(0).toUpperCase() + j.type.slice(1)} job ${j.status}`,
      subtitle: `${formatDate(j.scheduledDate + 'T00:00:00')} · ${tech?.name || 'Unassigned'}`,
      ts: j.scheduledDate + 'T00:00:00',
    })
  })

  // SLA breach
  if (caseData.slaBreached) {
    events.push({
      id: 'sla-breach',
      type: 'sla',
      color: 'bg-red-500',
      title: 'SLA breached',
      subtitle: `${formatDateTime(caseData.slaDeadline)} · auto-flag`,
      ts: caseData.slaDeadline,
    })
  }

  // Sort by timestamp
  events.sort((a, b) => new Date(a.ts) - new Date(b.ts))

  // Add "Now" marker
  events.push({
    id: 'now',
    type: 'now',
    color: 'border-2 border-gray-400 bg-white',
    title: `Now: ${caseData.status.replace(/-/g, ' ')}`,
    subtitle: 'Current status',
    ts: new Date().toISOString(),
    isNow: true,
  })

  return events
}

// Parts cost estimates for cases where partsUsed[] is empty but diagnosis implies parts
const CASE_PARTS_ESTIMATE = {
  'CS002': 3080, // Gas refill R32 (₹680) + estimated PCB (₹2,400)
  'CS003': 1800, // Drum bearing (₹1,800)
}

const TEMPLATE_TEXTS = {
  'installation-delay-apology': 'We sincerely apologise for the delay in scheduling your installation. Our team is prioritising your case and will contact you within 24 hours.',
  'slot-confirmation':          'Your service has been scheduled for [DATE] between [TIME]. Your technician [NAME] will contact you 30 minutes before arrival.',
  'technician-assigned':        '[NAME] has been assigned to your case. They will arrive between [TIME]. You can reach them at [PHONE].',
  'parts-delay-update':         'The part required for your repair has been ordered and is expected to arrive by [DATE]. We will contact you to schedule the revisit.',
  'recovery-callback':          'We are sorry to hear about your experience. Our senior team member will call you within 2 hours to resolve this.',
}

function MessageTagsFromText(text) {
  const tags = []
  const lower = text.toLowerCase()
  if (lower.includes('billing') || lower.includes('payment') || lower.includes('charge') || lower.includes('₹') || lower.includes('cost')) tags.push('Billing and checkout')
  if (lower.includes('install') || lower.includes('installation')) tags.push('Installation')
  if (lower.includes('delay') || lower.includes('wait') || lower.includes('months') || lower.includes('late')) tags.push('Wait time')
  if (lower.includes('technician') || lower.includes('engineer')) tags.push('Technician')
  if (lower.includes('warranty') || lower.includes('repair')) tags.push('Repair')
  tags.push('English')
  return tags.slice(0, 3)
}

export default function CaseDetailPage() {
  const params = useParams()
  const id = params?.id

  const [activeTab, setActiveTab] = useState('everything')
  const [activeRightTab, setActiveRightTab] = useState('details')
  const [timelineOrder, setTimelineOrder] = useState('oldest')
  const [composeText, setComposeText] = useState('')
  const [composeChannel, setComposeChannel] = useState('whatsapp')

  // platformState: persisted status override and locally-added messages
  const [overrideStatus, setOverrideStatus] = useState(() => getCaseStatus(id))
  const [localMessages, setLocalMessages] = useState(() => {
    const conv = CONVERSATIONS.find(c => c.caseId === id)
    return conv ? getLocalMessages(conv.id) : []
  })
  const [caseToast, setCaseToast] = useState(null)
  // platformState: booked slot from promise engine
  const bookedSlot = getBookedSlot(id)

  const caseData = useMemo(() => CASES.find(c => c.id === id), [id])
  const customer = useMemo(() => caseData ? getCustomer(caseData.customerId) : null, [caseData])
  const product = useMemo(() => caseData ? getProduct(caseData.productId) : null, [caseData])
  const technician = useMemo(() => caseData ? getTechnician(caseData.assignedTo) : null, [caseData])
  const center = useMemo(() => caseData ? getCenter(caseData.centerId) : null, [caseData])
  const tickets = useMemo(() => caseData ? getTicketsForCase(caseData.id) : [], [caseData])
  const jobs = useMemo(() => caseData ? getJobsForCase(caseData.id) : [], [caseData])
  const conversation = useMemo(() => caseData ? getConversationForCase(caseData.id) : null, [caseData])

  // Effective status: agent override takes priority over seed data
  const effectiveStatus = overrideStatus || caseData?.status || 'open'

  // Merge seeded messages with any locally-added ones
  const messages = useMemo(() => {
    const seeded = conversation?.messages || []
    return [...seeded, ...localMessages].sort((a, b) => new Date(a.time) - new Date(b.time))
  }, [conversation, localMessages])

  const filteredMessages = useMemo(() => {
    if (activeTab === 'everything') return messages
    if (activeTab === 'messages') return messages.filter(m => m.from === 'customer' || (m.from === 'agent' && m.channel !== 'internal'))
    if (activeTab === 'notes') return messages.filter(m => m.from === 'agent' && m.channel === 'internal' || m.from === 'system')
    if (activeTab === 'tickets') return []
    if (activeTab === 'actions') return messages.filter(m => m.from === 'system')
    return messages
  }, [messages, activeTab])

  const tabCounts = useMemo(() => ({
    everything: messages.length,
    messages: messages.filter(m => m.from === 'customer' || (m.from === 'agent' && m.channel !== 'internal')).length,
    notes: messages.filter(m => (m.from === 'agent' && m.channel === 'internal') || m.from === 'system').length,
    tickets: tickets.length,
    actions: messages.filter(m => m.from === 'system').length,
  }), [messages, tickets])

  const timeline = useMemo(() => {
    if (!caseData) return []
    const evs = buildTimeline(caseData, conversation, tickets, jobs)
    return timelineOrder === 'newest' ? [...evs].reverse() : evs
  }, [caseData, conversation, tickets, jobs, timelineOrder])

  const aiSummary = useMemo(() => {
    if (!caseData) return { statusPoints: [], nextSteps: [] }
    return generateAISummary(caseData, tickets, jobs, conversation)
  }, [caseData, tickets, jobs, conversation])

  // Group filtered messages by day
  const groupedMessages = useMemo(() => {
    const groups = []
    let lastDay = null
    filteredMessages.forEach(m => {
      const day = getDayKey(m.time)
      if (day !== lastDay) {
        groups.push({ type: 'separator', label: formatDateHeader(m.time), key: day })
        lastDay = day
      }
      groups.push({ type: 'message', ...m })
    })
    return groups
  }, [filteredMessages])

  if (!caseData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-300 mb-2">404</div>
          <div className="text-gray-500 text-sm">Case <span className="font-mono font-semibold">{id}</span> not found</div>
          <Link href="/ops/cases" className="mt-4 inline-block text-sky-600 text-sm hover:underline">← Back to Cases</Link>
        </div>
      </div>
    )
  }

  const statusClass = CASE_STATUS_COLORS[effectiveStatus] || 'bg-gray-100 text-gray-500'
  const priorityDot = PRIORITY_DOT[caseData.priority] || 'bg-gray-300'
  const typeBadge = TYPE_BADGE[caseData.type] || 'bg-gray-100 text-gray-600'
  const channelIcon = CHANNEL_ICONS[caseData.channel] || '📋'
  const sla = slaCountdown(caseData.slaDeadline)

  const STATUS_OPTIONS = ['open', 'in-progress', 'parts-awaited', 'scheduled', 'resolved', 'completed', 'closed']
  function handleStatusChange(newStatus) {
    setOverrideStatus(newStatus)
    setCaseStatus(id, newStatus)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans text-gray-800">

      {/* Toast notification */}
      {caseToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg pointer-events-none">
          <span>✓</span>
          <span>{caseToast}</span>
        </div>
      )}

      {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
      <div className="flex flex-col" style={{ width: '65%', minWidth: 0 }}>

        {/* ── CASE HEADER ── */}
        <div className="bg-white border-b border-gray-200 px-6 pt-5 pb-4 flex-shrink-0">
          {/* Row 1: ID + type + title */}
          <div className="flex items-start gap-3 mb-2">
            <span className="text-xs font-mono font-bold text-gray-500 mt-0.5 whitespace-nowrap">{caseData.id}</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${typeBadge}`}>{caseData.type}</span>
            <h1 className="text-sm font-semibold text-gray-900 leading-snug">{caseData.title}</h1>
          </div>

          {/* Row 2: Status + priority + channel + SLA */}
          <div className="flex items-center gap-3 mb-3">
            <select
              value={effectiveStatus}
              onChange={e => handleStatusChange(e.target.value)}
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-400 ${statusClass}`}
              title="Change case status"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
              ))}
            </select>
            <span className={`w-2.5 h-2.5 rounded-full ${priorityDot}`} title={`${caseData.priority} priority`} />
            <span className="text-sm" title={caseData.channel}>{channelIcon}</span>
            {caseData.slaBreached ? (
              <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">SLA Breached</span>
            ) : sla ? (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full bg-opacity-10 ${sla.color}`}>{sla.label}</span>
            ) : null}
            <span className="text-[11px] text-gray-400 ml-auto">Created {formatDate(caseData.createdAt)}</span>
          </div>

          {/* Row 3: Customer + Action buttons */}
          <div className="flex items-center gap-3">
            {customer && (
              <Link
                href={`/ops/customers/${customer.id}`}
                className="flex items-center gap-1.5 text-sm text-sky-700 font-medium hover:underline"
              >
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold flex items-center justify-center">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </span>
                {customer.name}
                <span className="text-gray-400 font-normal">·</span>
                <span className="text-gray-500 font-normal text-[12px]">{customer.phone}</span>
              </Link>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button className="text-[12px] font-medium px-3 py-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                Reassign
              </button>
              <button className="text-[12px] font-medium px-3 py-1.5 rounded-md border border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors">
                + Raise Ticket
              </button>
              <button className="text-[12px] font-medium px-3 py-1.5 rounded-md bg-gray-800 text-white hover:bg-gray-900 transition-colors">
                Close Case
              </button>
            </div>
          </div>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          {/* ── AI SUMMARY BOX ── */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">AI Summary</span>
              <div className="flex gap-2">
                <button className="text-[11px] font-medium px-2.5 py-1 rounded border border-gray-300 text-gray-600 hover:bg-white transition-colors">
                  Refresh
                </button>
                <button className="text-[11px] font-semibold px-3 py-1 rounded bg-sky-500 text-white hover:bg-sky-600 transition-colors">
                  ✦ Draft a reply
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Status so far</div>
                <ul className="space-y-1">
                  {aiSummary.statusPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[12px] text-gray-700">
                      <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Next steps</div>
                <ul className="space-y-1">
                  {aiSummary.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[12px] text-gray-700">
                      <span className="text-sky-500 mt-0.5 flex-shrink-0 font-bold">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 mt-3 border-t border-gray-200 pt-2">Drafted by AI from case record.</div>
          </div>

          {/* ── TICKETS SECTION ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-gray-800">
                Tickets on this case <span className="text-gray-400 font-normal">{tickets.length}</span>
              </span>
              <button className="text-[11px] font-medium px-2.5 py-1 rounded border border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors">
                + Raise a ticket
              </button>
            </div>
            {tickets.length === 0 ? (
              <div className="text-[12px] text-gray-400 italic px-1">No tickets on this case.</div>
            ) : (
              <div className="space-y-2">
                {tickets.map(ticket => {
                  const slaForTicket = null // tickets don't have SLA deadline in mock data; use case SLA as proxy for open ones
                  const ticketStatusClass = TICKET_STATUS_PILL[ticket.status] || 'bg-gray-100 text-gray-500'
                  const teamClass = TEAM_BADGE[ticket.team] || 'bg-gray-100 text-gray-500'
                  return (
                    <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3">
                      <span className="text-[11px] font-mono text-gray-400 w-12 flex-shrink-0">{ticket.id}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium text-gray-800 truncate">{ticket.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${teamClass}`}>{ticket.team}</span>
                          <span className="text-[10px] text-gray-400">{formatDate(ticket.createdAt)}</span>
                        </div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${ticketStatusClass}`}>
                        {ticket.status.replace(/-/g, ' ')}
                      </span>
                      {ticket.status === 'open' && sla && !caseData.slaBreached && (
                        <span className={`text-[11px] font-medium flex-shrink-0 ${sla.color}`}>{sla.label}</span>
                      )}
                      {caseData.slaBreached && ticket.status === 'open' && (
                        <span className="text-[11px] font-medium text-red-600 flex-shrink-0">SLA Breached</span>
                      )}
                      <span className="text-[11px] text-gray-500 flex-shrink-0">{ticket.owner}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── CONVERSATION SECTION ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-gray-800">Conversation</span>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 mb-3 border-b border-gray-200 pb-0">
              {[
                { key: 'everything', label: 'Everything' },
                { key: 'messages',   label: 'Messages & calls' },
                { key: 'notes',      label: 'Notes' },
                { key: 'tickets',    label: 'Tickets' },
                { key: 'actions',    label: 'Case actions' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`text-[12px] px-3 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-sky-500 text-sky-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label} <span className={`ml-0.5 text-[11px] ${activeTab === tab.key ? 'text-sky-500' : 'text-gray-400'}`}>{tabCounts[tab.key]}</span>
                </button>
              ))}
            </div>

            {/* Messages */}
            {activeTab === 'tickets' ? (
              <div className="space-y-2">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-[12px] text-gray-700">
                    <span className="font-mono text-gray-400 mr-2">{ticket.id}</span> {ticket.title} —{' '}
                    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${TICKET_STATUS_PILL[ticket.status] || ''}`}>{ticket.status}</span>
                  </div>
                ))}
                {tickets.length === 0 && <div className="text-[12px] text-gray-400 italic">No tickets.</div>}
              </div>
            ) : (
              <div className="space-y-1">
                {groupedMessages.map((item, idx) => {
                  if (item.type === 'separator') {
                    return (
                      <div key={item.key + idx} className="flex items-center gap-3 py-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-[10px] font-semibold text-gray-400 tracking-wider px-2">{item.label}</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                    )
                  }

                  const m = item
                  const ch = CHANNEL_ICONS[m.channel] || '📋'

                  if (m.from === 'system') {
                    return (
                      <div key={m.id + idx} className="flex justify-center py-1">
                        <span className="text-[11px] italic text-gray-400 bg-gray-100 px-3 py-1 rounded-full max-w-lg text-center">{m.text}</span>
                      </div>
                    )
                  }

                  const isAgent = m.from === 'agent'
                  const isInternalNote = m.channel === 'internal' && m.from === 'agent'
                  const customerName = customer?.name || 'Customer'

                  if (isInternalNote) {
                    return (
                      <div key={m.id + idx} className="flex justify-center py-1">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-lg">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">Internal Note</span>
                            <span className="text-[10px] text-amber-400">· {m.agent || conversation?.agent} · {formatTime(m.time)}</span>
                          </div>
                          <p className="text-[12px] text-amber-800 italic">{m.text}</p>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={m.id + idx} className={`flex ${isAgent ? 'justify-end' : 'justify-start'} py-0.5`}>
                      <div className={`max-w-[70%] ${isAgent ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-snug ${
                          isAgent
                            ? 'bg-sky-50 text-gray-800 rounded-tr-sm'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                        }`}>
                          {m.text}
                        </div>
                        <div className={`flex items-center gap-1.5 mt-1 px-1 ${isAgent ? 'flex-row-reverse' : 'flex-row'}`}>
                          <span className="text-[11px] font-medium text-gray-500">
                            {isAgent ? (m.agent || conversation?.agent || 'Agent') : customerName}
                          </span>
                          <span className="text-[10px] text-gray-400">·</span>
                          <span className="text-[10px] text-gray-400">{formatTime(m.time)}</span>
                          <span className="text-[11px]">{ch}</span>
                        </div>
                        {!isAgent && (
                          <div className="flex flex-wrap gap-1 mt-1 px-1">
                            {MessageTagsFromText(m.text).map((tag, ti) => (
                              <span key={ti} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}

                {filteredMessages.length === 0 && (
                  <div className="text-center text-[12px] text-gray-400 italic py-6">No messages in this view.</div>
                )}
              </div>
            )}

            {/* Compose bar */}
            <div className="mt-4 border border-gray-200 rounded-xl bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-3 pt-3 pb-1 border-b border-gray-100">
                <span className="text-[11px] font-semibold text-gray-500">Reply via</span>
                {['whatsapp', 'email', 'app'].map(ch => (
                  <button
                    key={ch}
                    onClick={() => setComposeChannel(ch)}
                    className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                      composeChannel === ch ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {CHANNEL_ICONS[ch]} {ch.charAt(0).toUpperCase() + ch.slice(1)}
                  </button>
                ))}
              </div>
              {/* Quick template chips */}
              <div className="px-3 py-2 flex flex-wrap gap-1.5 border-b border-gray-100">
                {(conversation?.templates ?? Object.keys(TEMPLATE_TEXTS)).map(tpl =>
                  TEMPLATE_TEXTS[tpl] ? (
                    <button
                      key={tpl}
                      type="button"
                      onClick={() => setComposeText(TEMPLATE_TEXTS[tpl])}
                      className="text-[10px] font-semibold text-[#00a1e1] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-1 rounded-full transition"
                      title={TEMPLATE_TEXTS[tpl].slice(0, 80)}
                    >
                      {tpl.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ) : null
                )}
              </div>
              <textarea
                value={composeText}
                onChange={e => setComposeText(e.target.value)}
                placeholder={`Type a message to ${customer?.name || 'customer'}…`}
                rows={3}
                className="w-full px-4 py-3 text-[13px] text-gray-800 placeholder-gray-400 resize-none focus:outline-none"
              />
              <div className="flex items-center justify-between px-3 pb-3">
                <div className="flex gap-2">
                  <button className="text-[11px] text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100">📎 Attach</button>
                  <button className="text-[11px] text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100">📋 Template</button>
                </div>
                <button
                  className={`text-[12px] font-semibold px-4 py-1.5 rounded-lg transition-colors ${
                    composeText.trim()
                      ? 'bg-sky-500 text-white hover:bg-sky-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!composeText.trim()}
                  onClick={() => {
                    if (!composeText.trim()) return
                    const convId = conversation?.id || `CV-${id}`
                    const msg = {
                      from: 'agent',
                      text: composeText.trim(),
                      time: new Date().toISOString(),
                      channel: composeChannel,
                      agent: 'You',
                    }
                    persistMessage(convId, msg)
                    setLocalMessages(prev => [...prev, { id: `local-${Date.now()}`, ...msg }])
                    setCaseToast(`Sent via ${composeChannel.charAt(0).toUpperCase() + composeChannel.slice(1)}`)
                    setTimeout(() => setCaseToast(null), 2200)
                    setComposeText('')
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────────── */}
      <div className="flex flex-col border-l border-gray-200 bg-white overflow-y-auto flex-shrink-0" style={{ width: '35%' }}>

        {/* ── HISTORY TIMELINE ── */}
        <div className="border-b border-gray-200 px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-gray-700">
              {timeline.length} changes, first message to now
            </span>
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-0.5">
              <button
                onClick={() => setTimelineOrder('oldest')}
                className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors ${
                  timelineOrder === 'oldest' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
                }`}
              >
                Oldest
              </button>
              <button
                onClick={() => setTimelineOrder('newest')}
                className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors ${
                  timelineOrder === 'newest' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
                }`}
              >
                Newest
              </button>
            </div>
          </div>

          {/* Timeline list */}
          <div className="relative">
            {timeline.map((ev, i) => {
              const isLast = i === timeline.length - 1
              return (
                <div key={ev.id} className="flex gap-3 relative">
                  {/* Vertical line */}
                  {!isLast && (
                    <div className="absolute left-[9px] top-5 bottom-0 w-px bg-gray-200" />
                  )}
                  {/* Dot */}
                  <div className="flex-shrink-0 mt-1 z-10">
                    {ev.isNow ? (
                      <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-400 bg-white" />
                    ) : (
                      <div className={`w-[18px] h-[18px] rounded-full ${ev.color}`} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-4 flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-gray-800 leading-snug">{ev.title}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{ev.subtitle}</div>
                    {ev.isNow && (
                      <div className="text-[10px] text-sky-600 mt-0.5 font-medium">
                        {sla && !caseData.slaBreached ? `SLA: ${sla.label}` : caseData.slaBreached ? 'SLA breached' : ''}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── TABBED DETAIL PANEL ── */}
        <div className="px-5 pt-4 pb-2 border-b border-gray-200">
          <div className="flex gap-1">
            {[
              { key: 'details',  label: 'Details' },
              { key: 'customer', label: 'Customer' },
              { key: 'tickets',  label: 'Tickets' },
              { key: 'guide',    label: 'Guide' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveRightTab(tab.key)}
                className={`text-[12px] px-3 py-1.5 rounded font-medium transition-colors ${
                  activeRightTab === tab.key
                    ? 'bg-navy text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                style={activeRightTab === tab.key ? { backgroundColor: '#13347b' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 flex-1 text-[12px] text-gray-700 space-y-3">
          {activeRightTab === 'details' && (
            <>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Assigned to</div>
                {technician ? (
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center" style={{ backgroundColor: '#13347b' }}>
                      {technician.name.split(' ').map(n => n[0]).join('')}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-800">{technician.name}</div>
                      <div className="text-[10px] text-gray-400">{technician.badge} · ⭐ {technician.rating} · {technician.jobs} jobs</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">Unassigned</span>
                )}
              </div>

              {center && (
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Service Center</div>
                  <div className="font-medium text-gray-800">{center.name}</div>
                  <div className="text-[11px] text-gray-400">{center.address}</div>
                </div>
              )}

              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">SLA Deadline</div>
                <div className={`font-medium ${caseData.slaBreached ? 'text-red-600' : 'text-gray-800'}`}>
                  {formatDateTime(caseData.slaDeadline)}
                  {caseData.slaBreached && <span className="ml-1 text-[10px] font-semibold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">BREACHED</span>}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Created at</div>
                <div className="text-gray-800">{formatDateTime(caseData.createdAt)}</div>
              </div>

              {product && (
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Product</div>
                  <div className="font-medium text-gray-800">{product.brand} {product.model}</div>
                  <div className="text-[11px] text-gray-400">{product.type} · S/N: {product.serial}</div>
                  <div className="text-[11px] text-gray-400">
                    Purchased {formatDate(product.purchaseDate)} · Warranty till {formatDate(product.warrantyExpiry)}
                  </div>
                  <div className={`text-[10px] mt-0.5 font-semibold ${
                    new Date(product.warrantyExpiry) > new Date() ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {new Date(product.warrantyExpiry) > new Date() ? 'In Warranty' : 'Out of Warranty'}
                  </div>
                </div>
              )}

              {jobs.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Jobs / Visits</div>
                  {jobs.map(j => (
                    <div key={j.id} className="flex items-center gap-2 py-1 border-b border-gray-100 last:border-0">
                      <span className="text-[10px] font-mono text-gray-400">{j.id}</span>
                      <span className="text-[11px] text-gray-700 capitalize">{j.type}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ml-auto ${
                        j.status === 'completed' ? 'bg-green-100 text-green-700' :
                        j.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        j.status === 'scheduled' ? 'bg-sky-100 text-sky-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>{j.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Booked slot from promise engine */}
              {bookedSlot && (
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Booked Slot</div>
                  <div className="bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 space-y-0.5">
                    <div className="text-[12px] font-semibold text-sky-800">
                      {bookedSlot.date} &nbsp;·&nbsp; {bookedSlot.window}
                    </div>
                    {bookedSlot.technicianId && (
                      <div className="text-[11px] text-sky-700">
                        Tech: {getTechnician(bookedSlot.technicianId)?.name || bookedSlot.technicianId}
                      </div>
                    )}
                    {bookedSlot.centerId && (
                      <div className="text-[11px] text-sky-600">{getCenter(bookedSlot.centerId)?.name || bookedSlot.centerId}</div>
                    )}
                    <div className="text-[9px] text-sky-400 pt-0.5">Booked via Promise Engine</div>
                  </div>
                </div>
              )}

              {caseData.tags?.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {caseData.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── JOB ECONOMICS CARD ── */}
              {(() => {
                const partsSkus = jobs.flatMap(j => (j.visits || []).flatMap(v => v.partsUsed || []))
                const partsFromSkus = partsSkus.reduce((sum, sku) => {
                  const part = PARTS_INVENTORY.find(p => p.sku === sku)
                  return sum + (part?.price || 0)
                }, 0)
                const partsTotal = partsFromSkus > 0 ? partsFromSkus : (CASE_PARTS_ESTIMATE[caseData.id] || 0)
                const partsIsEstimated = partsFromSkus === 0 && partsTotal > 0
                const labour = 299, travel = 85
                const totalCost = labour + partsTotal + travel
                const brandMatch = product
                  ? BRANDS.find(b => b.name.toLowerCase().startsWith((product.brand || '').toLowerCase()))
                  : null
                const revenue = brandMatch?.paidPerJob || 0
                const isOwn = brandMatch?.isOwn || false
                const margin = revenue - totalCost
                return (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                      <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Job Economics</span>
                      <span className="text-[9px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Simulated</span>
                    </div>
                    <div className="px-4 py-3 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-gray-500">Labour <span className="text-gray-400 text-[10px]">· base diagnostic visit</span></span>
                        <span className="text-[12px] font-medium text-gray-800">₹{labour}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-gray-500">Parts{partsIsEstimated ? ' (est.)' : ''}</span>
                        <span className="text-[12px] font-medium text-gray-800">₹{partsTotal}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-gray-500">Travel <span className="text-gray-400 text-[10px]">· flat, simulated</span></span>
                        <span className="text-[12px] font-medium text-gray-800">₹{travel}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-100 pt-1.5">
                        <span className="text-[11px] font-semibold text-gray-700">Total cost</span>
                        <span className="text-[12px] font-bold text-gray-900">₹{totalCost}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-gray-500">
                          {isOwn ? 'Own brand — direct revenue' : brandMatch ? `Revenue (${brandMatch.name} contract)` : 'Revenue'}
                        </span>
                        <span className="text-[12px] font-medium text-gray-800">
                          {isOwn ? '—' : revenue > 0 ? `₹${revenue}` : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-100 pt-1.5">
                        <span className="text-[11px] font-semibold text-gray-700">Margin</span>
                        <span className={`text-[13px] font-bold ${isOwn ? 'text-gray-400' : margin > 0 ? 'text-green-600' : margin < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                          {isOwn ? 'Cost centre' : `${margin >= 0 ? '+' : '−'}₹${Math.abs(margin)}`}
                        </span>
                      </div>
                      {caseData.slaBreached && (
                        <div className="flex justify-between items-center pt-0.5">
                          <span className="text-[11px] text-red-600">SLA breach penalty</span>
                          <span className="text-[12px] font-semibold text-red-600">−₹500 (estimated)</span>
                        </div>
                      )}
                      <p className="text-[10px] text-gray-400 pt-1 border-t border-gray-100">
                        Per-job economics. Revisits are costed separately.
                      </p>
                    </div>
                  </div>
                )
              })()}

              <button className="mt-2 w-full text-[11px] font-medium px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                Assign by rule
              </button>
            </>
          )}

          {activeRightTab === 'customer' && customer && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 text-sm font-bold flex items-center justify-center">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-[13px]">{customer.name}</div>
                  <div className="text-[11px] text-gray-400">{customer.phone}</div>
                </div>
                <span className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  customer.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                  customer.tier === 'Gold' ? 'bg-amber-100 text-amber-700' :
                  customer.tier === 'Silver' ? 'bg-gray-100 text-gray-600' :
                  'bg-orange-100 text-orange-700'
                }`}>{customer.tier}</span>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Email', value: customer.email },
                  { label: 'City', value: `${customer.city}, ${customer.state}` },
                  { label: 'Customer since', value: formatDate(customer.since) },
                  { label: 'Total spend', value: `₹${customer.totalSpend?.toLocaleString('en-IN')}` },
                  { label: 'NPS score', value: customer.nps != null ? `${customer.nps}/10` : 'No response' },
                  { label: 'Care plan', value: customer.carePlan ? '✓ Active' : '✗ Not enrolled' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-start">
                    <span className="text-[11px] text-gray-400">{row.label}</span>
                    <span className={`text-[12px] font-medium text-right ${
                      row.label === 'Care plan' && customer.carePlan ? 'text-green-600' :
                      row.label === 'Care plan' ? 'text-gray-400' : 'text-gray-800'
                    }`}>{row.value}</span>
                  </div>
                ))}
              </div>

              {customer.tags?.length > 0 && (
                <div className="mt-3">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {customer.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <Link href={`/ops/customers/${customer.id}`} className="mt-4 block text-center text-[12px] font-medium text-sky-600 hover:underline">
                View full customer profile →
              </Link>

              <button className="w-full text-[11px] font-medium px-3 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                Assign by rule
              </button>
            </>
          )}

          {activeRightTab === 'tickets' && (
            <div className="space-y-2">
              {tickets.length === 0 ? (
                <div className="text-gray-400 italic text-center py-4">No tickets on this case.</div>
              ) : (
                tickets.map(ticket => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg px-3 py-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-gray-400">{ticket.id}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TICKET_STATUS_PILL[ticket.status] || 'bg-gray-100 text-gray-500'}`}>
                        {ticket.status.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <div className="text-[12px] font-medium text-gray-800">{ticket.title}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{ticket.team} · {ticket.owner} · {formatDate(ticket.createdAt)}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeRightTab === 'guide' && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Resolution Guide</div>
              {caseData.type === 'installation' && (
                <ol className="space-y-2 list-decimal list-inside">
                  {['Verify customer ID and order details', 'Check accessories availability (piping, stabilizer, brackets)', 'Assign available technician with AC skill', 'Confirm slot with customer via WhatsApp', 'Complete installation — get customer sign-off', 'Trigger post-service NPS survey'].map((step, i) => (
                    <li key={i} className="text-[12px] text-gray-700">{step}</li>
                  ))}
                </ol>
              )}
              {caseData.type === 'repair' && (
                <ol className="space-y-2 list-decimal list-inside">
                  {['Confirm warranty status', 'Schedule diagnosis visit', 'Collect technician diagnosis + evidence', 'Generate repair quote if out-of-warranty', 'Get customer quote approval', 'Procure parts if needed', 'Complete repair — get customer sign-off', 'Trigger NPS survey'].map((step, i) => (
                    <li key={i} className="text-[12px] text-gray-700">{step}</li>
                  ))}
                </ol>
              )}
              {caseData.type === 'recovery' && (
                <ol className="space-y-2 list-decimal list-inside">
                  {['Review NPS score and feedback', 'Assign senior agent for callback', 'Conduct callback within 24h', 'Identify root cause of dissatisfaction', 'Offer appropriate goodwill gesture', 'Follow up to confirm resolution', 'Document for operations review'].map((step, i) => (
                    <li key={i} className="text-[12px] text-gray-700">{step}</li>
                  ))}
                </ol>
              )}
              {!['installation','repair','recovery'].includes(caseData.type) && (
                <ol className="space-y-2 list-decimal list-inside">
                  {['Review case description and history', 'Assign technician', 'Complete service visit', 'Close tickets', 'Get customer confirmation', 'Trigger NPS survey'].map((step, i) => (
                    <li key={i} className="text-[12px] text-gray-700">{step}</li>
                  ))}
                </ol>
              )}
              {conversation?.internalNote && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-1">Internal Note</div>
                  <p className="text-[12px] text-amber-800">{conversation.internalNote}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
