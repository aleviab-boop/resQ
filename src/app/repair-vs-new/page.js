'use client'
import { useState } from 'react'

const APPLIANCES = [
  { label: 'Air Conditioner', newPrice: 35000, lifespan: 15 },
  { label: 'Refrigerator', newPrice: 28000, lifespan: 12 },
  { label: 'Washing Machine', newPrice: 22000, lifespan: 10 },
  { label: 'LED TV', newPrice: 25000, lifespan: 8 },
  { label: 'Water Purifier', newPrice: 12000, lifespan: 8 },
  { label: 'Microwave', newPrice: 8000, lifespan: 10 },
  { label: 'Geyser', newPrice: 6000, lifespan: 10 },
]

function getRecommendation(repairCost, applianceAge, applianceData) {
  if (!applianceData || !repairCost) return null
  const { newPrice, lifespan } = applianceData
  const remainingLife = Math.max(0, lifespan - applianceAge)
  const repairRatio = repairCost / newPrice

  // Rule of thumb: if repair > 50% of new price OR remaining life < 2 years → consider replacing
  if (repairRatio > 0.5 || remainingLife < 2) {
    return {
      verdict: 'replace',
      emoji: '🆕',
      title: 'Consider buying new',
      color: 'from-orange-500 to-red-500',
      summary: `At ₹${repairCost.toLocaleString()}, the repair costs ${Math.round(repairRatio * 100)}% of a new ${applianceData.label.toLowerCase()} (₹${newPrice.toLocaleString()}). With only ~${remainingLife} years of expected life left, you may be spending good money on an aging appliance.`,
      savings: newPrice - repairCost,
      breakeven: remainingLife < 1 ? 'Already past break-even' : `Break-even: ~${remainingLife} year${remainingLife !== 1 ? 's' : ''}`,
    }
  }

  if (repairRatio > 0.3) {
    return {
      verdict: 'borderline',
      emoji: '⚖️',
      title: 'It depends',
      color: 'from-amber-500 to-yellow-500',
      summary: `The repair (₹${repairCost.toLocaleString()}) is ${Math.round(repairRatio * 100)}% of a new unit. If your appliance is in otherwise good condition, repairing makes sense. But if this is a recurring issue, replacing might save money long-term.`,
      savings: null,
      breakeven: `${remainingLife} years of expected life remaining`,
    }
  }

  return {
    verdict: 'repair',
    emoji: '🔧',
    title: 'Definitely repair',
    color: 'from-green-500 to-emerald-600',
    summary: `At just ${Math.round(repairRatio * 100)}% of the replacement cost, repairing is clearly the right call. You'll save ₹${(newPrice - repairCost).toLocaleString()} and still get ~${remainingLife} more years of use.`,
    savings: newPrice - repairCost,
    breakeven: `Saves ₹${(newPrice - repairCost).toLocaleString()} vs buying new`,
  }
}

export default function RepairVsNewPage() {
  const [appliance, setAppliance] = useState('')
  const [age, setAge] = useState('')
  const [repairCost, setRepairCost] = useState('')

  const applianceData = APPLIANCES.find(a => a.label === appliance)
  const result = getRecommendation(Number(repairCost), Number(age), applianceData)

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-block bg-navy/10 text-navy text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">Repair vs Replace</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Is it worth repairing?</h1>
        <p className="text-gray-500 text-sm">Enter your details and get an instant recommendation based on repair cost, appliance age, and market price.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-card p-6 space-y-5 mb-6">
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-2">Appliance type</label>
          <select value={appliance} onChange={e => setAppliance(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-sky">
            <option value="">Select appliance</option>
            {APPLIANCES.map(a => <option key={a.label}>{a.label}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-700 block mb-2">Appliance age (years)</label>
          <input type="number" min="0" max="30" value={age} onChange={e => setAge(e.target.value)}
            placeholder="e.g. 5"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-sky" />
        </div>

        <div>
          <label className="text-sm font-bold text-gray-700 block mb-2">Estimated repair cost (₹)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
            <input type="number" min="0" value={repairCost} onChange={e => setRepairCost(e.target.value)}
              placeholder="e.g. 3500"
              className="w-full border border-gray-200 rounded-2xl px-4 pl-8 py-3.5 text-sm outline-none focus:border-sky" />
          </div>
          {applianceData && <p className="text-xs text-gray-400 mt-1">New {appliance} costs approx. ₹{applianceData.newPrice.toLocaleString()}</p>}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className={`bg-gradient-to-br ${result.color} rounded-3xl p-6 text-white mb-6`}>
          <div className="text-4xl mb-3">{result.emoji}</div>
          <div className="text-2xl font-extrabold mb-2">{result.title}</div>
          <p className="text-white/90 text-sm leading-relaxed mb-4">{result.summary}</p>
          <div className="bg-white/20 rounded-2xl px-4 py-3 text-sm font-semibold">{result.breakeven}</div>
        </div>
      )}

      {/* CTA */}
      {result && (
        <div className="space-y-3">
          {(result.verdict === 'repair' || result.verdict === 'borderline') && (
            <a href="/all-services" className="block w-full py-4 bg-navy text-white font-bold rounded-2xl text-center hover:bg-navy/90 transition">
              Book Repair Service →
            </a>
          )}
          {(result.verdict === 'replace' || result.verdict === 'borderline') && (
            <a href="/care-plan" className="block w-full py-4 bg-white border-2 border-navy text-navy font-bold rounded-2xl text-center hover:bg-gray-50 transition">
              Explore Care Plans for New Appliance
            </a>
          )}
        </div>
      )}

      {/* How it works */}
      {!result && (
        <div className="bg-white rounded-3xl shadow-card p-6">
          <h3 className="font-bold text-gray-800 mb-4">How we calculate</h3>
          <div className="space-y-3">
            {[
              ['50% Rule', 'If repair > 50% of new price → usually better to replace'],
              ['Age Factor', 'If < 2 years of expected life left → replacement wins'],
              ['Sweet Spot', 'Under 30% repair cost with 5+ years remaining → always repair'],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-sky mt-1.5 flex-shrink-0" />
                <div><span className="font-semibold text-gray-800">{title}: </span><span className="text-gray-500">{desc}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
