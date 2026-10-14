/**
 * resQ Platform — Shared Data Model
 * Single source of truth for all ops modules.
 * All entities are cross-linked by ID. Changes in one entity
 * are reflected across every workspace that reads this data.
 *
 * NOTE: This is a realistic simulation layer.
 * In production, this would be replaced by API calls.
 */

// ─── CUSTOMERS ──────────────────────────────────────────────────────────────
export const CUSTOMERS = [
  {
    id: 'C001', name: 'Priya Mehta', phone: '+91 98201 44321', email: 'priya.mehta@gmail.com',
    address: '12, Sunrise Residency, Lokhandwala Complex', city: 'Mumbai', state: 'Maharashtra', pincode: '400053',
    since: '2022-03-10', tier: 'Gold', totalSpend: 14200, nps: 9, carePlan: true,
    tags: ['repeat-customer', 'high-value'],
  },
  {
    id: 'C002', name: 'Ramesh Iyer', phone: '+91 98765 11223', email: 'r.iyer@outlook.com',
    address: '4B, Sea View Towers, Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050',
    since: '2023-07-22', tier: 'Silver', totalSpend: 6800, nps: 6, carePlan: false,
    tags: ['new-installation'],
  },
  {
    id: 'C003', name: 'Anita Sharma', phone: '+91 99887 76655', email: 'anita.sharma@hotmail.com',
    address: 'B-204, Green Park Society, Thane West', city: 'Thane', state: 'Maharashtra', pincode: '400601',
    since: '2021-11-05', tier: 'Platinum', totalSpend: 31500, nps: 8, carePlan: true,
    tags: ['repeat-customer', 'corporate', 'multi-device'],
  },
  {
    id: 'C004', name: 'Vikram Nair', phone: '+91 87654 32100', email: 'vikram.nair@gmail.com',
    address: '22, Palm Grove, Powai', city: 'Mumbai', state: 'Maharashtra', pincode: '400076',
    since: '2024-01-18', tier: 'Bronze', totalSpend: 1899, nps: null, carePlan: false,
    tags: ['first-time'],
  },
  {
    id: 'C005', name: 'Sunita Patel', phone: '+91 91234 56789', email: 'sunita.p@yahoo.com',
    address: '7, Navneet Colony, Borivali East', city: 'Mumbai', state: 'Maharashtra', pincode: '400066',
    since: '2022-08-30', tier: 'Silver', totalSpend: 9350, nps: 7, carePlan: true,
    tags: ['care-plan', 'repeat-customer'],
  },
  {
    id: 'C006', name: 'Deepak Joshi', phone: '+91 98100 23456', email: 'deepak.joshi@gmail.com',
    address: 'Plot 18, Sector 7, Navi Mumbai', city: 'Navi Mumbai', state: 'Maharashtra', pincode: '400703',
    since: '2023-02-14', tier: 'Silver', totalSpend: 7200, nps: 5, carePlan: false,
    tags: ['at-risk', 'pending-recovery'],
  },
]

// ─── PRODUCTS / ASSETS ───────────────────────────────────────────────────────
export const PRODUCTS = [
  { id: 'P001', customerId: 'C001', orderId: 'ORD001', brand: 'Daikin', model: 'FTKF35TV', type: 'Air Conditioner', serial: 'DK-AC-2022-00193', purchaseDate: '2022-03-15', warrantyExpiry: '2024-03-15', installDate: '2022-03-18', status: 'active' },
  { id: 'P002', customerId: 'C001', orderId: 'ORD002', brand: 'LG', model: 'GL-T292RPZU', type: 'Refrigerator', serial: 'LG-RF-2023-88210', purchaseDate: '2023-06-10', warrantyExpiry: '2026-06-10', installDate: '2023-06-12', status: 'active' },
  { id: 'P003', customerId: 'C002', orderId: 'ORD003', brand: 'Samsung', model: 'AR18TYHYCWK', type: 'Air Conditioner', serial: 'SAM-AC-2024-55491', purchaseDate: '2024-05-20', warrantyExpiry: '2027-05-20', installDate: '2024-05-22', status: 'pending-installation' },
  { id: 'P004', customerId: 'C003', orderId: 'ORD004', brand: 'Bosch', model: 'WAJ2846SIN', type: 'Washing Machine', serial: 'BSH-WM-2021-22019', purchaseDate: '2021-11-10', warrantyExpiry: '2023-11-10', installDate: '2021-11-12', status: 'active' },
  { id: 'P005', customerId: 'C003', orderId: 'ORD005', brand: 'Voltas', model: '185V DZW', type: 'Air Conditioner', serial: 'VLT-AC-2022-77341', purchaseDate: '2022-04-01', warrantyExpiry: '2024-04-01', installDate: '2022-04-03', status: 'active' },
  { id: 'P006', customerId: 'C004', orderId: 'ORD006', brand: 'Sony', model: 'KD-55X75L', type: 'LED TV', serial: 'SNY-TV-2024-01882', purchaseDate: '2024-01-20', warrantyExpiry: '2026-01-20', installDate: null, status: 'pending-installation' },
  { id: 'P007', customerId: 'C005', orderId: 'ORD007', brand: 'Whirlpool', model: 'MAGICOOL 1.5T', type: 'Air Conditioner', serial: 'WHP-AC-2022-33901', purchaseDate: '2022-09-05', warrantyExpiry: '2024-09-05', installDate: '2022-09-07', status: 'active' },
  { id: 'P008', customerId: 'C006', orderId: 'ORD008', brand: 'Godrej', model: 'RB 310 EWI', type: 'Refrigerator', serial: 'GDJ-RF-2023-18822', purchaseDate: '2023-02-18', warrantyExpiry: '2024-02-18', installDate: '2023-02-20', status: 'active' },
]

