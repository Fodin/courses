# Task 12.2: Headless useDropdown + Dropdown compound component

## Goal

Implement a headless `useDropdown` hook with all logic and ARIA attributes, then build a `Dropdown` compound component with default UI on top of it. The user should be able to use either the hook directly or the ready compound component.

## Requirements

1. `useDropdown(options)` hook returns: `isOpen`, `selected`, `triggerProps`, `listboxProps`, `getOptionProps(option)`, `close`
2. `triggerProps` includes ARIA: `aria-haspopup: 'listbox'`, `aria-expanded: boolean`
3. `getOptionProps(option)` returns `role: 'option'`, `aria-selected: boolean`, `onClick`
4. `Dropdown` — compound component: `<Dropdown.Trigger>`, `<Dropdown.List>`, `<Dropdown.Option>`
5. `Dropdown` uses context to pass hook data to sub-components
6. Demo: one `Dropdown` via compound API + one custom UI via hook directly
7. Close on click outside component (via `useEffect` + `document.addEventListener`)

## Hints

- Compound context: `const DropdownContext = createContext<UseDropdownReturn | null>(null)`
- Context guard: `if (!ctx) throw new Error('...')`
- Assigning sub-components: `Dropdown.Trigger = function DropdownTrigger(...)`
- `useRef` on container + `mousedown` listener for outside click closing
- `useEffect(() => { ... return () => document.removeEventListener(...) }, [isOpen])`

## Checklist

- [ ] `useDropdown` hook returns all required fields
- [ ] ARIA attributes included in `triggerProps` and `getOptionProps`
- [ ] `Dropdown.Trigger` uses `triggerProps` from context
- [ ] `Dropdown.List` renders only when `isOpen === true`
- [ ] `Dropdown.Option` uses `getOptionProps` from context
- [ ] Selected option visually marked
- [ ] Component closes on outside click
- [ ] Custom UI via hook works independently of Dropdown compound
- [ ] TypeScript: all hook return types explicitly described via interface

## How to check yourself

Open the assignment. You should see:
- `Dropdown` via compound API — selection displayed in trigger
- Custom UI with same data from hook — works independently
- In DevTools Elements: trigger button has `aria-haspopup="listbox"` and `aria-expanded`
- Click outside both dropdowns — both close
