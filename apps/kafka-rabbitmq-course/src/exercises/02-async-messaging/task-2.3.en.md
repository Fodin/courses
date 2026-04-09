# Task 2.3: Pub/Sub — Fan-out Simulator

## Goal

Implement a Pub/Sub (Publisher-Subscriber) pattern simulator with support for multiple topics and dynamic subscriber management. The key idea: one published message is delivered to all subscribers of that topic simultaneously — fan-out.

---

## Requirements

1. Implement at least 3 topics (e.g., `order.created`, `payment.processed`, `user.registered`)
2. For each topic, display a "Publish" button with the topic name and subscriber count
3. When publishing, the message must be delivered to **all** subscribers of that topic
4. Initial state: 3 pre-set subscribers (Email Service on order.created, Analytics on order.created, Fraud Detector on payment.processed)
5. Each subscriber displays: name, its topic, the last 3-5 received messages
6. On publish, a delivery animation should be visible — the subscriber briefly highlights or shows "Receiving message..."
7. Add a form for creating a new subscriber: name field + topic selection from dropdown
8. Add a delete button for each subscriber
9. If a topic has no subscribers — the Publish button still works (message goes nowhere)
10. Display a published message counter on the Publish button
11. Each topic should be visually distinct by color (border, badge)

---

## Checklist

- [ ] Subscribers array in state with fields `id`, `name`, `topic`, `receivedMessages`
- [ ] `publish(topic)` function finds all subscribers with matching topic and delivers the message
- [ ] Subscriber highlight animation on message receipt (temporary state change)
- [ ] Publish button for each topic shows `N subs` badge
- [ ] Add subscriber form with non-empty name validation
- [ ] Delete button for each subscriber
- [ ] History of received messages (last 3-5) for each subscriber
- [ ] Each topic has a unique color scheme
- [ ] Subscriber IDs managed via ref (not state) to prevent collisions
- [ ] Component works with 0 subscribers — Publish button doesn't crash

---

## How to Check Yourself

1. Press "Publish: order.created" — both subscribers (Email Service and Analytics) should receive the message simultaneously. Fraud Detector — no
2. Press "Publish: payment.processed" — only Fraud Detector receives the message
3. Add a new subscriber "Audit Log" on `order.created`
4. Press "Publish: order.created" again — now 3 subscribers should receive the message
5. Delete Email Service and press Publish again — only Analytics and Audit Log receive
6. Try adding a subscriber with empty name — form should reject it

### Expected Result

```
Publisher: [order.created ▶ 2 subs] [payment.processed ▶ 1 sub] [user.registered ▶ 0 subs]

Email Service      Analytics          Fraud Detector
topic: order.*     topic: order.*     topic: payment.*
[ORDER #1]         [ORDER #1]         (no messages)
[ORDER #2]         [ORDER #2]

On publishing order.created #3:
Email Service and Analytics highlight simultaneously, receive ORDER #3
```

### Key Behavior to Verify

Make sure the publisher is completely independent of the number of subscribers: the same `publish` function works with 0, 1, and 10 subscribers without changes. This is the main property of Pub/Sub — decoupling between publisher and subscribers.