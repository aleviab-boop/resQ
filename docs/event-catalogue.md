# resQ Ops Platform — Event Catalogue

> **Implementation note:** The platform does not have a live event bus. Events listed here are conceptual — they describe what *should* happen in a production system. Currently, no code publishes or subscribes to these events. Some side effects are partially simulated by pre-seeded data (e.g., the recovery case CS006 exists as if `survey.nps_low` had fired). Where a behaviour is implemented, it is noted.

---

## Case Events

### case.created

**Trigger:** An agent submits the new case form (`/ops/cases/new`), or the system auto-creates a case on order delivery (installation) or NPS response below threshold (recovery).

**Payload:**
```
caseId, customerId, productId, orderId, type, priority, channel, slaHours, slaDeadline, createdAt, createdBy
```

**Consumers:**
- Case management list (`/ops/cases`) — new row appears
- Omnichannel inbox (`/ops/inbox`) — new conversation thread
- SLA engine — starts SLA countdown timer
- Notification service — sends acknowledgement to customer (WhatsApp / email / app)
- Dispatch console — makes case available for assignment

**Side effects:**
- CASES array gains a new record
- CONVERSATIONS array gains a new record (linked to case)
- SLA timer starts (currently: slaDeadline pre-seeded; no live timer)

**AI relevance:** case.created triggers AI assignment scoring — AI selects best technician match based on skills, proximity, and workload. Currently simulated in AI_INSIGHTS[AI003].

**Current status:** Form UI exists at `/ops/cases/new`. No data is persisted on submit.

---

### case.assigned

**Trigger:** Dispatch selects a technician for a case (via the assign modal in `/ops/dispatch` or the case detail view).

**Payload:**
```
caseId, technicianId, centerId, assignedAt, assignedBy
```

**Consumers:**
- Dispatch console — technician card updates to show active case
- Technician mobile — technician receives job notification
- Notification service — customer notified of technician name and ETA

**Side effects:**
- CASES[].assignedTo updated to technicianId
- CASES[].status → in-progress (if previously open)
- TECHNICIANS[].activeJobId updated

**AI relevance:** AI assignment recommendation (AI_INSIGHTS type `assignment`) is consumed here to suggest the best match. AI003 recommends T005 for CS001.

**Current status:** Assign modal UI exists in `/ops/dispatch`. No state change persists.

---

### case.status_changed

**Trigger:** Agent changes case status in the case detail view, or a system event (job completion, part arrival, survey submission) transitions the case.

**Payload:**
```
caseId, fromStatus, toStatus, changedAt, changedBy, reason
```

**Consumers:**
- Case detail view — status badge updates
- SLA engine — checks if new status is terminal (resolved/completed/closed) and stops timer
- Notification service — customer notified of progress
- Leadership dashboard — KPI counters recalculate

**Side effects:**
- CASES[].status updated
- CASES[].updatedAt refreshed

**AI relevance:** Transitions to `parts-awaited` trigger AI demand forecasting. Transitions to `resolved` trigger survey dispatch.

**Current status:** Status colour map and display are working. No actual state mutation on user action.

---

### case.sla_breached

**Trigger:** SLA timer crosses the `slaDeadline` timestamp with the case still in an active state.

**Payload:**
```
caseId, customerId, slaDeadline, breachedAt, hoursOverdue, priority
```

**Consumers:**
- Case list — SLA breach badge displayed (working from pre-seeded `slaBreached: true`)
- AI operations — anomaly detection surfaces breach patterns (AI001)
- Notification service — internal alert to team lead / manager
- Leadership dashboard — slaBreachRate KPI updates

**Side effects:**
- CASES[].slaBreached = true
- CASES[].priority may auto-escalate to `high`
- AI insight created if breach pattern detected (multiple breaches in same area)

**AI relevance:** AI001 surfaces a pattern of SLA breaches in Andheri AC installations. The breach flag is the primary signal. Confidence 0.89.

**Current status:** `slaBreached` is pre-set in seed data. SLA countdown display is working (`src/lib/sla.js`). No runtime timer fires.

---

### case.resolved

**Trigger:** Agent marks case as resolved after job completion and customer confirmation.

