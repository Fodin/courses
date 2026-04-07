# Task 5.2: Message Queue Visualizer

## Objective

Build an interactive visualizer that demonstrates how a message queue works: producer and consumer rates, queue depth, backpressure, DLQ, and delivery modes.

## Requirements

1. Implement parameter settings via buttons/sliders:
   - **Producer rate** — how many messages per second are generated (1, 5, 10, 20)
   - **Consumer rate** — how many messages per second are processed (1, 5, 10, 20)
   - **Consumer count** — number of consumers (1, 2, 3, 5)
   - **Error rate** — processing error percentage (0%, 10%, 30%, 50%)
2. Visualize the system state:
   - Queue depth (progress bar with message count)
   - Number of processed messages
   - Number of messages in DLQ (on errors — after 3 retries)
   - Status: normal / backpressure / overload
3. Implement delivery mode switching:
   - **At-most-once** — message may be lost on error
   - **At-least-once** — message retries on error (may duplicate)
4. Automatic simulation via setInterval (Start/Stop/Reset buttons)
5. Show a log of recent events (produced, consumed, error, DLQ)

## Checklist

- [ ] Configurable producer rate (buttons)
- [ ] Configurable consumer rate and count
- [ ] Configurable error rate
- [ ] Queue depth visualization (progress bar + number)
- [ ] Processed message counter
- [ ] DLQ on errors (after 3 retries)
- [ ] At-most-once / at-least-once switching
- [ ] Backpressure indicator on overflow
- [ ] Start / Stop / Reset buttons
- [ ] Recent events log

## How to Check Yourself

1. Producer rate > consumer rate * count — queue grows, backpressure
2. Producer rate < consumer rate * count — queue empties
3. Error rate > 0 with at-least-once — messages retry, some go to DLQ
4. Error rate > 0 with at-most-once — messages are lost (no DLQ)
5. Reset clears all counters and the queue
