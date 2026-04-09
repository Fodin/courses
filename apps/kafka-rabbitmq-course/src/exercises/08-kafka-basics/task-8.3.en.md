# Task 8.3: Topics and Partitions

## Goal

Implement an interactive demo of Kafka message partitioning: creating topics, sending messages with keys, and visualizing how the key determines the partition via a hash function.

## Requirements

1. Define `TopicConfig` and `Message83` types:
   - `TopicConfig`: `name`, `partitions`, `replicationFactor`, `color`, `bgColor`
   - `Message83`: `id`, `key`, `value`, `partition`, `offset`, `color`

2. Initialize two topics: `orders` (3 partitions, RF=2) and `payments` (2 partitions, RF=2).

3. Implement a `hashKey(key: string, partitions: number): number` function:
   - Computes a string hash (Murmur2-like algorithm: for each character `hash = ((hash << 5) - hash + charCodeAt) | 0`)
   - Returns `Math.abs(hash) % partitions`
   - The same key always lands in the same partition

4. Implement a statistics panel (three cards):
   - "Topics" — total number of topics
   - "Total partitions" — sum of partitions across all topics
   - "Messages" — total number of sent messages

5. Implement topic switching via pill buttons:
   - Active topic is highlighted with background color and bold font
   - Shows the name and partition count: `orders (3p)`

6. Implement a new topic creation form:
   - Name input field, select for partition count (options: 1, 2, 3, 4, 6, 8)
   - "Create Topic" button adds a topic to the list and switches to it
   - Button is disabled (gray) if the name is empty or already exists

7. Implement partition visualization for the selected topic:
   - Header: "Topic: <name> — N partitions, replication factor: RF"
   - Horizontal row of columns (one per partition)
   - Each column: header "Partition N (X msg)" + list of message cards
   - Empty partition shows "No messages" text
   - Each message card shows `offset=N`, `key`, `value` (with truncation)

8. Implement a message sending form:
   - Fields: `key` (affects partition), `value`
   - "Send" button
   - `sendMessage` function: computes the partition via `hashKey`, determines offset as the count of existing messages in that partition, adds the message
   - Adds two lines to the log:
     ```
     [SEND] topic=orders key="user-1" → partition=2 offset=0
       hash("user-1") % 3 = 2
     ```

9. Implement a send log (dark terminal):
   - Stores up to 16 most recent entries
   - "Clear" button resets the log

## Checklist

- [ ] Two initial topics (`orders`, `payments`) are displayed as pill buttons
- [ ] Statistics (topics / partitions / messages) update when adding topics and messages
- [ ] The topic creation form adds a new topic with the selected partition count
- [ ] Sending messages with the same key always lands in the same partition
- [ ] The log shows the hash result: `hash("user-1") % 3 = 2`
- [ ] Each partition displays its own offset (starting from 0 per partition)
- [ ] Switching between topics shows partitions of the selected topic

## How to test yourself

1. Send several messages with key `user-1` to topic `orders` — they should all land in the same partition.
2. Send a message with a different key (e.g. `order-999`) — it should land in a different partition.
3. Create a new topic `events` with 4 partitions — the "Total partitions" counter should increase, and a new topic with four empty columns should appear.
