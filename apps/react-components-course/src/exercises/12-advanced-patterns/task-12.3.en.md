# Task 12.3: Checkout flow on state machine

## Goal

Implement a multi-step checkout process via state machine on `useReducer`. Each state is a discriminated union. Transitions between states — the only way to change the flow. TypeScript should protect from accessing data that doesn't exist in the current state.

## Requirements

1. States: `idle` → `shipping` → `payment` → `confirmation` → possible `error` from any state
2. `CheckoutState` type — discriminated union with `status` field
3. `confirmation` state contains `orderId: string` and `shipping: ShippingData`
4. `error` state contains `message: string`
5. Typed actions: `START_CHECKOUT`, `SUBMIT_SHIPPING`, `SUBMIT_PAYMENT`, `CONFIRM_ORDER`, `SET_ERROR`, `RESET`
6. Reducer protects from invalid transitions: `SUBMIT_PAYMENT` works only from `payment`
7. UI displays current step: progress bar or numbered stepper
8. "Simulate error" button available on `shipping` and `payment` steps

## Hints

- `interface ShippingData { name: string; address: string; city: string }`
- Transition protection in reducer: `if (state.status !== 'payment') return state`
- Rendering by state via `switch (state.status)` or conditional rendering
- Progress bar: array of steps `['idle', 'shipping', 'payment', 'confirmation']`, current step — index
- Order confirmation simulation: `Math.random().toString(36).slice(2, 10).toUpperCase()`

## Checklist

- [ ] `CheckoutState` — discriminated union with `status` field
- [ ] `ShippingData` type with required fields
- [ ] Reducer: each case checks transition validity
- [ ] From `confirmation` state cannot go to `shipping` or `payment` directly
- [ ] TypeScript: in `idle` state cannot access `state.shipping`
- [ ] UI changes on state change
- [ ] Progress bar or stepper shows current step
- [ ] Reset button returns to `idle`
- [ ] Error shows message and retry button

## How to check yourself

Open the assignment. Go through the entire flow:
1. Click "Checkout" → transition to `shipping`
2. Fill in form → transition to `payment`
3. Click "Pay" → transition to `confirmation` with order number
4. Click "Simulate error" on `payment` step → transition to `error`
5. Click "Retry" → return to `payment`
6. Click "Reset" → return to `idle`

Verify: in DevTools React — no `isLoading`/`isError` flags, only `status`.
