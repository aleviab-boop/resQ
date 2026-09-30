export const metadata = { title: 'Tips & Articles – resQ' }

const ARTICLES = [
  { icon: '❄️', tag: 'Air Conditioner', title: 'How often should you service your AC?', read: '3 min read', desc: 'Most ACs need servicing every 3–6 months. Skipping maintenance reduces efficiency by up to 25% and increases your electricity bill.' },
  { icon: '🫧', tag: 'Washing Machine', title: '5 signs your washing machine needs attention', read: '4 min read', desc: 'Unusual noises, bad odours, water leaks, or clothes coming out still dirty — these are early signs of a developing issue.' },
  { icon: '🧊', tag: 'Refrigerator', title: 'Why is your fridge not cooling properly?', read: '5 min read', desc: 'Dirty condenser coils, a faulty thermostat, or a worn door seal are the most common causes of refrigerator cooling issues.' },
  { icon: '📺', tag: 'LED TV', title: 'How to extend the life of your LED TV', read: '3 min read', desc: 'Keep brightness at 50–60%, clean the screen with a microfibre cloth, and ensure proper ventilation behind the unit.' },
  { icon: '💧', tag: 'Water Purifier', title: 'When to replace your RO membrane', read: '4 min read', desc: "Most RO membranes last 2–3 years. If your TDS level spikes or water flow slows down, it's time for a replacement." },
  { icon: '🌬️', tag: 'Air Cooler', title: 'Maintaining your air cooler for the summer season', read: '3 min read', desc: 'Before summer begins, clean the cooling pads, flush the water tank, and check the pump to ensure peak performance.' },
]

const VIDEOS = [
  { thumb: 'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/backend/compressed/splite_ac_Split_AC_Jet_Service.webp', title: 'How to clean AC filters at home', duration: '2:45' },
  { thumb: 'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/backend/compressed/front_Load_Washing_Machine_washing_machine_front_load_filter_clean.webp', title: 'Front load WM drum cleaning guide', duration: '3:12' },
  { thumb: 'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/backend/compressed/Water_Purifier_Water_Purifier_Installation.webp', title: 'DIY water purifier filter check', duration: '4:00' },
]

export default function ArticlesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Tips, Videos & Articles</h1>
        <p className="text-gray-500 text-sm mt-1">Expert advice to help you get the most from your appliances.</p>
      </div>

      {/* Videos */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">How-to Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {VIDEOS.map(v => (
            <div key={v.title} className="bg-white rounded-2xl shadow-card overflow-hidden group cursor-pointer">
              <div className="relative">
                <img src={v.thumb} alt={v.title} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <span className="text-navy text-lg ml-1">▶</span>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">{v.duration}</div>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-gray-800 leading-snug">{v.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ARTICLES.map(a => (
            <div key={a.title} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <div className="text-3xl mb-3">{a.icon}</div>
              <div className="text-xs font-semibold text-sky mb-1">{a.tag} · {a.read}</div>
              <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug">{a.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
