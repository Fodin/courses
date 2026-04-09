# Task 2.1: Sync vs Async — Visual Comparison

## Goal

Implement a parallel animation that clearly shows the difference between a synchronous call chain and asynchronous communication via a queue. The user should see how temporal coupling blocks services in the sync model and how the async model frees the sender from waiting.

---

## Requirements

1. Create a component with two parallel panels: "Synchronous Call" on the left and "Asynchronous Queue" on the right
2. In the sync panel, display a chain of services (at least 4): Order Service -> Payment Service -> Inventory Service -> Notification Service
3. Each service in the chain transitions through states: `idle` -> `waiting` -> `processing` -> `done`
4. When sync animation starts, services activate strictly in sequence — each waits for the previous one to finish
5. In the async panel, the first service (Order Service) completes quickly, puts a message in the queue (Message Queue), and immediately transitions to `done`
6. Workers in the async panel start working in parallel after the queue receives the message
7. After both animations complete, display the actually measured time in milliseconds for each model
8. Add a launch button under each panel that is disabled during execution
9. Visually highlight states: waiting (yellow), processing (blue), done (green)
10. Add a summary block explaining the key insight

---

## Checklist

- [ ] Two separate useState-managed arrays for sync and async services
- [ ] `runSync` function correctly simulates sequential blocking processing via `await + setTimeout`
- [ ] `runAsync` function shows fast Order Service return and parallel worker execution
- [ ] Color states are applied via transition for smooth animation
- [ ] Time measurement via `Date.now()` and result displayed after completion
- [ ] Buttons are `disabled` during animation
- [ ] Component works correctly in dark and light themes
- [ ] Arrow separators between services in the vertical chain

---

## How to Check Yourself

1. Press "Run synchronously" — services should activate strictly one after another, previous ones go to `done`, next ones are in `waiting`
2. Press "Run asynchronously" — Order Service should finish first (~300ms), then Message Queue, then Workers start in parallel
3. The final async time should be significantly less than sync time (because workers run in parallel, not sequentially)
4. The button should not be clickable during animation
5. The summary block should appear only after the animation completes

### Expected Result

```
Sync:  [Order: done] -> [Payment: done] -> [Inventory: done] -> [Notification: done]
       Time: ~3200ms (sum of all steps)

Async: [Order: done] -> [Queue: done] -> [Payment: done | Inventory: done]
       Time: ~1800ms (Order + max(workers))
```