# Task 12.3: Message Storage Design

## Goal

Design a data model for storing messages in a messenger: tables, sharding strategy, indexes, sync protocol. Cover 1-to-1 and group chat scenarios.

## Requirements

1. **Entities** — define tables: messages, chats, chat_participants
2. **Fields** — specify key fields and their types for each table
3. **Sharding key** — choose and justify the sharding key for each table
4. **Indexes** — define indexes for main queries (reading a chat, chat list, sync)
5. **Sync** — describe the cross-device synchronization protocol

## Main queries the model must support

1. Get the last N messages of a chat (pagination)
2. Get a user's chat list (sorted by latest message)
3. Get new messages after timestamp X (sync)
4. Get unread message count per chat
5. Add a message to a chat (1-to-1 and group)

## Checklist

- [ ] `messages` table — messageId, chatId, senderId, content, contentType, createdAt
- [ ] `chats` table — chatId, type (direct/group), name, lastMessageAt
- [ ] `chat_participants` table — chatId, userId, role, joinedAt, lastReadMessageId
- [ ] Sharding by chatId for messages (all messages of a chat on one shard)
- [ ] Index (chatId, createdAt DESC) for message pagination
- [ ] Index (userId, lastMessageAt DESC) for chat list
- [ ] Sync protocol: client stores lastSyncTimestamp, requests delta
- [ ] Justification: why chatId, not userId for sharding

## How to check yourself

1. Go through each of the 5 main queries — can it be executed with a single query to a single shard?
2. Check: what happens when a new member is added to a group? Is data migration needed?
3. Check: how to count unread messages? (lastReadMessageId in chat_participants vs messageId)
4. Compare your design with the reference solution (Solution)