// ─── ORDERS ──────────────────────────────────────────────────────────────────
export const ORDERS = [
  { id: 'ORD001', customerId: 'C001', productId: 'P001', date: '2022-03-13', amount: 42000, status: 'completed', deliveryDate: '2022-03-15', installDate: '2022-03-18', deliveryPartner: 'Reliance Logistics', channel: 'online' },
  { id: 'ORD002', customerId: 'C001', productId: 'P002', date: '2023-06-08', amount: 58000, status: 'completed', deliveryDate: '2023-06-10', installDate: '2023-06-12', deliveryPartner: 'Reliance Logistics', channel: 'store' },
  { id: 'ORD003', customerId: 'C002', productId: 'P003', date: '2024-05-18', amount: 36999, status: 'delivered-pending-install', deliveryDate: '2024-05-20', installDate: null, deliveryPartner: 'Delhivery', channel: 'online' },
  { id: 'ORD004', customerId: 'C003', productId: 'P004', date: '2021-11-08', amount: 62000, status: 'completed', deliveryDate: '2021-11-10', installDate: '2021-11-12', deliveryPartner: 'Reliance Logistics', channel: 'store' },
  { id: 'ORD005', customerId: 'C003', productId: 'P005', date: '2022-03-30', amount: 32000, status: 'completed', deliveryDate: '2022-04-01', installDate: '2022-04-03', deliveryPartner: 'Reliance Logistics', channel: 'online' },
  { id: 'ORD006', customerId: 'C004', productId: 'P006', date: '2024-01-18', amount: 89000, status: 'delivered-pending-install', deliveryDate: '2024-01-20', installDate: null, deliveryPartner: 'Xpressbees', channel: 'online' },
  { id: 'ORD007', customerId: 'C005', productId: 'P007', date: '2022-09-03', amount: 34000, status: 'completed', deliveryDate: '2022-09-05', installDate: '2022-09-07', deliveryPartner: 'Reliance Logistics', channel: 'store' },
  { id: 'ORD008', customerId: 'C006', productId: 'P008', date: '2023-02-16', amount: 28000, status: 'completed', deliveryDate: '2023-02-18', installDate: '2023-02-20', deliveryPartner: 'Delhivery', channel: 'online' },
]

// ─── SERVICE CENTERS ─────────────────────────────────────────────────────────
export const SERVICE_CENTERS = [
  { id: 'SC001', name: 'resQ Andheri', city: 'Mumbai', address: 'Times Square, Andheri East, Mumbai 400059', pincodes: ['400053','400059','400069','400093'], manager: 'Vijay Kulkarni', capacity: 20, activeEngineers: 7, phone: '18002670999' },
  { id: 'SC002', name: 'resQ Navi Mumbai', city: 'Navi Mumbai', address: 'RCP 5, Thane Belapur Road, Navi Mumbai 400701', pincodes: ['400701','400703','400706','400614'], manager: 'Rekha Desai', capacity: 12, activeEngineers: 5, phone: '18002670999' },
  { id: 'SC003', name: 'resQ Thane', city: 'Thane', address: 'Vikas Palms, Dr. Ambedkar Road, Thane West 400601', pincodes: ['400601','400602','400606','400615'], manager: 'Suresh Patil', capacity: 8, activeEngineers: 3, phone: '18002670999' },
  { id: 'SC004', name: 'resQ Borivali', city: 'Mumbai', address: 'Shiv Shankar CHS, Western Express Highway, Borivali East 400066', pincodes: ['400066','400067','400068','400063'], manager: 'Pradeep Kadam', capacity: 10, activeEngineers: 4, phone: '18002670999' },
  { id: 'SC005', name: 'resQ Powai', city: 'Mumbai', address: 'Hiranandani Business Park, Powai, Mumbai 400076', pincodes: ['400076','400072','400087','400097'], manager: 'Meena Joshi', capacity: 8, activeEngineers: 3, phone: '18002670999' },
]

// ─── TECHNICIANS ─────────────────────────────────────────────────────────────
export const TECHNICIANS = [
  { id: 'T001', name: 'Rahul Sharma',  phone: '+91 98200 11223', centerId: 'SC001', skills: ['AC','Window AC','Cassette AC'],        rating: 4.9, jobs: 1243, exp: '6 yrs', status: 'on-job',   shift: '09:00–18:00', lat: 19.1136, lng: 72.8697, activeJobId: 'JB003', badge: 'Top Rated' },
  { id: 'T002', name: 'Arjun Mehta',   phone: '+91 98200 77889', centerId: 'SC001', skills: ['Refrigerator','AC','WM'],              rating: 4.8, jobs: 521,  exp: '4 yrs', status: 'available', shift: '09:00–18:00', lat: 19.1189, lng: 72.8460, activeJobId: null,    badge: 'Expert' },
  { id: 'T003', name: 'Vikram Patel',  phone: '+91 98200 33445', centerId: 'SC001', skills: ['LED TV','Home Theatre','Set-top Box'], rating: 4.6, jobs: 198,  exp: '3 yrs', status: 'on-job',   shift: '10:00–19:00', lat: 19.0596, lng: 72.8295, activeJobId: 'JB005', badge: 'Verified' },
  { id: 'T004', name: 'Suresh Kumar',  phone: '+91 98200 55667', centerId: 'SC004', skills: ['Washing Machine','Dishwasher','Dryer'], rating: 4.7, jobs: 445,  exp: '5 yrs', status: 'available', shift: '09:00–18:00', lat: 19.2307, lng: 72.8567, activeJobId: null,    badge: 'Pro' },
  { id: 'T005', name: 'Rohan Nair',    phone: '+91 98200 99001', centerId: 'SC002', skills: ['Refrigerator','AC','LED TV'],          rating: 4.9, jobs: 603,  exp: '7 yrs', status: 'available', shift: '08:00–17:00', lat: 19.0330, lng: 73.0297, activeJobId: null,    badge: 'Top Rated' },
  { id: 'T006', name: 'Manoj Tiwari', phone: '+91 98200 44312', centerId: 'SC005', skills: ['AC','Microwave','Dishwasher'],         rating: 4.8, jobs: 389,  exp: '5 yrs', status: 'on-job',   shift: '09:00–18:00', lat: 19.1197, lng: 72.9051, activeJobId: 'JB001', badge: 'Expert' },
  { id: 'T007', name: 'Deepak Yadav', phone: '+91 98200 21098', centerId: 'SC003', skills: ['AC','Refrigerator'],                   rating: 4.5, jobs: 267,  exp: '3 yrs', status: 'offline',   shift: '10:00–19:00', lat: null,    lng: null,    activeJobId: null,    badge: 'Verified' },
  { id: 'T008', name: 'Anil Kumar',   phone: '+91 98200 67834', centerId: 'SC001', skills: ['LED TV','Electronics'],                rating: 4.7, jobs: 312,  exp: '4 yrs', status: 'available', shift: '09:00–18:00', lat: 19.1037, lng: 72.8678, activeJobId: null,    badge: 'Verified' },
]

