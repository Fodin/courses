# Task 10.3: Full Distributed Rate Limiter Design

## Objective

Design a Distributed Rate Limiter as a service — from requirements to scaling. Go through all stages of a system design interview: requirements, architecture, algorithm, distributed coordination, HTTP integration, monitoring.

## Requirements

1. **Requirements** — formulate functional and non-functional requirements for the rate limiter as a service
2. **Algorithm Choice** — justify the algorithm choice for production (sliding window counter or token bucket)
3. **Architecture** — distributed architecture: API servers + Redis + rules
4. **Redis Schema** — keys, TTL, Lua scripts for atomic operations
5. **API & HTTP Integration** — middleware, X-RateLimit-* headers, 429 response
6. **Multi-tier Limiting** — IP, user, API key, endpoint levels
7. **Fault Tolerance** — what to do if Redis is unavailable (fail-open vs fail-closed)
8. **Monitoring** — metrics, alerts, dashboards

## Checklist

### Requirements
- [ ] 3+ functional requirements listed (request limiting, configurable rules, HTTP headers)
- [ ] 3+ non-functional requirements (low latency < 5ms, high availability, consistency)
- [ ] Limit types defined (per-IP, per-user, per-endpoint, global)
- [ ] Behavior defined when rate limiter is unavailable (fail-open)

### Algorithm Choice
- [ ] Algorithm choice justified (sliding window counter or token bucket)
- [ ] Trade-offs of the chosen algorithm described
- [ ] Explained why other algorithms are not suitable for this case

### Architecture
- [ ] Distributed architecture described (API nodes + shared Redis)
- [ ] Redis used as shared state (not local counters)
- [ ] Lua script for atomic check-and-increment
- [ ] Redis key schema described (rate:{type}:{id}:{window})

### HTTP Integration
- [ ] Rate limiter implemented as middleware (not in each endpoint)
- [ ] Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- [ ] 429 Too Many Requests response with Retry-After
- [ ] Response body contains retry_after and error description

### Multi-tier Limiting
- [ ] Check order: global → IP → user → endpoint
- [ ] Order justified (from cheap to expensive)
- [ ] Different limits for different pricing tiers (Free/Pro/Enterprise)

### Fault Tolerance
- [ ] Fail-open strategy: Redis down → allow requests
- [ ] Local fallback: in-memory approximate counter when Redis is lost
- [ ] Redis Sentinel / Cluster for HA
- [ ] Circuit breaker for Redis calls

### Monitoring
- [ ] Metrics: rate of 429 responses, p99 latency of rate limiter, Redis connection errors
- [ ] Alerts: spike in 429 (possible attack), Redis latency > 10ms
- [ ] Dashboard: top rate-limited users, requests by tier, Redis cluster health

## How to Check Yourself

1. Go through each checklist section — all items should be covered
2. "Walk through" the scenario: 1000 req/sec from one user through 3 API servers
3. Check: do all 3 servers see the shared counter in Redis?
4. Check: if Redis is down for 5 seconds — what happens to requests?
5. Check: does the client receive X-RateLimit-Remaining and Retry-After?
6. Check: DDoS from 10K IPs — does the IP limit filter at the gateway level?
7. Compare your design with the reference solution (Solution)
