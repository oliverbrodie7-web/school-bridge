
## Apply consistent colour system + animated block rows to We Do and You Do

The "I Do" lesson and Parent Guide now use blue=tens, orange=ones with half-and-half gradient unsplit buttons and animated block rows for Steps 2-3. The We Do and You Do pages still use the old per-number colouring with text-only step reveals. This plan brings them in line.

### SplitStrategyWeDo.tsx

1. **Add `Block` component** (same as Learn page) for consistent coloured blocks.
2. **Unsplit buttons**: Use `linear-gradient(to right, BLUE 50%, ORANGE 50%)` instead of solid blue/orange.
3. **After splitting**: Tens blocks are BLUE, ones blocks are ORANGE — for both numbers. Input boxes for the child's split also get blue border for tens, orange border for ones.
4. **Ghost blocks**: When steps 2-3 reveal, the Step 1 blocks ghost out (opacity 20%).
5. **Step rows**: Replace text-only step reveals with animated block rows matching the Learn page (Step 2 with two blue blocks + = result, Step 3 with two orange blocks + = result, Step 4 as text).
6. **Step 1 label**: Always visible above the boxes.
7. **Timing**: Slow down addTens/addOnes/combine delays to 3000-3500ms (matching Learn page) instead of 1000ms.
8. **Prompt text**: Change "Now you try with 12" prompt — no colour references.

### SplitStrategyYouDo.tsx

1. **Unsplit buttons**: Use the half-and-half gradient.
2. **After splitting (FilledBox)**: Tens = BLUE, ones = ORANGE regardless of which number.
3. **Input boxes**: Blue border/bg for tens input, orange for ones input (already partially done for orange, needs fixing for blue number too).
4. **Step 1 label**: Add "Step 1: Split each number into tens and ones" above the boxes.
5. **Correct/done reveal**: Replace text-only steps with animated block rows (using ghost blocks in Step 1).
6. **Prompt text**: "Tap the first number" instead of "Tap the blue number", "Now tap the next number" instead of "Now tap the orange number."

### Files changed
- `src/pages/SplitStrategyWeDo.tsx`
- `src/pages/SplitStrategyYouDo.tsx`

No other files touched.
