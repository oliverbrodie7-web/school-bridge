## Problem

The Parent Guide for *Halves, Quarters & Eighths* was built and is fully working — it lives at `/parent?strategy=halvesQuartersEighths`. But the **HalvesQuartersEighthsLanding** page (`/halves-quarters-eighths`) is missing the "Parent Guide" button that the Split and +10 landing pages have. With no link in the UI, there's no way to reach it. Visiting `/parent` directly (no query param) shows the generic "We're building the Parent Guide content now" placeholder, which is what you're seeing.

## Fix

Add a Parent Guide link to `src/pages/HalvesQuartersEighthsLanding.tsx`, matching the exact pattern used in `Plus10StrategyLanding.tsx` and `SplitStrategyLanding.tsx`:

```tsx
<Link
  to="/parent?strategy=halvesQuartersEighths"
  className="inline-block rounded-xl bg-muted px-8 py-4 text-lg font-semibold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
>
  Parent Guide
</Link>
```

Placed in the same position as on the other two landing pages (below the Learn/Practise block).

## Out of scope

- No changes to `Parent.tsx` (HQE guide content is already complete)
- No changes to routing
- No changes to other landing pages
