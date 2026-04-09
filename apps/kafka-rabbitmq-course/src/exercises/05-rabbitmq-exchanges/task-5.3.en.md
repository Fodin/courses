# Task 5.3: Topic Exchange

## Goal

Implement an interactive Topic Exchange simulator with support for wildcard patterns `*` and `#`, visual match highlighting, and the ability to add new bindings.

## Requirements

1. Define the `TopicBinding` interface with properties: `id` (string), `pattern` (string), `queue` (string), `color` (string), `bgColor` (string).
2. Implement the `matchTopicPattern(pattern: string, key: string): boolean` function:
   - `*` matches exactly one word (segment between dots)
   - `#` matches zero or more words
   - For `#` in the middle of a pattern, use recursive iteration over remaining segments
3. Implement the helper function `highlightPattern(pattern: string, key: string): React.ReactNode[]`, which returns an array of span elements:
   - wildcard segments (`*`, `#`) — orange color and bold
   - matching segments — green color
   - non-matching segments — red color
4. Initialize 5 default bindings:
   - `order.#` → `all-orders`
   - `order.created.*` → `new-orders`
   - `*.paid.*` → `payments`
   - `user.#` → `user-events`
   - `#.error` → `error-handler`
5. Implement states: `bindings`, `routingKey`, `newPattern`, `newQueue`, `log`.
6. Compute `matchedBindings` as a derived value from `bindings` and `routingKey` (without a separate state).
7. Implement the `publish()` function: adds a log entry with the key, timestamp, and list of matched queues.
8. Implement the `addBinding()` function: adds a new binding with cyclic color, clears input fields.
9. Implement the `removeBinding(id)` function: removes a binding by id.
10. Display the routing key input field with a large font and 8 example buttons below it.
11. Display the bindings list: each card is highlighted on match, shows the pattern with colored markup, queue name, and a ✅/❌ icon.
12. Display the match counter in the bindings list header.
13. Add a form for adding a new binding with "pattern" and "queue name" fields.
14. Display a wildcard reference block: `*` and `#` with examples.

## Checklist

- [ ] `matchTopicPattern` correctly handles `*` (exactly one word)
- [ ] `matchTopicPattern` correctly handles `#` (zero or more words)
- [ ] `matchTopicPattern` correctly handles `#` in the middle of a pattern (recursion)
- [ ] `highlightPattern` returns span elements with colors for wildcard/match/no-match
- [ ] `matchedBindings` is computed reactively without additional state
- [ ] Match counter updates when the routing key changes
- [ ] Example buttons set the routing key in one click
- [ ] `addBinding` adds a binding and clears fields
- [ ] `removeBinding` removes the correct binding
- [ ] Log contains a timestamp and list of recipient queues
- [ ] `*` and `#` reference block is present with examples

## How to Test Yourself

1. Enter `order.created.eu` — `order.#` and `order.created.*` should match (3 segments, second is `created`, third is `eu`).
2. Enter `order.error` — `order.#` and `#.error` match.
3. Enter `system.error` — only `#.error` matches.
4. Enter `order.paid.us` — `order.#` and `*.paid.*` match.
5. Add a new binding `order.*.eu` → `eu-orders` and enter `order.created.eu` — it should match.
6. Click "Publish" — the log gets a new entry with the current key and queues.
