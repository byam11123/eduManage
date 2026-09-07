---
name: dashboard-module
id: mod_dashboard_005
description: >
  Full-squad expert skill for the EduManage Dashboard / Analytics Module.
  Auto-activates when the user mentions "dashboard", "analytics", "stats", "chart",
  "KPI", "overview", "metrics", or types /dashboard.
  Covers PM requirements, backend aggregation APIs, chart component patterns,
  real-time stats, error handling, performance rules, testing, and proactive suggestions.
triggers:
  - dashboard
  - analytics
  - stats
  - chart
  - kpi
  - metrics
  - overview
  - /dashboard
---

# Dashboard Module — Full Squad Skill

> **Read `../shared-reference/common-checklist.md` first.** All universal rules (auth,
> org scoping, error handling, testing) live there. This file adds Dashboard-specific context.

---

## Related Skills — Apply These When Working in the Dashboard Module

| Task Type | Skill to Use |
|---|---|
| Building chart components, stats cards, widgets | → `frontend-design` skill |
| Recharts styling, responsive containers, dark mode charts | → `tailwind-4-docs` skill |
| Reviewing dashboard layout, accessibility, empty states | → `web-design-guidelines` skill |
| Writing aggregation API, caching, response shaping | → `nodejs-backend-patterns` skill |
| Adding indexes for date-range queries, aggregation perf | → `prisma-database-setup` skill |

> Charts must use **Recharts only**. Apply `tailwind-4-docs` for all container and wrapper styling. Apply `frontend-design` to ensure chart color choices match the overall product aesthetic (indigo primary, emerald success, rose danger).

---

## Squad Context

| Role | Responsibility |
|---|---|
| 🔴 PM | KPI definition, which numbers matter to which role, drill-down paths |
| 🔧 Senior Engineer | Aggregation queries, API caching, chart component patterns |
| 🗄️ DBA | COUNT/SUM queries, date range indexes, query performance |
| 🧪 QA | Data accuracy, role-scoped visibility, empty/loading states |

---

## Module Overview

**Business purpose:** Give every admin role a live, accurate pulse of their institution.

**Audience per role:**
| Role | What They See |
|---|---|
| Super Admin | All branches, all-org totals, cross-branch comparison |
| Branch Admin | Their branch only, scoped to `branchId` |

**Key widgets:**
- Revenue this month / this year
- New admissions this month
- Outstanding fees (overdue count + amount)
- Follow-up due today (Enquiry)
- Active students
- Fee collection chart (monthly bar chart)
- Pipeline funnel (Enquiry statuses)

---

## API Routes

### File Location
```
src/app/api/dashboard/
  route.ts      GET — returns all aggregated stats in one response
```

### Dashboard Stats — GET `/api/dashboard`
**Always org-scoped.** Branch Admins automatically get `branchId` filter from session.

Required response shape:
```typescript
{
  success: true,
  data: {
    stats: {
      totalStudents: number
      activeStudents: number
      newAdmissionsThisMonth: number
      totalRevenue: number          // sum of all receipts
      revenueThisMonth: number
      outstandingFees: number       // sum of unpaid installments
      overdueCount: number          // installments past due date
      followUpsDueToday: number     // enquiries with followUpDate <= today
      activeLeads: number
    },
    charts: {
      monthlyRevenue: { month: string, amount: number }[]   // last 12 months
      admissionTrend: { month: string, count: number }[]    // last 12 months
      enquiryFunnel: { status: string, count: number }[]
      feeCollectionByBranch: { branch: string, collected: number, outstanding: number }[]
    },
    recentActivity: {
      recentAdmissions: Student[]   // last 5
      recentPayments: Receipt[]     // last 5
      upcomingFollowUps: Enquiry[]  // next 5 by followUpDate
    }
  }
}
```

