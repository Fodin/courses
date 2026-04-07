# Task 9.3: Full Paste Service Design

## Objective

Design a Paste Service end-to-end — like a real System Design interview. Go through all stages: requirements, capacity estimation, API, data model, architecture, scaling.

## Requirements

1. **Requirements** — formulate functional and non-functional requirements
2. **Capacity Estimation** — calculate QPS, storage (S3 + SQL separately), bandwidth
3. **API Design** — describe REST API endpoints (POST creation, GET reading, DELETE deletion)
4. **Data Model** — design the metadata table (SQL) and S3 storage schema
5. **Architecture** — describe write path and read path, including CDN
6. **Content-Addressable Storage** — describe content deduplication
7. **Expiration & Cleanup** — describe the expired paste deletion strategy
8. **Scaling** — describe scaling strategies for each component

## Checklist

### Requirements
- [ ] 3+ functional requirements listed (creation, reading, expiration)
- [ ] 3+ non-functional requirements (availability, latency, scale)
- [ ] Maximum paste size defined (10 MB)
- [ ] Read/write ratio defined

### Capacity Estimation
- [ ] Write QPS and read QPS calculated
- [ ] Peak QPS calculated (x2–3 from average)
- [ ] Content storage (S3) for 5 years calculated
- [ ] Metadata storage (SQL) for 5 years calculated
- [ ] Bandwidth (incoming + outgoing) calculated

### API Design
- [ ] POST /api/paste — creation (body: content, language?, expiresIn?, isPrivate?)
- [ ] GET /:shortCode — read paste (response: content + metadata)
- [ ] GET /:shortCode/raw — raw text (for curl, wget)
- [ ] DELETE /api/paste/:shortCode — deletion (auth required)

### Data Model
- [ ] Metadata table in PostgreSQL (shortCode, contentKey, language, expiresAt)
- [ ] Content in S3 with key = SHA-256 hash
- [ ] Indexes on shortCode and expiresAt
- [ ] SQL for metadata, S3 for content choice justified

### Architecture
- [ ] Write path described: Client → API → S3 + PostgreSQL
- [ ] Read path described: Client → CDN → API → S3
- [ ] CDN for caching public pastes
- [ ] Redis for metadata caching

### Content-Addressable Storage
- [ ] SHA-256 content hash as S3 key
- [ ] Deduplication of identical pastes
- [ ] Reference counting on deletion

### Expiration & Cleanup
- [ ] Background job for expired paste removal (every 5 min)
- [ ] Lazy expiration check on read
- [ ] CDN cache invalidation on deletion
- [ ] Reference count check before deleting S3 object

### Scaling
- [ ] Stateless API servers behind Load Balancer
- [ ] DB sharding by shortCode
- [ ] S3 — infinite storage (no sharding needed)
- [ ] CDN for read-heavy workload
- [ ] Redis Cluster for metadata cache

## How to Check Yourself

1. Go through each checklist section — all items should be covered
2. "Walk through" two scenarios: paste creation and paste reading
3. Check: if an API server goes down — does the CDN continue serving cached pastes?
4. Check: a paste with 10-min TTL is not served by CDN after 20 min?
5. Check: identical content is not duplicated in S3?
6. Compare your design with the reference solution (Solution)
