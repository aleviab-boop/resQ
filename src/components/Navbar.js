'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout, cart } = useAuth()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropRef = useRef(null)

  if (pathname === '/login') return null

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const links = [
    { href: '/all-services', label: 'All services' },
    { href: '/care-plan', label: 'Buy resQ care plan' },
    { href: '/my-devices', label: 'My devices' },
    { href: '/locate', label: 'Locate us' },
  ]

  function handleLogout() {
    logout()
    setDropdownOpen(false)
    router.push('/')
  }

  return (
    <nav className="bg-sky sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="https://www.resqservices.in/_next/static/media/resQlogo.4b286cb0.svg"
            alt="resQ"
            width={90}
            height={36}
            className="brightness-0 invert"
            unoptimized
          />
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium text-white/80 hover:text-white pb-1 border-b-2 transition-colors ${
                pathname === href ? 'border-white/80 text-white' : 'border-transparent'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              {/* Notifications */}
              <Link href="/Notifications" className="relative text-white hover:text-white/80 transition">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </Link>

              {/* Cart */}
              <Link href="/CartDetails" className="relative text-white hover:text-white/80 transition">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.9 18 9 18h12v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023.5 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2z"/>
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* User avatar / login */}
          {user ? (
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropdownOpen(v => !v)}
                className="flex items-center gap-2 text-white"
              >
                <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold hidden sm:block">{user.name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-2xl w-48 py-2 z-50 text-sm overflow-hidden">
                  <Link href="/profile" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-800 font-medium">
                    <span>👤</span> My Profile
                  </Link>
                  <Link href="/my-bookings" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-800 font-medium">
                    <span>📋</span> My Bookings
                  </Link>
                  <Link href="/Notifications" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-800 font-medium">
                    <span>🔔</span> Notifications
                  </Link>
                  <Link href="/CartDetails" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-800 font-medium">
                    <span>🛒</span> Cart {cart.length > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{cart.length}</span>}
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 font-medium">
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="text-white hover:text-white/80 transition"
              aria-label="Login"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex gap-4 px-4 pb-2 overflow-x-auto">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-xs font-medium whitespace-nowrap text-white/80 hover:text-white pb-1 border-b-2 transition-colors flex-shrink-0 ${
              pathname === href ? 'border-white/80 text-white' : 'border-transparent'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
