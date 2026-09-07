---
name: enquiry-module
id: mod_enquiry_003
description: >
  Full-squad expert skill for the EduManage Enquiry / CRM Module. Auto-activates when
  the user mentions "enquiry", "enquiries", "follow-up", "CRM", "pipeline", "prospect",
  or types /enquiry.
  Covers PM requirements, backend API, Prisma schema, frontend components, status
  pipeline, follow-up scheduling, error handling, testing, and proactive suggestions.
triggers:
  - enquiry
  - enquiries
  - follow-up
  - followup
  - crm
  - pipeline
  - prospect
  - /enquiry
---

# Enquiry Module — Full Squad Skill

> **Read `../shared-reference/common-checklist.md` first.** All universal rules (auth,
> org scoping, error handling, testing) live there. This file adds Enquiry-specific context.

---

## Related Skills — Apply These When Working in the Enquiry Module

| Task Type | Skill to Use |
|---|---|
| Building Kanban board, dialogs, status badges | → `frontend-design` skill |
| Tailwind classes, responsive pipeline layout | → `tailwind-4-docs` skill |
| UI review, accessibility for mobile field staff | → `web-design-guidelines` skill |
| Writing status transition API, follow-up endpoints | → `nodejs-backend-patterns` skill |
| Adding `followUpNote`, `lastContactedAt`, activity log model | → `prisma-database-setup` skill |

---

## Squad Context

| Role | Responsibility |
|---|---|
| 🔴 PM | Pipeline conversion, follow-up discipline, admission funnel |
| 🔧 Senior Engineer | Status state machine, follow-up scheduling, API filters |
| 🗄️ DBA | Status indexes, date range queries, audit trail |
| 🧪 QA | Status transitions, duplicate detection, multi-branch scoping |

---

## Module Overview

**Business purpose:** Track every incoming enquiry from first contact to admission (or lost).

**Status Pipeline (State Machine):**
```
new → contacted → interested → admitted
                             → lost
```
- Status can only move **forward** in the pipeline
- `admitted` status should trigger (or suggest) creating a Student record
- `lost` is terminal — enquiry cannot be re-opened

**Key entities:**
- `Enquiry` — the CRM record for an incoming prospect
- `enquiryId` — auto-generated display ID (ENQ/YY/NNNNN)

---

## Database (Prisma) Rules

### `Enquiry` Model — Required Fields
```prisma
model Enquiry {
  id              String   @id @default(cuid())
  enquiryId       String?  @unique  // ENQ/YY/NNNNN
  enquiryYear     Int?
  enquirySequence Int?

  firstName       String
  lastName        String
  mobile          String
  email           String?
  description     String?
  status          String   @default("new") // new, contacted, interested, admitted, lost
  source          String?  // web, referral, walk-in, social, campaign

  followUpDate    DateTime?
  followUpNote    String?
  lastContactedAt DateTime?

  organizationId  String
  branchId        String
  courseId        String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  @@unique([enquiryYear, enquirySequence])
  @@index([organizationId])
  @@index([branchId])
  @@index([status])
  @@index([followUpDate])
}
```

### Display ID
Format: `ENQ/YY/NNNNN` (e.g. `ENQ/26/00031`)
Generated at creation time, scoped to organization.

### Follow-up Indexing
Always index `followUpDate` — it is used for "due today" and "overdue" dashboard widgets.

---

## API Routes

### File Locations
```
src/app/api/enquiries/
  route.ts         GET (list with filters) | POST (create)
  [id]/
    route.ts       GET | PATCH (update status/followup) | DELETE (soft)
```

### Enquiry List — GET `/api/enquiries`
Supported filters:
- `search` — name, mobile, email
- `status` — new | contacted | interested | admitted | lost
- `branchId`
- `source`
- `followUpDue` — boolean, returns only entries where `followUpDate <= today`
- `page`, `limit`

