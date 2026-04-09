# Task 9.3: Offset Management

## Goal

Implement an interactive Kafka offset management simulator. The student will see the difference between current offset and committed offset in practice, understand consumer lag and gap concepts, and observe what happens to unprocessed messages on a consumer crash.

## Requirements

1. Define a `PartitionOffsets` interface with fields: `id: number`, `logEndOffset: number`, `currentOffset: number`, `committedOffset: number`.
2. Initial state: 3 partitions with different offset values (e.g., P0: log=20, current=15, committed=12; P1: log=18, current=18, committed=18; P2: log=25, current=22, committed=20).
3. Implement a `produce(partitionId)` function: increases `logEndOffset` by 1 for the given partition. Adds a log entry.
4. Implement a `consume(partitionId)` function: increases `currentOffset` by 1 only if `currentOffset < logEndOffset`. Adds a log entry.
5. Implement a `commit(partitionId)` function: sets `committedOffset = currentOffset`. Adds a log entry with "__consumer_offsets" notation.
6. Implement a `commitAll()` function: for all partitions, sets `committedOffset = currentOffset`. Adds a log entry.
7. Implement a `crash()` function:
   - sets `crashed = true`
   - adds "[CRASH] Consumer crashed! current offset lost..." to the log
   - after 1500ms, resets `currentOffset = committedOffset` for all partitions (simulates restart from committed offset)
   - adds "[RESTART] Consumer restarted — reading from committed offset"
   - sets `crashed = false`
8. Display a legend explaining four colors: current offset (blue), committed offset (green), log-end offset (orange), gap (pink).
9. For each partition display: a progress bar with three zones (committed — green, current>committed — pink gap, remaining — dark), text values of all three offsets, computed `lag = logEndOffset - currentOffset` and `gap = currentOffset - committedOffset`.
10. Buttons for each partition: Produce, Consume (disabled if currentOffset >= logEndOffset), Commit (disabled if already committed).
11. "Crash consumer" button is disabled during crash (shows "Restarting...").
12. Display a log of the last 15 events with color coding: CRASH — pink, RESTART — green, Committed — blue, rest — gray.

## Checklist

- [ ] `PartitionOffsets` interface contains all 4 fields
- [ ] Initial state sets different offset values for 3 partitions
- [ ] `produce` increases `logEndOffset` and writes to log
- [ ] `consume` increases `currentOffset` only when there are new messages
- [ ] `commit` saves `currentOffset` as `committedOffset` and writes to log
- [ ] `commitAll` commits all partitions in one action
- [ ] `crash` resets `currentOffset` to `committedOffset` after 1500ms
- [ ] During crash, all buttons are disabled
- [ ] Progress bar shows three zones: committed, gap, lag
- [ ] `lag` and `gap` are computed and displayed for each partition
- [ ] Commit button is disabled if committedOffset === currentOffset
- [ ] Event log with color coding by type

## How to test yourself

1. Click "Consume" several times for P0, then "Crash consumer". Verify that after 1.5 seconds `currentOffset` returned to `committedOffset` — this gap will be re-read.
2. Click "Commit" for P0, then "Crash consumer". Now gap = 0, messages won't be re-read — at-least-once vs at-most-once.
3. Click "Produce" for any partition — `logEndOffset` should increase by 1, `lag` should increase.
4. Click "Consume" to the end (button will be disabled) — `lag` should become 0.
5. Click "Commit all" — gap for all partitions should become 0, Commit buttons should be disabled.
6. Check the progress bar: green zone = committed, pink = gap, dark = lag.
