import Link from 'next/link'
import { slugify } from '@/lib/data'

export default function ServiceCard({ service }) {
  return (
    <Link
      href={`/services/${slugify(service.name)}`}
      className="bg-white rounded-card shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 overflow-hidden block"
    >
      <img
        src={service.img}
        alt={service.name}
        style={{width:'100%',height:'150px',objectFit:'cover',display:'block'}}
        loading="lazy"
      />
      <div className="p-3">
        <div className="text-sm font-semibold text-gray-800 leading-snug">{service.name}</div>
        <div className="text-sky font-bold mt-1">{service.price}</div>
      </div>
    </Link>
  )
}
