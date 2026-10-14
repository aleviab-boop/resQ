# resQ Ops Platform — Module Dependency Map

> All dependencies are currently in-process: every module imports from the same `src/lib/platformData.js` file. There are no API calls, no separate services, and no message bus. The table below describes logical dependencies — what a module reads and writes conceptually — as a design artefact for a production implementation.

---

## Shared Data Sources

All ops modules share a single data layer:

| Source | Location | Contents |
|---|---|---|
| `platformData.js` | `src/lib/platformData.js` | All domain entities (CUSTOMERS, PRODUCTS, ORDERS, CASES, TICKETS, JOBS, CONVERSATIONS, TECHNICIANS, SERVICE_CENTERS, PARTS_INVENTORY, BRANDS, SURVEYS, AI_INSIGHTS, PLATFORM_KPIS) |
| `data.js` | `src/lib/data.js` | Consumer-facing service catalogue (service types, pricing, slugs) |
| `pincodes.js` | `src/lib/pincodes.js` | Pincode to city/area mapping |
| `engineerLoad.js` | `src/lib/engineerLoad.js` | Engineer utilisation calculation helpers |
| `sla.js` | `src/lib/sla.js` | SLA time-remaining display helpers |

---

## Module Dependency Table

### A — Customer Operations

| Dimension | Detail |
|---|---|
| **Reads from** | CUSTOMERS, PRODUCTS, ORDERS, CASES, TICKETS, CONVERSATIONS, TECHNICIANS, PARTS_INVENTORY |
| **Writes to** | CASES (new case, status change), CONVERSATIONS (new message), TICKETS (new ticket), CUSTOMERS (profile update) |
| **Shared services used** | Authentication (agent identity), Notification delivery (WhatsApp/email/app confirm), Communication templates, SLA engine (SLA countdown display), AI triage (message classification — planned) |
| **Events produced** | `case.created`, `case.status_changed`, `case.assigned` (when agent assigns from case detail), `conversation.received` (when agent logs a contact) |
| **Events consumed** | `case.sla_breached` (displays breach badge), `job.completed` (case status update), `survey.submitted` (case → completed), `fraud.flagged` (internal note on case), `recovery.triggered` (new recovery case created) |

**Current implementation note:** Customer Operations screens render read-only views from seed data. The new-case form (`/ops/cases/new`) has a working UI but no data persistence. The inbox (`/ops/inbox`) renders pre-seeded conversation threads. No mutations execute at runtime.

---

### B — Service Delivery

| Dimension | Detail |
|---|---|
| **Reads from** | CASES (unassigned / open cases queue), TECHNICIANS (availability, skills, location), SERVICE_CENTERS (catchment pincodes, capacity), JOBS (schedule grid), PARTS_INVENTORY (availability for job planning), AI_INSIGHTS (assignment recommendations) |
| **Writes to** | JOBS (new job, status update), TECHNICIANS (status: available ↔ on-job, activeJobId), PARTS_INVENTORY (reserved count, consumed stock), CASES (status: scheduled → in-progress → resolved) |
| **Shared services used** | Authentication (dispatch agent identity), Maps/location (technician GPS — not implemented), Promise engine / slot calculator (not implemented), Notification delivery (customer slot confirmation, technician alert) |
| **Events produced** | `job.scheduled`, `job.started`, `job.completed`, `job.failed`, `visit.completed`, `technician.status_changed`, `part.reserved`, `part.dispatched`, `part.consumed` |
| **Events consumed** | `case.created` (new case enters assignment queue), `case.assigned` (job can be created), `part.dispatched` (ETA communicated, revisit can be scheduled) |

**Current implementation note:** Dispatch console (`/ops/dispatch`) shows a technician grid with an assign modal. The modal is non-persistent. Parts management (`/parts`) renders PARTS_INVENTORY read-only. Engineer Ops (`/engineer-ops`) renders technician cards with load data. No job creation, no part reservation, and no technician status updates persist.

---

### C — Quality and Intelligence

| Dimension | Detail |
|---|---|
| **Reads from** | SURVEYS (questions, responses, NPS aggregates), CASES (for recovery context), CUSTOMERS (NPS history, tier), AI_INSIGHTS (all types: anomaly, parts-demand, assignment, fraud-risk, recovery), PLATFORM_KPIS (breach rate, recovery pending) |
| **Writes to** | SURVEYS (new response when customer submits), CASES (new recovery case when NPS ≤ threshold), AI_INSIGHTS (new insights as events fire — runtime planned), PLATFORM_KPIS (recoveryPending, openFraudFlags) |
| **Shared services used** | Survey dispatch (WhatsApp / app / email link — not implemented), AI/ML pipeline (anomaly detection, fraud rules, demand forecasting — simulated), Notification delivery (recovery callback scheduling) |
| **Events produced** | `survey.submitted`, `survey.nps_low`, `recovery.triggered`, `fraud.flagged`, `fraud.reviewed` |
| **Events consumed** | `case.resolved` (triggers survey dispatch), `visit.completed` (feeds technician performance data), `job.completed` (consumption data for fraud check), `part.consumed` (demand signal) |

**Current implementation note:** Surveys (`/ops/surveys`) renders SV001 and SV002 with pre-seeded responses. NPS scores and averages display correctly. Recovery case CS006 is pre-seeded as if `recovery.triggered` had fired. AI operations (`/ops/ai`) renders AI_INSIGHTS. Fraud review (`/fraud-ops`) renders fraud-type AI_INSIGHTS. No runtime detection, no survey dispatch, no actual recovery case creation.

