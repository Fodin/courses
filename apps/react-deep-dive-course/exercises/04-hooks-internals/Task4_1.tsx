import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from 'src/hooks'

// Task 4.1: Hooks Linked List
// Visualize hooks as a linked list and understand why order matters.

// Each hook becomes a node in a linked list stored on fiber.memoizedState.
// React traverses the list in the same order every render — that's why
// you must never call hooks conditionally.

type HookNode = {
  name: string
  memoizedState: string
  color: string
}

export function Task4_1() {
  const { t } = useLanguage()

  // TODO: add a counter state starting at 0
  const count = 0 // replace with useState

  // TODO: add useEffect that tracks the current count
  // (for now just leave a comment explaining what it would store in memoizedState)

  // TODO: add useMemo that computes count * count
  const squared = 0 // replace with useMemo

  // TODO: build the hooks array — three nodes representing the linked list:
  // Node 1: useState — memoizedState is the count value
  // Node 2: useEffect — memoizedState is the deps array (e.g. "[0]")
  // Node 3: useMemo — memoizedState is "count^2 = squared"
  const hooks: HookNode[] = [
    // TODO: fill in the three hook nodes
  ]

  return (
    <div className="exercise-container">
      <h2>{t('task.4.1')}</h2>

      {/* TODO: render a button to increment count */}
      {/* TODO: render a reset button */}

      {/* Linked list visualization */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontFamily: 'monospace' }}>
          fiber.memoizedState
        </div>

        {/* TODO: render hooks as connected boxes:
          - each box shows: hook name, memoizedState value, next pointer
          - connect boxes with arrows (→)
          - last box shows next: null
          - use inline CSS with the hook's color as border */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
          {hooks.map((hook, index) => (
            <div key={hook.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* TODO: render hook box */}
              {/* TODO: render arrow → between boxes (not after the last one) */}
            </div>
          ))}
        </div>
      </div>

      {/* TODO: add a section explaining what happens with conditional hooks */}
      {/* Show a code example (in a <pre> block) of a conditional hook */}
      {/* Explain why it breaks the linked list */}
    </div>
  )
}
