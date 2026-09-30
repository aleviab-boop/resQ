import Link from 'next/link'
import { getServiceBySlug, allServices, slugify } from '@/lib/data'
import BookButton from './BookButton'

export async function generateStaticParams() {
  return allServices.map(s => ({ slug: slugify(s.name) }))
}

export async function generateMetadata({ params }) {
  const svc = getServiceBySlug(params.slug)
  return { title: svc ? `${svc.name} – resQ` : 'Service – resQ' }
}

export default function ServiceDetail({ params }) {
  const svc = getServiceBySlug(params.slug)

  if (!svc) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-700">Service not found</h2>
        <Link href="/all-services" className="text-sky mt-4 inline-block">← Back to all services</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link href="/all-services" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy mb-6 transition">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to services
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Main */}
        <div className="flex-1 space-y-5">
          <div className="relative rounded-2xl overflow-hidden shadow-card">
            <img src={svc.img} alt={svc.name} className="w-full h-80 object-cover" />
            <button className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-110 transition">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
            <h1 className="text-2xl font-extrabold text-gray-900">{svc.name}</h1>
            <p className="text-gray-600 leading-relaxed">{svc.desc}</p>
            {svc.badge && (
              <div className="inline-flex items-center gap-2 bg-green-light text-green-resq text-sm font-semibold px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-resq"/>
                {svc.badge}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 space-y-4 lg:sticky lg:top-24 self-start">
          <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Service charges</div>
            <div className="text-4xl font-extrabold text-gray-900">{svc.price}</div>
            <BookButton serviceName={svc.name} />
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
            <h4 className="font-bold text-gray-900 mb-4">What's included</h4>
            <ul className="space-y-2.5">
              {svc.includes.map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-green-resq font-bold flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Trust badges */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 grid grid-cols-3 gap-3 text-center">
            {[['🔧','Certified technicians'],['⚡','Same-day availability'],['🛡️','Service warranty']].map(([icon,label]) => (
              <div key={label}>
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs text-gray-500 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
