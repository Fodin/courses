# Task 6.1: Publisher Confirms — confirmation visualization

## Goal

Implement an interactive visualization of the Publisher Confirms mechanism in RabbitMQ: a simulation of sending messages and receiving ACK/NACK from the broker in three modes.

## Requirements

1. Add a confirmation mode switch: individual, batch, async
2. On "Send" click, start a simulation of sending 10 messages
3. Visualize sequence diagram: Producer → [arrows] → Broker with ACK/NACK results
4. Display confirmation events as `basicAck(deliveryTag, multiple)` / `basicNack(deliveryTag, multiple)` calls
5. Add a NACK probability slider (0–50%)
6. For batch mode — add batch size setting (2–10)
7. Show counters: ACK, NACK, in-flight
8. Different status colors: pending (gray), sent (blue), confirmed (green), nacked (red)

## Checklist

- [ ] Individual mode: each message waits for ACK sequentially
- [ ] Batch mode: messages sent in groups, one ACK with multiple=true
- [ ] Async mode: all messages sent without waiting, ACK arrive in random order
- [ ] Sequence diagram updates in real time
- [ ] Event log shows correct basicAck/basicNack syntax
- [ ] "Reset" button clears all state
- [ ] ACK/NACK/in-flight statistics are up to date

## How to test yourself

Run the simulation in async mode with NACK=20%:
- Arrows in the sequence diagram should update asynchronously (not in order)
- Some messages receive a red NACK
- Log contains events: `basicNack(deliveryTag=X, multiple=false)`

Switch to batch with batchSize=5:
- 10 messages are split into 2 groups
- Each group receives one ACK with `multiple=true`
- Delivery tag in ACK equals the last tag in the batch

## Hints

- Use `useState` for the list of messages and their statuses
- For async mode: send all messages at once, then use `setTimeout` with different delays to simulate async ACK
- `deliveryTag` — a monotonically increasing number, starting from 1
- `multiple=true` means "I confirm all tags <= this value"
