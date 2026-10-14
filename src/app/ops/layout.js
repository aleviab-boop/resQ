'use client'

import { useState, useEffect } from 'react'

const CREDS = { email: 'ops@gmail.com', password: 'ops' }
const SESSION_KEY = 'resq_ops_auth'

function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPw, setShowPw]     = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      if (email === CREDS.email && password === CREDS.password) {
        localStorage.setItem(SESSION_KEY, '1')
        onLogin()
      } else {
        setError('Invalid email or password.')
        setLoading(false)
      }
    }, 700)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#f5f7fa' }}>

      {/* Left panel — brand */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-12"
        style={{ background: 'linear-gradient(160deg, #0d2560 0%, #13347b 55%, #0a7abf 100%)' }}
      >
        {/* Top: logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl">🔧</div>
          <div>
            <p className="text-white font-extrabold text-lg leading-tight tracking-tight">resQ</p>
            <p className="text-blue-300 text-xs font-medium">by Reliance</p>
          </div>
        </div>

        {/* Middle: headline */}
        <div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Enterprise<br />Service Ops
          </h1>
          <p className="text-blue-200 text-sm leading-relaxed mb-8">
            One platform for field dispatch, case management, brand P&amp;L, and AI-powered service intelligence.
          </p>

          {/* Feature list */}
          {[
            { icon: '📋', label: 'Case & ticket management' },
            { icon: '📍', label: 'Technician dispatch & tracking' },
            { icon: '🏭', label: 'Brand P&L and renegotiation' },
            { icon: '🤖', label: 'AI ops & anomaly detection' },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-3 mb-3">
              <span className="text-lg leading-none w-8 text-center">{f.icon}</span>
              <span className="text-blue-100 text-sm font-medium">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom: footer */}
        <p className="text-blue-400 text-xs">
          Restricted access — authorised personnel only
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#13347b' }}>🔧</div>
            <div>
              <p className="font-extrabold text-lg text-gray-900 leading-tight">resQ Ops Centre</p>
              <p className="text-xs text-gray-500">by Reliance</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to access the Ops Centre</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email address</label>
              <input
                type="email"
                autoComplete="username"
                required
                placeholder="ops@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#00a1e1] focus:ring-2 focus:ring-[#00a1e1]/20 transition-all bg-white shadow-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-14 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#00a1e1] focus:ring-2 focus:ring-[#00a1e1]/20 transition-all bg-white shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-red-600 text-xs font-bold">!</span>
                </div>
                <p className="text-xs text-red-700 font-semibold">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm hover:shadow-md disabled:opacity-70 mt-1"
              style={{
                background: loading
                  ? '#94a3b8'
                  : 'linear-gradient(135deg, #13347b 0%, #00a1e1 100%)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">restricted access</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* System info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-700">All systems operational</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Case engine · Dispatch · AI Insights · Parts</p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            resQ Enterprise Ops · © 2026 Reliance Industries
          </p>
        </div>
      </div>
    </div>
  )
}

export default function OpsLayout({ children }) {
  const [authed, setAuthed] = useState(null)

  useEffect(() => {
    setAuthed(localStorage.getItem(SESSION_KEY) === '1')
  }, [])

  if (authed === null) return null

  if (!authed) {
    return <LoginPage onLogin={() => setAuthed(true)} />
  }

  return (
    <>
      {/* Session bar */}
      <div className="flex items-center justify-between px-5 py-2 text-xs" style={{ background: '#13347b' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold">O</div>
          <span className="text-white/80 font-medium">ops@gmail.com</span>
          <span className="text-white/40">·</span>
          <span className="text-white/50">resQ Ops Centre</span>
        </div>
        <button
          onClick={() => { localStorage.removeItem(SESSION_KEY); setAuthed(false) }}
          className="text-white/50 hover:text-white font-semibold transition-colors text-[11px]"
        >
          Sign out
        </button>
      </div>
      {children}
    </>
  )
}
