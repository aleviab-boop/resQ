# resQ Ops Platform — Requirements Coverage Matrix

> Status definitions:
> - **Working** — Screen exists, renders correct data from seed, UI interaction is meaningful.
> - **Simulated** — Screen exists and looks correct, but underlying logic is pre-seeded or non-persistent (mutations do not survive reload; events do not fire; integrations are mocked).
> - **Missing** — Capability not implemented at all, or only a placeholder route exists.
> - **Blocked** — Cannot implement without a prerequisite that is itself missing (e.g., a live event bus, a real backend, or a third-party API key).

---

## Capability Coverage Matrix

### Core Platform Capabilities

| Requirement | Status | Route / Component | Notes |
|---|---|---|---|
| Customer 360 profile | Working | `/ops/customers/[id]` | Full timeline: orders, devices, cases, conversations, NPS, tier, tags |
| Customer list with search / filter | Working | `/ops/customers` | Renders all 6 seed customers with tier and last-case status |
| Omnichannel inbox (unified view) | Simulated | `/ops/inbox` | Renders 4 pre-seeded conversation threads; no real channel integration |
| WhatsApp channel intake | Simulated | `/ops/inbox` | wa.me links shown; no WhatsApp Business API |
| App channel intake | Simulated | `/ops/inbox` | Conversation records include app-channel messages; no live push |
| Phone channel intake | Simulated | `/ops/inbox` | Call summary text in conversation records; no IVR/telephony |
| Email channel intake | Simulated | `/ops/inbox` | One email message in CV004; no inbox integration |
| Case management — list | Working | `/ops/cases` | All 8 cases rendered with status, priority, SLA badge, channel |
| Case management — detail | Working | `/ops/cases/[id]` | Tickets, jobs, conversation, linked product/order/customer displayed |
| Case creation | Simulated | `/ops/cases/new` | Form with customer/product/type selectors; no data persistence |
| Case status transitions | Simulated | `/ops/cases/[id]` | Status rendered; changes do not persist |
| Case assignment to technician | Simulated | `/ops/cases/[id]`, `/ops/dispatch` | Assignment UI exists; no persistence |
| SLA tracking (display) | Simulated | `/ops/cases`, `/ops/cases/[id]` | `slaBreached` and countdown from `slaDeadline` pre-computed in seed |
| SLA timer (runtime) | Missing | — | No background timer recalculates SLA at runtime |
| Ticket management (sub-tasks) | Working | `/ops/cases/[id]` | All tickets displayed with type, status, owner, team |
| Ticket creation | Missing | — | No UI to create new tickets within a case |
| Internal notes on cases | Working | `/ops/cases/[id]` | `internalNote` field on conversation displayed |

### Service Delivery Capabilities

| Requirement | Status | Route / Component | Notes |
|---|---|---|---|
| Dispatch console | Simulated | `/ops/dispatch` | Technician grid with status, skills, active job; assign modal present |
| Technician assignment | Simulated | `/ops/dispatch` | Assign modal opens; selection does not persist |
| Schedule grid (technician timeline) | Working | `/ops/dispatch` | 2-hour block schedule grid rendered for each technician per day |
| Promise engine / slot calculation | Missing | — | No available-slot logic; `slaHours` exists in data but no slot calculator |
| Live technician location (map) | Missing | — | lat/lng in TECHNICIANS data; no map rendered anywhere |
| Job creation | Missing | — | No UI creates a job record; all jobs are pre-seeded |
| Job tracking (status display) | Working | `/ops/cases/[id]`, `/ops/dispatch` | Job status, visit records, diagnosis text all displayed |
| Technician mobile / field app | Missing | — | No mobile-specific technician view; engineer-ops is ops-side only |
| Travel ETA tracking | Simulated | `/ops/cases/[id]` | `travelEta` field shown; not live-calculated |
| Service centre management | Working | `/ops/dispatch`, `/engineer-ops` | SERVICE_CENTERS rendered with capacity, coverage, active engineers |
| Engineer load / heatmap | Working | `/engineer-ops` | Per-area load data and technician performance displayed |
| Spare parts inventory | Working | `/parts` | All 10 SKUs rendered with stock, reserved, condition, reorder threshold |
| Parts demand forecasting | Simulated | `/ops/ai` | AI002 pre-seeded forecast for drum bearing; no ML model runs |
| Parts reservation | Simulated | `/parts` | Reserved counts in seed data; no runtime reservation action |
| Parts ordering / PO issuance | Missing | — | No purchase order workflow or ERP integration |
| Parts transfer between centres | Missing | — | No inter-centre transfer workflow |
| Delivery partner tracking | Simulated | `/ops/customers/[id]` | Delivery partner name shown on order; no tracking webhook |

