import { useState } from 'react'

// TODO: Implement Rate Limiting Design self-check
//
// Scenario interface:
//   id: string
//   title: string
//   description: string
//   icon: string
//   solution: {
//     algorithm: string
//     limits: string[]
//     headers: string[]
//     keyType: string
//     extras: string[]
//   }
//
// Three scenarios to implement:
//
// 1. id: 'public-api', icon: '🌐'
//    title: 'Публичный API для разработчиков'
//    description: SaaS с тарифами Free/Pro/Enterprise
//    solution.algorithm: 'Token Bucket'
//    solution.limits: Free 100/час, Pro 10k/час, Enterprise 100k/час
//    solution.headers: X-RateLimit-Limit/Remaining/Reset + X-RateLimit-Plan
//    solution.keyType: 'API Key (из Authorization: Bearer)'
//
// 2. id: 'internal-api', icon: '⚙️'
//    title: 'Внутренний API между микросервисами'
//    description: 8 сервисов, защита от каскадных отказов
//    solution.algorithm: 'Sliding Window Counter'
//    solution.keyType: 'Service ID (из заголовка X-Service-ID)'
//
// 3. id: 'bff-mobile', icon: '📱'
//    title: 'BFF для мобильного приложения'
//    description: 2 млн активных пользователей
//    solution.algorithm: 'Sliding Window Log + Token Bucket'
//    solution.keyType: 'User ID / IP для анонимных'
//
// State:
//   activeScenario: string | null
//   userAnswers: Record<string, string>  — preserved between scenario switches
//   revealed: Record<string, boolean>   — per-scenario reveal state
//
// Layout:
//   3-column grid of scenario cards (border highlights active one)
//   Below: textarea for user answer + reveal button + solution panel
//
// Solution panel sections:
//   Header: Algorithm name (bg #f5f3ff, color #6366f1)
//   2-column grid: Limits list | HTTP headers (dark code block)
//   2-column grid: Key type (green bg) | Extras list (checkmarks)

export function Task11_3() {
  // TODO: SCENARIOS array with all three scenarios

  // TODO: useState for activeScenario, userAnswers, revealed

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Проектирование Rate Limiting</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Три реальных сценария — выберите алгоритм, лимиты и стратегию коммуникации
      </p>

      {/* TODO: 3-column scenario cards grid
           Each card: icon, title, description
           Active card: border #6366f1, background #f5f3ff
           Inactive: border #e2e8f0, background white */}

      {/* TODO: When activeScenario is set:
           - textarea for user answer (placeholder with hints)
           - "Показать эталонное решение" button
           - Solution panel (when revealed) */}

      {/* TODO: Empty state when no scenario selected
           (dashed border, centered text) */}
    </div>
  )
}
