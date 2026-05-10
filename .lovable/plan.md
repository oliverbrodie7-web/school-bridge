## Problem

The current "chocolate bar" reads as a wooden plank or caramel slab: flat orange-brown rectangle, single thin centre line, no segment depth, no recognisable chocolate cues.

## Goal

Make the bar unmistakably a chocolate bar at every size used in this section (80×44 landing preview through ~280×120 Learn), staying as inline SVG so it animates and tints cleanly.

## Visual upgrades to `ChocolateBar` in `src/components/FractionFood.tsx`

1. **Deeper, real chocolate colour palette**
   - Base body: rich dark `#3E2412` (cocoa brown)
   - Segment top face: `#6B3A1E` → `#4A2510` vertical gradient (milk chocolate sheen)
   - Shaded ("taken/eaten") segment: darker `#2A1608` with subtle gloss — looks like the missing piece's shadowed cavity OR a darker square of chocolate (we'll use the darker-square reading; it matches "shaded = taken")
   - Drop the pale `#FDE68A` for unshaded segments — that yellow is the reason it reads as caramel/wood. Pale segments become regular milk-chocolate brown; shaded becomes dark chocolate.

2. **Moulded segment shape (the key cue)**
   Each segment becomes a raised tile with:
   - Outer dark groove (the channel between segments) — drawn as a darker inset rect
   - Bevelled inner segment with:
     - Top edge: 1.5px light highlight `#A56A3E @ 60%`
     - Left edge: 1px lighter highlight
     - Bottom edge: 1.5px dark shadow `#1A0E06 @ 70%`
     - Right edge: 1px dark shadow
   - Centre: subtle radial highlight (top-left) for gloss

3. **Embossed brand-style detail in each segment** (size-permitting)
   - A small inset square or dot pattern in the centre of each segment (like Cadbury/Lindt squares often have a logo or pip)
   - Render only when segment is wide enough (≥ 28px wide) so 8-segment bars and 80px previews stay clean

4. **Deeper grooves between segments**
   - Replace the single divider line with a 3-4px wide darker channel: rect fill `#1A0E06`
   - This is what reads as "this snaps apart here"

5. **Wrapper-style outer border**
   - Outer rect: very dark `#1A0E06`, 2px
   - Subtle inner stroke `#A56A3E @ 30%` for a foil-edge hint

6. **Snap animation refinement**
   - Break lines stay top→bottom draw, but they now reveal the deep groove (animate groove opacity 0→1 instead of just a stroke)
   - Shaded fill animation: dark chocolate fills left→right as before

7. **Size-aware detail**
   - `width >= 200`: full bevels + centre pip + rich highlights
   - `width 100–200`: bevels only, no pip
   - `width < 100` (landing preview): simplified — body + grooves + segment fills + 1px highlight, no pip, no inner gradient stops

## What does NOT change

- Public API: `<ChocolateBar width height segments shaded breaksDrawn filled />`
- Animation timing
- Pizza component
- Any consuming page (Landing, Learn I Do, Practise)
- Language, prompts, callouts

## Files touched

- `src/components/FractionFood.tsx` — only the `ChocolateBar` component internals

## Out of scope

- No image assets
- No prop changes
- No changes to pizza
