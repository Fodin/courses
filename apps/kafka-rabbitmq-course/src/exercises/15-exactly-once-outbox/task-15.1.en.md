# Task 15.1: Dual Write Problem

## Goal

Implement an interactive visualizer of the **Dual Write Problem** — a situation where a service sequentially writes to a database and publishes an event to a broker without atomic guarantee. Clearly show what happens when the broker fails after a successful DB write.

## Requirements

1. Declare a `WriteStep` type with 8 values: `'idle' | 'db-writing' | 'db-success' | 'broker-writing' | 'broker-success' | 'broker-fail' | 'done-ok' | 'done-fail'`.
2. Declare a `LogEntry` interface with fields `id: number`, `text: string`, `type: 'info' | 'success' | 'error' | 'warn'`.
3. Declare component states: `step: WriteStep`, `logs: LogEntry[]`, `dbRecords` (array of `{ id: string; status: string }`), `brokerMessages: string[]`, `failMode: boolean`, `logIdRef` via `useRef(0)`.
4. Implement helper functions `addLog(text, type)` and `delay(ms)`.
5. Implement a `runScenario` function:
   - Generates a unique `orderId` via `Date.now().toString().slice(-4)`.
   - Resets logs, transitions to `'db-writing'`, simulates 700ms delay.
   - After DB write (`db-success`) adds a record to `dbRecords`, 500ms delay.
   - If `failMode === true`: transitions to `'broker-fail'`, adds error log about inconsistency, completes in `'done-fail'`.
   - If `failMode === false`: transitions to `'broker-writing'` → `'broker-success'`, adds message to `brokerMessages`, completes in `'done-ok'`.
6. Implement a `reset` function that resets all states to initial values.
7. Declare dictionaries `logColors`, `logBg` (colors for each log type) and `stepColors` (container background color based on current step).
8. Render a diagram with two nodes (PostgreSQL and Kafka), visually reflecting each node's status (gray / blue / green / red) based on the current `step`.
9. Add a "Simulate broker failure" checkbox and "Create Order" / "Reset" buttons.
10. Render two panels with current storage states: PostgreSQL (orders) and Kafka (order-events).
11. Render the event log in a dark block with color-coded lines by type.
12. When `step === 'done-fail'` show a warning block about the inconsistency problem and a reference to task 15.2.

## Checklist

- [ ] `WriteStep` type with 8 values is declared
- [ ] `LogEntry` interface with `id`, `text`, `type` fields is declared
- [ ] States `step`, `logs`, `dbRecords`, `brokerMessages`, `failMode`, `logIdRef` initialized
- [ ] `addLog` adds entries with auto-incrementing `id` via `logIdRef`
- [ ] `delay` returns a promise via `setTimeout`
- [ ] `runScenario` sequentially goes through steps with delays
- [ ] When `failMode`, function completes in `'done-fail'` without writing to `brokerMessages`
- [ ] On success, function completes in `'done-ok'` with writes to both stores
- [ ] `reset` clears all states, including `dbRecords` and `brokerMessages`
- [ ] Diagram visually reflects current `step` (PostgreSQL and Kafka colors change)
- [ ] "Create Order" button is disabled during execution
- [ ] PostgreSQL and Kafka panels show real data or placeholder
- [ ] Inconsistency warning block appears only when `step === 'done-fail'`
- [ ] Log lines are color-coded by type (`success` — green, `error` — red, `warn` — yellow)

## How to test yourself

1. Open the task — diagram should be in neutral gray, both panels empty.
2. Click "Create Order" without error mode. Observe: PostgreSQL turns blue (writing), then green. Then Kafka — blue, then green. Both panels show data. Log contains `[DB] Record saved successfully` and `[Broker] Event published successfully`.
3. Click "Reset", enable "Simulate broker failure" checkbox.
4. Click "Create Order" again. PostgreSQL turns green, but Kafka turns red — log shows `[Broker] ERROR: Connection timeout!`. PostgreSQL panel has a record, Kafka — none. An inconsistency warning appears.
5. Verify that "Create Order" button is disabled during scenario execution.
