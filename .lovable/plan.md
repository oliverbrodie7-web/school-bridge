
## Problem

When a child sees "3 tens and 4 ones — so the answer is ___", they may not know how to convert tens/ones into a numeral. There's no scaffolding to bridge that gap.

## Solution

Add a "Need a hint?" button during the `answer-input` phase of each question in `Plus10StrategyYouDo.tsx`. When tapped, it shows a step-by-step counting sequence that counts the tens by 10s (e.g. "10… 20… 30") then adds the ones ("30 + 4 = 34").

### How it works

1. Below the "So the answer is ___" line and above the Check button, add a muted "Need a hint?" button.
2. When tapped, it reveals a guided counting section:
   - "Let's count the tens: 10… 20… 30" (animated, one at a time with a short delay, each number appearing sequentially)
   - Then: "That's 30! Now add the 4 ones: 30 + 4 = 34"
3. The hint stays visible — the child can then type the answer.
4. The hint button disappears once the hint is shown (no toggling).

### Technical changes

**File: `src/pages/Plus10StrategyYouDo.tsx`**

- Add `showHint` boolean state and `hintStep` number state to the `Question` component.
- Add a "Need a hint?" button in the `answer-input` phase that sets `showHint = true` and starts a timed sequence incrementing `hintStep` from 1 to `resultTens`, then shows the final "That's X! Now add the Y ones" message.
- The counting sequence displays as: `10, 20, 30…` appearing one by one (using `setInterval` or chained `setTimeout`), with each number styled in the BLUE color to connect visually to the tens blocks.
- No changes to any other file or phase.
