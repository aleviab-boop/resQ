export const metadata = { title: 'Privacy Policy – resQ' }

const SECTIONS = [
  { title: 'Information We Collect', body: 'We collect your name, mobile number, email address, and service address when you register or book a service. We also collect device usage data, location (with permission), and payment transaction details.' },
  { title: 'How We Use Your Information', body: 'Your information is used to: process and fulfil your service bookings; assign and dispatch certified technicians; send booking confirmations, reminders, and service updates; improve our services and personalise your experience; comply with legal obligations.' },
  { title: 'Sharing of Information', body: 'We share your information with: technicians assigned to your booking (name and contact only); payment processors for secure transaction handling; regulatory authorities when required by law. We do not sell your personal data to any third party for marketing purposes.' },
  { title: 'Data Retention', body: 'We retain your account data for as long as your account is active. Booking history is retained for 3 years for warranty and dispute resolution purposes. You may request deletion of your account and associated data at any time.' },
  { title: 'Cookies', body: 'Our website uses cookies to improve your browsing experience, remember your preferences, and analyse traffic. You can control cookie settings through your browser. See our Cookie Policy for more details.' },
  { title: 'Security', body: 'We use industry-standard encryption (SSL/TLS) for all data transmissions. Payment details are handled by PCI-DSS compliant processors and are never stored on resQ servers.' },
  { title: 'Your Rights', body: 'You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@resqservices.in or through the Contact Us page.' },
  { title: 'Changes to this Policy', body: 'We may update this Privacy Policy from time to time. Material changes will be communicated via email or in-app notification. Continued use of resQ after changes constitutes acceptance.' },
]

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Privacy Policy</h1>
        <p className="text-xs text-gray-400 mt-1">Last updated: 1 September 2026</p>
      </div>
      <div className="bg-sky/10 border border-sky/20 rounded-2xl px-6 py-4 text-sm text-sky font-medium">
        resQ is committed to protecting your privacy and handling your data responsibly.
      </div>
      <div className="space-y-4">
        {SECTIONS.map(s => (
          <div key={s.title} className="bg-white rounded-2xl shadow-card px-6 py-5">
            <h2 className="font-bold text-gray-900 mb-2 text-sm">{s.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center pb-4">Questions? Email privacy@resqservices.in</p>
    </div>
  )
}
