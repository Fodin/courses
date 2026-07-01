import { useState } from 'react'

// TODO: Implement E-commerce API Reference Design / Эталонный дизайн E-commerce API
//
// An interactive reference for a complete e-commerce REST API.
// 5 resources: Products, Cart, Orders, Users, Reviews.
//
// State needed:
//   activeResource: number (0) — selected resource tab index
//   activeEndpoint: number (0) — selected endpoint within resource
//   showRequest: boolean (true) — toggle between Request Body and Response
//
// Data structure (define as constants):
//   ECOMMERCE_API: Array<{
//     name: string        // 'Products', 'Cart', etc.
//     emoji: string       // '📦', '🛒', etc.
//     endpoints: Array<{
//       method: string    // 'GET', 'POST', etc.
//       path: string      // '/v1/products', etc.
//       status: string    // '200', '201', '204'
//       request?: string  // JSON string (optional)
//       response: string  // JSON string
//       notes?: string    // tips/filters/errors
//     }>
//   }>
//
// UI layout: / Макет интерфейса:
//   - Resource tabs (5 buttons with emoji + name)
//   - Two-column grid: endpoint list (left, 240px) + endpoint detail (right)
//   - Left: resource header + endpoint buttons (method badge + path)
//   - Right: endpoint header (method + path + status badge)
//            notes block (blue)
//            Request/Response toggle (only if request exists)
//            Code block (dark background)
//            3-column summary (Method / Success / Auth)
//
// Bottom: cross-cutting concerns grid (6 blocks: versioning, errors, auth, pagination, rate limiting, formats)
//         Снизу: сетка сквозных вопросов (6 блоков: версионирование, ошибки, аутентификация, пагинация, rate limiting, форматы)
//
// Method colors: GET #3b82f6, POST #22c55e, PUT #f59e0b, PATCH #8b5cf6, DELETE #ef4444
// Status colors: 2xx #22c55e, 4xx #f59e0b/#ef4444

export function Task14_3() {
  // TODO: useState for activeResource (0), activeEndpoint (0), showRequest (true)

  // TODO: resource = ECOMMERCE_API[activeResource]
  // TODO: endpoint = resource.endpoints[activeEndpoint]
  // TODO: handleResourceChange resets activeEndpoint to 0

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Эталонный E-commerce API / Reference E-commerce API</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Полный дизайн REST API для интернет-магазина: Products, Cart, Orders, Users, Reviews.
        Изучи каждый endpoint — это эталон для финального задания. / Complete REST API design for an online store: Products, Cart, Orders, Users, Reviews. Study each endpoint — this is the reference for the final task.
      </p>

      {/* TODO: Resource tabs (5 buttons) / Вкладки ресурсов (5 кнопок) */}

      {/* TODO: Two-column grid: endpoint list + endpoint detail / Двухколоночный макет: список endpoint + детали */}
      {/* Left: endpoint list with method badges */}
      {/* Right: header + notes + request/response toggle + code block + summary */}

      {/* TODO: Cross-cutting concerns grid (6 blocks) / Сетка сквозных вопросов (6 блоков) */}
    </div>
  )
}
