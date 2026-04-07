# Task 6.2: Rate Limiter Simulator

## Objective

Build an interactive rate limiting algorithm simulator: visualize how Token Bucket, Fixed Window, and Sliding Window process a stream of requests.

## Requirements

1. Implement switching between three algorithms:
   - **Token Bucket** — tokens are replenished at a constant rate (rate), maximum = burst
   - **Fixed Window** — counter resets every N seconds
   - **Sliding Window** — counts requests in a sliding window
2. Parameter configuration via buttons:
   - **Rate** — allowed request rate (requests/sec)
   - **Burst** — maximum spike (for Token Bucket)
   - **Window** — window size in seconds (for Fixed/Sliding Window)
3. "Send Request" button — sends a single request to the rate limiter
4. Visualization:
   - Current algorithm state (tokens in bucket / counter in window)
   - Request log: accepted (green) and rejected (red)
   - Counters: total requests, accepted, rejected
5. "Burst 10" button — send 10 requests at once (burst demonstration)
6. Reset — reset state

## Checklist

- [ ] Switching between 3 algorithms (Token Bucket, Fixed Window, Sliding Window)
- [ ] Configurable parameters (rate, burst, window)
- [ ] "Send Request" button — single request
- [ ] "Burst 10" button — 10 requests at once
- [ ] Algorithm state visualization
- [ ] Accepted/rejected request log
- [ ] Counters (total, allowed, rejected)
- [ ] Reset

## How to Check Yourself

1. Token Bucket: burst requests pass, then — only at the configured rate
2. Fixed Window: at the boundary of two windows, 2x the limit can be sent
3. Sliding Window: 2x the limit at window boundaries is not possible
4. Burst 10 at rate=5, burst=5 (Token Bucket): first 5 pass, remaining 5 — 429
5. Reset clears all counters and state
