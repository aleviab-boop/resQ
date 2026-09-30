import Link from 'next/link'

export const metadata = { title: 'resQ Care Plan – resQ' }

const features = [
  { icon: '🛡️', title: 'Comprehensive Coverage', desc: 'Covers all functional parts, electrical and mechanical failures — beyond brand warranty.' },
  { icon: '🕐', title: '365 Days Available', desc: 'Our expert technicians are available every day of the year for quick service.' },
  { icon: '🚚', title: 'Free Pickup & Drop', desc: 'We collect your device for repair and return it — completely free of charge.' },
  { icon: '💰', title: '80% Buyback', desc: 'In case of irreparable damage, get 80% of original value back.' },
  { icon: '🔧', title: 'Genuine Parts', desc: 'Only OEM-certified parts used in all repairs and replacements.' },
  { icon: '⭐', title: 'Certified Technicians', desc: 'All our technicians are certified and background-verified.' },
]

const plans = [
  { appliance: 'Air Conditioner', price: '₹2,999/yr', coverage: '1–5 Ton Split & Window AC' },
  { appliance: 'Refrigerator', price: '₹1,999/yr', coverage: 'Single & Double Door' },
  { appliance: 'Washing Machine', price: '₹1,799/yr', coverage: 'Front & Top Load' },
  { appliance: 'LED TV', price: '₹1,499/yr', coverage: '24–75 inch' },
  { appliance: 'Laptop', price: '₹2,499/yr', coverage: 'Any brand' },
  { appliance: 'Water Purifier', price: '₹999/yr', coverage: 'RO & UV purifiers' },
]

export default function CarePlan() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy via-[#1a4080] to-sky py-16 px-4 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">resQ Care Plan (RCP)</h1>
          <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
            Our unique Extended Warranty program goes one step further than brand warranty to ensure a hassle-free experience for years to come. resQ Care Plan covers the servicing and replacement of all functional parts, most electrical and mechanical failures and even offers an 80% buyback policy in case of irreparable damage.
          </p>
          <p className="text-white/70 text-sm mb-8">
            Presently, we offer our Extended Warranty – resQ Care Plan (RCP) for purchases made from Reliance Digital Stores or www.reliancedigital.in, as also from JioMart.com.
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-navy font-bold px-8 py-4 rounded-xl text-base hover:bg-sky-light transition"
          >
            To check eligibility — Login
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">

        {/* Features */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Why choose resQ Care Plan?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-card shadow-card p-6">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Plans */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Available plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map(p => (
              <div key={p.appliance} className="bg-white rounded-card shadow-card border border-gray-100 p-5 flex flex-col gap-3">
                <div className="font-bold text-gray-900">{p.appliance}</div>
                <div className="text-xs text-gray-500">{p.coverage}</div>
                <div className="text-sky font-extrabold text-xl">{p.price}</div>
                <Link
                  href="/login"
                  className="mt-auto block text-center bg-navy text-white rounded-xl py-3 text-sm font-bold hover:bg-navy-dark transition"
                >
                  Buy now
                </Link>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
