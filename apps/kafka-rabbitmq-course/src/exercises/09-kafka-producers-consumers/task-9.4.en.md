# Task 9.4: Consumer Rebalancing

## Goal

Implement an interactive Consumer Rebalancing strategy simulator. The student will visually compare Eager and Cooperative Sticky approaches, understand the difference in step count, presence of stop-the-world pause, and the impact on system performance.

## Requirements

1. Define a `RebalanceStrategy` type — union type: `'eager' | 'cooperative'`.
2. Define a `RebalanceEvent` interface with fields: `time: number`, `label: string`, `type: 'join' | 'leave' | 'stop' | 'resume' | 'assign' | 'revoke' | 'sync'`, `consumer?: string`.
3. Implement a `buildEagerTimeline(action, consumerName)` function — returns an array of events for the Eager strategy:
   - t=0: consumer join/leave
   - t=100: ALL consumers stop consuming (stop-the-world)
   - t=200: Coordinator revokes ALL partitions (revoke all)
   - t=400: Group Leader computes new distribution (sync)
   - t=600: all consumers receive new partitions (assign)
   - t=700: all consumers resume consuming (resume)
4. Implement a `buildCooperativeTimeline(action, consumerName)` function — returns an array for Cooperative Sticky:
   - On join (5 events): connection → Round 1 revoke only needed partitions → others continue → Round 2 assign to new one → fully operational
   - On leave (5 events): graceful shutdown → voluntary partition release → Round 1 redistribute without stopping → others were not interrupted → shutdown complete
5. Define an `EVENT_COLORS` dictionary for each event type: join — green, leave — pink, stop — red, resume — blue, assign — green, revoke — orange, sync — purple.
6. Implement a `runSimulation()` function:
   - selects a consumer name: on join — "consumer-4", on leave — "consumer-2"
   - builds a timeline using the current strategy
   - sets `playing = true`
   - reveals events one by one at 700ms intervals via `setTimeout`
   - on completion, clears `playing`
7. Display strategy selection cards (2 columns): description, advantages, "Stop-the-world" label for Eager and "Incremental" for Cooperative. Clicking a card changes the strategy and resets the timeline.
8. Display action selection buttons: "Consumer Join" and "Consumer Leave".
9. "Run Simulation" / "Simulating..." button (disabled during animation).
10. Display the timeline as a vertical track with a circle marker (color by event type) and an event card: type in uppercase, label, time t+Nms.
11. After simulation completes, show a summary block: for Eager — red background with pause time (~600-700ms), for Cooperative — green background mentioning CooperativeStickyAssignor (Kafka 2.4+).

## Checklist

- [ ] `RebalanceStrategy` type is declared as a union type of 2 values
- [ ] `RebalanceEvent` interface contains all 4 fields including optional `consumer`
- [ ] `buildEagerTimeline` returns 6 events with timestamps 0-700
- [ ] `buildCooperativeTimeline` returns 5 events for join and 5 for leave
- [ ] `EVENT_COLORS` dictionary contains colors for all 7 event types
- [ ] `runSimulation` builds a timeline, animates at 700ms intervals
- [ ] Strategy change resets the timeline and visibleCount
- [ ] Strategy cards contain descriptions and Stop-the-world / Incremental labels
- [ ] Join/Leave buttons toggle the action type
- [ ] Simulation button is disabled during playback
- [ ] Events reveal one by one with correct colors and timestamps
- [ ] Summary block appears after completion with correct color

## How to test yourself

1. Select "Eager Rebalancing" and run the Consumer Join simulation. Verify that the "ALL consumers stop consuming" step is present — this is the stop-the-world.
2. Switch to "Cooperative Sticky" with the same action. Find the step "other consumers CONTINUE working" — this is what distinguishes incremental rebalancing.
3. Check the Leave scenario for both strategies. In Cooperative, there should be a "graceful shutdown" step — only possible with proper process termination.
4. Count the steps: Eager — 6, Cooperative — 5. Cooperative requires 2 round-trips but without a full pause.
5. Wait for the summary block: for Eager — red with pause time, for Cooperative — green with recommendation.
6. Run the simulation again — the animation should start from the beginning.
