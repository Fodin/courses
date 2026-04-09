# Task 5.1: Direct Exchange

## Goal

Implement an interactive Direct Exchange simulator that demonstrates exact message routing by routing key.

## Requirements

1. Define the `DirectBinding` interface with properties: `queue` (string), `routingKey` (string), `color` (string), `bgColor` (string), `messages` (string[]).
2. Define the `DirectMessage` interface with properties: `id` (number), `routingKey` (string), `payload` (string), `timestamp` (string).
3. Create the initial `initialDirectBindings` array with 4 bindings:
   - `orders.new` → routing key `order.created`
   - `orders.paid` → routing key `order.paid`
   - `orders.cancelled` → routing key `order.cancelled`
   - `notifications` → routing key `order.created` (demonstrates that one key can bind multiple queues)
4. Implement states: `bindings`, `selectedKey`, `customKey`, `animating` (string[]), `log`, `messageCount`.
5. Implement the `publish()` function: on publish, finds all queues with a matching routing key, adds messages to them, updates the log, triggers animation (list of queue names) for 900 ms.
6. Implement the `clearQueues()` function: clears messages in all queues and the log.
7. Display the architecture diagram: Producer → arrow → Direct Exchange → set of queues with binding keys.
   - Binding key is highlighted if it matches the current routing key
   - Queue is highlighted during animation (isAnimating)
   - Inside the queue: name, message counter, last message
8. Provide a control panel: a list of 5 predefined routing keys for selection + an input field for a custom key.
9. Display the publish block as AMQP pseudocode (`channel.basicPublish(...)`) with the current exchange, routing key, and message body.
10. Display the routing log: for each message, shows the routing key and which queues it went to (or "UNROUTABLE").
11. Add an informational block describing how Direct Exchange works.

## Checklist

- [ ] `DirectBinding` and `DirectMessage` interfaces declared with correct types
- [ ] Initialized array of 4 bindings with two queues on the same key `order.created`
- [ ] `publish` function correctly selects queues by exact match
- [ ] Animation triggers only for queues with a matching key
- [ ] Both `notifications` and `orders.new` receive a message when the key is `order.created`
- [ ] On unknown key, the log shows "UNROUTABLE"
- [ ] Custom key input field works and takes priority over the selection list
- [ ] "Clear" button resets messages and log
- [ ] AMQP pseudocode is displayed with current values
- [ ] Informational block is present

## How to Test Yourself

1. Select routing key `order.created` and click "Publish" — the message should land in queues `orders.new` and `notifications` (both have this key).
2. Select `order.paid` — the message lands only in `orders.paid`.
3. Enter a non-existent key, e.g. `foo.bar` — the log should show "UNROUTABLE".
4. Click "Clear" — all queues and the log should reset.
