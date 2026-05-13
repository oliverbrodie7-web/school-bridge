## Fix profile-card edit state

Two issues in `src/pages/Index.tsx` only — no other files touched.

### 1. Save/Cancel button colours

Replace the shadcn `bg-primary` / generic-border buttons with brand-teal styling that matches the rest of the home screen.

- Save: background `#1D9E75`, white text, no border, radius 8px, padding `4px 12px`, font-size 12px, weight 500. Hover `#0F6E56`.
- Cancel: background transparent, border `1px solid #9FE1CB`, text `#0F6E56`, same size and radius. Hover background `#E1F5EE`.

### 2. Save/Cancel buttons bleeding outside the card

Root cause: card is fixed at `width: 120px` with `padding: 20px 12px` (96px inner width), but the two buttons sit in a horizontal flex row with `gap: 8px` and natural padding, overflowing horizontally.

Fix: stack the action row to fit the narrow card.

- Wrap Save + Cancel in a `flex flex-col gap-1 w-full` (full inner width, vertical stack).
- Each button `width: 100%`, smaller padding (`4px 8px`), font-size 11px so they sit cleanly inside the 96px content area.
- Also set the name input and year select to `width: 100%`, `box-sizing: border-box`, font-size 12px, padding `4px 6px` so they don't overflow either.
- Allow the card to grow vertically in edit mode by removing the fixed `min-height: 140px` constraint only when `editingIndex === i` (use `minHeight: editingIndex === i ? 'auto' : '140px'`). Sibling cards keep their footprint.

### Out of scope (not changed)

- Year-select border style, avatar, save/cancel logic, any other page or component.
