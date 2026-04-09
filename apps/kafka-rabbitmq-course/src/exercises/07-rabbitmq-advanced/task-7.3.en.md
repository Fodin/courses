# Task 7.3: Priority Queue and Delayed Messages

## Goal

Implement an interactive visualization of two advanced RabbitMQ mechanisms: Priority Queue (queue with priorities `x-max-priority: 10`) and Delayed Messages (scheduler with a visual countdown timer). The interface switches between the two modes via tabs.

## Requirements

### Priority Queue

1. Define a `PriorityMessage` interface:
   - `id: string`, `body: string`
   - `priority: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10`
   - `status: 'queued' | 'consumed'`
   - `enqueuedAt: number`

2. Define `PRIORITY_COLORS` — a mapping of numeric priority levels to an object `{ bg, color, label }`:
   - 10 → CRITICAL, 9 → URGENT, 8 → HIGH, 7 → ELEVATED, 5 → NORMAL, 3 → LOW, 1 → BACKGROUND, 0 → MINIMAL

3. Implement an `enqueuePriority()` function:
   - Creates a new message and adds it to the queue

4. Implement `sortedQueue` — a list of messages with `queued` status, sorted by descending priority.

5. Implement a `consumeNext()` function:
   - Moves the first message from `sortedQueue` (with the highest priority) to `consumed` status

6. Implement auto-consumption via `startAutoConsume()` / `stopAutoConsume()`:
   - Interval of 600 ms, each tick consumes the next message from the sorted queue
   - When the queue is empty, stops automatically

### Delayed Messages

7. Define a `DelayedMessage` interface:
   - `id: string`, `body: string`, `delayMs: number`
   - `scheduledAt: number`, `deliveredAt: number | null`
   - `status: 'scheduled' | 'delivered'`

8. Implement `scheduleMessage()`:
   - Creates a `DelayedMessage` and after `setTimeout(delayMs)` moves it to `delivered` status

9. Display a progress bar with remaining time for each scheduled message (update via `setInterval` every 200 ms).

### Common

10. Implement "Clear" buttons for each mode.

## Checklist

- [ ] The Priority Queue message form has "Message" and "Priority" (0–10) fields
- [ ] `sortedQueue` always displays messages in descending priority order
- [ ] "Consume 1" button consumes the highest priority message
- [ ] "Auto Consume" toggles automatic consumption mode every 600 ms
- [ ] On stopping auto-consumption (`stopAutoConsume`), the interval is correctly cleared
- [ ] The Delayed Messages form has "Body" and "Delay" fields
- [ ] After clicking "Schedule", the message appears with SCHEDULED status and a progress bar
- [ ] After `delayMs` milliseconds, the status changes to DELIVERED and the actual delivery time is displayed
- [ ] The "Clear" button for each mode resets only its own state

## How to test yourself

**Priority Queue:** add 4 messages with priorities 10, 3, 8, 1. Click "Consume 1" — the message with priority 10 should be consumed. Click again — priority 8. Then click "Auto Consume" — the remaining 3 and 1 should be consumed automatically, then the button should deactivate.

**Delayed Messages:** schedule a message with a 2,000 ms delay. A progress bar should appear, decreasing every 200 ms. Exactly after 2 seconds, the status should change to DELIVERED and `deliveredAt` should be displayed.
