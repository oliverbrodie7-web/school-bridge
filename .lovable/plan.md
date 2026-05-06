
## Create Student Hub and fix navigation flow

### What changes

1. **New Student Hub at `/student`** — Replace the current practise page with a hub listing topics. Shows "Split Strategy" as a clickable card linking to `/split-strategy`.

2. **Move Practise to `/practise/split-strategy`** — Current Student.tsx practise content moves to a new `SplitStrategyPractise.tsx` file at a dedicated route.

3. **Update all internal links:**
   - Split Strategy Landing "Practise" button → `/practise/split-strategy`
   - Phase 3 "I'm ready to try on my own" → `/practise/split-strategy`
   - Phase 1 back link → `/split-strategy`
   - Split Strategy Landing gets a back link → `/student`

### Files

| File | Action |
|------|--------|
| `src/pages/SplitStrategyPractise.tsx` | Create — move current Student.tsx practise content here |
| `src/pages/Student.tsx` | Rewrite — becomes a hub page with topic cards |
| `src/App.tsx` | Add `/practise/split-strategy` route |
| `src/pages/SplitStrategyLanding.tsx` | Update Practise link, add back link to `/student` |
| `src/pages/SplitStrategyYouDo.tsx` | Update "ready" link to `/practise/split-strategy` |
| `src/pages/SplitStrategyLearn.tsx` | Update back link to `/split-strategy` |
