# Task 16.1: Consumer Lag Dashboard

## Goal

Implement an interactive dashboard for real-time **Consumer Lag** monitoring. The dashboard simulates message production and consumption, shows lag per partition and consumer group with color-coded status indicators.

## Requirements

1. Declare a `PartitionStats` interface with fields `partition: number`, `logEndOffset: number`, `committedOffset: number`, `lag: number`.
2. Declare a `ConsumerGroup` interface with fields `id: string`, `topic: string`, `partitions: PartitionStats[]`.
3. Implement a helper function `getLagColor(lag, threshold)` returning color `'#e53e3e'` (critical), `'#ed8936'` (growing) or `'#38a169'` (ok) based on lag value.
4. Implement a `getLagLabel(lag, threshold)` function returning string `'CRITICAL'`, `'GROWING'` or `'OK'`.
5. Set constant `THRESHOLDS = { yellow: 500, red: 2000 }` and initial data for two consumer groups: `orders-consumer` (topic `orders`, 3 partitions with small lag) and `analytics-consumer` (topic `events`, 3 partitions with varying lag, including CRITICAL).
6. Declare component states: `groups: ConsumerGroup[]` and `slowdown: boolean` (consumer slowdown mode).
7. Implement a `useEffect` with 1200ms interval that simulates log-end offset growth and committed offset changes. In `slowdown` mode, consumption speed drops sharply (consumer barely progresses).
8. Compute `totalLag` as the sum of lags of all partitions of all groups.
9. Render a slowdown mode toggle button with text "Consumer slowed down (incident simulation)" / "Consumer working normally" and a total lag summary.
10. Render a legend (OK / GROWING / CRITICAL) with color markers.
11. For each consumer group, render a card with a colored border (color depends on group's total lag), inside — a partition table with columns: Partition, Log-End Offset, Committed Offset, visual lag progress bar, status.
12. Progress bar should smoothly animate changes via CSS transition.

## Checklist

- [ ] `PartitionStats` and `ConsumerGroup` interfaces declared
- [ ] `getLagColor` returns correct color for each lag range
- [ ] `getLagLabel` returns `'OK'`, `'GROWING'` or `'CRITICAL'`
- [ ] `THRESHOLDS` constant and initial data for two groups declared
- [ ] `useEffect` simulates LEO growth and committed offset changes every 1200ms
- [ ] In `slowdown` mode, consumption is sharply slowed, lag starts growing
- [ ] Total lag displayed and updated in real time
- [ ] Button toggles slowdown mode and changes color/text
- [ ] Legend with three colors rendered
- [ ] Each group shows colored border and status badge
- [ ] Partition table contains all 4 columns
- [ ] Lag progress bar visually reflects the lag and changes color smoothly
- [ ] Interval cleared on `useEffect` cleanup (clearInterval)

## How to test yourself

1. Open the task — both consumer groups displayed, `orders-consumer` green (lag 2–5), `analytics-consumer` contains a red partition (lag ~2200).
2. Observe updates every 1.2 seconds: numbers change, progress bars animate.
3. Click "Consumer working normally" — it should switch to "Consumer slowed down". After a few seconds lag will grow, partitions turn orange, then red.
4. Total lag should grow rapidly during slowdown and display in red when > 8000.
5. Click the button again — consumer "speeds up", lag starts shrinking.
