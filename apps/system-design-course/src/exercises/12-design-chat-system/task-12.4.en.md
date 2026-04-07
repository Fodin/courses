# Task 12.4: Full Messenger Design

## Goal

Design a messenger (WhatsApp-like) from start to finish — like a real System Design interview. Go through all stages: requirements, communication protocol, delivery statuses, presence, storage, groups, media, scaling.

## Requirements

1. **Requirements** — formulate functional and non-functional requirements
2. **Protocol** — justify the WebSocket choice, describe WS Gateway architecture
3. **Message Delivery** — design a delivery protocol with three statuses
4. **Presence** — design a heartbeat mechanism and subscription model
5. **Group Chats** — describe fan-out strategy and justify the choice
6. **Storage** — data model, sharding, indexes, sync
7. **Media** — media upload via pre-signed URL
8. **Architecture** — system components and their relationships

## Checklist

### Requirements
- [ ] 5+ functional requirements listed (1-to-1, groups, statuses, presence, media, offline, sync)
- [ ] 3+ non-functional requirements listed (latency, scale, reliability, ordering)
- [ ] Scale characteristics defined (number of users, messages/day)

### WebSocket & Connection Management
- [ ] Justified: why WebSocket, not HTTP polling / Long Polling / SSE
- [ ] WS Gateway — a separate stateful service for holding connections
- [ ] Redis for userId → gatewayId mapping
- [ ] L4 Load Balancer with sticky sessions for WebSocket

### Message Delivery
- [ ] Three statuses: SENT (✓), DELIVERED (✓✓), READ (✓✓ blue)
- [ ] SENT — server ack after saving to DB
- [ ] DELIVERED — client ack from recipient's device
- [ ] READ — batch ack on chat open
- [ ] Offline queue: save + push notification

### Presence Service
- [ ] Heartbeat every 30 sec + Redis TTL 60 sec
- [ ] Subscription model: notify only subscribers, not all contacts
- [ ] "Last seen X minutes ago" via lastSeen

### Group Chats & Fan-out
- [ ] Fan-out on write for small groups (up to 256)
- [ ] Fan-out on read for large channels (1000+)
- [ ] Choice justified with trade-offs

### Storage
- [ ] Sharding by chatId (all messages of a chat on one shard)
- [ ] Cassandra/ScyllaDB for write-heavy workload
- [ ] Sync protocol: lastSyncTimestamp + delta
- [ ] Indexes for main queries

### Media & Infrastructure
- [ ] Pre-signed URL for media upload directly to S3
- [ ] Kafka for message queue (partition by chatId for ordering)
- [ ] CDN for media delivery
- [ ] Push notifications (FCM/APNs) for offline users

## How to check yourself

1. Go through each checklist section — all items should be covered
2. "Walk through" a scenario: Alice sends a message to Bob, who is offline. What happens at each stage?
3. Check: what happens on WebSocket connection loss? (reconnect + sync)
4. Check: how does a group of 200 people work? How many records are created per message?
5. Check: how does Alice see that Bob is typing? (typing indicator via WS)
6. Compare your design with the reference solution (Solution)