### Aggregation Query Patterns
```typescript
// Revenue this month
const revenueThisMonth = await db.receipt.aggregate({
  where: {
    student: { branch: { organizationId: orgId } },
    date: { gte: startOfMonth(new Date()) }
  },
  _sum: { amount: true }
})

// Outstanding fees
const outstanding = await db.installment.aggregate({
  where: {
    studentCourse: { student: { branch: { organizationId: orgId } } },
    status: { not: 'paid' }
  },
  _sum: { amount: true },
  _count: true
})

// Monthly revenue chart (last 12 months)
// Use groupBy with month extraction — or fetch all receipts and aggregate in JS
// For SQLite: aggregate in JS. For PostgreSQL: use db.$queryRaw with DATE_TRUNC
```

---

## Performance Rules for Dashboard

1. **Never run N+1 queries** — always use `include` and aggregate queries
2. **Cache dashboard data** — use a `useDashboard` hook with SWR/TanStack Query with `staleTime: 60_000` (1 minute)
3. **Single API endpoint** — one call returns everything (not 6 separate calls)
4. **Fallback on error** — if one widget fails, show "Data unavailable" badge on that widget only, don't crash the whole page
5. **Date range indexes** — ensure `date` on Receipt and `createdAt` on Student are indexed

---

## Frontend Components

### File Structure
```
src/app/admin/dashboard/
  page.tsx               main dashboard page
src/components/admin/dashboard/
  StatsCard.tsx          single KPI card with trend indicator
  RevenueChart.tsx       monthly bar chart (Recharts)
  AdmissionTrend.tsx     monthly line chart
  EnquiryFunnel.tsx      status funnel/bar chart
  RecentActivity.tsx     recent admissions + payments list
  FollowUpAlert.tsx      "X follow-ups due today" banner
```

### Chart Library
**Recharts ONLY.** No other charting library. No D3 direct usage.

```typescript
// Correct chart component pattern
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

<ResponsiveContainer width="100%" height={250}>
  <BarChart data={monthlyRevenue}>
    <XAxis dataKey="month" />
    <YAxis tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
    <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
    <Bar dataKey="amount" fill="#4F46E5" radius={[6, 6, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

### Stats Card Pattern
```tsx
<StatsCard
  title="Revenue This Month"
  value={`₹${stats.revenueThisMonth.toLocaleString('en-IN')}`}
  trend={+12.4}           // percentage change vs last month
  trendLabel="vs last month"
  icon={IndianRupee}
  color="emerald"
/>
```

### Loading State (Skeleton, Not Spinner)
```tsx
// While loading, show skeleton cards — never blank
{loading ? (
  <div className="grid grid-cols-4 gap-6">
    {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
  </div>
) : (
  <StatsGrid stats={data.stats} />
)}
```

---

## Role-Scoped Visibility Rules

```typescript
// In the dashboard API handler
const branchFilter = payload.role === 'super_admin'
  ? {}                                       // see all branches
  : { branchId: payload.branchId }           // scoped to own branch

// Apply to all queries
await db.student.count({
  where: { organizationId: orgId, ...branchFilter }
})
```

---

## Error Handling (Dashboard-Specific)

| Scenario | Response |
|---|---|
| DB aggregation slow/timeout | Show cached data with "Last updated X mins ago" |
| One widget fails | Show error state for that widget only, not full page crash |
| No data (new org) | Show zero-state with onboarding CTA ("Add your first student") |
| Chart data empty | Show empty chart with "No data for selected period" |

---

## Testing Checklist (Dashboard Module)

### Data Accuracy
- [ ] `totalStudents` matches actual count in Students module
- [ ] `revenueThisMonth` matches sum of this month's Receipts
- [ ] `outstandingFees` matches sum of all unpaid Installments
- [ ] `followUpsDueToday` matches Enquiry count with `followUpDate <= today`
- [ ] Monthly chart shows last 12 months (not missing any months)

### Role Scoping
- [ ] Branch Admin sees ONLY their branch data
- [ ] Super Admin sees aggregated data across ALL branches
- [ ] Switching between branches (if supported) updates all widgets

### Performance
- [ ] Dashboard loads in < 2 seconds on dev
- [ ] Single API call (not multiple)
- [ ] Charts render without flickering

### UI
- [ ] Skeleton loading state shows before data arrives
- [ ] Empty state shown for new organizations with no data
- [ ] "Follow-up due today" banner links to Enquiry module
- [ ] Chart tooltips show Indian currency format (₹ with lakhs/crores)
- [ ] Dark mode charts readable (no white text on white chart)

---

## Proactive Suggestion Template (Dashboard Module)

```
📋 SQUAD BRIEF — Dashboard / [Widget/Feature]

🔴 PM: [What decision does this data help admins make?]
🔧 Engineer: [Aggregation query plan, caching strategy, chart component]
🗄️ DBA: [Index needed for this query? Date range performance?]
🧪 QA: [Verify count accuracy, role scoping, empty/loading states]

❓ Choose your approach:
  A) Simple count query (fast to build, limited insight)
  B) Full aggregation with trend comparison ← recommended
  C) Pre-computed summary table (high perf, complex to maintain)
