# Task 5.1 — Shadow DOM Isolation Visualizer

## Goal

Create an interactive visualizer that clearly shows Shadow DOM principles: style isolation, CSS Custom Properties penetration, slot mechanism, and CustomEvent communication.

## Requirements

1. **"Styles" tab** — two blocks side by side: "Light DOM" and "Shadow DOM"
   - Control panel: text color buttons (at least 3 options), background (at least 3 options), font size (3 options)
   - On style change: styles apply in Light DOM block, but not in Shadow DOM block
   - DOM tree visualization for each block (tag → child elements → shadow-root)

2. **"CSS Custom Properties" tab** — two controls for setting `--mf-primary` and `--mf-accent`
   - Show clearly that CSS variables penetrate Shadow DOM
   - Show the CSS contract: how the component publishes its styling API via `var(--name, default)`

3. **"Slots" tab** — text input for entering content
   - Content from input displays in the default slot of the Shadow DOM component
   - Show the diagram: Light DOM content → slot → displayed inside Shadow DOM
   - Show the difference between default slot and named slot (`slot="footer"`)

4. **"Events" tab** — buttons for dispatching CustomEvent
   - "Dispatch from Shadow DOM" button with `composed: true` — event reaches window
   - "Dispatch from Light DOM" button with `composed: false` — event doesn't bubble
   - Event log: show timestamp, source, event name, detail
   - Show code: how to create a CustomEvent and how to subscribe to it

5. **Event log** auto-scrolls down on new entries

6. All styles — inline (no CSS files)

## Checklist

- [ ] Both blocks (Light DOM and Shadow DOM) visible side by side
- [ ] When global styles change, Light DOM updates, Shadow DOM stays the same
- [ ] CSS Custom Properties change in both blocks
- [ ] Slot displays text from input
- [ ] Two event types (composed true/false) — different behavior in log
- [ ] DOM tree visualization (host → shadow-root → elements)
- [ ] Event log works and scrolls

## How to Check Yourself

1. Change text color to "Red" — Light DOM changes, Shadow DOM does not
2. Change `--mf-primary` — color changes in Shadow DOM too (CSS vars penetrate)
3. Enter text in the slot field — it appears inside the Shadow DOM component
4. Click "Dispatch from Shadow DOM" — event appears in log via `window`
5. DOM tree shows structure `host → #shadow-root → slot`
