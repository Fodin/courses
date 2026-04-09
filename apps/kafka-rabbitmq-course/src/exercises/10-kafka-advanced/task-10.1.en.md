# Task 10.1: Kafka Streams — Topology

## Goal

Implement an interactive Kafka Streams topology visualizer. The student will understand how a streaming processing pipeline is built from Source → Filter → Map → GroupBy → Aggregate → Sink operators, what happens to data at each stage, and why operator order matters.

## Requirements

1. Define a `NodeType` type — a union type of six values: `'source' | 'filter' | 'map' | 'groupby' | 'aggregate' | 'sink'`.
2. Define a `TopologyNode` interface with fields: `id: string`, `type: NodeType`, `label: string`, `config: Record<string, string>`, `description: string`.
3. Define a `Message` interface with fields: `key: string`, `value: string`, `passed: boolean`.
4. Create a `TOPOLOGY_NODES` array of six topology nodes:
   - **Source** — reads events from `orders` topic, parameters: `bootstrap`, `auto.offset.reset`
   - **Filter** — passes orders with `amount > 100`, parameter `null.handling: skip`
   - **Map / Transform** — changes key to `userId`, enriches with user data, specifies `schema.registry`
   - **GroupBy** — redistributes by `userId`, creates a repartition topic with 12 partitions
   - **Aggregate** — Tumbling window 1 hour, RocksDB state store, changelog topic for fault tolerance
   - **Sink** — writes results to `user-order-stats` topic, `acks: all`, `replication.factor: 3`
5. Create a `NODE_COLORS` dictionary — a unique color for each of the six node types.
6. Create a `SAMPLE_MESSAGES` array of 5 messages with `key`, `value`, `passed` fields. Three messages should pass the filter (`passed: true`, `amount > 100`), two should not.
7. Implement states: `selectedNode`, `step` (current simulation step), `processedMessages`.
8. Implement a `simulateStep` function: moves to the next node. On reaching the `filter` node — filters `SAMPLE_MESSAGES` by `passed: true` and saves to `processedMessages`. On step 0 (Source) — fills `processedMessages` with all messages.
9. Implement a `reset` function: resets all states to initial values.
10. Display the list of topology nodes vertically. Active nodes (already passed steps) are highlighted with colors from `NODE_COLORS`. Between nodes — a vertical arrow separator.
11. On clicking a node — show a detail panel with the `description` field and all `config` pairs.
12. After passing the Filter — display the list of messages that passed the filter.
13. Buttons: "Next Step (N/6)" and "Reset".
14. Info block at the bottom: explains how to read the topology, the role of GroupBy repartition and the need for state store for Aggregate.

## Checklist

- [ ] `NodeType` type is declared as a union of 6 values
- [ ] `TopologyNode` interface contains all 5 fields
- [ ] `Message` interface contains `key`, `value`, `passed`
- [ ] `TOPOLOGY_NODES` array contains exactly 6 nodes in the correct order
- [ ] Each node has `config` and `description` filled
- [ ] `NODE_COLORS` contains a color for each of the 6 types
- [ ] `SAMPLE_MESSAGES` contains 5 messages, of which 3 pass the filter
- [ ] `simulateStep` correctly filters messages on the Filter step
- [ ] `reset` resets `step`, `processedMessages` and `selectedNode`
- [ ] Nodes are displayed vertically with separators
- [ ] Active nodes are highlighted with color, inactive — gray
- [ ] Clicking a node opens a panel with `description` and `config`
- [ ] After the Filter step, the list of passed messages with key and value is visible
- [ ] "Next Step" button is disabled when `step >= 6`

## How to test yourself

1. Click "Next Step" once — the Source node should become active (colored). Messages in the panel — all 5.
2. Click again — Filter activates. The message list should shrink to 3 (only `amount > 100`).
3. Click the "Aggregate" node — a panel with RocksDB and Tumbling window description should open, along with `window.type`, `window.size`, `state.store`, `changelog.topic` configuration.
4. Click "Next Step" to the end (6/6). The button should become inactive. All nodes are colored.
5. Click "Reset" — the topology returns to initial state: all nodes gray, no messages, step 0/6.
