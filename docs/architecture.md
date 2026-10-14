# resQ Ops Platform — Architecture

> **Implementation note:** The entire platform runs on a static simulation layer (`src/lib/platformData.js`). All entities are seed data exported as JavaScript arrays. In production these would be replaced by API calls to a backend service. No mutations persist across page reloads. Where a capability is described as "working," it means the UI reads and renders correctly from seed data; it does not mean a live backend is involved.

---

## 1. Module Structure

The platform is divided into four operational modules and a shared platform layer, all accessible from the hub at `/ops`.

### A — Customer Operations

Covers customer identity, omnichannel intake, conversation management, customer profiles, cases, tickets, and service history.

| Workspace | Route | Primary user |
|---|---|---|
| Omnichannel Inbox | `/ops/inbox` | CX Agent |
| Customer 360 | `/ops/customers` | CX Agent / Team Lead |
| Customer Profile | `/ops/customers/[id]` | CX Agent |
| Case List | `/ops/cases` | CX Agent / Ops Manager |
| Case Detail | `/ops/cases/[id]` | CX Agent |
| New Case | `/ops/cases/new` | CX Agent |

Customer Operations is the entry point for every inbound interaction. An agent identifies the customer, matches them to an existing profile, creates a case, links it to an order and product, and assigns it for execution.

### B — Service Delivery

Covers the promise engine (planned), delivery and installation coordination, service centre management, technician capacity, dispatch, technician mobile view, job tracking, and spare parts.

| Workspace | Route | Primary user |
|---|---|---|
| Dispatch Console | `/ops/dispatch` | Dispatch / Ops |
| Engineer Ops | `/engineer-ops` | Service Manager |
| Spare Parts | `/parts` | Parts / Warehouse |

Service Delivery translates a case into a scheduled job, assigns the right technician based on skill and proximity, tracks the visit, and manages the parts pipeline required for resolution.

### C — Quality and Intelligence

Covers post-service surveys, automatic service recovery, quality monitoring, fraud investigation, and AI-assisted operational insights.

| Workspace | Route | Primary user |
|---|---|---|
| AI Operations | `/ops/ai` | Ops Manager |
| Surveys & Recovery | `/ops/surveys` | QA / CX Lead |
| Fraud Review | `/fraud-ops` | Fraud Analyst |

This module closes the feedback loop: NPS surveys trigger recovery cases, AI anomaly detection surfaces patterns (SLA spikes, parts demand), and fraud flags catch billing irregularities before payment.

### D — Business Intelligence

Covers leadership reporting, brand-level performance, job economics, contract review, and own-brand efficiency benchmarking.

| Workspace | Route | Primary user |
|---|---|---|
| Leadership Dashboard | `/ops/dashboard` | VP / Director |
| Brand Operations | `/brand-ops` | Brand Manager |
| Rules & Admin | `/ops/admin` | Ops Admin |

Business Intelligence aggregates KPIs computed from the seed data: revenue, SLA breach rates, first-visit resolution, NPS, and per-brand profitability.

### Shared Capabilities

These cross-cut all modules and are described in detail in Section 5.

- Identity & access control — `/login`
- Ops hub / navigation — `/ops`
- Workflow rules engine
- Notification delivery (WhatsApp, push, email, SMS)
- AI services (anomaly detection, assignment scoring, demand forecasting)
- Audit trail
- Communication templates
- Event processing

---

## 2. Experience Layer (screens)

### Customer-facing (consumer app shell)

| Screen | Route | Primary data | Mutation |
|---|---|---|---|
| Home / booking entry | `/` | Service catalogue | None |
| Service detail | `/services/[slug]` | Service types, pricing | None |
| My bookings | `/my-bookings` | ORDERS, CASES | None |
| My devices | `/my-devices` | PRODUCTS | None |
| Care plan | `/care-plan` | Static content | None |
| Locate service centre | `/locate` | SERVICE_CENTERS | None |
| Profile | `/profile` | Static (no auth) | None |
| Login | `/login` | None | None (simulated) |
| All services | `/all-services` | Service catalogue | None |
| AMC | `/amc` | Static content | None |
| Repair vs new | `/repair-vs-new` | Static content | None |
| Articles | `/articles` | Static content | None |
| FAQ | `/faq` | Static content | None |
| Download app | `/download` | Static content | None |
| Referral | `/referral` | Static content | None |
| Claim | `/claim` | Static content | None |
| About / Contact / Terms / Privacy / Cookies | Various | Static content | None |
| Cart / notifications | `/CartDetails`, `/Notifications` | Local state | Local state only |

