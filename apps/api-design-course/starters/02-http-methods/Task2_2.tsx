import { useState } from 'react'

// TODO: Define a MethodScenario interface with fields:
// id, description, context, correctMethod, explanation

// TODO: Create an array of at least 8 scenarios covering all 7 HTTP methods.
// Suggested scenarios:
// - Create a user (POST)
// - Get user profile (GET)
// - Update email only (PATCH)
// - Replace notification settings entirely (PUT)
// - Delete a comment (DELETE)
// - Get task list with filter (GET)
// - Check if a file exists without downloading (HEAD)
// - CORS preflight scenario (OPTIONS)

// TODO: Define allMethods array: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

// TODO: Define methodColors record: method name → { bg, color }

export function Task2_2() {
  // TODO: Track selected answers: Record<number, string> (scenarioId → chosen method)
  // Hint: useState<Record<number, string>>({})

  // TODO: Track which scenarios are checked: Record<number, boolean>
  // Hint: useState<Record<number, boolean>>({})

  // TODO: Track overall score: number | null
  // Hint: useState<number | null>(null)

  // TODO: Implement select(id, method) — saves the chosen method for a scenario, clears its checked state

  // TODO: Implement checkOne(id) — marks a single scenario as checked

  // TODO: Implement checkAll() — marks all scenarios checked and calculates score

  // TODO: Implement reset() — clears answers, checked state, and score

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>Подбери метод для сценария</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Для каждого практического сценария выберите подходящий HTTP-метод, затем проверьте ответ.
      </p>

      {/* TODO: For each scenario render a card:
           - Header: scenario number, description, context
           - Method selector: button per method, highlight chosen method
           - "Проверить" button (visible when method is chosen and not yet checked)
           - Result block (visible when checked):
             - Green + explanation if correct
             - Red + correct answer + explanation if wrong */}

      {/* TODO: Action buttons at the bottom:
           - "Проверить все" button
           - "Сбросить" button
           - Score display (when score is not null):
             { score } / { total }, color based on result */}
    </div>
  )
}
