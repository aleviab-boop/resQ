export const metadata = { title: 'Connect with us – resQ' }

const SOCIALS = [
  { icon: '📘', name: 'Facebook', handle: '@RelianceresQ', url: 'https://facebook.com', color: 'bg-blue-600', followers: '2.4M followers' },
  { icon: '📸', name: 'Instagram', handle: '@relianceresq', url: 'https://instagram.com', color: 'bg-pink-500', followers: '1.8M followers' },
  { icon: '🐦', name: 'Twitter / X', handle: '@RelianceresQ', url: 'https://twitter.com', color: 'bg-black', followers: '890K followers' },
  { icon: '▶️', name: 'YouTube', handle: 'Reliance resQ', url: 'https://youtube.com', color: 'bg-red-600', followers: '540K subscribers' },
  { icon: '💼', name: 'LinkedIn', handle: 'Reliance resQ', url: 'https://linkedin.com', color: 'bg-blue-700', followers: '120K followers' },
]

export default function ConnectPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Connect with us</h1>
        <p className="text-gray-500 text-sm mt-1">Follow us on social media for tips, offers, and service updates.</p>
      </div>

      <div className="space-y-4">
        {SOCIALS.map(s => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
            className="bg-white rounded-2xl shadow-card p-5 flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center text-2xl flex-shrink-0`}>
              {s.icon}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{s.name}</div>
              <div className="text-sm text-gray-500">{s.handle}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-500">{s.followers}</div>
              <div className="text-xs text-sky font-semibold mt-0.5">Follow →</div>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-gradient-to-br from-navy to-sky rounded-2xl p-8 text-white text-center">
        <div className="text-3xl mb-3">📣</div>
        <h2 className="font-bold text-lg mb-2">Stay in the loop</h2>
        <p className="text-white/80 text-sm mb-5">Get exclusive offers, maintenance reminders and helpful tips delivered to your inbox.</p>
        <div className="flex gap-2 max-w-sm mx-auto">
          <input type="email" placeholder="your@email.com"
            className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-800 outline-none" />
          <button className="bg-white text-navy font-bold px-5 py-3 rounded-xl text-sm hover:bg-gray-100 transition">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  )
}