### Enquiry Create — POST `/api/enquiries`
1. Validate with Zod
2. Check for duplicate mobile within org (warn, don't block)
3. Generate `enquiryId` sequentially
4. Create record
5. Return full enquiry

### Enquiry Update — PATCH `/api/enquiries/[id]`
Allowed updates: `status`, `followUpDate`, `followUpNote`, `lastContactedAt`, `description`

**Status transition validation:**
```typescript
const VALID_TRANSITIONS: Record<string, string[]> = {
  new: ['contacted', 'lost'],
  contacted: ['interested', 'lost'],
  interested: ['admitted', 'lost'],
  admitted: [],  // terminal
  lost: [],      // terminal
}

if (!VALID_TRANSITIONS[current].includes(newStatus)) {
  return { success: false, error: `Cannot move from ${current} to ${newStatus}` }
}
```

---

## Backend Service Layer

**File:** `src/lib/services/enquiryService.ts`

```typescript
getEnquiries(orgId, filters?, pagination?)
getEnquiryById(id, orgId)
createEnquiry(data, orgId, branchId)
updateEnquiry(id, updates, orgId)   // validates status transitions
softDeleteEnquiry(id, orgId)
getFollowUpsDueToday(orgId)         // for dashboard widget
getPipelineCounts(orgId, branchId?) // counts per status for funnel chart
```

---

## Frontend Components

### File Structure
```
src/app/admin/enquiry/
  page.tsx              list page with pipeline view + table
src/components/admin/enquiry/
  EnquiryCard.tsx       kanban card or table row
  EnquiryFilters.tsx    filter bar
  EnquiryDialog.tsx     create/edit modal
  StatusBadge.tsx       colored status pill
  FollowUpCalendar.tsx  optional: calendar view of follow-ups
```

### Pipeline View Requirements
The enquiry page must offer two views:
1. **Kanban Board** — columns per status, draggable cards (or click-to-move)
2. **Table View** — sortable, filterable, with bulk actions

### Status Badge Colors
```
new         → gray
contacted   → blue
interested  → yellow/amber
admitted    → green
lost        → red
```

### Follow-up Due Highlighting
Rows/cards where `followUpDate <= today` should show:
- Red dot indicator on the card
- "Follow up today" label
- Sorted to top of list

---

## Error Handling (Enquiry-Specific)

| Scenario | Response |
|---|---|
| Invalid status transition | Toast: "Cannot move from [A] to [B]. Valid next steps: [X, Y]" |
| Duplicate mobile (same org) | Warning toast (not error): "Another enquiry exists for this number. Proceed?" |
| Missing name + mobile | Validation error before API call |
| Enquiry not found | Redirect to list with error toast |

---

## Testing Checklist (Enquiry Module)

### Pipeline Integrity
- [ ] New enquiry gets unique `enquiryId`
- [ ] Status can only advance (never `admitted → new`)
- [ ] `admitted` enquiries prompt "Create Student Record" flow
- [ ] `lost` status is visually distinct and not editable

### Follow-up
- [ ] Setting `followUpDate` saves to DB and appears on calendar
- [ ] Overdue follow-ups highlighted in red
- [ ] Dashboard "Follow-up Due" count updates correctly

### Multi-tenant
- [ ] Branch Admin sees only their branch enquiries
- [ ] `enquiryId` sequences are per-organization

### UI
- [ ] Both Kanban and Table views render correctly
- [ ] Filters persist across page navigation
- [ ] Empty state per status column in Kanban
- [ ] Mobile layout usable for field admins

---

## Proactive Suggestion Template (Enquiry Module)

```
📋 SQUAD BRIEF — Enquiry Module / [Feature]

🔴 PM: [How does this improve conversion or follow-up discipline?]
🔧 Engineer: [Status state machine impact, API filter changes, UI updates]
🗄️ DBA: [Index changes for follow-up queries?]
🧪 QA: [Test status transitions + duplicate handling + multi-branch scoping]

❓ Choose your approach:
  A) Simple status update (no validation)
  B) Validated state machine with transition rules ← recommended
  C) Full CRM with activity log (higher effort)
```

---

## Known Enquiry Module Gaps (Track These)

- [ ] Activity log — no history of who changed what and when
- [ ] Follow-up reminders (email/WhatsApp) — not connected
- [ ] "Convert to Student" one-click flow — not implemented
- [ ] Source attribution analytics — no conversion-by-source report
- [ ] Bulk import from Google Sheets / CSV — not built
- [ ] Referral partner linkage on enquiry — model supports it, UI doesn't

---

## Admin Action Operations (What Exists in the Real App)

| Action | Trigger | Endpoint / Component |
|---|---|---|
| `create_enquiry` | "Add Enquiry" button | `POST /api/enquiries` |
| `update_status` | Status dropdown in dialog | `PATCH /api/enquiries/[id]` |
| `schedule_followup` | "Follow Up" date field | `PATCH /api/enquiries/[id]` |
| `view_enquiry` | Row click or card expand | `GET /api/enquiries/[id]` |
| `delete_enquiry` | Delete (soft) | `DELETE /api/enquiries/[id]` |

**Missing critical actions (implement these):**
- `convert_to_student` — one-click pre-fill student form from enquiry data
- `send_followup_reminder` — WhatsApp/email nudge
- `log_activity` — record status change with timestamp + who
- `export_pipeline_report` — CSV of enquiry funnel by status

---

## Security Checklist (Enquiry Module)

- [ ] Enquiry list filters by `organizationId` from JWT — no cross-org leaks
- [ ] Status transition is validated server-side (not just in UI) — `PATCH /api/enquiries/[id]`
- [ ] Branch Admin cannot see enquiries from other branches
- [ ] Mobile/email not exposed in list response unless needed
- [ ] Soft-delete applied — no hard deletes on enquiry records
- [ ] Duplicate mobile warning is advisory only — does not auto-merge records

---

## Automated Test Commands

```bash
# Run enquiry module tests
npm run test -- --testPathPattern="enquir"

# Test status machine transitions
npm run test -- --testPathPattern="enquiry-status"

# Test follow-up date queries
npm run test -- --testPathPattern="followup"
```
