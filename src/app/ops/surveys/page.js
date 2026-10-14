'use client'
import { useState } from 'react'
import { SURVEYS, CASES, CUSTOMERS } from '@/lib/platformData'

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

const TRIGGER_OPTIONS = ['case-resolved', 'order-completed', 'weekly-feedback']
const QUESTION_TYPES  = ['NPS', 'Scale 1-5', 'Text', 'Yes-No']
const RECOVERY_ACTIONS = ['Create case', 'Send WhatsApp', 'Assign to senior']

function newQuestion() {
  return { id: Date.now(), type: 'NPS', text: '' }
}

// ── Summary tiles ─────────────────────────────────────────────────────────────
function SummaryTile({ label, value, sub, color = 'text-[#13347b]' }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
      <div className="text-sm text-gray-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

// ── RESPONSES TAB ─────────────────────────────────────────────────────────────
function ResponsesTab() {
  return (
    <div className="space-y-8">
      {/* Summary tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryTile label="Response Rate" value="68%" sub="across all surveys" color="text-[#00a1e1]" />
        <SummaryTile label="Avg Service NPS" value="6.2" sub="Post-Service survey" color="text-amber-500" />
        <SummaryTile label="Avg Store NPS" value="7.4" sub="Store Purchase survey" color="text-green-600" />
        <SummaryTile label="Recovery Triggered" value="1" sub="auto-case created" color="text-red-600" />
      </div>

      {/* Per-survey cards */}
      {SURVEYS.map(survey => (
        <div key={survey.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Survey header */}
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
              <span>Avg NPS: <strong className={npsColor(survey.avgNps)}>{survey.avgNps}</strong></span>
            </div>
          </div>

          {/* Response table */}
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
                          ? <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">⚠ Yes</span>
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

// ── BUILDER TAB ───────────────────────────────────────────────────────────────
function BuilderTab() {
  const [activeSurveys, setActiveSurveys]     = useState(SURVEYS.map(s => ({ ...s })))
  const [editing, setEditing]                 = useState(false)

  // Form state
  const [surveyName, setSurveyName]           = useState('')
  const [trigger, setTrigger]                 = useState(TRIGGER_OPTIONS[0])
  const [questions, setQuestions]             = useState([newQuestion()])
  const [showSuccess, setShowSuccess]         = useState(false)

  // Recovery workflow state
  const [recoveryEnabled, setRecoveryEnabled] = useState(true)
  const [recoveryThreshold, setRecoveryThreshold] = useState(5)
  const [recoveryAction, setRecoveryAction]   = useState(RECOVERY_ACTIONS[0])

  function addQuestion() {
    setQuestions(q => [...q, newQuestion()])
  }

  function removeQuestion(id) {
    setQuestions(q => q.filter(qq => qq.id !== id))
  }

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
    <div className="space-y-8">
      {/* Success toast */}
      {showSuccess && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl font-semibold flex items-center gap-2 animate-pulse">
          <span>✓</span> Survey saved successfully!
        </div>
      )}

      {/* Active surveys list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-extrabold text-gray-900">Active Surveys</h2>
          <button
            onClick={() => setEditing(true)}
            className="bg-[#00a1e1] hover:bg-[#0090cc] text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition"
          >
            + Create New Survey
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

      {/* Survey editor */}
      {editing && (
        <div className="bg-white rounded-xl shadow-sm border border-[#00a1e1]/30 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-[#00a1e1]/5 flex items-center justify-between">
            <h2 className="font-extrabold text-[#13347b]">Survey Editor</h2>
            <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕ Cancel</button>
          </div>
          <div className="p-5 space-y-5">
            {/* Name & trigger */}
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

            {/* Questions */}
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">Questions</div>
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div key={q.id} className="flex gap-2 items-start bg-gray-50 rounded-lg p-3">
                    {/* Order buttons */}
                    <div className="flex flex-col gap-0.5 mt-1">
                      <button onClick={() => moveQuestion(q.id, -1)} className="text-gray-400 hover:text-gray-700 text-xs leading-none">▲</button>
                      <button onClick={() => moveQuestion(q.id, 1)} className="text-gray-400 hover:text-gray-700 text-xs leading-none">▼</button>
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
                    >✕</button>
                  </div>
                ))}
              </div>
              <button
                onClick={addQuestion}
                className="mt-3 text-sm font-semibold text-[#00a1e1] hover:underline"
              >
                + Add Question
              </button>
            </div>

            {/* Recovery workflow */}
            <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
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
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Trigger when NPS ≤</label>
                    <input
                      type="number"
                      min={0} max={10}
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

            {/* Save */}
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

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function SurveysPage() {
  const [activeTab, setActiveTab] = useState('responses')

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Surveys & Recovery</h1>
        <p className="text-gray-400 mt-1">NPS surveys, response analytics, and auto-recovery workflows</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8">
        {[
          { key: 'responses', label: 'Survey Responses' },
          { key: 'builder',   label: 'Survey Builder' },
        ].map(tab => (
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

      {activeTab === 'responses' ? <ResponsesTab /> : <BuilderTab />}
    </div>
  )
}
