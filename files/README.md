# EduManage — Antigravity Integration

Complete setup for Skills, Rules, Workflows, and MCP servers.

## File Placement Guide

```
# Global (applies to ALL your projects)
~/.gemini/GEMINI.md                          ← copy GEMINI.md here

# Inside your EduManage project root
.agents/
  rules/
    api-conventions.md                       ← Always On
    multitenant-scoping.md                   ← Always On
    ui-conventions.md                        ← Always On
    financial-safety.md                      ← Glob (fee/installment files)
  skills/
    new-module/SKILL.md                      ← auto-activated by context
    debug-rbac/SKILL.md                      ← auto-activated by context
    prisma-migration/SKILL.md                ← auto-activated by context
    new-financial-feature/SKILL.md           ← auto-activated by context
    fix-service-layer/SKILL.md               ← auto-activated by context
  workflows/
    new-module.md                            ← invoke with /new-module
    fix-bug.md                               ← invoke with /fix-bug
    new-financial-feature.md                 ← invoke with /new-financial-feature
    complete-partial-module.md               ← invoke with /complete-partial-module

# MCP config
~/.gemini/antigravity/mcp_config.json       ← see MCP-SETUP.md
```

## Workflow Commands

| Command | Use when |
|---|---|
| `/new-module` | Building Examination, Expenses, Timetable from scratch |
| `/fix-bug` | Any RBAC, data scoping, or UI bug |
| `/new-financial-feature` | Expense tracking, wallet deductions, reports |
| `/complete-partial-module` | Finishing Staff HR, Attendance, or Communication |

## How the Agent Uses This

1. **Rules** load at conversation start — agent always knows your conventions
2. **Skills** activate automatically when the task matches their description
3. **Workflows** are invoked with `/command` and guide the agent step by step
4. **MCP** gives the agent live access to your real schema — no hallucinated column names

## Next Module to Build (Suggested Order)

1. `/new-financial-feature` — Expense tracking (bridges existing `expenses/` dir)
2. `/complete-partial-module` — Communication/Wallet (activate SMS/Email deductions)
3. `/new-module` — Examination module
4. `/new-module` — Timetable/Academic module
