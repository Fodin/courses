# Task 9.2: Modal with discriminated props

## Goal

Implement a `Modal` component with three modes — `alert`, `confirm`, `form`. For each mode, TypeScript should require its own set of required props. Using the wrong combination should be impossible at compile time.

## Requirements

1. `ModalProps` type — discriminated union with three variants:
   - `variant: 'alert'` — required: `message: string`, `onClose: () => void`
   - `variant: 'confirm'` — required: `message: string`, `onConfirm: () => void`, `onCancel: () => void`
   - `variant: 'form'` — required: `title: string`, `children: React.ReactNode`, `onSubmit: () => void`, `onCancel: () => void`
2. Component renders a modal with overlay
3. Each variant has its own set of buttons and content
4. Demonstration: three buttons open three different modals. Switching between variants via state

## Hints

- Declare the union as `type ModalProps = AlertModalProps | ConfirmModalProps | FormModalProps`
- Discriminant field — `variant`; TypeScript narrows the type in each branch `if (props.variant === 'confirm') { ... }`
- For the overlay use `position: fixed, inset: 0`
- No additional "open/closed" state needed in the Modal itself — control from parent via conditional rendering

## Checklist

- [ ] `ModalProps` — discriminated union with `variant` field
- [ ] For `variant: 'confirm'` TypeScript requires `onConfirm` and `onCancel`
- [ ] For `variant: 'form'` TypeScript requires `children` and `onSubmit`
- [ ] Attempt to pass `message` to `variant: 'form'` causes a TypeScript error
- [ ] `alert` — shows message and "Close" button
- [ ] `confirm` — shows message and "Confirm" / "Cancel" buttons
- [ ] `form` — shows title, children and "Submit" / "Cancel" buttons
- [ ] Demo: three separate buttons open three different modals

## How to check yourself

Open the assignment in the browser. You should see three buttons. On click:
- "Show Alert" — modal with message and one close button
- "Show Confirm" — modal with two buttons; clicking "Confirm" logs the action
- "Show Form" — modal with a form (arbitrary children) and "Submit" button

Click on overlay may close the modal (optional, bonus requirement).
