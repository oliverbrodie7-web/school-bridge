## Problem

When the edit (pencil) button is clicked, the editing profile card grows taller to fit the name input, year select, Save and Cancel buttons. Because the row container at `src/pages/Index.tsx` line 152 uses `items-stretch`, every sibling — including the "Add a child" card — stretches to match that taller height.

## Fix

Single change in `src/pages/Index.tsx`:

- Line 152: change the row's alignment from `items-stretch` to `items-start` so each card keeps its own intrinsic height.

Profile cards already declare `minHeight: 140px` (or `auto` while editing) and the "Add a child" card already declares `minHeight: 140px`, so switching to `items-start` keeps the baseline 140px footprint and lets only the editing card grow.

## Out of scope

- No changes to colours, padding, borders, fonts, the avatar, Save/Cancel styling, edit logic, or any other file.
