/**
 * Pincode SLA Promise (FY26 Q1 Roadmap Feature)
 * Shows "Available today / tomorrow / in 2 days" based on pincode tier
 */

// Major metros — same-day slots available
const SAME_DAY = ['400', '110', '560', '500', '600', '700', '411', '380', '302', '201', '122']
// Tier-2 cities — next day
const NEXT_DAY = ['440', '226', '641', '160', '248', '462', '492', '751', '390', '364', '395', '144', '141', '143', '180']

export function getSLAPromise(pincode) {
  if (!pincode) return null
  const prefix3 = pincode.slice(0, 3)
  const prefix2 = pincode.slice(0, 2)

  if (SAME_DAY.some(p => prefix3.startsWith(p) || prefix2 === p.slice(0, 2) && SAME_DAY.includes(prefix3))) {
    // Check if before 2PM (slots still open)
    const hour = new Date().getHours()
    if (hour < 14) {
      return { label: 'Available today', color: 'green', icon: '⚡' }
    } else {
      return { label: 'Available tomorrow', color: 'blue', icon: '📅' }
    }
  }

  if (NEXT_DAY.some(p => prefix3.startsWith(p))) {
    return { label: 'Available tomorrow', color: 'blue', icon: '📅' }
  }

  return { label: 'Available in 2 days', color: 'gray', icon: '🗓️' }
}

export function getSLAFromPincode(pincode) {
  if (!pincode || !/^\d{6}$/.test(pincode)) return null
  const prefix3 = pincode.slice(0, 3)

  if (SAME_DAY.includes(prefix3)) {
    const hour = new Date().getHours()
    return hour < 14
      ? { label: 'Service available today', sublabel: 'Book before 2 PM for same-day slot', color: 'green', urgent: true }
      : { label: 'Next slot: Tomorrow', sublabel: 'Earliest available: 9 AM tomorrow', color: 'blue', urgent: false }
  }

  if (NEXT_DAY.includes(prefix3)) {
    return { label: 'Next slot: Tomorrow', sublabel: 'Morning and afternoon slots available', color: 'blue', urgent: false }
  }

  return { label: 'Slots in 2 days', sublabel: 'We\'re expanding — slots filling fast', color: 'gray', urgent: false }
}
