# Task 13.2: Saga Orchestration

## Goal

Implement an **Orchestration Saga** visualizer with a central orchestrator. Unlike Choreography, here one Orchestrator knows all steps, sends commands to services, and waits for their responses. The visualization is an SVG diagram where the orchestrator is in the center and services are around it. Arrows between them animate when commands and responses are transmitted.

## Requirements

1. Reuse the `StepStatus` type from task 13.1.
2. Declare an `OrchestratorStep` interface with fields: `id: string`, `service: string`, `command: string`, `reply: string`, `compensationCommand: string`, `x: number`, `y: number`, `color: string`, `status: StepStatus`.
3. Declare an `ORCH_STEPS` constant — an array of 4 steps: PaymentService (command `ProcessPayment`, reply `PaymentProcessed`), InventoryService (`ReserveInventory` / `InventoryReserved`), ShippingService (`ScheduleShipping` / `ShippingScheduled`), NotificationService (`SendConfirmation` / `ConfirmationSent`). Each step has `x`, `y` coordinates for SVG positioning (2 services per row).
4. Declare an `Arrow` interface with fields: `fromX`, `fromY`, `toX`, `toY`: `number`, `color: string`, `label: string`, `reverse?: boolean`.
5. Implement states: `steps`, `failAt` (default 1), `running`, `currentArrow: Arrow | null`, `log`, `phase`, `sagaState: string` (orchestrator text status: `'STARTED'`, `'EXECUTING: ...'`, `'COMPENSATING'`, `'COMPLETED'`, `'ROLLED_BACK'`), `abortRef`.
6. Implement helper functions:
   - `getCenter(x, y, w, h)` — returns the center point of a rectangle.
   - `makeArrow(step, label, reverse, color)` — builds an `Arrow` object from orchestrator to service (or back when `reverse: true`).
7. Implement a `runSaga` function:
   - For each step: first `setCurrentArrow` with an arrow **from orchestrator to service** (blue), status → `'running'`, add log `[ORCHESTRATOR] -> Service: Command`.
   - On success: `setCurrentArrow` with an arrow **from service to orchestrator** (green), status → `'success'`, add log `[OK] Service -> Orchestrator: Reply`.
   - On error (`idx === failAt`): red arrow with `'ERROR'` label, status → `'failed'`, start compensation.
   - Compensation: for successful steps in reverse order — orange arrow with `compensationCommand`, then gray with `'ACK'`.
8. Implement `reset`.
9. Render an SVG diagram (`viewBox="0 0 500 360"`):
   - Orchestrator — rectangle in the center (coordinates `ORCHESTRATOR = { x: 170, y: 155 }`), changes background color based on `phase`.
   - 4 services — rectangles with colored borders, changing by status.
   - Animated arrow `currentArrow` — `<line>` with `strokeDasharray="6 3"` and CSS animation `dashMove`.
   - Text label above the arrow.
10. Add a `<select>` for error selection (option "No errors" + one per service).
11. Add a toggle button "Run" / "Reset".
12. Add a badge with current `sagaState` — changes background color when `phase === 'compensating'`.
13. Add an event log (dark block): `[ORCHESTRATOR]` lines blue, `[OK]` green, `[ERROR]` red, `[COMPENSATE]` orange.

## Checklist

- [ ] `OrchestratorStep` interface is declared with coordinate and command fields
- [ ] `ORCH_STEPS` contains 4 services with commands, replies, and compensations
- [ ] `Arrow` interface is declared
- [ ] `getCenter` correctly computes the center of a rectangle
- [ ] `makeArrow` builds arrows in both directions
- [ ] `sagaState` updates on each step
- [ ] SVG contains orchestrator and 4 service nodes
- [ ] Animated arrow is displayed during active step
- [ ] Orchestrator background color changes on `phase === 'compensating'`
- [ ] `sagaState` badge changes color by phase
- [ ] During compensation, arrows go in reverse order (orange)
- [ ] Log separates lines by color based on prefix
- [ ] `currentArrow` resets to `null` after completion

## How to test yourself

1. Open the task — SVG diagram shows the orchestrator in the center and 4 services around it.
2. Select error on InventoryService and click "Run".
3. First blue arrow flies from Orchestrator to PaymentService with label `ProcessPayment`.
4. Green arrow back with label `PaymentProcessed`, PaymentService turns green.
5. Next blue arrow to InventoryService — it transitions to error status.
6. Orchestrator transitions to COMPENSATING (background turns reddish, badge turns red).
7. Orange arrow to PaymentService with label `RefundPayment`, then gray back with `ACK`.
8. Log: `[ORCHESTRATOR]` lines blue, `[OK]` green, `[ERROR]` red, `[COMPENSATE]` orange.
9. On success (no errors) `sagaState` = `COMPLETED`, orchestrator — green background.
