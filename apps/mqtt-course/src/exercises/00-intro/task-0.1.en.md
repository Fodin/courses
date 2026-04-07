# Task 0.1: MQTT Protocol and Pub/Sub Model

## Goal

Visualize the pub/sub architecture and understand the roles of participants in an MQTT system. Implement an interactive diagram where you can observe the path of a message from publisher to subscriber through the broker.

---

## Requirements

1. Define the `PubSubNode` interface with fields: `id`, `type` (`'publisher' | 'broker' | 'subscriber'`), `label`, `description`, `color`, `bgColor`

2. Create a `nodes` array with at least 6 nodes:
   - 2 publishers (e.g., temperature sensor and door sensor)
   - 1 broker
   - 3 subscribers (e.g., dashboard, automation system, logger)

3. Implement the `Message` interface with fields: `id`, `topic`, `payload`, `qos` (`0 | 1 | 2`), `from`, `to` (array of recipient names)

4. Display a three-column layout: Publishers → Broker → Subscribers. Each node is a clickable card.

5. Add a "Publish Simulation" section with one button per publisher. On click:
   - Show details of the published message (topic, payload, QoS, recipients)
   - Append rows to the event log (PUBLISH, BROKER receives, DELIVER → subscribers)

6. Event log: last N lines in terminal style (dark background, green text). Add a "Clear" button.

---

## Checklist

- [ ] Defined `PubSubNode` and `Message` interfaces
- [ ] Created a `nodes` array with nodes of all three types
- [ ] Layout displays three columns: Publishers, Broker, Subscribers
- [ ] Arrows or dividers between columns (PUBLISH → / → DELIVER)
- [ ] Clicking a node highlights it
- [ ] Publish simulation buttons work
- [ ] Publishing shows a message details card
- [ ] Event log displays the sequence of events
- [ ] "Clear" button clears the log
- [ ] Component is fully typed (no `any`)

---

## How to Check Yourself

1. Open the component — do you see three columns with nodes?
2. Click any publisher — did the simulation button appear?
3. Click "Simulate Publish" — did message details and log lines appear?
4. Log lines should show: PUBLISH → BROKER → DELIVER (for each subscribed subscriber)
5. Click "Clear" — did the log clear?
