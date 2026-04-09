# Task 11.1: Architectural Broker Comparison

## Goal

Implement an interactive comparison table of five message brokers (Kafka, RabbitMQ, NATS, Redis Streams, Pulsar) with detailed descriptions for each criterion. The student should independently gather data about each broker and build a component with hover effects and expandable details.

## Requirements

1. Define a `BrokerRow` interface with fields: `broker: string`, `model: string`, `ordering: string`, `throughput: string`, `latency: string`, `persistence: string`, `protocol: string`, `clustering: string`, `color: string`, and a nested `details` object with the same keys from `model` to `clustering` — for expanded explanations.
2. Fill the `BROKERS` array of 5 elements (Kafka, RabbitMQ, NATS, Redis Streams, Pulsar) with a brief value for each criterion (e.g., `throughput: '★★★★★'`) and detailed text in `details`.
3. Declare a `CRITERIA` constant — a tuple of 7 strings (`'model' | 'ordering' | 'throughput' | 'latency' | 'persistence' | 'protocol' | 'clustering'`) and a `CRITERION_LABELS` dictionary for English labels.
4. Implement states: `detailBroker: string | null` (which broker is expanded), `detailCriterion: Criterion | null` (which criterion is selected), `highlightBroker: string | null` (hover).
5. Render the table: rows — brokers, columns — criteria. On hover, the row is highlighted.
6. Click on a broker name — expands/collapses the detail block (arrow ▼/▲).
7. Click on a criterion cell — opens a detail block for that broker focused on the selected criterion.
8. Detail block: when a criterion is selected, shows only its description; without a criterion — a grid of all 7 criteria with preview text (first 80 characters). Click on a criterion badge — focuses on it.
9. "Close" button resets `detailBroker` and `detailCriterion`.
10. At the bottom — a legend with colored broker names and a counter "5 brokers · 7 criteria".

## Checklist

- [ ] `BrokerRow` interface is defined with all fields including `details`
- [ ] `BROKERS` array contains all 5 brokers with brief values and descriptions
- [ ] `CRITERIA` is a tuple of 7 values, `CRITERION_LABELS` has English labels
- [ ] Hover on a row highlights it with background
- [ ] Click on a broker name expands/collapses the detail block
- [ ] Arrow ▼/▲ is displayed next to the broker name
- [ ] Click on a cell opens the detail block focused on the criterion
- [ ] Detail block shows the full description of the selected criterion
- [ ] Without a selected criterion — a grid of all 7 criteria previews
- [ ] Detail block border color matches the broker's color
- [ ] "Close" button resets both states
- [ ] Legend at the bottom with all broker names and counter

## How to test yourself

1. Open the task and verify the table displays 5 rows (brokers) and 7 columns (criteria).
2. Hover over "Apache Kafka" — the row background should change.
3. Click "Apache Kafka" — a detail block with red border (#e74c3c) should appear. Arrow ▲ next to the name.
4. Click the "Throughput" cell in the Kafka row — the block should show detailed throughput description for Kafka.
5. Click "Close" — the block disappears, arrow returns to ▼.
6. Click the "Latency" cell for RabbitMQ directly — the block should open for RabbitMQ with latency description.
7. Verify that with no criterion selected, 7 badges with text previews (~80 characters) are visible.
