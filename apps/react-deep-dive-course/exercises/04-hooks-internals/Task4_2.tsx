import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Task 4.2: useState Under the Hood
// Implement a simplified version of useState using a global array.
// This simulates how React stores hook state in fiber.memoizedState.

// Global storage — simulates fiber.memoizedState as an array of slots
const stateStorage: unknown[] = []
let cursor = 0
let reRenderCallback: (() => void) | null = null

// TODO: implement myUseState<T>(initialValue: T): [T, (newValue: T) => void]
//
// Rules:
// 1. Read the current slot index from `cursor`, then increment cursor
// 2. If stateStorage[slotIndex] is undefined — initialize it with initialValue (mount)
// 3. Return the current value from stateStorage[slotIndex]
// 4. Return a setter that updates stateStorage[slotIndex] and calls reRenderCallback
//
function myUseState<T>(initialValue: T): [T, (newValue: T) => void] {
  // TODO: implement this function
  return [initialValue, () => {}] // placeholder
}

export function Task4_2() {
  const { t } = useLanguage()

  // Real React useState to trigger actual re-renders
  const [, forceUpdate] = useState(0)

  // Register the re-render callback so myUseState setters can trigger React re-renders
  reRenderCallback = () => forceUpdate(n => n + 1)

  // TODO: reset cursor to 0 before each render
  // (this simulates React resetting the hook index before traversing the linked list)

  // TODO: call myUseState(0) for the count
  // TODO: call myUseState('React') for the name

  // Cycle through framework names for the name button
  const names = ['React', 'Vue', 'Angular', 'Svelte']
  // TODO: compute nextName based on current name

  return (
    <div className="exercise-container">
      <h2>{t('task.4.2')}</h2>

      {/* TODO: render two cards side by side:
        Card 1: shows count from stateStorage[0], button to increment
        Card 2: shows name from stateStorage[1], button to cycle names

        Each card should display:
        - Label: stateStorage[0] or stateStorage[1]
        - Large value display
        - Action button */}

      {/* TODO: render debug info panel showing:
        - stateStorage array contents
        - cursor value after render
        - Comment explaining that cursor resets to 0 each render */}
    </div>
  )
}
