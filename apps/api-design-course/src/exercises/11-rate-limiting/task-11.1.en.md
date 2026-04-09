# Task 11.1: Token Bucket Simulator

## Goal

Implement an interactive Token Bucket algorithm simulator that visually demonstrates how rate limiting works: bucket filling with tokens, consumption on requests, and response HTTP headers.

## Requirements

1. Display a bucket with a visual token level indicator (fill height proportional to the number of tokens)
2. Bucket color changes based on fill level: green (>50%), yellow (20-50%), red (<20%)
3. "Send Request" button — active when tokens are available, disabled when bucket is empty
4. Tokens automatically refill at the given rate (use `setInterval`)
5. Configurable parameters via sliders: `capacity` (3–20) and `refillRate` (1–5 tokens/sec)
6. On a successful request, show headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
7. On 429, additionally show the `Retry-After` header
8. Maintain a log of the last 10 requests with time, status (200/429), and remaining

## Checklist

- [ ] Bucket visualized (height proportional to tokens/capacity)
- [ ] Color changes: green / yellow / red
- [ ] Tokens refill automatically (useEffect + setInterval)
- [ ] Capacity slider updates state and bucket
- [ ] refillRate slider affects refill speed
- [ ] X-RateLimit-* headers displayed after each request
- [ ] Retry-After visible on 429
- [ ] Request log (last 10) with color coding

## How to Check Yourself

1. Set capacity=5, refillRate=1. Click the button 5 times — all 200 OK.
2. 6th request — 429, Retry-After is visible.
3. After one second — 1 more token, request goes through.
4. Increase refillRate=5 — the bucket refills much faster.

## Tips

- Use `useRef` to store `tokensRef` — this lets you read the current value inside `setInterval` without closure issues
- `lastRefillRef` stores the last refill time for accurate calculation
- Formula for time to next token: `1 / refillRate - elapsed`
