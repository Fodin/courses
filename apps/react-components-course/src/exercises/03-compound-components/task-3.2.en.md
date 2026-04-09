# Task 3.2: `<Select>` Component with Keyboard Navigation

## Goal

Implement a custom Select with a declarative Compound Components-style API that supports keyboard navigation and is accessible for users with disabilities.

## Requirements

1. Create a `SelectContext` with fields: `selected: string | null`, `focusedIndex: number`, `isOpen: boolean`, `options: string[]`, functions `select(value: string)`, `toggle()`, `close()`, `setFocusedIndex(i: number)`
2. Implement `SelectRoot` — root component storing all state; accepts `onChange?: (value: string) => void` and `children`
3. Implement `Select.Trigger` — button showing selected value or placeholder `"Select..."`. Click opens/closes the list. Attributes: `aria-haspopup="listbox"`, `aria-expanded={isOpen}`
4. Implement `Select.Options` — list container (`role="listbox"`), displayed only when `isOpen === true`
5. Implement `Select.Option` — list item, accepts `value: string` and `children`; on click calls `select(value)`, visually highlighted if `selected === value` or `focusedIndex` points to it
6. Add keyboard navigation in `SelectRoot`: `ArrowDown` → next, `ArrowUp` → previous, `Enter`/`Space` → open or select, `Escape` → close
7. Close the list when clicking outside the component (`useEffect` + `addEventListener('mousedown')`)
8. Assemble `Select` via `Object.assign` and demonstrate with 5+ options

## Hints

- `Select.Option` doesn't know its own index. One approach: in `SelectRoot` collect `options` via `useMemo` from children, using `React.Children.map` to extract `value` props
- For outside click closing: `useRef` on root element + `mousedown` listener, compare `event.target` with `ref.current.contains(event.target)`
- `focusedIndex` is only needed when the list is open — reset it on close
- For `ArrowDown`/`ArrowUp` navigation use `e.preventDefault()`, otherwise the page will scroll

## Checklist

- [ ] `SelectContext` contains all required fields and functions
- [ ] `Select.Trigger` shows selected value or placeholder
- [ ] `Select.Options` hidden when `isOpen === false`
- [ ] `Select.Option` highlights the selected option
- [ ] `ArrowDown` / `ArrowUp` move focus through the list without page scrolling
- [ ] `Enter` / `Space` opens the list or selects an element
- [ ] `Escape` closes the list
- [ ] Click outside the component closes the list
- [ ] ARIA attributes are set correctly

## How to check yourself

- Open the component and control the Select only with keyboard (Tab → Select → Enter → arrows → Enter)
- Make sure the selected value is displayed in Trigger
- Click away from the Select — the list should close
- Check in the browser inspector: `aria-expanded` changes on open/close
