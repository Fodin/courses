# Task 8.2: Architecture Constructor — URL Shortener

## Objective

Assemble the URL Shortener architecture from provided components. Understand which blocks are necessary, how they're connected, and validate the completeness of your solution.

## Requirements

1. You're given a set of architectural components (blocks)
2. Check the components that are **necessary** for a working URL Shortener
3. The system will verify whether all critical components are selected
4. For each selected component, think: **why is it needed** and **what breaks without it**
5. Try to mentally "walk through" both flows: link creation and redirect

## Candidate Components

- **Client** — user's browser or app
- **Load Balancer** — distributes requests across servers
- **API Server** — handles HTTP requests (creation, redirect)
- **Cache (Redis)** — cache for hot links
- **Database (SQL)** — stores shortCode → longUrl mapping
- **Key Generation Service** — generates unique short codes
- **Analytics Service** — counts clicks, collects statistics
- **CDN** — serves static assets (frontend)
- **Message Queue (Kafka)** — asynchronous event processing
- **Full-Text Search (Elasticsearch)** — full-text search

## Checklist

- [ ] Selected all components needed for **creating** a short link
- [ ] Selected all components needed for **redirect** from a short link
- [ ] Understood why Cache is needed for read-heavy workload (100:1)
- [ ] Understood why Load Balancer is needed for scaling
- [ ] Understood why Key Generation Service is a separate service
- [ ] Identified optional components and explained why they're needed
- [ ] No extra components unrelated to the task

## How to Check Yourself

1. Mark the components and click "Check"
2. The system will show which critical components are missing
3. Think: "If I remove this component — what breaks?"
4. For each optional component: "Which non-functional requirement does it address?"
