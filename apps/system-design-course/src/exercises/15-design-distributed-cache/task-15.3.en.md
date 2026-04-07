# Task 15.3: Full Distributed Cache Design for a Social Network

## Goal

Design a distributed cache for a large social network (similar to the cache layer of Twitter, Instagram). Describe the architecture, partitioning strategy, replication, eviction, persistence, and handling edge cases (hot keys, cache stampede, split-brain).

## Requirements

1. **Functional Requirements**:
   - GET / SET / DELETE with sub-ms latency
   - TTL for automatic invalidation
   - Caching: user profiles, timelines, session data, counters (likes, followers)
   - Atomic counters: INCR likes, DECR inventory
   - Pub/Sub for real-time notifications

2. **Non-Functional Requirements**:
   - 500M active users, 200M DAU
   - 2M cache RPS (peak), latency < 1 ms (p99)
   - 50 TB hot data in cache
   - 99.99% availability
   - Data loss ≤ 1 second on node crash

3. **Data Partitioning**:
   - Consistent hashing with hash slots (16384)
   - Calculation: how many nodes, how many slots per node
   - Strategy for multi-key operations (hash tags)
   - Hot key mitigation: celebrity user profiles (10M followers)

4. **Replication and Failover**:
   - Leader-follower: async vs semi-sync
   - Automatic failover: gossip → PFAIL → FAIL → promote follower
   - Split-brain protection: MIN_REPLICAS_TO_WRITE
   - Calculation: replication factor, total nodes

5. **Memory Management**:
   - Eviction policy: allkeys-lfu vs allkeys-lru for social network workload
   - Memory overhead: Redis metadata per key (~70 bytes)
   - Large keys: timeline lists (10K items) — how to not kill latency

6. **Persistence and Recovery**:
   - RDB + AOF: trade-offs for social network data
   - Warm-up strategy: how to warm up the cache after a full restart
   - Backup: how to backup 50 TB of in-memory data

7. **Caching Patterns**:
   - Cache-aside vs Write-through vs Write-behind
   - Cache stampede protection (singleflight / probabilistic early expiration)
   - Invalidation: event-driven (Kafka) vs TTL-based

## Checklist

- [ ] Functional and non-functional requirements defined
- [ ] Back-of-the-envelope: nodes, memory, RPS per node
- [ ] Architecture diagram with data flow
- [ ] Hash slots partitioning with node count calculation
- [ ] Hot key strategy (local cache, key sharding)
- [ ] Replication: async leader-follower with failover
- [ ] Split-brain protection (quorum, MIN_REPLICAS_TO_WRITE)
- [ ] Eviction policy justified for workload (LFU for social)
- [ ] Persistence: RDB + AOF, warm-up strategy
- [ ] Cache-aside pattern + stampede protection
- [ ] Invalidation via Kafka events
- [ ] Monitoring: hit rate, memory usage, replication lag, eviction rate

## How to check yourself

1. Scenario: a celebrity user (10M followers) publishes a post — how does the cache handle the hot key?
2. Scenario: a node with 5000 slots went down — how much data is lost? How fast is the failover?
3. Scenario: a network split divides 6 nodes into 2+4 — what happens to writes in each partition?
4. Calculation: 50 TB / 64 GB RAM per node = ? nodes × replication factor 3 = ? total
5. Scenario: the entire cluster restarted — how to warm up 50 TB of cache without overloading the DB?
6. Compare your design with the reference solution (Solution)