```

---

## Known Dashboard Module Gaps (Track These)

- [ ] Monthly chart data uses JS aggregation for SQLite — needs real SQL groupBy for PostgreSQL
- [ ] No date range filter (currently hardcoded to "this month" / "last 12 months")
- [ ] No branch comparison chart (Super Admin feature)
- [ ] No export of dashboard as PDF report
- [ ] Fee collection trend doesn't show installment vs additional fee breakdown
- [ ] Real-time updates — currently requires page refresh to see new data

---

## Admin Action Operations (What Exists in the Real App)

| Action | Trigger | Endpoint / Component |
|---|---|---|
| `refresh_dashboard` | Page reload / SWR stale | `GET /api/dashboard` |
| `open_followup_list` | "Follow-ups due" banner click | → `/admin/enquiry?followUpDue=true` |
| `view_recent_admissions` | Recent Admissions widget | → `/admin/students` |
| `view_recent_payments` | Recent Payments widget | → `/admin/fees` |

**Missing critical actions (implement these):**
- `filter_by_date_range` — custom start/end date picker for all widgets
- `switch_branch_view` — Super Admin branch selector
- `export_dashboard_pdf` — snapshot of current dashboard state
- `open_followup_list` — direct link from overdue count badge

---

## Performance & Caching Rules (Dashboard-Specific)

The dashboard is the most read-heavy page. Follow these rules strictly:

```typescript
// Server-side: Add cache header to dashboard API
return NextResponse.json(data, {
  headers: { 'Cache-Control': 'private, max-age=60' }  // 60s browser cache
})

// Client-side: TanStack Query stale time
useQuery({
  queryKey: ['dashboard', orgId, branchId],
  staleTime: 60_000,      // don't refetch for 60s
  gcTime: 300_000,        // keep in memory 5min
})
```

**PostgreSQL migration path for monthly chart:**
```typescript
// SQLite (current) — JS aggregation
const monthly = receipts.reduce((acc, r) => { ... }, {})

// PostgreSQL (future) — use DATE_TRUNC
const monthly = await db.$queryRaw`
  SELECT DATE_TRUNC('month', date) as month, SUM(amount) as total
  FROM "Receipt" WHERE "organizationId" = ${orgId}
  GROUP BY 1 ORDER BY 1
`
```

---

## Security Checklist (Dashboard Module)

- [ ] All aggregation queries filter by `organizationId` from JWT
- [ ] Branch Admin's branch filter cannot be overridden via query param
- [ ] Revenue totals are org-scoped — Super Admin cannot see another org's data
- [ ] Dashboard API does not expose individual student names or payment details
- [ ] `Cache-Control: private` is set — never `public` (shared cache would leak org data)

---

## Automated Test Commands

```bash
# Run dashboard tests
npm run test -- --testPathPattern="dashboard"

# Verify data accuracy (compare dashboard totals vs module counts)
npm run test -- --testPathPattern="dashboard-accuracy"

# Performance: ensure dashboard API responds < 2000ms
npm run test -- --testPathPattern="dashboard-perf"
```