// ─── CASES ────────────────────────────────────────────────────────────────────
export const CASES = [
  {
    id: 'CS001', customerId: 'C002', productId: 'P003', orderId: 'ORD003',
    type: 'installation', title: 'Samsung AC Installation — delivered 20 May, not yet installed',
    status: 'open', priority: 'high', channel: 'whatsapp',
    slaHours: 48, slaDeadline: '2024-05-22T18:00:00', slaBreached: true,
    createdAt: '2024-05-20T10:15:00', updatedAt: '2024-10-12T09:30:00',
    assignedTo: 'T005', centerId: 'SC002',
    description: 'Customer purchased Samsung 1.5T AC online. Delivered on 20 May. Installation has been pending for 5 months. Customer has called 3 times.',
    tags: ['sla-breach', 'installation-pending', 'repeat-contact'],
  },
  {
    id: 'CS002', customerId: 'C001', productId: 'P001', orderId: 'ORD001',
    type: 'repair', title: 'Daikin AC not cooling — warranty expired',
    status: 'in-progress', priority: 'medium', channel: 'app',
    slaHours: 72, slaDeadline: '2026-10-16T12:00:00', slaBreached: false,
    createdAt: '2026-10-13T14:00:00', updatedAt: '2026-10-14T09:00:00',
    assignedTo: 'T001', centerId: 'SC001',
    description: 'AC not cooling effectively. Warranty expired March 2024. Out-of-warranty repair case. Quote approval pending.',
    tags: ['out-of-warranty', 'quote-pending'],
  },
  {
    id: 'CS003', customerId: 'C003', productId: 'P004', orderId: 'ORD004',
    type: 'service', title: 'Bosch WM drum noise during spin cycle',
    status: 'parts-awaited', priority: 'medium', channel: 'phone',
    slaHours: 72, slaDeadline: '2026-10-15T10:00:00', slaBreached: false,
    createdAt: '2026-10-11T11:00:00', updatedAt: '2026-10-13T16:00:00',
    assignedTo: 'T004', centerId: 'SC004',
    description: 'Washing machine making grinding noise during spin. First visit completed 13 Oct — diagnosis: drum bearing failure. Part ordered.',
    tags: ['parts-ordered', 'revisit-scheduled'],
  },
  {
    id: 'CS004', customerId: 'C004', productId: 'P006', orderId: 'ORD006',
    type: 'installation', title: 'Sony 55" TV delivered — wall mount installation pending',
    status: 'scheduled', priority: 'low', channel: 'email',
    slaHours: 96, slaDeadline: '2026-10-18T17:00:00', slaBreached: false,
    createdAt: '2026-10-12T09:00:00', updatedAt: '2026-10-14T08:00:00',
    assignedTo: 'T003', centerId: 'SC005',
    description: 'Sony 55" 4K TV delivered. Customer requesting wall-mount installation with cable management. Slot booked for 17 Oct.',
    tags: ['scheduled'],
  },
  {
    id: 'CS005', customerId: 'C006', productId: 'P008', orderId: 'ORD008',
    type: 'repair', title: 'Godrej refrigerator not maintaining temperature',
    status: 'resolved', priority: 'high', channel: 'whatsapp',
    slaHours: 48, slaDeadline: '2026-10-08T12:00:00', slaBreached: false,
    createdAt: '2026-10-06T08:30:00', updatedAt: '2026-10-09T14:00:00',
    assignedTo: 'T002', centerId: 'SC001',
    description: 'Fridge temperature not stable — compressor replaced. Resolved 9 Oct. Customer rated 3/5.',
    tags: ['resolved', 'low-nps', 'recovery-triggered'],
  },
  {
    id: 'CS006', customerId: 'C006', productId: 'P008', orderId: 'ORD008',
    type: 'recovery', title: 'Service recovery — Deepak Joshi rated 3/5 after compressor repair',
    status: 'open', priority: 'high', channel: 'internal',
    slaHours: 24, slaDeadline: '2026-10-10T12:00:00', slaBreached: true,
    createdAt: '2026-10-09T14:05:00', updatedAt: '2026-10-14T08:00:00',
    assignedTo: 'T002', centerId: 'SC001',
    description: 'Auto-triggered recovery case. Customer dissatisfied — "technician was late and rushed the job". Assigned to senior for callback.',
    tags: ['recovery', 'sla-breach', 'callback-pending'],
  },
  {
    id: 'CS007', customerId: 'C001', productId: 'P001', orderId: 'ORD001',
    type: 'maintenance', title: 'Annual AC Jet Service — care plan',
    status: 'completed', priority: 'low', channel: 'app',
    slaHours: 120, slaDeadline: '2026-08-15T18:00:00', slaBreached: false,
    createdAt: '2026-08-10T09:00:00', updatedAt: '2026-08-12T16:00:00',
    assignedTo: 'T001', centerId: 'SC001',
    description: 'Annual care plan service completed. Jet wash, coil clean, drain tray service. Rated 9/10.',
    tags: ['care-plan', 'completed'],
  },
  {
    id: 'CS008', customerId: 'C005', productId: 'P007', orderId: 'ORD007',
    type: 'repair', title: 'Whirlpool AC remote not working + weak airflow',
    status: 'in-progress', priority: 'medium', channel: 'phone',
    slaHours: 72, slaDeadline: '2026-10-16T10:00:00', slaBreached: false,
    createdAt: '2026-10-13T10:00:00', updatedAt: '2026-10-14T09:00:00',
    assignedTo: 'T001', centerId: 'SC001',
    description: 'Remote stopped working. Airflow reduced. Possible filter clog and PCB issue.',
    tags: ['in-progress'],
  },
]

