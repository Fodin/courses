# Task 13.3: Social Graph Design

## Goal

Design social graph storage for a news feed system: followers/following, blocking, recommendations. Choose a DB, define sharding strategy, describe main queries.

## Requirements

1. **Entities** — define tables/collections: follows, blocks, user_stats
2. **Fields** — specify key fields and their types for each entity
3. **DB choice** — justify the choice for each data type:
   - Graph DB for relationships and recommendations
   - Redis for caching hot data
   - Relational DB for user stats and metadata
4. **Sharding** — choose a sharding key for the follows table and justify
5. **Main queries**:
   - Get followers of user X
   - Get following of user X
   - Check: is A following B
   - Mutual followers (common followers of A and B)
   - Follow recommendations (friends of friends)
6. **Hot spots** — how to handle users with 50M+ followers

## Checklist

- [ ] `follows` table — followerId, followeeId, createdAt
- [ ] `blocks` table — blockerId, blockedId, createdAt
- [ ] `user_stats` table — userId, followersCount, followingCount, postsCount
- [ ] Graph DB (Neo4j/TAO) chosen for graph queries + Redis cache
- [ ] Sharding by followeeId for fast follower retrieval
- [ ] Indexes described for all main queries
- [ ] Hot spots solution: chunked followers list, Redis cache
- [ ] Justification: why not only Redis or only PostgreSQL

## How to check yourself

1. Go through each of the 5 main queries — can it be executed efficiently?
2. Check: what happens on follow/unfollow? How many operations?
3. Check: how does is_following(A, B) work? In one operation?
4. Check: how do follow recommendations work? What traversal is needed?
5. Check: a celebrity with 50M followers — does this create a hot spot?
6. Compare your design with the reference solution (Solution)
