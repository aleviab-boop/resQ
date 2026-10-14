/**
 * resQ Platform — Lightweight localStorage Persistence
 * Provides cross-screen state so actions in one view (dispatch, case detail)
 * are reflected when navigating to another (case detail, tracking).
 *
 * All functions are SSR-safe: they return null/default when window is undefined.
 * All keys use the 'resq_ops_' prefix to avoid collisions.
 */

const PREFIX = 'resq_ops_'

function isClient() {
  return typeof window !== 'undefined'
}

function read(key) {
  if (!isClient()) return null
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function write(key, value) {
  if (!isClient()) return
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

// ─── CASE STATUS OVERRIDES ────────────────────────────────────────────────────

/**
 * Save an agent-initiated status change for a case.
 * @param {string} caseId
 * @param {string} status
 */
export function setCaseStatus(caseId, status) {
  const overrides = read('case_status_overrides') || {}
  overrides[caseId] = status
  write('case_status_overrides', overrides)
}

/**
 * Get the override status for a case, or null if none set.
 * @param {string} caseId
 * @returns {string|null}
 */
export function getCaseStatus(caseId) {
  const overrides = read('case_status_overrides') || {}
  return overrides[caseId] ?? null
}

/**
 * Return all case status overrides as { caseId: status }.
 * @returns {Object}
 */
export function getCaseOverrides() {
  return read('case_status_overrides') || {}
}

// ─── SLOT BOOKINGS ────────────────────────────────────────────────────────────

/**
 * Book a slot from the promise engine.
 * @param {{ caseId: string, technicianId: string, date: string, window: string, centerId: string }} slotData
 */
export function bookSlot(slotData) {
  const slots = read('booked_slots') || {}
  slots[slotData.caseId] = { ...slotData, bookedAt: new Date().toISOString() }
  write('booked_slots', slots)
}

/**
 * Get the booked slot for a case, or null.
 * @param {string} caseId
 * @returns {Object|null}
 */
export function getBookedSlot(caseId) {
  const slots = read('booked_slots') || {}
  return slots[caseId] ?? null
}

/**
 * Return all booked slots as { caseId: slotData }.
 * @returns {Object}
 */
export function getAllBookedSlots() {
  return read('booked_slots') || {}
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

/**
 * Append a message to a conversation's local store.
 * @param {string} conversationId
 * @param {{ from: string, text: string, time: string, channel: string, agent: string }} message
 */
export function addMessage(conversationId, message) {
  const all = read('messages') || {}
  const thread = all[conversationId] || []
  thread.push({ id: `local-${Date.now()}`, ...message })
  all[conversationId] = thread
  write('messages', all)
}

/**
 * Get locally-added messages for a conversation.
 * Does NOT include seeded data — merge with conversation.messages on the caller side.
 * @param {string} conversationId
 * @returns {Array}
 */
export function getMessages(conversationId) {
  const all = read('messages') || {}
  return all[conversationId] || []
}

// ─── ASSIGNMENT OVERRIDES ────────────────────────────────────────────────────

/**
 * Save a technician assignment made in the UI.
 * @param {string} caseId
 * @param {string} technicianId
 */
export function setAssignment(caseId, technicianId) {
  const assignments = read('assignments') || {}
  assignments[caseId] = technicianId
  write('assignments', assignments)
}

/**
 * Get the assigned technician ID for a case, or null.
 * @param {string} caseId
 * @returns {string|null}
 */
export function getAssignment(caseId) {
  const assignments = read('assignments') || {}
  return assignments[caseId] ?? null
}

// ─── FRAUD DECISIONS ─────────────────────────────────────────────────────────

/**
 * Save a fraud investigation decision for a flag.
 * @param {string} flagId
 * @param {'cleared'|'confirmed'|'pending'} decision
 */
export function setFraudDecision(flagId, decision) {
  const decisions = read('fraud_decisions') || {}
  decisions[flagId] = { decision, decidedAt: new Date().toISOString() }
  write('fraud_decisions', decisions)
}

/**
 * Get the fraud decision for a flag, or null.
 * @param {string} flagId
 * @returns {{ decision: string, decidedAt: string }|null}
 */
export function getFraudDecision(flagId) {
  const decisions = read('fraud_decisions') || {}
  return decisions[flagId] ?? null
}

// ─── GENERAL KEY-VALUE STORE ──────────────────────────────────────────────────

/**
 * Store an arbitrary value under a namespaced key.
 * @param {string} key
 * @param {*} value
 */
export function setState(key, value) {
  write(`kv_${key}`, value)
}

/**
 * Read an arbitrary value; returns defaultValue if not set.
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
export function getState(key, defaultValue = null) {
  const val = read(`kv_${key}`)
  return val !== null ? val : defaultValue
}
