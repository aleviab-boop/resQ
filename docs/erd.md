# resQ Ops Platform — Entity Relationship Document

> All entities are defined in `src/lib/platformData.js` as static JavaScript arrays. There is no relational database. Cross-entity links use string ID fields; referential integrity is maintained by seed data consistency, not by a constraint system.

---

## Entity Definitions

### Entity: CUSTOMER

**Fields:** `id`, `name`, `phone`, `email`, `address`, `city`, `state`, `pincode`, `since` (date of first purchase), `tier` (Bronze / Silver / Gold / Platinum), `totalSpend` (lifetime in ₹), `nps` (last known NPS score 0–10, nullable), `carePlan` (boolean — active annual care plan), `tags` (string array)

**Relationships:**
- HAS_MANY Products (via `PRODUCTS[].customerId`)
- HAS_MANY Orders (via `ORDERS[].customerId`)
- HAS_MANY Cases (via `CASES[].customerId`)
- HAS_MANY Conversations (via `CONVERSATIONS[].customerId`)

**Created when:** First order is placed, or an agent manually creates a profile from a phone / walk-in contact.

**Valid states (descriptive, not a state machine):**
- *Active* — has recent cases or orders; NPS ≥ 7 or no NPS on file
- *At-risk* — NPS 4–6, tagged `at-risk` or `pending-recovery`
- *Churned* — no activity in 12+ months (inferred; not tracked as a field)

**Seed records:** 6 (C001–C006)

---

### Entity: PRODUCT

**Fields:** `id`, `customerId`, `orderId`, `brand` (manufacturer name), `model`, `type` (Air Conditioner / Refrigerator / Washing Machine / LED TV), `serial` (manufacturer serial number), `purchaseDate`, `warrantyExpiry`, `installDate` (nullable until installed), `status`

**Relationships:**
- BELONGS_TO Customer (via `customerId`)
- BELONGS_TO Order (via `orderId`)
- HAS_MANY Cases (via `CASES[].productId`)

**Created when:** An order is placed. `installDate` is populated when the installation job completes.

**Valid states:**
- `active` — installed and in service
- `pending-installation` — delivered but installation case not yet resolved

**Seed records:** 8 (P001–P008)

---

### Entity: ORDER

**Fields:** `id`, `customerId`, `productId`, `date` (order placed date), `amount` (₹), `status`, `deliveryDate`, `installDate` (nullable), `deliveryPartner`, `channel` (online / store)

**Relationships:**
- BELONGS_TO Customer (via `customerId`)
- HAS_ONE Product (via `productId`)
- HAS_MANY Cases (via `CASES[].orderId`)

**Created when:** Customer places an order on Reliance Digital or JioMart (online or in-store).

**Valid states:**
- `completed` — delivered and installed
- `delivered-pending-install` — physical delivery confirmed; installation outstanding

**Seed records:** 8 (ORD001–ORD008)

---

### Entity: CASE

**Fields:** `id`, `customerId`, `productId`, `orderId`, `type` (installation / repair / service / maintenance / recovery), `title`, `status`, `priority` (high / medium / low), `channel` (whatsapp / app / phone / email / internal), `slaHours`, `slaDeadline` (ISO timestamp), `slaBreached` (boolean), `createdAt`, `updatedAt`, `assignedTo` (technician id), `centerId`, `description`, `tags` (string array)

**Relationships:**
- BELONGS_TO Customer (via `customerId`)
- BELONGS_TO Product (via `productId`)
- BELONGS_TO Order (via `orderId`)
- ASSIGNED_TO Technician (via `assignedTo`)
- HANDLED_BY ServiceCenter (via `centerId`)
- HAS_MANY Tickets (via `TICKETS[].caseId`)
- HAS_MANY Jobs (via `JOBS[].caseId`)
- HAS_ONE Conversation (via `CONVERSATIONS[].caseId`)
- MAY_TRIGGER Survey response

**Created when:** Agent opens a case from a customer interaction, or system auto-creates on delivery/NPS trigger.

**Valid states:**
- `open` — created, not yet actioned
- `in-progress` — technician assigned, work underway
- `parts-awaited` — diagnosis done; waiting for part to arrive
- `scheduled` — technician slot confirmed, visit not yet started
- `resolved` — work completed; pending survey
- `completed` — survey received; case archived (same colour as resolved in UI)
- `recovery` — auto-created from low NPS; pending callback
- `closed` — fully closed (referenced in UI colour map; no seed records in this state)

