# Task 17.3: Architecture Selection — Case Study

## Goal

Implement an interactive trainer for message broker architecture selection. The user is presented with three real business scenarios (E-commerce, IoT, Fintech), and for each must choose the optimal broker and set of patterns. The component evaluates the answer on a 10-point scale and provides detailed feedback.

## Requirements

1. Declare a `Scenario` interface with fields: `id: string`, `title: string`, `description: string`, `requirements: string[]`, `constraints: string[]`, `scale: string`.
2. Declare an `ArchOption` interface with fields: `id: string`, `label: string`, `icon: string`, `description: string`.
3. Declare a `Pattern` interface with fields: `id: string`, `label: string`, `icon: string`, `description: string`.
4. Declare a `ScenarioAnswer` interface with fields: `broker: string`, `patterns: string[]`.
5. Declare an `EvaluationResult` interface with fields: `score: number`, `maxScore: number`, `feedback: string[]`, `verdict: 'excellent' | 'good' | 'partial' | 'poor'`.
6. Declare a `SCENARIOS` array of 3 scenarios:
   - **E-commerce platform** (id: `'ecommerce'`): 500 sellers, 100k users/day, requirements — guaranteed command delivery, historical log, multiple consumers, priority routing.
   - **IoT telemetry platform** (id: `'iot'`): 50k sensors × 1 msg/sec, requirements — 50k msg/sec throughput, data replay, partitioning by device_id, 30-day retention.
   - **Bank transfers** (id: `'fintech'`): 30k transfers/day, requirements — exactly-once, Saga with compensations, prioritization, DLQ.
7. Declare an `ARCH_OPTIONS` array of 4 broker options: Kafka only (`'kafka-only'`), RabbitMQ only (`'rabbitmq-only'`), Hybrid RabbitMQ + Kafka (`'hybrid'`), Apache Pulsar (`'pulsar'`).
8. Declare a `PATTERNS` array of 8 patterns: Saga, CQRS, Transactional Outbox, Dead Letter Queue, Event Sourcing, Priority Queue, Competing Consumers, Fan-out / Pub-Sub.
9. Declare a `ScoringRule` interface with fields `broker: string[]`, `patterns: string[]`, `reason: string`.
10. Declare a `SCORING: Record<string, ScoringRule>` dictionary with scoring rules for each scenario:
    - `ecommerce`: correct brokers — `['hybrid', 'kafka-only']`, patterns — `['saga', 'outbox', 'dlq', 'fanout', 'priority']`.
    - `iot`: correct brokers — `['kafka-only', 'pulsar']`, patterns — `['competing', 'fanout', 'event-source']`.
    - `fintech`: correct brokers — `['rabbitmq-only', 'hybrid']`, patterns — `['saga', 'dlq', 'outbox', 'priority', 'cqrs']`.
11. Implement an `evaluateAnswer(scenarioId, answer): EvaluationResult` function:
    - For correct broker: +4 points, for wrong — add to `feedback` a hint with correct options.
    - For each correct pattern: +2 points (max 6), list correct, extra, and missing.
    - Add to `feedback` a line with justification from `SCORING[scenarioId].reason`.
    - Verdict: `'excellent'` (≥9), `'good'` (≥7), `'partial'` (≥4), `'poor'` (<4).
12. Declare a `VERDICT_CONFIG` dictionary with `label`, `color`, `bg`, `border` for each verdict.
13. Declare states: `scenarioIdx: number`, `selectedBroker: string`, `selectedPatterns: string[]`, `result: EvaluationResult | null`.
14. Implement `handleScenarioChange(idx)`: changes scenario, resets broker, pattern, and result selection.
15. Implement `togglePattern(id)`: toggles a pattern in/out of `selectedPatterns`, resets `result`.
16. Implement `handleBrokerChange(id)`: sets `selectedBroker`, resets `result`.
17. Implement `handleEvaluate`: if `selectedBroker` and `selectedPatterns` are not empty — computes and sets `result`.
18. Implement `handleReset`: resets `selectedBroker`, `selectedPatterns`, `result`.
19. Render a scenario switcher (three tab buttons). Active scenario highlighted in blue.
20. Render a scenario card with header, description, two columns (Requirements and Constraints), and a scale badge.
21. Render the broker selection section: 4 card-buttons with icon, name, and description. Selected card highlighted with blue border and light blue background.
22. Render the pattern selection section: 8 card-buttons. Selected ones marked with a checkmark, highlighted with green border.
23. Add "Evaluate Architecture" button (disabled until broker and at least one pattern selected) and "Reset".
24. Render the result block: final score (score / maxScore), verdict with colored background, list of feedback lines (each line as a separate paragraph).

## Checklist

- [ ] Interfaces `Scenario`, `ArchOption`, `Pattern`, `ScenarioAnswer`, `EvaluationResult` declared
- [ ] `SCENARIOS` array contains 3 scenarios with `requirements`, `constraints`, `scale` fields
- [ ] `ARCH_OPTIONS` array contains 4 broker options
- [ ] `PATTERNS` array contains 8 patterns with `id`, `label`, `icon`, `description`
- [ ] `ScoringRule` interface declared
- [ ] `SCORING` dictionary set for `ecommerce`, `iot`, `fintech` with correct brokers and patterns
- [ ] `evaluateAnswer` gives 4 points for broker and up to 6 for patterns
- [ ] `feedback` lists correct, extra, and missing patterns
- [ ] `feedback` includes `reason` line from `SCORING`
- [ ] Verdict assigned by four thresholds (9 / 7 / 4)
- [ ] `VERDICT_CONFIG` set for all 4 verdicts
- [ ] States `scenarioIdx`, `selectedBroker`, `selectedPatterns`, `result` declared
- [ ] `handleScenarioChange` resets selection on scenario switch
- [ ] `togglePattern` correctly adds and removes patterns
- [ ] `handleEvaluate` doesn't evaluate when broker or patterns are empty
- [ ] Scenario switcher: active highlighted in blue
- [ ] Scenario card shows requirements and constraints in two columns
- [ ] Broker cards: selected one highlighted with border and background
- [ ] Pattern cards: selected ones marked with checkmark
- [ ] "Evaluate" button disabled when selection is incomplete
- [ ] Result block shows score, verdict, and feedback list

## How to test yourself

1. Open the task — first scenario (E-commerce) active, broker and pattern buttons unselected.
2. "Evaluate Architecture" button is disabled — can't click.
3. Select "Kafka only" broker and Saga, Fan-out / Pub-Sub patterns. Click "Evaluate". Result appears: 4 points for broker ("kafka-only" is in correct ones), 4 points for patterns (2 correct × 2). Verdict — Good or Partial.
4. Click "Reset". Select "Hybrid (RabbitMQ + Kafka)" and patterns Saga, Transactional Outbox, DLQ, Fan-out, Priority Queue. Click "Evaluate" — verdict Excellent, 10/10. Feedback lists all correct patterns and justification.
5. Switch to "IoT" scenario. Select "RabbitMQ only" — component writes that the broker is not optimal. Select "Kafka only" + Competing Consumers, Fan-out, Event Sourcing — verdict Excellent.
6. Switch to "Fintech". Select "RabbitMQ only" + Saga, DLQ, Transactional Outbox, Priority Queue, CQRS — verdict Excellent.
