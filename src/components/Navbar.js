'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const router = useRouter()

  const links = [
    { href: '/all-services', label: 'All services' },
    { href: '/care-plan', label: 'Buy resQ care plan' },
    { href: '/my-devices', label: 'My devices' },
    { href: '/locate', label: 'Locate us' },
  ]

  return (
    <nav className="bg-navy sticky top-0 z-50 shadow-md">
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

        {/* User avatar */}
        {user ? (
          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 text-white"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold hidden sm:block">{user.name}</span>
          </button>
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
