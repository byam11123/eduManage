# Complete Partial Module Workflow
description: Finishes a partially implemented module (Staff & HR, Attendance, Communication/Wallet). Invoke with /complete-partial-module

## Steps

1. Ask the user: Which partial module are we completing? (Staff HR / Attendance / Communication)

2. Read all existing files for the module: service, actions, pages, Prisma models. Map what exists vs what is missing.

3. For **Staff & HR** — complete:
   - Payroll config logic in service layer
   - Staff attendance tracking (link to Attendance module)
   - Staff profile update flow

4. For **Attendance** — complete:
   - Daily student attendance marking UI
   - Attendance status reports (present/absent/late counts)
   - Export attendance report (PDF/Excel)

5. For **Communication/Wallet** — complete:
   - Wallet deduction logic when sending SMS/Email (use `new-financial-feature` skill)
   - WhatsApp API integration hook (abstract behind a provider interface)
   - Notification history log

6. For each missing piece: apply relevant skill (new-module, new-financial-feature, prisma-migration) as needed.

7. Update `GEMINI.md` module status from 🟡 Partial to 🟢 Ready when complete.

8. Output: what was missing, what was added, what still remains if not fully done.
