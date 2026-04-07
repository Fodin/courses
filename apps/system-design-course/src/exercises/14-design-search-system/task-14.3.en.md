# Task 14.3: Full Search Engine Design for E-commerce

## Goal

Design a search engine for a large e-commerce service (similar to Ozon, Wildberries, Amazon search). Describe the architecture, technology choices, sharding strategy, ranking pipeline, and handling of e-commerce-specific scenarios.

## Requirements

1. **Functional Requirements**:
   - Full-text search across products (title, description, brand)
   - Faceted search: filters by price, category, brand, rating
   - Typeahead / autocomplete with popular queries
   - Fuzzy matching for typos
   - Sorting: by relevance, price, popularity, newness

2. **Non-Functional Requirements**:
   - 50M products, 100K search RPS (peak)
   - Latency < 200 ms (p99)
   - Near real-time indexing: new product in search within < 30 sec
   - 99.99% availability

3. **Architecture**:
   - Components: Query Service, Indexing Service, Typeahead Service, Ranking Service
   - Data flow: product created → Kafka → Indexer → Elasticsearch shards
   - Sharding strategy: by category or by hash(product_id)?
   - Replicas: how many replicas for 100K RPS?

4. **Ranking Pipeline for e-commerce**:
   - BM25 (text relevance)
   - Commercial factors: price, rating, stock availability, conversion rate
   - Personalization: purchase history, views
   - Sponsored results: how to integrate ads into organic results

5. **E-commerce specifics**:
   - Zero search results — what to do? (spell correction, did-you-mean, fallback)
   - Synonyms: "phone" = "smartphone", "laptop" = "notebook"
   - Seasonal trends: "swimsuit" in summer vs "down jacket" in winter

## Checklist

- [ ] Functional and non-functional requirements defined
- [ ] Back-of-the-envelope: QPS, storage, bandwidth
- [ ] Architecture diagram with main components
- [ ] Sharding strategy choice justified
- [ ] Shard and replica count calculated
- [ ] Ranking pipeline described (BM25 + business signals)
- [ ] Indexing data flow described (Kafka → Indexer → ES)
- [ ] Typeahead — separate service with Trie / Redis
- [ ] Faceted search via ES aggregations
- [ ] Zero result handling (spell correction, synonyms)
- [ ] Monitoring: search latency, zero-result rate, CTR, conversion

## How to check yourself

1. Walk through the scenario: user searches for "iphon 13 pro" — how is the typo handled? How does faceted search show filters?
2. Walk through the scenario: a seller adds a new product — how many seconds until it appears in search?
3. Check: what happens if one shard goes down? Do replicas ensure availability?
4. Check: 100K RPS across 300 shards — how many QPS per shard?
5. Check: how does ranking distinguish "cheap phone" from "best phone"?
6. Compare your design with the reference solution (Solution)
