export const metadata = { title: 'About resQ – Reliance' }

const STATS = [
  { value: '50,000+', label: 'Certified technicians' },
  { value: '200+', label: 'Cities served' },
  { value: '10M+', label: 'Services completed' },
  { value: '365', label: 'Days a year' },
]

const TEAM = [
  { name: 'Mukesh D. Ambani', role: 'Chairman, Reliance Industries', init: 'MA' },
  { name: 'Isha Ambani', role: 'Director, Reliance Retail', init: 'IA' },
  { name: 'Akash Ambani', role: 'Chairman, Reliance Jio', init: 'AA' },
]

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy to-sky rounded-3xl p-10 text-white text-center">
        <h1 className="text-3xl font-extrabold mb-3">About Reliance resQ</h1>
        <p className="text-white/80 max-w-xl mx-auto text-sm leading-relaxed">
          resQ is Reliance's expert home appliance care service — bringing certified technicians to your doorstep for repairs, installations, and maintenance across all major appliance categories.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-card p-5 text-center">
            <div className="text-2xl font-extrabold text-navy">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-7">
          <div className="text-3xl mb-3">🎯</div>
          <h2 className="font-bold text-gray-900 text-lg mb-2">Our Mission</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            To make expert appliance care accessible, affordable, and hassle-free for every Indian household — backed by Reliance's nationwide network and commitment to quality.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-7">
          <div className="text-3xl mb-3">👁️</div>
          <h2 className="font-bold text-gray-900 text-lg mb-2">Our Vision</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            To be India's most trusted after-sales service brand — extending the life of every appliance and reducing electronic waste through preventive maintenance and genuine care.
          </p>
        </div>
      </div>

      {/* Why resQ */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-5">Why choose resQ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🔧', title: 'Certified Technicians', desc: 'Every technician is Reliance-trained, background-verified, and equipped with genuine spare parts.' },
            { icon: '⚡', title: 'Same-day Service', desc: 'We offer same-day and next-day slots in 200+ cities across India, 365 days a year.' },
            { icon: '🛡️', title: '30-day Warranty', desc: 'Every service comes with a 30-day service warranty. If the issue recurs, we fix it for free.' },
            { icon: '💳', title: 'Pay After Service', desc: 'No upfront payment required. Pay only after the service is completed to your satisfaction.' },
            { icon: '📱', title: 'Real-time Tracking', desc: "Track your technician's arrival in real-time via the app and receive live status updates." },
            { icon: '🏆', title: 'Reliance Backed', desc: 'Trusted by 10 million+ customers, backed by the reliability and scale of Reliance Industries.' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl shadow-card p-5">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-semibold text-gray-900 text-sm mb-1">{item.title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-5">Leadership</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TEAM.map(p => (
            <div key={p.name} className="bg-white rounded-2xl shadow-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{p.init}</div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{p.name}</div>
                <div className="text-xs text-gray-400">{p.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
