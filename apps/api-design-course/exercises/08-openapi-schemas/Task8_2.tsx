import { useState } from 'react'

// TODO: Define SPEC_BEFORE — YAML string with 2 endpoints (GET /orders, GET /orders/{id})
//   Both endpoints have:
//   - Inline Order schema (id: uuid, total: number, status: enum [pending, paid, shipped])
//   - Inline Error schema (code: string, message: string) in 401 and 500 responses
//   GET /orders/{id} also has 404 with inline Error schema

// TODO: Define SPEC_AFTER — refactored YAML with:
//   - components/schemas: Order and Error
//   - components/responses: Unauthorized, NotFound, ServerError
//   - paths using $ref instead of inline definitions

// TODO: Compute BEFORE_LINES, AFTER_LINES, SAVED using .split('\n').length

// TODO: Define interface DuplicateBlock:
//   id: string, label: string, description: string, occurrences: number, refactored: string

// TODO: Define DUPLICATES array with 4 entries:
//   1. id: 'order-schema', label: 'Order schema'
//      description: 'Схема заказа повторяется в GET /orders и GET /orders/{id}'
//      occurrences: 2, refactored: '$ref: "#/components/schemas/Order"'
//   2. id: 'error-schema', label: 'Error schema'
//      description: 'Схема ошибки повторяется в 401, 404, 500 ответах'
//      occurrences: 4, refactored: '$ref: "#/components/schemas/Error"'
//   3. id: '401-response', label: '401 Unauthorized'
//      description: 'Одинаковый 401-ответ в каждом endpoint'
//      occurrences: 2, refactored: '$ref: "#/components/responses/Unauthorized"'
//   4. id: '500-response', label: '500 ServerError'
//      description: 'Одинаковый 500-ответ в каждом endpoint'
//      occurrences: 2, refactored: '$ref: "#/components/responses/ServerError"'

export function Task8_2() {
  // TODO: refactored state: string[] (default [])
  // TODO: view state: 'before' | 'after' (default 'before')

  // TODO: Compute allDone — all duplicate IDs are in refactored array

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1000px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Рефакторинг спецификации</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Найдите дублирование в спецификации и вынесите повторяющиеся блоки в{' '}
        <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '3px' }}>
          components
        </code>
        .
      </p>

      {/* TODO: Stats bar: "До: N строк" (red) → "После: N строк" (green) → "Экономия: -N строк" (blue)
           Plus "До" / "После" toggle buttons on the right */}

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem' }}>
        {/* TODO: Left column — duplicates checklist
             Label: "НАЙТИ И ВЫНЕСТИ В COMPONENTS"
             For each duplicate: clickable card with toggle behavior
             - Unchecked: ⬜ icon, white background, gray border
             - Checked: ✅ icon, green tint background
             - Show occurrences badge: "×N" in red
             - When checked: show refactored $ref string below
             After all checked: success message "Отличная работа! Все дубликаты устранены." */}

        {/* TODO: Right column — dark YAML viewer
             Show SPEC_BEFORE or SPEC_AFTER based on view state
             maxHeight: 500px, overflowY: auto */}
      </div>
    </div>
  )
}
