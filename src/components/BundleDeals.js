'use client'
import Link from 'next/link'

const BUNDLES = [
  {
    id: 'ac-geyser',
    title: 'AC + Geyser Service',
    desc: 'Get both serviced in one visit. Save ₹300.',
    originalPrice: 1099,
    bundlePrice: 799,
    icons: ['❄️', '🚿'],
    tag: 'Best Value',
    tagColor: 'bg-green-500',
    href: '/all-services',
  },
  {
    id: 'ac-purifier',
    title: 'AC + Water Purifier',
    desc: 'Combo maintenance for home essentials.',
    originalPrice: 908,
    bundlePrice: 699,
    icons: ['❄️', '💧'],
    tag: 'Popular',
    tagColor: 'bg-sky',
    href: '/all-services',
  },
  {
    id: 'triple',
    title: 'Triple Appliance Service',
    desc: 'Service any 3 appliances in one booking.',
    originalPrice: 1500,
    bundlePrice: 999,
    icons: ['❄️', '🫧', '📺'],
    tag: 'Save ₹501',
    tagColor: 'bg-amber-500',
    href: '/all-services',
  },
]

export default function BundleDeals() {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base font-extrabold text-gray-900">Bundle Deals 🎁</h2>
        <Link href="/all-services" className="text-xs text-sky font-semibold">See all</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {BUNDLES.map(b => (
          <Link key={b.id} href={b.href}
            className="flex-shrink-0 w-60 bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-lg transition">
            <div className="bg-gradient-to-br from-navy/5 to-sky/10 px-4 pt-4 pb-2">
              <div className="flex items-center gap-1 mb-2">
                {b.icons.map((icon, i) => (
                  <span key={i} className="text-2xl">{icon}</span>
                ))}
                <span className={`ml-auto text-white text-xs font-bold px-2 py-0.5 rounded-full ${b.tagColor}`}>{b.tag}</span>
              </div>
              <div className="font-extrabold text-gray-900 text-sm">{b.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{b.desc}</div>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400 line-through">₹{b.originalPrice}</div>
                <div className="text-lg font-extrabold text-navy">₹{b.bundlePrice}</div>
              </div>
              <div className="bg-sky/10 text-sky text-xs font-bold px-3 py-1.5 rounded-xl">
                Save ₹{b.originalPrice - b.bundlePrice}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
