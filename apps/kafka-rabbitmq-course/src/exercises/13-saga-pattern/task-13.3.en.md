# Task 13.3: Compensating Actions

## Goal

Implement a **compensating actions simulator** with detailed display of business effects for each step. The component shows not just statuses, but specific system changes: what data was affected when a step executed and what exactly was cancelled during compensation. The student should understand the difference between technical compensation and the business meaning of rollback.

## Requirements

1. Declare a `CompensationStatus` type: `'idle' | 'done' | 'failed' | 'compensating' | 'compensated'`.
2. Declare a `CompensationStep` interface with fields: `id: string`, `stepNumber: number`, `service: string`, `action: string`, `compensationAction: string`, `effect: string`, `compensationEffect: string`, `color: string`, `status: CompensationStatus`.
3. Declare a `COMP_STEPS` constant — an array of 4 steps:
   - OrderService: action "Create order", effect `'ORDER #1234 created, status: PENDING'`, compensation "Cancel order", compensation effect `'ORDER #1234 cancelled, status: CANCELLED'`.
   - PaymentService: "Deduct funds" / `'$99.99 deducted from card *1234'` / "Refund funds" / `'$99.99 refunded to card *1234'`.
   - InventoryService: "Reserve product" / `'SKU-555 reserved (stock: 9)'` / "Release reservation" / `'SKU-555 released (stock: 10)'`.
   - ShippingService: "Create delivery" / `'Delivery #D789 created in system'` / "Cancel delivery" / `'Delivery #D789 cancelled'`.
4. Implement states: `steps`, `failAtStep` (default 2), `running`, `effects: string[]`, `phase`, `abortRef`.
5. Implement helper functions `getStepBg(status, color)` and `getStepBorderColor(status, color)` — return background and border color of a step card based on status.
6. Implement a `runSimulation` function:
   - Sequentially iterates through steps with `sleep(600)` delay.
   - On successful step: status → `'done'`, add to `effects` the line `[DONE] Step N: {effect}`.
   - On error step (`i === failAtStep`): status → `'failed'`, add `[FAILURE] Step N: {service} - execution error`, start compensation.
   - Compensation: add to `effects` the line `--- Starting compensation (in reverse order) ---`, then iterate successful steps in reverse order: status `'compensating'` (700ms), then `'compensated'`, add `[COMPENSATED] Step N: {compensationEffect}`.
   - At the end add `'--- Compensation completed. Data restored ---'`.
   - When `failAtStep === -1` — successful completion: `[SUCCESS] All steps completed successfully!`.
7. Implement `reset`.
8. Render a vertical list of steps with numbered circles and connecting lines between them:
   - Circle with step number — color determined by `getStepBorderColor`.
   - Vertical line between circles — color: green when `'done'`, red when `'compensated'`, gray by default.
   - Step card: header with service name and action name (changes to `compensationAction` on rollback), status badge, effect line in monospace font.
9. Add buttons for selecting the failing step ("Step 1", "Step 2", "Step 3", "Step 4", "No errors"). Active button has red border and red text (green for "No errors").
10. Add a toggle button "Simulate" / "Reset" (`marginLeft: 'auto'`).
11. Render the effect log in a dark block: `[FAILURE]` lines red, `[COMPENSATED]` orange, `[SUCCESS]` green, `---` gray.
12. After completion (`phase === 'done'`) show a summary block: on success green with text "Saga completed successfully. All 4 steps committed.", on error red with text "Step N failed. Rolled back M step(s). System is consistent."

## Checklist

- [ ] `CompensationStatus` type declared with 5 values
- [ ] `CompensationStep` interface contains `effect` and `compensationEffect`
- [ ] `COMP_STEPS` contains 4 steps with realistic business effects
- [ ] `getStepBg` and `getStepBorderColor` return different values for each status
- [ ] Vertical line between circles changes color on `'compensated'`
- [ ] Card shows `compensationAction` instead of `action` on rollback
- [ ] Card shows `compensationEffect` instead of `effect` on rollback
- [ ] Effect line in monospace font
- [ ] Compensation executes in strict reverse order of completed steps
- [ ] Step selection buttons: active — red border, "No errors" — green
- [ ] Buttons are disabled during simulation
- [ ] Effect log separates lines by color (red/orange/green/gray)
- [ ] Summary block shows the number of rolled back steps

## How to test yourself

1. Open the task — 4 step cards with gray numbered circles.
2. Select "Step 3" (InventoryService) as the error point and click "Simulate".
3. Steps 1 and 2 sequentially transition to `done` — their cards show green border and effect line (ORDER created, money deducted).
4. Step 3 transitions to `failed` — card with red border and error text.
5. Log shows `--- Starting compensation (in reverse order) ---`.
6. Step 2 (PaymentService): first orange status "Rolling back...", then gray "Rolled back", line with `compensationEffect` — money refunded.
7. Step 1 (OrderService): same, order cancelled.
8. Vertical lines between rolled back steps turn red.
9. Summary block: "Step 3 failed. Rolled back 2 step(s). System is consistent."
10. Select "No errors" — all 4 steps complete successfully, summary is green.
