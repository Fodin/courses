# Task 7.1: MFE Navigation Simulator

## Goal

Implement an interactive simulator that clearly demonstrates how the Shell-Router coordinates navigation between multiple MFEs — including pushState conflict visualization and deep linking mechanism.

## Requirements

1. Display a "browser address bar" at the top — shows the current URL in format `http://app.example.com/path`. When an active MFE mounts, shows a colored badge with its name.

2. Implement a Shell navigation panel with four routes:
   - Home (`/`) — no MFE
   - Catalog (`/catalog`) — mounts Catalog MFE
   - Cart (`/cart`) — mounts Cart MFE
   - Profile (`/profile`) — mounts Profile MFE

   On click: update URL, log events `Shell: navigate to /path`, `MFE: unmounted` (for previous) and `MFE: mounted`.

3. When MFE is active, show its internal routes panel:
   - Catalog: `/catalog`, `/catalog/search`, `/catalog/:id`
   - Cart: `/cart`, `/cart/checkout`, `/cart/confirm`
   - Profile: `/profile`, `/profile/orders`, `/profile/settings`

   On internal route click: update URL, log `MFE: internal navigate to /path`.

4. "Conflict!" button — simulates race condition: Cart MFE tries to navigate to `/cart/checkout`, while Catalog MFE simultaneously tries `/catalog/42`. Show a visual block explaining the problem and three log entries (both attempts + error).

5. "Deep link" button — opens a mini-form with URL input field and example links. On navigation: update URL, activate the correct MFE, log 3 events (deep link received, Shell recognized MFE, MFE mounted with initialPath).

6. Color-coded navigation events log: green (Shell), blue (MFE lifecycle), orange (conflict), purple (deep link), red (error). Log clear button.

## Checklist

- [ ] URL in address bar updates on every transition
- [ ] Shell navigation mounts/unmounts MFEs with log entries
- [ ] Internal route buttons appear only for active MFE
- [ ] "Conflict!" click shows explanation block and 3 log entries
- [ ] Deep link opens form with examples, navigation activates correct MFE
- [ ] Each event type has its own color in the log
- [ ] Log auto-scrolls to the latest event

## How to Check Yourself

1. Click "Catalog" — URL should become `/catalog`, 2 entries appear in log.
2. Click `/catalog/search` inside Catalog — URL changes to `/catalog/search`.
3. Click "Cart" — Catalog MFE unmounts, Cart MFE mounts.
4. Click "Conflict!" — orange block appears, 3 log entries.
5. Click "Deep link", enter `/profile/orders`, click "Go" — Profile MFE activates, 3 events in log.
