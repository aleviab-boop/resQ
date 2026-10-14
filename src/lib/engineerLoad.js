/**
 * Engineer load — builds from TECHNICIANS in platformData so both
 * Engineer Ops and Dispatch read the same canonical records.
 * National engineers (non-Mumbai) are appended for city-level reporting.
 */
import { TECHNICIANS, SERVICE_CENTERS } from './platformData'

// Map platformData TECHNICIANS → the shape engineer-ops expects
const CENTER_PIN_MAP = {
  SC001: '400',
  SC002: '400',
  SC003: '400',
  SC004: '400',
  SC005: '400',
}

const CENTER_AREA_MAP = {
  SC001: 'Andheri East',
  SC002: 'Navi Mumbai',
  SC003: 'Thane West',
  SC004: 'Borivali',
  SC005: 'Powai',
}

const NATIONAL_ENGINEERS = [
  { id: 'E008', name: 'Amit Kapoor',   area: 'Rohini',             pinPrefix: '110', activeJob: 'Geyser Installation', eta: 20,   status: 'on-job',   rating: 4.7, jobs: 284, skills: ['Geyser', 'Microwave'] },
  { id: 'E009', name: 'Sanjay Gupta',  area: 'Gurugram Sector 14', pinPrefix: '122', activeJob: null,                  eta: null, status: 'available', rating: 4.6, jobs: 312, skills: ['AC', 'Washing Machine'] },
  { id: 'E010', name: 'Pradeep Singh', area: 'Noida Sector 3',     pinPrefix: '201', activeJob: 'LED TV Cleaning',     eta: 40,   status: 'on-job',   rating: 4.5, jobs: 176, skills: ['LED TV', 'Set-top Box'] },
  { id: 'E011', name: 'Kiran Rao',     area: 'HSR Layout',         pinPrefix: '560', activeJob: null,                  eta: null, status: 'available', rating: 4.8, jobs: 512, skills: ['AC', 'Refrigerator', 'Washing Machine'] },
  { id: 'E012', name: 'Naveen Kumar',  area: 'Indiranagar',        pinPrefix: '560', activeJob: 'AC Jet Service',      eta: 28,   status: 'on-job',   rating: 4.7, jobs: 341, skills: ['AC', 'Window AC'] },
  { id: 'E013', name: 'Prasad Hegde',  area: 'Whitefield',         pinPrefix: '560', activeJob: null,                  eta: null, status: 'offline',  rating: 4.4, jobs: 201, skills: ['Washing Machine', 'Dryer'] },
  { id: 'E014', name: 'Ravi Krishnan', area: 'Anna Nagar',         pinPrefix: '600', activeJob: 'Refrigerator Repair', eta: 15,   status: 'on-job',   rating: 4.9, jobs: 677, skills: ['Refrigerator', 'AC'] },
  { id: 'E015', name: 'Senthil Kumar', area: 'Velachery',          pinPrefix: '600', activeJob: null,                  eta: null, status: 'available', rating: 4.6, jobs: 298, skills: ['Washing Machine', 'Microwave'] },
  { id: 'E016', name: 'Venkat Rao',    area: 'Banjara Hills',      pinPrefix: '500', activeJob: null,                  eta: null, status: 'available', rating: 4.7, jobs: 432, skills: ['AC', 'Refrigerator', 'LED TV'] },
  { id: 'E017', name: 'Krishna Reddy', area: 'Secunderabad',       pinPrefix: '500', activeJob: 'WM Repair',           eta: 50,   status: 'on-job',   rating: 4.5, jobs: 188, skills: ['Washing Machine', 'Dishwasher'] },
]

// Canonical pool: Mumbai technicians from platformData + national engineers
export const ENGINEER_POOL = [
  ...TECHNICIANS.map(t => ({
    id: t.id,
    name: t.name,
    area: CENTER_AREA_MAP[t.centerId] || t.centerId,
    pinPrefix: CENTER_PIN_MAP[t.centerId] || '400',
    activeJob: t.activeJobId,
    eta: null,
    status: t.status,
    rating: t.rating,
    jobs: t.jobs,
    skills: t.skills,
    // Preserve extra fields for engineer-ops detail view
    phone: t.phone,
    shift: t.shift,
    badge: t.badge,
    exp: t.exp,
    centerId: t.centerId,
  })),
  ...NATIONAL_ENGINEERS,
]

export const AREA_LOAD = {
  '400': { queued: 14, capacity: 20, engineers: TECHNICIANS.length, avgEta: 32 },
  '110': { queued: 6,  capacity: 12, engineers: 3, avgEta: 25 },
  '122': { queued: 3,  capacity: 8,  engineers: 2, avgEta: 20 },
  '201': { queued: 4,  capacity: 8,  engineers: 2, avgEta: 35 },
  '560': { queued: 8,  capacity: 14, engineers: 4, avgEta: 28 },
  '600': { queued: 5,  capacity: 10, engineers: 3, avgEta: 22 },
  '500': { queued: 6,  capacity: 10, engineers: 3, avgEta: 40 },
  '380': { queued: 4,  capacity: 8,  engineers: 2, avgEta: 30 },
  '411': { queued: 7,  capacity: 10, engineers: 3, avgEta: 35 },
}

export function getAreaLoad(pincode) {
  if (!pincode) return null
  const prefix = String(pincode).slice(0, 3)
  return AREA_LOAD[prefix] || null
}

export function getEngineersForPin(pincode) {
  if (!pincode) return []
  const prefix = String(pincode).slice(0, 3)
  return ENGINEER_POOL.filter(e => e.pinPrefix === prefix)
}

export function getCapacityStatus(pincode) {
  const load = getAreaLoad(pincode)
  if (!load) return null
  const pct = load.queued / load.capacity
  if (pct < 0.5) return { label: 'High availability', color: 'green', pct }
  if (pct < 0.8) return { label: 'Moderate load',     color: 'amber', pct }
  return               { label: 'Near capacity',       color: 'red',   pct }
}
