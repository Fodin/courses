# Task 4.4: Replication and Sharding Design for a Social Network

## Objective

Design a data storage architecture for a social network: choose the DB type, sharding strategy, and replication approach for each entity (profiles, posts, likes, comments).

## Requirements

1. Create an interactive table with 4 entities:
   - **Profiles** — user profiles (name, avatar, bio)
   - **Posts** — posts (text, media, author, date)
   - **Likes** — likes (who, what, when)
   - **Comments** — comments (text, author, post, date)
2. For each entity, provide a choice (dropdown / buttons):
   - **DB type** — PostgreSQL, MongoDB, Cassandra, Redis
   - **Sharding key** — user_id, post_id, date, region, none
   - **Replication** — Master-Slave, Master-Master, None
3. On clicking "Check", show an assessment of the decision:
   - For each entity: correct / partially correct / incorrect
   - Explanation of why the reference option is better
4. Show the reference solution with detailed explanation

## Checklist

- [ ] 4 entities displayed in the table
- [ ] For each — DB type, sharding key, replication selection
- [ ] "Check" button with scoring
- [ ] Explanation for each choice
- [ ] Reference solution with explanation
- [ ] Scoring distinguishes fully correct, partially correct, and incorrect answers

## How to Check Yourself

Reference solution (simplified):
1. **Profiles**: PostgreSQL, shard by user_id, Master-Slave (read-heavy, ACID for updates)
2. **Posts**: Cassandra, shard by user_id, Master-Slave (write-heavy, chronological access)
3. **Likes**: Redis/Cassandra, shard by post_id, Master-Slave (counters, high write speed)
4. **Comments**: Cassandra, shard by post_id, Master-Slave (write-heavy, read by post)
