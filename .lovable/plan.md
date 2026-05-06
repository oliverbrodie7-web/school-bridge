
## Add step labels and increase animation delays in Phase 1 (I Do)

### Changes to `src/pages/SplitStrategyLearn.tsx`:

1. **Add "Step 1: Split the numbers" line** — appears after both numbers are split (when phase enters `splitB`), showing e.g. "Step 1: Split each number into tens and ones"

2. **Add step labels to existing lines:**
   - "Step 2: Now add the tens: 30 + 10 = 40" (blue)
   - "Step 3: Now add the ones: 4 + 2 = 6" (orange)
   - "Step 4: Put them together: 40 + 6 = 46" (teal)

3. **Increase delays between each step** — currently 2000–2500ms. Increase to:
   - `splitB` → `addTens`: 3000ms
   - `addTens` → `addOnes`: 3500ms
   - `addOnes` → `combine`: 3500ms
   - `combine` → `done`: 3000ms
