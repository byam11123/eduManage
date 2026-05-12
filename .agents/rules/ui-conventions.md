# UI Conventions
activation: always

## Design System
- Glassmorphic dark-mode-ready interface — match existing dashboard aesthetic
- Tailwind CSS 4 only — no inline styles, no CSS modules
- shadcn/ui primitives first — never rebuild what already exists
- Lucide Icons only — no other icon library
- Framer Motion for all animations

## Data Display
- TanStack Table for ALL data grids — no custom table implementations
- Recharts for ALL charts — no other charting library
- Always implement: loading skeleton + error state + empty state
- Never leave a blank container — every state must be handled

## Forms
- React Hook Form for all forms
- Zod resolver wired to every form
- Show inline field errors — never alert() or toast-only errors
- Multi-step forms follow the admission form pattern in `/admin/admissions`

## Skeletons
- Use shadcn Skeleton component
- Match the shape of the actual content — not generic gray blocks

## File/Image Uploads
- Use Sharp for image processing
- Always show upload progress
## Nomenclature & Text
- **NEVER** modernize or "professionalize" text labels, headers, or buttons.
- Keep text simple, direct, and exactly as provided in the original project files.
- Focus ONLY on UI/UX enhancements (styling, layout, glassmorphism) without changing terminology.
- Revert any "modernized" jargon (e.g., 'Academic Pedigree', 'Compensation Matrix') back to standard project labels (e.g., 'Education Details', 'Salary Details').
