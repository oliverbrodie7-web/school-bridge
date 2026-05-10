## Goal

In Level 3 (worded problems) on `/practise/halves-quarters-eighths`, ensure the **first 8 of every 10 questions** use templates where the denominator is stated explicitly (e.g. "cut into 4 equal slices"). Save the more abstract phrasings (e.g. "shared with a friend", "folded in half… in half again") for the last 2 questions in each set of 10.

## Why

Worded problems where the child must *infer* the denominator (no number anywhere in the sentence) layer extra abstraction on top of the fraction concept. Year 2 children need the bottom number scaffolded before they can reason about it implicitly.

## Template classification

Each L3 template will be tagged `concrete: true | false`.

**Concrete (number stated in text)**
- HALVES #1 — "cut a {object} into **2 equal pieces** and ate one piece"
- QUARTERS #1 — "cut a pizza into **4 equal slices** and ate one slice"
- QUARTERS #2 — "**4 friends** shared a chocolate bar equally"
- QUARTERS #3 — "ate **2 slices** of a pizza that was cut into **4 equal slices**"
- QUARTERS #4 — "cut it into **4 equal pieces** and used 3 pieces"
- EIGHTHS #1 — "cut a sandwich into **8 equal pieces** and ate one piece"
- EIGHTHS #2 — "broken into **8 equal pieces**. Took 2 pieces"

**Abstract (denominator must be inferred)**
- HALVES #2 — "shared it equally with a friend"
- EIGHTHS #3 — "folded a piece of paper in half, then in half again, then in half again"

## Implementation

1. Add `concrete: boolean` to each entry in `HALVES_TEMPLATES`, `QUARTERS_TEMPLATES`, `EIGHTHS_TEMPLATES` per the classification above.
2. Change `generateL3(avoid)` → `generateL3(subPos, avoid)` where `subPos` is the 1-based position within the current set of 10 (already computed in `genFor` for L2).
3. Inside `generateL3`:
   - If `subPos <= 8` → only pick from templates where `concrete === true`.
   - If `subPos >= 9` → pick from the full pool (concrete + abstract), so abstract phrasings appear roughly in positions 9–10.
   - Keep the existing fraction-type weighting (≈30% eighths, otherwise halves/quarters split) but apply it *after* filtering by concreteness. If a chosen bucket has no concrete templates at the current `subPos`, fall back to another bucket rather than emitting an abstract one.
4. Update the call site in `genFor` (line 1475) to pass `subPos = ((qNum - 1) % 10) + 1`, mirroring the L2 pattern.
5. No changes to L1, L2, ProgressIndicator, hint system, streak logic, or Supabase writes.

## Out of scope

- Rewording any existing template.
- Adding new worded templates.
- Changing the L3 unlock rule (still 10 consecutive L2 correct).
