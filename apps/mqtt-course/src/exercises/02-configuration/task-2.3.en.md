# Task 2.3: Logging Configuration

## Goal

Master Mosquitto logging parameters (`log_dest`, `log_type`, `log_timestamp`) and understand how to properly configure logs for OpenWRT. Implement an interactive logging configuration builder with log output preview.

---

## Requirements

1. Define the `LogType` interface with fields: `id`, `label`, `description`, `example` (log line example), `verbosity` (1–5)

2. Create a `logTypes` array with 8 types: `error`, `warning`, `notice`, `information`, `subscribe`, `unsubscribe`, `websockets`, `debug`

3. Create a `logDestOptions` array with 6 destination options: `syslog`, `stdout`, `stderr`, `file /tmp/mosquitto.log`, `topic`, `none`. Mark those recommended for OpenWRT.

4. Implement a component with three sections:
   - **log_dest**: radio buttons for destination selection (single choice)
   - **log_type**: checkboxes for type selection (multi-select). Color depends on verbosity
   - **log_timestamp**: checkbox with highlighting

5. A "Show Config" button reveals two blocks:
   - Generated `mosquitto.conf` fragment
   - Log output example based on the selected `log_type` values

6. `log_type` checkbox colors reflect severity: red (error/warning), orange (notice), green (informational). Cannot deselect all types — minimum `error` must remain.

---

## Checklist

- [ ] Defined `LogType` interface with `verbosity` field
- [ ] 8 logging types with realistic log line examples
- [ ] 6 `log_dest` variants with `recommended` flag
- [ ] Radio buttons for `log_dest` (single selection)
- [ ] Checkboxes for `log_type` with color coding by verbosity
- [ ] Cannot deselect all types (at least `error` remains)
- [ ] `log_timestamp` checkbox with highlighting
- [ ] Recommended variants marked with a badge
- [ ] Button reveals two blocks: config and output example
- [ ] Output example is generated from `example` of selected types
- [ ] Correct TypeScript typing

---

## How to Check Yourself

1. Do you see three sections: log_dest, log_type, log_timestamp?
2. Are `syslog` and `file /tmp/mosquitto.log` marked as recommended?
3. Do `error` and `warning` have red color, `notice` — orange?
4. Try to deselect all types except `error` — does `error` stay selected?
5. Click "Show Config" — do you see `log_dest syslog` and selected `log_type` entries?
6. Does the output example show lines from `example` of the selected types?
