'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  CONVERSATIONS,
  CHANNEL_ICONS,
  getCustomer,
  getCase,
} from '@/lib/platformData'

const TABS = ['all', 'whatsapp', 'phone', 'email', 'app', 'store', 'internal']

const CHANNEL_LABEL = {
  whatsapp: 'WhatsApp',
  phone:    'Phone',
  email:    'Email',
  app:      'App',
  store:    'Store',
  internal: 'Internal',
}

const TEMPLATE_LABELS = {
  'installation-delay-apology': 'Installation Delay Apology',
  'slot-confirmation':          'Slot Confirmation',
  'technician-assigned':        'Technician Assigned',
  'quote-ready':                'Quote Ready',
  'parts-delay-update':         'Parts Delay Update',
  'revisit-confirmation':       'Revisit Confirmation',
  'recovery-callback':          'Recovery Callback',
  'apology-voucher':            'Apology + Voucher',
}

const TEMPLATE_TEXTS = {
  'installation-delay-apology': 'We sincerely apologise for the delay in scheduling your installation. Our team is prioritising your case and will contact you within 24 hours.',
  'slot-confirmation':          'Your service has been scheduled for [DATE] between [TIME]. Your technician [NAME] will contact you 30 minutes before arrival.',
  'technician-assigned':        '[NAME] has been assigned to your case. They will arrive between [TIME]. You can reach them at [PHONE].',
  'parts-delay-update':         'The part required for your repair has been ordered and is expected to arrive by [DATE]. We will contact you to schedule the revisit.',
  'recovery-callback':          'We are sorry to hear about your experience. Our senior team member will call you within 2 hours to resolve this.',
}

