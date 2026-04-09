import { useState } from 'react'

// TODO: Define type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
// TODO: Define type BuildStep = 'method' | 'parameters' | 'requestBody' | 'responses'

// TODO: Define interface ScenarioConfig:
//   id, label, path, method: HttpMethod, hasPathParam, hasQueryParam,
//   hasRequestBody, summary, pathParamName?, queryParamName?, queryParamDesc?,
//   bodySchema?, responseSchema?

// TODO: Create SCENARIOS array with 3 entries:
//   1. 'get-users' — GET /users, hasQueryParam: true, queryParamName: 'limit'
//   2. 'post-users' — POST /users, hasRequestBody: true, bodySchema with name+email
//   3. 'get-user-by-id' — GET /users/{id}, hasPathParam: true, pathParamName: 'id'

// TODO: Create METHOD_COLORS record: GET→'#10b981', POST→'#3b82f6', PUT→'#f59e0b', DELETE→'#ef4444'

// TODO: Create STEPS array: [{id: 'method', label: '1. Метод и путь'}, ...]

// TODO: Create buildYaml(scenario, upToStep) function that returns YAML string:
//   - Always: paths, path, method, summary
//   - Step >= 'parameters': add parameters section (or comment if no params)
//   - Step >= 'requestBody': add requestBody or comment
//   - Step >= 'responses': add 200/201, 400, and 404 if hasPathParam

export function Task7_2() {
  // TODO: scenarioId state (default 'get-users')
  // TODO: step state: BuildStep (default 'method')

  // TODO: Find current scenario
  // TODO: Define stepOrder array

  // TODO: handleScenarioChange — changes scenario AND resets step to 'method'

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Конструктор OpenAPI-пути</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Выберите сценарий и проходите шаги — YAML будет строиться на ваших глазах.
      </p>

      {/* TODO: Render scenario selector buttons (flex row, gap 0.5rem)
           Each button: show method badge (colored) + path, border changes when active */}

      {/* TODO: Render two-column grid (200px + 1fr):
           Left column — step buttons:
           - Each step: icon ✅/▶/○ based on done/current/future state
           - Bottom: navigation buttons "← Назад" and "Далее →"
           Right column — YAML preview:
           - Dark background (#0f172a), monospace, pre, min-height 300px
           - Shows buildYaml(scenario, step) */}

      {/* TODO: Render hint block (yellow bg) with step-specific tips:
           method → explain paths structure
           parameters → explain in: path/query, required: true for path
           requestBody → explain media types, only for POST/PUT/PATCH
           responses → explain status codes as strings, describe all codes */}
    </div>
  )
}
