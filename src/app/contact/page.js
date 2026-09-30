'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' })

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  const channels = [
    { icon: '📞', label: 'Call us', value: '1800-889-1977', sub: 'Mon–Sat, 9 AM – 8 PM · Toll free' },
    { icon: '💬', label: 'WhatsApp', value: '+91 98200 00000', sub: 'Chat with us anytime' },
    { icon: '✉️', label: 'Email', value: 'support@resqservices.in', sub: 'Response within 24 hours' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Contact Us</h1>
        <p className="text-gray-500 text-sm mt-1">We're here to help. Reach us through any of the channels below.</p>
      </div>

      {/* Channel cards — full width row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {channels.map(c => (
          <div key={c.label} className="bg-white rounded-2xl shadow-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky/10 flex items-center justify-center text-2xl flex-shrink-0">
              {c.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">{c.label}</div>
              <div className="text-sm font-bold text-navy leading-tight">{c.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{c.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Form + Map side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-bold text-gray-900 mb-5">Send us a message</h2>
          {sent ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">✅</div>
              <div className="font-semibold text-gray-800 text-lg">Message sent!</div>
              <div className="text-sm text-gray-500 mt-1">We'll get back to you within 24 hours.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Name</label>
                  <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    placeholder="Your name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Phone</label>
                  <input required value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky transition" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Subject</label>
                <select required value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky transition">
                  <option value="">Select a topic</option>
                  <option>Booking issue</option>
                  <option>Technician complaint</option>
                  <option>Refund request</option>
                  <option>Care Plan query</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Message</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                  placeholder="Describe your issue or query…"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky transition resize-none" />
              </div>
              <button type="submit"
                className="w-full bg-navy text-white font-bold py-4 rounded-xl hover:bg-navy/90 transition text-sm">
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden" style={{minHeight: '460px'}}>
          <div className="bg-navy/5 px-5 py-3 border-b border-gray-100">
            <div className="font-semibold text-gray-800 text-sm">Head Office</div>
            <div className="text-xs text-gray-400">Reliance Corporate Park, Navi Mumbai, Maharashtra 400701</div>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.1!2d73.01!3d19.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzQ4LjAiTiA3M8KwMDAnMzYuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%" height="100%" style={{border: 0, minHeight: '400px'}}
            allowFullScreen loading="lazy"
            title="resQ Head Office"
          />
        </div>

      </div>
    </div>
  )
}
