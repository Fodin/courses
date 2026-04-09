# Task 9.1: Partitioning Strategies

## Goal

Implement an interactive visualization of Kafka partitioning strategies. The student will clearly see how round-robin, key-based, and custom partitioners distribute messages across partitions, and why the strategy choice affects delivery order and load balancing.

## Requirements

1. Define a `PartitionStrategy` type — a union type of three values: `'round-robin' | 'key-based' | 'custom'`.
2. Define a `KafkaMessage` interface with fields: `id: number`, `key: string | null`, `value: string`, `partition: number`, `strategy: PartitionStrategy`, `color: string`.
3. Implement three partitioning functions:
   - `getPartitionRoundRobin(msgId, total)` — returns `msgId % total`
   - `getPartitionByKey(key, total)` — hash function of the key: `hash = (hash * 31 + charCode) % total`, returns `0` when `key === null`
   - `getPartitionCustom(value, total)` — CRITICAL/HIGH → partition 0, ERROR/WARN → partition 1, rest → last partition
4. Create a `SAMPLE_MESSAGES` array of 10 messages with different keys and values, including CRITICAL, HIGH, ERROR, WARN labels and null keys.
5. Implement strategy switching buttons: on strategy change, reset the message list.
6. Implement a "Send N messages" button: compute the partition for each message according to the selected strategy and save the result in state.
7. Display three partition columns (Partition 0, 1, 2): each shows the messages that landed there with key and value. Border color and counter correspond to the partition.
8. Show a block with a text description of the current strategy.
9. After sending with key-based strategy: show a hint that identical keys always land in the same partition.

## Checklist

- [ ] `PartitionStrategy` type is declared as a union type of 3 values
- [ ] `KafkaMessage` interface contains all 6 fields
- [ ] `getPartitionRoundRobin` returns `msgId % total`
- [ ] `getPartitionByKey` correctly computes the hash and handles `null`
- [ ] `getPartitionCustom` routes by value content
- [ ] `SAMPLE_MESSAGES` array contains 10 messages with different keys
- [ ] On strategy change, the message list is reset
- [ ] The send button distributes all messages across partitions
- [ ] Three partitions are displayed visually with colored borders and counters
- [ ] Each message in a partition shows key and value
- [ ] Strategy description block updates on switch
- [ ] Key ordering hint appears only for key-based strategy

## How to test yourself

1. Select the "round-robin" strategy and click "Send". Verify that messages are distributed roughly evenly: ~3-4 per partition.
2. Switch to "key-based". Click "Send" twice — the result should be identical (determinism). Verify that user-101 always lands in the same partition.
3. Select "custom". Verify that messages with "CRITICAL" and "HIGH" go to Partition 0, "ERROR" and "WARN" — to Partition 1, the rest — to Partition 2.
4. After key-based sending, a hint about ordering guarantee for a single user should appear.
5. Changing the strategy should reset the partition columns.
