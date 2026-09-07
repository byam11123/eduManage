---
name: staff-module
id: mod_staff_001
description: >
  Full-squad expert skill for the EduManage Staff/HR Module. Auto-activates
  when the user mentions "staff", "employee", "teacher", "instructor", "payroll",
  or types /staff. Covers PM requirements, backend API, Prisma schema, 
  frontend components, document management, error handling, and testing.
triggers:
  - staff
  - employee
  - teacher
  - instructor
  - payroll
  - /staff
---

# Staff Module — Full Squad Skill

> **Read `../shared-reference/common-checklist.md` first.** All universal rules (auth,
> org scoping, error handling, testing) live there. This file adds Staff-specific context.

---

## Related Skills — Apply These When Working in the Staff Module

| Task Type | Skill to Use |
|---|---|
| Building `StaffProfile`, `PayrollTab`, or any UI | → `frontend-design` skill |
| Writing Tailwind classes, styling, dark mode | → `tailwind-4-docs` skill |
| Reviewing UI for accessibility or UX | → `web-design-guidelines` skill |
| Writing `/api/staff`, file uploads, error handling | → `nodejs-backend-patterns` skill |
| Adding fields to `Staff` model | → `prisma-database-setup` skill |

---

## Squad Context

| Role | Responsibility |
|---|---|
| 🔴 PM | Employee onboarding, document collection (ID, resume), role assignment |
| 🔧 Senior Engineer | Secure document uploads, access control (HR data is sensitive) |
| 🗄️ DBA | `Staff` schema, relation to `User` (for login), payroll records |
| 🧪 QA | Data privacy checks, preventing unauthorized access to salary info |

**Before implementing any Staff feature**, ensure strict RBAC (Role-Based Access Control) around payroll and documents.

---

## Module Overview

**Business purpose:** Manage the lifecycle of employees (teachers, admins, support staff).

**Key entities:**
- `Staff` — The employee profile.
- `Document` — Contracts, resumes, ID proofs.
- `User` — (Optional) Login credentials linked to the Staff profile.

**Primary pages:**
- `/admin/staff` — Employee directory.
- `/admin/staff/[id]` — Deep dive into profile, documents, and attendance.

---

## Database (Prisma) Rules

### `Staff` Model — Required Fields
```prisma
model Staff {
  id              String    @id @default(cuid())
  employeeId      String    @unique // e.g., EMP-001
  firstName       String
  lastName        String
  email           String    @unique
  phone           String
  
  department      String    // Academic, Admin, Support
  designation     String
  joinDate        DateTime
  status          String    @default("active")
  
  // Payroll info (Highly sensitive)
  salary          Float?
  bankName        String?
  accountNo       String?
  ifscCode        String?
  
  userId          String?   @unique // Link to login user
  user            User?     @relation(fields: [userId], references: [id])
  
  organizationId  String
  branchId        String
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

---

## Proactive Suggestions
Always prompt the user with choices when working on Staff:
1. "Should we automatically create a `User` account and send a welcome email when a Staff member is added?"
2. "Do you want salary and bank details to be hidden behind a specific 'View Payroll' permission flag?"
3. "Should we track Staff attendance and leaves in this module?"
