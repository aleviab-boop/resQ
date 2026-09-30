import Link from 'next/link'

export default function Footer() {
  const cols = [
    {
      title: 'Support',
      links: [
        { label: 'FAQs', href: '/faq' },
        { label: 'Useful videos and articles', href: '/articles' },
        { label: 'Nearest service center', href: '/locate' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'Our Company',
      links: [
        { label: 'About resQ', href: '/about' },
        { label: 'Connect with us', href: '/connect' },
        { label: 'Download the App', href: '/download' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms & Conditions', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ]

  return (
    <footer className="bg-navy mt-16 text-white/80">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="text-white font-extrabold text-xl mb-3">Reliance resQ</div>
          <p className="text-sm leading-relaxed">
            Your trusted expert for complete electronics care. Expert technicians across all product categories, available 365 days.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wide">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Reliance Industries Limited. All rights reserved.
      </div>
    </footer>
  )
}
