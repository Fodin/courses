# Task 10.2: Compacted Topics

## Goal

Implement an interactive Kafka Log Compaction simulator. The student will see how Kafka stores the history of key changes, what a tombstone record is, and how compaction leaves only the latest versions of each key, removing stale duplicates.

## Requirements

1. Define a `KafkaRecord` interface with fields: `offset: number`, `key: string`, `value: string | null`, `timestamp: string`, `isTombstone?: boolean`.
2. Create an `INITIAL_RECORDS` array of 9 records with different keys (`user:1`, `user:2`, `user:3`, `user:4`), where:
   - `user:1` appears 3 times (three different cities), the last one — Sochi
   - `user:2` appears 3 times, the last one — Krasnodar
   - `user:3` appears 2 times: a regular record and a tombstone (`value: null`)
   - `user:4` appears 1 time
3. Implement a `runCompaction(records)` function: iterates through all records and keeps only the latest record for each key (using a `Map`). Tombstone records (`isTombstone: true`) are excluded from the result. The result is sorted by `offset`.
4. Implement states: `compacted: boolean`, `selectedKey: string | null`, `addKey: string`, `addValue: string`, `records: KafkaRecord[]`.
5. Implement a `handleAddRecord` function: creates a new record with `offset = max(offset) + 1`, `timestamp` — current time, `isTombstone = !addValue` (empty value = tombstone).
6. Implement a `handleDeleteKey(key)` function: adds a tombstone record for the specified key with `value: null`.
7. Variable `currentRecords`: if `compacted === true` — applies `runCompaction(records)`, otherwise — the original array.
8. In "before compaction" mode, visually highlight:
   - Stale duplicate records — dimmed background (yellow tint, reduced opacity)
   - Tombstone records — red background with `TOMBSTONE (null)` text
9. Toggle button: "Run Compaction" / "Show All". When compacted — display the record count "after".
10. Record add form: `key` and `value` fields (if `value` is empty — a tombstone is created).
11. List of existing keys with a "Delete" button for each — adds a tombstone.
12. Color legend: yellow — stale record, red — tombstone, blue (after compaction) — current record.
13. Info block: explains how Log Compaction works and which use cases it applies to.

## Checklist

- [ ] `KafkaRecord` interface contains all 5 fields including optional `isTombstone`
- [ ] `INITIAL_RECORDS` array contains 9 records with repeated keys and a tombstone for `user:3`
- [ ] `runCompaction` returns only the latest records per key without tombstones
- [ ] `handleAddRecord` correctly creates a regular record and a tombstone (on empty value)
- [ ] `handleDeleteKey` adds a tombstone with `value: null`
- [ ] Compaction button toggles display mode
- [ ] In "before compaction" mode, duplicates are visually dimmed
- [ ] Tombstone records are displayed in red with `TOMBSTONE (null)` text
- [ ] After compaction, only current records are shown (no tombstones, no duplicates)
- [ ] Record add form works for regular records and tombstones
- [ ] "Delete" buttons for each key add a tombstone
- [ ] Color legend is present
- [ ] "Reset" button returns the array to `INITIAL_RECORDS`

## How to test yourself

1. In the initial state (before compaction) there should be 9 records. `user:1` records with offset 0 and 2 should be visually dimmed — they are stale.
2. Click "Run Compaction" — 3 records should remain: the latest `user:1` (Sochi), `user:2` (Krasnodar), `user:4`. The `user:3` record disappears (tombstone = deletion).
3. Return to "before compaction" mode. Add a record with key `user:1` and value `{"name":"Alice","city":"Vladivostok"}`. Click "Run Compaction" — now `user:1` should show Vladivostok.
4. Click "Delete" on key `user:4` — a tombstone record should appear. Run Compaction — `user:4` disappears.
5. In the add form, leave the Value field empty and add a record — a tombstone should appear with `TOMBSTONE (null)` label in red.
