'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CUSTOMERS, PRODUCTS, TECHNICIANS, SERVICE_CENTERS, CASES, getProductsForCustomer } from '@/lib/platformData'

const CASE_TYPES = ['repair', 'installation', 'service', 'maintenance', 'recovery']
const PRIORITIES = ['high', 'medium', 'low']
const CHANNELS = ['whatsapp', 'phone', 'email', 'app', 'store', 'internal']

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

function Input({ ...props }) {
  return (
    <input
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      {...props}
    />
  )
}

function Select({ children, ...props }) {
  return (
    <select
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-white"
      {...props}
    >
      {children}
    </select>
  )
}

export default function NewCasePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    customerId: '',
    productId: '',
    type: 'repair',
    priority: 'medium',
    channel: 'phone',
    title: '',
    description: '',
    assignedTo: '',
    centerId: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [newCaseId, setNewCaseId] = useState(null)
  const [customerSearch, setCustomerSearch] = useState('')

  const filteredCustomers = CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  )

  const selectedCustomer = CUSTOMERS.find(c => c.id === form.customerId)
  const customerProducts = form.customerId ? getProductsForCustomer(form.customerId) : []

  // Fraud / duplicate detection: open cases for this customer
  const openCasesForCustomer = form.customerId
    ? CASES.filter(c =>
        c.customerId === form.customerId &&
        !['resolved', 'completed', 'closed'].includes(c.status)
      )
    : []

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const id = 'CS' + String(Math.floor(Math.random() * 900) + 100)
    setNewCaseId(id)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-card p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Case created</h2>
          <p className="text-gray-500 text-sm mb-2">
            Case <span className="font-mono font-semibold text-navy">{newCaseId}</span> has been opened.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Ticket raised. Assignment and SLA clock will start after technician confirmation.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href={`/ops/cases/${newCaseId}`}
              className="px-5 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy/90"
            >
              Open case
            </Link>
            <Link
              href="/ops/cases"
              className="px-5 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50"
            >
              Back to cases
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/ops" className="hover:text-navy">Ops</Link>
          <span>/</span>
          <Link href="/ops/cases" className="hover:text-navy">Cases</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">New case</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Open a new case</h1>
          <p className="text-sm text-gray-500 mb-8">
            Cases track service requests end-to-end. Each case can have multiple tickets, jobs, and conversations.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer */}
            <Field label="Customer" hint="Search by name or phone number">
              <Input
                placeholder="Search customer..."
                value={customerSearch}
                onChange={e => { setCustomerSearch(e.target.value); set('customerId', ''); set('productId', '') }}
              />
              {customerSearch && !form.customerId && (
                <div className="mt-1 border border-gray-200 rounded-lg overflow-hidden">
                  {filteredCustomers.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400">No customers found</div>
                  ) : filteredCustomers.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { set('customerId', c.id); setCustomerSearch(c.name) }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <span className="font-medium text-gray-900">{c.name}</span>
                      <span className="ml-2 text-gray-400">{c.phone}</span>
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                        c.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                        c.tier === 'Gold' ? 'bg-amber-100 text-amber-700' :
                        c.tier === 'Silver' ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-700'
                      }`}>{c.tier}</span>
                    </button>
                  ))}
                </div>
              )}
              {selectedCustomer && (
                <div className="mt-2 p-3 bg-sky-50 border border-sky-200 rounded-lg text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-navy">{selectedCustomer.name}</span>
                    <button type="button" onClick={() => { set('customerId', ''); set('productId', ''); setCustomerSearch('') }} className="text-gray-400 hover:text-gray-600 text-xs">Clear</button>
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">{selectedCustomer.phone} · {selectedCustomer.city} · {selectedCustomer.tier}</div>
                  <Link href={`/ops/customers/${selectedCustomer.id}`} className="text-xs text-sky-600 hover:underline" target="_blank">View customer 360</Link>
                </div>
              )}
            </Field>

            {/* Duplicate / fraud warning */}
            {openCasesForCustomer.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 text-base flex-shrink-0">⚠️</span>
                  <div>
                    <div className="text-sm font-semibold text-yellow-900 mb-0.5">
                      This customer has {openCasesForCustomer.length} open case{openCasesForCustomer.length > 1 ? 's' : ''}:&nbsp;
                      {openCasesForCustomer.map(c => (
                        <span key={c.id} className="font-mono">{c.id}</span>
                      )).reduce((acc, el, i) => i === 0 ? [el] : [...acc, ', ', el], [])}
                    </div>
                    <div className="text-xs text-yellow-700">
                      Confirm this is a new issue before opening a duplicate case.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Asset/Product */}
            {form.customerId && (
              <Field label="Asset / Product" hint="Optional. Links case to a specific registered device.">
                <Select value={form.productId} onChange={e => set('productId', e.target.value)}>
                  <option value="">No specific product</option>
                  {customerProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.brand} {p.model} ({p.type}) · Serial: {p.serial}</option>
                  ))}
                </Select>
              </Field>
            )}

            {/* Type + Priority + Channel */}
            <div className="grid grid-cols-3 gap-4">
              <Field label="Case type">
                <Select value={form.type} onChange={e => set('type', e.target.value)}>
                  {CASE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </Select>
              </Field>
              <Field label="Priority">
                <Select value={form.priority} onChange={e => set('priority', e.target.value)}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </Select>
              </Field>
              <Field label="Contact channel">
                <Select value={form.channel} onChange={e => set('channel', e.target.value)}>
                  {CHANNELS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </Select>
              </Field>
            </div>

            {/* Title */}
            <Field label="Case title" hint="Brief description of the issue. Shown in all case lists.">
              <Input
                required
                placeholder="e.g. AC not cooling after summer shutdown"
                value={form.title}
                onChange={e => set('title', e.target.value)}
              />
            </Field>

            {/* Description */}
            <Field label="Issue description">
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 resize-none"
                rows={4}
                placeholder="Describe what the customer reported, any relevant history, urgency factors..."
                value={form.description}
                onChange={e => set('description', e.target.value)}
              />
            </Field>

            {/* Assignment */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Assign to technician" hint="Optional. Can be assigned from Dispatch after case creation.">
                <Select value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
                  <option value="">Unassigned</option>
                  {TECHNICIANS.filter(t => t.status === 'available').map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.skills.slice(0, 2).join(', ')}) · {t.status}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Service centre">
                <Select value={form.centerId} onChange={e => set('centerId', e.target.value)}>
                  <option value="">Auto-select by pincode</option>
                  {SERVICE_CENTERS.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                  ))}
                </Select>
              </Field>
            </div>

            {/* SLA notice */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <strong>SLA clock starts on save.</strong> Default SLA for this type and priority:&nbsp;
              {form.type === 'installation' && form.priority === 'high' ? '48 hours' :
               form.type === 'repair' && form.priority === 'high' ? '48 hours' :
               form.priority === 'medium' ? '72 hours' : '96 hours'}.
              Assign a technician to begin scheduling.
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link href="/ops/cases" className="text-sm text-gray-500 hover:text-gray-800">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!form.customerId || !form.title}
                className="px-6 py-2.5 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Open case
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
