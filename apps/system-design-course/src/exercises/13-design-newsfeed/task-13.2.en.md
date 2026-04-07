# Task 13.2: Fan-out Calculator

## Goal

Implement an interactive calculator that visually demonstrates the difference between fan-out on write (push) and fan-out on read (pull). Visualize the crossover point — when push becomes more expensive than pull.

## Requirements

1. **Input parameters** (sliders):
   - Average followers — average number of followers (100 — 1,000,000)
   - Post rate — posts per second across the system (1,000 — 100,000)
   - Celebrity threshold — "celebrity" threshold (1,000 — 100,000)
2. **Push calculation (fan-out on write)**:
   - Write ops/sec = post_rate × avg_followers
   - Read ops/sec = feed_reads_per_sec (constant, e.g. 50,000)
   - Storage amplification = avg_followers × (postId size)
3. **Pull calculation (fan-out on read)**:
   - Write ops/sec = post_rate (one write per post)
   - Read ops/sec = feed_reads_per_sec × avg_following (300 follows on average)
   - Storage = 1× (no duplication)
4. **Crossover point** — at what follower count does push cost exceed pull cost
5. **Visualization** — comparison table, color coding (green = better, red = worse)
6. **Hybrid calculation** — how many operations hybrid saves at the given celebrity threshold

## Checklist

- [ ] Three sliders control input parameters
- [ ] Comparison table Push vs Pull with numeric values
- [ ] Crossover point calculated and displayed
- [ ] Hybrid approach shows savings compared to pure Push
- [ ] Color coding: which approach wins per metric
- [ ] Values update in real time when sliders change

## How to check yourself

1. Set avg_followers = 500 — Push should be more efficient (write is cheap, read is instant)
2. Set avg_followers = 1,000,000 — Pull should be more efficient (push creates a million writes)
3. Crossover point should be around 10,000 — 50,000 followers
4. Hybrid should show savings compared to pure Push
5. Compare your calculator with the reference solution (Solution)
