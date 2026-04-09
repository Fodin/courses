# Task 15.2: Transactional Outbox

## Goal

Implement a **Transactional Outbox** pattern visualizer — a solution to the dual write problem. The event is saved to a special `outbox` table within the same DB transaction as the main data. A separate Relay process reads this table and publishes events to the broker — guaranteeing at-least-once delivery.

## Requirements

1. Declare an `OutboxStep` type with 8 values: `'idle' | 'tx-start' | 'db-write' | 'outbox-write' | 'tx-commit' | 'relay-poll' | 'relay-publish' | 'relay-delete' | 'done'`.
2. Declare an `OutboxRow` interface with fields `id: string`, `event: string`, `status: 'pending' | 'published'`.
3. Declare states: `step: OutboxStep`, `logs: LogEntry[]`, `dbOrders` (array of `{ id: string }`), `outboxRows: OutboxRow[]`, `brokerEvents: string[]`, `logIdRef` via `useRef(0)`.
4. Implement `addLog(text, type)` and `delay(ms)`.
5. Implement a `runOutbox` function:
   - Generates unique `orderId` and `outboxId` via `Date.now().toString().slice(-4)`.
   - Step `tx-start`: log `[Service] BEGIN TRANSACTION`, 400ms delay.
   - Step `db-write`: log SQL INSERT INTO orders, 500ms delay, adds record to `dbOrders`.
   - Step `outbox-write`: log SQL INSERT INTO outbox with status `'pending'`, 400ms delay, adds `OutboxRow` to `outboxRows`.
   - Step `tx-commit`: log `[DB] COMMIT — both records atomically saved`, 400ms delay.
   - Step `relay-poll`: log SELECT query to outbox, 600ms delay.
   - Step `relay-publish`: publishes event to `brokerEvents`, 500ms delay.
   - Step `relay-delete`: UPDATE outbox SET status='published', changes status in `outboxRows` to `'published'`, 400ms delay.
   - Transitions to `'done'`.
6. Implement a `reset` function that resets all states.
7. Declare a `pipelineSteps` array and `stepsOrder` array for tracking pipeline progress.
8. Render a horizontal pipeline of 7 steps with visual highlighting of active (`isActive`) and completed (`isDone`) states for each step.
9. Add an explanation that steps 1–4 are DB Transaction, steps 5–7 are Relay Process.
10. Render three panels: `orders` (main table), `outbox` (auxiliary), Kafka (order-events).
11. Display `'pending'` and `'published'` statuses in the outbox panel with different colors.
12. Add "Create Order (Outbox)" and "Reset" buttons.
13. Render the event log in a dark block.
14. When `step === 'done'` show a block explaining the at-least-once delivery guarantee.

## Checklist

- [ ] `OutboxStep` type with 8 values is declared
- [ ] `OutboxRow` interface with `id`, `event`, `status` fields is declared
- [ ] All states (`step`, `logs`, `dbOrders`, `outboxRows`, `brokerEvents`, `logIdRef`) initialized
- [ ] `runOutbox` sequentially goes through 7 steps with delays
- [ ] Steps `db-write` and `outbox-write` execute within one "transaction" (between `tx-start` and `tx-commit`)
- [ ] After `relay-publish`, the `outboxRows` entry changes status to `'published'`
- [ ] `reset` clears all three data panels
- [ ] Pipeline of 7 steps displayed horizontally
- [ ] Active step highlighted with rich color, completed — dimmed with checkmark
- [ ] "DB Transaction" (steps 1–4) and "Relay Process" (steps 5–7) labels present
- [ ] Outbox panel shows `[pending]` in orange and `[published]` in green
- [ ] Button is disabled during execution
- [ ] At-least-once guarantee block appears when `step === 'done'`

## How to test yourself

1. Open the task — all three panels empty, pipeline in gray state.
2. Click "Create Order (Outbox)". Observe sequential highlighting of pipeline steps.
3. At `db-write` step, a record appears in the `orders` panel. At `outbox-write` — a record in `outbox` with `[pending]` status.
4. After `tx-commit`, the log should show `COMMIT — both records atomically saved`.
5. After `relay-publish`, the event appears in the Kafka panel.
6. After `relay-delete`, the status in outbox changes to `[published]` (green).
7. A final green block with text about at-least-once delivery guarantee appears.
8. Click again — panels accumulate records for multiple orders.
9. Click "Reset" — all panels cleared, pipeline returns to start.
