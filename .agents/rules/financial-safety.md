# Financial Operations Safety
activation: glob — src/lib/services/fee*.ts, src/lib/services/installment*.ts, src/lib/services/receipt*.ts

## Atomic Transactions Required
All fee, installment, and receipt operations MUST use `prisma.$transaction()`.
A payment that updates installment status AND creates a receipt must never do so in two separate queries.

```ts
// REQUIRED pattern for any financial write
const result = await prisma.$transaction(async (tx) => {
  const payment = await tx.payment.create({ data: { ... } })
  const receipt = await tx.receipt.create({ data: { ... } })
  await tx.installment.update({ where: { id }, data: { status: 'PAID' } })
  return { payment, receipt }
})
```

## Never
- Never mark installment paid without creating a receipt
- Never create a receipt without updating installment status
- Never allow negative balance — validate before deducting wallet balance
- Never expose raw payment amounts to client without re-fetching from DB

## Receipt Generation
- Receipt numbers must be unique per organization
- Use `organizationId + sequential number` pattern
- Always include: amount, date, receivedBy, installmentRef, studentRef
