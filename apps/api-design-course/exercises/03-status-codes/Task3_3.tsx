import { useState } from 'react'

// TODO: Define a Scenario interface with fields:
// id (number), situation (string), hint (string),
// correctCode (number), correctName (string), explanation (string),
// wrongCodes: Array<{ code: number, name: string, why: string }>

// TODO: Create an array of 10 scenarios. Cover these situations:
// 1. POST успешно создал ресурс (201) / POST successfully created a resource (201)
// 2. DELETE успешно удалил ресурс, тело не нужно (204) / DELETE successfully removed a resource, no body needed (204)
// 3. GET без токена к защищённому ресурсу (401) / GET without token to a protected resource (401)
// 4. Авторизованный пользователь без нужных прав (403) / Authorized user without required permissions (403)
// 5. GET /resources/99999 — ресурс не существует (404) / GET /resources/99999 — resource doesn't exist (404)
// 6. POST с email, который уже занят (409) / POST with email that's already taken (409)
// 7. POST с невалидными полями email/password (422) / POST with invalid email/password fields (422)
// 8. Неожиданное исключение в коде сервера (500) / Unexpected exception in server code (500)
// 9. Клиент превысил rate limit (429) / Client exceeded rate limit (429)
// 10. API Gateway не дождался ответа от backend (504) / API Gateway timed out waiting for backend (504)
// For each scenario, include 2 wrong codes with explanation why they're wrong

// TODO: Define a UserAnswer type:
// { selected: number | null, revealed: boolean }

export function Task3_3() {
  // TODO: Track answers for all scenarios
  // Hint: useState<Record<number, UserAnswer>>(...)
  // Initialize with { selected: null, revealed: false } for each scenario

  // TODO: Track current scenario index (number), default 0

  // TODO: Compute score (number of correct answers)
  // TODO: Compute answered count

  // TODO: For current scenario, get sorted option codes (correct + wrong, sorted by value)

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '760px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Угадай статус-код</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Выберите правильный HTTP-статус для каждого сценария. Объяснение появится после ответа.
      </p>

      {/* TODO: Render progress bar and score (score/total, answered/total) */}

      {/* TODO: Render scenario navigation buttons (numbered circles)
           Color: grey (not answered), green (correct), red (wrong), blue (current) */}

      {/* TODO: Render current scenario card
           Show: scenario number, situation text, hint */}

      {/* TODO: Render answer options
           - Disabled after reveal
           - After reveal: correct = green border, wrong selected = red border
           - After reveal for wrong codes: show "Почему не XXX: ..." explanation */}

      {/* TODO: After reveal, show result block:
           - "✅ Верно!" or "❌ Неверно. Правильный ответ: XXX Name"
           - Full explanation of the correct code */}

      {/* TODO: Render navigation buttons: "← Назад", "Вперёд →", "Сбросить"
           Disable Назад on first scenario, Вперёд on last */}
    </div>
  )
}