// ─── TICKETS (sub-tasks within a case) ───────────────────────────────────────
export const TICKETS = [
  { id: 'TK001', caseId: 'CS001', title: 'Customer identity verification', type: 'verification', status: 'done', owner: 'Agent Console', team: 'CX', createdAt: '2024-05-20T10:20:00' },
  { id: 'TK002', caseId: 'CS001', title: 'Schedule installation slot', type: 'scheduling', status: 'open', owner: 'Dispatch', team: 'OPS', createdAt: '2024-05-20T10:25:00' },
  { id: 'TK003', caseId: 'CS001', title: 'Confirm accessories available (stabilizer, piping)', type: 'parts-check', status: 'open', owner: 'Parts', team: 'OPS', createdAt: '2024-05-20T10:30:00' },
  { id: 'TK004', caseId: 'CS002', title: 'Diagnose AC cooling failure', type: 'diagnosis', status: 'done', owner: 'T001', team: 'FIELD', createdAt: '2026-10-13T14:10:00' },
  { id: 'TK005', caseId: 'CS002', title: 'Generate repair quote — out of warranty', type: 'quote', status: 'pending-approval', owner: 'Agent Console', team: 'CX', createdAt: '2026-10-13T16:00:00' },
  { id: 'TK006', caseId: 'CS003', title: 'Diagnose drum noise', type: 'diagnosis', status: 'done', owner: 'T004', team: 'FIELD', createdAt: '2026-10-11T14:00:00' },
  { id: 'TK007', caseId: 'CS003', title: 'Order drum bearing — SC004', type: 'parts-order', status: 'in-transit', owner: 'Parts', team: 'OPS', createdAt: '2026-10-11T16:00:00' },
  { id: 'TK008', caseId: 'CS003', title: 'Schedule revisit for part installation', type: 'scheduling', status: 'open', owner: 'Dispatch', team: 'OPS', createdAt: '2026-10-13T17:00:00' },
  { id: 'TK009', caseId: 'CS006', title: 'Senior agent callback to Deepak Joshi', type: 'recovery', status: 'open', owner: 'Agent Console', team: 'CX', createdAt: '2026-10-09T14:10:00' },
  { id: 'TK010', caseId: 'CS006', title: 'Goodwill gesture — free next service coupon', type: 'compensation', status: 'pending-approval', owner: 'Manager', team: 'CX', createdAt: '2026-10-09T14:15:00' },
]

// ─── JOBS / VISITS ───────────────────────────────────────────────────────────
export const JOBS = [
  {
    id: 'JB001', caseId: 'CS002', technicianId: 'T006',
    type: 'diagnosis', status: 'completed',
    scheduledDate: '2026-10-13', timeSlot: '10:00–12:00',
    address: '12, Sunrise Residency, Lokhandwala', city: 'Mumbai', pincode: '400053',
    visits: [
      { visitNo: 1, date: '2026-10-13', status: 'completed', techId: 'T006', arrivedAt: '10:24', diagnosis: 'Compressor underperforming — refrigerant leak detected', partsUsed: [], evidence: ['photo_before.jpg', 'gas_pressure_reading.jpg'], customerConfirmed: true, notes: 'Gas refill required. PCB check needed. Follow-up visit needed.' },
    ],
    estimatedDuration: 60, actualDuration: 75, travelEta: 24,
  },
  {
    id: 'JB002', caseId: 'CS002', technicianId: 'T001',
    type: 'repair', status: 'scheduled',
    scheduledDate: '2026-10-15', timeSlot: '14:00–16:00',
    address: '12, Sunrise Residency, Lokhandwala', city: 'Mumbai', pincode: '400053',
    visits: [],
    estimatedDuration: 90, actualDuration: null, travelEta: null,
  },
  {
    id: 'JB003', caseId: 'CS008', technicianId: 'T001',
    type: 'diagnosis+repair', status: 'in-progress',
    scheduledDate: '2026-10-14', timeSlot: '10:00–12:00',
    address: '7, Navneet Colony, Borivali East', city: 'Mumbai', pincode: '400066',
    visits: [
      { visitNo: 1, date: '2026-10-14', status: 'in-progress', techId: 'T001', arrivedAt: '10:18', diagnosis: 'PCB issue suspected + filter completely blocked', partsUsed: ['PCB-WHP-AC-01'], evidence: [], customerConfirmed: false, notes: 'PCB replacement in progress.' },
    ],
    estimatedDuration: 90, actualDuration: null, travelEta: 0,
  },
  {
    id: 'JB004', caseId: 'CS003', technicianId: 'T004',
    type: 'diagnosis', status: 'completed',
    scheduledDate: '2026-10-11', timeSlot: '11:00–13:00',
    address: 'B-204, Green Park Society, Thane West', city: 'Thane', pincode: '400601',
    visits: [
      { visitNo: 1, date: '2026-10-11', status: 'completed', techId: 'T004', arrivedAt: '11:05', diagnosis: 'Drum bearing failure — needs replacement', partsUsed: [], evidence: ['drum_noise_recording.mp4', 'bearing_worn.jpg'], customerConfirmed: true, notes: 'Part ordered. Revisit in 3-5 days.' },
    ],
    estimatedDuration: 60, actualDuration: 55, travelEta: 20,
  },
  {
    id: 'JB005', caseId: 'CS004', technicianId: 'T003',
    type: 'installation', status: 'scheduled',
    scheduledDate: '2026-10-17', timeSlot: '11:00–13:00',
    address: '22, Palm Grove, Powai', city: 'Mumbai', pincode: '400076',
    visits: [],
    estimatedDuration: 90, actualDuration: null, travelEta: null,
  },
]

