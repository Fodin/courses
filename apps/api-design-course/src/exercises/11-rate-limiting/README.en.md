# Rate Limiting and Throttling

## Why Rate Limiting Is Needed

Rate limiting restricts the number of requests a client can make per unit of time. Three main reasons:

- **Abuse protection** — DDoS, brute force, scraping
- **Fairness** — one client doesn't monopolize resources
- **Economics** — a free tier shouldn't consume like a paid one

## Main Algorithms

### Token Bucket (most popular)

A bucket of tokens. Each request consumes a token. Tokens refill at a fixed rate. Allows short-term bursts up to the bucket size.

```
capacity = 10, refillRate = 2/sec
10 requests in a row → OK (drained the bucket)
11th request → 429 (bucket is empty)
after 0.5s → +1 token → can request again
```

### Sliding Window Counter

Divides time into windows, counts requests with overlap. More accurate than fixed window, no spike at the period boundary.

## HTTP Headers

```http
X-RateLimit-Limit: 1000        # max requests in window
X-RateLimit-Remaining: 946     # remaining in current window
X-RateLimit-Reset: 1735689600  # Unix timestamp of reset

# On 429:
HTTP/1.1 429 Too Many Requests
Retry-After: 30                # wait 30 seconds
```

## Client Strategy

When receiving a 429, the client should use **exponential backoff with jitter**:

```
delay = min(maxDelay, baseDelay × 2^attempt) × random(0.5, 1.0)
```

Jitter prevents thundering herd — a situation where all clients attack simultaneously after waiting.
