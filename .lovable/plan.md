## Goal
Replace the two free-text inputs in `/learn/halves-quarters-eighths/we-do` with age-appropriate multiple-choice tap buttons. Year 2 children shouldn't be typing words like "one eighth".

## Scope
Only `src/pages/HalvesQuartersEighthsWeDo.tsx` — no other pages, no shared components.

## Changes

**Question card (after child taps to split shape):**

Replace the two `<input>` fields with two stacked multiple-choice rows:

1. **"There are ___ equal parts"** — 3 number chip buttons
2. **"Each part is called ___"** — 3 fraction-name chip buttons

The child taps one chip in each row, then taps **Check**.

**Per-question options** (correct answer mixed with two distractors drawn from the other questions, shuffled per question but stable per render):

| Q | Parts options | Name options |
|---|---|---|
| Halves   | 2, 4, 8 | one half (1/2), one quarter (1/4), one eighth (1/8) |
| Quarters | 2, 4, 8 | same three |
| Eighths  | 2, 4, 8 | same three |

**Chip styling** (matches existing teal palette):
- Unselected: white bg, 1px `#D4D4D4` border, `#0F6E56` text, radius 12px, padding 10px 18px
- Selected: `#E1F5EE` bg, 2px `#1D9E75` border, `#0F6E56` text, slight scale
- Hover: subtle bg tint
- Touch-friendly min height 44px

**State changes:**
- Replace `partsInput: string` and `nameInput: string` with `partsChoice: number | null` and `nameChoice: string | null` (storing the canonical part name)
- `handleCheck`: `partsChoice === spec.totalParts && nameChoice === spec.partName` → correct
- Check button disabled until both selected
- Existing `wrongHint` and "Try again" flow unchanged
- Success card (chips showing answer) unchanged

**Pedagogy guardrails preserved:**
- Computer-first → child-second sequence intact
- No scoring/timers/badges
- "Almost" tone retained — no "wrong"
- Concrete (tap to split) → Pictorial (filled shape) → Abstract (chip selection) progression preserved; abstract is now selection rather than typing, which is age-appropriate for Year 2

## Out of scope
- I Do, You Do, Practise, Parent guide
- Any other strategy
- Shared components
