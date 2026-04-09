# Task 12.4: Capstone — mini UI library

## Goal

Create a mini library of four components (`Button`, `Input`, `Modal`, `Select`), applying all course patterns: polymorphic API, compound components, context, forwardRef, Error Boundaries, and headless logic. All components are configured via `UIKitProvider`.

## Requirements

### UIKitProvider
- `UIKitConfig`: `colorScheme: 'light' | 'dark'`, `primaryColor: string`, `size: 'compact' | 'normal' | 'large'`
- `useUIKit()` hook reads config from context
- Reasonable defaults, components work without provider

### Button
- Polymorphic: `as` prop with default `'button'`
- `variant`: `'primary' | 'secondary' | 'ghost' | 'danger'`
- `size`: overrides `config.size` locally
- `forwardRef` for DOM element access
- `isLoading` prop: shows spinner, blocks clicks

### Input
- `forwardRef` with type `HTMLInputElement`
- `error?: string` — shows error message below field
- `label?: string` — associated `<label>` via id
- Controlled + uncontrolled via native mechanism (`value` vs `defaultValue`)
- `aria-invalid` when `error` is present

### Modal
- Renders via `createPortal` into `document.body`
- Context for sub-components: `Modal.Header`, `Modal.Body`, `Modal.Footer`
- `isOpen` + `onClose` — controlled
- Overlay click closes modal
- Wrapped in `ErrorBoundary` — error in body doesn't crash the app

### Select
- Uses `useDropdown` hook from task 12.2
- Compound: `Select.Trigger`, `Select.Option`
- `value` + `onChange` — controlled
- ARIA: `combobox` role on trigger, `listbox` on list

### Demo
- Theme toggle (light/dark) via `UIKitProvider`
- All four components demonstrated on one screen
- Event log (clicks, selections, submits)

## Hints

- `createPortal(children, document.body)` — Modal renders outside the tree
- `forwardRef` + displayName for DevTools convenience
- `useId()` (React 18) — unique id for label + input
- Error Boundary around Modal.Body: `<ErrorBoundary fallback={...}>`
- Button isLoading: `pointer-events: none` + SVG spinner via CSS animation

## Checklist

- [ ] `UIKitProvider` + `useUIKit` hook work
- [ ] Button: polymorphic `as`, `variant`, `size`, `isLoading`, `forwardRef`
- [ ] Input: `forwardRef`, `label`, `error`, `aria-invalid`
- [ ] Modal: portal, overlay click, sub-components via context, ErrorBoundary
- [ ] Select: `useDropdown` hook inside, controlled API, ARIA
- [ ] All components use `config.primaryColor` from provider
- [ ] Theme toggle changes appearance of all components
- [ ] Log displays interaction events

## How to check yourself

Open the assignment. Verify:
- Switch theme — all components recolor
- Open Modal, break the content — ErrorBoundary shows fallback, app doesn't crash
- Button `as="a"` with href — TypeScript suggests `target`, doesn't suggest `disabled`
- Input with `error` — red border + message + `aria-invalid="true"` in DOM
- Select — keyboard navigation works (Tab + Enter optionally)
