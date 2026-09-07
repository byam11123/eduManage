---
name: leads-module
id: mod_leads_004
description: >
  Full-squad expert skill for the EduManage Leads / Sales Pipeline Module.
  Auto-activates when the user mentions "lead", "leads", "sales", "conversion",
  "campaign", "referral partner", "pipeline", or types /leads.
  Covers PM requirements, backend API, Prisma schema, frontend components, real
  database (not mock data), referral partner tracking, error handling, testing,
  and proactive suggestions.
triggers:
  - lead
  - leads
  - sales
  - referral
  - referral partner
  - campaign
  - /leads
---

# Leads Module — Full Squad Skill

> **Read `../shared-reference/common-checklist.md` first.** All universal rules (auth,
> org scoping, error handling, testing) live there. This file adds Leads-specific context.

---

## Related Skills — Apply These When Working in the Leads Module

| Task Type | Skill to Use |
|---|---|
| Building lead cards, partner widgets, pipeline views | → `frontend-design` skill |
| Tailwind for kanban columns, responsive layout | → `tailwind-4-docs` skill |
| Reviewing "Recently Added" widget, list UI | → `web-design-guidelines` skill |
| Writing lead API, referral partner endpoints | → `nodejs-backend-patterns` skill |
| Adding `Lead`, `ReferralPartner` models, indexes | → `prisma-database-setup` skill |

> ⚠️ **Always replace mock data with real DB queries.** If you see `MOCK_LEADS` or any hardcoded array, that is a production bug — fix it immediately using the `nodejs-backend-patterns` real DB query patterns.

---

## Squad Context

| Role | Responsibility |
|---|---|
| 🔴 PM | Sales pipeline visibility, referral tracking, conversion metrics |
| 🔧 Senior Engineer | Real DB queries (no mock data!), referral partner APIs |
| 🗄️ DBA | Lead source indexing, referral partner relations, stage tracking |
| 🧪 QA | Pipeline stage transitions, referral attribution, Recently Added widget |

---

## ⚠️ Critical Known Issue

**The Leads module was previously shipping with mock/fake data instead of real database queries.**
This is a **production-breaking bug**. Every API in this module MUST query the real database.

Before building any Leads feature, verify:
```typescript
// CORRECT — real DB query
const leads = await db.lead.findMany({
  where: { organizationId: payload.organizationId }
})

// WRONG — never ship this
const leads = MOCK_LEADS  // mock data
```

---

## Module Overview

**Business purpose:** Track potential students from first touch through conversion to admission.

**Difference from Enquiry:**
- **Lead** = outbound / marketing-generated contact (campaigns, referrals, cold outreach)
- **Enquiry** = inbound / self-initiated contact (walk-in, website form, call)
- Leads flow into the Enquiry pipeline when qualified

**Status Pipeline:**
```
new → contacted → qualified → converted
                            → dropped
```

**Key entities:**
- `Lead` — the prospect record
- `ReferralPartner` — person/org who referred the lead
- `leadId` — auto-generated display ID (LEAD/YY/NNNNN)

---

## Database (Prisma) Rules

### `Lead` Model — Required Fields
```prisma
model Lead {
  id              String   @id @default(cuid())
  leadId          String?  @unique  // LEAD/YY/NNNNN
  leadYear        Int?
  leadSequence    Int?

  firstName       String
  lastName        String
  email           String?
  phone           String
  source          String   @default("website") // website, referral, social_media, campaign, other
  status          String   @default("new")     // new, contacted, qualified, converted, dropped

  notes           String?
  followUpDate    DateTime?
  lastContactedAt DateTime?
  convertedAt     DateTime?
  courseInterest  String?   // which course they're interested in

  // Referral attribution
  referralPartnerId String?
  referralPartner   ReferralPartner? @relation(...)

  organizationId  String
  branchId        String

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  @@unique([leadYear, leadSequence])
  @@index([organizationId])
  @@index([branchId])
  @@index([status])
  @@index([referralPartnerId])
  @@index([source])
}
```

### `ReferralPartner` Model
```prisma
model ReferralPartner {
  id              String   @id @default(cuid())
  name            String
  mobile          String?
  email           String?
  type            String   @default("individual") // individual, agency, school, college
  status          String   @default("active")

  organizationId  String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  leads           Lead[]

  @@index([organizationId])
}
```

---

## API Routes

### File Locations
```
src/app/api/leads/
  route.ts              GET (list) | POST (create)
  [id]/
    route.ts            GET | PATCH | DELETE (soft)
src/app/api/admin/referrals/
  route.ts              GET (list partners + recently added) | POST (create partner)
  [id]/
    route.ts            GET | PATCH | DELETE
```

### Lead List — GET `/api/leads`
**Must query real DB.** Supported filters:
- `search` — name, phone, email
- `status` — new | contacted | qualified | converted | dropped
- `source` — website | referral | social_media | campaign | other
- `branchId`
- `referralPartnerId`
- `page`, `limit`

Include: `referralPartner` relation in every query

### Referral Partners — GET `/api/admin/referrals`
```typescript
// ⚠️ KNOWN BUG: "Recently Added" was not returning real data
// FIX: always include recentlyAdded in the response
const partners = await db.referralPartner.findMany({
  where: { organizationId: payload.organizationId },
  orderBy: { createdAt: 'desc' },
  include: { _count: { select: { leads: true } } }
})

return NextResponse.json({
  success: true,
  data: {
    partners,
    recentlyAdded: partners.slice(0, 5),  // last 5 by createdAt
    stats: {
      total: partners.length,
      active: partners.filter(p => p.status === 'active').length
    }
  }
})
```

---

## Backend Service Layer

**File:** `src/lib/services/leadService.ts`

