# Task 8.3: Full URL Shortener Design

## Objective

Design a URL Shortener end-to-end — like a real System Design interview. Go through all stages: requirements, capacity estimation, API, data model, algorithm, architecture, scaling.

## Requirements

1. **Requirements** — formulate functional and non-functional requirements
2. **Capacity Estimation** — calculate QPS (read/write), storage for 5 years, bandwidth
3. **API Design** — describe REST API endpoints (POST creation, GET redirect, DELETE deletion)
4. **Data Model** — design DB tables and indexes
5. **Algorithm** — choose and justify the short code generation algorithm (hash / counter / pre-generated)
6. **Architecture** — draw the system components and their connections
7. **Scaling** — describe scaling strategies for each component

## Checklist

### Requirements
- [ ] 3+ functional requirements listed
- [ ] 3+ non-functional requirements (availability, latency, scale)
- [ ] Read/write ratio defined

### Capacity Estimation
- [ ] Write QPS calculated (links/sec)
- [ ] Read QPS calculated with read/write ratio
- [ ] Peak QPS calculated (×2–3 from average)
- [ ] Storage volume for 5 years calculated
- [ ] Minimum short code length determined (base62)

### API Design
- [ ] POST /api/shorten — creation (body: longUrl, customAlias?, expiresAt?)
- [ ] GET /:shortCode — redirect (response: 301/302)
- [ ] DELETE /api/urls/:shortCode — deletion (auth required)
- [ ] GET /api/urls/:shortCode/stats — analytics

### Data Model
- [ ] url_mappings table with shortCode index
- [ ] click_events table for analytics
- [ ] SQL vs NoSQL choice justified
- [ ] Sharding strategy described

### Algorithm
- [ ] Generation algorithm chosen (hash / counter / pre-generated)
- [ ] Collision handling described
- [ ] Explained why 7 base62 characters are enough

### Architecture
- [ ] Overall system diagram with components drawn (or described)
- [ ] Write path described (link creation)
- [ ] Read path described (redirect)
- [ ] Cache before DB for read-heavy workload

### Scaling
- [ ] Stateless API servers behind Load Balancer
- [ ] DB sharding by shortCode
- [ ] Redis Cluster for cache
- [ ] Async analytics (Kafka / queue)
- [ ] Expired link cleanup (TTL)

## How to Check Yourself

1. Go through each checklist section — all items should be covered
2. "Walk through" two scenarios mentally: link creation and redirect
3. Check: if one API server goes down — does the system continue working?
4. Check: if Redis is unavailable — does the system degrade but not crash?
5. Compare your design with the reference solution (Solution)
