# Task 9.2: Consumer Groups

## Goal

Implement an interactive Consumer Group simulator in Kafka. The student will see how partitions are automatically redistributed when consumers are added and removed, understand the "one consumer per partition" limit, and the phenomenon of idle consumers when the consumer count exceeds partitions.

## Requirements

1. Define a `Consumer` interface with fields: `id: string`, `partitions: number[]`, `status: 'active' | 'rebalancing' | 'joining'`, `processed: number`.
2. Implement an `assignPartitions(consumers, totalPartitions)` function — distributes partitions among consumers using round-robin: partition `p` is assigned to `consumers[p % consumers.length]`.
3. Set a constant `TOTAL_PARTITIONS = 6`. Initial state: 3 consumers with even partition distribution (0,1 → consumer-1; 2,3 → consumer-2; 4,5 → consumer-3).
4. Implement an `addConsumer()` function:
   - maximum 6 consumers
   - new consumer gets `status: 'joining'` and an empty partition list
   - set `rebalancing = true` for 1200ms
   - after 1200ms call `assignPartitions` and update state
   - add entries to the log with a timestamp
5. Implement a `removeConsumer(id)` function:
   - minimum 1 consumer
   - trigger rebalancing similar to adding
   - remove the consumer and redistribute partitions among the remaining ones
6. Implement a `simulateMessages()` function: each consumer gets `partitions.length * random(3..7)` added to the `processed` counter.
7. Display a status panel: group name "orders-processor", number of partitions and consumers. If consumers > partitions — show a warning "(N idle — more consumers than partitions)".
8. During rebalancing, show a warning banner "Rebalancing in progress... (all consumers temporarily paused)".
9. Display 6 colored partition squares: the square color corresponds to the owner consumer's color.
10. Display the consumer list: color, id, assigned partitions, processed counter, delete button. Idle consumers show "no partitions (idle)".
11. Display a log of the last 10 events (add, remove, rebalancing, message sending).

## Checklist

- [ ] `Consumer` interface contains all 4 fields
- [ ] `assignPartitions` implements round-robin distribution
- [ ] Initial state: 3 consumers, 6 partitions, even distribution
- [ ] `addConsumer` creates a consumer with `status: 'joining'` and starts rebalancing
- [ ] `removeConsumer` filters the list and starts rebalancing
- [ ] Rebalancing blocks buttons for 1200ms and shows a banner
- [ ] After rebalancing, partitions are correctly redistributed
- [ ] `simulateMessages` increases `processed` proportionally to the number of partitions
- [ ] When consumers > partitions, an idle warning is displayed
- [ ] 6 partition squares show the owner's color or gray (no owner)
- [ ] Consumer list shows assigned partitions as colored badges
- [ ] Event log updates on each action with a timestamp

## How to test yourself

1. Click "Send Messages" several times — the `processed` counter should grow for all consumers proportionally to their partition count.
2. Add a 4th consumer — rebalancing should start (1.2 seconds), after which partitions are redistributed (e.g., 2+2+1+1 or similar).
3. Try to add a 7th consumer (button should be disabled) — verify it cannot be added (max 6).
4. Add consumers up to 6 — the 6th consumer should show "no partitions (idle)" status and a warning that there are more consumers than partitions.
5. Remove a consumer — the remaining ones should receive its partitions.
6. Check the log: each action is displayed with a timestamp.
