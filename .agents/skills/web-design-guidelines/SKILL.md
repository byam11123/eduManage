---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Fetch the latest guidelines from the source URL below
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the fetched guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

Fetch fresh guidelines before each review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use WebFetch to retrieve the latest rules. The fetched content contains all the rules and output format instructions.

## Usage

When a user provides a file or pattern argument:
1. Fetch guidelines from the source URL above
2. Read the specified files
3. Apply all rules from the fetched guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.

---

## EduManage Design System

When reviewing EduManage UI files, apply these project-specific design tokens and conventions in addition to the fetched guidelines:

### Color Palette
| Token | Usage |
|---|---|
| `indigo-600` / `#4F46E5` | Primary actions, CTAs, receipt numbers, receipt header |
| `emerald-600` / `#059669` | Success states, "paid" badges, positive trends |
| `rose-500` / `#F43F5E` | Errors, overdue, destructive actions |
| `amber-500` / `#F59E0B` | Warnings, "pending" badges |
| `gray-900` (dark) | Primary text |
| `gray-400` | Labels, secondary text |

### Typography Conventions
- **Labels / Section Headers:** `text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400`
- **Primary Values:** `font-bold` or `font-black text-gray-900 dark:text-white`
- **Receipt/ID numbers:** `font-mono tracking-wider text-indigo-600`
- **Badge text:** `text-[9px] font-black uppercase tracking-widest`

### Spacing & Shape
- **Card border radius:** `rounded-[2.5rem]` or `rounded-[3rem]` — NOT `rounded-xl` for main cards
- **Dialog border radius:** `rounded-[2.5rem]` with `p-0 overflow-hidden`
- **Buttons:** `rounded-xl` or `rounded-2xl` — `font-black uppercase tracking-[0.2em]`
- **Table cells:** `px-8 py-5` padding

### Component Patterns
- **Loading:** Always skeleton (`<Skeleton>`) — never a raw spinner
- **Empty state:** Always a styled container with icon + message + CTA — never a blank white box
- **Dialogs:** Always use shadcn `<Dialog>` with the premium header band pattern (colored band, white icon, receipt info)
- **Icons:** Lucide Icons ONLY — no heroicons, no custom SVGs

### Accessibility
- All interactive elements must have `title` or `aria-label` (especially icon-only buttons)
- Focus ring must be visible: test with Tab key
- All form fields must have `<Label>` associated via `htmlFor`
- Color is never the only indicator of state (always pair with text/icon)

