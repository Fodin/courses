# Task 8.2: Append-only Log

## Goal

Implement an interactive visualization of Kafka's append-only log: adding records, reading from an arbitrary offset, and demonstrating the immutability principle.

## Requirements

1. Define a `LogRecord` interface with fields:
   - `offset: number` — monotonically increasing record number (starting from 0)
   - `key: string` — message key
   - `value: string` — JSON value
   - `timestamp: string` — string like `"2024-01-15 10:00:00"`
   - `size: number` — size in bytes (approximate: key length + value length + 10)

2. Initialize the log with five pre-built records (offset 0..4) with keys `user-1`, `user-2`, `user-1`, `order-1`, `user-3`.

3. Implement concept cards (displayed above the log):
   - "Append-only" — records are only added at the end, no changes
   - "Offset" — each record has a unique monotonically increasing number, starting from 0
   - "Immutable" — written data is immutable, consumer reads any range

4. Implement log visualization:
   - A horizontal row of cards, each displaying `offset`, `key` and size in bytes
   - After the last record — an arrow `→` and a dashed block "next record"
   - Clicking a card highlights the record and shows a detail panel below (key, value, timestamp, size)
   - Color coding by consumer offset position: green (read), yellow (current position), gray (unread)

5. Implement consumer offset management:
   - "from offset=N" buttons for each record in the log
   - Clicking sets `consumerOffset = N` and adds `[SEEK]` and `[READ]` entries to the operation log
   - Text below buttons: "Consumer reads from offset=N. Read: X messages."

6. Implement a new record form:
   - Input fields: `key` (monospace, 120px width) and `value` (stretches)
   - "Append" button: computes the next offset, creates a record and adds it to the end of the log
   - Hint: "New record will be appended to the end of the log with offset=N"
   - Adds a line to the operation log: `[APPEND] offset=N key="..." → appended to end of log`

7. Implement an operation log (dark terminal with green text):
   - Stores up to 15 most recent entries
   - "Clear" button resets the log

## Checklist

- [ ] On load, a log of 5 records (offset 0..4) is displayed
- [ ] Clicking a record shows a detail panel with key, value, timestamp, size
- [ ] "from offset=N" buttons correctly move the consumer position and color read records
- [ ] The "Write message" form adds a new record with offset = records.length
- [ ] After adding a record, the "→" arrow and "next record" block shift right
- [ ] The operation log shows [SEEK], [READ] and [APPEND] events
- [ ] Three concept cards (Append-only, Offset, Immutable) are displayed above the log

## How to test yourself

1. Click the "from offset=2" button — records 0 and 1 should turn green (read), record 2 — yellow (current position), and `[SEEK]` and `[READ]` lines should appear in the operation log.
2. Enter a new key and value, click Append — a record should appear at the end with offset=5.
3. Click on any card — a detail panel with full record information should appear.
