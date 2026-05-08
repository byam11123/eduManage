---
name: prisma-migration
description: Creates a safe Prisma schema change and runs migration. Use when adding new models, columns, relations, or indexes to the database. Covers additive-only changes, multi-tenant requirements, and rollback safety.
---

# Prisma Migration Skill

## Step 1 — Read Current Schema
Use Prisma MCP to read `prisma/schema.prisma` before making any changes.
Never assume column names or types — verify them.

## Step 2 — Plan the Change
Classify the change:
- **Safe (additive):** new model, nullable column, new index
- **Risky:** renaming a column, changing a type, making nullable → required
- **Dangerous:** dropping a column or model

For risky/dangerous: discuss with user before proceeding.

## Step 3 — Apply Schema Changes
Checklist for every new model:
- [ ] `organizationId  String` (match existing convention)
- [ ] `branchId        String?` (if branch-scoped)
- [ ] `createdAt       DateTime @default(now())`
- [ ] `updatedAt       DateTime @updatedAt`
- [ ] `deletedAt       DateTime?`
- [ ] All `@relation` decorators have explicit names
- [ ] Indexes on `organizationId` and foreign keys

## Step 4 — Run Migration
```bash
npx prisma migrate dev --name descriptive-feature-name
```
Naming convention: `add-examination-models`, `add-wallet-balance-column`, `create-expense-tracking`

## Step 5 — Regenerate Client
```bash
npx prisma generate
```
Always run after schema change — TypeScript types won't update otherwise.

## Step 6 — Update Seed (if needed)
If new required relations or enums are added, update `prisma/seed.ts`.

## Step 7 — Document
Add a changelog entry noting: what changed, why, and any migration notes for production deployment.

## Never
- Never use `prisma migrate reset` in anything resembling production
- Never make a column required if it has existing rows without defaults
- Never drop a column without confirming it's unused everywhere in the codebase
