'use client'

const SPECIALIZATIONS = {
  'Rahul Sharma':  ['Split AC', 'Window AC', 'Cassette AC'],
  'Arjun Mehta':  ['Refrigerator', 'AC', 'Washing Machine'],
  'Vikram Patel': ['LED TV', 'Home Theatre', 'Set-top Box'],
  'Suresh Kumar': ['Washing Machine', 'Dishwasher', 'Dryer'],
}

const BADGES = {
  'Rahul Sharma':  { label: 'Top Rated', color: 'bg-amber-100 text-amber-700' },
  'Arjun Mehta':  { label: 'Expert',     color: 'bg-purple-100 text-purple-700' },
  'Vikram Patel': { label: 'Verified',   color: 'bg-blue-100 text-blue-700' },
  'Suresh Kumar': { label: 'Pro',        color: 'bg-green-100 text-green-700' },
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )
}

function techInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const REVIEW_SAMPLES = [
  { name: 'Priya M.', stars: 5, text: 'Very professional and on time. Did a thorough job!' },
  { name: 'Rohit K.', stars: 5, text: 'Explained everything clearly. Great service.' },
  { name: 'Sneha D.', stars: 4, text: 'Quick and efficient. Would book again.' },
]

export default function TechProfileModal({ tech, onClose }) {
  const specs = SPECIALIZATIONS[tech.name] || ['Appliance Repair', 'Maintenance', 'Installation']
  const badge = BADGES[tech.name] || { label: 'Verified', color: 'bg-blue-100 text-blue-700' }
  const yearsExp = Math.floor(tech.jobs / 120) + 2

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-br from-navy to-sky px-6 py-8 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center text-white text-2xl font-extrabold mx-auto mb-3">
            {techInitials(tech.name)}
          </div>
          <h2 className="text-white font-extrabold text-xl">{tech.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>
            <span className="text-white/70 text-xs">resQ Certified Technician</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
          {[
            { val: tech.rating, label: 'Rating' },
            { val: `${tech.jobs}+`, label: 'Jobs done' },
            { val: `${yearsExp} yrs`, label: 'Experience' },
          ].map(({ val, label }) => (
            <div key={label} className="py-4 text-center">
              <div className="text-lg font-extrabold text-gray-900">{val}</div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Rating row */}
          <div>
            <div className="text-sm font-bold text-gray-700 mb-2">Customer rating</div>
            <div className="flex items-center gap-3">
              <Stars rating={tech.rating} />
              <span className="text-gray-700 font-bold">{tech.rating}</span>
              <span className="text-gray-400 text-sm">({tech.jobs} reviews)</span>
            </div>
          </div>

          {/* Specializations */}
          <div>
            <div className="text-sm font-bold text-gray-700 mb-2">Specializes in</div>
            <div className="flex flex-wrap gap-2">
              {specs.map(s => (
                <span key={s} className="bg-sky/10 text-sky text-xs font-semibold px-3 py-1.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>

          {/* Verified info */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
            {[
              { icon: '✅', text: 'Background verified by Reliance resQ' },
              { icon: '🎓', text: `Certified technician — ${yearsExp} years on platform` },
              { icon: '🛡️', text: '30-day service warranty on all jobs' },
              { icon: '📍', text: 'Serves Mumbai & surrounding areas' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm text-gray-600">
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>

          {/* Recent reviews */}
          <div>
            <div className="text-sm font-bold text-gray-700 mb-3">Recent reviews</div>
            <div className="space-y-3">
              {REVIEW_SAMPLES.map((r, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-800">{r.name}</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} className={`w-3 h-3 ${s <= r.stars ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a href={`tel:${tech.phone}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-navy text-white font-bold rounded-2xl hover:bg-navy/90 transition">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            Call {tech.name.split(' ')[0]}
          </a>
        </div>
      </div>
    </div>
  )
}