**Payload:**
```
caseId, customerId, productId, resolvedAt, resolvedBy, resolution
```

**Consumers:**
- Survey service — dispatches post-service NPS survey (SV001 trigger: `case-resolved`)
- Customer notification — resolution confirmation sent
- Leadership dashboard — FVR and resolution time KPIs update
- Brand Ops — job counted toward brand's monthly job total

**Side effects:**
- CASES[].status → resolved (then completed when survey received)
- SURVEY.responses gains a new entry (if customer responds)

**AI relevance:** Resolution time feeds into AI benchmark models for SLA optimisation.

**Current status:** CS005, CS007 are seeded as resolved/completed. Survey SV001 has 2 pre-seeded responses.

---

## Job Events

### job.scheduled

**Trigger:** Dispatch creates a job record with a confirmed technician and time slot.

**Payload:**
```
jobId, caseId, technicianId, scheduledDate, timeSlot, address, pincode, estimatedDuration
```

**Consumers:**
- Dispatch console — job block appears in technician schedule grid
- Technician mobile — new job appears in queue
- Notification service — customer receives slot confirmation

**Side effects:**
- JOBS array gains a new record with status `scheduled`
- CASES[].status → scheduled

**AI relevance:** Job scheduling data feeds AI utilisation forecasting and workload balancing.

**Current status:** Jobs are pre-seeded. Dispatch UI shows schedule grid. No new job creation on user action.

---

### job.started

**Trigger:** Technician taps "Start Job" on mobile (or dispatch marks job as started). Technician is en route or on site.

**Payload:**
```
jobId, caseId, technicianId, startedAt, techLat, techLng
```

**Consumers:**
- Tracking UI — customer can see technician location update
- Dispatch console — technician status → on-job
- CASES[].status → in-progress

**Side effects:**
- JOBS[].status → in-progress
- JOBS[].visits gains a new Visit object with status `in-progress`
- TECHNICIANS[].status → on-job, TECHNICIANS[].activeJobId set

**AI relevance:** Live location updates would feed ETA recalculation and delay prediction.

**Current status:** JB003 seeded as `in-progress` with one incomplete visit. No technician mobile view implemented.

---

### job.completed

**Trigger:** Technician submits job report on mobile: diagnosis text, parts used, customer signature/confirmation.

**Payload:**
```
jobId, caseId, technicianId, completedAt, diagnosis, partsUsed, customerConfirmed, evidenceUrls, actualDuration
```

**Consumers:**
- Case management — triggers case status transition
- Parts service — parts consumed, stock decremented
- Invoice / billing — generates job cost record
- Survey service — if case resolved, triggers NPS survey

**Side effects:**
- JOBS[].status → completed
- JOBS[].visits last entry status → completed, customerConfirmed set
- JOBS[].actualDuration set
- PARTS_INVENTORY[].stock decremented for each part in partsUsed
- TECHNICIANS[].status → available, activeJobId → null

**AI relevance:** Completion data (actual vs estimated duration, parts used, revisit count) feeds technician performance scoring and fraud detection.

**Current status:** JB001, JB004 seeded as completed with visit records. No actual job completion workflow implemented.

---

### job.failed

**Trigger:** Technician reports inability to complete the job (customer absent, parts mismatch, equipment incompatible).

**Payload:**
```
jobId, caseId, technicianId, failedAt, failureReason, attemptedVisit
```

**Consumers:**
- Dispatch console — job returned to unassigned queue
- Notification service — customer alerted, rescheduling prompted
- Fraud detection — repeated job failures on same case are a fraud signal

**Side effects:**
- JOBS[].status → failed (not yet a valid status in seed data)
- CASES[].status may revert to open or scheduled
- TECHNICIANS[].status → available

**AI relevance:** job.failed + job.failed on same case = potential multi-trip fraud flag (similar to AI004 pattern).

**Current status:** `failed` status not present in seed data. No failure workflow implemented.

---

## Visit Events

### visit.completed

**Trigger:** Embedded within job.completed. Each visit within a job generates a completion record.

**Payload:**
```
visitNo, jobId, caseId, techId, arrivedAt, diagnosis, partsUsed, evidenceUrls, customerConfirmed, notes
```

