---
name: fees-module
id: mod_fees_002
description: >
  Full-squad expert skill for the EduManage Fees & Payments Module. Auto-activates
  when the user mentions "fee", "fees", "payment", "receipt", "installment", "collect",
  "proof", "additional fee", or types /fees.
  Covers PM requirements, backend API, Prisma schema, frontend components, financial
  safety, audit trail, PDF generation, proof uploads, error handling, testing, and
  proactive suggestions with multiple choices.
triggers:
  - fee
  - fees
  - payment
  - installment
  - receipt
  - collect
  - proof
  - additional fee
  - /fees
---

# Fees Module — Full Squad Skill

> **Read `../shared-reference/common-checklist.md` first.** All universal rules (auth,
> org scoping, error handling, testing) live there. This file adds Fees-specific context.

---

## Related Skills — Apply These When Working in the Fees Module

| Task Type | Skill to Use |
|---|---|
| Building `CollectFeeDialog`, `ViewPaymentDialog`, or any UI | → `frontend-design` skill |
| Writing Tailwind classes, styling, dark mode | → `tailwind-4-docs` skill |
| Reviewing UI for accessibility or UX | → `web-design-guidelines` skill |
| Writing `/api/fees/collect`, service layer, error handling | → `nodejs-backend-patterns` skill |
| Adding fields to `Receipt`, `Installment`, `AdditionalFee` | → `prisma-database-setup` skill |

> **Financial features are the highest-risk area in the product.** When in doubt on any financial API or schema change, apply both `nodejs-backend-patterns` (for transaction safety) and `prisma-database-setup` (for migration safety) together.

---

## Squad Context

| Role | Responsibility |
|---|---|
| 🔴 PM | Fee collection pipeline, legal audit trail, proof requirements |
| 🔧 Senior Engineer | Atomic transactions, receipt generation, file uploads |
| 🗄️ DBA | Receipt sequencing, multi-table transactions, index design |
| 🧪 QA | Financial edge cases, partial payments, double-collection prevention |

**Before implementing any Fee feature**, present the Proactive Suggestion Format below.

---

## Module Overview

**Business purpose:** Track, collect, and audit every rupee a student pays.

**Key entities:**
- `Installment` — per-course scheduled fee payment
- `AdditionalFee` — one-off charges (exam, ID card, tour, fine)
- `Receipt` — immutable financial record for every payment
- File uploads — proof documents (screenshots, bank receipts)

**Primary pages:**
- `/admin/fees` — global installment ledger (all students, all courses)
- `/admin/students/[id]` → Payments tab — per-student financial view

---

## Database (Prisma) Rules

### `Installment` Model — Required Fields
```prisma
model Installment {
  id              String        @id @default(cuid())
  studentCourseId String
  installmentNo   Int
  dueDate         DateTime
  amount          Float

  // Payment fields (populated on collection)
  paidDate        DateTime?
  paidAmount      Float    @default(0)
  status          String   @default("pending") // pending, paid, partial
  mode            String?  // cash, online, cheque, bank_transfer
  receiptNo       String?
  transactionId   String?
  remarks         String?
  proofUrl        String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### `AdditionalFee` Model — Required Fields
```prisma
model AdditionalFee {
  id              String   @id @default(cuid())
  studentId       String
  feeDisplayId    String?  @unique  // AF/YY/NNNNN
  feeYear         Int?
  feeSequence     Int?

  title           String
  feeType         String   // exam, tour, project, id_card, fine, other
  amount          Float
  status          String   @default("pending")
  dueDate         DateTime?
  paidDate        DateTime?
  receiptNo       String?
  transactionId   String?
  proofUrl        String?
  remarks         String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([feeYear, feeSequence])
}
```

### `Receipt` Model — Immutable Audit Record
```prisma
model Receipt {
  id              String   @id @default(cuid())
  receiptNo       String   @unique  // RCP/YYYY/NNNNN
  receiptYear     Int
  receiptSequence Int

  amount          Float
  date            DateTime @default(now())
  mode            String
  transactionId   String?
  remark          String?
  proofUrl        String?

  studentId       String
  student         Student  @relation(...)

  @@unique([receiptYear, receiptSequence])
}
```

### Display ID Sequences
| Model | Format | Scope |
|---|---|---|
| Receipt | `RCP/YYYY/NNNNN` | Per organization, per year |
| AdditionalFee | `AF/YY/NNNNN` | Per organization, per year |

**Never use global sequences** — always scope by `organizationId`.

---

## API Routes

### File Locations
```
src/app/api/fees/
  route.ts               GET (list all installments)
  collect/
    route.ts             POST (collect payment)
src/app/api/students/
  [id]/fees/
    route.ts             POST (assign additional fee)
src/app/api/upload/
  route.ts               POST (proof document upload)