### Quality and Intelligence Capabilities

| Requirement | Status | Route / Component | Notes |
|---|---|---|---|
| Post-service NPS survey (display) | Working | `/ops/surveys` | SV001 questions, responses, and aggregate NPS displayed |
| Survey dispatch (send to customer) | Missing | — | No survey dispatch mechanism; surveys not sent at case resolution |
| Survey response capture | Missing | — | No form for customers to submit survey responses |
| Service recovery (case display) | Working | `/ops/cases/[id]`, `/ops/surveys` | CS006 recovery case pre-seeded; tickets and conversation displayed |
| Auto-recovery trigger on low NPS | Simulated | — | CS006 pre-seeded as if triggered; `triggeredRecovery: true` in response r2; no runtime trigger |
| Recovery callback workflow | Simulated | `/ops/cases/[id]` | TK009 callback ticket and TK010 compensation ticket displayed as open |
| Goodwill compensation approval | Simulated | `/ops/cases/[id]` | TK010 shown as `pending-approval`; no approval action |
| Fraud detection (rule display) | Simulated | `/fraud-ops`, `/ops/ai` | AI004 fraud insight pre-seeded; no detection logic runs |
| Fraud review workflow | Missing | — | Fraud-ops page shows flag; no review / verdict action |
| AI anomaly detection (display) | Working | `/ops/ai` | All 5 AI_INSIGHTS rendered with priority, summary, recommendation |
| AI anomaly detection (runtime) | Missing | — | No ML model or rules engine runs; insights are static seed data |
| AI auto-assignment recommendation | Simulated | `/ops/ai`, `/ops/dispatch` | AI003 recommends T005 for CS001; not wired to dispatch action |
| Quality monitoring dashboard | Simulated | `/ops/surveys` | Avg NPS, response rate displayed from seed; no aggregation logic |

### Business Intelligence Capabilities

| Requirement | Status | Route / Component | Notes |
|---|---|---|---|
| Leadership KPI dashboard | Simulated | `/ops/dashboard` | PLATFORM_KPIS object rendered; all values are static |
| SLA breach rate KPI | Simulated | `/ops/dashboard` | `slaBreachRate: 0.25` from static PLATFORM_KPIS |
| First-visit resolution rate | Simulated | `/ops/dashboard` | `firstVisitResolution: 0.68` from static PLATFORM_KPIS |
| Revenue MTD | Simulated | `/ops/dashboard` | `totalRevenueMTD` from static PLATFORM_KPIS |
| Technician utilisation | Simulated | `/ops/dashboard`, `/engineer-ops` | `technicianUtilization: 0.71` static |
| Brand P&L per brand | Simulated | `/brand-ops` | BRANDS array with paidPerJob, actualCost, revenue rendered; pre-seeded economics |
| Brand SLA compliance | Simulated | `/brand-ops` | `slaBreaches` count per brand from seed |
| Brand contract review | Simulated | `/brand-ops` | `contractStatus` (Active / Review) and `flagReason` rendered |
| Installation backlog tracking | Simulated | `/ops` (hub), `/ops/dashboard` | `installationBacklog: 14` from PLATFORM_KPIS |
| Own-brand efficiency vs contracted | Simulated | `/brand-ops` | B001 (Reliance own) shown with isOwn: true and zero paidPerJob |
| Admin / SLA rules configuration | Simulated | `/ops/admin` | Static rule stubs displayed; no editing |
| Communication template management | Simulated | `/ops/admin` | 5 template stubs displayed; no editing or preview |

