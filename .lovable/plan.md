## Make multiple-choice answer obvious on You Do screen

**Scope:** `src/pages/HalvesQuartersEighthsYouDo.tsx` only — the answer block shown after shading is complete (lines ~329–384, plus `ChipRow` and `FractionChipRow` at ~492–560). No other pages, no logic changes.

### Changes

1. **Question-style row labels** (replaces muted single-word labels)
   - "Shaded parts" → *"How many did you shade?"*
   - "Equal parts" → *"How many equal parts are there?"*
   - "Fraction" → *"Which fraction is it?"*

2. **Subtle "Tap to choose" hint** under each row label
   - Tiny 11px italic muted text, e.g. *"Tap to choose"*
   - Auto-hides on that row once a value is selected (fades out)

3. **Tile affordance — make them feel like buttons**
   - Add a 1px soft bottom shadow (`shadow-sm`) so they read as raised, not as flat chips
   - Add `active:scale-95` press animation
   - Strengthen hover: light teal tint already there, plus border colour shift to teal at 40% opacity

4. **One-time pulse on the first row** to signal "start here"
   - The "Shaded parts" row gets a gentle 2-second pulse (subtle teal ring) when the answer block first appears
   - Stops as soon as any chip in that row is tapped

5. **Sequential next-row highlight**
   - After "Shaded parts" is answered, "Equal parts" row gets a soft teal ring
   - After "Equal parts" is answered, "Fraction" row gets the ring
   - Ring fades out once that row is answered
   - Implemented by passing an `active` boolean prop into `ChipRow` / `FractionChipRow`

### Technical notes

- `ChipRow` and `FractionChipRow` get two new optional props: `active?: boolean` (drives ring) and `pulse?: boolean` (drives one-time pulse on first appearance).
- Parent computes:
  - `pulseShade = shadeInput === null` on first render of the block (use a `useRef` set on first mount)
  - `activeShade = shadeInput === null`
  - `activeParts = shadeInput !== null && partsInput === null`
  - `activeFraction = partsInput !== null && fractionInput === null`
- Hint text rendering: each row renders the *"Tap to choose"* line only when `value === null`.
- All colours use existing tokens (`TEAL`, `LABEL`, `GREY_BORDER`) — no new constants.
- No changes to question generation, answer checking, Supabase writes, or routing.

### Out of scope

- We Do, I Do, Practise, Parent Guide, entry point.
- The sentence frame `"I shaded ___ out of ___ equal parts = ___"` stays exactly as-is.