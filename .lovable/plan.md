## Problem

Level 2 currently uses the same visual block animation as Level 1. The pedagogical intent is for Level 2 to remove the visual scaffolding so students apply what they learned independently — just the equation and text input fields, no Dienes blocks or tap animations.

## Changes

**File: `src/pages/Plus10StrategyPractise.tsx`**

1. **Add a new `Level2Card` component** — text-only, no blocks:
   - Shows the equation (e.g. "37 + 20") prominently
   - Two input fields: "___ tens and ___ ones" + "So the answer is ___"
   - No Dienes blocks, no tap interaction, no animation
   - Feedback on wrong answers uses the same hint system (wrong tens / wrong ones / wrong total)
   - Correct answer shows: "Only the tens changed — the ones stayed the same."

2. **Add a new `Level3Card` component** — same text-only format but for bigger tens:
   - Adds a "___ hundred" field when result exceeds 100
   - Correct message: "You're thinking in tens like a mathematician."

3. **Update the main page** to render `Level2Card` for level 2 and `Level3Card` for level 3, keeping the existing `QuestionCard` (with blocks) only for Level 1.

Level 1 stays exactly as-is with the full block animation experience.
