# Task 3.3 — ACK/NACK Simulator

## Goal

Create an interactive RabbitMQ message lifecycle simulator with a full state machine. The user sends messages and manually manages their acknowledgment: ACK (successful processing), NACK+Requeue (redelivery), NACK+DLQ (to dead letter queue), Timeout (didn't respond in time).

## Requirements

1. "Send Message" button creates a new message that passes through states: `ready` → `delivering` → `delivered` → `processing`.
2. `prefetch` setting (1-5 via range input): if the number of active messages reaches prefetch, new messages aren't sent — the log shows "BLOCKED".
3. "no-ack mode" checkbox: when enabled, messages automatically transition to `acked` without manual confirmation.
4. Each message in `delivered`/`processing`/`redelivering` state shows 4 action buttons: ACK, NACK+Requeue, NACK+DLQ, Timeout.
5. ACK: message transitions to `acked`, written to log, removed from queue.
6. NACK+Requeue: `nacked` → `requeued` → `redelivering` → `processing` with increased attempt count and `redelivered=true`.
7. NACK+DLQ: `nacked` → `dead-lettered`, log records dead-letter-exchange.
8. Timeout: `timeout` → `redelivering` → `processing` with a new delivery-tag.
9. `delivery-tag` counter increases monotonically, a new tag is assigned on each (re)delivery.
10. Statistics (Total / ACK / DLQ / In Progress) update in real time.
11. Event log in terminal style (dark background): each entry — time, event type, details. Last 40 entries, newest first.
12. "Clear" button resets all messages and the log, counters restart.

## Checklist

- [ ] Sending a message creates an entry with a unique id and delivery-tag
- [ ] Message animates through states (delays ~500-600ms)
- [ ] Prefetch limit blocks sending with a log entry
- [ ] No-ack mode automatically acknowledges messages
- [ ] ACK / NACK+Requeue / NACK+DLQ / Timeout buttons visible only for active messages
- [ ] NACK+Requeue increases attempt count, sets redelivered=true, assigns new delivery-tag
- [ ] NACK+DLQ transitions to dead-lettered without returning to queue
- [ ] Timeout resends with new delivery-tag and redelivered=true
- [ ] Statistics update correctly after each action
- [ ] Log records every event with a timestamp
- [ ] "Clear" button fully resets state

## How to Check Yourself

1. Send 3 messages with prefetch=3, then try sending a fourth — the log should show a BLOCKED entry.
2. Press NACK+Requeue on a message — it should go through `nacked` → `requeued` → `redelivering` → `processing` with "redelivered (attempt 2)" label.
3. Press NACK+DLQ on another message — it should transition to `dead-lettered` and stay there.
4. Press Timeout — the message should get a new delivery-tag and return to processing.
5. Enable no-ack mode and send a message — it should auto-acknowledge without buttons.
6. Check Total / ACK / DLQ / In Progress counters — they should reflect the real state.