```

### Fee Collection — POST `/api/fees/collect`

**This is the most critical endpoint. It MUST be a Prisma transaction.**

```typescript
// Required body
{
  installmentId?: string    // XOR
  additionalFeeId?: string  // one of these
  amount: number
  mode: 'cash' | 'online' | 'cheque' | 'bank_transfer'
  transactionId?: string
  remarks?: string
  proofUrl?: string        // Required if mode !== 'cash'
}
```

**Transaction steps (all or nothing):**
1. Fetch and validate the target (Installment or AdditionalFee)
2. Verify `organizationId` matches session
3. Calculate new paid amount and status
4. Generate `receiptNo` (sequential, org-scoped)
5. Update the Installment/AdditionalFee record
6. Create `Receipt` record
7. Return receipt data to client

### Proof Upload — POST `/api/upload`
```typescript
// Expected: multipart/form-data with 'file' field
// Returns: { success: true, url: '/uploads/proofs/filename.jpg' }
// Validates: max 5MB, accept image/* and .pdf
// Saves to: public/uploads/proofs/ (with sanitized filename)
```

### Installment List — GET `/api/fees`
Supports filters: `search`, `status`, `branchId`, `page`, `limit`
Always includes: `studentCourse.student`, `studentCourse.course`, `studentCourse.student.branch`

---

## Backend Service Layer

**File:** `src/lib/services/feeService.ts`

```typescript
collectPayment(data: CollectFeeInput, orgId: string)  // MUST use db.$transaction
assignAdditionalFee(studentId: string, data: AssignFeeInput, orgId: string)
getInstallments(orgId: string, filters?: FeeFilters)
getStudentReceipts(studentId: string, orgId: string)
generateReceiptNo(orgId: string, year: number)   // sequential, transactional
generateFeeDisplayId(orgId: string, year: number) // AF/YY/NNNNN, transactional
```

---

## Frontend — `CollectFeeDialog` Rules

**Location:** `src/components/admin/fees/CollectFeeDialog.tsx`

### State Reset (Required)
```typescript
useEffect(() => {
  if (open && installment) {
    const pending = installment.amount - (installment.paidAmount || 0)
    setAmount(pending.toString())
    setMode('cash')
    setTransactionId('')
    setRemarks('')
    setProofFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
}, [open, installment])
```

### Proof Upload — Required Behavior
```typescript
const requiresProof = mode !== 'cash'

// Block submission if proof is missing for non-cash
if (requiresProof && !proofFile) {
  toast.error('Payment proof is required for online/cheque/bank transfer payments')
  return
}
```

### File Input Pattern (Correct — No Overlay Bug)
```tsx
{/* Hidden input triggered by ref */}
<input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf"
  onChange={(e) => setProofFile(e.target.files?.[0] || null)} />

{/* Clickable area */}
<button type="button" onClick={() => fileInputRef.current?.click()}>
  ...dropzone UI...
</button>

{/* Remove button — completely separate from input, no z-index fight */}
<Button onClick={() => { setProofFile(null); fileInputRef.current.value = '' }}>
  <X />
</Button>
```

### Submit Flow
```
1. Validate amount > 0
2. Validate amount ≤ remaining balance
3. If requiresProof && !proofFile → block
4. Upload proof → get proofUrl
5. POST /api/fees/collect → get receiptNo, paidDate
6. Call generateFeeReceipt() → auto-download PDF
7. Close dialog, call onSuccess()
```

---

## Frontend — `ViewPaymentDialog` Rules

**Location:** `src/components/admin/students/view/ViewPaymentDialog.tsx`

### Required Field Layout
```
┌─────────────────┬─────────────────┐
│   Amount Paid   │  Collected On   │  ← paidDate with time (not createdAt)
├─────────────────┼─────────────────┤
│  Payment Mode   │   Receipt No.   │
├─────────────────┼─────────────────┤
│  Reference ID   │  Payment Proof  │  ← "View Document" link or "Not uploaded"
├─────────────────────────────────── ┤
│  Remarks                           │  ← NOT "Payment Notes" — use "Remarks"
├─────────────────────────────────── ┤
│  [Download Receipt PDF]   [Close]  │  ← always show if receiptNo exists
└────────────────────────────────────┘
```

### "Collected On" Timestamp
```typescript
// CORRECT — show actual collection time
formatDateTime = (date) => new Date(date).toLocaleString('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit', hour12: true
})
// Shows: "02 Sep 2026, 03:45 PM"
// Source: installment.paidDate (NOT createdAt)
```

### PDF Receipt Download
```typescript
// Always available if receiptNo exists
handleDownloadReceipt = () => {
  generateFeeReceipt({
    receiptNo: installment.receiptNo,
    date: new Date(installment.paidDate),
    studentName: ..., studentId: ..., courseName: ...,
    installmentNo: isAdditionalFee ? 0 : installment.installmentNo,
    amount: installment.paidAmount || installment.amount,
    mode: installment.mode || 'cash',
    organizationName: user?.organization?.name || 'EduManage',
    branchName: student.branch?.name || ''
  })
}
```

---

## Fees Module Page (`/admin/fees`) Rules

### Paid Row Action
- **Unpaid:** "Collect" button → opens `CollectFeeDialog`
- **Paid:** Eye icon button → opens `ViewPaymentDialog`
- Never show static green tick with no interactivity on a paid row

### Columns to Show
```
[Checkbox] | Student & Course | Due Date | Amount | Paid | Status | Branch | [Action]
```

### Receipt No. Column
Display in the table for paid rows (monospace, indigo color).

---

## Financial Safety Rules (Non-Negotiable)

1. **Every payment = one Receipt record** — always, no exceptions
2. **`db.$transaction()`** — receipt creation and installment update MUST be atomic
3. **Sequential IDs** — generate inside the transaction to prevent race conditions
4. **`proofUrl` dual storage** — store on both the payment record AND the Receipt
5. **Never update a Receipt** — it is immutable. If an error occurred, cancel and re-collect
6. **Never hard-delete** any Receipt, Installment, or AdditionalFee record

---

## Testing Checklist (Fees Module)

### Financial Integrity
- [ ] Every successful collection creates exactly one Receipt record in DB
- [ ] Receipt `receiptNo` is sequential and unique within the organization
- [ ] `paidDate` is the actual collection datetime (not `updatedAt`)
- [ ] `proofUrl` is saved on both the Installment/AdditionalFee AND the Receipt
- [ ] Partial payment updates `paidAmount` correctly and status → "partial"
- [ ] Full payment sets status → "paid"

### Proof Upload
- [ ] Non-cash payment without proof is blocked before API call
- [ ] Proof file > 5MB is rejected with clear error
- [ ] PDF proof is accepted (not just images)
- [ ] Removing proof resets file input correctly (no stale file)

### UI
- [ ] `CollectFeeDialog` resets to defaults on every open
- [ ] `ViewPaymentDialog` shows "Collected On" with time (not just date)
- [ ] "Download Receipt" button re-generates PDF correctly
- [ ] Paid installment shows Eye button, not Collect button
- [ ] Additional fee shows `feeDisplayId` badge
- [ ] Paid additional fee shows Eye button (not PAY)

### Edge Cases
- [ ] Cannot collect more than remaining balance
- [ ] 0-amount payment is rejected
- [ ] Concurrent payment attempt (race condition) — receipt sequence must not duplicate
- [ ] Network failure mid-upload — proof upload fails gracefully
- [ ] API failure after proof upload but before collection — show retry option

---

## Proactive Suggestion Template (Fees Module)

```
📋 SQUAD BRIEF — Fees Module / [Feature]

