# Task 11.2: Retry Strategy Builder

## Goal

Implement an exponential backoff with jitter visualizer. The component should clearly show how the delay changes between attempts and compare strategies with and without jitter.

## Requirements

1. Configurable parameters: `baseDelay` (100–5000ms), `maxDelay` (1000–60000ms), `maxRetries` (1–8), `jitter` (checkbox on/off)
2. "Success on attempt" setting — buttons #2, #3, #4, #5 (simulate different numbers of 429s before success)
3. Attempt timeline: for each attempt — colored circle with number, delay bar (width proportional to delay), delay value, status (200/429)
4. Comparison block: "Without jitter" card (total time, thundering herd warning) and "With jitter" card (total time, note on even distribution)
5. "Run Simulation" button — animates adding attempts one by one
6. After simulation — log in a dark terminal style (bg #1e293b)

## Checklist

- [ ] Formula `min(maxDelay, baseDelay × 2^attempt)` implemented correctly
- [ ] With jitter: delay multiplied by `random(0.5, 1.0)`
- [ ] Timeline shows proportionally sized bars
- [ ] Comparison cards with/without jitter update when parameters change
- [ ] "Success on attempt" buttons change the number of failed attempts
- [ ] Simulation is animated (attempts appear sequentially)
- [ ] Log in terminal style

## How to Check Yourself

1. base=1000, max=32000, retries=5 — delays: 1s, 2s, 4s, 8s, 16s, 32s(cap)
2. Toggle jitter on/off — total time changes
3. Click "Run Simulation" — attempts appear with pauses
4. "Success on attempt #3" — 2 times 429, then 200 in the simulation

## Tips

- Calculation function: `Math.min(max, base * Math.pow(2, attempt - 1))`
- For animation, use `setTimeout` with accumulated delay: each attempt is added later than the previous one
- Bar width: `Math.max(20, Math.min(200, delay / maxDelay * 200))` — so very small delays are still visible
