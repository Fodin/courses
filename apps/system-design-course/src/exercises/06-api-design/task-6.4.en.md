# Task 6.4: API Gateway and BFF

## Objective

Design an API Gateway and BFF (Backend for Frontend) layer for an application with three client types and five microservices.

## Requirements

1. Three client types:
   - **Mobile App** — minimal data, optimized for mobile networks
   - **Web App** — full data, rich UI
   - **Admin Panel** — all data + metrics, internal operations
2. Five microservices:
   - **User Service** — profiles, authorization
   - **Product Service** — catalog, search
   - **Order Service** — orders, cart
   - **Payment Service** — payments, balance
   - **Analytics Service** — metrics, reports
3. For each BFF, define:
   - Which microservices it aggregates
   - What data it returns to the client (example endpoint)
   - How it optimizes the response for the client type
4. For the API Gateway, define:
   - Cross-cutting concerns: auth, rate limiting, logging
   - Routing rules
   - Rate limits for each client type
5. Interactive diagram: clients → BFF → API Gateway → microservices

## Checklist

- [ ] 3 BFFs: mobile, web, admin — with aggregation description
- [ ] For each BFF: example endpoint + which services it calls
- [ ] API Gateway: auth, rate limiting, routing
- [ ] Different rate limits for mobile/web/admin
- [ ] Optimization description for each client
- [ ] Visual data flow diagram
- [ ] Example: the same screen (product feed) for mobile vs web vs admin

## How to Check Yourself

1. Mobile BFF returns compact data (small images, minimal fields)
2. Web BFF aggregates data from 3+ services in a single request
3. Admin BFF has access to Analytics and internal operations
4. API Gateway applies auth to all requests
5. Rate limits: mobile = 100 req/min, web = 200, admin = 50
