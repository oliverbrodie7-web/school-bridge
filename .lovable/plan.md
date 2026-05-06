
## Animated split blocks for Steps 2 and 3

**The idea:** When Step 2 triggers, the blue "tens" boxes (30 and 10) physically slide down from their Step 1 positions to form a row below, with a "+" and "=" appearing between/after them to reveal the equation `30 + 10 = 40`. Then for Step 3, the orange "ones" boxes (4 and 2) do the same thing, sliding down to form `4 + 2 = 6`.

This means the Step 1 area would show the blocks emptying out (or fading) as they move into the step rows below, making the connection between splitting and adding much more visual and concrete.

### How it would work

```text
BEFORE (Step 1 complete):
  ┌────┐ ┌────┐   ┌────┐ ┌────┐
  │ 30 │ │  4 │   │ 10 │ │  2 │
  └────┘ └────┘   └────┘ └────┘
   tens   ones     tens   ones

STEP 2 triggers — tens blocks slide down:
  ┌────┐ ┌────┐   ┌────┐ ┌────┐
  │    │ │  4 │   │    │ │  2 │  ← tens spots empty/ghost
  └────┘ └────┘   └────┘ └────┘

  Step 2: ┌────┐ + ┌────┐ = 40
          │ 30 │   │ 10 │
          └────┘   └────┘

STEP 3 triggers — ones blocks slide down:
  Step 2: ┌────┐ + ┌────┐ = 40
          │ 30 │   │ 10 │
          └────┘   └────┘

  Step 3: ┌────┐ + ┌────┐ = 6
          │  4 │   │  2 │
          └────┘   └────┘
```

### Technical approach

- Use CSS transitions (transform + absolute positioning) or framer-motion to animate boxes from their Step 1 grid positions into new rows below.
- When a box "moves," the original position shows a ghost/placeholder (faded outline) so the layout doesn't collapse.
- The "+" sign and "= result" fade in alongside the moved blocks.
- Step 4 remains as text below: "Put them together: 40 + 6 = 46".

### Scope

- Changes to `SplitStrategyLearn.tsx` only (the `/learn/split-strategy` student lesson).
- No changes to Parent Guide, Practise, or any other pages until this is validated.

### Considerations

- The animation needs to work on mobile (762px viewport). The blocks are currently ~64-80px wide, so two blocks + a "+" + "=" will fit comfortably.
- Timing stays the same (3-3.5s between phases) to keep the pacing the student is used to.
- If the visual works well here, it could later be mirrored into the Parent Guide demo.
