# Task 6.2: Consumer Prefetch — load balancing

## Goal

Visualize the impact of `prefetchCount` on message distribution between consumers with different processing speeds. Observe how prefetch changes system behavior.

## Requirements

1. Add a `prefetchCount` slider (1–10) with a mode description
2. Display two consumers with different speeds: fast (300ms/msg) and slow (1200ms/msg)
3. Run a simulation with 20 messages and visualize the distribution
4. Message queue: 20 cells, each changes color when assigned to a consumer
5. Display for each consumer:
   - In-flight buffer (N filled / empty squares)
   - Number of processed messages
   - Current load (in-flight / prefetch)
6. Event log: `[Xms] msg-N → Consumer-Y (in-flight: K/prefetch)`
7. After simulation ends — a completion message

## Checklist

- [ ] Prefetch slider changes simulation behavior
- [ ] With prefetch=1 messages are distributed evenly (round-robin)
- [ ] With prefetch=5+ the fast consumer gets more messages
- [ ] Each consumer's buffer correctly shows fill level
- [ ] Cell colors in the queue match consumer colors
- [ ] Log updates during the simulation
- [ ] "Run" and "Reset" buttons work correctly

## How to test yourself

**Experiment 1 — prefetch=1**:
- Messages should alternate between consumers almost evenly
- The slow consumer gets approximately as many messages as the fast one

**Experiment 2 — prefetch=5**:
- The fast consumer frees slots and gets new messages
- The slow consumer accumulates messages in the buffer and gets no new ones

**Observation**: with high prefetch, the slow consumer "blocks" messages in its buffer even though it cannot process them in time. This is called "slow consumer accumulation".

## Hints

- Store simulation state in ref to avoid stale closures in setInterval
- Use `clearInterval` in the useEffect cleanup function to stop the simulation
- Buffer visualization: `Array.from({ length: prefetchCount })` — array of slots
- Consumer colors: fast `#42a5f5`, slow `#ef9a9a`
