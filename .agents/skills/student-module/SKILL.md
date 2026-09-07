---
name: student-module
id: mod_student_001
description: >
  Full-squad expert skill for the EduManage Student Module. Auto-activates when the
  user mentions "student", "admission", "enrollment", "attendance", or types /student.
  Covers PM requirements, backend API, Prisma schema, frontend components, payment
  handling, error handling, testing, and proactive suggestions with multiple choices.
triggers:
  - student
  - students
  - admission
  - admissions
  - enrollment
  - student module
  - /student
---

# Student Module — Full Squad Skill

> **Read `../shared-reference/common-checklist.md` first.** All universal rules (auth,
> org scoping, error handling, testing) live there. This file adds Student-specific context.

---

## Related Skills — Apply These When Working in the Student Module

These existing skills are part of the student module toolkit. When working on student features, **activate and follow the relevant skill below**:

| Task Type | Skill to Use |
|---|---|
| Building any UI component, dialog, card, or page | → `frontend-design` skill |
| Writing Tailwind classes, responsive layout, dark mode | → `tailwind-4-docs` skill |
| Reviewing UI for accessibility, UX patterns, best practices | → `web-design-guidelines` skill |
| Writing API routes, service layer, auth, error handling | → `nodejs-backend-patterns` skill |
| Changing `schema.prisma`, running migrations, DB issues | → `prisma-database-setup` skill |
| Scaffolding a brand new sub-module or related model | → `new-module` skill |

> These skills complement each other. The student module skill provides the "what to build", the related skills provide the "how to build it properly".

---

## Squad Context

When this skill is active, operate as a full squad:

| Role | Responsibility |
|---|---|
| 🔴 PM | Student lifecycle, admission pipeline, data completeness |
| 🔧 Senior Engineer | API routes, service layer, component architecture |
| 🗄️ DBA | Prisma schema integrity, index planning, relations |
| 🧪 QA | Edge cases, multi-tenant scoping, payment audit trail |

**Before implementing any Student feature**, present the Proactive Suggestion Format from `common-checklist.md`.

---

## Module Overview

**Business purpose:** Manage the complete student lifecycle — from admission to graduation.

**Key entities:**
- `Student` — core record with personal, academic, and financial info
- `StudentCourse` — enrollment in a specific course
- `StudentCourseBatch` — batch assignment within a course
- `Installment` — course fee payment schedule
- `AdditionalFee` — one-off miscellaneous charges
- `Receipt` — financial audit trail for every payment
- `Attendance` — per-session attendance records

---

## Database (Prisma) Rules

### Required Fields on `Student`
```prisma
model Student {
  id                  String   @id @default(cuid())
  admissionDisplayId  String?  @unique  // ADM/YY/NNNNN
  admissionYear       Int?
  admissionSequence   Int?

  firstName           String
  lastName            String
  email               String?
  mobile              String

  organizationId      String
  branchId            String
  status              String   @default("active") // active, inactive, graduated, dropped

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  deletedAt           DateTime?

  // Relations
  studentCourses      StudentCourse[]
  additionalFees      AdditionalFee[]
  receipts            Receipt[]
  attendance          Attendance[]
}
```

### Auto-generated Display IDs (Required)
| Entity | Format | Example |
|---|---|---|
| Student | `ADM/YY/NNNNN` | `ADM/26/00042` |
| Additional Fee | `AF/YY/NNNNN` | `AF/26/00001` |
| Receipt | `RCP/YYYY/NNNNN` | `RCP/2026/01152` |

**Always generate sequentially within the same `organizationId`** — never globally.

### Index Requirements
```prisma
@@index([organizationId])
@@index([branchId])
@@index([status])
```

---

## API Routes

### File Locations
```
src/app/api/students/
  route.ts              GET (list) | POST (create)
  [id]/
    route.ts            GET (single) | PATCH (update) | DELETE (soft)
    fees/
      route.ts          POST (assign additional fee)
    attendance/
      route.ts          GET | POST
```

### Student List — GET `/api/students`
Required query params support: `search`, `branchId`, `status`, `page`, `limit`
Required response shape:
```typescript
{
  success: true,
  data: Student[],
  pagination: { total, page, limit, totalPages }
}
```

