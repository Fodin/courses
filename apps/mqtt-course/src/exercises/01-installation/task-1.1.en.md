# Task 1.1: Installing Mosquitto via opkg

## Goal

Master the step-by-step process of installing Mosquitto on OpenWRT. Implement an interactive step-by-step guide with the ability to mark completed steps, view command output, and track progress.

---

## Requirements

1. Define the `InstallStep` interface with fields: `id`, `command`, `description`, `output` (expected output), `category` (`'prepare' | 'install' | 'verify'`)

2. Create an `installSteps` array with at least 6 steps covering: `opkg update`, broker installation, client utilities installation, enabling auto-start, starting, and verification

3. Implement a progress bar at the top of the component showing the number of completed steps and percentage. At 100%, show a congratulation message.

4. Each step is displayed as a card with:
   - A checkbox (click marks the step as completed)
   - Number and command in monospace font
   - Category badge (colored)
   - Copy command to clipboard button
   - Arrow to expand/collapse details

5. When a step is expanded, show: description and expected output (in terminal style, if available) or a "No output" explanation

6. Categories must have different colors: prepare (blue), install (purple), verify (green)

---

## Checklist

- [ ] Defined `InstallStep` interface with `category` field
- [ ] Array of 6+ steps with realistic OpenWRT/Mosquitto commands
- [ ] Progress bar with animated fill
- [ ] Completed step counter (X/N, percentage)
- [ ] Each step is an expandable card
- [ ] Checkbox marks step as completed (card color changes)
- [ ] Copy button (with visual confirmation ✓)
- [ ] Expected output in terminal style (dark background)
- [ ] Colored category badges
- [ ] Congratulation message at 100% completion
- [ ] Correct TypeScript typing

---

## How to Check Yourself

1. Do you see a progress bar with "0/N (0%)"?
2. Click the checkbox on the first step — did progress change, card turned green?
3. Click the arrow on the `opkg install mosquitto-nossl` step — do you see installation output?
4. Click the copy icon — did the button change to "✓"?
5. Mark all steps — does a congratulation appear?
