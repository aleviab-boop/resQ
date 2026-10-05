'use client'
import { useState, useRef, useEffect } from 'react'

const FAQ_RESPONSES = {
  'how to book': 'To book a service, go to **All Services**, pick your appliance, choose a service, and tap **Book Now**. You can select your preferred date, time slot, and technician. 📅',
  'booking': 'To book a service, go to **All Services**, select your appliance and service, then tap **Book Now** to pick a date, time, and technician.',
  'cost': 'Service prices start from ₹159 for installation and ₹189 for cleaning services. You can see exact pricing on each service card. No hidden charges — pay only after the service is done. 💳',
  'price': 'Prices vary by service — from ₹159 to ₹1,419. Check the service page for exact pricing. Payment is only after the service is completed.',
  'technician': 'All resQ technicians are Reliance-certified, background-verified, and carry genuine spare parts. You can see their rating, job count, and experience before confirming a booking. ⭐',
  'warranty': 'Every service comes with a **30-day service warranty**. If the same issue recurs within 30 days, we fix it for free! 🛡️',
  'cancel': 'You can cancel or reschedule a booking from **My Bookings** in the app. Cancellations are free if done 2+ hours before the scheduled time.',
  'reschedule': 'To reschedule, go to **My Bookings** → find your booking → tap **Reschedule**. You can pick a new date and time slot.',
  'care plan': 'resQ Care Plan is an extended warranty covering all functional parts, electrical & mechanical failures, with an 80% buyback guarantee. Plans start at ₹999/year. Visit the **Care Plan** page for details. 🛡️',
  'amc': 'Our Annual Maintenance Contract (AMC) includes scheduled services + unlimited repairs for a fixed yearly fee. Visit the **Care Plan** page to see plans.',
  'otp': 'During login, enter your mobile number and you will receive an OTP via SMS. Enter the OTP to log in — no password needed! 📱',
  'track': 'Once your booking is confirmed, you can track your technician\'s live location from **My Bookings** → tap your booking → **Track Technician**.',
  'contact': 'You can reach us at:\n📞 1800-889-1977 (Toll free, Mon–Sat 9AM–8PM)\n💬 WhatsApp: +91 98200 00000\n✉️ support@resqservices.in',
  'refund': 'Refunds are processed within 5–7 business days to your original payment method. Raise a request from **My Bookings** or contact support.',
  'spare parts': 'All spare parts used are genuine and sourced directly from manufacturers. Parts come with their own warranty as specified by the brand.',
  'cities': 'resQ operates in 200+ cities across India including Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, and more. 🏙️',
  'hello': 'Hi there! 👋 I\'m the resQ Support Bot. Ask me anything about bookings, services, pricing, technicians, or Care Plans!',
  'hi': 'Hi! 👋 How can I help you today? You can ask about bookings, pricing, warranties, or anything else.',
  'help': 'Sure! I can help with:\n• Booking a service\n• Pricing & charges\n• Technician info\n• Warranty & Care Plan\n• Cancellations & refunds\n• Contact support\n\nWhat would you like to know?',
}

const QUICK_REPLIES = ['How to book?', 'Pricing', 'Technician info', 'Warranty', 'Care Plan', 'Contact support']

function matchResponse(input) {
  const lower = input.toLowerCase()
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (lower.includes(key)) return response
  }
  return "I'm not sure about that — but our support team can help! Call us at **1800-889-1977** (toll free) or email **support@resqservices.in**. 😊"
}

function BotMessage({ text }) {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-sky flex items-center justify-center text-white text-xs font-bold flex-shrink-0">rQ</div>
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[80%] text-sm text-gray-800 leading-relaxed whitespace-pre-line">
        {text.replace(/\*\*(.*?)\*\*/g, '$1')}
      </div>
    </div>
  )
}

function UserMessage({ text }) {
  return (
    <div className="flex justify-end mb-3">
      <div className="bg-sky text-white rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%] text-sm leading-relaxed">{text}</div>
    </div>
  )
}

export default function FaqBot() {
  const [open, setOpen] = useState(false)
  const [isLoginPage, setIsLoginPage] = useState(true)

  useEffect(() => {
    setIsLoginPage(window.location.pathname === '/login')
  }, [])
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hi! 👋 I'm the resQ Support Bot. How can I help you today?" }
  ])
  const [input, setInput] = useState('')
  const [unread, setUnread] = useState(1)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) { setUnread(0); bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }
  }, [open, messages])

  function send(text) {
    if (!text.trim()) return
    const userMsg = { type: 'user', text }
    const botMsg = { type: 'bot', text: matchResponse(text) }
    setMessages(prev => [...prev, userMsg, botMsg])
    setInput('')
  }

  function handleKey(e) { if (e.key === 'Enter') send(input) }

  if (isLoginPage) return null

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-[400] w-14 h-14 bg-sky rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unread}</span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[400] w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{height: '500px'}}>
          {/* Header */}
          <div className="bg-sky px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">rQ</div>
            <div className="flex-1">
              <div className="text-white font-bold text-sm">resQ Support</div>
              <div className="text-white/80 text-xs flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span> Online · Replies instantly</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition ml-auto">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => m.type === 'bot' ? <BotMessage key={i} text={m.text} /> : <UserMessage key={i} text={m.text} />)}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
            {QUICK_REPLIES.map(q => (
              <button key={q} onClick={() => send(q)} className="flex-shrink-0 bg-sky/10 text-sky text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-sky/20 transition whitespace-nowrap">{q}</button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-1 flex gap-2 border-t border-gray-100">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your question…"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sky"
            />
            <button onClick={() => send(input)} className="bg-sky text-white rounded-xl px-3 py-2.5 hover:bg-sky/90 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
