# Task 3.4: Multi-Level Cache for a News Website

## Objective

Design a caching strategy for a news website with different content types: static assets, API responses, and dynamic user-generated content. For each type, select the cache level, TTL, invalidation strategy, and cache stampede protection.

## Requirements

1. Create an interactive design table with three content rows:
   - **Static assets** — JS/CSS/images
   - **API responses** — article list, catalog data
   - **User-generated content** — user feed, notifications, profile
2. For each content type, fill in the columns:
   - **Cache levels** — which to use (Browser, CDN, Redis, DB Query Cache)
   - **TTL** — time to live at each level
   - **Invalidation** — strategy (TTL, event-based, versioned keys)
   - **Stampede protection** — whether protection is needed and which type (lock, early refresh, none)
3. Show the resulting cache "map": which request passes through which levels
4. Calculate the approximate hit ratio for each level at the given traffic

## Checklist

- [ ] Three content types are presented in the table
- [ ] Adequate cache levels are selected for each type
- [ ] TTL logically decreases from static to dynamic
- [ ] Invalidation matches the nature of the data
- [ ] Stampede protection is enabled for "hot" data (API, popular articles)
- [ ] Static assets are cached aggressively (Browser + CDN, long TTL, immutable)
- [ ] User-generated content — short TTL, event-based invalidation
- [ ] The final cache map is clear and visual

## How to Check Yourself

1. Static assets: Browser Cache (max-age=1 year, immutable) + CDN — correct?
2. API responses: CDN (5 min) + Redis (1 min) + stampede lock — correct?
3. User-generated content: Redis only (30 sec) + event-based invalidation — correct?
4. Try changing the TTL — how does it affect the calculated hit ratio?
5. Make sure stampede protection is enabled for "hot" API data