// ─── CONVERSATIONS (Omnichannel) ─────────────────────────────────────────────
export const CONVERSATIONS = [
  {
    id: 'CV001', customerId: 'C002', caseId: 'CS001', channel: 'whatsapp',
    status: 'open', agent: 'Sneha R.', createdAt: '2024-05-20T10:00:00', updatedAt: '2026-10-14T09:00:00',
    messages: [
      { id: 'm1', from: 'customer', text: 'Hello, I bought a Samsung AC on 18 May. It was delivered on 20th but nobody has come for installation yet. I need this urgently.', time: '2024-05-20T10:00:00', channel: 'whatsapp' },
      { id: 'm2', from: 'agent',    text: 'Hello Ramesh! I can see your order ORD003 for the Samsung 1.5T AC. I apologize for the delay. I am creating a case for you right now and will have a technician assigned within 24 hours.', time: '2024-05-20T10:15:00', channel: 'whatsapp', agent: 'Sneha R.' },
      { id: 'm3', from: 'customer', text: 'It has been 4 months now. Still no installation. I am very frustrated.', time: '2024-09-20T14:30:00', channel: 'whatsapp' },
      { id: 'm4', from: 'agent',    text: 'Ramesh, I sincerely apologize. This is completely unacceptable. I am escalating this to our service manager right now. You will receive a call within 2 hours.', time: '2024-09-20T14:45:00', channel: 'whatsapp', agent: 'Priya A.' },
      { id: 'm5', from: 'customer', text: 'Still nothing. 5 months. What kind of service is this?', time: '2024-10-12T09:00:00', channel: 'whatsapp' },
      { id: 'm6', from: 'system',   text: '⚠️ Auto-escalated: SLA breached by 5+ months. Flagged as Critical.', time: '2024-10-12T09:01:00', channel: 'internal' },
    ],
    templates: ['installation-delay-apology', 'slot-confirmation'],
    internalNote: 'SLA breached severely. Check if engineer shortage in Bandra. Offer goodwill discount on first service.',
  },
  {
    id: 'CV002', customerId: 'C001', caseId: 'CS002', channel: 'app',
    status: 'in-progress', agent: 'Ravi K.', createdAt: '2026-10-13T14:00:00', updatedAt: '2026-10-14T09:00:00',
    messages: [
      { id: 'm1', from: 'customer', text: "My Daikin AC is not cooling at all. It's 40 degrees here. Please send someone today.", time: '2026-10-13T14:00:00', channel: 'app' },
      { id: 'm2', from: 'agent',    text: 'Priya, I can see your Daikin FTKF35TV. The manufacturer warranty expired in March 2024, so this would be an out-of-warranty repair. Our technician will visit today and share a quote. Do you approve?', time: '2026-10-13T14:10:00', channel: 'app', agent: 'Ravi K.' },
      { id: 'm3', from: 'customer', text: 'Yes, please send someone. What are the charges?', time: '2026-10-13T14:12:00', channel: 'app' },
      { id: 'm4', from: 'agent',    text: 'Diagnosis visit is ₹299. If repair is needed, we will send you a detailed quote for your approval before any work begins.', time: '2026-10-13T14:14:00', channel: 'app', agent: 'Ravi K.' },
      { id: 'm5', from: 'system',   text: 'Technician Manoj Tiwari assigned. Visit scheduled 10:00–12:00 today.', time: '2026-10-13T14:20:00', channel: 'internal' },
      { id: 'm6', from: 'agent',    text: 'Manoj Tiwari (⭐ 4.8) is assigned and will reach by 10:00 AM tomorrow. You can track him live on the app.', time: '2026-10-13T14:22:00', channel: 'app', agent: 'Ravi K.' },
    ],
    templates: ['technician-assigned', 'quote-ready'],
    internalNote: 'Quote for gas refill + possible PCB: estimated ₹4,500–₹6,800. Awaiting customer approval.',
  },
  {
    id: 'CV003', customerId: 'C003', caseId: 'CS003', channel: 'phone',
    status: 'parts-awaited', agent: 'Meera S.', createdAt: '2026-10-11T11:00:00', updatedAt: '2026-10-13T16:00:00',
    messages: [
      { id: 'm1', from: 'customer', text: '[Phone call] My Bosch washing machine is making a horrible grinding sound when it spins.', time: '2026-10-11T11:00:00', channel: 'phone' },
      { id: 'm2', from: 'agent',    text: '[Call summary] Anita called re: WM noise. Case raised CS003. Tech Suresh Kumar visiting today 11 AM.', time: '2026-10-11T11:05:00', channel: 'internal', agent: 'Meera S.' },
      { id: 'm3', from: 'agent',    text: 'Anita ji, Suresh Kumar will visit you today at 11 AM for diagnosis. His number is +91 98200 55667.', time: '2026-10-11T11:10:00', channel: 'whatsapp', agent: 'Meera S.' },
      { id: 'm4', from: 'system',   text: 'Visit 1 completed. Diagnosis: drum bearing failure. Part ordered from central warehouse.', time: '2026-10-11T15:00:00', channel: 'internal' },
      { id: 'm5', from: 'agent',    text: 'Anita ji, the technician has identified a drum bearing issue. The part has been ordered and should arrive in 3–5 days. We will call to schedule a revisit once it arrives.', time: '2026-10-11T15:10:00', channel: 'whatsapp', agent: 'Meera S.' },
    ],
    templates: ['parts-delay-update', 'revisit-confirmation'],
    internalNote: 'Part ETA: 16 Oct. Notify Anita when in stock. Book Suresh for revisit same day.',
  },
  {
    id: 'CV004', customerId: 'C006', caseId: 'CS006', channel: 'internal',
    status: 'open', agent: 'Rajiv M.', createdAt: '2026-10-09T14:05:00', updatedAt: '2026-10-14T09:00:00',
    messages: [
      { id: 'm1', from: 'system',   text: 'Auto-recovery triggered: NPS score 3/5 received from Deepak Joshi for CS005 (Godrej refrigerator compressor repair).', time: '2026-10-09T14:05:00', channel: 'internal' },
      { id: 'm2', from: 'agent',    text: '[Internal note] Deepak mentioned technician arrived 90 mins late and was rushed. No explanation given. Recommend callback + service voucher.', time: '2026-10-09T15:00:00', channel: 'internal', agent: 'Rajiv M.' },
      { id: 'm3', from: 'customer', text: '[Email] Subj: Terrible experience. Technician arrived very late. Job felt rushed. Now fridge is slightly noisier than before.', time: '2026-10-10T09:00:00', channel: 'email' },
    ],
    templates: ['recovery-callback', 'apology-voucher'],
    internalNote: 'Goodwill: free next service up to ₹599. Pending manager approval (TK010).',
  },
]

