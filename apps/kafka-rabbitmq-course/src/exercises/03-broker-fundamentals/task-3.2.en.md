# Task 3.2 — AMQP Protocol: Frame Inspector

## Goal

Create an interactive AMQP frame inspector that allows examining the low-level structure of the AMQP 0-9-1 protocol. The user selects a command (basic.publish, basic.consume, basic.ack, connection.start) and sees its frame breakdown with full field descriptions.

## Requirements

1. Implement navigation across 4 AMQP commands: `basic.publish`, `basic.consume`, `basic.ack`, `connection.start`. The active button is highlighted.
2. Below the navigation — a row with the selected command's description (icon + name + description).
3. On command selection, display a list of its frames as cards (frame type, channel-id, name, number of fields).
4. Frame type displays as a colored badge: METHOD (blue), HEADER (purple), BODY (green).
5. Click on a frame card — expands a table with all fields: field name, size, value, description.
6. Display the universal AMQP frame byte schema: type(1b) | channel(2b) | size(4b) | payload(Nb) | frame-end(1b).
7. At the bottom, show a notes block for the selected command (list of text items with highlighting).
8. When switching command — reset the selected frame.

## Checklist

- [ ] 4 command buttons, active one is visually highlighted
- [ ] Command description updates on switch
- [ ] Frame cards display for each command
- [ ] Frame type badges (METHOD / HEADER / BODY) have correct colors
- [ ] Click on a frame expands the field table with 4 columns
- [ ] Frame byte schema displays in terminal style
- [ ] Notes block displays for each command
- [ ] On command switch, the field table is hidden
- [ ] Re-click on a frame hides the table

## How to Check Yourself

1. Switch between commands — description and frames should change.
2. For `basic.publish` there should be 3 frames: Method, Header, Body.
3. For `basic.ack` there should be 1 frame with a `delivery-tag` field.
4. For `connection.start` the channel-id in the frame should be 0 (reserved).
5. Click on a frame — the field table should appear. Click again — it should disappear.
6. The byte schema should be visible at all times (independent of frame selection).