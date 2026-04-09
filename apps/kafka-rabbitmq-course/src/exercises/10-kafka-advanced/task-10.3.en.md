# Task 10.3: Exactly-Once — Kafka Transactions

## Goal

Implement a step-by-step Kafka transactional API simulator. The student will explore two scenarios: a successful commit with atomic writes to three topics, and a transaction abort on producer failure with rollback of partial writes. The simulator will clearly show the role of the Transaction Coordinator and the `__transaction_state` topic.

## Requirements

1. Define a `TxState` type — a union type of 7 values: `'idle' | 'begin' | 'produce' | 'commit' | 'abort' | 'committed' | 'aborted'`.
2. Define a `TxMessage` interface with fields: `topic: string`, `partition: number`, `key: string`, `value: string`, `txId: string`.
3. Define a transaction step object type with fields: `state: TxState`, `label: string`, `description: string`, `coordinatorAction: string`.
4. Create a `TX_MESSAGES` array of 3 messages — atomic write to topics `payments` (partition 0), `inventory` (partition 2), `notifications` (partition 1). All with `txId: 'tx-001'`.
5. Create a `TX_STEPS` array (successful commit, 3 steps):
   - **beginTransaction()** — Coordinator registers the TX in `__transaction_state` with epoch for zombie producer fencing
   - **produce()** — atomic write to 3 topics, messages are visible only in `read_committed` after commit
   - **commitTransaction()** — Coordinator writes `PREPARE_COMMIT`, then `COMMITTED`, data becomes visible
6. Create an `ABORT_STEPS` array (failure and abort, 3 steps):
   - **beginTransaction()** — same as TX_STEPS, but `txId: 'tx-002'`
   - **produce()** — only the first message is written, simulating a producer crash
   - **abortTransaction()** — Coordinator writes `ABORTED`, sends abort markers to all partitions
7. Implement states: `mode: 'commit' | 'abort'`, `stepIndex: number` (initially -1), `producerConfig: Record<string, string>`.
8. `producerConfig` field contains: `transactional_id`, `enable_idempotence: 'true'`, `acks: 'all'`, `retries: '2147483647'`.
9. Mode switch: two buttons "Successful Commit" and "Failure & Abort". On switching, reset `stepIndex` to -1.
10. Implement a `handleNext` function: increments `stepIndex` by 1 (without exceeding the step array bounds). The button shows "Start Simulation" when `stepIndex === -1` and "Next Step" otherwise.
11. Implement a `handleReset` function: resets `stepIndex` to -1.
12. Implement a `getMessageOpacity(msgIndex)` function:
    - when `stepIndex < 1` — returns `0.3`
    - in `abort` mode for messages with `msgIndex > 0` when `stepIndex >= 1` — returns `0.2`
    - otherwise when `stepIndex >= 2` — `1`, when `stepIndex < 2` — `0.7`
13. Implement a `getMessageBorderColor(msgIndex)` function:
    - when `stepIndex < 1` — `'#333'`
    - in `abort` mode for `msgIndex > 0` — `'#6b1a1a'` (red, not written)
    - when `stepIndex >= 2` — green for commit (`'#2d6a4f'`), red for abort (`'#6b1a1a'`)
    - otherwise — orange (`'#7a4f00'`)
14. Compute `finalState`: if `stepIndex === steps.length - 1` — `'COMMITTED'` for commit or `'ABORTED'` for abort.
15. Display Producer Config as key-value pairs with `_` replaced by `.` in keys.
16. Display a list of 3 messages with `topic [partition N]`, key, and value. In abort mode — for messages 2 and 3, show a "NOT WRITTEN (failure)" label.
17. If `finalState` is set — show a block with the final transaction status (green COMMITTED / red ABORTED).
18. Display the Transaction Coordinator step list: completed steps — green background, current — blue, future — dark. When `stepIndex >= i`, show the `coordinatorAction`.
19. When `currentStep` exists — show the current step description (`description`).
20. Info block: how `__transaction_state` works (50 partitions, coordinator selection by `hash(transactional.id) % 50`), isolation levels `read_committed` vs `read_uncommitted`.

## Checklist

- [ ] `TxState` type contains all 7 values
- [ ] `TxMessage` interface contains all 5 fields
- [ ] `TX_MESSAGES` contains 3 messages to different topics with the same `txId`
- [ ] `TX_STEPS` contains 3 successful commit steps with `description` and `coordinatorAction`
- [ ] `ABORT_STEPS` contains 3 abort steps with correct descriptions
- [ ] `producerConfig` contains `transactional_id`, `enable_idempotence`, `acks`, `retries`
- [ ] Mode switch buttons reset `stepIndex`
- [ ] `handleNext` does not exceed the step array bounds
- [ ] `getMessageOpacity` returns correct values for both modes
- [ ] `getMessageBorderColor` distinguishes commit/abort and passed/failed steps
- [ ] In abort mode, messages 2 and 3 are labeled "NOT WRITTEN (failure)"
- [ ] `finalState` block appears only on the last step
- [ ] Transaction Coordinator steps are highlighted by progress
- [ ] `currentStep.description` updates on each step
- [ ] Info block about `__transaction_state` and isolation levels is present

## How to test yourself

1. In "Successful Commit" mode, click "Start Simulation" → "Next Step" → "Next Step". On each step, the description panel and `coordinatorAction` in the Coordinator block should appear.
2. After the third step, a green "Transaction: COMMITTED" block should appear. All three messages should have a green border and opacity 1.
3. Switch to "Failure & Abort". Go through all three steps. On step 2, the inventory and notifications messages should have a "NOT WRITTEN (failure)" label. After the third step — a red "Transaction: ABORTED" block.
4. Click "Reset" — `stepIndex` resets, all messages become semi-transparent (opacity 0.3).
5. Switch between modes — verify that `stepIndex` resets on each switch.
