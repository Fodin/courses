# Task 16.4: Full Video Platform Design (CAPSTONE)

## Goal

Design a complete YouTube-like video platform architecture covering all aspects: upload, transcoding, storage, CDN, metadata, search, recommendations, analytics, live streaming, copyright detection. This is the final course assignment — the most comprehensive system design.

## Requirements

1. **Requirements & Estimates**:
   - Functional: upload, transcoding, streaming (HLS/DASH), search, recommendations, live, comments, subscriptions
   - Non-functional: 2B users, 800M DAU, 500 hrs video/min upload, < 2 sec playback start, 99.99% availability
   - Back-of-the-envelope: storage/year, CDN bandwidth, transcoding compute, views/sec

2. **Video Upload & Processing**:
   - Resumable upload protocol (chunked, parallel)
   - Transcoding pipeline: async, DAG parallelism, GPU cluster
   - Bitrate ladder: per-title encoding (adaptive bitrate ladder)
   - Thumbnail generation: key frames extraction, custom upload
   - Content ID: audio fingerprint (Chromaprint) + video pHash

3. **Video Storage**:
   - Object Store: raw + transcoded, chunked segments
   - Tiered storage: hot (SSD) / warm (S3 IA) / cold (Glacier)
   - Lifecycle policies: auto-migration by popularity/age
   - Storage cost optimization: per-title encoding, lazy 4K transcoding

4. **Content Delivery (CDN)**:
   - 3-tier: Edge POP (200+) → Mid-tier (20 regions) → Origin
   - Push vs pull strategy (hot vs long-tail content)
   - Google GGC model: servers at ISPs
   - Cache invalidation: version-based URLs

5. **Adaptive Bitrate Streaming**:
   - HLS + DASH (dual protocol)
   - Manifest generation: master + media playlists
   - Player algorithm: bandwidth estimation → quality selection
   - DRM: Widevine (Android), FairPlay (iOS), PlayReady (Windows)

6. **Metadata & Search**:
   - PostgreSQL (sharded): video metadata, channels, users
   - Elasticsearch: full-text search (titles, descriptions, tags)
   - Search ranking: relevance × freshness × popularity × personalization
   - Autocomplete: prefix trie / Elasticsearch suggest

7. **Recommendations**:
   - Candidate generation: collaborative filtering + content-based
   - Ranking: ML model (watch time prediction)
   - Feature store: user embeddings, video embeddings (Redis/Cassandra)
   - Re-ranking: diversity, freshness, business rules

8. **Analytics & View Counting**:
   - View events: Kafka → Flink → Cassandra (aggregated)
   - De-duplication: HyperLogLog / Bloom filter
   - Real-time dashboard: Flink → ClickHouse → Grafana
   - Monetization counting: exact batch job (hourly)

9. **Live Streaming**:
   - Ingest: RTMP → Live Transcoder (real-time)
   - Delivery: LL-HLS (Low-Latency HLS), 2-5 sec latency
   - Scaling: 1 ingest → CDN → millions of viewers
   - DVR: record live → VOD (archive segments)
   - Chat: WebSocket → Redis Pub/Sub → broadcast

10. **Copyright Detection (Content ID)**:
    - Audio fingerprint: Chromaprint / AcoustID
    - Video fingerprint: perceptual hash (pHash)
    - Reference database: 100M+ tracks/clips
    - Policy engine: block / monetize / track / allow

11. **Reliability & Operations**:
    - Health checks: transcoder queue depth, CDN hit rate, error rate
    - Graceful degradation: serve lower quality, disable recommendations
    - Disaster recovery: multi-region, cross-region replication
    - Monitoring: Prometheus → Grafana → PagerDuty

## Checklist

- [ ] Requirements: functional, non-functional, back-of-the-envelope estimates
- [ ] Upload: resumable protocol, chunked, parallel, checksum validation
- [ ] Transcoding: async pipeline (Kafka → GPU cluster), DAG parallelism, per-title encoding
- [ ] Storage: Object Store (tiered hot/warm/cold), chunked segments, lifecycle policies
- [ ] CDN: 3-tier architecture, push/pull strategy, GGC model, cache hit rate > 90%
- [ ] Adaptive Bitrate: HLS + DASH, segment-based, bandwidth estimation, DRM
- [ ] Metadata: PostgreSQL (sharded) + Elasticsearch (search + autocomplete)
- [ ] Recommendations: candidate gen → ranking (ML) → re-ranking, feature store
- [ ] Analytics: Kafka → Flink → ClickHouse, view counting (aggregated, de-duped)
- [ ] Live Streaming: RTMP ingest → LL-HLS delivery, DVR archive, chat (WebSocket)
- [ ] Copyright: audio/video fingerprinting, reference DB, policy engine
- [ ] Reliability: health checks, graceful degradation, multi-region DR
- [ ] Architecture diagram: all components and their interaction
- [ ] Technology choices: justified choice for each component

## How to check yourself

1. **Upload**: a user uploads a 4 GB video over mobile internet — how to ensure reliable upload? (resumable, chunked, checksum)
2. **Transcoding**: a viral video needs fast processing — how to prioritize? (priority queue, DAG parallel, GPU spot instances)
3. **CDN**: a new video becomes trending (#1 in the country) — how does the CDN cope? (push hot content, edge cache, mid-tier absorb)
4. **Adaptive bitrate**: a user on the subway (unstable 4G) — what happens? (player measures bandwidth, downgrades 1080p → 480p, upgrades when network stabilizes)
5. **View counting**: a viral video reaches 10M views/hour — how to not crash the DB? (Kafka buffer, Flink aggregate, batch write, HyperLogLog de-dup)
6. **Live streaming**: a streamer with 1M viewers — how to ensure < 5 sec latency? (RTMP ingest, LL-HLS, CDN edge cache, no origin bottleneck)
7. **Copyright**: a user uploaded a movie — how to detect it? (audio fingerprint during transcoding, compare with reference DB, apply policy)
8. **Disaster**: an entire AWS region goes down — what happens? (multi-region, CDN serves from other POPs, DNS failover, transcoding queue redistributes)
9. Compare your design with the reference solution (Solution)
