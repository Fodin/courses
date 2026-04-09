# Task 1.2: Cascading Failures and Circuit Breaker

## Goal

Create an interactive cascading failure simulator in a microservice chain.
The student manually breaks a service, observes the timeout propagation up the chain,
then enables Circuit Breaker and sees how it prevents the disaster.

## Requirements

1. Chain of 5 nodes: `Client → Service A → Service B → Service C → Service D`
2. Each node displays as a card with status (Healthy / FAILED / TIMEOUT / CB Open) and response time
3. `Failure` button under each service (except Client) transitions it to `failed` status
4. `Circuit Breaker ON/OFF` toggle — enables/disables protection
5. `Simulate Request` button launches an animated request passing through the chain:
   - If service is healthy — log `Success (Xms)`, time accumulates
   - If service is failed and CB is off — log timeout, error propagates up, 3000ms added per node
   - If service is failed and CB is on — log `Circuit Breaker OPEN — fast fail (0ms)`, other nodes don't wait
6. `Reset` button returns all services to Healthy state
7. Summary banner: total wait time — red for cascade (>5000ms), green for prevention
8. Event log — scrollable list of simulation steps

## Checklist

- [ ] Chain of 5 nodes displayed with cards and arrows between them
- [ ] `Failure` click turns the service to red `FAILED` status
- [ ] `Simulate Request` launches step-by-step animation with log
- [ ] Without CB: timeout cascades up, total time > 5000ms, banner is red
- [ ] With CB on: on re-simulation, failure is isolated, banner is green
- [ ] Node statuses update during simulation (TIMEOUT, CB Open)
- [ ] Circuit Breaker toggle visually switches (green ON / grey OFF)
- [ ] `Reset` button restores all services to Healthy
- [ ] Color legend for statuses displays below the diagram
- [ ] Component uses `useLanguage` and `t('task.1.2')` for the heading

## How to Check Yourself

1. Open the task in the browser
2. Make sure all services are green — press `Simulate Request` → should pass successfully
3. Press `Failure` on `Service C`, then `Simulate Request` with CB off
4. Observe: log should show timeout and error propagation backward
5. Total time > 9000ms — banner should be red with `Cascading failure!` label
6. Press `Reset`, take `Service C` down again
7. Enable Circuit Breaker and run the simulation again
8. CB should prevent waiting — total time around 0ms, banner is green