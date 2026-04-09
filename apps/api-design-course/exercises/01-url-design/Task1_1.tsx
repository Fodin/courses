import { useState } from 'react'

// TODO: Define a Scenario interface
// Each scenario should have: id, description, method, pathParts[], queryParams, hint

// TODO: Create an array of at least 4 scenarios:
// - Get all users
// - Get a specific user by ID
// - Get all orders of user with ID = 7
// - Filter products by category with maxPrice
// Hint: pathParts is an array of path segments, e.g. ['users', '7', 'orders']

// TODO: Define available method options: GET, POST, PUT, PATCH, DELETE

// TODO: Define resource suggestions for the path builder (e.g. 'users', 'products', ...)
// TODO: Define ID suggestions (e.g. '1', '7', '42', ...)

export function Task1_1() {
  // TODO: Track current scenario index
  // Hint: useState(0)

  // TODO: Track builder state: { method: string, parts: string[], query: string }
  // Hint: useState<{ method: string; parts: string[]; query: string }>({ method: 'GET', parts: [], query: '' })

  // TODO: Track whether the user has clicked "Проверить"
  // Hint: useState(false)

  // TODO: Track whether the hint is shown
  // Hint: useState(false)

  // TODO: Compute the correct URL from the current scenario
  // Format: '/api/' + pathParts.join('/') + queryParams

  // TODO: Compute the built URL from builder state
  // Format: '/api/' + parts.join('/') + (query ? '?' + query : '')

  // TODO: Compute isCorrect by comparing builder state to scenario

  // TODO: addPart(part) — appends a segment to builder.parts
  // TODO: removeLast() — removes last segment from builder.parts
  // TODO: handleNext() — moves to next scenario, resets builder/checked/hint

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>URL-конструктор</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Соберите корректный REST endpoint для каждого сценария, выбирая компоненты по шагам.
      </p>

      {/* TODO: Render scenario card with scenario number and description */}

      {/* TODO: Method selector — render a button for each method option
           Highlight the selected method */}

      {/* TODO: Path builder
           - Row of resource suggestion buttons (onClick → addPart)
           - Row of ID suggestion buttons (onClick → addPart)
           - "← удалить" button (onClick → removeLast, disabled when parts is empty) */}

      {/* TODO: Query params input (text input, updates builder.query) */}

      {/* TODO: URL preview block — show "METHOD /api/..." using monospace font */}

      {/* TODO: Action buttons: "Проверить", "Подсказка", "Следующий →" */}

      {/* TODO: Show hint block when showHint is true */}

      {/* TODO: Show result block when checked is true
           - Green block if isCorrect
           - Red block with correct answer if wrong */}
    </div>
  )
}
