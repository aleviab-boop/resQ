/**
 * Pincode SLA Promise — combines static tier rules with live area load.
 */
import { getAreaLoad, getCapacityStatus } from './engineerLoad'

const SAME_DAY = ['400','110','560','500','600','700','411','380','302','201','122']
const NEXT_DAY = ['440','226','641','160','248','462','492','751','390','364','395','144','141','143','180']

export function getSLAPromise(pincode) {
  if (!pincode) return null
  const prefix3 = pincode.slice(0, 3)
  const cap = getCapacityStatus(pincode)

  if (cap?.color === 'red') {
    return { label: 'Available tomorrow', color: 'blue', icon: '📅', load: cap }
  }

  if (SAME_DAY.some(p => prefix3.startsWith(p))) {
    const hour = new Date().getHours()
    if (hour < 14) return { label: 'Available today', color: 'green', icon: '⚡', load: cap }
    return { label: 'Available tomorrow', color: 'blue', icon: '📅', load: cap }
  }

  if (NEXT_DAY.some(p => prefix3.startsWith(p))) {
    return { label: 'Available tomorrow', color: 'blue', icon: '📅', load: cap }
  }

  return { label: 'Available in 2 days', color: 'gray', icon: '🗓️', load: cap }
}

export function getSLAFromPincode(pincode) {
  if (!pincode || !/^\d{6}$/.test(pincode)) return null
  const prefix3 = pincode.slice(0, 3)
  const cap = getCapacityStatus(pincode)
  const load = getAreaLoad(pincode)

  if (cap?.color === 'red') {
    return {
      label: 'High demand — Next slot: Tomorrow',
      sublabel: `${load?.queued ?? '?'} jobs queued · engineers at capacity`,
      color: 'amber', urgent: false, load: cap,
    }
  }

  if (SAME_DAY.includes(prefix3)) {
    const hour = new Date().getHours()
    return hour < 14
      ? { label: 'Service available today',  sublabel: 'Book before 2 PM for same-day slot', color: 'green', urgent: true,  load: cap }
      : { label: 'Next slot: Tomorrow',      sublabel: 'Earliest available: 9 AM tomorrow',  color: 'blue',  urgent: false, load: cap }
  }

  if (NEXT_DAY.includes(prefix3)) {
    return { label: 'Next slot: Tomorrow', sublabel: 'Morning and afternoon slots available', color: 'blue', urgent: false, load: cap }
  }

  return { label: 'Slots in 2 days', sublabel: "We're expanding — slots filling fast", color: 'gray', urgent: false, load: cap }
}