### Ops workspace (internal tool)

| Screen | Route | Reads | Writes | User |
|---|---|---|---|---|
| Ops Hub | `/ops` | CASES, PARTS_INVENTORY, AI_INSIGHTS, PLATFORM_KPIS | None | Any ops |
| Inbox | `/ops/inbox` | CONVERSATIONS, CASES, CUSTOMERS | None (UI select only) | CX Agent |
| Customer list | `/ops/customers` | CUSTOMERS, CASES, PRODUCTS | None | CX Agent |
| Customer 360 | `/ops/customers/[id]` | CUSTOMERS, PRODUCTS, ORDERS, CASES, CONVERSATIONS | None | CX Agent |
| Case list | `/ops/cases` | CASES, CUSTOMERS, TECHNICIANS | None | CX Agent |
| Case detail | `/ops/cases/[id]` | CASES, TICKETS, JOBS, CONVERSATIONS, PARTS_INVENTORY | None (UI select only) | CX Agent |
| New case | `/ops/cases/new` | CUSTOMERS, PRODUCTS, TECHNICIANS | None (no persist) | CX Agent |
| Dispatch console | `/ops/dispatch` | TECHNICIANS, SERVICE_CENTERS, JOBS, CASES, AI_INSIGHTS | None (modal, no persist) | Dispatch |
| Surveys | `/ops/surveys` | SURVEYS (with responses) | None | QA |
| AI operations | `/ops/ai` | AI_INSIGHTS | None | Ops Manager |
| Leadership dashboard | `/ops/dashboard` | PLATFORM_KPIS, CASES, BRANDS, PARTS_INVENTORY | None | VP / Director |
| Rules & Admin | `/ops/admin` | Static rule definitions | None | Admin |
| Engineer Ops | `/engineer-ops` | TECHNICIANS, SERVICE_CENTERS, JOBS | None | Service Manager |
| Spare Parts | `/parts` | PARTS_INVENTORY, SERVICE_CENTERS | None | Parts Manager |
| Brand Ops | `/brand-ops` | BRANDS | None | Brand Manager |
| Fraud Review | `/fraud-ops` | AI_INSIGHTS (fraud type), CASES | None | Fraud Analyst |

---

## 3. Domain Layer (entities)

### Customer

Represents a person or household that has purchased or requested service from resQ. Customers are identified by phone number.

- **Created when:** An order is placed, or an agent creates the profile from a walk-in / phone call.
- **Valid states:** Active (engaged, recent purchases or open cases), At-risk (low NPS or pending recovery), Churned (no activity, historically inferred from absence).
- **Key fields:** `id`, `name`, `phone`, `email`, `address`, `city`, `state`, `pincode`, `since`, `tier` (Bronze/Silver/Gold/Platinum), `totalSpend`, `nps`, `carePlan`, `tags`.
- **Key relationships:** HAS_MANY Products, HAS_MANY Orders, HAS_MANY Cases, HAS_MANY Conversations.

### Asset / Product

A physical appliance or device belonging to a customer, created when an order is placed and the product is installed (or pending installation).

- **Created when:** An order is fulfilled (delivery confirmed). `installDate` populated after installation job completion.
- **Valid states:** `active` (installed and in use), `pending-installation` (delivered but not yet installed).
- **Key fields:** `id`, `customerId`, `orderId`, `brand`, `model`, `type`, `serial`, `purchaseDate`, `warrantyExpiry`, `installDate`, `status`.
- **Key relationships:** BELONGS_TO Customer, BELONGS_TO Order, HAS_MANY Cases.

### Order

A commerce transaction linking a customer to a product purchase. Created by the commerce system (simulated in seed data).

