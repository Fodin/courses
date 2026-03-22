// ============================================
// Level 4: useOptimistic — Hints
// ============================================

// Task 4.1: Basic useOptimistic
// ------------------------------
// 1. Import useOptimistic from 'react'
// 2. Signature: const [optimisticState, setOptimistic] = useOptimistic(actualState)
// 3. You can also pass a reducer: useOptimistic(state, (current, optimisticValue) => newState)
// 4. Call setOptimistic inside an async action before awaiting the server call
// 5. When the action completes and real state updates, optimistic state auto-syncs
// 6. Example:
//    const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked)
//    async function toggleLike() {
//      setOptimisticLiked(!liked)
//      await api.toggleLike()
//      setLiked(!liked)
//    }

// Task 4.2: Optimistic List
// --------------------------
// 1. Use useOptimistic with a reducer function for arrays
// 2. const [optimisticItems, addOptimisticItem] = useOptimistic(
//      items,
//      (state, newItem) => [...state, newItem]
//    )
// 3. Add a temporary item optimistically, then confirm with real data
// 4. Mark optimistic items with a `sending` flag for visual distinction
// 5. Render optimisticItems instead of items in the list

// Task 4.3: Rollback on Error
// ----------------------------
// 1. useOptimistic automatically reverts when the action's parent transition ends
// 2. Wrap the action in startTransition or use it inside a form action
// 3. If the async operation fails, do NOT update the real state — the optimistic state reverts
// 4. Pattern:
//    async function action() {
//      setOptimistic(newValue)
//      try {
//        await serverCall()
//        setRealState(newValue)  // confirm
//      } catch {
//        // don't update real state — optimistic value auto-reverts
//        showError('Failed')
//      }
//    }

export {}
