## Problem

The current "pizza" reads as a pie chart: flat pale-yellow disc, thin orange ring, plain red wedge, two near-invisible dots. Nothing food-like.

## Goal

Make the pizza unmistakably a pizza at any size (60px preview through 240px Learn), without adding an image asset — keep it as inline SVG so it animates and tints cleanly.

## Visual upgrades to the `Pizza` component (`src/components/FractionFood.tsx`)

1. **Thick bready crust**, not a thin stroke
   - Outer ring fill `#D97706` (golden-brown), 7-9% of radius wide
   - Subtle darker rim shadow on the outer edge (`#B45309`, low opacity)
   - Tiny lighter speckles on the crust ring (baked-bubble dots) for texture

2. **Cheese + sauce base** instead of flat yellow
   - Sauce layer (full inner disc): warm tomato `#F87171` at low opacity so unshaded slices look like cheese over sauce
   - Cheese layer on top: `#FDE68A` with 2-3 irregular melted-cheese "blobs" cut out so sauce peeks through (low-opacity organic shapes)
   - This gives the pale slices a real pizza look even before any slice is taken

3. **Shaded ("taken") slice** = clearly a topped slice
   - Keep the tomato-red fill `#EF4444 @ 85%` as the sauce showing through
   - Add a cheese-yellow blob layer on top inside the slice (so it reads as cheesy, not just red)
   - **Pepperoni**: 4-5 dots per slice (not 3), `#DC2626` core + thin `#7F1D1D` rim, radius 4-5px at 240px size, scaled down for small previews. Place them on a jittered grid clipped to the slice so they sit inside the slice boundary, not on the crust.
   - Optional 2-3 tiny basil-green specks `#16A34A` for visual interest

4. **Cut lines** read as knife cuts, not pie-chart spokes
   - Color `#78350F` (dark crust) instead of `#D97706` so they contrast against both cheese and sauce
   - Slightly thicker (2.5px) with rounded caps
   - Stop ~4px short of the crust ring so they look like cuts into the cheese, not lines drawn over the crust

5. **Size-aware detail**
   - Component already takes `size`. Scale stroke widths, pepperoni radius, and number of toppings by size so the 60px landing preview stays clean (1-2 peps per slice) and the 240px Learn version looks rich (4-5 peps per slice).

6. **Deterministic topping layout**
   - Seed pepperoni positions by slice index so they don't reshuffle between renders / animation phases.

## What does NOT change

- Public API: `<Pizza size slices shaded cutsDrawn filled />` stays identical
- Animation timing (cut-line draw, fill-opacity transition)
- Color tokens defined for the Halves/Quarters/Eighths section
- Anything outside `FractionFood.tsx` — Learn I Do, Landing, Practise, etc. just re-render with the upgraded look
- Chocolate bar component

## Files touched

- `src/components/FractionFood.tsx` — only the `Pizza` component internals

## Out of scope

- No new image assets
- No changes to chocolate bar
- No changes to language, prompts, or callouts