```typescript
getLeads(orgId, filters?, pagination?)
getLeadById(id, orgId)
createLead(data, orgId, branchId)
updateLead(id, updates, orgId)        // validate status transitions
convertLeadToEnquiry(leadId, orgId)   // create Enquiry, mark lead as converted
softDeleteLead(id, orgId)

getReferralPartners(orgId)
getReferralPartnerById(id, orgId)
createReferralPartner(data, orgId)
getLeadsByPartner(partnerId, orgId)   // attribution report
```

---

## Frontend Components

### File Structure
```
src/app/admin/leads/
  page.tsx              leads list + pipeline view
src/components/admin/leads/
  LeadCard.tsx          kanban card / table row
  LeadFilters.tsx       filter bar with source + status
  LeadDialog.tsx        create/edit modal
  ReferralPartnerCard.tsx  partner card with lead count
  RecentlyAddedWidget.tsx  ← fix this widget to use real data
```

### ⚠️ Recently Added Widget — Known Bug Fix
The "Recently Added" widget on the Referral Partners section must pull from real DB:
```typescript
// In useReferrals hook or API
const recentlyAdded = await db.referralPartner.findMany({
  where: { organizationId: orgId },
  orderBy: { createdAt: 'desc' },
  take: 5
})
```
The UI component must render from this real data — **not hardcoded or empty**.

### Lead Source Colors
```
website      → blue
referral     → indigo
social_media → purple
campaign     → orange
other        → gray
```

---

## Referral Partner Rules

1. Every lead from a referral partner must have `referralPartnerId` populated
2. Partner lead count must be calculated from actual `Lead` records (not stored counter)
3. "Recently Added" partners must be sorted by `createdAt DESC`
4. Partner type should be shown as a badge (individual / agency / school / college)

---

## Testing Checklist (Leads Module)

### Real Data Verification
- [ ] Lead list shows actual DB records (not mock data)
- [ ] "Recently Added" partners are real, sorted by `createdAt DESC`
- [ ] Partner lead count matches actual `Lead` records with that partner
- [ ] Stats (total, active partners) reflect real DB counts

### Pipeline
- [ ] New lead gets unique `leadId`
- [ ] Status transitions are validated (no going backward)
- [ ] Converted leads show `convertedAt` timestamp
- [ ] Dropped leads are visually distinct

### Multi-tenant
- [ ] Leads are scoped to `organizationId`
- [ ] Referral partners are scoped to `organizationId`
- [ ] Branch Admin sees only their branch leads

### UI
- [ ] Both list and kanban views render with real data
- [ ] Referral partner dropdown in Lead form shows real partners
- [ ] Recently Added widget shows ≤5 most recent partners
- [ ] Source badge colors match spec

---

## Proactive Suggestion Template (Leads Module)

```
📋 SQUAD BRIEF — Leads Module / [Feature]

🔴 PM: [How does this improve pipeline visibility or referral tracking?]
🔧 Engineer: [Real DB query pattern, relations needed, API changes]
🗄️ DBA: [Index on source/status/referralPartnerId needed?]
🧪 QA: [Verify real data, test "Recently Added", check org scoping]

❓ Choose your approach:
  A) Basic list only (simple, fast)
  B) Full pipeline with kanban + stats ← recommended
  C) Advanced CRM (activity timeline, scoring) — high effort
```

---

## Known Leads Module Gaps (Track These)

- [ ] ~~Mock data in API~~ FIXED — must use real DB queries
- [ ] ~~Recently Added widget empty~~ FIXED — must use real data
- [ ] Lead scoring / prioritization — not implemented
- [ ] Campaign management — leads can be tagged with a campaign but no campaign model
- [ ] Convert Lead → Enquiry flow — service method exists but no UI button
- [ ] Referral commission tracking — not implemented
- [ ] Lead deduplication — duplicate phone numbers not flagged

---

## Admin Action Operations (What Exists in the Real App)

| Action | Trigger | Endpoint / Component |
|---|---|---|
| `create_lead` | "Add Lead" button | `POST /api/leads` |
| `update_lead_status` | Status change in dialog | `PATCH /api/leads/[id]` |
| `create_referral_partner` | "Add Partner" button | `POST /api/admin/referrals` |
| `view_partner_leads` | Partner card click | `GET /api/leads?referralPartnerId=X` |
| `view_recently_added` | Partners sidebar widget | `GET /api/admin/referrals` |

**Missing critical actions (implement these):**
- `convert_lead_to_enquiry` — service method exists, no UI button yet
- `run_deduplication_check` — find leads with same phone number
- `export_lead_report` — pipeline CSV by status/source/partner
- `assign_campaign` — tag lead with a campaign for attribution
- `check_mock_data_regression` — CI assertion that no mock constants exist in API routes

---

## Security Checklist (Leads Module)

- [ ] Leads list filters by `organizationId` from JWT — no cross-org leaks
- [ ] Referral partners are scoped to `organizationId` — Branch Admin cannot see another org's partners
- [ ] `phone` is not exposed in bulk list response without auth
- [ ] No mock data arrays in any API route file (`MOCK_LEADS`, `MOCK_PARTNERS`, etc.) — CI test enforced
- [ ] Lead status transitions validated server-side — cannot skip stages via direct API call
- [ ] Referral partner deletion is soft — associated leads keep their `referralPartnerId`

---

## Automated Test Commands

```bash
# Run leads module tests
npm run test -- --testPathPattern="leads|referral"

# ⚠️ CRITICAL: Assert no mock data in API routes
npx ts-node -e "require('fs').readdirSync('src/app/api').forEach(f => { const c = require('fs').readFileSync('src/app/api/' + f, 'utf8'); if (c.includes('MOCK_')) throw new Error('Mock data found in ' + f) })"

# Test pipeline status transitions
npm run test -- --testPathPattern="lead-status"
```
