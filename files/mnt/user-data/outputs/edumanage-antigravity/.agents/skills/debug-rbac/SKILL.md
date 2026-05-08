---
name: debug-rbac
description: Debugs why a user cannot access a page, action, or record. Use when a role (Branch Admin, User) reports missing UI, access denied errors, or seeing wrong data (data from another branch/org).
---

# Debug RBAC Skill

## Step 1 — Identify the symptom
Determine which of these is happening:
- A) Page is not accessible / redirects
- B) Button or action is missing in UI
- C) Data is empty when it shouldn't be
- D) Data from wrong branch/org is visible (data leak)

## Step 2 — Check Middleware
For symptom A: Check `middleware.ts` or RBAC middleware.
- Is the route pattern covered?
- Is the role check correct for this route?
- Is the session being read correctly?

## Step 3 — Check Service Layer
For symptoms C and D: Trace to the service function.
- Is `organizationId` being passed from session (not client)?
- Is `branchId` being included when needed?
- Is `deletedAt: null` filter present?
- Could the query return cross-org data?

## Step 4 — Check Server Action
For symptom B: Check the Server Action.
- Is role checked before executing?
- Is the action guarded by role at the action level?

## Step 5 — Check UI Render Condition
For symptom B: Check the component.
- Is the button/action conditionally rendered by role?
- Is the role being read from session correctly in the component?
- Is it a hydration mismatch (server role vs client role)?

## Step 6 — Fix and Verify
- Fix at the correct layer (middleware / service / action / component)
- Verify the fix works for the affected role
- Verify it doesn't break Super Admin access
- Check no other role is inadvertently affected

## Common Root Causes
- `branchId` missing from query when Branch Admin is scoped
- Role check done in component only, not in Server Action (security gap)
- `organizationId` taken from request body instead of server session
- Middleware pattern doesn't match new route path
