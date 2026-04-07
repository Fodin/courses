# Task 13.4: Full News Feed System Design

## Goal

Design a news feed system (Twitter/Instagram) from start to finish — like a real System Design interview. Go through all stages: requirements, fan-out strategy, social graph, feed ranking, caching, scaling.

## Requirements

1. **Requirements** — formulate functional and non-functional requirements
2. **Fan-out Strategy** — justify the hybrid approach choice (push + pull)
3. **Social Graph** — design relationship storage and DB choice
4. **Feed Ranking** — describe the ranking pipeline (retrieval → scoring → filtering → diversification)
5. **Caching** — multi-layer cache, invalidation, TTL
6. **Post Service** — publishing, storage, media
7. **Architecture** — system components and their relationships
8. **Scaling** — scaling each component

## Checklist

### Requirements
- [ ] 5+ functional requirements listed (publishing, feed, follow, ranking, infinite scroll)
- [ ] 3+ non-functional requirements listed (latency, scale, availability, eventual consistency)
- [ ] Back-of-the-envelope: DAU, read/write QPS, storage

### Fan-out Strategy
- [ ] Fan-out on write (push) described with pros and cons
- [ ] Fan-out on read (pull) described with pros and cons
- [ ] Hybrid: push for regular (< 10K followers), pull for celebrities
- [ ] Celebrity threshold justified (why 10K, not 1K or 100K)
- [ ] Post publishing flow described through Kafka → Fan-out Service → Redis

### Social Graph
- [ ] Data model: follows, blocks, user_stats
- [ ] Graph DB + Redis cache for different query types
- [ ] Sharding strategy with justification
- [ ] Hot spots solution (chunked lists, dedicated cache)

### Feed Ranking
- [ ] Pipeline: retrieval → scoring → filtering → diversification
- [ ] Scoring factors: freshness, affinity, engagement, content type
- [ ] Scored feed caching (don't recalculate on every scroll)
- [ ] Incremental updates (new post → insert into scored list)

### Caching
- [ ] Multi-layer: CDN (media) → Redis (feed, posts) → DB
- [ ] Feed cache: postId list per user in Redis
- [ ] Post cache: separate key post:{id} for deduplication
- [ ] Invalidation: incremental (lpush) + TTL fallback (5 min)

### Architecture & Scaling
- [ ] Components: API Gateway, Feed Service, Post Service, Fan-out Service, Ranking Service, Social Graph Service
- [ ] Kafka for async fan-out
- [ ] Posts DB (MySQL sharded), Graph DB (Neo4j/TAO), Redis Cluster
- [ ] S3 + CDN for media
- [ ] Horizontal scaling of each component

## How to check yourself

1. Go through each checklist section — all items should be covered
2. "Walk through" a scenario: a celebrity with 10M followers publishes a post. What happens at each stage?
3. Check: a user opens their feed for the first time in 3 days. Where do posts come from?
4. Check: a user unfollows an account. How is the feed updated?
5. Check: a post is deleted by the author. How does it disappear from all feeds?
6. Compare your design with the reference solution (Solution)
