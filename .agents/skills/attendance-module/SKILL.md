---
name: attendance-module
id: mod_attendance_006
description: >
  Full-squad expert skill for the EduManage Attendance Module. Auto-activates when
  the user mentions "attendance", "present", "absent", "mark attendance", "leave",
  "half-day", "batch attendance", "employee attendance", or types /attendance.
  Covers PM requirements, backend API, Prisma schema, frontend components, dual-type
  tracking (student & employee), bulk operations, error handling, testing, and
  proactive suggestions with multiple choices.
triggers:
  - attendance
  - present
  - absent
  - leave
  - half-day
  - mark attendance
  - batch attendance
  - employee attendance
  - /attendance
---

# Attendance Module — Full Squad Skill

> **Read `../shared-reference/common-checklist.md` first.** All universal rules (auth,
> org scoping, error handling, testing) live there. This file adds Attendance-specific context.

---

## Related Skills — Apply These When Working in the Attendance Module

| Task Type | Skill to Use |
|---|---|
| Building attendance grid, date picker, status toggles | → `frontend-design` skill |
| Tailwind classes for calendar layout, status colors | → `tailwind-4-docs` skill |
| Reviewing attendance UI for accessibility | → `web-design-guidelines` skill |
| Writing attendance API, bulk save, monthly summary | → `nodejs-backend-patterns` skill |
| Adding fields to `Attendance` model, batch indexes | → `prisma-database-setup` skill |

---

## Squad Context

| Role | Responsibility |
|---|---|
| 🔴 PM | Daily marking workflow, batch filter, monthly report, export |
| 🔧 Senior Engineer | Dual-type (student/employee) API, bulk upsert, date normalization |
| 🗄️ DBA | Unique constraints per date+entity, date index, batch/branch scoping |
| 🧪 QA | Duplicate prevention, date timezone, bulk save rollback, export accuracy |

---

## Module Overview

**Business purpose:** Track daily attendance for both students and employees in one unified system.

**Two parallel types — identical API, different entity:**
| Type | Entity | Page |
|---|---|---|
| `student` | `Student` model | `/admin/attendance/student` |
| `employee` | `User` (via `UserBranch`) | `/admin/attendance/employee` |

**Status values:**
```
present | absent | leave | half-day | holiday
```

**Key workflow:**
1. Admin selects a date and (optionally) a batch
2. All students/employees for that date are loaded with their existing attendance status
3. Admin marks each entity's status inline (click to toggle)
4. Saves via bulk endpoint (upsert all at once)
5. Monthly summary view shows count by status across 30 days

---

## Database (Prisma) Rules

### `Attendance` Model — Current Shape
```prisma
model Attendance {
  id        String   @id @default(cuid())
  date      DateTime
  status    String   // present, absent, leave, half-day, holiday
  type      String   // student, employee
  remarks   String?

  studentId  String?
  student    Student? @relation(...)

  employeeId String?  // userId from UserBranch context
  employee   User?    @relation(...)

  branchId   String
  branch     Branch   @relation(...)

  batchId    String?
  batch      Batch?   @relation(...)

  organizationId String
  organization   Organization @relation(...)

  @@unique([date, studentId, type])   // prevents duplicate for same day
  @@unique([date, employeeId, type])
  @@index([date])
  @@index([studentId])
  @@index([employeeId])
  @@index([branchId])
  @@index([batchId])
  @@index([organizationId])
}
```

### Critical: Date Normalization
**Always normalize dates to midnight UTC before storing:**
```typescript
const attendanceDate = new Date(date)
attendanceDate.setHours(0, 0, 0, 0)
```
Missing this causes queries to never find existing records, resulting in duplicate-unique-constraint errors.

### Unique Constraint Behavior
The `@@unique([date, studentId, type])` constraint means:
- One record per student per day per type — enforced at DB level
- The API should **upsert** (update if exists, create if not) — never insert blindly

---

## API Routes

### File Locations
```
src/app/api/admin/attendance/
  route.ts        GET (list for a date or month) | POST (single upsert) | PATCH (update)
  bulk/
    route.ts      POST (upsert all records for a date at once)
```

### GET `/api/admin/attendance`
**Query params:**
| Param | Purpose |
|---|---|
| `type` | `student` or `employee` (required) |
| `date` | `YYYY-MM-DD` — returns all entities + their attendance for that day |
| `month` | `0-11` — combined with `year` for monthly summary |
| `year` | e.g. `2026` |
| `batchId` | Filter students by batch |
| `studentId` | Filter to single student (monthly history) |
| `employeeId` | Filter to single employee |

