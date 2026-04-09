# Task 15.3: CDC (Change Data Capture)

## Goal

Implement an interactive **Change Data Capture** demonstrator in Debezium style. Every change to the table (INSERT, UPDATE, DELETE) is captured from WAL (Write-Ahead Log) and published as a structured CDC event to Kafka. The student sees the event structure: `op`, `before`, `after`, `ts`, `topic` fields.

## Requirements

1. Declare a `CdcOperation` type: `'INSERT' | 'UPDATE' | 'DELETE'`.
2. Declare a `CdcRow` interface with fields `id: number`, `name: string`, `amount: number`.
3. Declare a `CdcEvent` interface with fields `id: number`, `op: CdcOperation`, `before: CdcRow | null`, `after: CdcRow | null`, `ts: string`, `topic: string`.
4. Declare a `CdcWalEntry` interface with fields `lsn: string`, `op: CdcOperation`, `table: string`, `payload: string`.
5. Declare module-level counters `rowIdCounter` and `eventIdCounter` outside the component (for unique ids via simple increment).
6. Implement helper functions `opColor(op: CdcOperation)` and `opBg(op: CdcOperation)` — return color (`#38a169` / `#d69e2e` / `#e53e3e`) and background (`#f0fff4` / `#fffff0` / `#fff5f5`) based on the operation.
7. Declare component states: `rows: CdcRow[]` (initial data: 2 rows), `walLog: CdcWalEntry[]`, `cdcEvents: CdcEvent[]`, `editId: number | null`, `editAmount: string`, `lsnRef` via `useRef(1000)`.
8. Implement a `now()` function returning current time in `HH:MM:SS` format.
9. Implement `addWalEntry(op, payload)`: generates LSN in format `0/1{lsnRef.current++}`, adds entry to `walLog` (keeps last 5 entries via `.slice(-4)`), returns LSN.
10. Implement `addCdcEvent(event)`: adds event to `cdcEvents` (keeps last 6 via `.slice(-5)`), automatically sets `id`, `ts` and `topic: 'db.public.orders'`.
11. Implement `handleInsert`: creates a new row with `id = rowIdCounter++`, random `amount` (50–550), adds to `rows`, calls `addWalEntry('INSERT', ...)` and `addCdcEvent({ op: 'INSERT', before: null, after: newRow })`.
12. Implement `handleUpdate(row)`: on first click, puts the row in edit mode (`editId = row.id`); on second click — applies the new `amount` value, calls `addWalEntry('UPDATE', ...)` and `addCdcEvent({ op: 'UPDATE', before: row, after: updated })`.
13. Implement `handleDelete(row)`: removes the row from `rows`, calls `addWalEntry('DELETE', ...)` and `addCdcEvent({ op: 'DELETE', before: row, after: null })`.
14. Render the left column with a PostgreSQL table: header "PostgreSQL: orders", table with columns `id`, `name`, `amount`, `ops`. Buttons `UPD` / `OK` and `DEL` in each row.
15. Render a "+ INSERT row" button below the table.
16. Render the WAL log in a dark block: each line — LSN (gray), operation (INSERT green, UPDATE yellow, DELETE red), table (blue), payload (light gray).
17. Render the right column with Kafka CDC events (topic `db.public.orders`). Each event is a card with a colored left border by operation, fields `op`, `topic`, `ts`, `before` (red) and `after` (green). List in reverse order (newest on top).
18. When the CDC event list is empty — show placeholder "Modify the table to see CDC events".

## Checklist

- [ ] `CdcOperation` type and interfaces `CdcRow`, `CdcEvent`, `CdcWalEntry` declared
- [ ] `opColor` and `opBg` return correct colors for INSERT / UPDATE / DELETE
- [ ] Initial data contains 2 rows in `rows`
- [ ] `addWalEntry` generates LSN and keeps no more than 5 last entries
- [ ] `addCdcEvent` keeps no more than 6 last events
- [ ] `handleInsert` adds a row to `rows` and generates WAL + CDC event with `before: null`
- [ ] `handleUpdate` activates edit mode on first click, applies changes on second
- [ ] CDC event UPDATE contains both `before` (old data) and `after` (new data) fields
- [ ] `handleDelete` removes the row and generates CDC event with `after: null`
- [ ] Table correctly displays `<input>` for the edited row
- [ ] WAL log in dark block with color-coded operations
- [ ] CDC events displayed in reverse chronological order
- [ ] Event card shows `before` and `after` in correct colors
- [ ] Placeholder displayed when no events exist

## How to test yourself

1. Open the task — table contains 2 rows (Order #1 and Order #2). Right column shows placeholder.
2. Click "+ INSERT row". A new row with random `amount` appears in the table. In WAL log — a line with `INSERT`. In the right column — a card with green border, `before: null`, `after: { id, name, amount }`.
3. Click `UPD` on any row. The `amount` field becomes an `<input>`. Enter a new value, click `OK`. In WAL log — `UPDATE` with transition `amount: X -> Y`. In CDC event — both `before` and `after` fields with different amounts.
4. Click `DEL` on any row. The row disappears. CDC event with red border, `before: { ... }`, `after: null`.
5. Perform several operations in a row — WAL keeps no more than 5 last entries, CDC — no more than 6. Old entries are pushed out.
6. Verify that each CDC event contains `topic: 'db.public.orders'` and the current time.
