export const metadata = { title: 'Terms & Conditions – resQ' }

const SECTIONS = [
  { title: '1. Acceptance of Terms', body: 'By accessing or using the resQ platform (website or app), you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please do not use our services.' },
  { title: '2. Services Offered', body: 'resQ provides home appliance repair, installation, and maintenance services through a network of certified technicians. All services are subject to availability in your serviceable area.' },
  { title: '3. Booking & Cancellation', body: 'Bookings can be cancelled or rescheduled up to 2 hours before the scheduled appointment at no charge. Cancellations within 2 hours may attract a convenience fee of ₹49. No-shows are charged in full.' },
  { title: '4. Payments', body: 'Payments are collected after service completion unless otherwise specified. We accept UPI, debit/credit cards, net banking, and cash. All prices are inclusive of applicable GST.' },
  { title: '5. Service Warranty', body: 'All services are covered by a 30-day service warranty. If the same issue recurs within 30 days of service, resQ will re-service at no charge. Warranty does not cover new faults or damage caused by misuse.' },
  { title: '6. Spare Parts', body: 'Spare parts required for repairs are quoted separately before work begins. Only Reliance-approved genuine parts are used. Customers must approve the parts quote before installation.' },
  { title: '7. Liability', body: 'resQ is not liable for pre-existing damage, issues arising from non-genuine parts installed by third parties, or cosmetic damage caused by normal wear and tear. Our maximum liability is limited to the value of the service paid.' },
  { title: '8. Privacy', body: 'Your personal information is collected and used in accordance with our Privacy Policy. We do not sell your data to third parties.' },
  { title: '9. Governing Law', body: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.' },
  { title: '10. Changes to Terms', body: 'resQ reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.' },
]

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Terms & Conditions</h1>
        <p className="text-xs text-gray-400 mt-1">Last updated: 1 September 2026</p>
      </div>
      <div className="bg-navy/5 border border-navy/10 rounded-2xl px-6 py-4 text-sm text-navy font-medium">
        Please read these terms carefully before using resQ services.
      </div>
      <div className="space-y-4">
        {SECTIONS.map(s => (
          <div key={s.title} className="bg-white rounded-2xl shadow-card px-6 py-5">
            <h2 className="font-bold text-gray-900 mb-2 text-sm">{s.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center pb-4">© 2026 Reliance Industries Limited. All rights reserved.</p>
    </div>
  )
}