- **Created when:** Customer places an order on Reliance Digital / JioMart online or in-store.
- **Valid states:** `completed` (delivered and installed), `delivered-pending-install` (physical delivery done, installation case pending).
- **Key fields:** `id`, `customerId`, `productId`, `date`, `amount`, `status`, `deliveryDate`, `installDate`, `deliveryPartner`, `channel`.
- **Key relationships:** BELONGS_TO Customer, HAS_ONE Product, HAS_MANY Cases.

### Case

The primary unit of work in the ops platform. A case groups all activity (conversations, tickets, jobs) around a single customer problem or service need.

- **Created when:** An agent opens a case from a customer interaction, or the system auto-creates one on order delivery (for installation), or on NPS trigger (for recovery).
- **Valid states:** `open`, `in-progress`, `parts-awaited`, `scheduled`, `resolved`, `completed`, `recovery`, `closed`.
- **Types:** `installation`, `repair`, `service`, `maintenance`, `recovery`.
- **Key fields:** `id`, `customerId`, `productId`, `orderId`, `type`, `title`, `status`, `priority`, `channel`, `slaHours`, `slaDeadline`, `slaBreached`, `createdAt`, `updatedAt`, `assignedTo`, `centerId`, `description`, `tags`.
- **Key relationships:** BELONGS_TO Customer, BELONGS_TO Product, BELONGS_TO Order, HAS_MANY Tickets, HAS_MANY Jobs, HAS_ONE Conversation, MAY_TRIGGER Survey.

### Ticket

A sub-task or action item within a case. Tickets track discrete work items (verify identity, schedule slot, check parts, generate quote, recovery callback).

- **Created when:** Agent or system creates a ticket within a case.
- **Valid states:** `done`, `open`, `pending-approval`, `in-transit`.
- **Types:** `verification`, `scheduling`, `parts-check`, `diagnosis`, `quote`, `parts-order`, `recovery`, `compensation`.
- **Key fields:** `id`, `caseId`, `title`, `type`, `status`, `owner`, `team`, `createdAt`.
- **Key relationships:** BELONGS_TO Case.

### Job

A field assignment: a technician dispatched to a customer location for a specific type of work. A case may have multiple jobs (initial diagnosis, then repair revisit).

- **Created when:** Dispatch assigns a technician to a case and a time slot.
- **Valid states:** `scheduled`, `in-progress`, `completed`, `failed` (not yet in seed data).
- **Types:** `diagnosis`, `repair`, `installation`, `diagnosis+repair`, `maintenance`.
- **Key fields:** `id`, `caseId`, `technicianId`, `type`, `status`, `scheduledDate`, `timeSlot`, `address`, `city`, `pincode`, `estimatedDuration`, `actualDuration`, `travelEta`.
- **Key relationships:** BELONGS_TO Case, BELONGS_TO Technician, HAS_MANY Visits (nested array), USES Parts.

### Visit

A nested record within a Job representing a single technician arrival at the customer site. A job may require multiple visits (if parts are awaited).

- **Key fields:** `visitNo`, `date`, `status`, `techId`, `arrivedAt`, `diagnosis`, `partsUsed`, `evidence`, `customerConfirmed`, `notes`.
- **Key relationships:** BELONGS_TO Job.

### Technician

A field engineer employed by or contracted to resQ, affiliated with a service centre.

- **Valid states:** `available`, `on-job`, `offline`.
- **Key fields:** `id`, `name`, `phone`, `centerId`, `skills` (array of product types), `rating`, `jobs` (lifetime count), `exp`, `status`, `shift`, `lat`, `lng`, `activeJobId`, `badge`.
- **Key relationships:** BELONGS_TO ServiceCenter, HAS_MANY Jobs.

### ServiceCenter

A physical resQ service hub serving a defined pincode catchment area. Technicians are affiliated with a centre; parts inventory is held per centre.

- **Key fields:** `id`, `name`, `city`, `address`, `pincodes` (array), `manager`, `capacity`, `activeEngineers`, `phone`.
- **Key relationships:** HAS_MANY Technicians, HAS_MANY Parts.

### Part

A spare part SKU tracked in inventory at a specific service centre.

- **Valid states:** `Good`, `In Transit`, `Defective`, `Out of Stock`.
- **Key fields:** `id`, `name`, `sku`, `category`, `centerId`, `stock`, `reserved`, `reorderAt`, `demand`, `price`, `ageMonths`, `condition`, `linkedJobId`.
- **Key relationships:** BELONGS_TO ServiceCenter, LINKED_TO Job (when reserved/in-transit).

