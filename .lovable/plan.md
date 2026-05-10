# Rebuild L2 Match — drag-and-drop, one shape at a time

Replace the current tap-tap matching UI in `L2MatchCard` (Halves, Quarters & Eighths Practise, Level 2, Q4–6) with a drag-and-drop interaction. No other questions, levels, or pages change.

## What changes for the child

1. The card shows **one active shape** at a time (top of the card), with the remaining two shapes queued below in a faded "up next" strip.
2. Three fraction labels — `1/2`, `1/4`, `1/8` — sit as **draggable chips** in a row beneath the active shape.
3. The child drags the correct chip onto the shape's drop target.
   - **Correct drop** → chip locks into the shape with a teal tick, the shape slides up into a "done" stack at the top, and the next shape slides in. The chip used is removed from the chip row.
   - **Wrong drop** → the shape gives a gentle horizontal shake (existing `matchShake` keyframe), the chip springs back to the row, and a soft single-line hint appears under the chips: *"Count the equal parts on the shape — that's the bottom number."* Hint fades out after the next attempt or 3 seconds.
4. After all three shapes are matched, the card shows the existing **"Perfect matching!"** message and **Next Question** button.

## Visual layout

```text
┌──────────────────────────────────────────┐
│           Match each shape to its        │
│                  fraction.               │
│                                          │
│   ┌────────────────────────────────┐     │
│   │      [ active shape ]          │     │  ← drop zone
│   │   drop a fraction here         │     │
│   └────────────────────────────────┘     │
│                                          │
│      [ 1/2 ]   [ 1/4 ]   [ 1/8 ]         │  ← draggable chips
│                                          │
│      "Count the equal parts…"            │  ← soft hint (only after wrong)
│                                          │
│   Up next:  [shape] [shape]  (faded)     │
└──────────────────────────────────────────┘
```

Done shapes stack as small thumbnails above the active shape with their matched fraction beside each.

## Interaction details

- **Pointer + touch support** via React's native HTML5 drag events for desktop and `pointerdown/move/up` fallback for touch (HTML5 DnD is unreliable on iOS Safari). A small custom hook handles both.
- **Drop target highlight**: when a chip is being dragged over the active shape, the shape's wrapper border turns teal (`--colour-active-border`) and background light-teal (`--colour-active-light`).
- **Chip styling while dragging**: the dragged chip follows the pointer with a subtle scale (1.05) and shadow.
- **Wrong-drop shake**: reuse the existing `@keyframes matchShake` already defined in `L2MatchCard`.
- **Hint copy**: one line, neutral tone — *"Count the equal parts on the shape — that's the bottom number."* Auto-dismisses on next interaction.
- **Streak preservation**: the whole match question still counts as one question for `consecutiveCorrect` / `consecutiveWrong` and the L3-unlock streak. `hadWrong` becomes true if **any** drop was wrong during the question (matches existing behaviour).

## Files touched

- `src/pages/HalvesQuartersEighthsPractise.tsx` — replace the body of `L2MatchCard` only. No changes to types, generators, main page, level selector, ProgressIndicator, hint button wiring, or Supabase logic.

## What does NOT change

- L1 Shade card.
- L2 Identify (Q1–3) and L2 Fill (Q7–10).
- L3 Worded problems.
- ProgressIndicator, CurriculumBadge, PractiseHintButton, ParentSignpost.
- Question generator (`generateL2Match`), the L2MatchQ data shape, the 3-pair set of `1/2 / 1/4 / 1/8`.
- The L3-unlock streak, banners, and Supabase writes.
- The "Perfect matching!" success message and the Next Question button styling.

## Risks & mitigations

- **Touch DnD on iOS**: covered by the pointer-event fallback. Will smoke-test on the 762×638 viewport and document any caveats in code comments.
- **Tiny screens**: chips wrap to two rows if needed; active-shape drop zone keeps a 44px minimum tap target around it (the shape is the target, not just the centre).