---

## Journey Coverage

### Journey 1: New interaction → customer matching → case creation → assignment

**Description:** Customer contacts resQ (any channel) → agent identifies customer → opens case → assigns technician.

| Step | Status | Notes |
|---|---|---|
| Inbound contact appears in inbox | Simulated | `/ops/inbox` shows pre-seeded threads |
| Agent identifies customer | Working | `/ops/customers` search; customer 360 links all context |
| Case created from interaction | Simulated | `/ops/cases/new` form exists; no persistence |
| SLA timer starts | Missing | Pre-set in seed; no runtime timer |
| Technician recommended by AI | Simulated | AI003 pre-seeded recommendation |
| Technician assigned | Simulated | Assign modal UI; no persistence |
| Customer notified of assignment | Missing | No notification dispatch |

**What works:** Reading customer context, viewing existing cases, navigating to case detail.
**Simulated:** Case creation form, assignment UI.
**Missing:** Data persistence, SLA timer, customer notification.

---

### Journey 2: Booking → committed promise → dispatch → technician execution → completion

**Description:** Customer books service → system commits an appointment slot → dispatch assigns technician → technician executes and completes.

| Step | Status | Notes |
|---|---|---|
| Customer books via app / WhatsApp | Simulated | Consumer booking flow in `/services/[slug]` + BookButton exists; no real booking created |
| Slot availability calculated | Missing | No promise engine or slot calculator |
| Appointment slot committed | Missing | No slot commitment logic |
| Dispatch console shows job | Working | JB002, JB005 shown as scheduled in dispatch grid |
| Technician assigned | Simulated | Assign modal; no persistence |
| Technician mobile notified | Missing | No mobile app or push notification |
| Technician marks job in-progress | Missing | No technician mobile view |
| Job completion with diagnosis and parts | Simulated | JB001, JB004 pre-seeded as completed with visit records |
| Customer confirmation captured | Simulated | `customerConfirmed: true` in visit seed records |
| Case auto-resolved | Missing | No runtime status transition on job completion |

**What works:** Dispatch grid display, scheduled job cards.
**Simulated:** Job execution records (pre-seeded completed visits).
**Missing:** Slot calculator, real booking, technician mobile, persistent job completion.

---

### Journey 3: Delivery → installation → continued tracking → feedback

**Description:** Product delivered → installation case opens → installation job executed → NPS collected.

| Step | Status | Notes |
|---|---|---|
| Order delivered (commerce event) | Simulated | ORD003, ORD006 seeded as `delivered-pending-install` |
| Installation case auto-created | Simulated | CS001, CS004 pre-seeded as installation cases |
| Customer can track on app | Missing | Consumer `/my-bookings` exists but no live tracking |
| Installation job scheduled | Simulated | JB005 scheduled for CS004 |
| Installation executed | Missing | JB005 is `scheduled`; no in-progress or completed state seeded |
| Survey dispatched | Missing | No survey dispatch mechanism |
| NPS collected | Missing | CS001 and CS004 have no linked survey responses |

**What works:** Installation case display, delivery status on order, scheduled job card.
**Simulated:** Installation case and job records.
**Missing:** Auto case creation on delivery, real tracking, survey dispatch, NPS capture for installation.

---

### Journey 4: Parts shortage → transfer / reservation → revisit → resolution

**Description:** First visit identifies part need → part ordered → arrives → revisit scheduled → repair completed.

