import { useState } from 'react'

// TODO: Implement Access Matrix (RBAC / scopes) / Реализуй матрицу доступа
//
// Data / Данные:
//   ENDPOINTS: [{ method, path, requiredScope? , requiredRole? }]
//     GET /orders → scope orders:read
//     POST /orders → scope orders:write
//     DELETE /orders/{id} → role admin
//     GET /profile → scope profile:read
//     GET /admin/stats → role admin
//   IDENTITIES: anon (нет токена), viewer, editor, admin
//     у каждой token = { role, scopes[] } или null
//
// Decision / Решение для эндпоинта при выбранной личности:
//   if (!token) return 401
//   if (requiredRole && token.role !== requiredRole) return 403
//   if (requiredScope && !token.scopes.includes(requiredScope)) return 403
//   return 200
//
// UI:
//   - переключатель личности (anon/viewer/editor/admin)
//   - панель токена (role + scopes) или «токена нет»
//   - таблица эндпоинтов: метод/путь, требуемое право, код (200/401/403), «почему»
//   - цвета: 200 #22c55e, 403 #f59e0b, 401 #ef4444
//   - легенда 401/403/200

export function Task12_2() {
  const [identityId, setIdentityId] = useState('anon')

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Матрица доступа / Access Matrix</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Аутентификация vs авторизация / Authentication vs authorization
      </p>

      {/* TODO: переключатель личности / identity switch */}
      {/* TODO: панель токена (role + scopes) / token panel */}
      {/* TODO: таблица эндпоинтов с результатом и пояснением / endpoint matrix */}
      {/* TODO: легенда 401/403/200 / legend */}

      <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Текущая личность: {identityId}</p>
    </div>
  )
}
