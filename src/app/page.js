'use client'
import LocationBar from '@/components/LocationBar'
import OfferCarousel from '@/components/OfferCarousel'
import SearchBar from '@/components/SearchBar'
import ServiceCard from '@/components/ServiceCard'
import VideoCard from '@/components/VideoCard'
import BundleDeals from '@/components/BundleDeals'
import DashboardWidgets from '@/components/DashboardWidgets'
import FlashSaleBanner from '@/components/FlashSaleBanner'
import Link from 'next/link'
import { mainAppliances, maintenanceServices, installationServices, testimonialVideos } from '@/lib/data'
import { useTheme } from '@/context/ThemeContext'

export default function Dashboard() {
  const { t } = useTheme()
  return (
    <div>
      <LocationBar />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">

        {/* Search bar */}
        <SearchBar />

        {/* Greeting */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {t.hello}<br />{t.welcome}
          </h1>
          <p className="text-gray-500 text-sm mt-2">{t.tagline}</p>
        </div>

        {/* Dashboard Widgets — active booking + warranty nudge */}
        <DashboardWidgets />

        {/* Offer Carousel */}
        {/* Flash sale countdown */}
        <FlashSaleBanner />

        <OfferCarousel />

        {/* Repair & Service */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Repair &amp; service</h2>
            <Link href="/all-services" className="text-sm text-sky font-semibold">{t.viewAll}</Link>
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

        {/* Bundle Deals */}
        <BundleDeals />

        {/* Quick links — new pages */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/amc', icon: '📅', label: 'AMC Plans', sub: 'Annual service contracts' },
            { href: '/repair-vs-new', icon: '⚖️', label: 'Repair or Buy New?', sub: 'Get instant advice' },
            { href: '/claim', icon: '📋', label: 'File a Claim', sub: 'Under warranty / care plan' },
            { href: '/referral', icon: '🎁', label: 'Refer & Earn', sub: 'Get ₹100 per referral' },
          ].map(item => (
            <Link key={item.href} href={item.href} className="bg-white rounded-2xl shadow-card p-4 hover:shadow-lg transition flex flex-col gap-1.5">
              <div className="text-2xl">{item.icon}</div>
              <div className="text-sm font-bold text-gray-800 leading-tight">{item.label}</div>
              <div className="text-xs text-gray-400">{item.sub}</div>
            </Link>
          ))}
        </section>

        {/* Maintenance Services */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">{t.topMaintenance}</h2>
            <Link href="/all-services" className="text-sm text-sky font-semibold">{t.viewAll}</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {maintenanceServices.map(s => <ServiceCard key={s.name} service={s} />)}
          </div>
        </section>

        {/* Get resQ Care banner */}
        <Link href="/care-plan" className="block rounded-2xl overflow-hidden bg-sky p-6 sm:p-8 hover:opacity-95 transition">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="sm:w-56 flex-shrink-0">
              <h2 className="text-2xl font-extrabold text-white mb-1">Get resQ care</h2>
              <p className="text-white/80 text-sm leading-snug">Ensure peace of mind by saving expenses on future services and repair.</p>
            </div>
            <div className="flex flex-1 flex-wrap gap-4 sm:justify-around">
              {[
                { icon: <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>, label: 'Routine maintenance' },
                { icon: <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, label: '365 days available' },
                { icon: <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>, label: 'Free pickup & drop' },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">{f.icon}</div>
                  <span className="text-white font-semibold text-sm leading-tight">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Link>

        {/* Installation Services */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">{t.topInstallation}</h2>
            <Link href="/all-services" className="text-sm text-sky font-semibold">{t.viewAll}</Link>
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
