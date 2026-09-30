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
    { icon: '📞', label: 'Call us', value: '1800-889-1977', sub: 'Mon–Sat, 9 AM – 8 PM (Toll free)' },
    { icon: '💬', label: 'WhatsApp', value: '+91 98200 00000', sub: 'Chat with us anytime' },
    { icon: '✉️', label: 'Email', value: 'support@resqservices.in', sub: 'Response within 24 hours' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Contact Us</h1>
        <p className="text-gray-500 text-sm mt-1">We're here to help. Reach us through any of the channels below.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: channels + form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {channels.map(c => (
              <div key={c.label} className="bg-white rounded-2xl shadow-card p-5 text-center">
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">{c.label}</div>
                <div className="text-sm font-semibold text-navy">{c.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{c.sub}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-bold text-gray-900 mb-4">Send us a message</h2>
            {sent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">✅</div>
                <div className="font-semibold text-gray-800">Message sent!</div>
                <div className="text-sm text-gray-500 mt-1">We'll get back to you within 24 hours.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Name</label>
                    <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                      placeholder="Your name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Phone</label>
                    <input required value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                      placeholder="+91 XXXXX XXXXX" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Subject</label>
                  <select required value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky">
                    <option value="">Select a topic</option>
                    <option>Booking issue</option>
                    <option>Technician complaint</option>
                    <option>Refund request</option>
                    <option>Care Plan query</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Message</label>
                  <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                    placeholder="Describe your issue or query…"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky resize-none" />
                </div>
                <button type="submit" className="w-full bg-navy text-white font-bold py-4 rounded-xl hover:bg-navy/90 transition">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: map placeholder */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.1!2d73.01!3d19.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzQ4LjAiTiA3M8KwMDAnMzYuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%" height="100%" style={{minHeight: '400px', border: 0}}
            allowFullScreen loading="lazy"
            title="resQ Head Office"
          />
        </div>
      </div>
    </div>
  )
}
