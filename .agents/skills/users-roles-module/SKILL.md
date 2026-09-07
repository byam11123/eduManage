---
name: users-roles-module
id: mod_users_001
description: >
  Full-squad expert skill for the EduManage Users & Roles (RBAC) Module. Auto-activates
  when the user mentions "user", "role", "permission", "rbac", "access",
  or types /users. Covers PM requirements, backend API, Prisma schema, 
  frontend components, security, error handling, and testing.
triggers:
  - user
  - users
  - role
  - roles
  - permission
  - rbac
  - access
  - /users
  - /roles
---

# Users & Roles Module — Full Squad Skill

> **Read `../shared-reference/common-checklist.md` first.** All universal rules (auth,
> org scoping, error handling, testing) live there. This file adds Users/RBAC-specific context.

---

## Related Skills — Apply These When Working in the Users Module

| Task Type | Skill to Use |
|---|---|
| Building `RoleMatrix`, `UserList`, or any UI | → `frontend-design` skill |
| Writing Tailwind classes, styling, dark mode | → `tailwind-4-docs` skill |
| Reviewing UI for accessibility or UX | → `web-design-guidelines` skill |
| Writing `/api/users`, JWT handling, error handling | → `nodejs-backend-patterns` skill |
| Adding fields to `User` or `Role` models | → `prisma-database-setup` skill |

---

## Squad Context

| Role | Responsibility |
|---|---|
| 🔴 PM | Define what roles exist (Branch Admin, Teacher, Counselor) and what they can see |
| 🔧 Senior Engineer | Middleware enforcement, JWT payload structuring, UI route guarding |
| 🗄️ DBA | `User`, `Role`, `Permission` schema, optimized permission lookups |
| 🧪 QA | Privilege escalation tests, cross-branch data bleed tests |

**Before implementing any RBAC feature**, ensure you test it with a non-super-admin account.

---

## Module Overview

**Business purpose:** Secure the platform by ensuring users can only see and act upon what they are authorized to.

**Key entities:**
- `User` — The login account.
- `Role` — A collection of permissions (e.g., "Branch Admin").
- `Permission` — A specific grant (e.g., "delete:student").

**Primary pages:**
- `/admin/users` — Manage login accounts and assign roles.
- `/admin/roles` — Manage custom roles and tickbox permission matrices.

---

## Database (Prisma) Rules

### `User` Model — Required Fields
```prisma
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  passwordHash    String
  name            String
  
  role            String    @default("staff") // super_admin, branch_admin, staff
  permissions     String[]  // Array of permission strings if custom overrides exist
  
  branches        String[]  // IDs of branches this user can access
  
  organizationId  String
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

**Rule:** `super_admin` bypasses branch checks. Everyone else is strictly scoped to the IDs in `branches` and `organizationId`.

---

## Proactive Suggestions
Always prompt the user with choices when working on Users & Roles:
1. "Do you want to hardcode roles (Admin, Teacher, Accountant) or build a dynamic UI where users can create custom roles with specific checkboxes?"
2. "Should we log out users forcefully if their permissions change mid-session?"
3. "Do you want an audit log specifically tracking who changed whose permissions?"