function relativeTime(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 2) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function formatDateSeparator(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dMidnight     = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diff = Math.round((todayMidnight - dMidnight) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function groupMessagesByDate(messages) {
  const groups = []
  let lastDate = null
  for (const msg of messages) {
    const dateKey = new Date(msg.time).toDateString()
    if (dateKey !== lastDate) {
      groups.push({ type: 'separator', label: formatDateSeparator(msg.time), key: `sep-${msg.time}` })
      lastDate = dateKey
    }
    groups.push({ type: 'message', msg, key: msg.id })
  }
  return groups
}

export default function InboxPage() {
  const [selectedConvId, setSelectedConvId] = useState(CONVERSATIONS[0]?.id ?? null)
  const [activeTab, setActiveTab]           = useState('all')
  const [composeText, setComposeText]       = useState('')
  const [composeChannel, setComposeChannel] = useState('whatsapp')
  const [isNote, setIsNote]                 = useState(false)
  const [localMessages, setLocalMessages]   = useState({})
  const [toast, setToast]                   = useState(null)

  const filteredConvs = CONVERSATIONS.filter(c => activeTab === 'all' || c.channel === activeTab)
  const selectedConv  = CONVERSATIONS.find(c => c.id === selectedConvId) ?? null
  const selectedCustomer = selectedConv ? getCustomer(selectedConv.customerId) : null
  const selectedCase  = selectedConv ? getCase(selectedConv.caseId) : null

  // Merge seeded messages with locally sent ones
  const allMessages = selectedConv
    ? [...selectedConv.messages, ...(localMessages[selectedConvId] || [])]
    : []
  const groupedMessages = groupMessagesByDate(allMessages)

  const unreadCount = CONVERSATIONS.filter(c => c.status === 'open').length

  function handleSend() {
    if (!composeText.trim() || !selectedConvId) return
    const newMsg = {
      id:      `local-${Date.now()}`,
      from:    'agent',
      text:    composeText.trim(),
      time:    new Date().toISOString(),
      channel: isNote ? 'internal' : composeChannel,
      agent:   'You',
    }
    setLocalMessages(prev => ({
      ...prev,
      [selectedConvId]: [...(prev[selectedConvId] || []), newMsg],
    }))
    const toastText = isNote
      ? 'Note saved — internal only'
      : `Sent via ${CHANNEL_LABEL[composeChannel] || composeChannel}`
    setToast(toastText)
    setTimeout(() => setToast(null), 2200)
    setComposeText('')
    setIsNote(false)
  }

  return (
    <div style={{ height: '100vh' }} className="flex flex-col bg-gray-50 overflow-hidden relative">

      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-2.5 flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
        <Link href="/ops" className="hover:text-[#00a1e1] transition">Ops Hub</Link>
        <span>›</span>
        <span className="text-gray-700 font-semibold">Omnichannel Inbox</span>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg animate-fade-in">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ── LEFT: Conversation list (35%) ──────────────────────────────── */}
        <div className="flex flex-col bg-white border-r border-gray-100 overflow-hidden flex-shrink-0" style={{ width: '35%', minWidth: 260, maxWidth: 420 }}>

          {/* Header */}
          <div className="px-4 pt-4 pb-0 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-extrabold text-gray-900">Inbox</h2>
              <span className="bg-[#00a1e1] text-white text-xs font-bold px-2 py-0.5 rounded-full leading-snug">
                {unreadCount}
              </span>
            </div>

            {/* Channel tabs */}
            <div className="flex gap-1 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab) }}
                  className={`flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition ${
                    activeTab === tab
                      ? 'bg-[#00a1e1] text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'all' ? 'All' : `${CHANNEL_ICONS[tab] ?? ''} ${CHANNEL_LABEL[tab]}`}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                <div className="text-3xl mb-2">💬</div>
                <div className="text-sm font-medium">No conversations</div>
              </div>
            ) : (
              filteredConvs.map(conv => {
                const customer = getCustomer(conv.customerId)
                const kase     = getCase(conv.caseId)
                const lastMsg  = conv.messages[conv.messages.length - 1]
                const isActive = conv.id === selectedConvId
                const isUnread = conv.status === 'open'

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors relative ${
                      isActive
                        ? 'bg-sky-50 border-l-[3px] border-l-[#00a1e1]'
                        : 'border-l-[3px] border-l-transparent'
                    }`}
                  >
                    {/* Row 1: icon + name + unread + time */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-sm flex-shrink-0">{CHANNEL_ICONS[conv.channel]}</span>
                        <span className={`text-sm truncate font-semibold ${isActive ? 'text-[#00a1e1]' : 'text-gray-900'}`}>
                          {customer?.name ?? 'Unknown'}
                        </span>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" title="Unread" />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 mt-px">{relativeTime(conv.updatedAt)}</span>
                    </div>

                    {/* Row 2: case ID + title snippet */}
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-mono text-[10px] font-bold text-gray-400">{kase?.id}</span>
                      <span className="text-[10px] text-gray-400">·</span>
                      <span className="text-[10px] text-gray-400 truncate">{kase?.title?.slice(0, 38)}{kase?.title?.length > 38 ? '…' : ''}</span>
                    </div>

                    {/* Row 3: last message preview */}
                    <div className="mt-1 text-xs text-gray-500 truncate leading-snug">
                      {lastMsg?.text?.slice(0, 65)}{lastMsg && lastMsg.text?.length > 65 ? '…' : ''}
                    </div>

                    {/* Row 4: agent name */}
                    <div className="mt-1 text-[10px] text-gray-300">{conv.agent}</div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ── RIGHT: Conversation detail (65%) ───────────────────────────── */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          {!selectedConv ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 bg-gray-50">
              <div className="text-5xl mb-4">💬</div>
              <div className="text-lg font-semibold text-gray-400">Select a conversation to view</div>
              <div className="text-sm text-gray-300 mt-1">Choose from the list on the left</div>
            </div>
          ) : (
            <>
              {/* Conversation header */}
              <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-lg flex-shrink-0">
                    {CHANNEL_ICONS[selectedConv.channel]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 text-base leading-tight">{selectedCustomer?.name}</div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-400 mt-0.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] capitalize flex-shrink-0 ${
                        selectedConv.status === 'open'        ? 'bg-red-100 text-red-700' :
                        selectedConv.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        selectedConv.status === 'parts-awaited' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{selectedConv.status}</span>
                      <span>{selectedCustomer?.phone}</span>
                      <span className="text-gray-300">·</span>
                      <span className="flex items-center gap-1">
                        {CHANNEL_ICONS[selectedConv.channel]} {CHANNEL_LABEL[selectedConv.channel] ?? selectedConv.channel}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span>Agent: <span className="font-medium text-gray-600">{selectedConv.agent}</span></span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/ops/cases/${selectedConv.caseId}`}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#00a1e1] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition"
                >
                  Open Case {selectedConv.caseId} →
                </Link>
              </div>

              {/* Messages pane */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2 bg-gray-50 min-h-0">

                {/* Internal note banner */}
                {selectedConv.internalNote && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-xs text-yellow-800 flex items-start gap-2 mb-4">
                    <span className="flex-shrink-0 text-base">🔒</span>
                    <div>
                      <span className="font-bold">Internal note — </span>
                      {selectedConv.internalNote}
                    </div>
                  </div>
                )}

                {groupedMessages.map(item => {
                  if (item.type === 'separator') {
                    return (
                      <div key={item.key} className="flex items-center gap-3 py-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-[10px] text-gray-400 font-semibold flex-shrink-0 uppercase tracking-wide">
                          {item.label}
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                    )
                  }

                  const { msg } = item

                  if (msg.from === 'system') {
                    return (
                      <div key={msg.id} className="flex justify-center py-1">
                        <span className="text-[10px] text-gray-400 bg-gray-200/80 px-3 py-1 rounded-full max-w-sm text-center leading-snug">
                          {msg.text}
                        </span>
                      </div>
                    )
                  }

                  // Internal note message (agent channel=internal)
                  if (msg.from === 'agent' && msg.channel === 'internal') {
                    return (
                      <div key={msg.id} className="flex justify-center py-1">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 max-w-[70%]">
                          <div className="flex items-center gap-1 text-[10px] text-yellow-600 font-bold mb-1">
                            🔒 Internal note — {msg.agent ?? selectedConv.agent}
                          </div>
                          <div className="text-xs text-yellow-900 leading-snug">{msg.text}</div>
                          <div className="text-[10px] text-yellow-500 mt-1 text-right">{formatTime(msg.time)}</div>
                        </div>
                      </div>
                    )
                  }

                  if (msg.from === 'customer') {
                    return (
                      <div key={msg.id} className="flex items-end gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {selectedCustomer?.name?.charAt(0) ?? '?'}
                        </div>
                        <div className="max-w-[60%]">
                          <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-gray-800 shadow-sm leading-relaxed">
                            {msg.text}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1 ml-1">{formatTime(msg.time)}</div>
                        </div>
                      </div>
                    )
                  }

                  // Agent message
                  return (
                    <div key={msg.id} className="flex items-end gap-2 flex-row-reverse">
                      <div className="w-7 h-7 rounded-full bg-[#00a1e1] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {(msg.agent ?? selectedConv.agent)?.charAt(0) ?? 'A'}
                      </div>
                      <div className="max-w-[60%]">
                        <div className="bg-sky-50 border border-sky-100 rounded-2xl rounded-br-sm px-4 py-2.5 text-sm text-gray-800 leading-relaxed">
                          {msg.text}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 text-right mr-1">
                          {msg.agent ?? selectedConv.agent} · {formatTime(msg.time)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Compose area */}
              <div className="bg-white border-t border-gray-100 flex-shrink-0">

                {/* Quick reply template chips */}
                {selectedConv.templates?.length > 0 && (
                  <div className="px-4 pt-3 flex flex-wrap gap-2">
                    {selectedConv.templates.map(tpl => (
                      <button
                        key={tpl}
                        onClick={() => setComposeText(TEMPLATE_TEXTS[tpl] ?? TEMPLATE_LABELS[tpl] ?? tpl)}
                        className="text-[10px] font-semibold text-[#00a1e1] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-full transition"
                        title={TEMPLATE_TEXTS[tpl] ? TEMPLATE_TEXTS[tpl].slice(0, 80) + '…' : ''}
                      >
                        {TEMPLATE_LABELS[tpl] ?? tpl}
                      </button>
                    ))}
                  </div>
                )}

                {/* Note indicator */}
                {isNote && (
                  <div className="px-4 pt-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
                      🔒 Internal Note — not visible to customer
                    </span>
                  </div>
                )}

                <div className="p-4">
                  <textarea
                    value={composeText}
                    onChange={e => setComposeText(e.target.value)}
                    placeholder={isNote ? 'Write an internal note…' : 'Type a reply…'}
                    rows={3}
                    className={`w-full text-sm border rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 transition ${
                      isNote
                        ? 'bg-yellow-50 border-yellow-200 focus:ring-yellow-300'
                        : 'bg-gray-50 border-gray-200 focus:ring-sky-300'
                    }`}
                  />

                  <div className="flex items-center justify-between mt-3">
                    {/* Channel picker (hidden in note mode) */}
                    <div>
                      {!isNote && (
                        <select
                          value={composeChannel}
                          onChange={e => setComposeChannel(e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-300 cursor-pointer"
                        >
                          <option value="whatsapp">💬 WhatsApp</option>
                          <option value="email">📧 Email</option>
                          <option value="sms">📱 SMS</option>
                        </select>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setIsNote(n => !n); setComposeText('') }}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                          isNote
                            ? 'bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {isNote ? '✕ Cancel Note' : '🔒 Add Note'}
                      </button>
                      <button
                        onClick={handleSend}
                        disabled={!composeText.trim()}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#00a1e1] hover:bg-sky-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isNote ? 'Save Note' : 'Send →'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
