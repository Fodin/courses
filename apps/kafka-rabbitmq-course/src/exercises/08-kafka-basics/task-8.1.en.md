# Task 8.1: Kafka Cluster — Brokers and Controller

## Goal

Implement an interactive visualization of an Apache Kafka cluster with three brokers, showing partition distribution (leader/follower), ISR status, and the election of a new controller on failure.

## Requirements

1. Define `Partition`, `Broker` types and initialize three brokers with partitions:
   - Each broker has fields `id`, `host`, `port`, `isController`, `rack`, `partitions`, `color`, `bgColor`
   - Partitions have fields `id`, `topic`, `role` (`'leader' | 'follower'`), `isr`
   - Broker-1 is the initial controller (`isController: true`), the other two — followers

2. Implement mode switching `'kraft' | 'zookeeper'` via KRaft Mode / ZooKeeper Mode buttons:
   - In KRaft mode, show ⚙️ icon and label "KRaft Controller / built-in Raft"
   - In ZooKeeper mode, show 🐘 icon and label "ZooKeeper / external cluster"

3. Implement clickable broker cards:
   - Clicking a broker expands a panel with its partitions
   - Click again to hide the panel
   - The controller displays a "CONTROLLER" badge in the top-right corner

4. Implement a `simulateControllerFailover()` function:
   - Finds the current controller
   - Randomly selects a new one from the remaining brokers
   - Updates the `isController` flag on all brokers
   - Adds log lines about the old controller falling and the new one being elected
   - The log message specifies the mode: `KRaft Raft consensus` or `ZooKeeper election`

5. Implement a cluster event log:
   - Stores the last 12 entries
   - Each entry has a `[HH:MM:SS]` timestamp
   - "Clear" button resets the log

6. Show an info panel describing the current mode (KRaft or ZooKeeper).

## Checklist

- [ ] Cluster of three brokers is displayed as cards with host and rack
- [ ] Broker with `isController: true` has a CONTROLLER badge
- [ ] Clicking a broker shows its partitions with roles (★ Leader / ○ Follower) and ISR status
- [ ] Switching KRaft ↔ ZooKeeper mode changes the icon and description in the panel
- [ ] "Simulate controller crash" button changes the controller and writes to the log
- [ ] Log contains a timestamp and info about the elected controller
- [ ] "Reset cluster" button returns to the initial state
- [ ] "Clear" button clears the event log

## How to test yourself

1. Click "Simulate controller crash" several times — the CONTROLLER badge should move between brokers, and the log should show entries like `Broker-1 crashed. Broker-3 became the new controller`.
2. Switch to ZooKeeper mode — the log should show `ZooKeeper election` instead of `KRaft Raft consensus`.
3. Click on each broker and verify partitions are displayed correctly with leader/follower roles and green/red ISR status.