### Conversation

An omnichannel thread linking a customer, a case, and all messages exchanged across channels (WhatsApp, phone, email, app, internal notes).

- **Valid states:** `open`, `in-progress`, `parts-awaited`, `resolved` (mirrors case status).
- **Key fields:** `id`, `customerId`, `caseId`, `channel`, `status`, `agent`, `createdAt`, `updatedAt`, `messages` (array), `templates`, `internalNote`.
- **Key relationships:** BELONGS_TO Customer, BELONGS_TO Case.

### Brand

A manufacturer whose appliances resQ services under a contractual arrangement. Includes own-brand (Reliance) tracked at zero fee.

- **Key fields:** `id`, `name`, `logo`, `category`, `jobsMonth`, `paidPerJob`, `actualCost`, `slaHours`, `slaBreaches`, `nps`, `revenue`, `isOwn`, `contractStatus`, `flagged`, `flagReason`.
- **Key relationships:** HAS_MANY Products (indirect, via brand name on product).

### Survey

A configurable questionnaire sent to customers after a triggering event. Contains questions and all responses.

- **Key fields:** `id`, `name`, `type`, `trigger`, `active`, `questions` (array), `responses` (array), `avgNps`, `responseRate`.
- **Types:** `service-nps` (triggered on case resolution), `store-nps` (triggered on order completion).

### Survey Response

A customer's answers to a survey, linked to a case.

- **Key fields:** `id`, `caseId`, `customerId`, `answers` (keyed by question id), `submittedAt`, `triggeredRecovery`.

---

## 4. Service Lifecycle

### Standard flow

```
Order placed
  └─ Delivery confirmed
       └─ Installation case auto-created (type: installation)
            └─ Ticket: identity verification → done
            └─ Ticket: schedule slot → open
            └─ Job: installation scheduled
                 └─ Visit 1: technician arrives, installs product
                      └─ Customer confirms
                           └─ Case → resolved / completed
                                └─ Survey sent (service-nps trigger)
                                     └─ If NPS < threshold → Recovery case auto-created
```

### Repair / service flow

```
Customer contacts (WhatsApp / app / phone / email)
  └─ Agent creates Case (type: repair or service)
  └─ SLA timer starts (slaHours from brand contract or type default)
  └─ Ticket: diagnosis → scheduled
  └─ Job: diagnosis visit
       └─ Visit 1: diagnosis completed
            ├─ In-warranty: repair authorised, parts ordered if needed
            └─ Out-of-warranty: quote generated → Ticket: quote pending approval
                                  └─ Customer approves → repair job scheduled
                                       └─ Visit 2 (if parts awaited or separate repair)
                                            └─ Repair completed → Case → resolved
                                                 └─ Survey sent
```

### Parts-awaited detour

```
Visit diagnosis → part identified as required
  └─ Part reserved in PARTS_INVENTORY (reserved += 1)
  └─ If stock = 0: purchase order raised, part goes In Transit
  └─ Case status → parts-awaited
  └─ Ticket: parts-order (in-transit)
  └─ Part arrives at service centre
       └─ Ticket: schedule revisit → open
       └─ Job 2 scheduled for installation of part
            └─ Visit 2: part installed → Case → resolved
```

### State machine (Case)

```
open → in-progress → parts-awaited → scheduled → resolved → completed → closed
  ↑                                     ↑
  └─ (reopened from resolved)           └─ (rescheduled from scheduled)

open / in-progress → recovery (auto-triggered by low NPS on related case)
any active state → slaBreached = true (flag, does not change status)
open / in-progress → escalated (tag; no separate status — priority set to high)
```

### Cancellation / failure

Not yet modelled in the seed data. The data model does not include `cancelled` or `failed` as case statuses. Jobs have no `failed` status in the seed. These states are planned but missing.

---

## 5. Shared Platform Layer

