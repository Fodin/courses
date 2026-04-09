# Task 14.2: Idempotency — Deduplication

## Goal

Implement an interactive demonstration of an **Idempotency Layer** — a message deduplication system by Message ID. The component allows comparing behavior with the deduplication filter enabled and disabled, clearly showing the consequences of processing duplicates.

## Requirements

1. Declare a `MsgStatus` type: `'queued' | 'checking' | 'duplicate' | 'processed'`.
2. Declare an `IncomingMessage` interface with fields: `id: string`, `payload: string`, `isDuplicate: boolean`.
3. Declare a `TrackedMessage` interface, extending `IncomingMessage`: add fields `status: MsgStatus` and `index: number`.
4. Declare an `INCOMING_MESSAGES: IncomingMessage[]` constant — an array of 8 messages, where msg-001, msg-002, msg-003 appear twice (second occurrences have `isDuplicate: true`):
   - `{ id: 'msg-001', payload: 'Order #1001 created', isDuplicate: false }`
   - `{ id: 'msg-002', payload: 'Payment $99.00', isDuplicate: false }`
   - `{ id: 'msg-001', payload: 'Order #1001 created', isDuplicate: true }`
   - `{ id: 'msg-003', payload: 'Shipment dispatched', isDuplicate: false }`
   - `{ id: 'msg-002', payload: 'Payment $99.00', isDuplicate: true }`
   - `{ id: 'msg-004', payload: 'Invoice generated', isDuplicate: false }`
   - `{ id: 'msg-003', payload: 'Shipment dispatched', isDuplicate: true }`
   - `{ id: 'msg-005', payload: 'Email notification', isDuplicate: false }`
5. Declare states: `deduplicationEnabled: boolean` (default `true`), `trackedMessages: TrackedMessage[]`, `seenIds: Set<string>`, `processedIds: string[]`, `duplicatesBlocked: number`, `processedCount: number`, `running: boolean`, `currentIndex: number`.
6. Implement a `handleReset` function — resets all states to initial values.
7. Implement a `handleStep` function — processes one next message:
   - Adds message to `trackedMessages` with status `'checking'`.
   - After 600ms: if `deduplicationEnabled && seenIds.has(msg.id)` → status `'duplicate'`, `duplicatesBlocked++`; otherwise → status `'processed'`, add ID to `seenIds` and `processedIds`, `processedCount++`.
   - Increment `currentIndex`.
8. Implement a `handleRunAll` function — automatically processes all remaining messages one by one with 350ms delay between them.
9. Declare dictionaries `statusColor: Record<MsgStatus, string>` and `statusLabel: Record<MsgStatus, string>` for 4 statuses.
10. Render a `deduplicationEnabled` toggle — "Dedup ON" / "Dedup OFF" button with colored background (green when enabled, red when disabled). Clicking triggers `handleReset` and toggles the flag.
11. Render a two-column grid:
    - Left column: **Incoming Stream** — list of `trackedMessages`, each with a colored border by status, "duplicate" badge when `isDuplicate: true`, `pulse` animation when `status === 'checking'`.
    - Right column: **Idempotency Store** (visualization of `processedIds` as badges) + **Statistics** block (3 lines: processed unique, duplicates blocked, total incoming).
12. Render a final block after completion (`isDone`):
    - When `deduplicationEnabled === false` — red block with a warning about reprocessing.
    - When `deduplicationEnabled === true` — green block confirming correct deduplication.
13. Add 3 buttons: "Step (next message)", "Run All", "Reset". First two are disabled when `running || isDone`.
14. Add CSS `@keyframes pulse` animation.

## Checklist

- [ ] `MsgStatus` declared with 4 values
- [ ] `INCOMING_MESSAGES` contains 8 messages (5 unique + 3 duplicated)
- [ ] `handleStep` correctly checks `seenIds` before processing
- [ ] When `deduplicationEnabled: true`, duplicate messages get status `'duplicate'`
- [ ] When `deduplicationEnabled: false`, duplicate messages get status `'processed'`
- [ ] `handleRunAll` processes all messages with 350ms delay
- [ ] Dedup button changes color (green/red) and triggers `handleReset`
- [ ] Idempotency Store shows only unique processed IDs
- [ ] Statistics correctly shows `processedCount` and `duplicatesBlocked`
- [ ] "Duplicate" badge displayed for messages with `isDuplicate: true`
- [ ] `pulse` animation works when `status === 'checking'`
- [ ] Final block changes based on `deduplicationEnabled`
- [ ] `isDone = currentIndex >= INCOMING_MESSAGES.length`

## How to test yourself

1. Open the task — "Dedup ON" toggle with green background should be displayed.
2. Click "Step" 8 times with deduplication enabled. msg-001, msg-002, msg-003 (second occurrence) should get status "Duplicate" (red). Idempotency Store should contain 5 unique IDs.
3. Statistics: "Processed unique: 5", "Duplicates blocked: 3". Final green block.
4. Click "Dedup OFF" — state resets. Click "Run All". Now all 8 messages get status "Processed". Final red block with warning about 3 reprocessings.
5. Verify that "Step" and "Run All" buttons are disabled after all 8 messages are processed.
