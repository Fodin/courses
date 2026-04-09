# Task 6.3: Generic createStore

## Goal

Create a factory function `createStore<S, A>` that eliminates code duplication when creating Provider + Context pairs, and demonstrate selectors working on a todo list example.

## Requirements

1. Implement `createStore<S, A>(reducer, initialState)` returning an object with three elements:
   - `Provider: React.FC<{ children: React.ReactNode }>` — provider component with `useReducer` inside
   - `useStore<R>(selector: (state: S) => R): R` — hook with selector
   - `useDispatch(): React.Dispatch<A>` — hook for dispatch
2. Inside `createStore`, two contexts are created: for state and dispatch (as in task 6.1)
3. Define types for the todo app:
   - `Todo { id, text, done }`
   - `TodoState { todos: Todo[], filter: 'all' | 'active' | 'done' }`
   - `TodoAction` — discriminated union with `ADD`, `TOGGLE`, `REMOVE`, `SET_FILTER`
4. Implement `todoReducer` and initial state with 2-3 test tasks
5. Create the store via factory: `const { Provider, useStore, useDispatch } = createStore(todoReducer, initialState)`
6. Implement at least 3 components, each subscribed to its own slice via selector:
   - `TodoList` — list with filtering (selector filters based on `state.filter`)
   - `TodoStats` — counters for total/done/active
   - `TodoFilters` — filter toggle buttons
7. Task addition form component with `onSubmit`
8. All components wrapped in `Provider` in `Task6_3`

## Hints

- `createContext` can be called inside a function — each `createStore` call creates a new context pair
- Return types in TypeScript: `{ Provider: React.FC<{children: ReactNode}>, useStore: <R>(sel: (s: S) => R) => R, useDispatch: () => Dispatch<A> }`
- Selector in `TodoList`: `useStore(s => s.filter === 'active' ? s.todos.filter(t => !t.done) : ...)`
- `TodoStats` can be implemented with three separate `useStore` calls with different selectors

## Checklist

- [ ] `createStore` typed with two generic parameters `<S, A>`
- [ ] `Provider` uses `useReducer` inside
- [ ] `useStore` accepts a typed selector
- [ ] `TodoList` filters via selector, not outside it
- [ ] `TodoStats` subscribed only to counters (not to `filter`)
- [ ] `TodoFilters` subscribed only to `filter`
- [ ] Adding, toggling, and removing tasks works
- [ ] Filter switching doesn't cause `TodoStats` re-render (one store, different subscriptions)

## How to check yourself

Add several tasks. Mark some as done. Switch filters — the list should update. Counters should show actual numbers for any filter. Delete a task — the "Total" counter should decrease. Try creating a second store via `createStore` with a different reducer — make sure they are independent.
