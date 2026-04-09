# Task 1.3: Service Discovery — Service Registry

## Goal

Create an interactive service registry with dynamic registration/deregistration of instances,
health checks, and a Round-Robin load balancer.

## Requirements

1. Service Registry: grouped list of instances by service name (`user-service`, `order-service`, `payment-service`)
2. Each instance shows: IP:Port, status (healthy / unhealthy / unknown), response time, request counter
3. Instance status is visualized with a colored indicator (green / red / yellow)
4. Dropdown for selecting a service template during registration
5. `+ Register Instance` button — adds a new instance of the selected type with a unique IP and port
6. `×` button on each instance — deregisters it from the registry
7. `Health Check` button — transitions all instances to `unknown`, then updates statuses:
   - Healthy instances: 85% chance to stay healthy, 15% to become unhealthy
   - Unhealthy instances: 30% chance to recover, 70% to remain unhealthy
8. Load Balancer block: service selection + `Route Request` button
9. Round-Robin load balancing: requests are distributed across healthy instances in turn
10. Routing log: shows `timestamp → host:port (responseTime ms)` or an error if no instances
11. Statistics in cards: total instances, Healthy, Unhealthy, total requests

## Checklist

- [ ] Registry is grouped by service names with separate sections
- [ ] Instance-less group shows `No instances` message
- [ ] `+ Register Instance` button adds a card with IP and port
- [ ] `×` button removes an instance from the registry
- [ ] `Health Check` shows intermediate `unknown` state (yellow)
- [ ] After check, statuses update randomly
- [ ] Healthy instances glow green (glow effect)
- [ ] Round-Robin sequentially iterates over healthy instances of a service
- [ ] When no healthy instances exist, the log shows `ERROR: No available instances`
- [ ] Request counter (`req`) increments on each target instance card
- [ ] Statistic cards update on any registry change
- [ ] Component uses `useLanguage` and `t('task.1.3')` for the heading

## How to Check Yourself

1. Open the task in the browser — make sure initial instances display correctly
2. Select `user-service` in the dropdown and add 2 new instances
3. Press `Health Check` — all should briefly turn yellow, then update
4. In the Load Balancer block, select `user-service` and press `Route Request` 4 times
5. Make sure requests rotate between healthy instances (Round-Robin)
6. Deregister all `user-service` instances, press `Route Request`
7. Log should show an error — no available instances
8. Check that request counters on instance cards are incrementing