**Seed records:** 8 (CS001–CS008)

---

### Entity: TICKET

**Fields:** `id`, `caseId`, `title`, `type` (verification / scheduling / parts-check / diagnosis / quote / parts-order / recovery / compensation), `status` (done / open / pending-approval / in-transit), `owner` (agent name, team name, or technician id), `team` (CX / OPS / FIELD), `createdAt`

**Relationships:**
- BELONGS_TO Case (via `caseId`)

**Created when:** An agent or system identifies a discrete action item within a case.

**Seed records:** 10 (TK001–TK010)

---

### Entity: JOB

**Fields:** `id`, `caseId`, `technicianId`, `type` (diagnosis / repair / installation / diagnosis+repair / maintenance), `status` (scheduled / in-progress / completed), `scheduledDate`, `timeSlot`, `address`, `city`, `pincode`, `visits` (array of Visit objects — see below), `estimatedDuration` (mins), `actualDuration` (mins, nullable), `travelEta` (mins, nullable)

**Relationships:**
- BELONGS_TO Case (via `caseId`)
- ASSIGNED_TO Technician (via `technicianId`)
- HAS_MANY Visits (nested array)
- USES Parts (via `visits[].partsUsed` SKU references)

**Created when:** Dispatch assigns a technician to a case with a confirmed time slot.

**Valid states:**
- `scheduled` — slot confirmed; visit not started
- `in-progress` — technician on site
- `completed` — visit finished and confirmed by customer

**Seed records:** 5 (JB001–JB005)

---

### Entity: VISIT

A nested object within Job. Not a top-level collection.

**Fields:** `visitNo`, `date`, `status` (in-progress / completed), `techId`, `arrivedAt` (HH:MM), `diagnosis` (text), `partsUsed` (array of part SKUs), `evidence` (array of filenames/URLs), `customerConfirmed` (boolean), `notes`

**Relationships:**
- BELONGS_TO Job (embedded)
- PERFORMED_BY Technician (via `techId`)

---

### Entity: TECHNICIAN

**Fields:** `id`, `name`, `phone`, `centerId`, `skills` (array of product type strings), `rating` (float 0–5), `jobs` (lifetime job count), `exp` (e.g., "6 yrs"), `status` (available / on-job / offline), `shift` (e.g., "09:00–18:00"), `lat` (nullable), `lng` (nullable), `activeJobId` (nullable), `badge` (Top Rated / Expert / Pro / Verified)

**Relationships:**
- BELONGS_TO ServiceCenter (via `centerId`)
- HAS_MANY Jobs (via `JOBS[].technicianId`)
- ASSIGNED_TO Cases (via `CASES[].assignedTo`)

**Valid states:**
- `available` — shift active, no current job
- `on-job` — currently executing a visit
- `offline` — off-shift or unavailable

**Seed records:** 8 (T001–T008)

---

### Entity: SERVICE_CENTER

**Fields:** `id`, `name`, `city`, `address`, `pincodes` (array of pincodes in catchment), `manager` (name), `capacity` (max daily jobs), `activeEngineers` (current count), `phone`

**Relationships:**
- HAS_MANY Technicians (via `TECHNICIANS[].centerId`)
- HAS_MANY Parts (via `PARTS_INVENTORY[].centerId`)
- HANDLES Cases (via `CASES[].centerId`)

**Seed records:** 5 (SC001–SC005)

---

### Entity: PART

**Fields:** `id`, `name`, `sku`, `category` (AC / WM / Refrigerator / LED TV), `centerId`, `stock` (units on hand), `reserved` (units committed to active jobs), `reorderAt` (reorder trigger threshold), `demand` (monthly demand estimate), `price` (₹), `ageMonths`, `condition` (Good / In Transit / Defective / Out of Stock), `linkedJobId` (nullable — job this part is reserved for)

**Relationships:**
- BELONGS_TO ServiceCenter (via `centerId`)
- LINKED_TO Job (via `linkedJobId`, optional)

**Valid states (condition field):**
- `Good` — in stock and serviceable
- `In Transit` — ordered, not yet received
- `Defective` — in stock but not usable (should be written off)
- `Out of Stock` — zero stock, no open order

**Seed records:** 10 (PT001–PT010)

---

### Entity: CONVERSATION

**Fields:** `id`, `customerId`, `caseId`, `channel` (whatsapp / phone / email / app / internal), `status` (mirrors case status), `agent` (current handling agent name), `createdAt`, `updatedAt`, `messages` (array of message objects), `templates` (referenced template IDs), `internalNote`