**Response for `date` mode:**
```typescript
{
  success: true,
  data: {
    entities: [{
      id: string
      name: string          // firstName + lastName for student, fullName for employee
      displayId?: string    // studentDisplayId or employeeCode
      status: string        // present | absent | leave | half-day | null (not marked yet)
      remarks?: string
      attendanceId?: string // null if not yet marked for this date
    }]
  }
}
```

### POST `/api/admin/attendance/bulk`
**Purpose:** Save attendance for ALL entities on a given date in one transaction.

```typescript
// Request body
{
  date: string      // YYYY-MM-DD
  type: string      // student | employee
  branchId: string
  batchId?: string
  records: {
    entityId: string       // studentId or employeeId
    status: string         // present | absent | leave | half-day | holiday
    remarks?: string
  }[]
}
```

**Implementation pattern — delete + recreate in transaction:**
```typescript
await db.$transaction(async (tx) => {
  // 1. Delete existing records for this date/type/branch
  await tx.attendance.deleteMany({
    where: { date: attendanceDate, type, branchId, organizationId }
  })
  // 2. Recreate all at once
  await tx.attendance.createMany({
    data: records.map(r => ({
      date: attendanceDate,
      type,
      status: r.status,
      remarks: r.remarks || null,
      studentId: type === 'student' ? r.entityId : null,
      employeeId: type === 'employee' ? r.entityId : null,
      branchId,
      batchId: batchId || null,
      organizationId
    }))
  })
})
```

> ⚠️ **Why delete + recreate instead of upsert?**
> SQLite does not support true upsert with `createMany`. This pattern is safe inside a transaction.

---

## Backend Service Layer

**File:** `src/lib/services/attendanceService.ts`

```typescript
getDailyAttendance(date, type, orgId, branchId, batchId?)
getMonthlyAttendance(studentId?, employeeId?, month, year, orgId)
bulkSaveAttendance(date, type, records, orgId, branchId, batchId?)
getSummary(entityId, type, month, year, orgId)  // for per-student/employee view
```

---

## Frontend Components

### Page Structure
```
src/app/admin/attendance/
  page.tsx                   → redirect to /student or /employee
  student/
    page.tsx                 → student attendance marking page
  employee/
    page.tsx                 → employee attendance marking page
src/components/admin/students/view/
  AttendanceDetailsTab.tsx   → per-student monthly view tab
```

### `AttendanceDetailsTab.tsx` (Student Profile)
- Shows monthly calendar grid with status per day
- Color coded: present=green, absent=red, leave=yellow, half-day=orange
- Shows count summary at top: Present X | Absent X | Leave X
- Fetches with `useAttendance({ type: 'student', studentId })`

### Daily Attendance Page — Required UX
```
┌─────────────────────────────────────┐
│  📅 Date Picker  |  🏫 Batch Filter │
├─────────────────────────────────────┤
│  [Student Name]  [ID]  [Status]     │  ← click status to cycle through
│  Ravi Kumar      ADM/.. [PRESENT]   │
│  Priya Singh     ADM/.. [ABSENT]    │
│  ...                                │
├─────────────────────────────────────┤
│  [Save All Attendance]              │
└─────────────────────────────────────┘
```

### Status Toggle Behavior
- Clicking the status cycles: `present → absent → leave → half-day → present`
- Status pills are color-coded (see colors below)
- Unsaved changes show a "Unsaved" banner at the top

### Status Color Mapping
```typescript
const statusColors = {
  present:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20',
  absent:   'bg-rose-100 text-rose-700 dark:bg-rose-900/20',
  leave:    'bg-amber-100 text-amber-700 dark:bg-amber-900/20',
  'half-day': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20',
  holiday:  'bg-gray-100 text-gray-500 dark:bg-gray-800',
}
```

---

## useAttendance Hook

**File:** `src/hooks/useAttendance.ts`

```typescript
interface UseAttendanceProps {
  type: 'student' | 'employee'
  studentId?: string
  employeeId?: string
}

// Returns:
{
  dailyRecords: AttendanceRecord[]     // for today's marking
  records: AttendanceRecord[]          // monthly records
  loading: boolean
  fetchDailyAttendance: (date, batchId?) => void
  fetchMonthlyAttendance: (month, year) => void
  bulkSave: (date, records) => Promise<void>
}
```

---

## Error Handling (Attendance-Specific)

| Scenario | Response |
|---|---|
| Save with no date selected | Block submit + toast: "Please select a date first" |
| Unique constraint violation | Shows error: "Duplicate attendance record. Try refreshing." |
| Bulk save partial failure | Roll back entire batch (transaction), show toast: "Failed to save. No changes made." |
| Empty batch (no students) | Show empty state: "No students found in this batch for the selected date" |
| Future date marking | Warn but allow: "You are marking attendance for a future date" |
| Network failure mid-save | Show retry button + "Attendance not saved. Please try again." |

