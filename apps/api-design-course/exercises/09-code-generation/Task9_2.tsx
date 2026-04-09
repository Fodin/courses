import { useState } from 'react'

// TODO: Define interface Tool:
//   id: string, name: string, tagline: string, color: string,
//   generates: string[], pros: string[], cons: string[],
//   command: string, output: string

// TODO: Create TOOLS array with 3 entries:
//
//   1. id: 'openapi-generator', color: '#10b981'
//      tagline: 'Универсальный генератор (50+ языков)'
//      generates: ['TypeScript interfaces + enums', 'API-клиенты (fetch, axios, angular)',
//                  'React Query хуки (опционально)', 'Документация, серверные стабы']
//      pros: 50+ languages, Mustache templates, active community, single tool for team
//      cons: requires Java/Docker, complex config, verbose output, slower than JS tools
//      command: npx @openapitools/openapi-generator-cli generate with typescript-fetch generator
//      output: example of generated User model + UsersApi class
//
//   2. id: 'openapi-typescript', color: '#3b82f6'
//      tagline: 'Лёгкий, только типы, npm-native'
//      generates: ['TypeScript types (только типы, без runtime)',
//                  'Строго типизированные пути и методы',
//                  'Поддержка openapi-fetch для типобезопасных запросов']
//      pros: no Java, very fast, types only, great openapi-fetch integration
//      cons: TypeScript only, no hooks generation, less customization
//      command: npx openapi-typescript openapi.yaml -o src/api/schema.d.ts
//      output: schema.d.ts with paths interface showing /users/{id} get endpoint types
//
//   3. id: 'orval', color: '#8b5cf6'
//      tagline: 'React Query / SWR / Axios интеграция'
//      generates: ['React Query / SWR хуки', 'Axios-клиенты с типами',
//                  'MSW-моки для тестирования', 'Zod/Yup схемы валидации']
//      pros: ready useQuery/useMutation hooks, MSW mocks generation, flexible config, multiple output formats
//      cons: React-focused, more configuration, depends on chosen HTTP client
//      command: orval.config.ts with defineConfig + npx orval
//      output: generated useGetUser hook + getUserMock for MSW

export function Task9_2() {
  // TODO: activeTool state: string (default 'openapi-typescript')
  // TODO: showTable state: boolean (default false)

  // TODO: Find active tool from TOOLS

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1100px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Сравнение инструментов генерации</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Три основных инструмента для генерации TypeScript-кода из OpenAPI-спецификации
      </p>

      {/* TODO: Tool selector buttons + toggle table button
           Tool buttons: active → bg = tool.color, border = tool.color, color white
           Inactive → bg white, border #e2e8f0, color #374151
           Table button: active → bg #fef3c7, border #f59e0b, color #92400e
                         inactive → bg white, border #e2e8f0
           Button text: showTable ? 'Скрыть таблицу' : 'Таблица сравнения'
           Position table button at right margin (marginLeft: 'auto') */}

      {/* TODO: Comparison table (show only when showTable is true)
           Headers: 'Критерий' | tool names (colored)
           Rows (8):
           ['Runtime зависимость', 'Java / Docker', 'Node.js', 'Node.js'],
           ['Генерирует хуки', '⚠️ опционально', '❌ нет', '✅ да'],
           ['Генерирует моки', '❌ нет', '❌ нет', '✅ да'],
           ['Скорость генерации', '🐢 медленно', '⚡ быстро', '⚡ быстро'],
           ['Кастомизация', '✅ Mustache', '⚠️ ограничена', '✅ конфиг'],
           ['Размер npm', '~10 MB', '~2 MB', '~5 MB'],
           ['Поддержка языков', '50+', 'только TS', 'только JS/TS'],
           ['Идеально для', 'multi-lang команды', 'типы + openapi-fetch', 'React Query/SWR'] */}

      {/* TODO: Tool detail card — border color: tool.color + '20'

           Header section (bg: tool.color + '15'):
             - tool.name (colored), tool.tagline (gray)
             - Tags on right: each item from tool.generates as badge

           Body (2 columns):
             Left: pros (green header '✅ Плюсы') and cons (red header '❌ Минусы') side by side
             Right: command code block (green text) + output code block (blue text) */}
    </div>
  )
}
