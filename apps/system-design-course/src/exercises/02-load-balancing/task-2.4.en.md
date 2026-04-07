# Assignment 2.4: Multi-Level Load Balancing Design

## Goal

Design a load balancing architecture for a system with three traffic types: WebSocket connections, REST API, and static files. For each type, select the load balancer level, algorithm, and health check type.

## Requirements

1. The system handles three traffic types:
   - **WebSocket** — long-lived connections (chat, real-time notifications)
   - **REST API** — short HTTP requests (CRUD operations, search)
   - **Static Files** — images, CSS, JS, video (cacheable content)
2. For each traffic type, determine:
   - **Load balancer level**: L4 or L7
   - **Balancing algorithm**: Round Robin, Weighted RR, Least Connections, IP Hash, Consistent Hashing
   - **Health check type**: Active, Passive, both
3. Justify each decision — why this algorithm for this traffic type
4. Implement as an interactive table with parameter selection and answer checking

## Checklist

- [ ] WebSocket uses an approach providing sticky behavior (IP Hash / Consistent Hashing)
- [ ] REST API uses an algorithm accounting for current load (Least Connections)
- [ ] Static Files account for caching possibility (CDN / Consistent Hashing)
- [ ] LB level (L4/L7) specified for each traffic type
- [ ] Health checks configured considering each traffic type's specifics
- [ ] Justifications are logical and account for traffic characteristics

## How to Check Yourself

1. Open the assignment and select parameters for each traffic type
2. Check answers — each solution should have an explanation
3. Think: what happens if one of the WebSocket servers goes down?
4. Think: why might Consistent Hashing be better than Round Robin for static files?
5. Check: are passive health checks sufficient for WebSocket servers?
