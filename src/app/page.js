import LocationBar from '@/components/LocationBar'
import OfferCarousel from '@/components/OfferCarousel'
import ServiceCard from '@/components/ServiceCard'
import VideoCard from '@/components/VideoCard'
import Link from 'next/link'
import { mainAppliances, maintenanceServices, installationServices, testimonialVideos } from '@/lib/data'

export default function Dashboard() {
  return (
    <div>
      <LocationBar />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">

        {/* Offer Carousel */}
        <OfferCarousel />

        {/* Repair & Service */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Repair &amp; service</h2>
            <Link href="/all-services" className="text-sm text-sky font-semibold">View all</Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {mainAppliances.map((a) => (
              <Link
                key={a.name}
                href="/all-services"
                className="bg-white rounded-card shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col items-center p-3 gap-2"
              >
                <div style={{width:64,height:64,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <img src={a.img} alt={a.name} style={{maxWidth:60,maxHeight:60,objectFit:'contain'}} loading="lazy" />
                </div>
                <span className="text-xs font-semibold text-center text-gray-700 leading-tight">{a.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Maintenance Services */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Maintenance services</h2>
            <Link href="/all-services" className="text-sm text-sky font-semibold">View all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {maintenanceServices.map(s => <ServiceCard key={s.name} service={s} />)}
          </div>
        </section>

        {/* Installation Services */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Installation services</h2>
            <Link href="/all-services" className="text-sm text-sky font-semibold">View all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {installationServices.map(s => <ServiceCard key={s.name} service={s} />)}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">What our customers say</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {testimonialVideos.map((src, i) => (
              <VideoCard key={i} src={src} index={i} />
            ))}
          </div>
        </section>

        {/* resQ care plan CTA */}
        <section className="rounded-2xl overflow-hidden bg-gradient-to-r from-navy to-sky p-8 text-white">
          <h2 className="text-2xl font-extrabold mb-2">resQ Care Plan</h2>
          <p className="text-white/80 text-sm max-w-lg mb-5">
            Extended warranty that goes beyond brand warranty — covering all functional parts, electrical & mechanical failures, with an 80% buyback guarantee.
          </p>
          <Link
            href="/care-plan"
            className="inline-block bg-white text-navy font-bold px-6 py-3 rounded-xl text-sm hover:bg-sky-light transition"
          >
            Explore resQ Care Plan →
          </Link>
        </section>

      </div>
    </div>
  )
}
