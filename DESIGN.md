---
version: 2.0
name: EduManage Design System
description: >
  EduManage is a premium, dark-mode-first SaaS dashboard for educational institutions.
  The aesthetic is modern glassmorphic — deep neutral dark surfaces with vibrant indigo
  as the brand anchor, layered frosted-glass cards, soft ambient glows, and crisp
  Geist typography. The interface feels authoritative and data-dense, built to be
  operated all day by school and coaching-center administrators.

# Web Interface Guidelines & Tailwind v4 Integration

EduManage strictly adheres to the following core UI principles:
1. **Accessibility (a11y) First:**
   - All interactive elements must have semantic HTML tags (`<button>`, `<a>`).
   - Icon-only buttons must have `aria-label`.
   - Purely decorative icons must have `aria-hidden="true"`.
   - Async feedback and toasts must be wrapped in `aria-live="polite"` containers.
   - Text truncation and loading states must use true ellipses (`…`) instead of three dots (`...`).
2. **Focus Management:**
   - Elements must have highly visible focus states using `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`.
   - Focus rings should never be completely disabled (`outline-none` or `ring-0`) without an explicit aesthetic replacement.
3. **Motion & Animation:**
   - All decorative animations (pulse, spin, hover translations) must be wrapped in `motion-safe:` utility variants to respect `prefers-reduced-motion: reduce`.
   - Avoid `transition-all`. Target specific CSS properties instead (`transition-colors`, `transition-transform`).
4. **Tailwind CSS v4 Strategy:**
   - Utility-first approach leveraging modern v4 syntax.
   - Rely heavily on CSS variables within standard utility classes rather than arbitrary values where possible.
5. **Data Density:**
   - Financial and dense numeric data must utilize `tabular-nums` for vertical alignment.

# Core Color Palette

colors:
  # Brand / Accent
  brand: "#6366f1"            # Indigo-500 — primary CTA, sidebar active, highlights
  brand-deep: "#4338ca"       # Indigo-700 — pressed state, gradient stop
  brand-light: "#a5b4fc"      # Indigo-300 — text accents on dark bg
  brand-soft: "rgba(99,102,241,0.12)"   # Ghost fills, hover backgrounds

  # Semantic
  success: "#22c55e"          # Green-500
  warning: "#f59e0b"          # Amber-500
  danger: "#ef4444"           # Red-500
  info: "#38bdf8"             # Sky-400

  # Dark-mode surfaces (default mode in admin)
  bg-base: "oklch(0.145 0 0)"            # Near-black canvas
  surface-1: "oklch(0.205 0 0)"          # Card background
  surface-2: "oklch(0.269 0 0)"          # Elevated / secondary card
  sidebar-bg: "oklch(0.205 0 0)"         # Sidebar panel

  # Glassmorphism
  glass-bg: "rgba(255,255,255,0.04)"
  glass-border: "rgba(255,255,255,0.08)"
  glass-glow: "rgba(99,102,241,0.25)"

# Typography Rules
typography:
  display-xl:
    fontFamily: Geist, var(--font-geist-sans), Inter, sans-serif
    fontSize: 40px
    fontWeight: 800
    letterSpacing: -1.5px
    use: Page titles, empty-state headlines
  heading-lg:
    fontFamily: Geist, var(--font-geist-sans), Inter, sans-serif
    fontSize: 28px
    fontWeight: 700
    use: Section headings, dashboard module titles
  body-md:
    fontFamily: Geist, var(--font-geist-sans), Inter, sans-serif
    fontSize: 14px
    fontWeight: 400
    use: Default body, table cells, descriptions
  mono:
    fontFamily: Geist Mono, var(--font-geist-mono), monospace
    fontSize: 13px
    use: IDs, batch codes, receipt numbers, tabular numeric columns (`tabular-nums`)

# Core Patterns & Implementations

1. **Dashboard Overview:**
   - Real-time KPI Trends reflecting `Current 30 days vs Previous 30 days` with percentage visualizers.
   - Glassmorphic, immersive greeting widgets with soft ambient glow overlays.
2. **Kanban Pipelines (Leads & Enquiry):**
   - Immersive drag-and-drop horizontal scroll views.
   - Distinctive coloring per stage (New, Contacted, Qualified, Won).
   - Instant visual stage switching logic tied to Prisma REST API `PATCH` handlers.
3. **Data Grids & Pagination:**
   - `LeadList` and `Students` module data tables leverage cursor-based pagination for high performance on massive record sets.
   - Intelligent column filtering and toggling using shared `TableToolbar` and `useTableFeatures` context hooks.
4. **Fees Management:**
   - Real-time delinquency tracking via an `Overdue` logic flag (comparing `dueDate` against current timestamp).
   - On-the-fly legal receipt generation utilizing `jsPDF`.

---
*End of Design System specification.*
