# Task 9.3: Final Project — Kanban Board

## Goal

Create a kanban board that combines all MobX concepts learned: observable, action, computed, and granular observer.

## Requirements

Create a `KanbanStore` and kanban board components:

1. Interfaces `Card { id, title }` and `Column { id, title, cards }`
2. `KanbanStore` with observable `columns` — an array of 3 columns: Todo, In Progress, Done
3. Method `addCard(columnId, title)` — adds a card to a column
4. Method `removeCard(columnId, cardId)` — removes a card from a column
5. Method `moveCard(cardId, fromColId, toColId)` — moves a card between columns
6. Computed `totalCards` — total number of cards across all columns
7. Component `KanbanColumn` — a separate `observer` for each column
8. Inside a column: card list, buttons to move to other columns, input field for a new card

```typescript
interface Card {
  id: string
  title: string
}

interface Column {
  id: string
  title: string
  cards: Card[]
}

class KanbanStore {
  columns: Column[]
  addCard(columnId: string, title: string): void
  removeCard(columnId: string, cardId: string): void
  moveCard(cardId: string, fromColId: string, toColId: string): void
  get totalCards(): number
}
```

## Checklist

- [ ] `KanbanStore` created with `makeAutoObservable`
- [ ] 3 columns initialized with initial cards
- [ ] `addCard` adds a card with a unique id (`crypto.randomUUID()`)
- [ ] `removeCard` removes a card from the specified column
- [ ] `moveCard` moves a card from one column to another
- [ ] `totalCards` correctly counts the total number of cards
- [ ] `KanbanColumn` is wrapped in `observer` for granular rendering
- [ ] New cards can be added via the input field
- [ ] Cards can be deleted with a button
- [ ] Cards can be moved between columns

## How to verify

1. Add a card to the "Todo" column — it should appear, `totalCards` increases
2. Move a card from "Todo" to "In Progress" — the card disappears from the first column and appears in the second
3. Delete a card — it disappears, `totalCards` decreases
4. Verify that card counters in column headers update correctly
5. Check that `totalCards` always equals the sum of cards across all columns
