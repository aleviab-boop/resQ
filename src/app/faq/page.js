export const metadata = { title: 'FAQs – resQ' }

const FAQS = [
  {
    category: 'Booking & Services',
    items: [
      { q: 'How do I book a service?', a: 'Browse services on the dashboard or All Services page, click on any service, and tap "Add to Cart". After adding all services you need, go to Cart and tap "Proceed to Book" to confirm your appointment.' },
      { q: 'Can I book multiple services at once?', a: 'Yes! You can add multiple services to your cart and book them together. Our technicians will be scheduled based on your availability.' },
      { q: 'How soon can a technician visit?', a: 'We offer same-day and next-day appointments in most serviceable cities. Availability depends on your location and the type of service requested.' },
      { q: 'Can I reschedule or cancel a booking?', a: 'Yes. Go to My Bookings and tap "Reschedule" or "Cancel" on any upcoming booking. Cancellations made 2+ hours before the appointment are free of charge.' },
    ],
  },
  {
    category: 'Technicians',
    items: [
      { q: 'Are your technicians certified?', a: 'All resQ technicians are Reliance-certified, background-verified, and trained on the latest appliance models. They carry official resQ ID cards.' },
      { q: 'Will I be notified when the technician is on the way?', a: 'Yes. You'll receive an SMS and in-app notification when the technician is assigned and again when they are en route to your location.' },
      { q: 'What if I'm not satisfied with the service?', a: 'All our services come with a 30-day service warranty. If the issue persists, contact us within 30 days and we'll re-service at no extra cost.' },
    ],
  },
  {
    category: 'Payments & Pricing',
    items: [
      { q: 'What payment methods are accepted?', a: 'We accept UPI, debit/credit cards, net banking, and cash on service. Payment is collected only after the service is completed to your satisfaction.' },
      { q: 'Are there any hidden charges?', a: 'No hidden charges. The price shown at checkout is final, including all service charges. Spare parts (if any) are quoted separately before work begins.' },
      { q: 'Can I get a GST invoice?', a: 'Yes. A detailed GST invoice is emailed and sent via WhatsApp after every completed service.' },
    ],
  },
  {
    category: 'resQ Care Plan',
    items: [
      { q: 'What is resQ Care Plan?', a: 'resQ Care Plan is an extended warranty that covers functional parts, electrical & mechanical failures beyond the brand warranty period, with an 80% buyback guarantee.' },
      { q: 'Which appliances are covered under the Care Plan?', a: 'We cover ACs, refrigerators, washing machines, TVs, water purifiers, laptops, smartphones, and most major home appliances.' },
      { q: 'Is the Care Plan transferable?', a: 'Yes, the Care Plan is transferable if you sell your appliance within the plan period.' },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Frequently Asked Questions</h1>
        <p className="text-gray-500 text-sm mt-1">Everything you need to know about resQ services.</p>
      </div>

      {FAQS.map(section => (
        <div key={section.category}>
          <h2 className="text-base font-bold text-navy mb-3 border-l-4 border-sky pl-3">{section.category}</h2>
          <div className="space-y-3">
            {section.items.map(item => (
              <details key={item.q} className="bg-white rounded-2xl shadow-card px-6 py-4 group">
                <summary className="font-semibold text-gray-800 text-sm cursor-pointer list-none flex justify-between items-center gap-4">
                  {item.q}
                  <span className="text-sky flex-shrink-0 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