### Student Create — POST `/api/students`
1. Validate with Zod schema
2. Generate `admissionDisplayId` using sequential pattern
3. Create in DB within `db.$transaction()` (also create default installments)
4. Return full student record

### Assign Additional Fee — POST `/api/students/[id]/fees`
1. Validate org scope for student
2. Generate `feeDisplayId` (AF/YY/NNNNN)
3. Create `AdditionalFee` record
4. Return fee with display ID

### Common API Errors to Handle
| Scenario | HTTP | Message |
|---|---|---|
| Student not found | 404 | "Student not found" |
| Wrong org | 403 | "Access denied" |
| Duplicate mobile | 400 | "Mobile number already registered" |
| Missing required fields | 400 | "Missing required fields: [fields]" |

---

## Backend Service Layer

**File:** `src/lib/services/studentService.ts`

Required functions:
```typescript
getStudents(orgId, branchId?, filters?, pagination?)
getStudentById(id, orgId)           // always verify org scope
createStudent(data, orgId, branchId)
updateStudent(id, data, orgId)
softDeleteStudent(id, orgId)
assignAdditionalFee(studentId, data, orgId)
getStudentFinancials(studentId, orgId)  // aggregated totals
```

---

## Frontend Components

### File Structure
```
src/components/admin/students/
  StudentCard.tsx           list item card
  StudentFilters.tsx        search + filter bar
  view/
    StudentViewPage.tsx     tabbed detail page
    ProfileTab.tsx          personal info
    PaymentDetailsTab.tsx   installments + additional fees
    AttendanceDetailsTab.tsx  monthly attendance history ← see attendance-module skill
    ViewPaymentDialog.tsx   payment detail modal
    AssignFeeDialog.tsx     assign new additional fee
    CollectFeeDialog.tsx    ← shared from fees module
```

> 📌 **For all attendance-related features on the student profile**, refer to the **`attendance-module` skill**. It covers `AttendanceDetailsTab`, `useAttendance` hook, status colors, date normalization, and the monthly summary view.


### `PaymentDetailsTab` — Required Sections

1. **Summary Cards** — Total Course Fee | Discount | Net Payable | Total Paid | Total Due
2. **Course Payments Table** — per installment with status badge, Collect/View buttons
3. **Additional Fees Table** — with `feeDisplayId` badge, type badge, Collect/View buttons

### Dialog Patterns

All dialogs MUST follow this pattern:
```typescript
// Reset state on every open
useEffect(() => {
  if (open && data) {
    setAmount(...)
    setMode('cash')
    setProofFile(null)
  }
}, [open, data])
```

**Proof upload is mandatory** for `online`, `cheque`, `bank_transfer` payment modes.
Show clear label: `* Required for [mode] payment`

### ViewPaymentDialog — Required Fields
```
Amount Paid  |  Collected On (date + time)
Mode         |  Receipt No.
Reference ID |  Payment Proof (link or "Not uploaded")
Remarks (full width)
[Download Receipt PDF]  [Close]
```

---

## Payment & Financial Rules (Critical)

1. **Every payment must produce a Receipt** — no silent updates
2. **`collectFee` must always be a Prisma transaction** — atomically update Installment/AdditionalFee AND create Receipt
3. **`proofUrl` must be stored** on both the payment record AND the Receipt
4. **`paidDate`** — use `new Date()` at collection time, not the server timestamp from `updatedAt`
5. **PDF receipt** — auto-generate with `generateFeeReceipt()` after successful collection
6. **Re-download** — ViewPaymentDialog must have a "Download Receipt" button at all times if `receiptNo` exists

---

## Error Handling (Student-Specific)

| Scenario | UI Response |
|---|---|
| Student not found | Redirect to `/admin/students` with error toast |
| Fee collection fails | Show error toast, do NOT close dialog |
| Proof upload fails | Block submission, show "Proof upload failed. Try again." |
| Prisma transaction fails | Roll back silently, show "Payment failed. Please retry." |
| Duplicate admission ID | Auto-increment sequence and retry (handle in service layer) |