// ─── PARTS INVENTORY (extended) ──────────────────────────────────────────────
// city derived from centerId: SC001/SC004/SC005 = 'Mumbai', SC002 = 'Navi Mumbai', SC003 = 'Thane'
// appliance: full display name matching filter options in parts/page.js
export const PARTS_INVENTORY = [
  { id: 'PT001', name: 'PCB Controller Board — Samsung AC',  sku: 'PCB-SAMS-AC-01', category: 'AC',            appliance: 'Air Conditioner', centerId: 'SC001', city: 'Mumbai',     stock: 8,  reserved: 0, reorderAt: 5,  demand: 12, price: 2400, ageMonths: 18, condition: 'Good' },
  { id: 'PT002', name: 'Compressor — LG 1.5T',               sku: 'CMP-LG-15T-01',  category: 'AC',            appliance: 'Air Conditioner', centerId: 'SC001', city: 'Mumbai',     stock: 2,  reserved: 1, reorderAt: 3,  demand: 4,  price: 8500, ageMonths: 6,  condition: 'Good' },
  { id: 'PT003', name: 'Drum Bearing — Bosch WM',            sku: 'BRN-BSH-WM-01',  category: 'WM',            appliance: 'Washing Machine', centerId: 'SC004', city: 'Mumbai',     stock: 0,  reserved: 1, reorderAt: 2,  demand: 4,  price: 1800, ageMonths: 0,  condition: 'In Transit', linkedJobId: 'JB004' },
  { id: 'PT004', name: 'Thermostat — Whirlpool Fridge',      sku: 'THR-WHP-RF-01',  category: 'Refrigerator',  appliance: 'Refrigerator',    centerId: 'SC001', city: 'Mumbai',     stock: 15, reserved: 0, reorderAt: 5,  demand: 8,  price: 450,  ageMonths: 4,  condition: 'Good' },
  { id: 'PT005', name: 'Compressor — Godrej 310L',           sku: 'CMP-GDJ-31-01',  category: 'Refrigerator',  appliance: 'Refrigerator',    centerId: 'SC001', city: 'Mumbai',     stock: 1,  reserved: 0, reorderAt: 2,  demand: 3,  price: 7200, ageMonths: 24, condition: 'Defective' },
  { id: 'PT006', name: 'PCB Board — Whirlpool AC',           sku: 'PCB-WHP-AC-01',  category: 'AC',            appliance: 'Air Conditioner', centerId: 'SC004', city: 'Mumbai',     stock: 3,  reserved: 1, reorderAt: 3,  demand: 5,  price: 1650, ageMonths: 8,  condition: 'Good', linkedJobId: 'JB003' },
  { id: 'PT007', name: 'Refrigerant Gas R32 — 1kg',          sku: 'GAS-R32-1KG-01', category: 'AC',            appliance: 'Air Conditioner', centerId: 'SC001', city: 'Mumbai',     stock: 12, reserved: 2, reorderAt: 6,  demand: 14, price: 680,  ageMonths: 3,  condition: 'Good' },
  { id: 'PT008', name: 'LED Panel — Sony 55"',               sku: 'PNL-SNY-55-01',  category: 'LED TV',        appliance: 'LED TV',          centerId: 'SC005', city: 'Mumbai',     stock: 4,  reserved: 0, reorderAt: 3,  demand: 5,  price: 6800, ageMonths: 20, condition: 'Good' },
  { id: 'PT009', name: 'Motor — Bosch WM',                   sku: 'MOT-BSH-WM-01',  category: 'WM',            appliance: 'Washing Machine', centerId: 'SC003', city: 'Thane',      stock: 0,  reserved: 0, reorderAt: 3,  demand: 4,  price: 5600, ageMonths: 0,  condition: 'Out of Stock' },
  { id: 'PT010', name: 'Door Gasket — Samsung Double Door',  sku: 'GSK-SMS-DD-01',  category: 'Refrigerator',  appliance: 'Refrigerator',    centerId: 'SC002', city: 'Navi Mumbai', stock: 22, reserved: 0, reorderAt: 8,  demand: 10, price: 380,  ageMonths: 8,  condition: 'Good' },
  // 5 additional SKUs present in parts/page.js but not previously in platformData
  { id: 'PT011', name: 'Evaporator Coil — Voltas Split',     sku: 'EVP-VLT-SP-01',  category: 'AC',            appliance: 'Air Conditioner', centerId: null,    city: 'Delhi',      stock: 5,  reserved: 0, reorderAt: 3,  demand: 6,  price: 3200, ageMonths: 12, condition: 'Good' },
  { id: 'PT012', name: 'Drum — LG Front Load 7kg',           sku: 'DRM-LG-FL-01',   category: 'WM',            appliance: 'Washing Machine', centerId: null,    city: 'Mumbai',     stock: 3,  reserved: 0, reorderAt: 2,  demand: 5,  price: 4100, ageMonths: 10, condition: 'Good' },
  { id: 'PT013', name: 'Heating Element — IFB 6kg',          sku: 'HTE-IFB-06-01',  category: 'WM',            appliance: 'Washing Machine', centerId: null,    city: 'Chennai',    stock: 7,  reserved: 0, reorderAt: 4,  demand: 6,  price: 920,  ageMonths: 14, condition: 'Good' },
  { id: 'PT014', name: 'Heating Element — V-Guard Geyser',   sku: 'HTE-VGD-GZ-01',  category: 'Geyser',        appliance: 'Geyser',          centerId: null,    city: 'Mumbai',     stock: 18, reserved: 0, reorderAt: 6,  demand: 9,  price: 680,  ageMonths: 5,  condition: 'Good' },
  { id: 'PT015', name: 'Thermostat — Racold 25L',            sku: 'THR-RCL-25-01',  category: 'Geyser',        appliance: 'Geyser',          centerId: null,    city: 'Hyderabad',  stock: 11, reserved: 0, reorderAt: 5,  demand: 7,  price: 420,  ageMonths: 7,  condition: 'Good' },
]

