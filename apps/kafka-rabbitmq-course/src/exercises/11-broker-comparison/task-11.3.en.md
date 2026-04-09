# Task 11.3: Decision Tree — Broker Selection

## Goal

Implement an interactive decision tree for selecting a message broker. The student will build a step-by-step wizard with "Yes/No" questions, leading to one of 6 broker recommendations based on answers. The task develops skills in designing state machines and understanding architectural trade-offs.

## Requirements

1. Define a `TreeNode` interface with fields: `id: string`, `question?: string`, `yes?: string`, `no?: string` (IDs of next nodes), `result?: string` (broker name, if terminal), `broker?: string`, `color?: string`, `explanation?: string`, `useCases?: string[]`.
2. Fill the `TREE_NODES: Record<string, TreeNode>` object with at least 10 nodes:
   - Starting `root` — question about guaranteed delivery
   - Question about replay/re-reading
   - Question about throughput > 500K msg/s
   - Question about tiered storage / geo-replication
   - Question about operational complexity
   - Question about complex routing / DLQ / RPC
   - Question about Redis presence in the stack
   - Question about latency < 1ms criticality
   - 6 terminal nodes with results: Kafka, Pulsar, Kafka (small), NATS JetStream, RabbitMQ, Redis Streams, NATS Core
3. Each terminal node should contain: `result` (name), `color`, `explanation` (why this choice, 2-3 sentences), `useCases` (array of 3-5 examples).
4. Implement states: `path: string[]` (history of visited nodes, starts with `['root']`), `answers: Record<string, boolean>` (answers to each question).
5. Implement an `answer(yes: boolean)` function: adds the next node to `path`, writes the answer to `answers`.
6. Implement a `back()` function: removes the last node from `path`, removes the answer for the second-to-last node.
7. Implement a `reset()` function: resets `path` to `['root']`, clears `answers`.
8. Render breadcrumbs: path of passed steps with answers (Yes/No in green/red). Current step — in white.
9. Render the current node:
   - If a question: step N of ~5, question text large, "Yes" (green) and "No" (red) buttons.
   - If a result: "Recommendation" header, broker name colored, explanation, list of use cases.
10. Navigation buttons: "Back" (if `path.length > 1`) and "Start Over" (if `path.length > 1`).
11. At the bottom — a static grid of all brokers with brief descriptions (5 cards).

## Checklist

- [ ] `TreeNode` interface is defined with all optional fields
- [ ] `TREE_NODES` contains at least 10 nodes (4+ questions + 6 results)
- [ ] Each result node has explanation and useCases
- [ ] `path` starts with `['root']`, correctly populates on answers
- [ ] `answers` records true/false for each passed question
- [ ] "Yes" (green) and "No" (red) buttons are displayed for questions
- [ ] Pressing "Yes"/"No" moves to the next node
- [ ] Breadcrumbs show the passed path with answers
- [ ] Terminal node: shows recommendation with explanation and use cases
- [ ] "Back" button correctly returns to the previous question
- [ ] "Start Over" resets to the first question
- [ ] 5-broker grid at the bottom is always displayed
- [ ] Current node border: colored for result, gray for question

## How to test yourself

1. On open, the question "Do you need guaranteed delivery?" should be visible. Click "No" — the NATS Core result should appear.
2. Click "Start Over". Click "Yes" → "Yes" (replay) → "Yes" (high throughput) → "Yes" (tiered storage) — the result should be Apache Pulsar.
3. Click "Back" — returns to the tiered storage question, the Yes answer is still visible in breadcrumbs.
4. Click "No" — the result is Apache Kafka.
5. Go through the path: Yes → Yes → No → No (no Kafka/Redis experience) → Yes (simple deploy) — the result is NATS JetStream.
6. Go through the path: Yes → No (no replay needed) → Yes (complex routing) — the result is RabbitMQ.
7. Verify that all results have an explanation and at least 3 use cases.
