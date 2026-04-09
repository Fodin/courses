# Task 6.3: Durable vs Transient — fault tolerance test

## Goal

Simulate a RabbitMQ broker restart and observe which queues and messages survive depending on configuration. Understand the difference between durable/transient queues and persistent/transient messages.

## Requirements

1. "Declare Queue" button with a `durable` checkbox (true/false)
2. Publish messages with a `persistent` checkbox (deliveryMode 1 or 2)
3. "Restart Broker" button — simulates stopping and starting
4. After restart:
   - Non-durable queues disappear completely
   - In durable queues only persistent messages remain
5. Queue visualization: each queue is a block with a durable/transient badge
6. Messages in queues: colored cells (blue — persistent, pink — transient, green with checkmark — survived)
7. Survival matrix at the end (2x2 table)
8. Operation log: declare, publish, broker restart

## Checklist

- [ ] Can declare durable and non-durable queues simultaneously
- [ ] Persistent and transient messages are visually distinct
- [ ] Restart button is active only when there are messages
- [ ] After restart, non-durable queues disappear from the list
- [ ] In durable queues, transient messages are removed, persistent remain with a ✓ icon
- [ ] 2x2 matrix correctly reflects all 4 combinations
- [ ] Log contains all operations with correct parameters
- [ ] Broker status (Online/Restarting) is displayed correctly

## How to test yourself

**Scenario 1 — everything survives**:
1. Declare a durable queue
2. Publish persistent messages
3. Click "Restart Broker"
4. Result: queue and all messages are intact (green, with ✓)

**Scenario 2 — partial loss**:
1. Declare a durable queue
2. Publish 3 persistent + 3 transient messages
3. Click "Restart Broker"
4. Result: 3 persistent survived, 3 transient lost

**Scenario 3 — total loss**:
1. Declare a non-durable queue
2. Publish any messages
3. Click "Restart Broker"
4. Result: queue disappeared along with all messages

## Hints

- After "restart" use `.filter()` to remove non-durable queues
- Animate the restart: show "STOPPING..." → delay → "ONLINE"
- Log: `[declare] queue="name" durable=true`, `[publish] "msg" deliveryMode=2`
- Always show the survival matrix (not only after restart) — it's an educational element