**Consumers:**
- Job record — visit appended to visits array
- Parts service — partsUsed triggers consumption
- Quality monitor — arrivedAt vs scheduled slot calculates punctuality

**Side effects:**
- JOBS[].visits gains or updates a Visit entry

**AI relevance:** Visit punctuality data (arrivedAt vs slot start) feeds technician performance and delay prediction. Late arrival on CS005 is the root cause of the NPS 3 score and recovery case CS006.

**Current status:** Visit records pre-seeded in JB001, JB003, JB004. No runtime capture.

---

## Technician Events

### technician.status_changed

**Trigger:** Technician app reports status change (clocking in, job start, job end, going offline).

**Payload:**
```
technicianId, fromStatus, toStatus, changedAt, lat, lng
```

**Consumers:**
- Dispatch console — technician card status dot updates
- Engineer Ops — availability heatmap refreshes
- AI assignment engine — re-evaluates available technicians

**Side effects:**
- TECHNICIANS[].status updated
- TECHNICIANS[].lat, .lng updated (if location provided)
- TECHNICIANS[].activeJobId updated

**AI relevance:** Real-time status is the primary input to AI assignment scoring (skill + proximity + availability).

**Current status:** Status values pre-seeded. No real-time updates. No technician mobile app.

---

## Parts Events

### part.reserved

**Trigger:** A job is scheduled that requires a specific part; dispatch reserves the part at the service centre.

**Payload:**
```
partId, sku, jobId, caseId, centerId, quantity, reservedAt
```

**Consumers:**
- Parts management (`/parts`) — reserved count increments, available stock decrements
- AI demand forecasting — updates demand signal

**Side effects:**
- PARTS_INVENTORY[].reserved += quantity
- If stock - reserved < reorderAt → triggers reorder alert

**AI relevance:** AI002 forecasts drum bearing demand based on active reservations and historical case patterns.

**Current status:** PT003 and PT006 seeded with `reserved: 1`. No runtime reservation logic.

---

### part.dispatched

**Trigger:** Parts manager confirms a part has been sent from central warehouse or another service centre.

**Payload:**
```
partId, sku, fromLocation, toCenterId, quantity, dispatchedAt, eta
```

**Consumers:**
- Parts management — condition → In Transit
- Case management — if case is `parts-awaited`, ETA communicated to customer

**Side effects:**
- PARTS_INVENTORY[].condition → In Transit
- Notification to customer: estimated arrival date

**AI relevance:** In-transit parts feed resupply time estimates.

**Current status:** PT003 (drum bearing) seeded as condition `In Transit` linked to JB004.

---

### part.consumed

**Trigger:** visit.completed with non-empty partsUsed list.

**Payload:**
```
partId, sku, jobId, visitNo, quantity, consumedAt
```

**Consumers:**
- Parts management — stock decremented, reserved decremented
- Billing — part cost added to job invoice
- Demand forecasting — consumption signal logged

**Side effects:**
- PARTS_INVENTORY[].stock -= quantity
- PARTS_INVENTORY[].reserved -= quantity

**AI relevance:** Consumption history is the primary training signal for demand forecasting (AI002).

**Current status:** partsUsed arrays exist in visit records (e.g., JB003 uses PCB-WHP-AC-01). No actual stock decrement logic runs.

---

## Conversation Events

### conversation.received (per channel)

**Trigger:** Inbound message arrives from customer via WhatsApp, app, email, or phone (as call summary).

**Payload:**
```
conversationId, caseId, customerId, channel, messageId, from, text, timestamp
```

**Consumers:**
- Omnichannel inbox — thread updates with new message, moves to top of queue
- Case management — updatedAt refreshed
- AI triage — message classified (intent: complaint / query / confirmation)
- Notification service — agent receives internal alert

**Side effects:**
- CONVERSATIONS[].messages gains new message entry
- CONVERSATIONS[].updatedAt refreshed
- If no open case: case.created may fire

**AI relevance:** Message text classification identifies urgency, intent, and sentiment to assist agent triage. Not implemented — all conversation records are pre-seeded hand-written messages.