**Message object fields:** `id`, `from` (customer / agent / system), `text`, `time`, `channel`, `agent` (nullable)

**Relationships:**
- BELONGS_TO Customer (via `customerId`)
- BELONGS_TO Case (via `caseId`)

**Created when:** A customer contacts resQ through any channel (first message in thread creates the conversation record).

**Seed records:** 4 (CV001–CV004; 4 of the 8 cases have seeded conversations)

---

### Entity: BRAND

**Fields:** `id`, `name`, `logo` (emoji placeholder), `category` (Own Brand / Electronics / White Goods / HVAC), `jobsMonth` (jobs this month), `paidPerJob` (₹ brand pays per job; 0 for own brand), `actualCost` (₹ resQ's actual cost per job), `slaHours` (contracted SLA), `slaBreaches` (count this month), `nps` (brand-attributed NPS), `revenue` (₹ MTD from brand contract), `isOwn` (boolean), `contractStatus` (N/A / Active / Review), `flagged` (boolean), `flagReason` (string, nullable)

**Relationships:**
- Referenced by PRODUCTS via brand name string (no foreign key — denormalised)

**Seed records:** 10 (B001–B010; includes Reliance own-brand)

---

### Entity: SURVEY

**Fields:** `id`, `name`, `type` (service-nps / store-nps), `trigger` (case-resolved / order-completed), `active` (boolean), `questions` (array), `responses` (array of SurveyResponse), `avgNps`, `responseRate`

**Question object fields:** `id`, `type` (nps / scale / text), `text`, `scale` (nullable)

**Relationships:**
- HAS_MANY SurveyResponses (nested `responses` array)

**Seed records:** 2 (SV001 post-service NPS, SV002 store purchase NPS)

---

### Entity: SURVEY_RESPONSE

Nested within Survey. Not a top-level collection.

**Fields:** `id`, `caseId`, `customerId`, `answers` (object keyed by question id), `submittedAt`, `triggeredRecovery` (boolean, optional)

**Relationships:**
- BELONGS_TO Survey (embedded)
- REFERENCES Case (via `caseId`)
- REFERENCES Customer (via `customerId`)
- MAY_CREATE Case of type `recovery` (when `triggeredRecovery = true`)

**Seed records:** 2 (one NPS 9 for CS007, one NPS 3 for CS005 that triggered CS006 recovery)

---

## Relationship Map

```
CUSTOMER ──< ORDER ──── PRODUCT
    │            │           │
    │            └──< CASE ──┘
    │                  │
    ├──────────────────┤
    │                  │
    └──< CONVERSATION  ├──< TICKET
              │        │
              │        ├──< JOB ──< VISIT
              │        │       └── uses ──> PART
              │        │
              │        ├── assigned to ──> TECHNICIAN ──> SERVICE_CENTER
              │        │                                       │
              │        └── handled by ──────────────────────────
              │
              └── triggers ──> SURVEY_RESPONSE
                                     │
                                     └── may create ──> CASE (type: recovery)

BRAND ──── (referenced by PRODUCT.brand — name string, not FK)
         └── BRAND_OPS dashboard aggregates brand economics separately

AI_INSIGHTS ── references CASE, TECHNICIAN, PART (by id in recommendation text)
PLATFORM_KPIS ── pre-aggregated snapshot; no live link to entity arrays

PART ──── PART.centerId ──> SERVICE_CENTER
     └─── PART.linkedJobId ──> JOB (optional, when reserved)
```

### Cardinality summary

| Relationship | Cardinality |
|---|---|
| Customer → Orders | 1 : N |
| Customer → Products | 1 : N |
| Customer → Cases | 1 : N |
| Customer → Conversations | 1 : N |
| Order → Product | 1 : 1 |
| Order → Cases | 1 : N |
| Case → Tickets | 1 : N |
| Case → Jobs | 1 : N |
| Case → Conversation | 1 : 0..1 |
| Job → Visits | 1 : N (embedded) |
| Job → Parts (used) | M : N (via SKU strings in Visit.partsUsed) |
| Technician → Jobs | 1 : N |
| Technician → ServiceCenter | N : 1 |
| ServiceCenter → Parts | 1 : N |
| Survey → SurveyResponses | 1 : N (embedded) |
| SurveyResponse → Case | N : 1 |
| Brand → Products | 1 : N (denormalised by name) |
