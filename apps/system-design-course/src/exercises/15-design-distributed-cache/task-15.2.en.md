# Task 15.2: Distributed Cache Cluster Simulator

## Goal

Implement an interactive Redis-like cluster simulator demonstrating consistent hashing with hash slots, key routing, node addition/removal with rebalancing, and failover on node failure.

## Requirements

1. **Cluster initialization** (N nodes, default 3):
   - Each node has a name, status (active/failed), and a hash slot range
   - 16384 slots distributed evenly among nodes
   - Visual display: node table with their slots

2. **Add node** ("Add Node" button):
   - New node receives some slots from existing nodes (rebalancing)
   - Show: which slots moved and from where
   - Visualization before/after rebalancing

3. **Remove node** ("Remove Node" button):
   - Removed node's slots are redistributed among remaining nodes
   - Show: slot redistribution

4. **PUT / GET key**:
   - Enter key and value
   - Show: hash slot computation (CRC16 mod 16384)
   - Show: which node the key landed on
   - GET: find node by key and return value

5. **Failover** ("Kill Node" button):
   - Node transitions to "failed" status
   - Node's data is unavailable (GET returns error)
   - Show: which keys are lost
   - "Recover" button — restore node (data lost, slots returned)

6. **Slot distribution visualization**:
   - Progress bar for each node (width proportional to slot count)
   - Color coding: active = green, failed = red
   - Event log: all operations with timestamps

## Checklist

- [ ] Cluster of N nodes with even distribution of 16384 slots
- [ ] Add node with rebalancing (slot movement visualization)
- [ ] Remove node with slot redistribution
- [ ] PUT: enter key/value → compute slot → route to node
- [ ] GET: find node by key → return value (or error for failed node)
- [ ] Kill Node: node in failed status, data unavailable
- [ ] Recover Node: node restored without data
- [ ] Visualization: slot progress bars, node color status
- [ ] Event log describing each operation

## How to check yourself

1. Create a 3-node cluster — each should have ~5461 slots
2. Add a 4th node — each should have ~4096 slots
3. Place 5 keys — verify they distribute across different nodes
4. Kill a node with a key — GET of that key should return an error
5. Remove a node — its slots should redistribute among remaining nodes
6. Compare your simulator with the reference solution (Solution)