| Step | Status | Notes |
|---|---|---|
| First visit diagnosis identifies part | Working | JB004 visit 1 shows diagnosis: drum bearing failure |
| Case status → parts-awaited | Working | CS003 is `parts-awaited` |
| Part reserved in inventory | Simulated | PT003 shows `reserved: 1`, `condition: In Transit` |
| Purchase order raised | Missing | No PO workflow or ERP integration |
| Part arrives at service centre | Simulated | PT003 seeded as In Transit with ETA implied |
| Customer notified of ETA | Simulated | CV003 message m5 explains delay and ETA |
| Revisit scheduled | Simulated | TK008 scheduling ticket open; JB (revisit) not yet created |
| Part installed, repair complete | Missing | No revisit job seeded for CS003; case not resolved |
| Case resolved | Missing | CS003 remains `parts-awaited` in seed |

**What works:** Parts-awaited case display, part status in inventory, linked ticket display.
**Simulated:** Part reservation count, in-transit status, conversation with ETA update.
**Missing:** Revisit job creation, part consumption tracking, case resolution, stock decrement.

---

### Journey 5: Quote → approval → simulated payment → service

**Description:** Out-of-warranty repair → diagnosis visit → quote generated → customer approves → repair executed.

| Step | Status | Notes |
|---|---|---|
| Technician diagnoses out-of-warranty issue | Working | JB001 visit 1 seeded: diagnosis + refrigerant leak |
| Quote generated | Simulated | TK005 `pending-approval` quote ticket; CV002 shows estimated ₹4,500–₹6,800 |
| Quote sent to customer | Simulated | CV002 message from agent references diagnosis fee and quote |
| Customer approves quote | Missing | No approval capture; quote ticket stays `pending-approval` |
| Payment taken | Missing | No payment gateway integration |
| Repair job scheduled | Simulated | JB002 scheduled for CS002 (repair visit after diagnosis) |
| Repair executed | Missing | JB002 is scheduled; no completion seeded |
| Invoice generated | Missing | No billing module |

**What works:** Diagnosis job with visit, quote ticket display, repair job in schedule.
**Simulated:** Quote amounts in conversation, repair job pre-scheduled.
**Missing:** Quote approval action, payment, job completion, invoice.

---

### Journey 6: Technician delay → customer update → rescheduling / reassignment

**Description:** Technician runs late or cannot make slot → customer proactively updated → slot rescheduled or tech reassigned.

| Step | Status | Notes |
|---|---|---|
| Delay detected (technician location vs ETA) | Missing | No live location or ETA comparison |
| Automated customer update sent | Missing | No notification dispatch |
| Agent manually updates customer | Simulated | Conversation thread allows this conceptually; no send action |
| Rescheduling option offered | Missing | No slot re-booking flow |
| Technician reassigned | Simulated | Assign modal could change assignedTo; no persistence |
| New slot committed | Missing | No slot commitment logic |

**What works:** Viewing current job assignment and technician details.
**Simulated:** Assign modal for reassignment.
**Missing:** Live ETA, proactive notifications, slot rebooking, persistence.

---

### Journey 7: Suspicious revisit / cancellation → review → resolution

**Description:** Multiple jobs at same address, or pattern of cancellations → fraud flag → analyst reviews → verdict.

| Step | Status | Notes |
|---|---|---|
| Fraud pattern detected | Simulated | AI004 pre-seeded: T001, 3 jobs same address same day, confidence 0.76 |
| Flag appears in fraud review queue | Working | `/fraud-ops` renders AI_INSIGHTS of type fraud-risk |
| Payment held pending review | Missing | No payment module; no hold mechanism |
| Analyst reviews evidence | Simulated | AI004 insight has summary and recommendation; no evidence attachments |
| Verdict recorded | Missing | No verdict action in fraud-ops UI |
| Payment released or withheld | Missing | No payment integration |

