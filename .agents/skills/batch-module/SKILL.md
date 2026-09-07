---
name: batch-module
id: mod_batch_001
description: >
  Full-squad expert skill for the EduManage Batch Module. Auto-activates
  when the user mentions "batch", "batches", "schedule", "timing", "assign batch",
  or types /batch. Covers PM requirements, backend API, Prisma schema, 
  frontend components, batch capacity logic, error handling, testing, and proactive suggestions.
triggers:
  - batch
  - batches
  - schedule
  - timing
  - assign batch
  - /batch
---

# Batch Module — Full Squad Skill

> **Read `../shared-reference/common-checklist.md` first.** All universal rules (auth,
> org scoping, error handling, testing) live there. This file adds Batch-specific context.

---

## Related Skills — Apply These When Working in the Batch Module

| Task Type | Skill to Use |
|---|---|
| Building `BatchCard`, `AddBatchDialog`, or any UI | → `frontend-design` skill |
| Writing Tailwind classes, styling, dark mode | → `tailwind-4-docs` skill |
| Reviewing UI for accessibility or UX | → `web-design-guidelines` skill |
| Writing `/api/batch`, service layer, error handling | → `nodejs-backend-patterns` skill |
| Adding fields to `Batch` model | → `prisma-database-setup` skill |

---

## Squad Context

| Role | Responsibility |
|---|---|
| 🔴 PM | Define batch timings, max capacity, course assignment, status (active/completed) |
| 🔧 Senior Engineer | Capacity validation, student assignment logic, bulk actions |
| 🗄️ DBA | `Batch` schema, relations to `Course`, `Student`, `Staff` (instructors) |
| 🧪 QA | Edge cases: overfilling a batch, assigning wrong course, timing overlaps |

**Before implementing any Batch feature**, ensure capacity and timing overlaps are checked.

---

## Module Overview

**Business purpose:** Organize students into manageable cohorts (batches) for specific courses with defined timings and instructors.

**Key entities:**
- `Batch` — A cohort of students.
- `Course` — The curriculum the batch is taking.
- `Staff` — The instructor assigned to the batch.

**Primary pages:**
- `/admin/batch` — Grid/List view of all batches, capacity metrics.
- `/admin/batch/[id]` — Detailed view, list of enrolled students, attendance metrics.

---

## Database (Prisma) Rules

### `Batch` Model — Required Fields
```prisma
model Batch {
  id              String    @id @default(cuid())
  name            String    // e.g., "Morning Fullstack - Jan 2026"
  status          String    @default("active") // active, completed, cancelled
  capacity        Int       @default(30)
  
  startTime       String    // e.g., "09:00 AM"
  endTime         String    // e.g., "11:00 AM"
  room            String?
  
  courseId        String
  course          Course    @relation(fields: [courseId], references: [id])
  
  instructorId    String?
  instructor      Staff?    @relation(fields: [instructorId], references: [id])
  
  students        Student[]
  
  organizationId  String
  branchId        String
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

**Rule:** Always enforce `organizationId` and `branchId`. Do NOT allow batches to cross branches unless explicitly designed as "Online/Global".

---

## API Routes

### File Locations
```
src/app/api/batch/
  route.ts               GET (list), POST (create)
src/app/api/batch/[id]/
  route.ts               GET, PATCH, DELETE
src/app/api/batch/[id]/students/
  route.ts               POST (assign), DELETE (remove)
```

## Proactive Suggestions
Always prompt the user with choices when working on Batches:
1. "Do you want to enforce strict capacity limits, or allow soft limits with warnings?"
2. "Should we add a check to prevent assigning an instructor to overlapping batch timings?"
3. "Do you want a grid view (cards) or a table view for the main batch dashboard?"
