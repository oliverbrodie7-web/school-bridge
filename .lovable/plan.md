## Fix: Step-specific error hints for split inputs

**Problem**: When a child enters the wrong value in the "ones" box, the hint still says "how many tens are hiding in X?" — it should give a ones-specific hint instead.

**Affected files**: `src/pages/SplitStrategyYouDo.tsx` and `src/pages/SplitStrategyWeDo.tsx`

### Changes

**SplitStrategyYouDo.tsx** — `checkBlue` and `checkOrange` functions:
- Check tens and ones separately instead of as one combined check
- If tens is wrong: "Almost — how many tens are hiding in [number]?"
- If tens is correct but ones is wrong: "Check the ones — how many ones are in [number]?"

**SplitStrategyWeDo.tsx** — `handleCheck` function:
- Same approach: check `tensInput` and `onesInput` individually
- If tens wrong: "Almost — how many tens are hiding in [number]?"
- If ones wrong: "Check the ones — how many ones are in [number]?"
- Store the hint in state so the wrong-answer message is specific

No other files or phases are touched.
