---
name: new-financial-feature
description: Implements a new financial feature such as expense tracking, wallet deductions, installment plans, or financial reports. Use when building anything involving money, balances, transactions, or receipts.
---

# New Financial Feature Skill

## Core Principle
All financial operations must be atomic. A payment that touches multiple records must use `prisma.$transaction()`. Partial writes are never acceptable.

## Step 1 — Schema First
Design the data model before writing any logic.
Questions to answer:
- What records are created when money moves?
- What records are updated?
- How do we audit this later? (always add `createdBy`, `transactionRef`)
- Can this be reversed? (add `reversedAt`, `reversedBy` if yes)

## Step 2 — Service Layer
In `src/lib/services/[feature]Service.ts`:
```ts
// Template for financial write operations
async function processPayment(input: PaymentInput, orgId: string) {
  return prisma.$transaction(async (tx) => {
    // 1. Validate balances/amounts before any write
    // 2. Create the primary record (payment)
    // 3. Update related records (installment status)
    // 4. Create audit record (receipt)
    // 5. Return typed result
  })
}
```

## Step 3 — Wallet Operations
For wallet deductions (`textBalance`, `emailBalance`):
- Always read current balance inside the transaction
- Validate `balance >= cost` before deducting
- Record the deduction in a wallet ledger entry
- Never trust client-supplied balance values

## Step 4 — Receipt Generation
- Receipt number: `ORG-{year}-{sequential}` — unique per org
- Always include: amount, currency, date, method, receivedBy, studentRef, installmentRef
- Generate PDF receipt using existing receipt generation pattern

## Step 5 — Financial Reports
For exportable reports:
- Aggregate in the service layer — never in the component
- Support date range filtering scoped to `organizationId`
- Export formats: PDF (existing pattern) + Excel via a library
- Always show: opening balance, transactions, closing balance pattern

## Step 6 — UI
- Show amounts formatted consistently: Indian locale (`en-IN`) for INR
- Always show pending dues in red, paid in green
- Use Recharts for revenue/payment trend charts
- Implement print-friendly receipt view
