# Task 0.2: Architecture — Broker, Clients, Topics

## Goal

Master the structure of topics and the wildcard mechanism in MQTT. Implement an interactive topic tree and a subscription pattern tester.

---

## Requirements

1. Define the recursive `TopicNode` interface with fields: `name` (segment only), `full` (full path), `type: 'file' | 'dir'`, optional `children`, `hasMessage`, `retained`

2. Create a topic tree with at least 3 levels of nesting and 8+ leaves (e.g., `home/sensor/temperature`, `home/light/living_room/status`, `home/door/status`)

3. Display the topic tree with icons (`📁` for nodes, `📄` for leaves). Leaves with messages are marked with a badge, retained — with a special badge

4. Clicking a tree node highlights it and shows the full path

5. Implement a "Subscription Tester": input field for a pattern (supporting `+` and `#`) and a "Test" button. The `matchWildcard(pattern, topic)` function must correctly handle both wildcards.

6. Display MQTT connection parameters (host, port, keepalive, clientId, protocolVersion) as a table

---

## Requirements for matchWildcard Logic

- `home/+/temperature` matches `home/bedroom/temperature` but not `home/floor1/bedroom/temperature`
- `home/#` matches `home/`, `home/a`, `home/a/b/c`
- `+/+` matches only two-level topics
- `#` matches everything

---

## Checklist

- [ ] Defined recursive `TopicNode` interface
- [ ] Topic tree at least 3 levels deep, 8+ leaves
- [ ] Icons `📁` / `📄` depending on node type
- [ ] `retained` and `msg` badges for leaves with data
- [ ] Click highlights the topic and shows its full path
- [ ] Subscription pattern input field
- [ ] `matchWildcard` correctly handles `+` and `#`
- [ ] Test results displayed below the input field
- [ ] Connection parameters table
- [ ] Correct TypeScript typing

---

## How to Check Yourself

1. Do you see a topic tree with hierarchy?
2. Clicking a leaf shows the full path?
3. Enter `home/sensor/+` → press Test → only `home/sensor/temperature` and `home/sensor/humidity` matched?
4. Enter `home/#` → ALL topics under `home/` matched?
5. Enter `home/+/+` → only two-level paths under `home/` matched?
6. Enter `office/#` → 0 matches?
