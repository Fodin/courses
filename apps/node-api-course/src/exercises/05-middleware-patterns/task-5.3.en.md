# Task 5.3: Rate Limiting

## 🎯 Goal

Implement request rate limiting: Fixed Window, Sliding Window, and Token Bucket algorithms with HTTP headers.

## Requirements

1. Implement Fixed Window: N requests per minute per IP, counting in a fixed window
2. Explain Sliding Window Log: storing timestamps, removing expired ones
3. Implement Token Bucket: initial tokens, refill rate, burst traffic support
4. Show HTTP headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
5. Show 429 Too Many Requests response with `Retry-After`

## Checklist

- [ ] Fixed Window: simple counter, reset by time
- [ ] Sliding Window: more precise, but more memory-intensive
- [ ] Token Bucket: refill rate + burst capacity, token dynamics shown
- [ ] HTTP headers: Limit, Remaining, Reset in every response
- [ ] 429 response contains Retry-After and JSON error description

## How to Verify

Click "Run" and verify that: three algorithms are shown with examples, Token Bucket demonstrates burst/refill dynamics, and headers and 429 response are correct.