| Capability | Description | Status |
|---|---|---|
| Authentication | `/login` page exists. AuthContext in `src/context/AuthContext.js`. No real auth provider — no session token, no protected routes, no role enforcement. | Simulated (UI shell only) |
| Role-based access | Roles implied by module (agent, dispatch, manager, admin, fraud analyst) but not enforced. Any URL is accessible without login. | Missing |
| Workflow engine | Ticket types and statuses encode workflow steps. No rule engine executes transitions automatically. Status changes are UI-only and non-persistent. | Simulated |
| Assignment rules | AI_INSIGHTS contains pre-computed assignment recommendations (e.g., AI003 recommends T005 for CS001). No live scoring algorithm runs at assignment time. | Simulated |
| SLA engine | `slaDeadline` and `slaBreached` fields are pre-computed in seed data. `src/lib/sla.js` exists but only provides display helpers. No running timer recalculates SLA at runtime. | Simulated |
| Communication templates | `templates` arrays on Conversation records reference template IDs. Template content (e.g., `technician-assigned`, `slot-confirmation`) is referenced but not stored or rendered. `/ops/admin` shows 5 template stubs. | Simulated |
| Notification delivery | No actual push, SMS, WhatsApp, or email is sent. WhatsApp links use `wa.me/` scheme (opens WhatsApp with pre-filled text). | Simulated (wa.me links only) |
| Audit trail | No audit log is stored. Conversation `messages` array serves as a partial human-readable audit for case interactions. | Missing |
| Event processing | No event bus. Events described in the event catalogue are conceptual — the platform does not publish or consume events. | Missing |
| AI services | `AI_INSIGHTS` array contains 5 pre-written insights (anomaly, parts-demand, assignment, fraud-risk, recovery). No ML model runs at runtime. The `/ops/ai` page displays these static records. | Simulated |
| Reporting / KPIs | `PLATFORM_KPIS` is a static object. `/ops/dashboard` and `/brand-ops` render it directly. No aggregation logic runs. | Simulated |
| Configuration / admin | `/ops/admin` shows static SLA rule and template stubs. No rules are editable or persisted. | Simulated |
| ThemeContext | `src/context/ThemeContext.js` — light/dark theme toggle. Working. | Working |

---

## 6. Integration Layer

| Integration | Mechanism | Status |
|---|---|---|
| Commerce / order system (Reliance Digital / JioMart) | `ORDERS` and `PRODUCTS` arrays seeded in platformData.js. `deliveryPartner`, `channel`, and dates are pre-populated. | Simulated (seeded data) |
| Delivery partners (Delhivery, Reliance Logistics, Xpressbees) | Delivery partner name appears in `ORDERS[].deliveryPartner`. No API call, no tracking webhook. | Simulated |
| WhatsApp Business API | `wa.me/` links generated from customer phone numbers. No actual API session, no message sending, no webhook receiving. Conversation records are hand-crafted seed data. | Simulated (wa.me links shown, no API) |
| Phone / IVR intake | Conversation records include `[Phone call]` messages representing call summaries typed by agents. No telephony integration, no IVR, no call recording. | Simulated (conversation records only) |
| Email intake | One conversation record includes an `[Email]` message. No email parsing, no inbox integration. | Simulated |
| App push notifications | `NotificationManager` component and `/Notifications` page exist. No FCM or APNs integration. | Simulated |
| Warranty / manufacturer data | `warrantyExpiry` dates in PRODUCTS are seed data. No live warranty lookup from brand APIs. | Simulated |
| Parts inventory / ERP | `PARTS_INVENTORY` is seed data. No ERP connection, no live stock feed, no purchase order issuance. | Simulated |
| Maps / location | `lat` and `lng` fields on TECHNICIANS and pincode arrays on SERVICE_CENTERS are present. No map is rendered in any ops screen (dispatch console does not include a live map). | Not implemented |
| Payments | No payment gateway integration. Quote amounts shown in conversation records but no payment flow exists. | Not implemented |
| External service partners / third-party field teams | Not in data model. | Not implemented |
| Manufacturer warranty validation APIs | Not in data model. | Not implemented |

---

## 7. Data Layer

All data is defined in `/Users/aleviabandyopadhyay/Desktop/resq/src/lib/platformData.js` and imported directly into page components as ES module exports.

### Canonical collections

