import { useState } from 'react'

// TODO: Define a CrudEndpoint interface with fields:
// method, url, description, requestExample (string | null), responseExample, statusCode

// TODO: Create tasksApi array with 6 endpoints for /tasks resource:
// GET    /api/tasks          — list with query params
// POST   /api/tasks          — create, returns 201
// GET    /api/tasks/:id      — get by id
// PUT    /api/tasks/:id      — full replace
// PATCH  /api/tasks/:id      — partial update
// DELETE /api/tasks/:id      — delete, returns 204, no body

// TODO: Create queryExamples array with 4-5 query param examples for GET /api/tasks
// Each: { param: string, description: string }
// Example: { param: '?status=active', description: 'Только активные задачи / Only active tasks' }

// TODO: Define methodColors record: method name → { bg, color }

export function Task2_3() {
  // TODO: Track which row is expanded (index or null)
  // Hint: useState<number | null>(null)

  // TODO: Track whether query params section is shown
  // Hint: useState(false)

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>CRUD endpoints: ресурс tasks</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Эталонный набор REST endpoints для ресурса «задачи» в task-менеджере. Нажмите на строку,
        чтобы увидеть примеры запроса и ответа.
      </p>

      {/* TODO: Render main table with columns: Метод | URL | Описание | Статус
           Each row is clickable — toggles detail row below it
           Method badge with color coding
           Status code badge (201/200 → green, 204 → blue) */}

      {/* TODO: When a row is open, render a detail sub-row (colSpan=4):
           - If requestExample is not null: show "Тело запроса" code block (dark theme)
           - Always show "Тело ответа (statusCode)" code block
           - Use grid layout if both exist */}

      {/* TODO: Render a toggle button to show/hide query params section
           When open, show table: param | description */}

      {/* TODO: Render self-check block with 3-4 questions:
           - Why does POST return 201 and GET returns 200?
           - Difference between PUT and PATCH?
           - Why does DELETE return 204 (no body)?
           - How would the URL change for tasks of a specific user? */}
    </div>
  )
}
