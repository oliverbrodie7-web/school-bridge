## Change

Make the pencil icon a toggle and remove the Cancel button. The Save button stays.

## Edits — `src/pages/Index.tsx` only

1. **Pencil button (lines 262–273):** show it in both states (not just when not editing). When `editingIndex === i`, clicking it calls `handleCancelEdit()` instead of `handleStartEdit`. Style stays the same; optionally swap the icon to an "X" while editing for visual feedback (open question below — default: keep the same pencil icon, no visual change).

2. **Cancel button (lines 228–235):** remove entirely.

3. **Save button wrapper (lines 219, 236):** the surrounding `<div className="flex flex-col gap-1 w-full">` becomes a single-button container — keep it so the Save button still spans full width.

4. **Escape key (line 205):** keeps working — `handleCancelEdit()` still exists and is called on Esc.

## Out of scope

No changes to colours, layout, other files, or edit/save logic.

## One question for you

When the card is in edit mode, should the pencil icon visually change (e.g. swap to an "×" close icon) so it's obvious clicking it cancels? Or leave it as the pencil for visual stability?
