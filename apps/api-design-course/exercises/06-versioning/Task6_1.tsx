import { useState } from 'react'

// TODO: Define type VersionStrategy = 'url' | 'header' | 'query'

// TODO: Define interface StrategyInfo:
//   id, title, badge, color, request (multiline string), pros (string[]), cons (string[]),
//   usedBy: { name: string, detail: string }[]

// TODO: Create STRATEGIES array with 3 entries:
//   1. URL versioning — color '#3b82f6', badge '/v1/users'
//      request: 'GET /api/v2/users HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer token'
//      pros: at least 4 items, cons: at least 3 items
//      usedBy: GitHub, Twitter, Stripe
//   2. Header versioning — color '#8b5cf6', badge 'Accept: vnd.v1'
//      request includes: Accept: application/vnd.myapi.v2+json
//      pros: at least 3 items, cons: at least 4 items
//      usedBy: GitHub (new), Microsoft Graph, PayPal
//   3. Query param — color '#10b981', badge '?version=1'
//      request includes: ?version=2&page=1
//      pros: at least 3 items, cons: at least 3 items
//      usedBy: AWS, Google Maps (legacy), Salesforce

export function Task6_1() {
  // TODO: active strategy state (default 'url')
  // TODO: expanded accordion section state: 'pros' | 'cons' | 'used' | null (default 'pros')

  // TODO: Find current strategy from STRATEGIES

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Стратегии версионирования API</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Выберите стратегию, чтобы увидеть пример запроса, плюсы, минусы и кто её использует.
      </p>

      {/* TODO: Render 3 tab buttons (flex row, gap 0.5rem)
           Each tab:
           - border changes when active (2px solid strategy color vs #e2e8f0)
           - background: strategy color when active, white when not
           - color: white when active, #374151 when not
           - shows strategy title (small, low opacity) and badge code below */}

      {/* TODO: Render card with border of strategy.color:
           1. Header (colored background): strategy title + "Пример HTTP-запроса"
           2. Code block (dark #1e293b bg, monospace): strategy.request
           3. Three accordion sections:
              a. "✅ Преимущества" — list of pros (green text)
              b. "❌ Недостатки" — list of cons (red text)
              c. "🏢 Кто использует" — name + detail pairs
           Each section toggles on click */}

      {/* TODO: Tip block (yellow bg #fefce8, border #fde047):
           "💡 Совет: нет единственно правильной стратегии..." */}
    </div>
  )
}
