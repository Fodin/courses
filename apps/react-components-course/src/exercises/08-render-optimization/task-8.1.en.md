# Task 8.1: Diagnosing and fixing unnecessary renders in a chat app

## Goal

Learn to diagnose unnecessary renders using render counters and eliminate them with a combination of `React.memo` and structural changes.

## Context

You have a simple chat app with three components:

- `MessageList` — message list (heavy, renders many elements)
- `MessageInput` — input field for new messages
- `OnlineUsers` — online users panel

Currently, on every character typed in the message field, **all** three components re-render, even though `MessageList` and `OnlineUsers` don't depend on the input text.

## Requirements

1. Add render counters to all three components (`useRef` + counter in JSX) — this will show the number of renders
2. Verify the problem is real: observe counters while typing
3. Move the input state (`inputText`) into the `MessageInput` component itself — this is the structural solution (state down)
4. Protect `MessageList` with `React.memo` — it receives a stable `messages` prop
5. Protect `OnlineUsers` with `React.memo` — it receives a stable `users` prop
6. Verify that after optimization, only `MessageInput` re-renders on typing
7. The "Send" button adds a message to the list and clears the input field

## Hints

- Render counter: `const renderCount = useRef(0); renderCount.current++`
- Display the counter directly in the component: a small badge in the corner
- `React.memo` wraps the entire component: `const MyComp = React.memo(function MyComp(...) { ... })`
- When moving state to `MessageInput`, use a prop `onSend: (text: string) => void` for sending
- Use `useCallback` for `onSend` in the parent — otherwise `React.memo` on `MessageInput` won't help

## Checklist

```
[ ] Render counters added to all three components and visible in UI
[ ] inputText state moved inside MessageInput (state down)
[ ] MessageList wrapped in React.memo
[ ] OnlineUsers wrapped in React.memo
[ ] onSend stabilized via useCallback in parent
[ ] On typing, only MessageInput re-renders (counter grows only for it)
[ ] Sending works: text appears in MessageList, field clears
[ ] After sending, MessageList renders (new data) — this is expected and correct
```

## How to check yourself

Open the component in the browser. When typing in the message field: `MessageInput` counter should grow, `MessageList` and `OnlineUsers` counters — stay put. On clicking "Send" — all counters update (this is normal: data changed).
