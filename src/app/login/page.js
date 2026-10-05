'use client'
import { useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'

export default function Login() {
  const [tab, setTab] = useState('login')
  const [step, setStep] = useState('phone') // 'phone' | 'otp' | 'success'
  const [phone, setPhone] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [resendTimer, setResendTimer] = useState(0)
  const otpRefs = [useRef(), useRef(), useRef(), useRef()]
  const { login } = useAuth()
  const router = useRouter()

  function switchTab(t) {
    setTab(t)
    setStep('phone')
    setPhone('')
    setOtp(['', '', '', ''])
  }

  function sendOtp() {
    setStep('otp')
    // Auto-fill demo OTP
    setTimeout(() => setOtp(['1', '2', '3', '4']), 1000)
    startResend()
  }

  function startResend() {
    setResendTimer(30)
    const iv = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(iv); return 0 }
        return t - 1
      })
    }, 1000)
  }

  function handleOtpChange(val, i) {
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < 3) otpRefs[i + 1].current?.focus()
  }

  function handleOtpKeyDown(e, i) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs[i - 1].current?.focus()
    }
  }

  function verifyOtp() {
    const code = otp.join('')
    if (code.length < 4) return
    const name = tab === 'signup' ? (firstName || 'User') : 'User'
    login(name, phone)
    setStep('success')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-light to-blue-50 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-navy to-sky px-8 py-8 text-center">
          <Image
            src="https://www.resqservices.in/_next/static/media/resQlogo.4b286cb0.svg"
            alt="resQ"
            width={100}
            height={40}
            className="mx-auto mb-4 brightness-0 invert"
            unoptimized
          />
          <h2 className="text-white font-extrabold text-xl">
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-white/75 text-sm mt-1">
            {tab === 'login' ? 'Sign in to manage your devices & bookings' : 'Join resQ for expert appliance care'}
          </p>
        </div>

        {/* Tabs */}
        {step !== 'success' && (
          <div className="flex border-b border-gray-100">
            {['login', 'signup'].map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  tab === t ? 'border-navy text-navy' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {t === 'login' ? 'Login' : 'Sign up'}
              </button>
            ))}
          </div>
        )}

        <div className="px-8 py-7">

          {/* Phone step */}
          {step === 'phone' && (
            <div className="space-y-4">
              {tab === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">First name</label>
                      <input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Last name</label>
                      <input
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Email address</label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Mobile number</label>
                <div className="flex gap-2">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 flex items-center text-sm font-semibold text-gray-700 flex-shrink-0">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">We'll send a one-time password to this number</p>
              </div>
              <button
                onClick={sendOtp}
                disabled={phone.length < 10}
                className="w-full bg-navy text-white font-bold py-4 rounded-xl mt-2 hover:bg-navy-dark transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Send OTP
              </button>
              <p className="text-xs text-gray-400 text-center">
                By continuing, you agree to resQ's{' '}
                <span className="text-sky cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-sky cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          )}

          {/* OTP step */}
          {step === 'otp' && (
            <div className="space-y-5">
              <button
                onClick={() => setStep('phone')}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy transition"
              >
                ← Change number
              </button>
              <div className="bg-blue-50 rounded-xl py-2.5 px-4 text-sm text-navy font-semibold text-center">
                OTP sent to +91 {phone.slice(0,3)}XXXXX{phone.slice(-2)}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-3 text-center">Enter 4-digit OTP</label>
                <div className="flex gap-3 justify-center">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={otpRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => handleOtpChange(e.target.value, i)}
                      onKeyDown={e => handleOtpKeyDown(e, i)}
                      className="otp-input w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-sky text-navy"
                    />
                  ))}
                </div>
              </div>
              <div className="text-center text-xs text-gray-400">
                {resendTimer > 0 ? (
                  <span>Resend OTP in <b>{resendTimer}s</b></span>
                ) : (
                  <span>
                    Didn't receive OTP?{' '}
                    <button onClick={() => { sendOtp(); startResend() }} className="text-navy font-semibold">Resend</button>
                  </span>
                )}
              </div>
              <button
                onClick={verifyOtp}
                disabled={otp.join('').length < 4}
                className="w-full bg-navy text-white font-bold py-4 rounded-xl hover:bg-navy-dark transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {tab === 'login' ? 'Verify & Login' : 'Create Account'}
              </button>
            </div>
          )}

          {/* Success step */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-20 h-20 bg-green-light rounded-full flex items-center justify-center text-4xl mx-auto">
                {tab === 'login' ? '✓' : '🎉'}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {tab === 'login' ? 'Welcome back!' : 'Account created!'}
              </h3>
              <p className="text-gray-500 text-sm">
                {tab === 'login'
                  ? "You're successfully signed in to your resQ account."
                  : 'Welcome to resQ. Your account has been set up successfully.'}
              </p>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-navy text-white font-bold py-4 rounded-xl hover:bg-navy-dark transition"
              >
                {tab === 'login' ? 'Go to Dashboard' : 'Explore Services'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
