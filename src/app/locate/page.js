'use client'
import { useState } from 'react'

const WHATSAPP = '918889001700'

const centers = [
  { name: 'resQ Navi Mumbai', addr: 'RCP 5, Thane Belapur Road, TTC Industrial Area, Ghansoli, Navi Mumbai 400701', phone: '18002670999', display: '1800 267 0999', hours: 'Mon–Sat 9AM–7PM', maps: 'https://maps.google.com/?q=RCP+5+Thane+Belapur+Road+TTC+Industrial+Area+Ghansoli+Navi+Mumbai+400701' },
  { name: 'resQ Andheri', addr: 'Times Square, Basement 1, Andheri Kurla Road, Marol, Andheri East, Mumbai 400059', phone: '18002670999', display: '1800 267 0999', hours: 'Mon–Sat 9AM–7PM', maps: 'https://maps.google.com/?q=Times+Square+Andheri+Kurla+Road+Marol+Andheri+East+Mumbai+400059' },
  { name: 'resQ Thane', addr: 'Shop No. 5, Vikas Palms, Dr. Ambedkar Road, Thane West 400601', phone: '18002670999', display: '1800 267 0999', hours: 'Mon–Sat 10AM–8PM', maps: 'https://maps.google.com/?q=Vikas+Palms+Dr+Ambedkar+Road+Thane+West+400601' },
  { name: 'resQ Pune', addr: 'Siddh Samrudhi Building, Near LIG Colony Phase 1, Sector 25, Nigdi, Pimpri Chinchwad, Pune 411044', phone: '18002670999', display: '1800 267 0999', hours: 'Mon–Sat 10AM–8PM', maps: 'https://maps.google.com/?q=Siddh+Samrudhi+Building+Sector+25+Nigdi+Pimpri+Chinchwad+Pune+411044' },
  { name: 'resQ Bangalore', addr: 'Survey No 9/2, 1st Floor, Cornet Greens, Ambillpura, Varthur, HSR Layout, Bangalore 560102', phone: '18002670999', display: '1800 267 0999', hours: 'Mon–Sat 10AM–8PM', maps: 'https://maps.google.com/?q=Cornet+Greens+Ambillpura+Varthur+HSR+Layout+Bangalore+560102' },
  { name: 'resQ Delhi', addr: 'Shop No 224, 2nd Floor, City Centre, Swarn Jayanti Park, Rohini Sector 10, New Delhi 110085', phone: '18002670999', display: '1800 267 0999', hours: 'Mon–Sat 10AM–8PM', maps: 'https://maps.google.com/?q=City+Centre+Swarn+Jayanti+Park+Rohini+Sector+10+New+Delhi+110085' },
]

export default function Locate() {
  const [query, setQuery] = useState('')
  const filtered = centers.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.addr.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Locate a resQ center</h1>
      <p className="text-gray-500 text-sm mb-6">Find the nearest resQ service center to you</p>

      <input
        type="text"
        placeholder="Search by city or area…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full max-w-md border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky mb-8"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {filtered.map(c => (
          <div key={c.name} className="bg-white rounded-card shadow-card p-5 flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-sky-light rounded-full flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="#3DA8DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-900">{c.name}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-snug">{c.addr}</div>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-xs text-gray-600 mb-4 pl-1">
              <div>📞 {c.display}</div>
              <div>🕐 {c.hours}</div>
            </div>

            {/* CTA buttons */}
            <div className="mt-auto grid grid-cols-3 gap-2">
              {/* Call */}
              <a
                href={`tel:${c.phone}`}
                className="flex flex-col items-center gap-1 py-2.5 bg-navy/5 hover:bg-navy/10 rounded-xl transition"
              >
                <svg className="w-4 h-4 text-navy" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                </svg>
                <span className="text-[10px] font-semibold text-navy">Call</span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${WHATSAPP}?text=Hi%20resQ%2C%20I%20need%20help%20with%20my%20appliance%20at%20${encodeURIComponent(c.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 py-2.5 bg-green-50 hover:bg-green-100 rounded-xl transition"
              >
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-[10px] font-semibold text-green-600">WhatsApp</span>
              </a>

              {/* Directions */}
              <a
                href={c.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 py-2.5 bg-sky/5 hover:bg-sky/10 rounded-xl transition"
              >
                <svg className="w-4 h-4 text-sky" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6-3m0 13l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 10m0 3V7"/>
                </svg>
                <span className="text-[10px] font-semibold text-sky">Directions</span>
              </a>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400">
            No centers found for "{query}". Try a different city.
          </div>
        )}
      </div>

      {/* Toll free */}
      <div className="mt-10 bg-gradient-to-r from-navy to-sky rounded-2xl p-6 text-white text-center">
        <div className="text-lg font-bold mb-1">Call us toll-free</div>
        <div className="text-3xl font-extrabold mb-2">1800 267 0999</div>
        <div className="text-white/70 text-sm mb-4">Available 9AM–9PM, Monday to Saturday</div>
        <a
          href={`https://wa.me/${WHATSAPP}?text=Hi%20resQ%2C%20I%20need%20appliance%20service%20support`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition px-6 py-3 rounded-2xl font-bold text-sm"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Chat on WhatsApp
        </a>
      </div>
    </div>
  )
}
