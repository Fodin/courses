# Task 2.3: Toggle with render prop

## Goal

Implement a `Toggle` component that manages open/closed boolean state and passes it via render prop. Based on one `Toggle`, create three fundamentally different UI elements.

---

## Requirements

1. The `Toggle` component accepts:
   - `render: (props: ToggleRenderProps) => ReactNode` — render function
   - `defaultOpen?: boolean` — initial state (default `false`)
2. `ToggleRenderProps` passes:
   - `isOpen: boolean` — current state
   - `toggle: () => void` — toggle state
   - `open: () => void` — open
   - `close: () => void` — close
3. Implement three uses of `Toggle`:
   - **Dropdown menu**: "Menu" button with ▼/▲ indicator, when opened a list of items appears
   - **Modal trigger**: "Open modal" button, when clicked an overlay with a window and close button appears
   - **Expandable section (accordion)**: section title expands/collapses content on click
4. Each of the three examples must be independent (its own `Toggle` copy — its own state)

---

## Hints

- Declare `ToggleRenderProps` type as an interface outside the component so consumers can import it
- For the modal overlay use `position: fixed`, `inset: 0`, `background: rgba(0,0,0,0.5)`
- To close the modal on overlay click — attach `close` to the outer div, and `e.stopPropagation()` to the inner window
- `defaultOpen` is best passed to `useState`: `const [isOpen, setIsOpen] = useState(defaultOpen ?? false)`

---

## Checklist

- [ ] `ToggleRenderProps` interface declared with `isOpen`, `toggle`, `open`, `close`
- [ ] `Toggle` component accepts `render` and `defaultOpen`
- [ ] Dropdown: list appears/hides on button click, indicator changes
- [ ] Modal: overlay appears above content, closes via "×" button or click outside window
- [ ] Expandable section: content expands/collapses, title is clickable
- [ ] Three examples are independent of each other

---

## How to check yourself

Open the dropdown — the modal and accordion should not react. Open the modal by clicking the overlay (not the window) — it should close. Verify that each Toggle has its own isolated state.
