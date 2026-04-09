# Task 6.2: Notification System

## Goal

Implement a toast notification system with queue, auto-dismiss by timer, support for types (info/success/warning/error), and manual dismissal.

## Requirements

1. Define `Notification` type with fields: `id: string`, `message: string`, `type: 'info' | 'success' | 'warning' | 'error'`, `duration: number`
2. Create `NotificationContext` with interface `{ notify, dismiss }`:
   - `notify(message, type?, duration?)` — adds a notification to the queue
   - `dismiss(id)` — removes a notification by ID
3. Implement `useNotifications()` hook with null check
4. In `NotificationProvider`:
   - Store array of active notifications in state
   - For each notification with `duration > 0` start an auto-dismiss timer
   - Store timers in `useRef<Map<string, ReturnType<typeof setTimeout>>>`
   - On `dismiss` — clear timer via `clearTimeout`
   - On unmount — clear all timers via `useEffect` cleanup
   - Wrap `notify` and `dismiss` in `useCallback`
5. Implement `NotificationContainer` — positioned fixed in the top right corner, displays notification stack, each has a close button
6. Each notification type has its own background color, border color, and icon
7. Notification with `duration = 0` doesn't auto-close

## Hints

- Unique ID: `` `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` ``
- `useCallback` for `dismiss` with empty dependency array, for `notify` — with dependency `[dismiss]`
- Ref cleanup pattern in useEffect: `const timers = timersRef.current; return () => timers.forEach(clearTimeout)`
- `NotificationContainer` is conveniently rendered directly inside `NotificationProvider`, not at the app root

## Checklist

- [ ] Notifications of different types display with different colors
- [ ] Auto-dismiss works after specified time
- [ ] Notification can be closed manually with a button
- [ ] With `duration = 0` notification stays until manually dismissed
- [ ] Timers are properly cleared on manual dismissal (no duplicate dismiss calls)
- [ ] `useNotifications()` is used in demo component to call `notify`
- [ ] Notifications display as a stack, not overlapping each other

## How to check yourself

Click several buttons in a row — notifications should accumulate in a stack. Quickly click error (6s) and success (4s) — success should disappear first. Click "permanent" — it should not disappear on its own. Close the permanent one manually and make sure other notifications are not affected.
