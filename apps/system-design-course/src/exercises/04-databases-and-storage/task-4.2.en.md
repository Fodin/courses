# Task 4.2: Sharding Visualizer

## Objective

Build an interactive visualizer that shows how different sharding strategies distribute data across shards and reveals hot spots.

## Requirements

1. Generate a dataset (20 records): `user_id`, `region` (US/EU/Asia), `created_at` (date)
2. Implement three sharding strategies with switching:
   - **Range** — by `user_id` range (1-7 → Shard 1, 8-14 → Shard 2, 15-20 → Shard 3)
   - **Hash** — `hash(user_id) % 3` for even distribution
   - **Geographic** — by region (US → Shard 1, EU → Shard 2, Asia → Shard 3)
3. Visualize distribution across shards:
   - Show the number of records in each shard (number + progress bar)
   - Highlight hot spots (shard with >50% of data)
4. Show a data table indicating which shard each record landed on
5. Show metrics: standard deviation of distribution, presence of hot spots

## Checklist

- [ ] Generate 20 records with user_id, region, created_at
- [ ] Switching between three strategies (Range, Hash, Geographic)
- [ ] Visualization of distribution across 3 shards (progress bars)
- [ ] Hot spots highlighted visually (red/orange)
- [ ] Data table with shard mapping
- [ ] Hash strategy gives the most even distribution
- [ ] Geographic shows unevenness with unequal region counts

## How to Check Yourself

1. Range: records distributed by user_id ranges — is it even?
2. Hash: records distributed by hash(user_id) % 3 — should be the most even
3. Geographic: if most users are from US — Shard 1 will be a hot spot
4. Switch strategies — distribution should change instantly
5. Hot spots highlighted for strategies with uneven distribution
