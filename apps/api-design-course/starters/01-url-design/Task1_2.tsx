import { useState } from 'react'

// TODO: Define a BadUrl interface
// Each entry should have: id, bad (URL string), method, fix (correct URL), fixMethod,
//                         errorType (short label), explanation

// TODO: Create an array of at least 8 bad URLs covering different error types:
// - Verb in URL path (e.g. /api/getUsers)
// - Wrong HTTP method combined with verb (e.g. GET /api/users/deleteUser/5)
// - PascalCase or camelCase in URL (e.g. /api/UserProfile)
// - Action in query params (e.g. POST /api/users?action=ban&id=7)
// - snake_case + verb (e.g. /api/get_product_list)
// - Verb "create" with wrong method (e.g. GET /api/orders/create)
// - Verb in nested resource (e.g. /api/users/123/getOrders)
// - camelCase in URL (e.g. /api/blogPosts)

export function Task1_2() {
  // TODO: Track which items have their answer revealed
  // Hint: useState<Set<number>>(new Set())

  // TODO: toggle(id) — adds or removes id from the revealed set

  // TODO: revealAll() — adds all item IDs to the revealed set

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>Исправь ошибки в URL</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Найдите проблему в каждом URL и попробуйте сформулировать исправление. Потом нажмите «Показать ответ».
      </p>

      {/* TODO: "Показать все ответы" button (onClick → revealAll) */}

      {/* TODO: Map over badUrls and render each item:
           - Header row with: item number, bad URL in red code block, errorType badge, "Показать ответ" button
           - Revealed section (shown when id is in the revealed set):
               - Corrected URL: fixMethod + fix in green code block
               - Explanation text */}
    </div>
  )
}
