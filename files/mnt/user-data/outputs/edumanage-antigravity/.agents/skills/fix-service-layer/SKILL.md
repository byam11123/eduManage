---
name: fix-service-layer
description: Fixes a bug or extends functionality in the service layer (src/lib/services/). Use when a service function returns wrong data, missing records, incorrect scoping, or needs a new query/filter added.
---

# Fix Service Layer Skill

## Step 1 — Read the Service File
Read the full service file before making any changes.
Understand: what is the function supposed to do, what does it actually do.

## Step 2 — Check Scoping
Every query must have:
- `organizationId` from session (not from client input)
- `deletedAt: null` (unless intentionally querying deleted records)
- `branchId` if the entity is branch-scoped

## Step 3 — Identify the Bug Type
- **Wrong data returned:** Missing filter (org, branch, status, deletedAt)
- **Missing data:** Overly restrictive filter or wrong relation include
- **Performance issue:** Missing index, N+1 query, no pagination
- **Type error:** Service returning Prisma model instead of mapped type

## Step 4 — Fix Pattern
```ts
// Before fixing — wrong (missing scope, returns raw Prisma)
async function getStudents() {
  return prisma.student.findMany()
}

// After fixing — correct (scoped, typed, paginated)
async function getStudents(orgId: string, branchId: string, page = 1) {
  const students = await prisma.student.findMany({
    where: { organizationId: orgId, branchId, deletedAt: null },
    select: { id: true, name: true, enrollmentId: true, batch: true },
    skip: (page - 1) * 20,
    take: 20,
    orderBy: { createdAt: 'desc' }
  })
  return students // typed by Prisma select — not raw model
}
```

## Step 5 — Verify No Regressions
After fixing, check:
- Does the calling Server Action still type-check?
- Does the UI component still receive the expected shape?
- Does the fix work for all three roles (Super Admin, Branch Admin, User)?
