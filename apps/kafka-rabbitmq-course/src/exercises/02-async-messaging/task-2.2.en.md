# Task 2.2: Point-to-Point Queue — Simulator

## Goal

Implement an interactive Point-to-Point queue simulator with Competing Consumers support. The user should see how messages from producers go into a shared queue and are picked up by multiple consumers — each message going to exactly one consumer.

---

## Requirements

1. Display the message queue with the current count of pending messages
2. Implement a "Send Message" button for manually adding messages to the queue
3. Implement "Auto-Flow" mode — automatic message publishing every 800ms. The button toggles on/off
4. Display at least 2 consumers with states "free" / "busy"
5. A free consumer automatically takes the first message from the queue and processes it for ~1500ms
6. When a consumer is busy, it does NOT take new messages — messages accumulate in the queue
7. Add "+ Consumer" and "- Consumer" buttons for dynamically changing the number of consumers (max 4, min 1)
8. Cannot remove a consumer that is currently busy
9. Display an event log as a console with timestamps: who sent, who picked up, who completed
10. Show a "Processed" counter for each consumer
11. No message should go to two consumers simultaneously

---

## Checklist

- [ ] Messages array in state with fields `id`, `text`, `status: 'in-queue' | 'processing' | 'done'`, `consumerId`
- [ ] Consumers array in state with fields `id`, `name`, `busy`, `processedCount`
- [ ] Polling mechanism (setInterval) for assigning messages to free consumers
- [ ] On message assignment: consumer.busy = true, message.status = 'processing'
- [ ] After processing timer: consumer.busy = false, processedCount++, message removed from queue
- [ ] Auto-produce mode managed via ref and clearInterval for proper cleanup
- [ ] Log updates on each event: sending, assignment, completion
- [ ] Queue message count visible in real time
- [ ] When a new consumer is added, it starts processing the queue immediately
- [ ] Component correctly cleans up all intervals on unmount (useEffect cleanup)

---

## How to Check Yourself

1. Press "+ Send Message" 5 times — all 5 should appear in the queue
2. The first 2 messages (matching free consumers) should immediately go to processing
3. The remaining 3 wait in the queue until consumers become free
4. Enable "Auto-Flow" and observe queue buildup with 2 consumers
5. Press "+ Consumer" — the queue should be processed faster
6. Press "- Consumer" on a busy consumer — nothing should happen
7. The log should show lines like:
   ```
   [10:23:15] Producer -> Queue: "Order #5"
   [10:23:15] Consumer A <- Queue: "Order #5"
   [10:23:16] Consumer A DONE: "Order #5"
   ```

### Expected Result

```
Queue: [Order #3] [Order #4] [Order #5]  (3 waiting)
Consumer A: [processing Order #1] — busy
Consumer B: [processing Order #2] — busy
```