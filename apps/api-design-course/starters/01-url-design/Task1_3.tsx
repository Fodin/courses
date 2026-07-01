import { useState } from 'react'

// TODO: Define an Endpoint interface
// Each endpoint: method, url, description, notes? (optional string)

// TODO: Define a ResourceGroup interface
// Each group: resource (display name), emoji, endpoints[]

// TODO: Create the blogApiSchema array with at least 4 resource groups:
// 1. Users — standard CRUD endpoints
// 2. Posts — CRUD + nested under users + RPC-style publish action
// 3. Comments — nested under posts (GET, POST, PATCH, DELETE)
// 4. Tags — flat list + posts filtered by tag (show both nested and query param alternatives)

// TODO: Define methodColors — a mapping from HTTP method name to { bg, color } for visual badges
// Example: GET → green tones, DELETE → red tones

export function Task1_3() {
  // TODO: Track which resource group is currently expanded
  // Hint: useState<string | null>(null)
  // null means all groups are collapsed

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>URL-схема блог-платформы</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Эталонная схема REST endpoints для блога. Изучите паттерны: коллекции, вложенность, действия.
        Нажмите на группу ресурсов, чтобы раскрыть её.
      </p>

      {/* TODO: Render a design principles block (ul with 4-5 rules):
           - Plural nouns: /posts, not /post
           - Nesting for owned resources: /posts/:id/comments
           - Query params for filters and pagination
           - RPC exceptions for actions: /posts/:id/publish
           - Kebab-case for compound words */}

      {/* TODO: Map over blogApiSchema and render each group as an accordion:
           - Collapsed: show emoji + name + endpoint count, chevron icon
           - Expanded: show a table with columns: Метод | URL | Описание | Заметка
             - HTTP method shown as a colored badge using methodColors
             - URL in monospace, blue
             - notes column shows "—" when empty */}

      {/* TODO: Self-check questions block at the bottom:
           1. Почему /api/posts/:id/publish — нормально, а /api/posts/create — нет?
           2. Чем отличаются /api/tags/:slug/posts и /api/posts?tag=javascript?
           3. Зачем для обновления поста есть и PUT, и PATCH? */}
    </div>
  )
}
