# Task 13.1: Saga Choreography

## Goal

Implement a **Choreography Saga** visualizer for an e-commerce order. The system consists of four services (OrderService, PaymentService, InventoryService, ShippingService), each reacting to the previous service's events and publishing its own. On any step error, compensating events are triggered in strict reverse order.

## Requirements

1. Declare a `StepStatus` type: `'idle' | 'running' | 'success' | 'failed' | 'compensating' | 'compensated'`.
2. Declare a `ChoreographyStep` interface with fields: `id: string`, `service: string`, `event: string`, `compensationEvent: string`, `color: string`, `status: StepStatus`.
3. Declare an `INITIAL_STEPS` constant — an array of 4 steps (OrderService, PaymentService, InventoryService, ShippingService) with events `order.created`, `payment.processed`, `inventory.reserved`, `shipping.scheduled` and corresponding compensating events.
4. Declare dictionaries `STATUS_LABELS: Record<StepStatus, string>` and `STATUS_COLORS: Record<StepStatus, string>` for status display.
5. Implement component states: `steps`, `failAt` (step number where error occurs, default 2), `running`, `log` (array of strings), `phase` (`'idle' | 'forward' | 'compensating' | 'done'`), `abortRef` via `useRef`.
6. Implement a `runSaga` function:
   - Sequentially iterates through steps (with `sleep(700)` delay between them).
   - On successful step, status → `'success'`, adds `[OK] ...` line to log.
   - On error step (`i === failAt`), status → `'failed'`, adds `[ERROR] ...` to log, starts compensation.
   - Compensation: iterates completed steps in reverse order, status → `'compensating'` → `'compensated'`, adds `[COMPENSATE] ...` to log.
   - If `failAt === -1` — Saga completes successfully.
7. Implement a `reset` function that resets all states via `abortRef.current = true`.
8. Render a horizontal chain of service cards with arrows between them. Arrow color: green on success (forward path), red on compensation.
9. Add a `<select>` for error step selection (option "No errors" at `value={-1}` and one option per service).
10. Add a "Run Saga" / "Reset" button (text changes based on `running`).
11. Render the event log in a dark block (`background: '#1a1a2e'`). `[ERROR]` lines — red, `[COMPENSATE]` — orange, `[SAGA]` — green.
12. Add CSS `pulse` animation for circles in `'running'` and `'compensating'` statuses.

## Checklist

- [ ] `StepStatus` type with 6 values is declared
- [ ] `ChoreographyStep` interface with all fields is declared
- [ ] `INITIAL_STEPS` contains 4 steps with events and compensating events
- [ ] `STATUS_LABELS` and `STATUS_COLORS` are declared as `Record<StepStatus, ...>`
- [ ] `phase` state changes: `idle → forward → compensating → done`
- [ ] `runSaga` sequentially changes step statuses with delays
- [ ] On error, compensation executes in strict reverse order
- [ ] `abortRef.current = true` in `reset` interrupts the async loop
- [ ] Selecting `failAt === -1` leads to successful completion of all steps
- [ ] Service cards display current status and event (compensating on rollback)
- [ ] Arrow between steps changes color: green (success) / red (compensating)
- [ ] Event log scrolls and colors lines by type
- [ ] `<select>` is disabled during execution
- [ ] CSS `pulse` animation works for running steps

## How to test yourself

1. Open the task — a horizontal chain of 4 cards should be displayed (all in "Waiting" status).
2. Select error on "InventoryService" (step 2) and click "Run Saga".
3. First two steps (OrderService, PaymentService) should sequentially transition to "Success" with green arrows.
4. InventoryService transitions to "Error" with red border.
5. Compensation starts: PaymentService → "Rolling back...", then "Rolled back"; OrderService — same. Log contains `[COMPENSATE]` lines.
6. At the end, `[SAGA] Compensation completed...` appears.
7. Select "No errors" — all 4 steps sequentially transition to "Success", log ends with `[SAGA] Order successfully processed by all services!`.
8. Click "Reset" during execution — animation should stop, all steps return to "Waiting".
