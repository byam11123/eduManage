---
name: new-module
description: Scaffolds a complete new EduManage module (like Examination, Expenses, or Timetable). Use when adding any new functional module to the platform. Covers Prisma model, service layer, Server Actions, API route, and UI pages.
---

# New Module Skill

Use the Admissions module (`src/app/admin/admissions`) as the canonical reference implementation.

## Step 1 — Prisma Schema
Add the new model to `prisma/schema.prisma`:
- Include `organizationId`, `branchId`, `createdAt`, `updatedAt`, `deletedAt`
- Add all relations with explicit `@relation` names
- Run: `npx prisma migrate dev --name add-[module-name]-model`

## Step 2 — TypeScript Types
Add types to `src/lib/types/`:
- Create `[module].types.ts`
- Export: input type (for creation), output type (for display), list item type

## Step 3 — Zod Schemas
Create `src/lib/schemas/[module].schema.ts`:
- `Create[Module]Schema` — for new record validation
- `Update[Module]Schema` — partial of create schema
- Export inferred TypeScript types from schemas

## Step 4 — Service Layer
Create `src/lib/services/[module]Service.ts`:
- `getAll(orgId, branchId?, filters?)` — list with pagination
- `getById(id, orgId)` — single record, verify org scope
- `create(data, orgId)` — validated creation
- `update(id, data, orgId)` — scoped update
- `softDelete(id, orgId)` — set `deletedAt`, never hard delete
- All financial operations must use `prisma.$transaction()`

## Step 5 — Server Actions
Create `src/app/admin/[module]/actions.ts`:
- One action per mutation (create, update, delete)
- Each action: validate with Zod → call service → revalidatePath → return `{ success, data?, error? }`

## Step 6 — UI Pages
Create under `src/app/admin/[module]/`:
- `page.tsx` — list page with TanStack Table
- `[id]/page.tsx` — detail/edit page
- `new/page.tsx` — creation form (multi-step if complex)
- `components/` — module-specific components

## Step 7 — Hook
Create `src/hooks/use[Module].ts`:
- Use TanStack Query for data fetching
- Export: data, isLoading, error, refetch

## Step 8 — Navigation
Add module to the admin sidebar navigation config.

## Step 9 — Update GEMINI.md
Update the module status matrix from 🔴 Planned to 🟡 Partial or 🟢 Ready.
