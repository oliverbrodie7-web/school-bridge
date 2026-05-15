## Goal

Rebuild `src/pages/HalvesQuartersEighthsLanding.tsx` to mirror `SplitStrategyLanding.tsx` (gold standard) with HQE-specific values.

## Scope

- **One file only:** `src/pages/HalvesQuartersEighthsLanding.tsx`
- No changes to Split, +10, Learn, Practise, Parent Guides, or shared components.

## Implementation

Replace the entire file with a Split-shaped layout, using `.hqe-*` class prefix. Concrete values:

1. **Imports:** `useEffect`, `useState`, `Link`, `getLearnComplete` + `migrateLocalProgressIfNeeded` from `@/lib/progress`, `CurriculumBadge` from `@/components/CurriculumBadge`. Drop `FractionFood` import (pizza/chocolate removed from this screen only).
2. **Local badge constant** `AC9M2N03_PROPS` with the supplied code/title/description/year/strand.
3. **Effect:** `await migrateLocalProgressIfNeeded(); setLearnComplete(await getLearnComplete("halvesQuartersEighths"))`.
4. **Style block:** identical to Split, classes renamed `.ssl-*` → `.hqe-*`, including `morphA`, `morphB`, `learnPulse`, blob-wrap, learn-btn(+done), learn-sub(+done), practise-btn, grid/left/right responsive (≥600px → 40/60), pg-pill, pg-arrow, badge-warm overrides.
5. **Blob colours:** `.hqe-blob-1` `#FFE0B2`; `.hqe-blob-2` `#E8C45B` (opacity 0.75).
6. **Outer chrome:** bg `#FFF8EC`, max-width 780, padding `24px 40px`.
7. **Header row:** ← Back → `/student/number`, 13px/600/#999999. Badge wrapped in `<span className="hqe-badge-warm">`.
8. **Heading:** `Halves, Quarters & Eighths` (28px/800/#1A1A1A, -0.02em).
9. **Description:** `Learn how to split shapes and numbers into equal parts.` (15px/500/#666666, max-width 320, centred).
10. **Buttons (stacked, max-width 320, gap 10):**
    - Learn → `/learn/halves-quarters-eighths`, sub `New to this? Start here` / `Already completed`, pulse when not complete, dimmed style when complete.
    - Practise → `/practise/halves-quarters-eighths`.
11. **Returning nudge:** shown only when `learnComplete`, exact Split styling, copy: `Welcome back — looks like you've already done the lesson. Ready to practise on your own?`.
12. **Parent Guide pill:** centred, → `/parent?strategy=halvesQuartersEighths`, label `Parent Guide` + `→`.
13. **Comment** above blobs: `Placeholder — replace with character illustration when ready.`

## Notes

- HQE Learn/Practise/Parent Guide pages keep their pizza + chocolate visuals — the [Halves/Quarters/Eighths visuals memory](mem://features/halves-quarters-eighths-visuals) still applies to those screens. This change removes them from the entry point only, per the brief.
- HQE entry point switches from localStorage to Supabase via the shared `getLearnComplete` helper to match Split/+10.

## Verification

- Open `/halves-quarters-eighths` and `/split-strategy` side by side: identical layout, spacing, typography, button styling, animations; only blob colours, heading, description, badge code, and route targets differ.
- Confirm no other files modified.
