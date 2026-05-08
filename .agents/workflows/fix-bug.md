# Fix Bug Workflow
description: Traces and fixes any bug in EduManage — RBAC, data scoping, financial logic, or UI. Invoke with /fix-bug

## Steps

1. Ask the user: What is the symptom? Which role/user is affected? What page or action is broken?

2. Classify the bug:
   - Access/permission issue → apply `debug-rbac` skill
   - Wrong or missing data → apply `fix-service-layer` skill
   - Financial operation error → apply `new-financial-feature` skill for context, then fix
   - UI rendering issue → check component conditionals and loading/error states

3. Read the relevant files top-down: middleware → Server Action → service → component.

4. Identify the root cause. State it clearly before writing any fix.

5. Apply the minimum safe fix. Do not refactor surrounding code unless it is part of the bug.

6. Verify:
   - The fix resolves the reported symptom
   - Super Admin access is not broken
   - No other role is inadvertently affected
   - Multi-tenant scoping is still intact

7. Output: root cause summary + files changed + what was wrong and why.
