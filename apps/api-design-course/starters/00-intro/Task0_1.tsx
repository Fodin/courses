import { useState } from 'react'

// TODO: Define an interface for an API comparison pair
// Each pair should have: id, category, bad (label + code), good (label + code), explanation, problemsInBad[]

// TODO: Create an array of at least 3 comparison pairs covering different aspects:
// - URL design (e.g. action tunneling vs REST resources)
// - Response format (e.g. HTTP 200 for errors vs proper status codes)
// - Field naming (e.g. mixed case styles vs consistent camelCase)

export function Task0_1() {
  // TODO: Add state to track which pairs have their explanation revealed
  // Hint: useState<Set<number>>(new Set())

  // TODO: Add a handler to toggle a single pair's revealed state

  // TODO: Add a handler to reveal all pairs at once

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>Хороший vs плохой API</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Изучите каждую пару примеров. Попробуйте найти проблемы в «плохом» варианте,
        а потом нажмите «Показать разбор».
      </p>

      {/* TODO: Add "Показать все разборы" button */}

      {/* TODO: Map over your pairs array and render:
           - A header with pair number and category
           - Two columns: bad example (red/❌) and good example (green/✅)
             Both with <pre> blocks showing the code
           - A "Показать разбор" button
           - An explanation block (hidden by default, revealed on button click)
             containing: explanation text + list of problems in the bad example
      */}
    </div>
  )
}
