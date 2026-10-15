'use client'
import { useState } from 'react'
import { SURVEYS, CASES, CUSTOMERS } from '@/lib/platformData'
import OpsShell, { StatCard, SectionLabel } from '@/components/OpsShell'

// ── helpers ─────────────────────────────────────────────────────────────────
function npsColor(score) {
  if (score === null || score === undefined) return 'text-gray-400'
  if (score >= 9) return 'text-green-600 font-bold'
  if (score >= 7) return 'text-amber-500 font-bold'
  return 'text-red-600 font-bold'
}

function npsBadge(score) {
  if (score === null || score === undefined) return <span className="text-gray-400">—</span>
  const cls = score >= 9 ? 'bg-green-100 text-green-700' : score >= 7 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${cls}`}>{score}</span>
}

function getCustomerName(customerId) {
  return CUSTOMERS.find(c => c.id === customerId)?.name ?? customerId
}

function getCaseTitle(caseId) {
  return CASES.find(c => c.id === caseId)?.title ?? caseId
}

function calcNPS(responses) {
  const valid = responses.filter(r => r.answers?.q1 != null)
  if (valid.length === 0) return null
  const promoters  = valid.filter(r => r.answers.q1 >= 9).length
  const detractors = valid.filter(r => r.answers.q1 <= 6).length
  return Math.round(((promoters - detractors) / valid.length) * 100)
}

function calcAvgScore(responses) {
  const valid = responses.filter(r => r.answers?.q1 != null)
  if (valid.length === 0) return null
  return (valid.reduce((s, r) => s + r.answers.q1, 0) / valid.length).toFixed(1)
}

const TRIGGER_OPTIONS   = ['case-resolved', 'order-completed', 'weekly-feedback']
const QUESTION_TYPES    = ['NPS', 'Scale 1-5', 'Text', 'Yes-No']
const RECOVERY_ACTIONS  = ['Create case', 'Send WhatsApp', 'Assign to senior']

function newQuestion() {
  return { id: Date.now(), type: 'NPS', text: '' }
}

// ── NPS Analytics tab ────────────────────────────────────────────────────────
function NPSAnalyticsTab() {
  const svcResponses   = SURVEYS[0].responses
  const storeResponses = SURVEYS[1].responses

  const serviceNPSScore = calcNPS(svcResponses) ?? 0
  const storeNPSScore   = storeResponses.length > 0 ? calcNPS(storeResponses) : null

  const customerRows = [
    { id: 'C001', name: 'Priya Mehta',  serviceNPS: 9,    serviceCaseId: 'CS007', serviceDate: '12 Aug 2026', recoveryCase: null },
    { id: 'C006', name: 'Deepak Joshi', serviceNPS: 3,    serviceCaseId: 'CS005', serviceDate: '9 Oct 2026',  recoveryCase: 'CS006' },
    { id: 'C002', name: 'Ramesh Iyer',  serviceNPS: null, serviceCaseId: null,    serviceDate: null,          recoveryCase: null },
    { id: 'C003', name: 'Anita Sharma', serviceNPS: null, serviceCaseId: null,    serviceDate: null,          recoveryCase: null },
    { id: 'C004', name: 'Vikram Nair',  serviceNPS: null, serviceCaseId: null,    serviceDate: null,          recoveryCase: null },
    { id: 'C005', name: 'Sunita Patel', serviceNPS: null, serviceCaseId: null,    serviceDate: null,          recoveryCase: null },
  ]

  const promoters  = customerRows.filter(c => c.serviceNPS !== null && c.serviceNPS >= 9)
  const detractors = customerRows.filter(c => c.serviceNPS !== null && c.serviceNPS <= 6)

  const trendMonths = ['Jul', 'Aug', 'Sep', 'Oct']
  const svcTrend    = [20, 10, 0, 0]
  const storeTrend  = [35, 40, 30, null]
  const chartMax    = 50

  return (
    <div className="space-y-6">

      {/* NPS score tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Service NPS</div>
          <div className={`text-6xl font-extrabold mb-2 ${serviceNPSScore >= 50 ? 'text-green-600' : serviceNPSScore >= 0 ? 'text-amber-500' : 'text-red-600'}`}>
            {serviceNPSScore}
          </div>
          <div className="text-sm text-gray-400">Post-service feedback · {svcResponses.length} responses</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Store NPS</div>
          {storeNPSScore === null ? (
            <div className="text-xl font-bold text-gray-400 mb-2">No NPS data — {storeResponses.length} responses needed</div>
          ) : (
            <div className={`text-6xl font-extrabold mb-2 ${storeNPSScore >= 50 ? 'text-green-600' : storeNPSScore >= 0 ? 'text-amber-500' : 'text-red-600'}`}>
              {storeNPSScore}
            </div>
          )}
          <div className="text-sm text-gray-400">Store purchase feedback · {storeResponses.length} responses</div>
        </div>
      </div>
      <div className="text-xs text-center text-gray-400 bg-white rounded-xl py-2.5 px-4 border border-gray-100">
        NPS = % Promoters (9–10) minus % Detractors (0–6). Industry benchmark: +40 is good.
      </div>

      {/* Per-customer NPS history */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <SectionLabel>Per-Customer NPS History</SectionLabel>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-center">Last Service NPS</th>
                <th className="px-4 py-2 text-center">Last Store NPS</th>
                <th className="px-4 py-2 text-left">Service Date</th>
                <th className="px-4 py-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {customerRows.map(c => (
                <tr key={c.id} className={`border-t border-gray-100 ${c.serviceNPS !== null && c.serviceNPS <= 6 ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {c.name}
                    <span className="ml-1.5 text-xs text-gray-400">{c.id}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {c.serviceNPS !== null ? (
                      <>
                        <span className={`inline-block font-bold px-2 py-0.5 rounded-full text-xs mr-1 ${
                          c.serviceNPS >= 9 ? 'bg-green-100 text-green-700' : c.serviceNPS >= 7 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {c.serviceNPS}
                        </span>
                        {c.serviceCaseId && <span className="text-xs text-gray-400">({c.serviceCaseId})</span>}
                      </>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">—</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {c.serviceDate ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {c.serviceNPS !== null && c.serviceNPS <= 6 && c.recoveryCase ? (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        Recovery triggered
                      </span>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NPS Trend chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <SectionLabel>NPS Trend</SectionLabel>
          <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
            Simulated · Jul–Oct 2026
          </span>
        </div>
        <div className="flex gap-3 items-end" style={{ height: '140px' }}>
          {trendMonths.map((month, i) => (
            <div key={month} className="flex-1 flex flex-col items-center">
              <div className="w-full flex gap-1 items-end" style={{ height: '112px' }}>
                <div className="flex-1 flex flex-col justify-end h-full">
                  <div
                    className="w-full rounded-t bg-[#00a1e1] transition-all"
                    style={{ height: `${Math.max(3, Math.round((Math.max(0, svcTrend[i]) / chartMax) * 112))}px` }}
                    title={`Service NPS: ${svcTrend[i] >= 0 ? '+' : ''}${svcTrend[i]}`}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-end h-full">
                  {storeTrend[i] !== null ? (
                    <div
                      className="w-full rounded-t bg-[#13347b] transition-all"
                      style={{ height: `${Math.max(3, Math.round((Math.max(0, storeTrend[i]) / chartMax) * 112))}px` }}
                      title={`Store NPS: ${storeTrend[i] >= 0 ? '+' : ''}${storeTrend[i]}`}
                    />
                  ) : (
                    <div className="w-full rounded-t bg-gray-100 border border-dashed border-gray-200" style={{ height: '12px' }} title="No store NPS data for Oct" />
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-600 font-semibold mt-1">{month}</div>
              <div className="text-[10px] text-gray-400 mt-0.5 text-center">
                <span className="text-[#00a1e1] font-medium">{svcTrend[i] >= 0 ? '+' : ''}{svcTrend[i]}</span>
                {' / '}
                <span className="text-[#13347b] font-medium">{storeTrend[i] !== null ? (storeTrend[i] >= 0 ? '+' : '') + storeTrend[i] : '—'}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-5 mt-4 justify-center text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block bg-[#00a1e1]" />
            Service NPS
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block bg-[#13347b]" />
            Store NPS
          </span>
        </div>
      </div>

      {/* Promoter / Detractor breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <SectionLabel>Promoters (score 9–10)</SectionLabel>
          {promoters.length === 0 ? (
            <p className="text-gray-400 text-sm">No promoters yet.</p>
          ) : (
            <div className="space-y-2">
              {promoters.map(c => (
                <div key={c.id} className="flex items-center justify-between bg-green-50 rounded-xl px-3 py-2">
                  <span className="font-medium text-gray-800 text-sm">{c.name}</span>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full">{c.serviceNPS}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <SectionLabel>Detractors (score 0–6)</SectionLabel>
          {detractors.length === 0 ? (
            <p className="text-gray-400 text-sm">No detractors.</p>
          ) : (
            <div className="space-y-2">
              {detractors.map(c => (
                <div key={c.id} className="bg-red-50 rounded-xl px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 text-sm">{c.name}</span>
                    <span className="text-xs font-bold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full">{c.serviceNPS}</span>
                  </div>
                  {c.recoveryCase && (
                    <a href={`/ops/cases/${c.recoveryCase}`} className="text-xs text-[#00a1e1] hover:underline font-semibold mt-1 inline-block">
                      Recovery case: {c.recoveryCase}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Responses tab ─────────────────────────────────────────────────────────────
function ResponsesTab() {
  return (
    <div className="space-y-6">
      {/* Per-survey cards */}
      {SURVEYS.map(survey => (
        <div key={survey.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
            <div>
              <span className="font-extrabold text-gray-900 text-lg">{survey.name}</span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-semibold ${survey.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {survey.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex gap-4 text-sm text-gray-500 ml-auto flex-wrap">
              <span>Trigger: <strong className="text-gray-700">{survey.trigger}</strong></span>
              <span>{survey.questions.length} questions</span>
              <span>{survey.responses.length} responses</span>
              <span>NPS: <strong className={npsColor(calcNPS(survey.responses))}>{calcNPS(survey.responses) ?? '—'}</strong></span>
              <span>Avg: <strong className={npsColor(Number(calcAvgScore(survey.responses)))}>{calcAvgScore(survey.responses) ?? '—'}</strong></span>
            </div>
          </div>

          {survey.responses.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">No responses yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2 text-left">Case</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Submitted</th>
                    <th className="px-4 py-2 text-center">NPS (Q1)</th>
                    <th className="px-4 py-2 text-center">Q2</th>
                    <th className="px-4 py-2 text-center">Q3</th>
                    <th className="px-4 py-2 text-left">Comment</th>
                    <th className="px-4 py-2 text-center">Recovery</th>
                  </tr>
                </thead>
                <tbody>
                  {survey.responses.map(r => (
                    <tr
                      key={r.id}
                      className={`border-t border-gray-100 ${r.triggeredRecovery ? 'border-l-4 border-l-red-400 bg-red-50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-4 py-3 text-gray-700 text-xs max-w-[160px] truncate" title={getCaseTitle(r.caseId)}>
                        {r.caseId}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{getCustomerName(r.customerId)}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(r.submittedAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="px-4 py-3 text-center">{npsBadge(r.answers.q1)}</td>
                      <td className="px-4 py-3 text-center">{r.answers.q2 ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3 text-center">{r.answers.q3 ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[240px]">
                        <span className="line-clamp-2">{r.answers.q4 || <span className="text-gray-300 italic">—</span>}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {r.triggeredRecovery
                          ? <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">Yes</span>
                          : <span className="text-gray-300 text-xs">—</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Survey List tab ───────────────────────────────────────────────────────────
function SurveyListTab() {
  const [activeSurveys, setActiveSurveys]     = useState(SURVEYS.map(s => ({ ...s })))
  const [editing, setEditing]                 = useState(false)
  const [surveyName, setSurveyName]           = useState('')
  const [trigger, setTrigger]                 = useState(TRIGGER_OPTIONS[0])
  const [questions, setQuestions]             = useState([newQuestion()])
  const [showSuccess, setShowSuccess]         = useState(false)
  const [recoveryEnabled, setRecoveryEnabled] = useState(true)
  const [recoveryThreshold, setRecoveryThreshold] = useState(5)
  const [recoveryAction, setRecoveryAction]   = useState(RECOVERY_ACTIONS[0])

  function addQuestion()     { setQuestions(q => [...q, newQuestion()]) }
  function removeQuestion(id) { setQuestions(q => q.filter(qq => qq.id !== id)) }

  function moveQuestion(id, dir) {
    setQuestions(q => {
      const idx = q.findIndex(qq => qq.id === id)
      const next = idx + dir
      if (next < 0 || next >= q.length) return q
      const arr = [...q]
      ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    })
  }

  function updateQuestion(id, field, value) {
    setQuestions(q => q.map(qq => qq.id === id ? { ...qq, [field]: value } : qq))
  }

  function handleSave() {
    if (!surveyName.trim()) return
    const newSurvey = {
      id: `SV${Date.now()}`,
      name: surveyName,
      trigger,
      active: true,
      questions: questions.map((q, i) => ({ id: `q${i + 1}`, type: q.type.toLowerCase().replace(/ /g, '-'), text: q.text })),
      responses: [],
      avgNps: null,
      responseRate: 0,
    }
    setActiveSurveys(s => [...s, newSurvey])
    setSurveyName('')
    setTrigger(TRIGGER_OPTIONS[0])
    setQuestions([newQuestion()])
    setEditing(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  function toggleSurvey(id) {
    setActiveSurveys(s => s.map(sv => sv.id === id ? { ...sv, active: !sv.active } : sv))
  }

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl font-semibold flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Survey saved successfully!
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <SectionLabel>Active Surveys</SectionLabel>
          <button
            onClick={() => setEditing(true)}
            className="bg-[#00a1e1] hover:bg-[#0090cc] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
          >
            + Create New
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {activeSurveys.map(sv => (
            <div key={sv.id} className="px-5 py-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{sv.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">Trigger: {sv.trigger} · {sv.questions.length} questions · {sv.responses.length} responses</div>
              </div>
              <button
                onClick={() => toggleSurvey(sv.id)}
                className={`text-xs font-bold px-3 py-1 rounded-full transition ${sv.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {sv.active ? 'Active' : 'Inactive'}
              </button>
              <button
                onClick={() => {
                  setSurveyName(sv.name)
                  setTrigger(sv.trigger)
                  setQuestions(sv.questions.map(q => ({ id: q.id, type: q.type, text: q.text })))
                  setEditing(true)
                }}
                className="text-xs font-semibold text-[#00a1e1] hover:underline"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-[#00a1e1]/30 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-[#00a1e1]/5 flex items-center justify-between">
            <span className="font-extrabold text-[#13347b]">Survey Editor</span>
            <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600 text-sm">
              Cancel
            </button>
          </div>
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Survey Name</label>
                <input
                  value={surveyName}
                  onChange={e => setSurveyName(e.target.value)}
                  placeholder="e.g. Post-Installation NPS"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00a1e1]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Trigger</label>
                <select
                  value={trigger}
                  onChange={e => setTrigger(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00a1e1]"
                >
                  {TRIGGER_OPTIONS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">Questions</div>
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div key={q.id} className="flex gap-2 items-start bg-gray-50 rounded-xl p-3">
                    <div className="flex flex-col gap-0.5 mt-1">
                      <button onClick={() => moveQuestion(q.id, -1)} className="text-gray-400 hover:text-gray-700 text-xs leading-none">▲</button>
                      <button onClick={() => moveQuestion(q.id, 1)}  className="text-gray-400 hover:text-gray-700 text-xs leading-none">▼</button>
                    </div>
                    <div className="text-xs text-gray-400 font-bold mt-1 w-4">{idx + 1}.</div>
                    <select
                      value={q.type}
                      onChange={e => updateQuestion(q.id, 'type', e.target.value)}
                      className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#00a1e1] bg-white flex-shrink-0"
                    >
                      {QUESTION_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <input
                      value={q.text}
                      onChange={e => updateQuestion(q.id, 'text', e.target.value)}
                      placeholder="Question text..."
                      className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#00a1e1] bg-white"
                    />
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className="text-red-400 hover:text-red-600 text-xs mt-1 flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addQuestion} className="mt-3 text-sm font-semibold text-[#00a1e1] hover:underline">
                + Add Question
              </button>
            </div>

            <div className="border border-amber-200 rounded-xl p-4 bg-amber-50">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-amber-800 text-sm">Auto-Recovery Workflow</div>
                <button
                  onClick={() => setRecoveryEnabled(v => !v)}
                  className={`w-10 h-5 rounded-full transition relative ${recoveryEnabled ? 'bg-[#00a1e1]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${recoveryEnabled ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
              {recoveryEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Trigger when NPS is at most</label>
                    <input
                      type="number" min={0} max={10}
                      value={recoveryThreshold}
                      onChange={e => setRecoveryThreshold(Number(e.target.value))}
                      className="w-24 border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#00a1e1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Recovery Action</label>
                    <select
                      value={recoveryAction}
                      onChange={e => setRecoveryAction(e.target.value)}
                      className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#00a1e1]"
                    >
                      {RECOVERY_ACTIONS.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="bg-[#13347b] hover:bg-[#0e2860] text-white font-bold px-6 py-2 rounded-lg text-sm transition"
              >
                Save Survey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'list',      label: 'Survey List' },
  { key: 'responses', label: 'Responses' },
  { key: 'nps',       label: 'NPS Analytics' },
]

export default function SurveysPage() {
  const [activeTab, setActiveTab] = useState('responses')

  // Page-level stats
  const totalResponses = SURVEYS.reduce((sum, s) => sum + s.responses.length, 0)
  const serviceNPS     = calcNPS(SURVEYS[0].responses)
  const npsResponses   = SURVEYS[0].responses.filter(r => r.answers?.q1 != null)
  const promotersPct   = npsResponses.length > 0
    ? Math.round((npsResponses.filter(r => r.answers.q1 >= 9).length / npsResponses.length) * 100)
    : null
  const recoveryPending = SURVEYS.flatMap(s => s.responses).filter(r => r.triggeredRecovery).length

  const npsColor = serviceNPS == null ? 'text-gray-400' : serviceNPS >= 50 ? 'text-green-600' : serviceNPS >= 0 ? 'text-amber-500' : 'text-red-600'

  return (
    <OpsShell
      title="Surveys & Recovery"
      subtitle="NPS analytics · Response tracking · Recovery workflows"
      breadcrumb={[{ label: 'Surveys' }]}
    >
      {/* ── Stat row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Responses"   value={totalResponses}                             sub="across all surveys" />
        <StatCard label="Service NPS"       value={serviceNPS ?? '—'}  color={npsColor}        sub="post-service score" />
        <StatCard label="Promoters"         value={promotersPct != null ? `${promotersPct}%` : '—'} color="text-green-600" sub="score 9–10" />
        <StatCard label="Recovery Pending"  value={recoveryPending}    color="text-red-600"    sub="cases triggered" />
      </div>

      {/* ── Pill tabs ────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === tab.key
                ? 'bg-white text-[#13347b] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'list'      && <SurveyListTab />}
      {activeTab === 'responses' && <ResponsesTab />}
      {activeTab === 'nps'       && <NPSAnalyticsTab />}
    </OpsShell>
  )
}