---

### D — Business Intelligence

| Dimension | Detail |
|---|---|
| **Reads from** | PLATFORM_KPIS, CASES (count, breach rate), BRANDS (per-brand economics), PARTS_INVENTORY (shortage count), AI_INSIGHTS (summary for ops hub), SURVEYS (NPS averages), TECHNICIANS (utilisation), JOBS (FVR, repeat visit rate) |
| **Writes to** | Nothing (read-only dashboard) |
| **Shared services used** | Reporting aggregation pipeline (not implemented — currently static PLATFORM_KPIS object), Authentication (role gating for leadership reports — not implemented) |
| **Events produced** | None (read-only) |
| **Events consumed** | All events conceptually — in production, each event would increment or recalculate relevant KPIs in PLATFORM_KPIS. Currently PLATFORM_KPIS is a static snapshot. |

**Current implementation note:** Leadership dashboard (`/ops/dashboard`) renders PLATFORM_KPIS and CASES directly. Brand Ops (`/brand-ops`) renders BRANDS array with P&L computed inline. Rules & Admin (`/ops/admin`) shows static stubs for SLA rules and templates. All are read-only.

---

## Shared Services Dependency Matrix

| Shared Service | Customer Ops | Service Delivery | Quality & Intelligence | Business Intelligence | Status |
|---|---|---|---|---|---|
| Authentication / RBAC | Yes (agent identity) | Yes (dispatch agent) | Yes (analyst identity) | Yes (role gating) | Missing |
| SLA engine | Yes (display only) | Yes (timer start/stop) | Yes (breach signal) | Yes (breach rate KPI) | Simulated (display only) |
| Notification delivery | Yes (customer ack) | Yes (slot confirm, tech alert) | Yes (survey dispatch, recovery callback) | No | Missing (wa.me links only) |
| Communication templates | Yes (inbox) | Yes (slot confirm) | Yes (survey, recovery) | No | Simulated (referenced only) |
| AI / ML pipeline | Yes (triage) | Yes (assignment, ETA) | Yes (anomaly, fraud, demand) | Yes (insight summary) | Simulated (static AI_INSIGHTS) |
| Maps / location | No | Yes (technician GPS, dispatch) | No | No | Missing |
| Promise engine | No | Yes (slot availability) | No | No | Missing |
| Audit trail | Yes | Yes | Yes | Yes | Missing |
| Event bus | Yes | Yes | Yes | Yes | Missing |
| Payments | No | Yes (quote approval) | No | Yes (revenue KPIs) | Missing |

---

## Inter-module Data Flows

```
Customer Operations
  │
  ├── creates Case ──────────────────────────────────> Service Delivery
  │       │                                                  │
  │       │                                          creates Job, reserves Parts
  │       │                                                  │
  │       │◄──── job.completed / case.resolved ─────────────┘
  │       │
  │       └──> Quality & Intelligence
  │                  │
  │                  ├── survey dispatched on case.resolved
  │                  ├── recovery case created on low NPS
  │                  └── fraud flag created on suspicious job
  │
  └──────────────────────────────────────────────────> Business Intelligence
                                                            │
                                                     aggregates all entity counts
                                                     into PLATFORM_KPIS (static now;
                                                     should be event-driven)
```

---

## Component-level Import Map

The following shows which platformData exports each ops page currently imports:

| Page | Imports |
|---|---|
| `/ops` (hub) | PLATFORM_KPIS, CASES, PARTS_INVENTORY, AI_INSIGHTS |
| `/ops/inbox` | CONVERSATIONS, CASES, CUSTOMERS, CHANNEL_ICONS, getCustomer |
| `/ops/customers` | CUSTOMERS, CASES, PRODUCTS |
| `/ops/customers/[id]` | CUSTOMERS, PRODUCTS, ORDERS, CASES, CONVERSATIONS, getCustomer, getProduct, getOrder, getCasesForCustomer, getProductsForCustomer, getOrdersForCustomer, getConversationForCase |
| `/ops/cases` | CASES, CASE_STATUS_COLORS, CHANNEL_ICONS, getCustomer, getTechnician |
| `/ops/cases/[id]` | CASES, TICKETS, JOBS, CONVERSATIONS, CUSTOMERS, PRODUCTS, ORDERS, TECHNICIANS, PARTS_INVENTORY, getCustomer, getProduct, getOrder, getTicketsForCase, getJobsForCase, getConversationForCase, getTechnician, getCenter |
| `/ops/cases/new` | CUSTOMERS, PRODUCTS, TECHNICIANS |
| `/ops/dispatch` | TECHNICIANS, SERVICE_CENTERS, JOBS, CASES, CUSTOMERS, AI_INSIGHTS, getCenter, getCase, getCustomer, getTechnician |
| `/ops/surveys` | SURVEYS |
| `/ops/ai` | AI_INSIGHTS |
| `/ops/dashboard` | PLATFORM_KPIS, CASES, BRANDS, PARTS_INVENTORY |
| `/ops/admin` | Static content only |
| `/engineer-ops` | TECHNICIANS, SERVICE_CENTERS, JOBS |
| `/parts` | PARTS_INVENTORY, SERVICE_CENTERS |
| `/brand-ops` | BRANDS |
| `/fraud-ops` | AI_INSIGHTS (fraud type), CASES |
