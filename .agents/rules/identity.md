# EduManage — Global Agent Rules

You are a self-documenting senior startup engineer responsible for building, maintaining, debugging, and evolving EduManage — a production-grade SaaS education management platform.

---

## Project Identity

**Project Name:** EduManage
**Business Goal:** Multi-tenant SaaS platform for educational institutions — centralizing admissions, fee management, attendance, CRM, staff/HR, and communication in one system.
**Deployment Target:** Production SaaS (multi-tenant, multi-branch)

---

## Core Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Next.js 16 (App Router), Framer Motion, Tailwind CSS 4 |
| Backend | Next.js Server Actions, Prisma ORM, NextAuth.js |
| Database | SQLite (dev) → PostgreSQL (prod), Prisma |
| UI Components | shadcn/ui, Radix UI, Lucide Icons |
| Utilities | TanStack Query/Table, Zod, React Hook Form, Zustand |
| Services | Resend (Emails), Sharp (Images) |

---

## Architecture

- **Multi-tenant modular monolith** — all data scoped by `organizationId` and `branchId`
- **App Router** — all routes live under `src/app/admin/`
- **Service layer pattern** — business logic lives in `src/lib/services/`, never inline in components or routes
- **Server Actions** — preferred over REST API routes for mutations
- **Type-safe** — all DB operations through Prisma, all inputs through Zod schemas

---

## Folder Structure

```
src/
  app/
    admin/          # All dashboard and management modules
    api/            # External API routes (auth, webhooks)
  lib/
    services/       # Business logic layer — THE BRAIN
    types/          # Centralized TypeScript definitions
    utils/          # Shared helpers
  hooks/            # Custom data fetching hooks (useDashboard, useAuth, etc.)
  components/       # Shared UI components
prisma/
  schema.prisma     # Source of truth for DB architecture
```

---

## Authentication & RBAC

- **NextAuth** with Email/Password + Google OAuth
- **Three base roles:** Super Admin → Branch Admin → User
- **Org context:** Every authenticated session carries `organizationId` + `branchId`
- **RBAC Middleware:** Role verification happens at middleware level before reaching handlers
- **Never** check roles inline in components — always go through the RBAC middleware or service layer

---

## Database Rules (Non-Negotiable)

- Every model MUST have `organizationId` — no exceptions
- Every query MUST filter by `organizationId` — no exceptions
- Multi-branch models also filter by `branchId`
- Soft deletes preferred — use `deletedAt DateTime?` pattern
- Never use raw SQL — always Prisma ORM
- Migration naming: `descriptive-feature-name` (e.g. `add-wallet-balance-to-org`)

---

## Service Layer Rules (Non-Negotiable)

- ALL business logic goes in `src/lib/services/` — never in components, never in Server Actions directly
- Server Actions call service functions — they do not contain logic themselves
- Each module has its own service file: `admissionService.ts`, `feeService.ts`, `attendanceService.ts`, etc.
- Services return typed results — never raw Prisma objects to the frontend
- Error handling: services throw typed errors, actions catch and return `{ success, error, data }` shape

---

## Module Status (Current)

| Module | Status |
|---|---|
| Auth & Security | ✅ Ready |
| Admission System | ✅ Ready |
| Fee & Installments | ✅ Ready |
| Courses & Batches | ✅ Ready |
| CRM (Leads/Enquiry) | ✅ Ready |
| Staff & HR | 🟡 Partial |
| Attendance | 🟡 Partial |
| Communication/Wallet | 🟡 Partial (models only) |
| Academic/Timetable | 🔴 Planned |
| Examination | 🔴 Planned |
| Expenses | 🔴 Planned |

---

## Coding Standards

- **TypeScript strict mode** — no `any`, no implicit types
- **Zod** for all input validation at the boundary (Server Actions, API routes)
- **React Hook Form** for all forms — no uncontrolled inputs
- **TanStack Table** for all data grids — no custom table implementations
- **Framer Motion** for all animations — no CSS-only transitions for interactive elements
- **shadcn/ui** components first — don't build primitives that already exist
- File naming: `kebab-case` for files, `PascalCase` for components

---

## API / Server Action Conventions

- Server Actions return: `{ success: boolean, data?: T, error?: string }`
- All mutations validate with Zod before hitting the service layer
- Revalidate affected paths after mutations: `revalidatePath('/admin/...')`
- Never expose Prisma errors to the client — map them to user-friendly messages

---

## UI Conventions

- **Design language:** Premium glassmorphic dark-mode-ready interface
- **Charts:** Recharts only — no other charting library
- **Icons:** Lucide Icons only
- **Responsive:** Mobile-first, but dashboard is desktop-primary
- Loading states: Use skeleton components, not spinners
- Empty states: Always implement — never leave a blank white box

---

## Known Technical Debt

- Google OAuth not fully wired in `LoginForm.tsx`
- Email OTP verification flow incomplete (model exists, logic missing)
- Wallet system has models but no deduction logic
- `expenses/` directory exists but has no DB models yet
- WhatsApp integration not yet connected
- Staff attendance partially implemented

---

## Non-Negotiable Rules

1. Never hardcode `organizationId` or `branchId` — always from session context
2. Never put business logic in components — always service layer
3. Never skip Zod validation on any user input
4. Never use `any` type
5. Always implement loading + error + empty states in UI
6. Always soft-delete — never hard-delete production data
7. New modules must follow the existing module pattern exactly (see `/admin/admissions` as reference)
8. Financial operations (fee, installment, receipt) must be atomic — use Prisma transactions

---

## Memory Update Rule

After each major implementation, update:
- Module status matrix above
- Known Technical Debt section
- Any new service files or utilities introduced
