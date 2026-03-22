# Task 8.4: Testing Stores

## Goal

Learn to test MobX stores as regular classes — without rendering React components.

## Requirements

Create a `CartStoreForTest` and a built-in test runner:

1. `CartStoreForTest` with observable `items: { name, price, qty }[]`
2. Method `addItem(name, price)` — adds an item with qty = 1
3. Computed `totalPrice` — sum of `price * qty` for all items
4. Computed `itemCount` — number of items
5. Method `clear()` — clears the cart
6. Function `runTests()` with tests:
   - Store starts empty (itemCount === 0, totalPrice === 0)
   - `addItem` adds an item and updates totalPrice
   - totalPrice correctly calculates the sum of multiple items
   - `clear` removes all items
7. UI: "Run Tests" button and display of PASS/FAIL results

```typescript
class CartStoreForTest {
  items: { name: string; price: number; qty: number }[]
  addItem(name: string, price: number): void
  get totalPrice(): number
  get itemCount(): number
  clear(): void
}
```

## Checklist

- [ ] `CartStoreForTest` created with `makeAutoObservable`
- [ ] `addItem` correctly adds an item with qty = 1
- [ ] `totalPrice` computes the sum of `price * qty`
- [ ] `clear` empties the items array
- [ ] At least 4 tests are written
- [ ] All tests pass (PASS) when the button is clicked
- [ ] Results are displayed with color coding (green/red)

## How to verify

1. Click the "Run Tests" button
2. All tests should display as PASS (in green)
3. Try temporarily breaking the store logic (e.g., remove `* qty` from `totalPrice`) — the corresponding test should become FAIL
4. Verify that a counter is displayed: `N/N passed`
