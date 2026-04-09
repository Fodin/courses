import { useState } from 'react'

// TODO: Define an Operation interface with fields:
// id, label, method, path,
// requestHeaders (string), requestBody (string | null),
// responseStatus (number), responseHeaders (string),
// responseBody (string), notes (string[])

// TODO: Create an array of 5 operations for the 'product' resource:
// 1. GET /api/v1/products — list with pagination query params
// 2. GET /api/v1/products/:id — single product
// 3. POST /api/v1/products — create (returns 201 + Location header)
// 4. PATCH /api/v1/products/:id — partial update (Merge Patch)
// 5. DELETE /api/v1/products/:id — delete (returns 204, empty body)
//
// Each operation must include:
// - Correct HTTP method and realistic URL
// - Request headers (Content-Type, Accept, Authorization)
// - Request body where applicable (null for GET/DELETE)
// - Response status code
// - Response headers
// - Response body (empty for 204)
// - 3-4 notes explaining key design decisions

// TODO: Define methodColors — map from method string to { bg, color }
// TODO: Define statusColors — map from status code to { bg, color }

export function Task4_3() {
  // TODO: Track active operation id (string), default 'list'
  // TODO: Track showRequest (boolean), default true

  // TODO: Find current operation from the array

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '940px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Эталонный request/response для ресурса «Товар»</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Полный набор операций CRUD с правильными заголовками, телами и статус-кодами.
      </p>

      {/* TODO: Render operation tabs
           Show METHOD badge + operation label for each tab
           Active tab uses method color */}

      {/* TODO: Render URL bar with METHOD badge and full path */}

      {/* TODO: Render "→ Запрос / ← Ответ" toggle */}

      {/* TODO: Render content panel based on showRequest:
           Request: requestHeaders in blue + requestBody in white (or "no body" note)
           Response: status badge + responseHeaders in green + responseBody in white */}

      {/* TODO: Render "КЛЮЧЕВЫЕ РЕШЕНИЯ" notes section */}
    </div>
  )
}