🔴 PM: [What financial/audit/legal need does this solve?]
🔧 Engineer: [Atomic transaction plan, API + UI changes]
🗄️ DBA: [Schema changes? Index? Sequence strategy?]
🧪 QA: [Financial edge cases — partial payment, duplicate receipt, race conditions]

❓ Choose your approach:
  A) [Simpler approach — less code, some limitations]
  B) [Full approach — atomic, audit-safe, more work] ← recommended
  C) [Quick workaround — technical debt noted]
```

---

## Known Fees Module Gaps (Track These)

- [ ] Refund flow — no way to reverse a payment currently
- [ ] Bulk receipt export (all receipts for a student as one PDF) — not built
- [ ] Fee waiver with approval workflow — not implemented
- [ ] Overdue notification (WhatsApp/email) — integration missing
- [ ] GST/tax calculation on fees — not handled
- [ ] Payment gateway integration (Razorpay/PayU) — only offline payments currently

---

## Admin Action Operations (What Exists in the Real App)

| Action | Trigger | Endpoint / Component |
|---|---|---|
| `collect_payment` | "Collect" button on fee row | `POST /api/fees/collect` |
| `upload_proof` | File picker in CollectFeeDialog | `POST /api/upload` |
| `view_payment_details` | Eye icon on paid row | `ViewPaymentDialog` |
| `download_receipt_pdf` | "Download Receipt" button | `generateFeeReceipt()` |
| `assign_additional_fee` | "+ Assign Fee" on student profile | `POST /api/students/[id]/fees` |

**Missing critical actions (implement these):**
- `export_fee_report` — CSV/PDF of all collections for a date range
- `run_fee_reconciliation` — compare DB records vs manual ledger
- `trigger_overdue_notification` — WhatsApp/email for pending installments
- `process_refund` — reverse a payment with audit trail

---

## Security Checklist (Fees Module)

- [ ] `/api/fees/collect` is rate-limited (max 3 requests/second per user)
- [ ] `amount` is validated server-side — cannot be 0 or negative
- [ ] `amount` cannot exceed remaining balance (validated in service layer, not just UI)
- [ ] `proofUrl` path is validated — no directory traversal (`../`, absolute paths)
- [ ] Proof MIME type validated server-side (not just browser `accept` attribute)
- [ ] Receipt numbers are generated inside a transaction — no race condition duplicates
- [ ] Receipt records are immutable — no `UPDATE` allowed on `Receipt` table
- [ ] Org scoping enforced before any payment operation — cannot pay for another org's student

---

## Automated Test Commands

```bash
# Run all fee-related API tests
npm run test -- --testPathPattern="fees|collect|receipt"

# Test proof upload endpoint
npm run test -- --testPathPattern="upload"

# Verify receipt sequence is unique under concurrent requests
npm run test -- --testPathPattern="receipt-sequence"
```
