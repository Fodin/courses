# Assignment 2.3: Consistent Hashing Visualizer

## Goal

Build an interactive consistent hashing visualizer — a hash ring with servers, keys, and virtual nodes. Clearly demonstrate why adding/removing servers moves a minimum number of keys.

## Requirements

1. Implement a hash ring (0...359 for clarity, like degrees)
2. Display servers and keys on the ring in table/text form:
   - Position on the ring (0-359)
   - Which server serves which keys (nearest clockwise)
3. Buttons for:
   - Adding a server (with a random name)
   - Removing a server
   - Adding a key (with a random name)
4. When servers change, show:
   - How many keys were redistributed
   - Percentage of moved keys (compare with hash % N)
5. Implement a virtual nodes toggle (on/off):
   - Without virtual nodes: 1 point per server
   - With virtual nodes: 3-5 points per server
6. Show distribution statistics: how many keys on each server and how even the distribution is

## Checklist

- [ ] Hash ring displays servers and keys with positions
- [ ] Adding a server redistributes only ~1/N keys
- [ ] Removing a server redistributes only that server's keys
- [ ] Difference shown: consistent hashing vs hash % N by number of moves
- [ ] Virtual nodes improve distribution evenness
- [ ] Key distribution statistics across servers are visible

## How to Check Yourself

1. Add 3 servers and 10 keys — each key should be bound to the nearest server clockwise
2. Add a 4th server — ~25% of keys should move (not all!)
3. Enable virtual nodes — distribution should become more even
4. Compare: with consistent hashing ~1/N keys moved, with hash % N — much more
