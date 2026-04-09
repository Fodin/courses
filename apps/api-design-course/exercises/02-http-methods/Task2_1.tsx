import { useState } from 'react'

// TODO: Define an HttpMethod interface with fields:
// name, safe, idempotent, requestBody, responseBody, typicalUse, color, textColor

// TODO: Create an array of 7 HTTP methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
// For each, set correct values for safe, idempotent, requestBody, responseBody

// TODO: Define FilterMode type: 'all' | 'safe' | 'idempotent' | 'safe-idempotent'
// Create filterLabels object mapping each mode to a Russian label

export function Task2_1() {
  // TODO: Track active filter mode (FilterMode), default 'all'
  // Hint: useState<FilterMode>('all')

  // TODO: Track selected method name (string | null), default null
  // Hint: useState<string | null>(null)

  // TODO: Filter httpMethods array based on current filter mode

  // TODO: Find selectedMethod from httpMethods array

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>Матрица HTTP-методов</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Изучите свойства каждого HTTP-метода. Используйте фильтры для сравнения групп.
        Нажмите на строку — увидите подробности.
      </p>

      {/* TODO: Render filter buttons for each FilterMode
           Highlight active filter, use pill/rounded style */}

      {/* TODO: Render table with columns:
           Метод | Безопасный | Идемпотентный | Тело запроса | Тело ответа | Использование
           Each row should be clickable (toggles selection)
           Use color-coded method badge
           Use YesNo indicator (✅/❌) for boolean columns */}

      {/* TODO: If selectedMethod is not null, render a detail panel below the table
           Show explanation of safe/idempotent properties for the selected method */}

      {/* TODO: Render a legend/hint block explaining the terms */}
    </div>
  )
}
