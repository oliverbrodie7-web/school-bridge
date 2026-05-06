
## Increase animation delays in Split Strategy — I Do

The three colored lines ("Now add the tens", "Now add the ones", "Put them together") appear too quickly. 

### Change

In `src/pages/SplitStrategyLearn.tsx`, increase the timeouts in the `useEffect` (lines 71-87):

- `splitB → addTens`: 800ms → 2000ms  
- `addTens → addOnes`: 1000ms → 2500ms  
- `addOnes → combine`: 1000ms → 2500ms  
- `combine → done`: 1000ms → 2000ms  

This gives children time to read and absorb each step before the next one appears.