// ─── BRANDS / CONTRACTS ──────────────────────────────────────────────────────
export const BRANDS = [
  { id: 'B001', name: 'Reliance (Own)',  logo: '🏠', category: 'Own Brand',   jobsMonth: 8420, paidPerJob: 0,   actualCost: 420, slaHours: 24, slaBreaches: 12,  nps: 78, revenue: 0,       isOwn: true,  contractStatus: 'N/A',       flagged: false },
  { id: 'B002', name: 'Sony',            logo: '📺', category: 'Electronics', jobsMonth: 1240, paidPerJob: 400, actualCost: 620, slaHours: 48, slaBreaches: 38,  nps: 64, revenue: 496000,  isOwn: false, contractStatus: 'Active',    flagged: true,  flagReason: 'Loss-making ₹220/job · ₹2.73L/month loss' },
  { id: 'B003', name: 'LG',              logo: '⚙️', category: 'White Goods', jobsMonth: 2180, paidPerJob: 480, actualCost: 590, slaHours: 48, slaBreaches: 29,  nps: 71, revenue: 1046400, isOwn: false, contractStatus: 'Active',    flagged: true,  flagReason: 'Loss-making ₹110/job · ₹2.4L/month loss' },
  { id: 'B004', name: 'Samsung',         logo: '📱', category: 'Electronics', jobsMonth: 1890, paidPerJob: 450, actualCost: 600, slaHours: 48, slaBreaches: 52,  nps: 62, revenue: 850500,  isOwn: false, contractStatus: 'Review',    flagged: true,  flagReason: 'Loss-making + 52 SLA breaches this month' },
  { id: 'B005', name: 'Daikin',          logo: '❄️', category: 'HVAC',        jobsMonth: 940,  paidPerJob: 550, actualCost: 580, slaHours: 72, slaBreaches: 8,   nps: 74, revenue: 517000,  isOwn: false, contractStatus: 'Active',    flagged: false },
  { id: 'B006', name: 'Whirlpool',       logo: '🌀', category: 'White Goods', jobsMonth: 1320, paidPerJob: 420, actualCost: 570, slaHours: 48, slaBreaches: 44,  nps: 67, revenue: 554400,  isOwn: false, contractStatus: 'Active',    flagged: true,  flagReason: 'Loss-making ₹150/job' },
  { id: 'B007', name: 'Bosch',           logo: '🔧', category: 'White Goods', jobsMonth: 680,  paidPerJob: 600, actualCost: 610, slaHours: 48, slaBreaches: 6,   nps: 79, revenue: 408000,  isOwn: false, contractStatus: 'Active',    flagged: false },
  { id: 'B008', name: 'IFB',             logo: '🫧', category: 'White Goods', jobsMonth: 510,  paidPerJob: 380, actualCost: 560, slaHours: 72, slaBreaches: 21,  nps: 58, revenue: 193800,  isOwn: false, contractStatus: 'Active',    flagged: true,  flagReason: 'Loss-making ₹180/job · lowest NPS' },
  { id: 'B009', name: 'Voltas',          logo: '💨', category: 'HVAC',        jobsMonth: 1640, paidPerJob: 430, actualCost: 575, slaHours: 48, slaBreaches: 67,  nps: 61, revenue: 705200,  isOwn: false, contractStatus: 'Review',    flagged: true,  flagReason: 'Most SLA breaches this month (67)' },
  { id: 'B010', name: 'Godrej',          logo: '🏭', category: 'White Goods', jobsMonth: 890,  paidPerJob: 390, actualCost: 555, slaHours: 72, slaBreaches: 33,  nps: 65, revenue: 347100,  isOwn: false, contractStatus: 'Active',    flagged: true,  flagReason: 'Loss-making ₹165/job' },
]

// ─── SURVEYS ─────────────────────────────────────────────────────────────────
export const SURVEYS = [
  {
    id: 'SV001', name: 'Post-Service NPS', type: 'service-nps', trigger: 'case-resolved', active: true,
    questions: [
      { id: 'q1', type: 'nps',   text: 'How likely are you to recommend resQ to a friend or colleague?' },
      { id: 'q2', type: 'scale', text: "How satisfied were you with the technician's professionalism?", scale: 5 },
      { id: 'q3', type: 'scale', text: 'Was the issue resolved in the first visit?', scale: 5 },
      { id: 'q4', type: 'text',  text: 'What could we have done better?' },
    ],
    responses: [
      { id: 'r1', caseId: 'CS007', customerId: 'C001', answers: { q1: 9, q2: 5, q3: 5, q4: '' }, submittedAt: '2026-08-12T17:00:00' },
      { id: 'r2', caseId: 'CS005', customerId: 'C006', answers: { q1: 3, q2: 2, q3: 3, q4: 'Technician arrived 90 mins late and seemed rushed.' }, submittedAt: '2026-10-09T14:00:00', triggeredRecovery: true },
    ],
    avgNps: 6.2, responseRate: 0.68,
  },
  {
    id: 'SV002', name: 'Store Purchase NPS', type: 'store-nps', trigger: 'order-completed', active: true,
    questions: [
      { id: 'q1', type: 'nps',  text: 'How likely are you to recommend Reliance Digital / JioMart to a friend?' },
      { id: 'q2', type: 'scale',text: 'How was your delivery experience?', scale: 5 },
      { id: 'q3', type: 'scale',text: 'Was the installation done on the promised date?', scale: 5 },
      { id: 'q4', type: 'text', text: 'Any comments on the buying experience?' },
    ],
    responses: [],
    avgNps: 7.4, responseRate: 0.42,
  },
]

