# Task 8.3: Type-level State Machine

## Objective

Implement a document state machine (Draft -> Review -> Published) where allowed transitions are enforced at the TypeScript type level. Invalid transitions (e.g., Draft -> Published) produce a compile error.

## Requirements

1. Define state marker types:
   - `DraftState` with field `readonly _state: 'draft'`
   - `ReviewState` with field `readonly _state: 'review'`
   - `PublishedState` with field `readonly _state: 'published'`
2. Define `DocumentData` with fields `title`, `content`, `author`
3. Create a `TypedDocument<S>` class with:
   - `constructor(data: DocumentData, state: string)`
   - `submitForReview(this: TypedDocument<DraftState>): TypedDocument<ReviewState>`
   - `publish(this: TypedDocument<ReviewState>): TypedDocument<PublishedState>`
   - `requestChanges(this: TypedDocument<ReviewState>): TypedDocument<DraftState>`
   - `editContent(this: TypedDocument<DraftState>, content: string): TypedDocument<DraftState>`
   - `describe(): string` — available in any state
4. Create a factory `createDraft(data: DocumentData): TypedDocument<DraftState>`
5. Define a type-level transition map:
   - `TransitionMap` — mapping of state to allowed target states
   - `CanTransition<From, To>` — conditional type returning `true`/`false`
6. Demonstrate the full document lifecycle, including a return for revisions

## Checklist

- [ ] Each state is a separate marker interface
- [ ] The `this` parameter restricts method calls to a specific state
- [ ] `publish()` can **only** be called on `TypedDocument<ReviewState>`
- [ ] `editContent()` can **only** be called on `TypedDocument<DraftState>`
- [ ] `Published` is a terminal state with no transition methods
- [ ] `TransitionMap` and `CanTransition` are defined as type-level utilities
- [ ] Each method returns a **new** instance (immutability)

## How to Verify

1. Click the run button — the full cycle Draft -> Review -> Draft -> Review -> Published
2. Try calling `draft.publish()` — there should be a compile error
3. Try calling `published.editContent("x")` — there should be a compile error
4. Confirm that `requestChanges` returns a Draft document and that `editContent` becomes available again
