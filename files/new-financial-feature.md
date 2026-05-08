# New Financial Feature Workflow
description: Implements any new financial feature — expense tracking, wallet deductions, installment plans, financial reports, or payment methods. Invoke with /new-financial-feature

## Steps

1. Ask the user: What financial operation is being added? What records are created/updated when money moves? Does it need to be reversible?

2. Apply the `new-financial-feature` skill.

3. Design the data model first. Read existing fee/installment/receipt models via Prisma MCP as reference.

4. Apply `prisma-migration` skill to add any new models or columns.

5. Implement the service function using `prisma.$transaction()` for all writes that touch multiple records.

6. Add wallet balance validation if the feature deducts from `textBalance` or `emailBalance`.

7. Create Server Actions with Zod validation.

8. Build UI: form for input, list view for history, receipt/confirmation view.

9. If report is needed: aggregate in service layer, export as PDF + Excel.

10. Verify:
    - Transaction is atomic (test by simulating a mid-transaction failure)
    - Org scoping is correct
    - Receipt numbers are unique per org
    - Negative balances are prevented

11. Output walkthrough of all changes made.
