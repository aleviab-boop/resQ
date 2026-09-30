export default function Footer() {
  const cols = [
    {
      title: 'Support',
      links: ['FAQs', 'Useful videos and articles', 'Nearest service center', 'Contact Us'],
    },
    {
      title: 'Our Company',
      links: ['About resQ', 'Connect with us', 'Download the App'],
    },
    {
      title: 'Legal',
      links: ['Terms & Conditions', 'Privacy Policy', 'Cookie Policy'],
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
                <li key={link}>
                  <button className="text-sm hover:text-white transition-colors text-left">{link}</button>
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
