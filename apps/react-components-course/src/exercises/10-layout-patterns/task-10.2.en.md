# Task 10.2: Modal on createPortal

## Goal

Implement a `Modal` component using `createPortal`, supporting stacking of multiple modals, closing on Escape, closing on overlay click, and page scroll locking.

## Requirements

1. `Modal` renders via `createPortal` into `document.body`

2. Supports stacking of multiple modals:
   - Can open a modal on top of another modal
   - Each subsequent modal has a higher `z-index`
   - Closing works for the top modal (last opened)

3. Closing on overlay click:
   - Click on dark background closes the modal
   - Click on modal content doesn't close

4. Closing on Escape key:
   - Closes the top (last opened) modal
   - Listener is added only when the modal is open

5. Scroll locking:
   - With modal open, `document.body` has `overflow: hidden`
   - When all modals are closed, scroll is restored
   - With multiple modals open, scroll doesn't restore until all are closed

6. `Modal` accepts props:
   - `isOpen: boolean`
   - `onClose: () => void`
   - `title?: string`
   - `children: ReactNode`

## Hints

- Use `useEffect` for `keydown` subscription and `body.style.overflow` management
- Don't forget `return` with cleanup in `useEffect`
- For stacking: pass `zIndex` via prop to each modal or compute by stack index
- Simple stacking in demo: three states `isOpen1`, `isOpen2`, `isOpen3` + "Open another" buttons inside each modal
- For scroll locking with multiple modals: global counter outside component or `useRef` with counting

## Checklist

- [ ] `Modal` uses `createPortal` into `document.body`
- [ ] Overlay is dark, semi-transparent, full screen
- [ ] Click on overlay closes, click on content — doesn't
- [ ] Escape closes the modal
- [ ] With modal open, scroll is locked
- [ ] On close, scroll is restored
- [ ] Can open a modal on top of a modal (second over first)
- [ ] Event listeners are cleaned up on close/unmount

## How to check yourself

Open a modal, try scrolling the page — scroll is locked. Press Escape — modal closed, scroll returned. Open a nested modal — both conditions hold. Close the inner one — scroll still locked. Close all — scroll is free.
