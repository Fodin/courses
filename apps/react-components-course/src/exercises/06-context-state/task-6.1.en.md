# Task 6.1: Cart with useReducer + separate Contexts

## Goal

Implement a full shopping cart with `useReducer` for state management and two separate contexts — for state and dispatch.

## Requirements

1. Define types `CartItem`, `CartState`, `CartAction` (discriminated union with `ADD`, `REMOVE`, `INCREMENT`, `DECREMENT`, `CLEAR`)
2. Implement `cartReducer(state, action): CartState` — pure function without mutations
3. Create two contexts: `CartStateContext` and `CartDispatchContext` — they must be strictly separated
4. Implement `CartProvider` — wraps both contexts, uses `useReducer` inside
5. Create hooks `useCartState()` and `useCartDispatch()` with null check and clear error message
6. `CartBadge` component — shows cart icon and total item count; subscribed only to `CartStateContext`
7. `AddToCartButton` component — add to cart button; changes appearance if item is already in cart
8. `CartDrawer` component — side drawer with item list: quantity change (+/−), removal, total amount, "Checkout" button (calls `CLEAR`)
9. `Task6_1` component — catalog of at least 3 items and a button to open the drawer with `CartBadge`

## Hints

- `useReducer` returns `[state, dispatch]`. `dispatch` is stable — React guarantees unchanging reference
- In `ADD` case: if item already exists — increment `quantity`, otherwise add with `quantity: 1`
- In `DECREMENT` case: after quantity change, filter out items with `quantity <= 0`
- For the drawer use `position: fixed` with `right: 0, top: 0, bottom: 0`
- Calculate total via `items.reduce((sum, i) => sum + i.price * i.quantity, 0)`

## Checklist

- [ ] `cartReducer` — pure function, handles all 5 action types
- [ ] `CartProvider` uses `useReducer` and wraps two separate contexts
- [ ] `useCartState` and `useCartDispatch` throw error outside Provider
- [ ] `CartBadge` displays correct item count
- [ ] `AddToCartButton` changes appearance (color/text) if item is already in cart
- [ ] `CartDrawer` allows changing quantity and removing items
- [ ] No shared `{ state, dispatch }` object in one provider

## How to check yourself

Add several items — the counter on the button should update. Open the drawer — make sure you can change quantities (at 0 — item is removed). Click "Checkout" — cart is cleared. Make sure `AddToCartButton` doesn't blink when changing quantity of an already added item (this means dispatch components are stable).
