'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const MOCK_REFERRALS = [
  { name: 'Priya M.', date: '28 Sep 2026', status: 'completed', earned: 100 },
  { name: 'Rohit K.', date: '15 Sep 2026', status: 'completed', earned: 100 },
  { name: 'Anjali S.', date: '2 Oct 2026', status: 'pending', earned: 0 },
]

export default function ReferralPage() {
  const { user, hydrated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { if (hydrated && !user) router.push('/login') }, [mounted, user, router])
  if (!hydrated || !user) return null

  const code = 'RESQ' + (user.phone || '').slice(-4).toUpperCase() || 'RESQ1234'
  const totalEarned = MOCK_REFERRALS.filter(r => r.status === 'completed').reduce((s, r) => s + r.earned, 0)
  const shareLink = `https://res-q-sepia-pi.vercel.app?ref=${code}`

  function handleCopy() {
    navigator.clipboard.writeText(shareLink).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy to-sky rounded-3xl p-6 text-white text-center mb-6">
        <div className="text-4xl mb-3">🎁</div>
        <h1 className="text-2xl font-extrabold mb-1">Refer & Earn</h1>
        <p className="text-white/80 text-sm">Share resQ with friends. Earn ₹100 credits for every friend who books their first service.</p>
        <div className="mt-5 bg-white/20 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="text-left">
            <div className="text-white/70 text-xs font-semibold uppercase tracking-wide">Your referral code</div>
            <div className="text-2xl font-extrabold tracking-widest mt-0.5">{code}</div>
          </div>
          <button onClick={handleCopy}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition ${copied ? 'bg-green-400 text-white' : 'bg-white text-navy hover:bg-gray-100'}`}>
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Credits balance */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[['₹' + totalEarned, 'Credits earned'], [MOCK_REFERRALS.filter(r => r.status === 'completed').length, 'Successful refs'], [MOCK_REFERRALS.filter(r => r.status === 'pending').length, 'Pending']].map(([v, l]) => (
          <div key={l} className="bg-white rounded-2xl shadow-card p-4 text-center">
            <div className="text-xl font-extrabold text-navy">{v}</div>
            <div className="text-xs text-gray-400 mt-0.5">{l}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
        <h3 className="font-extrabold text-gray-900 mb-4">How it works</h3>
        <div className="space-y-3">
          {[
            ['1', 'Share your code', 'Send your unique link or code to friends and family.'],
            ['2', 'They book a service', 'Your friend books their first resQ service using your code.'],
            ['3', 'You both earn ₹100', 'You get ₹100 resQ credits. They get ₹100 off their first service!'],
          ].map(([num, title, desc]) => (
            <div key={num} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-sky text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{num}</div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share button */}
      <button onClick={handleCopy}
        className="w-full py-4 bg-sky text-white font-bold rounded-2xl hover:bg-sky/90 transition mb-5 flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
        {copied ? '✓ Link copied!' : 'Share referral link'}
      </button>

      {/* Referral history */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h3 className="font-extrabold text-gray-900 mb-4">Referral history</h3>
        {MOCK_REFERRALS.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">No referrals yet. Start sharing!</div>
        ) : (
          <div className="space-y-3">
            {MOCK_REFERRALS.map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">{r.name.charAt(0)}</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${r.status === 'completed' ? 'text-green-600' : 'text-amber-500'}`}>
                    {r.status === 'completed' ? `+₹${r.earned}` : 'Pending'}
                  </div>
                  <div className="text-xs text-gray-400">{r.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
