# Task 10.3: Tooltip and Popover via portals

## Goal

Implement `Tooltip` and `Popover` components via `createPortal` with positioning relative to a trigger element and viewport boundary handling.

## Requirements

1. `Tooltip` — simple floating tooltip:
   - Appears on hover (`onMouseEnter` / `onMouseLeave`)
   - Renders into `document.body` via `createPortal`
   - Positions relative to trigger element via `getBoundingClientRect`
   - Supports `placement: 'top' | 'bottom' | 'left' | 'right'` (default: `'top'`)
   - Doesn't go outside viewport boundaries (adjusts position as needed)

2. `Popover` — floating panel with content:
   - Opens/closes on trigger click
   - Renders into `document.body` via `createPortal`
   - Positions relative to trigger element
   - Closes on click outside popover (via `mousedown` on document)
   - Supports `children: ReactNode` as content

3. Viewport boundary handling for both components:
   - If tooltip doesn't fit on top — show on bottom (auto-flip)
   - If tooltip goes off left/right edge — shift horizontally

4. Demo:
   - Several buttons with `Tooltip` in different directions (top, bottom, left, right)
   - Buttons at screen edges — tooltip doesn't go off viewport
   - Button with `Popover` containing a form or list

## Hints

- Use `useRef` for trigger element: `const triggerRef = useRef<HTMLButtonElement>(null)`
- Tooltip position: `triggerRef.current.getBoundingClientRect()` + `window.scrollY/scrollX`
- Recalculate position on each show (in `useEffect` depending on `isVisible`)
- For auto-flip: compare `rect.top` with tooltip height — if doesn't fit, change placement
- For Popover close on outside click: `document.addEventListener('mousedown', handler)` with check via `popoverRef.current.contains(event.target)`
- `pointerEvents: 'none'` on tooltip — it should not intercept mouse events

## Checklist

- [ ] `Tooltip` appears on hover and hides on mouse leave
- [ ] `Tooltip` renders via `createPortal` into `document.body`
- [ ] `Tooltip` position is correctly computed relative to trigger
- [ ] `Tooltip` at right edge doesn't go off viewport (shifts left)
- [ ] `Tooltip` at bottom edge of screen displays on top (auto-flip)
- [ ] `Popover` opens/closes on click
- [ ] `Popover` closes on outside click
- [ ] `Popover` renders via `createPortal`
- [ ] No event listener leaks (cleanup in useEffect)

## How to check yourself

Hover a button at the right edge — tooltip should be fully visible, not going off screen. Hover a button at the bottom edge — tooltip should appear on top. Open Popover and click elsewhere — it should close. Open several tooltips in a row — the previous one should hide correctly.
