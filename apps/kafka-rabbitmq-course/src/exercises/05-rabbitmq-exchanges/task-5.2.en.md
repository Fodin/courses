# Task 5.2: Fanout Exchange

## Goal

Implement an interactive Fanout Exchange simulator that demonstrates broadcasting messages to all bound queues regardless of routing key.

## Requirements

1. Define the `FanoutQueue` interface with properties: `id` (string), `name` (string), `color` (string), `bgColor` (string), `messages` (string[]), `active` (boolean).
2. Initialize 3 default queues: `email-notifications`, `push-notifications`, `analytics-events`.
3. Implement states: `queues`, `animating` (boolean), `routingKey`, `messageCount`, `log`, `newQueueName`.
4. Implement the `publish()` function:
   - Takes only active queues (`active: true`)
   - Sets `animating = true`
   - After 600 ms, adds the message to each active queue and resets `animating`
   - Writes to the log a line with the number of queues and their names
5. Implement the `toggleQueue(id)` function: toggles the `active` property of a queue.
6. Implement the `addQueue()` function: adds a new queue with the name from `newQueueName`, assigns a color cyclically from 3 options, clears the input field.
7. Implement the `removeQueue(id)` function: removes a queue by its identifier.
8. Implement the `clearAll()` function: clears messages in all queues and the log.
9. Display the diagram: Producer → Exchange → list of queues with animated arrows.
   - Disabled queues (active: false) are displayed with opacity 0.35
   - Exchange is highlighted during animation
   - Each queue has "unbind"/"bind" and "✕" (delete) buttons
10. Provide an input field for the routing key (it is accepted but ignored during routing) with a label "(ignored)".
11. Provide an input field + "+ Bind" button for adding a new queue.
12. Display the broadcast log with timestamps.
13. Add a block with 4 Fanout Exchange usage scenarios.

## Checklist

- [ ] `FanoutQueue` interface with `active` field for binding management
- [ ] `publish` function delivers only to active queues
- [ ] Animation is delayed via `setTimeout` for 600 ms
- [ ] `toggleQueue` works — a disabled queue stops receiving messages
- [ ] `addQueue` with cyclic color cycling
- [ ] `removeQueue` removes a queue from the list
- [ ] Routing key field accepts input but does not affect routing
- [ ] Enter in the add-queue field triggers `addQueue`
- [ ] Log shows the number of recipient queues
- [ ] Usage scenarios block is present

## How to Test Yourself

1. Click "Broadcast" — all 3 queues receive the message.
2. Click "unbind" on one queue and then "Broadcast" again — it no longer receives new messages.
3. Change the routing key to any value and click "Broadcast" — the result does not change (all active queues receive the message).
4. Add a new queue via the input field — it appears in the list and immediately receives the next message.
5. Delete a queue with the "✕" button — it disappears from the diagram.
