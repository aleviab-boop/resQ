import ServiceCard from '@/components/ServiceCard'
import { allAppliances, maintenanceServices, installationServices } from '@/lib/data'

export const metadata = { title: 'All Services – resQ' }

export default function AllServices() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

      {/* All appliances grid */}
      <section>
        <h1 className="text-xl font-bold text-gray-900 mb-6">All appliances</h1>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {allAppliances.map((a) => (
            <div
              key={a.name}
              className="bg-white rounded-card shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col items-center p-3 gap-2 cursor-pointer"
            >
              <div style={{width:64,height:64,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <img src={a.img} alt={a.name} style={{maxWidth:60,maxHeight:60,objectFit:'contain'}} loading="lazy" />
              </div>
              <span className="text-xs font-semibold text-center text-gray-700 leading-tight">{a.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Maintenance */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Maintenance services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {maintenanceServices.map(s => <ServiceCard key={s.name} service={s} />)}
        </div>
      </section>

      {/* Installation */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Installation services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {installationServices.map(s => <ServiceCard key={s.name} service={s} />)}
        </div>
      </section>

    </div>
  )
}
