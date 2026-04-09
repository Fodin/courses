# Task 8.1: Event Bus Visualizer

## Goal

Build an interactive visualizer demonstrating a typed event bus between three MFEs (Catalog, Cart, Profile): event dispatch, subscription management, and event log.

## Requirements

1. Display three colored MFE blocks: Catalog (blue), Cart (green), Profile (purple)
2. In each block — buttons for dispatching two events named in `mfe:action` format
3. On event dispatch: determine subscribers and add entry to log
4. Show animated arrow indicators from sender to receivers (1.2 seconds)
5. Receiver block highlights with a glow while receiving the event
6. Implement subscription table with on/off toggles for each event→MFE pair
7. Event sender cannot be its own subscriber (no buttons, shows "emit")
8. Event log in dark terminal style with auto-scroll to last entry
9. "Clear" button to reset the log

## Checklist

- [ ] Three MFE blocks in a row with colors: Catalog (#2196f3), Cart (#4caf50), Profile (#9c27b0)
- [ ] 2 event buttons in each block (6 events total)
- [ ] Event format: `catalog:add-to-cart`, `cart:checkout-started`, `profile:logout` etc.
- [ ] Arrow animation on event dispatch (visible 1200ms → disappears)
- [ ] Receiver block glows when receiving event
- [ ] Subscription table: rows = events, columns = MFEs, cells = on/off or "emit"
- [ ] Initial subscriptions: catalog:add-to-cart → cart, profile; cart:checkout-started → profile; profile:logout → catalog, cart; profile:address-updated → cart
- [ ] Log: [timestamp] Sender → emit event-name payload • receivers
- [ ] Log auto-scrolls down on new entry
- [ ] "Clear" button resets log
- [ ] If no subscribers — shows "no subscribers"
- [ ] All styles inline

## How to Check

1. Click "Add to Cart" button in Catalog block — Cart and Profile should glow
2. Disable Profile subscription to `catalog:add-to-cart` event via table
3. Click again — now only Cart should glow
4. Click "Logout" in Profile — Catalog and Cart should glow
5. Log should show entries with timestamps and receiver list
6. Disable all subscriptions for an event — log should show "no subscribers"
