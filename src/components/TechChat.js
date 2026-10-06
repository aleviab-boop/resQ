'use client'
import { useState, useEffect, useRef } from 'react'

// Auto-replies from technician based on keywords
const AUTO_REPLIES = [
  { match: ['eta', 'when', 'time', 'reach', 'arrive', 'long'], reply: "I'll be there in about {eta} minutes. Currently on my way!" },
  { match: ['where', 'location', 'coming'], reply: "I'm near {area}, heading your way now 🛵" },
  { match: ['hello', 'hi', 'hey', 'hlo'], reply: "Hi! I'm {name}, your resQ technician for today. How can I help?" },
  { match: ['cancel', 'reschedule'], reply: "For cancellations or rescheduling, please use the booking options in the app. I'll note your concern." },
  { match: ['part', 'spare', 'replace'], reply: "I carry common spare parts. If I need something specific, I'll let you know before proceeding." },
  { match: ['cost', 'price', 'charge', 'fee'], reply: "The service charge is as per your booking. Any extra parts cost will be shown before work begins." },
  { match: ['thanks', 'thank', 'ok', 'okay', 'great'], reply: "My pleasure! See you soon 😊" },
]

const FALLBACK_REPLIES = [
  "Got it! I'm on my way to your location.",
  "Sure, noted. I'll take care of it when I arrive.",
  "I'll be there shortly. Is there anything specific you'd like me to bring?",
  "Understood! Feel free to reach out if you have any questions.",
]

function getAutoReply(msg, tech) {
  const lower = msg.toLowerCase()
  for (const r of AUTO_REPLIES) {
    if (r.match.some(k => lower.includes(k))) {
      return r.reply
        .replace('{name}', tech.name)
        .replace('{eta}', tech.eta || 15)
        .replace('{area}', 'Andheri')
    }
  }
  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)]
}

function techInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const QUICK_MESSAGES = [
  'How far are you?',
  'Please call before arriving',
  'Can you bring a filter?',
  'Running 10 min late',
]

export default function TechChat({ booking, onClose }) {
  const storageKey = `resq_chat_${booking.id}`
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) return JSON.parse(saved)
    } catch {}
    return [
      {
        id: 1,
        from: 'tech',
        text: `Hi! I'm ${booking.tech.name}, your resQ technician. I've accepted your booking and I'm on my way. Feel free to message me here!`,
        time: new Date(Date.now() - 5 * 60000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]
  })
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef()
  const inputRef = useRef()

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(messages)) } catch {}
  }, [messages, storageKey])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function sendMessage(text) {
    const msg = text.trim()
    if (!msg) return
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const userMsg = { id: Date.now(), from: 'user', text: msg, time: now }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Simulate tech typing + reply
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const reply = getAutoReply(msg, booking.tech)
      const replyTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'tech', text: reply, time: replyTime }])
    }, 1200 + Math.random() * 800)
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-md h-[90vh] sm:h-[600px] rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-navy to-sky px-4 py-4 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {techInitials(booking.tech.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm truncate">{booking.tech.name}</div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
              <span className="text-white/80 text-xs">resQ Technician · On the way</span>
            </div>
          </div>
          <a href={`tel:${booking.tech.phone}`} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
          </a>
          <button onClick={onClose} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Booking pill */}
        <div className="bg-sky/5 border-b border-sky/10 px-4 py-2 flex items-center gap-2 flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-sky flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <span className="text-xs text-sky font-semibold truncate">{booking.service} · {booking.date}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
              {msg.from === 'tech' && (
                <div className="w-7 h-7 rounded-full bg-navy/10 flex items-center justify-center text-navy text-[10px] font-bold flex-shrink-0 mt-auto">
                  {techInitials(booking.tech.name)}
                </div>
              )}
              <div className={`max-w-[75%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.from === 'user'
                    ? 'bg-navy text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex justify-start gap-2">
              <div className="w-7 h-7 rounded-full bg-navy/10 flex items-center justify-center text-navy text-[10px] font-bold flex-shrink-0">
                {techInitials(booking.tech.name)}
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick messages */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0 border-t border-gray-100">
          {QUICK_MESSAGES.map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="flex-shrink-0 text-xs bg-sky/10 text-sky font-semibold px-3 py-1.5 rounded-full hover:bg-sky/20 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 flex gap-2 items-center flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            placeholder="Message technician…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-sky"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="w-10 h-10 bg-navy rounded-full flex items-center justify-center flex-shrink-0 disabled:bg-gray-300 transition"
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
