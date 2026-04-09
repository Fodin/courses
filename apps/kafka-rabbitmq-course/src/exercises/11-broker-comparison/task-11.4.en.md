# Task 11.4: Benchmark Dashboard

## Goal

Implement an interactive dashboard with benchmark data for five brokers. The student will create bar-chart visualizations of throughput and latency across different testing scenarios, as well as a chart showing the impact of message size on performance. The task reinforces understanding of broker performance characteristics.

## Requirements

1. Define a `BenchScenario` interface with fields: `id: string`, `name: string`, `description: string`.
2. Define a `BrokerBenchmark` interface with fields: `broker: string`, `color: string`, `throughput: Record<string, number>`, `p99Latency: Record<string, number>`, `msgSizeImpact: { size: string; throughput: number; latency: number }[]`.
3. Fill the `BENCH_SCENARIOS` array of 4 scenarios: "Small + Persistent" (1KB, 3x replication, fsync), "Small + Fast" (1KB, in-memory), "Large + Persistent" (100KB, 3x replication), "Fan-out 10 consumers".
4. Fill the `BENCH_DATA` array of 5 objects (one per broker). For each broker — throughput and p99Latency values for all 4 scenarios, and a `msgSizeImpact` array of 5 points (100B, 1KB, 10KB, 100KB, 1MB).
5. Implement a helper function `formatNum(n: number): string` — formats a number: `≥ 1M → "1.2M"`, `≥ 1K → "500K"`, otherwise the number as string.
6. Define a `BenchView = 'throughput' | 'latency' | 'msgsize'` type.
7. Implement states: `scenario: string` (selected scenario, initially `'small_persist'`), `view: BenchView` (initially `'throughput'`), `selectedBrokers: Set<string>` (all 5 selected by default), `msgSizeBroker: string` (initially `'Apache Kafka'`).
8. Implement a `toggleBroker` function: adds/removes a broker from `selectedBrokers`. Cannot uncheck if it's the last selected one.
9. Compute `visibleData` — only selected brokers. `maxThroughput` and `maxLatency` for bar normalization.
10. Render a filter panel: buttons for each broker (dimmed `opacity: 0.4` if not selected, colored underline if selected).
11. Render tabs: Throughput, P99 Latency, Msg Size Impact.
12. For Throughput/Latency tabs: scenario buttons, scenario description block, bar chart. In the bar: for throughput — bigger is better (green if > 60%). For latency — smaller is better (red if > 60% of max). Bar width animation `transition: 'width 0.4s ease'`.
13. For Msg Size Impact tab: broker switch, bar chart for throughput by message sizes (100B → 1MB), throughput and latency values alongside.
14. A note block about benchmark methodology (data sources, what affects results).

## Checklist

- [ ] `BenchScenario` and `BrokerBenchmark` interfaces are defined
- [ ] `BENCH_SCENARIOS` contains 4 scenarios with descriptions
- [ ] `BENCH_DATA` contains data for all 5 brokers
- [ ] Each broker has `msgSizeImpact` with 5 points
- [ ] `formatNum` correctly formats 2000000 → "2.0M", 500000 → "500K"
- [ ] `selectedBrokers` toggle works, cannot uncheck the last one
- [ ] Broker filters: dimmed inactive, colored underline for active
- [ ] Throughput tab: bar chart updates on scenario change
- [ ] Latency tab: bar is red for high values
- [ ] Bar animates on scenario switch
- [ ] Scenario description is displayed below scenario buttons
- [ ] Msg Size Impact tab: bar chart for the selected broker across 5 sizes
- [ ] Methodology block is present at the bottom
- [ ] On view='msgsize' switch, scenario buttons are hidden

## How to test yourself

1. On open, Throughput tab is selected, "Small + Persistent" scenario. Kafka should have the longest bar (800K msg/s).
2. Click the "Small + Fast" scenario — NATS should be the clear leader (8M msg/s).
3. Switch to "P99 Latency" tab — Redis Streams and NATS should show small values (green bars), RabbitMQ — slightly higher.
4. Uncheck "RabbitMQ" — its bar disappears, maximum is recalculated.
5. Try to uncheck all brokers — the last broker should not uncheck.
6. Switch to "Msg Size Impact". Select "NATS". The 100B bar should be the maximum, 1MB — the minimum.
7. Switch to Apache Kafka in Msg Size Impact — compare the throughput drop with size increase.
8. Verify the methodology note block is displayed at the bottom.
