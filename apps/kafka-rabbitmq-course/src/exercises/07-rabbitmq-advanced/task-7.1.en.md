# Task 7.1: Dead Letter Exchange — path of rejected messages

## Goal

Implement an interactive DLX flow visualization that shows how messages end up in the Dead Letter Queue through three different mechanisms: NACK, TTL, and queue overflow.

## Requirements

1. Implement a `publishMessage` function that:
   - Creates a message with a unique ID and timestamp
   - Places it in `orders.queue` with status `queued`
   - Starts animation through statuses

2. Implement three paths to DLX:
   - **NACK**: statuses `queued` → `processing` → `rejected` → `dead-lettered`
   - **TTL Expired**: statuses `queued` → `processing` → `expired` → `dead-lettered`
   - **Max Length**: statuses `queued` → `processing` → `rejected` → `dead-lettered`

3. Display queue configuration:
   - `x-dead-letter-exchange`
   - `x-dead-letter-routing-key`
   - `x-message-ttl` (if TTL mode is selected)

4. Show the route of each message on click.

5. Visually separate `orders.queue` and `orders.dead-letter` into two blocks with counters.

## Checklist

- [ ] "Publish" button adds a message to the visualization
- [ ] In NACK mode, the message goes through `rejected` → `dead-lettered`
- [ ] In TTL mode, the message goes through `expired` → `dead-lettered` after TTL expires
- [ ] In Max Length mode, the message is rejected due to overflow
- [ ] Clicking a message shows the detailed route with exchange/queue names
- [ ] Both queue counters update in real time
- [ ] "Clear" button resets the state

## How to test yourself

Click "Publish" with TTL mode and a 2-second timer. After 2 seconds the message should:
1. Appear in `orders.queue` with status QUEUED
2. Transition to PROCESSING
3. Transition to EXPIRED
4. Move to `orders.dead-letter` with status DEAD LETTERED

The route should contain lines with `x-message-ttl`, `x-dead-letter-exchange` and the final DLQ name.
