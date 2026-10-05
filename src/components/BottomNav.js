'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useState, useEffect } from 'react'

const NAV_PATHS = [
  {
    key: 'home',
    path: '/',
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? 'text-sky' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/>
      </svg>
    ),
  },
  {
    key: 'services',
    path: '/all-services',
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? 'text-sky' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    ),
  },
  {
    key: 'bookings',
    path: '/my-bookings',
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? 'text-sky' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    ),
  },
  {
    key: 'profile',
    path: '/profile',
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? 'text-sky' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
    ),
  },
]

const BOTTOM_LABELS = {
  en: { home: 'Home', services: 'Services', bookings: 'Bookings', profile: 'Profile' },
  hi: { home: 'होम', services: 'सेवाएं', bookings: 'बुकिंग', profile: 'प्रोफ़ाइल' },
}

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const { lang } = useTheme()
  const [isLoginPage, setIsLoginPage] = useState(true)

  useEffect(() => {
    setIsLoginPage(window.location.pathname === '/login')
  }, [pathname])

  if (!user || isLoginPage) return null

  const L = BOTTOM_LABELS[lang] || BOTTOM_LABELS.en

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[200] bg-white border-t border-gray-200 shadow-lg safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 pt-2 pb-3">
        {NAV_PATHS.map(item => {
          const active = pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all"
            >
              {item.icon(active)}
              <span className={`text-[10px] font-semibold ${active ? 'text-sky' : 'text-gray-400'}`}>
                {L[item.key]}
              </span>
              {active && (
                <div className="w-1 h-1 bg-sky rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