| Export | Records | Primary key |
|---|---|---|
| `CUSTOMERS` | 6 | `id` (C001–C006) |
| `PRODUCTS` | 8 | `id` (P001–P008) |
| `ORDERS` | 8 | `id` (ORD001–ORD008) |
| `SERVICE_CENTERS` | 5 | `id` (SC001–SC005) |
| `TECHNICIANS` | 8 | `id` (T001–T008) |
| `CASES` | 8 | `id` (CS001–CS008) |
| `TICKETS` | 10 | `id` (TK001–TK010) |
| `JOBS` | 5 | `id` (JB001–JB005) |
| `CONVERSATIONS` | 4 | `id` (CV001–CV004) |
| `PARTS_INVENTORY` | 10 | `id` (PT001–PT010) |
| `BRANDS` | 10 | `id` (B001–B010) |
| `SURVEYS` | 2 | `id` (SV001–SV002) |
| `AI_INSIGHTS` | 5 | `id` (AI001–AI005) |
| `PLATFORM_KPIS` | 1 object | n/a |

### Cross-links

Entities reference each other by foreign-key ID fields (`customerId`, `productId`, `orderId`, `caseId`, `technicianId`, `centerId`, `linkedJobId`). Helper functions (`getCustomer`, `getCase`, `getProduct`, `getOrder`, `getTechnician`, `getCenter`, `getCasesForCustomer`, etc.) perform in-memory lookups by filtering the arrays.

There is no relational database. Referential integrity is not enforced — it relies on seed data being internally consistent.

### Secondary data sources

- `src/lib/data.js` — consumer-facing service catalogue (service types, pricing, descriptions) used by the customer app shell.
- `src/lib/pincodes.js` — pincode to city/area mapping for service availability checks.
- `src/lib/engineerLoad.js` — engineer load calculation helpers for the engineer-ops view.
- `src/lib/sla.js` — SLA display helpers (time remaining, breach formatting).
- `src/lib/translations.js` — i18n strings (English only in current seed).

---

## 8. Implementation Status

| Capability | Status | Notes |
|---|---|---|
| Customer 360 profile | Working | Renders all linked entities from seed data |
| Omnichannel inbox | Simulated | Renders seed conversations; no real channel |
| Case management (list, detail, status display) | Working | Full UI; no persistent writes |
| New case creation | Simulated | Form exists; no data persistence |
| Case assignment (UI) | Simulated | Dropdown selects technician; no persist |
| SLA tracking (display) | Simulated | Pre-computed in seed; no live timer |
| Ticket management | Working | Tickets displayed in case detail |
| Dispatch console | Simulated | Shows technicians, jobs; assign modal UI only |
| Promise engine / slot calculation | Missing | No available-slot logic implemented |
| Job scheduling | Simulated | Jobs pre-seeded; no runtime scheduling |
| Technician tracking (live map) | Missing | lat/lng in data; no map rendered |
| Visit / job execution (technician mobile) | Missing | No mobile technician view |
| Spare parts inventory (display) | Working | PARTS_INVENTORY rendered correctly |
| Parts reservation / ordering | Simulated | Reserved counts in seed; no real ordering |
| Surveys (display and responses) | Working | Survey questions and responses rendered |
| NPS-triggered recovery | Simulated | Recovery case CS006 pre-seeded; not auto-triggered at runtime |
| AI insights (display) | Working | AI_INSIGHTS rendered on /ops/ai |
| AI assignment scoring | Simulated | Score pre-computed in AI_INSIGHTS seed |
| Fraud review | Simulated | Fraud AI_INSIGHTS displayed; no detection logic |
| Leadership dashboard / KPIs | Simulated | PLATFORM_KPIS is a static object |
| Brand P&L | Simulated | BRANDS with economics pre-seeded |
| Admin / rules / templates | Simulated | Static stubs; no editing |
| Authentication / RBAC | Missing | No real auth; all routes publicly accessible |
| Event processing | Missing | No event bus |
| Audit trail | Missing | No log storage |
| Payment integration | Missing | Not in scope / not started |
| Maps / location | Missing | Data fields present; no rendering |
| WhatsApp API | Missing | wa.me links only |
| Email / phone integration | Missing | Conversation records only |
| Data persistence | Missing | All data resets on page reload |
