# Task 14.3: Poison Message — Quarantine

## Goal

Implement a **Poison Message Detection** visualizer with a quarantine zone. The component simulates a queue of 4 messages (2 normal, 2 poison), shows the delivery attempt counter, and automatically sends unfixable messages to quarantine after reaching the limit.

## Requirements

1. Declare a `PoisonMsgStatus` type: `'queue' | 'processing' | 'failed' | 'quarantine' | 'success'`.
2. Declare a `PoisonMessage` interface with fields: `id: string`, `payload: string`, `deliveryCount: number`, `maxDeliveries: number`, `status: PoisonMsgStatus`, `isPoison: boolean`, `error?: string`, `history: string[]`.
3. Declare an `INITIAL_POISON_MESSAGES` constant — an array of 4 objects (without `deliveryCount`, `status`, `history`):
   - `{ id: 'msg-A', payload: '{"type":"order","id":42}', maxDeliveries: 3, isPoison: false }`
   - `{ id: 'msg-B', payload: '{"type":"payment","amount":null}', maxDeliveries: 3, isPoison: true, error: 'NullPointerException: amount is null' }`
   - `{ id: 'msg-C', payload: '{"type":"email","to":"user@example.com"}', maxDeliveries: 3, isPoison: false }`
   - `{ id: 'msg-D', payload: 'INVALID_JSON{{{{', maxDeliveries: 3, isPoison: true, error: 'JsonParseException: unexpected character' }`
4. Declare states: `maxDeliveries: number` (slider 1–5, default 3), `messages: PoisonMessage[]` (initialized from `INITIAL_POISON_MESSAGES`), `selectedMsg: string | null`, `processing: boolean`, `autoStep: boolean`, `autoRef: React.MutableRefObject`.
5. Implement a `resetMessages(md?: number)` function — resets `messages` from `INITIAL_POISON_MESSAGES` with `deliveryCount: 0`, `status: 'queue'`, `history: []`, applies the passed `maxDeliveries`.
6. Implement a `processNext` function (via `useCallback`):
   - Find the first message with status `'queue'` or `'failed'`.
   - Set its `status: 'processing'`, `deliveryCount + 1`, add to `history` the line `Attempt #N — processing...`.
   - After 700ms determine the result: if `isPoison`:
     - if `deliveryCount >= maxDeliveries` → status `'quarantine'`, add to `history` lines with error and `Limit reached (N). → Quarantine`.
     - otherwise → status `'failed'`, add line with error and `Return to queue for retry...`.
   - If `!isPoison` → status `'success'`, add line `Attempt #N — successfully processed`.
7. Implement a `toggleAuto` function — starts/stops an interval (900ms) calling `processNext`. Automatically stops when there are no active messages (`status === 'queue' || status === 'failed'`).
8. Declare dictionaries `statusColor: Record<PoisonMsgStatus, string>` and `statusLabel: Record<PoisonMsgStatus, string>` for 5 statuses.
9. Compute derived values: `quarantined` — messages with status `'quarantine'`, `succeeded` — with status `'success'`, `active` — with statuses `'queue' | 'failed' | 'processing'`, `isDone = active.length === 0 && !processing`.
10. Render a settings panel: `maxDeliveries` slider (1–5), label "After N failed attempts — quarantine". Changes trigger `resetMessages`.
11. Render a two-column grid:
    - Left column: **Message List** — clickable cards with colored border by status, "poison" badge when `isPoison: true`, `pulse` animation when `status === 'processing'`, visual delivery counter (bars: red for isPoison, green for !isPoison, gray — unfilled).
    - Right column: **Inspector** (if `selectedMsg` — show payload, error if any, attempt history) + **Quarantine** (list of messages) + **Successfully Processed** (badges).
12. Render a summary block when `isDone` — purple background with count of successful and quarantined.
13. Add buttons: "Next Step", "Auto" / "Stop", "Reset". First two are disabled when `isDone`.
14. Add CSS `@keyframes pulse` animation.

## Checklist

- [ ] `PoisonMsgStatus` declared with 5 values
- [ ] `PoisonMessage` contains `history: string[]` field
- [ ] `INITIAL_POISON_MESSAGES` contains 2 normal and 2 poison messages
- [ ] `processNext` finds the first message with status `'queue'` or `'failed'`
- [ ] On each step, `deliveryCount` increases by 1
- [ ] Poison message after `maxDeliveries` attempts gets status `'quarantine'`
- [ ] Normal message on first attempt gets status `'success'`
- [ ] `history` accumulates lines on each attempt
- [ ] Clicking a card selects the message for the inspector
- [ ] Inspector shows payload, error (if any), and attempt history
- [ ] Visual delivery counter: red bars for poison, green for normal
- [ ] Quarantine zone fills up as poison messages are sent there
- [ ] `toggleAuto` stops when `active.length === 0`
- [ ] `maxDeliveries` slider triggers `resetMessages` with new value
- [ ] Summary block appears when `isDone`

## How to test yourself

1. Open the task — 4 cards in "Queue" status. msg-B and msg-D marked with "poison" badge.
2. Click "Next Step" several times. msg-A processes on 1st attempt (status "Success"). msg-B gets "Error" and returns to queue.
3. After the 3rd attempt, msg-B should get status "Quarantine" (purple). In the quarantine zone on the right, msg-B appears with error text.
4. Click on msg-B card — inspector should show history: 3 attempts with error and line "Limit reached (3). → Quarantine".
5. Click "Auto" — all remaining messages are processed automatically. msg-C → success, msg-D → quarantine.
6. Summary block: "2 messages processed successfully, 2 poison messages isolated in quarantine."
7. Change `maxDeliveries` to 1 — state resets. Click "Auto" — both poison messages go to quarantine on the first attempt.
