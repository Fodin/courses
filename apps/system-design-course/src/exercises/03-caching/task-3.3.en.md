# Task 3.3: Cache Strategy Calculator

## Objective

Create an interactive calculator that, based on load parameters, recommends an optimal caching pattern with detailed explanation.

## Requirements

1. Implement parameter input via sliders:
   - **Read/Write ratio** — ratio of reads to writes (from "100% read" to "100% write")
   - **Stale tolerance** — acceptable data staleness (from "0 sec — data must always be fresh" to "1 hour — can tolerate")
   - **Traffic volume** — traffic intensity (from "low" to "very high")
2. Based on the parameter combination, provide a recommendation:
   - Recommended pattern (Cache-Aside, Read-Through, Write-Through, Write-Behind, or a combination)
   - Recommended TTL
   - Whether stampede protection is needed
   - Whether cache warming is needed
3. For each recommendation, show an explanation: **why** this pattern fits the given parameters
4. Show a confidence indicator for the recommendation (not all combinations are unambiguous)

## Checklist

- [ ] Three sliders with visual labels work
- [ ] Recommendation updates instantly when parameters change
- [ ] Recommendation includes: pattern, TTL, stampede protection, warming
- [ ] There is a detailed explanation of why the pattern fits
- [ ] Extreme values give logical results (100% read → Cache-Aside, 0 stale tolerance → Write-Through)
- [ ] High traffic + 0 tolerance → recommendation includes stampede protection

## How to Check Yourself

1. Read-heavy load (90% read), high stale tolerance → Cache-Aside with large TTL
2. Write-heavy load (80% write), 0 stale tolerance → Write-Through
3. Write-heavy load (80% write), high stale tolerance → Write-Behind
4. High traffic, any parameters → recommendation should include stampede protection
5. Any load, low stale tolerance → short TTL
