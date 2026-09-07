# EduManage — Shared Module Reference

This document is imported by all module-specific skills. It defines the universal contracts every module must satisfy.

---

## Skills to Always Activate Alongside Any Module Skill

When any module skill is active, the following skills MUST also be consulted and applied:

| Skill | When to Apply |
|---|---|
| `frontend-design` | Any UI component, page, or dialog work |
| `tailwind-4-docs` | Any Tailwind class selection, migration, or config question |
| `web-design-guidelines` | Any UI review, accessibility check, or design audit |
| `nodejs-backend-patterns` | Any API route, service layer, or error handling work |
| `prisma-database-setup` | Any schema change, migration, or DB connection issue |
| `new-module` | When scaffolding a brand new module from scratch |

**Module Skills Available:**
`student-module` · `fees-module` · `enquiry-module` · `leads-module` · `dashboard-module` · `attendance-module`

**Usage:** If the user asks about something in a module, and one of the above skills is relevant, explicitly apply its guidance. For example, when building a new dialog → apply `frontend-design`. When writing an API route → apply `nodejs-backend-patterns`. When changing `schema.prisma` → apply `prisma-database-setup`.

---

## 1. Authentication & Auth Enforcement

Every API route handler MUST start with:
```typescript
const token = extractToken(request)
if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
const payload = await verifyToken(token)
if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
```
Never skip this. Never trust the client.

---

## 2. Organization Scoping (Non-Negotiable)

Every DB query MUST include `organizationId: payload.organizationId`.
Every model MUST store `organizationId`. Multi-branch models also store `branchId`.

```typescript
// CORRECT
await db.student.findMany({ where: { organizationId: payload.organizationId } })

// WRONG — never do this
await db.student.findMany()
```

---

## 3. API Response Shape

All API routes return:
```typescript
{ success: true, data: T }           // 200 OK
{ success: false, error: string }    // 4xx / 5xx
```

Server Actions return:
```typescript
{ success: true, data?: T }
{ success: false, error: string }
```

---

## 4. Service Layer Contract

Business logic NEVER goes in components or API routes directly. It lives in `src/lib/services/`.
```
API Route / Server Action  →  calls Service  →  calls Prisma
```
Services return typed results. They throw typed errors. They never return raw Prisma objects.

---

## 5. Financial Safety (All payment operations)

- Use `db.$transaction()` for any operation that touches multiple tables
- Always auto-generate sequential display IDs (e.g. RCP/26/00001)
- Always write to the `Receipt` table — even for additional fees
- Proof URL must be stored alongside each paid record
- Never delete financial records — only soft-delete or cancel

---

## 6. Error Handling Checklist

Every UI feature must implement:
- [ ] Loading state (skeleton or spinner, not blank screen)
- [ ] Empty state (descriptive message + CTA, not blank)
- [ ] Error state (toast with actionable message)
- [ ] Success feedback (toast with receipt/ID confirmation)

Every API must:
- [ ] Catch all errors in a try/catch
- [ ] Log error with `console.error('[API /path] Error:', error)`
- [ ] Never expose raw Prisma/DB errors to client

---

## 7. Standard Manual Testing Checklist

After every feature change, verify:
- [ ] Works as Super Admin
- [ ] Works as Branch Admin (scoped to their branch only)
- [ ] Cannot access another organization's data
- [ ] Loading state shows on slow network
- [ ] Empty state shows when no data
- [ ] Error toast shows on API failure (test with wrong token)
- [ ] Mobile layout is not broken
- [ ] Dark mode rendering is correct

---

## 8. Prisma Schema Rules

Every model MUST have:
```prisma
  organizationId  String
  organization    Organization @relation(...)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?    // soft delete
```

Run after schema changes:
```bash
npx prisma db push          # dev (fast)
npx prisma migrate dev      # prod-safe migrations
```
The `npx prisma generate` EPERM error on Windows is a known env issue — it does not affect runtime behavior. Restart dev server after schema changes.

---

## 9. Proactive Suggestion Format

Before implementing any feature, present this block to the user:

```
📋 SQUAD BRIEF — [Module] / [Feature]

🔴 PM: What problem are we solving and why now?
🔧 Engineer: Proposed implementation approach
🗄️ DBA: Schema changes required (if any)
🧪 QA: Test cases to cover

❓ Before I start — choose one:
  A) [Option A description]
  B) [Option B description]  ← recommended
  C) Let me decide — just build it
```

---

## 10. Coding Standards (Non-Negotiable)

