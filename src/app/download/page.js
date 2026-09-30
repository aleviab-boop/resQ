export const metadata = { title: 'Download the App – resQ' }

export default function DownloadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy to-sky rounded-3xl p-10 flex flex-col lg:flex-row items-center gap-8 text-white">
        <div className="flex-1">
          <div className="text-4xl mb-3">📱</div>
          <h1 className="text-3xl font-extrabold mb-3">Get the resQ App</h1>
          <p className="text-white/80 text-sm leading-relaxed mb-6">
            Book services, track your technician in real-time, manage your devices, and access your resQ Care Plan — all from your phone.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#" className="flex items-center gap-3 bg-black text-white rounded-xl px-5 py-3 hover:bg-gray-900 transition">
              <span className="text-2xl">🍎</span>
              <div>
                <div className="text-xs text-white/60">Download on the</div>
                <div className="text-sm font-bold">App Store</div>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 bg-black text-white rounded-xl px-5 py-3 hover:bg-gray-900 transition">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="text-xs text-white/60">Get it on</div>
                <div className="text-sm font-bold">Google Play</div>
              </div>
            </a>
          </div>
        </div>
        <div className="bg-white/10 rounded-2xl p-6 text-center w-48 flex-shrink-0">
          <div className="text-6xl mb-2">📲</div>
          <div className="text-xs text-white/70">Scan QR to download</div>
          <div className="mt-3 grid grid-cols-5 gap-0.5">
            {Array(25).fill(0).map((_, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.4 ? 'bg-white' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-5">Everything in one app</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '🔍', title: 'Browse services', desc: 'Find and book any service in seconds' },
            { icon: '📍', title: 'Live tracking', desc: 'Track your technician in real time' },
            { icon: '📋', title: 'My Bookings', desc: 'View, reschedule or cancel bookings' },
            { icon: '📱', title: 'My Devices', desc: 'Manage all registered appliances' },
            { icon: '🔔', title: 'Notifications', desc: 'Never miss a service reminder' },
            { icon: '🛡️', title: 'Care Plan', desc: 'View and manage your warranty' },
            { icon: '💳', title: 'Easy payment', desc: 'UPI, cards, cash — all accepted' },
            { icon: '⭐', title: 'Rate & review', desc: 'Share feedback after every service' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-2xl shadow-card p-4">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-semibold text-gray-900 text-xs mb-1">{f.title}</div>
              <div className="text-xs text-gray-400 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { store: '🍎 App Store', rating: '4.8', reviews: '28,000+ ratings' },
          { store: '🤖 Google Play', rating: '4.7', reviews: '62,000+ ratings' },
        ].map(r => (
          <div key={r.store} className="bg-white rounded-2xl shadow-card p-6 text-center">
            <div className="text-lg font-semibold text-gray-500 mb-1">{r.store}</div>
            <div className="text-4xl font-extrabold text-navy mb-1">{r.rating}</div>
            <div className="text-yellow-400 text-lg mb-1">★★★★★</div>
            <div className="text-xs text-gray-400">{r.reviews}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
