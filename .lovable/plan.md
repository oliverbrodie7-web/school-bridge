
## Colour = concept, not number

Change the colour system so blue always means **tens** and orange always means **ones**, across both the student lesson and parent guide.

### Changes

**1. Unsplit number buttons (Step 1, before tap)**
- Replace the solid blue/orange backgrounds with a left-to-right linear gradient: blue on the left half, orange on the right half (`linear-gradient(to right, BLUE 50%, ORANGE 50%)`).
- This applies to both numbers equally — no more "blue number" vs "orange number."
- Update the prompt text from "Now tap the orange number" to "Now tap the next number."

**2. After splitting (Step 1, post-tap)**
- Tens blocks are always BLUE, regardless of which number they came from.
- Ones blocks are always ORANGE, regardless of which number they came from.
- Ghost blocks follow the same rule.

**3. Steps 2 and 3 equation rows**
- Step 2 (tens): both blocks are BLUE.
- Step 3 (ones): both blocks are ORANGE.

### Files affected

- `src/pages/SplitStrategyLearn.tsx` — student lesson
- `src/pages/Parent.tsx` — parent guide demo animation and practice question

No other files are touched.
