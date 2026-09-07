---
name: course-module
id: mod_course_001
description: >
  Full-squad expert skill for the EduManage Course Module. Auto-activates
  when the user mentions "course", "courses", "syllabus", "subject", "curriculum",
  or types /course. Covers PM requirements, backend API, Prisma schema, 
  frontend components, error handling, testing, and proactive suggestions.
triggers:
  - course
  - courses
  - syllabus
  - subject
  - curriculum
  - /course
---

# Course Module — Full Squad Skill

> **Read `../shared-reference/common-checklist.md` first.** All universal rules (auth,
> org scoping, error handling, testing) live there. This file adds Course-specific context.

---

## Related Skills — Apply These When Working in the Course Module

| Task Type | Skill to Use |
|---|---|
| Building `CourseCard`, `AddCourseDialog`, or any UI | → `frontend-design` skill |
| Writing Tailwind classes, styling, dark mode | → `tailwind-4-docs` skill |
| Reviewing UI for accessibility or UX | → `web-design-guidelines` skill |
| Writing `/api/courses`, service layer, error handling | → `nodejs-backend-patterns` skill |
| Adding fields to `Course` or `Subject` models | → `prisma-database-setup` skill |

---

## Squad Context

| Role | Responsibility |
|---|---|
| 🔴 PM | Define course structure, duration, base fee, syllabus attachments |
| 🔧 Senior Engineer | Cascading deletes/updates, base fee vs custom fee logic |
| 🗄️ DBA | `Course`, `Subject`, `Syllabus` schema, relations |
| 🧪 QA | Edge cases: deleting a course that has active students/batches |

**Before implementing any Course feature**, check for active student dependencies.

---

## Module Overview

**Business purpose:** Define the catalog of educational offerings.

**Key entities:**
- `Course` — The main offering (e.g., "Fullstack Web Development").
- `Subject` — Sub-components of a course.

**Primary pages:**
- `/admin/courses` — Catalog view of all offerings.
- `/admin/courses/[id]` — Detailed syllabus, fee structure, and active batches.

---

## Database (Prisma) Rules

### `Course` Model — Required Fields
```prisma
model Course {
  id              String    @id @default(cuid())
  name            String
  code            String    // e.g., "FS-2026"
  description     String?
  durationMonths  Int
  durationYears   Int       @default(0)
  
  fee             Float     // Base fee for the course
  status          String    @default("active") // active, inactive
  
  batches         Batch[]
  studentCourses  StudentCourse[]
  
  organizationId  String
  branchId        String?   // If null, available to all branches
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

**Rule:** Ensure that if `branchId` is null, the course is considered a "Global" template available to all branches in the org.

---

## Proactive Suggestions
Always prompt the user with choices when working on Courses:
1. "Should deleting a course be blocked if there are active students, or should it just be 'archived'?"
2. "Do you want to add a rich text editor for the course syllabus/description?"
3. "Should we support one-time fees vs recurring monthly structures at the Course definition level?"