**Current status:** `/ops/inbox` renders conversations from seed data. No real channel integration.

---

## Survey Events

### survey.submitted

**Trigger:** Customer completes and submits a survey (via WhatsApp link, app notification, or email).

**Payload:**
```
surveyId, responseId, caseId, customerId, answers, npsScore, submittedAt
```

**Consumers:**
- Survey analytics (`/ops/surveys`) — response added to aggregate
- NPS monitor — checks if npsScore < threshold (≤ 6)
- Case management — case status → completed

**Side effects:**
- SURVEYS[].responses gains a new SurveyResponse
- SURVEYS[].avgNps recalculated
- If NPS ≤ 6 → survey.nps_low fires

**Current status:** SV001 has 2 pre-seeded responses. `/ops/surveys` renders them. No real survey dispatch or submission.

---

### survey.nps_low

**Trigger:** survey.submitted where NPS score ≤ 6 (configurable threshold; 6 is the current seed threshold).

**Payload:**
```
surveyId, responseId, caseId, customerId, npsScore, verbatim, submittedAt
```

**Consumers:**
- Recovery engine — fires recovery.triggered
- CX team lead — internal alert
- AI operations — creates recovery AI insight (AI005)

**Side effects:**
- recovery.triggered event fires
- PLATFORM_KPIS.recoveryPending increments

**AI relevance:** AI005 monitors recovery case SLA compliance and escalates if callback is overdue.

**Current status:** CS005 NPS=3 response (r2) has `triggeredRecovery: true`. CS006 recovery case pre-seeded. No runtime trigger logic.

---

## Recovery Events

### recovery.triggered

**Trigger:** survey.nps_low fires, or agent manually opens a recovery case.

**Payload:**
```
sourceCaseId, recoveryReason, npsScore, verbatim, customerId, triggeredAt
```

**Consumers:**
- Case management — new Case of type `recovery` created
- CX assignment — recovery case assigned to senior agent
- Notification service — internal alert to team lead

**Side effects:**
- CASES gains a new Case (type: `recovery`, priority: high)
- TICKETS gains TK for senior agent callback and compensation review
- CONVERSATIONS gains a thread for internal recovery coordination

**AI relevance:** AI005 monitors overdue recovery cases and recommends escalation + goodwill gesture.

**Current status:** CS006 and CV004 are fully pre-seeded recovery records. TK009 (callback) and TK010 (compensation) are seeded as open / pending-approval.

---

## Fraud Events

### fraud.flagged

**Trigger:** Fraud detection rule fires. Rules: same technician + same address + multiple jobs same day; job marked complete without customer confirmation; parts consumed > expected for job type; IMEI/serial mismatch.

**Payload:**
```
flagId, technicianId, jobIds, caseIds, ruleTriggered, evidence, flaggedAt, confidence
```

**Consumers:**
- Fraud review (`/fraud-ops`) — flag appears in review queue
- Payment processing — job payment held pending review
- AI operations (`/ops/ai`) — high-priority AI insight created

**Side effects:**
- AI_INSIGHTS gains a new fraud-risk record
- PLATFORM_KPIS.openFraudFlags increments

**AI relevance:** AI004 flags T001 for 3 jobs at the same address on the same day. Confidence 0.76 (rules-based, not ML). Recommendation: hold payment pending manual review.

**Current status:** AI004 is a pre-seeded fraud insight. No automated detection logic runs at runtime.

---

### fraud.reviewed

**Trigger:** Fraud analyst reviews a flag and marks it resolved (legitimate) or confirmed fraud.

**Payload:**
```
flagId, reviewerId, verdict (legitimate / confirmed), notes, reviewedAt
```

**Consumers:**
- Payment processing — if legitimate, release payment; if confirmed, withhold and escalate
- Case management — if confirmed, case may be re-investigated
- PLATFORM_KPIS.openFraudFlags decremented

**Side effects:**
- AI_INSIGHTS record updated with resolution
- PLATFORM_KPIS.openFraudFlags -= 1

**Current status:** No review workflow implemented in the fraud-ops UI. The page renders flagged insights from AI_INSIGHTS seed data only.
