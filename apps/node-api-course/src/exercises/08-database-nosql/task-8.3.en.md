# Task 8.3: Redis

## 🎯 Goal

Master Redis: basic get/set/del operations with TTL, cache-aside pattern for caching DB data, and pub/sub for inter-service messaging.

## Requirements

1. Connect to Redis via `createClient`, show string operations (set, get, setEx with TTL), hashes (hSet, hGetAll), lists (lPush, rPop), sets (sAdd, sMembers)
2. Implement cache-aside pattern: check cache -> query DB -> store in cache with TTL -> invalidate on update
3. Show pub/sub: separate connection for subscriber, subscribe/pSubscribe, publish, unsubscribe

## Checklist

- [ ] Redis connected, 4+ data structures demonstrated
- [ ] All keys have TTL (no keys without expiration)
- [ ] Cache-aside: cache hit returns data instantly, cache miss queries DB
- [ ] Cache invalidation on data update
- [ ] Pub/sub uses separate connection for subscriber

## How to Verify

Click "Run" and verify that: Redis operations shown for all data structures, cache-aside demonstrates cache hit/miss difference, pub/sub works with pattern subscriptions.
