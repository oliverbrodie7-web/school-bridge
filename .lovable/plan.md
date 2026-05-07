
## Problem

The +10 Strategy Learn page (Phase 1: I Do) shows blocks and animations but has no explanatory narration. A Year 2 child sees things appear without understanding what's happening or why.

## Plan

Update `src/pages/Plus10StrategyLearn.tsx` to add narration text at every phase of each worked example:

### Narration per phase

| Phase | Narration text |
|-------|---------------|
| `show-number` | "Here's the number **23**. It has 2 tens and 3 ones." |
| `show-plus10` | "We want to add 10. That's the same as adding 1 more ten." |
| `tap-prompt` | "Tap the green ten block to add it to our tens." |
| `animating` | "Watch — the new ten joins the other tens..." |
| `result` | "Now we have 3 tens and 3 ones. That's **33**!" |
| `insight` | Callout box (already exists — keep as-is) |

Second example uses the same structure with 45/55.

### Implementation details

- Add a narration `<p>` element above the blocks area that updates based on `phase`
- Style it prominently: larger text (~text-lg), foreground color, centered, with `animate-fade-in` on each phase change
- Use a helper function or map to return the correct narration string per phase per example
- Remove the generic "Watch how adding 10 works" subtitle (it's redundant once narration exists), or keep it only as a brief intro
- Also add a brief "Continue" / "Next" button between `show-number` and `show-plus10` phases instead of pure auto-advance, so the child can read at their own pace (tap-to-advance for the explanation steps, keeping the tap-the-block interaction for the animation step)
- Keep all existing animation and block logic unchanged

### Files changed
- `src/pages/Plus10StrategyLearn.tsx` — add narration system, change auto-advance to tap-to-advance for explanation steps
