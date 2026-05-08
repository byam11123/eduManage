# Multi-Tenant Data Scoping
activation: always

## Absolute Rules
- Every Prisma query MUST include `organizationId` from session — no exceptions
- Multi-branch queries also include `branchId`
- Never trust client-supplied `organizationId` — always read from server session
- Never show data from one org to another org under any circumstance

## Session Context Pattern
```ts
// Always get org context from session
const session = await getServerSession(authOptions)
const { organizationId, branchId, role } = session.user

// Always scope queries
const students = await prisma.student.findMany({
  where: {
    organizationId,  // REQUIRED
    branchId,        // if branch-scoped
    deletedAt: null  // soft delete filter
  }
})
```

## New Model Checklist
Every new Prisma model must have:
- `organizationId  String` (or BigInt, match existing convention)
- `createdAt       DateTime @default(now())`
- `updatedAt       DateTime @updatedAt`
- `deletedAt       DateTime?` (for soft delete)
