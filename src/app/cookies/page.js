export const metadata = { title: 'Cookie Policy – resQ' }

const TYPES = [
  { name: 'Essential Cookies', required: true, desc: 'These cookies are necessary for the website to function. They enable core features such as authentication, cart management, and security. They cannot be disabled.' },
  { name: 'Performance Cookies', required: false, desc: 'These cookies help us understand how visitors interact with our website — which pages are most visited, where errors occur, and how to improve load times. Data is aggregated and anonymous.' },
  { name: 'Functional Cookies', required: false, desc: 'These cookies remember your preferences such as your selected city, language, and previously viewed services to personalise your experience.' },
  { name: 'Analytics Cookies', required: false, desc: 'Used by tools like Google Analytics to collect data about website usage. This helps us improve our services. All data is anonymised before processing.' },
  { name: 'Marketing Cookies', required: false, desc: 'These cookies are used to display relevant offers and promotions. We do not use third-party advertising networks. Marketing cookies are only used to personalise resQ offers within our own platform.' },
]

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Cookie Policy</h1>
        <p className="text-xs text-gray-400 mt-1">Last updated: 1 September 2026</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card px-6 py-5">
        <p className="text-sm text-gray-500 leading-relaxed">
          Cookies are small text files stored on your device when you visit our website. resQ uses cookies to keep you logged in, remember your preferences, and understand how you use our services so we can improve them.
        </p>
      </div>

      <div className="space-y-4">
        {TYPES.map(t => (
          <div key={t.name} className="bg-white rounded-2xl shadow-card px-6 py-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-gray-900 text-sm">{t.name}</h2>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${t.required ? 'bg-navy text-white' : 'bg-gray-100 text-gray-500'}`}>
                {t.required ? 'Always on' : 'Optional'}
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card px-6 py-5">
        <h2 className="font-bold text-gray-900 text-sm mb-2">Managing Cookies</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          You can control or delete cookies through your browser settings. Note that disabling certain cookies may affect site functionality. To opt out of analytics, visit your browser's privacy settings or use browser extensions like uBlock Origin.
        </p>
      </div>

      <p className="text-xs text-gray-400 text-center pb-4">Questions? Email privacy@resqservices.in</p>
    </div>
  )
}
