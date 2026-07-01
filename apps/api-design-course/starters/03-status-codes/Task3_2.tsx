import { useState } from 'react'

// TODO: Define an ErrorScenario interface with fields:
// id, label, description, template (type, title, status, detail, instance, optional errors array)

// TODO: Create an array of at least 4 error scenarios:
// 1. Validation error (422) — with errors array
// 2. Not found (404)
// 3. Conflict (409)
// 4. Rate limit (429)
// Each scenario should have realistic RFC 7807 template values

// TODO: Define an ErrorFields interface with fields:
// type (string), title (string), status (number), detail (string), instance (string)

export function Task3_2() {
  // TODO: Track selected scenario id (string)
  // Hint: useState<string>(scenarios[0].id)

  // TODO: Track editable fields (ErrorFields)
  // Hint: useState<ErrorFields>({ ...scenarios[0].template })

  // TODO: Track whether to include errors array (boolean), default false

  // TODO: When scenario changes — reset fields to scenario template values

  // TODO: Build the result JSON object from current fields
  // If showErrors is true and scenario has errors — include them

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Конструктор ошибок по RFC 7807</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Выберите сценарий, настройте поля и получите готовый error response в формате Problem Details.
      </p>

      {/* TODO: Render scenario selector buttons
           Highlight active scenario with its HTTP status color */}

      {/* TODO: Show selected scenario description text */}

      {/* TODO: Render two-column layout: fields editor + JSON preview */}

      {/* Left column — editable fields:
          - type (text input) with hint "URI, идентифицирующий тип ошибки"
          - title (text input) with hint "Краткое человекочитаемое описание"
          - status (number input) with hint "HTTP-статус код"
          - detail (textarea) with hint "Подробное объяснение конкретной ошибки"
          - instance (text input) with hint "URI конкретного вхождения проблемы"
          - checkbox for "Добавить массив errors" (only if scenario has errors) */}

      {/* Right column — live JSON preview:
          - Dark background code block showing JSON.stringify(resultJson, null, 2)
          - Block showing Content-Type: application/problem+json
          - Block showing HTTP status code + title */}
    </div>
  )
}
