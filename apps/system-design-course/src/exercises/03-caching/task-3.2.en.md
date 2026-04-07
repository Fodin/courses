# Task 3.2: Cache Simulator (LRU / LFU / FIFO)

## Objective

Build an interactive cache simulator of fixed size that clearly demonstrates how different eviction strategies decide which element to evict when the cache is full.

## Requirements

1. Create a fixed-size cache (4 elements by default)
2. Implement key input (text field + "Request" button), as well as preset buttons for quick requests (A, B, C, D, E, F)
3. Implement three eviction strategies with switching:
   - **LRU** — evicts the element that hasn't been accessed for the longest time
   - **LFU** — evicts the element with the fewest accesses
   - **FIFO** — evicts the element that was added first
4. Visualize the current cache contents:
   - Element key
   - Access frequency (for LFU)
   - Last access time (for LRU)
   - Addition order (for FIFO)
5. Display counters: hits, misses, hit ratio (%)
6. Maintain a log of recent operations: "HIT: key A" or "MISS: key E → evicted key B"
7. "Reset" button to start a new experiment

## Checklist

- [ ] Fixed-size cache (4 slots) is displayed visually
- [ ] Key input and preset buttons work
- [ ] 3 strategies implemented (LRU, LFU, FIFO)
- [ ] When the cache overflows, the correct element is evicted according to the current strategy
- [ ] Hit/miss/ratio are displayed
- [ ] Operation log shows request history
- [ ] Behavior differences between strategies are visible
- [ ] Switching strategy resets the cache

## How to Check Yourself

1. Select LRU, request A, B, C, D, E — A should be evicted (oldest)
2. Select LFU, request A, A, A, B, C, D, E — one of B/C/D should be evicted (frequency 1), but not A (frequency 3)
3. Select FIFO, request A, B, C, D. Access A again. Request E — A should be evicted (first added), despite the recent access
4. Compare hit ratio with the sequence A, B, C, D, A, B, E, A, B, C for different strategies