- No `any` types — use proper TypeScript types or generics
- Zod validation on ALL user inputs at the API/action boundary
- `React Hook Form` for all forms
- `shadcn/ui` components first — no custom primitives
- File names: `kebab-case` for files, `PascalCase` for components
- Never hardcode organization/branch IDs
- Soft delete only — never `db.model.delete()` on production data

---

## 11. Security Checklist (Universal — Apply to Every Module)

Every API route and feature must satisfy these before shipping:

### Input Security
- [ ] All user inputs validated with Zod at the API boundary
- [ ] File uploads validate MIME type **server-side** (not just browser `accept` attribute)
- [ ] Uploaded filenames sanitized — no path traversal (`../`), no null bytes
- [ ] File size validated server-side — max 5MB enforced in the route handler
- [ ] No raw Prisma errors exposed to client — always map to user-friendly messages

### Auth & Authorization
- [ ] Every route verifies JWT via `verifyAuth()` before processing
- [ ] `organizationId` always comes from the verified JWT payload — never trusted from request body
- [ ] Branch Admin cannot access data outside their assigned branches
- [ ] Super Admin scope is explicitly guarded — not the default fallback

### Data Integrity
- [ ] Financial operations are in `db.$transaction()` — no partial writes
- [ ] Sequential IDs (receipt, admission) generated inside transaction — no race condition
- [ ] Soft-delete records excluded from all list queries via `deletedAt: null` filter
- [ ] No `UPDATE` on immutable records (Receipt table)

### Rate Limiting
- [ ] Financial endpoints rate-limited (max 3–5 req/s per user)
- [ ] Auth endpoints rate-limited (prevent brute force on login)

---

## 12. Observability & Logging (Universal)

Every module must log enough to debug production issues without exposing sensitive data:

```typescript
// ✅ Correct logging — structured, no PII
console.error('[API /admin/fees/collect] Transaction failed:', {
  organizationId: payload.organizationId,
  installmentId: body.installmentId,
  error: error instanceof Error ? error.message : 'Unknown error'
})

// ❌ Wrong — exposes raw error with stack trace to logs + client
console.error(error)
return NextResponse.json({ error: error.message })
```

**What to log per API route:**
- `[MODULE] [ACTION] started` — request received
- `[MODULE] [ACTION] success` — with entity ID (not full data)
- `[MODULE] [ACTION] failed` — with structured error (no PII)

**What NOT to log:**
- Student names, phone numbers, payment amounts in plain text
- JWT tokens or session data
- Raw Prisma query strings

---

## 13. Deployment & Rollback Runbook

Before deploying any module change to production:

### Pre-deploy Checklist
- [ ] `npx prisma migrate dev --name <feature-name>` run and migration file committed
- [ ] All manual testing checklist items verified in staging
- [ ] No `console.log` debug statements left in changed files
- [ ] All new env variables added to `.env.example`
- [ ] `npm run build` succeeds with 0 TypeScript errors

### Deploy Steps
```bash
# 1. Stop current server
pm2 stop edumanage   # or equivalent

# 2. Pull latest
git pull origin main

# 3. Install deps (if package.json changed)
npm ci

# 4. Run migrations
npx prisma migrate deploy

# 5. Restart server
pm2 restart edumanage
```

### Rollback Plan
```bash
# 1. Revert to previous commit
git revert HEAD --no-edit

# 2. Re-deploy previous migration (if schema changed)
# NOTE: Check if migration is reversible before proceeding
npx prisma migrate resolve --rolled-back <migration-name>

# 3. Restart
pm2 restart edumanage
```

> [!CAUTION]
> Financial schema migrations (Receipt, Installment, AdditionalFee) are **not reversible** without data loss. Always take a DB backup before running migrations on these tables.

---

## 14. CI Pipeline (Target State — Implement When Ready)

```yaml
# .github/workflows/ci.yml (target)
on: [push, pull_request]
jobs:
  test:
    steps:
      - npm ci
      - npx prisma generate
      - npm run typecheck          # tsc --noEmit
      - npm run test               # jest
      - npm run lint               # eslint
      - node scripts/check-no-mock-data.js   # assert no MOCK_ in API routes
  build:
    needs: test
    steps:
      - npm run build
```

**Minimum gate before any PR merge:**
1. TypeScript compile: 0 errors
2. Lint: 0 errors (ESLint)
3. Build: success
4. No mock data in API routes

**Future gates (add when tests exist):**
5. Unit tests: all pass
6. Integration tests: all pass
7. Performance: dashboard API < 2000ms