---

## Testing Checklist (Attendance Module)

### Data Integrity
- [ ] Marking attendance twice for same student+date does NOT create duplicate (unique constraint works)
- [ ] Date is always stored at midnight (no time component drift)
- [ ] Bulk save is atomic — if any record fails, NO records are written
- [ ] Employee attendance uses `userId`, not `userBranchId`

### Correctness
- [ ] Batch filter shows only students in that batch
- [ ] "All batches" option shows all active students in the branch
- [ ] Monthly summary counts match the individual day records
- [ ] `AttendanceDetailsTab` shows correct month's data when navigating between months

### Multi-tenant
- [ ] Branch Admin sees only their branch's students/employees
- [ ] Cannot view or save attendance for another organization's branch
- [ ] Changing branch filter reloads the entity list correctly

### UI
- [ ] Status cycles correctly on click (present → absent → leave → half-day → present)
- [ ] Unsaved changes indicator shown before Save
- [ ] Saving shows loading state on the button
- [ ] Success toast appears with "Attendance saved for [date]"
- [ ] Empty state shown when no students/employees in selected batch
- [ ] Monthly calendar in `AttendanceDetailsTab` highlights correct days

### Edge Cases
- [ ] Holiday status doesn't count against absence rate
- [ ] Student with no attendance records — shown as "Not Marked"
- [ ] Date picker cannot easily select a year far in the future (prevent mis-selects)

---

## Proactive Suggestion Template (Attendance Module)

Before any attendance feature, output:

```
📋 SQUAD BRIEF — Attendance Module / [Feature]

🔴 PM: [Does this improve marking speed, reporting, or both?]
🔧 Engineer: [API change needed? Hook update? Date handling risk?]
🗄️ DBA: [Index impact? Unique constraint behavior with new field?]
🧪 QA: [Duplicate prevention, timezone safety, bulk save atomicity]

❓ Choose your approach:
  A) Simple per-row save (slow for large batches, simpler code)
  B) Bulk delete + recreate in transaction ← recommended
  C) Upsert per row (works for small batches, SQLite limitation)
```

---

## Known Attendance Module Gaps (Track These)

- [ ] No attendance % summary card on the student profile (only raw records shown)
- [ ] No monthly export (CSV/PDF) for attendance report
- [ ] No "Mark All Present" bulk action button
- [ ] No attendance analytics on dashboard (% present today, trend)
- [ ] Employee attendance lacks designation/department filter
- [ ] No leave request workflow — admin marks directly, no student/employee request system
- [ ] Holiday calendar — no way to pre-define holidays so they auto-fill as "holiday"
- [ ] Late arrival tracking — no concept of arrival time, only status

---

## Admin Action Operations (What Exists in the Real App)

| Action | Trigger | Endpoint / Component |
|---|---|---|
| `load_daily_attendance` | Date picker change | `GET /api/admin/attendance?date=X&type=Y` |
| `save_bulk_attendance` | "Save All" button | `POST /api/admin/attendance/bulk` |
| `update_single_status` | Status pill click | `POST /api/admin/attendance` (single) |
| `view_monthly_attendance` | Student profile Attendance tab | `GET /api/admin/attendance?month=X&year=Y` |
| `filter_by_batch` | Batch dropdown | Query param `batchId=X` |

**Missing critical actions (implement these):**
- `mark_all_present` — one-click set all to present for the day
- `mark_all_absent` — one-click set all to absent
- `apply_holiday` — set all to holiday status for a pre-defined date
- `export_monthly_report` — CSV/PDF download of monthly attendance
- `view_attendance_summary_card` — % present/absent chart on student profile

---

## Security Checklist (Attendance Module)

- [ ] All attendance queries filter by `organizationId` from JWT
- [ ] `branchId` in bulk POST is validated against the user's allowed branches — cannot mark attendance for another branch
- [ ] Employee attendance `employeeId` is a `userId` — verify the user belongs to the organization before marking
- [ ] Date normalization (`setHours(0,0,0,0)`) is applied server-side — client cannot manipulate the timestamp
- [ ] Bulk delete+recreate is within a transaction — partial writes cannot occur
- [ ] `type` param (`student`/`employee`) is validated — reject unknown values

---

## Automated Test Commands

```bash
# Run attendance module tests
npm run test -- --testPathPattern="attendance"

# Test unique constraint: same student+date cannot have 2 records
npm run test -- --testPathPattern="attendance-unique"

# Test bulk save atomicity: if one record fails, all fail
npm run test -- --testPathPattern="attendance-bulk"

# Test date normalization: confirm all dates stored at midnight
npm run test -- --testPathPattern="attendance-date"
```
