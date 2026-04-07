# Task 10.2: Rate Limiting Algorithm Comparison

## Objective

Build an interactive visualization demonstrating the behavior of 4 rate limiting algorithms (Fixed Window, Sliding Window Counter, Token Bucket, Leaky Bucket) under the same request flow. Observe differences in burst traffic handling and edge cases.

## Requirements

1. **4 algorithms in parallel** — each in its own column/section:
   - Fixed Window Counter
   - Sliding Window Counter
   - Token Bucket
   - Leaky Bucket

2. **Configurable parameters**:
   - Rate limit (requests/min) — default: 10
   - Window size (seconds) — default: 60
   - Burst size (for Token Bucket) — default: 5
   - Number of requests per click — default: 5

3. **Control buttons**:
   - "Send N requests" — generates a batch of requests simultaneously
   - "Reset" — clears all counters

4. **Visualization for each algorithm**:
   - Current counter / remaining tokens
   - Status: accepted / rejected for each request (by color)
   - Totals: accepted / rejected / total

5. **Comparison table** — summary statistics: % passed, burst behavior, average response time

## Checklist

- [ ] All 4 algorithms run simultaneously on a single button press
- [ ] Parameters (rate, window, burst) are configurable
- [ ] Burst behavior differences between algorithms are visible
- [ ] Fixed Window shows the boundary burst problem
- [ ] Token Bucket correctly handles bursts up to bucket limit
- [ ] Leaky Bucket shows steady flow without burst
- [ ] Comparison table shows summary statistics
- [ ] UI updates in real time

## How to Check Yourself

1. Set rate = 10 req/min and send 15 requests
2. Check: Token Bucket with burst = 5 allows up to 15 requests (10 + 5 burst)
3. Check: Leaky Bucket allows no more than 10
4. Check: Fixed Window allows 10 in the current window
5. Send another 10 requests — all algorithms should reject most
6. Reset and repeat — results should be reproducible
7. Compare your visualization with the reference solution (Solution)
