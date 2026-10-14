/**
 * Simulated live engineer load — in production this would be a backend API call.
 * Represents current job queue and capacity per area / job type.
 */

export const ENGINEER_POOL = [
  // Mumbai
  { id: 'E001', name: 'Arjun Mehta',   area: 'Andheri East',      pinPrefix: '400', activeJob: 'Refrigerator Cleaning', eta: 12, status: 'on-job',  rating: 4.9, jobs: 521, skills: ['Refrigerator','AC','Washing Machine'] },
  { id: 'E002', name: 'Rahul Sharma',  area: 'Lokhandwala',        pinPrefix: '400', activeJob: 'Split AC Jet Service',  eta: 18, status: 'on-job',  rating: 4.8, jobs: 312, skills: ['AC','Window AC','Cassette AC'] },
  { id: 'E003', name: 'Vikram Patel',  area: 'Malad West',         pinPrefix: '400', activeJob: null,                   eta: null, status: 'available', rating: 4.6, jobs: 198, skills: ['LED TV','Home Theatre','Set-top Box'] },
  { id: 'E004', name: 'Suresh Kumar',  area: 'Borivali',           pinPrefix: '400', activeJob: 'WM Installation',     eta: 35, status: 'on-job',  rating: 4.7, jobs: 445, skills: ['Washing Machine','Dishwasher'] },
  { id: 'E005', name: 'Deepak Yadav', area: 'Thane West',          pinPrefix: '400', activeJob: null,                   eta: null, status: 'available', rating: 4.5, jobs: 267, skills: ['AC','Refrigerator'] },
  { id: 'E006', name: 'Manoj Tiwari', area: 'Powai',               pinPrefix: '400', activeJob: 'AC Installation',      eta: 55, status: 'on-job',  rating: 4.8, jobs: 389, skills: ['AC','Microwave','Dishwasher'] },
  { id: 'E007', name: 'Rohan Nair',   area: 'Navi Mumbai',         pinPrefix: '400', activeJob: null,                   eta: null, status: 'available', rating: 4.9, jobs: 603, skills: ['Refrigerator','AC','LED TV'] },
  // Delhi NCR
  { id: 'E008', name: 'Amit Kapoor',  area: 'Rohini',              pinPrefix: '110', activeJob: 'Geyser Installation',  eta: 20, status: 'on-job',  rating: 4.7, jobs: 284, skills: ['Geyser','Microwave'] },
  { id: 'E009', name: 'Sanjay Gupta', area: 'Gurugram Sector 14',  pinPrefix: '122', activeJob: null,                   eta: null, status: 'available', rating: 4.6, jobs: 312, skills: ['AC','Washing Machine'] },
  { id: 'E010', name: 'Pradeep Singh',area: 'Noida Sector 3',      pinPrefix: '201', activeJob: 'LED TV Cleaning',      eta: 40, status: 'on-job',  rating: 4.5, jobs: 176, skills: ['LED TV','Set-top Box'] },
  // Bangalore
  { id: 'E011', name: 'Kiran Rao',    area: 'HSR Layout',          pinPrefix: '560', activeJob: null,                   eta: null, status: 'available', rating: 4.8, jobs: 512, skills: ['AC','Refrigerator','Washing Machine'] },
  { id: 'E012', name: 'Naveen Kumar', area: 'Indiranagar',         pinPrefix: '560', activeJob: 'AC Jet Service',       eta: 28, status: 'on-job',  rating: 4.7, jobs: 341, skills: ['AC','Window AC'] },
  { id: 'E013', name: 'Prasad Hegde', area: 'Whitefield',          pinPrefix: '560', activeJob: null,                   eta: null, status: 'offline', rating: 4.4, jobs: 201, skills: ['Washing Machine','Dryer'] },
  // Chennai
  { id: 'E014', name: 'Ravi Krishnan',area: 'Anna Nagar',          pinPrefix: '600', activeJob: 'Refrigerator Repair',  eta: 15, status: 'on-job',  rating: 4.9, jobs: 677, skills: ['Refrigerator','AC'] },
  { id: 'E015', name: 'Senthil Kumar',area: 'Velachery',           pinPrefix: '600', activeJob: null,                   eta: null, status: 'available', rating: 4.6, jobs: 298, skills: ['Washing Machine','Microwave'] },
  // Hyderabad
  { id: 'E016', name: 'Venkat Rao',   area: 'Banjara Hills',       pinPrefix: '500', activeJob: null,                   eta: null, status: 'available', rating: 4.7, jobs: 432, skills: ['AC','Refrigerator','LED TV'] },
  { id: 'E017', name: 'Krishna Reddy',area: 'Secunderabad',        pinPrefix: '500', activeJob: 'WM Repair',            eta: 50, status: 'on-job',  rating: 4.5, jobs: 188, skills: ['Washing Machine','Dishwasher'] },
]

// Simulate job queue load by pin prefix
export const AREA_LOAD = {
  '400': { queued: 14, capacity: 20, engineers: 7, avgEta: 32 },
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
  const prefix = pincode.slice(0, 3)
  return AREA_LOAD[prefix] || null
}

export function getEngineersForPin(pincode) {
  if (!pincode) return []
  const prefix = pincode.slice(0, 3)
  return ENGINEER_POOL.filter(e => e.pinPrefix === prefix)
}

export function getCapacityStatus(pincode) {
  const load = getAreaLoad(pincode)
  if (!load) return null
  const pct = load.queued / load.capacity
  if (pct < 0.5)  return { label: 'High availability',  color: 'green',  pct }
  if (pct < 0.8)  return { label: 'Moderate load',      color: 'amber',  pct }
  return           { label: 'Near capacity',             color: 'red',    pct }
}