---

## Testing Checklist (Student Module)

After any Student feature change, verify:

### Data Integrity
- [ ] New student gets a unique `admissionDisplayId`
- [ ] New additional fee gets a unique `feeDisplayId`
- [ ] Payment creates a Receipt record in DB
- [ ] `proofUrl` is saved on both Installment and Receipt
- [ ] `paidDate` reflects actual collection time, not `createdAt`

### Multi-tenant Scoping
- [ ] Branch Admin cannot see students from another branch
- [ ] Super Admin can see all students across branches
- [ ] API returns 403 if org context mismatches

### UI
- [ ] All 3 tabs render without error (Profile, Payments, Attendance)
- [ ] CollectFeeDialog resets on every open
- [ ] Proof upload blocks submission when mode is non-cash
- [ ] ViewPaymentDialog shows "Collected On" with time
- [ ] "Download Receipt" button appears when `receiptNo` exists
- [ ] Additional fees show `feeDisplayId` badge
- [ ] Paid additional fees show Eye (view) button, not Pay button

### Edge Cases
- [ ] Student with 0 courses — show empty state in Payments tab
- [ ] Student with 0 additional fees — show empty state with "+ Assign Fee" CTA
- [ ] Partially paid installment shows correct remaining balance

---

## Proactive Suggestion Template (Student Module)

Before any implementation, output:

```
📋 SQUAD BRIEF — Student Module / [Feature]

🔴 PM: [Business justification — why does this matter for admissions/fees flow?]
🔧 Engineer: [Technical approach — API + Service + UI changes]
🗄️ DBA: [Schema changes, index additions, migration needed?]
🧪 QA: [3-5 specific test cases to verify this works correctly]

❓ Choose your approach:
  A) [More conservative option]
  B) [Recommended balanced option] ← recommended
  C) [More ambitious option]
```

---

## Known Student Module Gaps (Track These)

- [ ] Bulk student import (CSV) — not yet implemented
- [ ] Student document upload (Aadhaar, marksheets) — model missing
- [ ] WhatsApp notification on payment — integration not connected
- [ ] Attendance analytics chart — basic list only, no summary chart
- [ ] Student ledger export (full financial history PDF) — not built

---

## Admin Action Operations (What Exists in the Real App)

| Action | Trigger | Endpoint / Component |
|---|---|---|
| `create_student` | "Add Student" button | `POST /api/students` |
| `view_student` | Row click → detail page | `GET /api/students/[id]` |
| `collect_payment` | "Collect" button on installment | `POST /api/fees/collect` |
| `assign_additional_fee` | "+ Assign Fee" button | `POST /api/students/[id]/fees` |
| `view_payment_details` | Eye icon on paid row | `ViewPaymentDialog` |
| `download_receipt` | "Download Receipt" button | `generateFeeReceipt()` |
| `run_student_tests` | Manual checklist | See Testing Checklist section |

**Missing critical actions (implement these):**
- `bulk_import_students` — CSV import endpoint
- `export_student_ledger` — full payment history PDF
- `send_whatsapp_payment_confirmation` — WhatsApp notification

---

## Security Checklist (Student Module)

- [ ] `admissionDisplayId` generation is inside a transaction — no race condition
- [ ] All student queries filter by `organizationId` from JWT — never from request body
- [ ] File uploads (proof docs) validate MIME type server-side, not just `accept=` attribute
- [ ] Uploaded filenames are sanitized (no path traversal: `../`, null bytes)
- [ ] Student mobile/email are not exposed in list API unless explicitly requested
- [ ] Soft-delete records are excluded from all list queries via `deletedAt: null` filter
- [ ] Proof upload size is capped server-side (not just client-side)

---

## Automated Test Commands

```bash
# Run student module tests
npm run test -- --testPathPattern="student|admission"

# Test unique admissionDisplayId generation
npm run test -- --testPathPattern="admission-display-id"

# Test multi-tenant scoping (ensure org isolation)
npm run test -- --testPathPattern="student-scoping"

# Test financial integrity (payment creates receipt)
npm run test -- --testPathPattern="student-payment"
```