// ─── AI INSIGHTS ─────────────────────────────────────────────────────────────
export const AI_INSIGHTS = [
  {
    id: 'AI001', type: 'anomaly', priority: 'high',
    title: 'SLA breach spike in Andheri — AC installation backlog',
    summary: '14 AC installation cases in Andheri (pincode 400053–400059) are overdue by >7 days. Pattern matches summer demand + engineer shortage.',
    recommendation: 'Redeploy T002 (Arjun Mehta) from Borivali to Andheri for next 3 days. Flag ORD003 for priority resolution.',
    confidence: 0.89, source: 'rules+pattern',
  },
  {
    id: 'AI002', type: 'parts-demand', priority: 'medium',
    title: 'Drum bearing (Bosch WM) demand forecast: 8 units needed in October',
    summary: 'Based on 4 similar cases last month and 2 active cases, demand for BSH-WM bearing will exceed current stock (0 units in SC004) this month.',
    recommendation: 'Raise emergency PO for 10 units from central warehouse. ETA 2 days.',
    confidence: 0.82, source: 'ml-forecast',
  },
  {
    id: 'AI003', type: 'assignment', priority: 'medium',
    title: 'Recommended: Rohan Nair (T005) for CS001 — Samsung AC installation',
    summary: 'T005 has AC specialization, is available, covers Bandra West (400050), and has 7-yr experience. Match score: 94%.',
    recommendation: 'Assign T005 to JB (CS001). Schedule for 15 Oct 10:00–12:00.',
    confidence: 0.94, source: 'ai-assignment',
  },
  {
    id: 'AI004', type: 'fraud-risk', priority: 'high',
    title: 'Possible multi-trip: T001 (Rahul Sharma) — 3 jobs same address same day',
    summary: 'CS001 linked to 3 job records on Oct 12 at same address. Possible duplicate registration.',
    recommendation: 'Flag for manual review. Do not pay until investigation complete.',
    confidence: 0.76, source: 'rules',
  },
  {
    id: 'AI005', type: 'recovery', priority: 'high',
    title: 'Recovery case CS006 overdue — Deepak Joshi callback not done in 48h',
    summary: 'TK009 (senior agent callback) was due Oct 11. Now 72h overdue. Customer sent complaint email.',
    recommendation: 'Escalate to team lead. Auto-send apology + ₹300 goodwill coupon via WhatsApp.',
    confidence: 1.0, source: 'rules',
  },
]

// ─── PLATFORM KPIs (for leadership dashboard) ────────────────────────────────
export const PLATFORM_KPIS = {
  totalCasesOpen: 5,
  totalCasesThisMonth: 8,
  slaBreachRate: 0.25,
  firstVisitResolution: 0.68,
  avgResolutionHours: 38,
  repeatVisitRate: 0.22,
  technicianUtilization: 0.71,
  partsShortages: 2, // stock===0 count: PT003 (Drum Bearing, In Transit) + PT009 (Motor, Out of Stock) = 2; update if inventory changes
  serviceNps: 6.2,
  storeNps: 7.4,
  totalRevenueMTD: 4368400,
  ownBrandShare: 0.43,
  lossMakingBrands: 7,
  openFraudFlags: 5,
  recoveryPending: 1,
  installationBacklog: 14,
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export function getCustomer(id) { return CUSTOMERS.find(c => c.id === id) }
export function getCase(id) { return CASES.find(c => c.id === id) }
export function getProduct(id) { return PRODUCTS.find(p => p.id === id) }
export function getOrder(id) { return ORDERS.find(o => o.id === id) }
export function getTechnician(id) { return TECHNICIANS.find(t => t.id === id) }
export function getCenter(id) { return SERVICE_CENTERS.find(s => s.id === id) }
export function getCasesForCustomer(cid) { return CASES.filter(c => c.customerId === cid) }
export function getProductsForCustomer(cid) { return PRODUCTS.filter(p => p.customerId === cid) }
export function getOrdersForCustomer(cid) { return ORDERS.filter(o => o.customerId === cid) }
export function getTicketsForCase(caseId) { return TICKETS.filter(t => t.caseId === caseId) }
export function getJobsForCase(caseId) { return JOBS.filter(j => j.caseId === caseId) }
export function getConversationForCase(caseId) { return CONVERSATIONS.find(c => c.caseId === caseId) }

export const CASE_STATUS_COLORS = {
  'open':            'bg-red-100 text-red-700',
  'in-progress':     'bg-blue-100 text-blue-700',
  'parts-awaited':   'bg-amber-100 text-amber-700',
  'scheduled':       'bg-sky-100 text-sky-700',
  'resolved':        'bg-green-100 text-green-700',
  'completed':       'bg-green-100 text-green-700',
  'recovery':        'bg-purple-100 text-purple-700',
  'closed':          'bg-gray-100 text-gray-500',
}

export const CHANNEL_ICONS = {
  whatsapp: '💬',
  phone:    '📞',
  email:    '📧',
  app:      '📱',
  store:    '🏪',
  internal: '🔒',
}

export const PRIORITY_COLORS = {
  high:   'bg-red-500',
  medium: 'bg-amber-400',
  low:    'bg-gray-300',
}