**What works:** Fraud flag display with summary and recommendation.
**Simulated:** Pre-seeded fraud insight with realistic pattern.
**Missing:** Real detection logic, payment hold, review action, verdict recording.

---

### Journey 8: Negative feedback → recovery case → follow-up

**Description:** Customer submits low NPS → auto recovery case created → senior agent calls back → goodwill gesture applied.

| Step | Status | Notes |
|---|---|---|
| Customer submits survey (NPS ≤ 6) | Simulated | SV001 r2 pre-seeded: NPS 3, verbatim comment |
| Auto-recovery case created | Simulated | CS006 pre-seeded as recovery case; `triggeredRecovery: true` in response |
| AI recovery insight created | Working | AI005 monitors CS006 overdue callback |
| Case assigned to senior agent | Simulated | CS006 assigned to T002 in seed |
| Callback ticket open | Working | TK009 `open` in CS006 tickets |
| Goodwill compensation ticket | Working | TK010 `pending-approval` in CS006 tickets |
| Manager approves goodwill | Missing | No approval action; TK010 stays pending-approval |
| Goodwill sent to customer | Missing | No WhatsApp/email dispatch for voucher |
| Recovery case resolved | Missing | CS006 remains `open` (SLA breached) |

**What works:** Recovery case detail, tickets displayed, AI insight for overdue callback.
**Simulated:** Auto-recovery trigger (pre-seeded), assignment, timeline.
**Missing:** Runtime recovery trigger, approval action, goodwill dispatch, case resolution.

---

### Journey 9: Completed job → updated cost → profitability dashboard

**Description:** Job completes → actual cost (parts + labour) computed → brand-level P&L updated → appears in leadership dashboard.

| Step | Status | Notes |
|---|---|---|
| Job completed with parts consumed | Simulated | JB001 completed with visit; no actual cost computation |
| Labour + parts cost calculated | Missing | No billing or costing engine |
| Invoice generated | Missing | No billing module |
| Brand contract rate applied | Simulated | BRANDS.paidPerJob and actualCost pre-seeded per brand |
| Per-job margin computed | Simulated | Margin = paidPerJob - actualCost shown in brand-ops; pre-computed in seed |
| P&L updated on dashboard | Simulated | PLATFORM_KPIS.totalRevenueMTD and BRANDS revenue are static |
| Loss-making brand flagged | Working | BRANDS with flagged:true and flagReason rendered in `/brand-ops` |
| Leadership dashboard reflects update | Simulated | PLATFORM_KPIS values are hardcoded; no aggregation at runtime |

**What works:** Brand P&L display, flagged brand reasons, KPI dashboard layout.
**Simulated:** Pre-computed economics per brand, static KPIs.
**Missing:** Real cost computation from job data, billing integration, live KPI aggregation.

---

## Implementation Gaps Summary

| Gap | Blocks journeys | Effort estimate |
|---|---|---|
| Data persistence (backend API) | All | High — foundational |
| Authentication / RBAC | All | High — security prerequisite |
| SLA timer (runtime) | 1, 2, 6 | Medium |
| Promise engine / slot calculator | 2, 6 | High — algorithmic |
| Technician mobile / field app | 2, 3 | High — separate client |
| Real-time notifications (WhatsApp / push) | 1, 2, 3, 6, 8 | Medium–High (API keys needed) |
| Survey dispatch and capture | 3, 8 | Medium |
| Auto-recovery trigger | 8 | Low (once persistence exists) |
| Quote approval flow | 5 | Low |
| Payment integration | 5, 7, 9 | High — external provider |
| Fraud detection runtime logic | 7 | Medium |
| Fraud review / verdict action | 7 | Low (UI only) |
| Parts PO / ERP integration | 4 | High — external system |
| Job completion workflow | 2, 4, 5, 9 | Medium |
| Maps / live technician tracking | 2, 6 | Medium (API key needed) |
| KPI aggregation (live from events) | 9 | Medium–High |
