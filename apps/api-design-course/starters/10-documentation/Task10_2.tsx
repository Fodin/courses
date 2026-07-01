import { useState } from 'react'

// TODO: Define interface Tool with fields:
//   id: string, name: string, tagline: string, color: string,
//   pros: string[], cons: string[],
//   whenToUse: string, config: string, configLabel: string,
//   uiDescription: string, uiFeatures: string[]

// TODO: Create TOOLS array with 3 entries:
//
//   1. id: 'swagger', name: 'Swagger UI', color: '#85ea2d'
//      tagline: 'Интерактивная песочница из OpenAPI / Interactive Sandbox from OpenAPI'
//      pros: Try it out free, autogeneration, open source, auth support, any backend
//      cons: outdated design, poor as static docs, no multi-version, limited styling
//      whenToUse: internal team docs, active experiments, MVP
//      config: Express.js + swagger-ui-express setup example
//      uiDescription: classic dark-green interface with Try it out button
//      uiFeatures: accordion by tags, param form, Execute, curl command, schema inspector
//
//   2. id: 'redoc', name: 'Redoc', color: '#6366f1'
//      tagline: 'Красивая трёхколоночная документация / Beautiful Three-Column Documentation'
//      pros: professional design, 3-column layout, typography, SSG, OpenAPI 3.1
//      cons: no Try it out free, less interactive, paid Redocly, hard to customize
//      whenToUse: public developer portal, external devs, brand matters
//      config: standalone HTML + CLI build-docs command
//      uiDescription: 3-column layout: nav / description / code examples
//      uiFeatures: fixed nav left, center description, right code panel, search, dark mode
//
//   3. id: 'stoplight', name: 'Stoplight', color: '#f59e0b'
//      tagline: 'Полная платформа: дизайн + документация + моки / Full Platform: Design + Docs + Mocks'
//      pros: design-first, mock server, collaboration, linting, GitHub integration
//      cons: paid, vendor lock-in, overkill for small projects, learning curve
//      whenToUse: enterprise API platform, large team, developer ecosystem
//      config: Spectral lint + Prism mock server commands
//      uiDescription: full platform with visual editor, preview and collaboration
//      uiFeatures: visual schema editor, Try it out with OAuth, auto mock server, custom domain, style guide

// TODO: type CompareMode = 'cards' | 'table'

export function Task10_2() {
  // TODO: activeTool state — string (default 'swagger')
  // TODO: mode state — CompareMode (default 'cards')
  // TODO: showConfig state — Record<string, boolean> (which tool's config is expanded)

  // TODO: Find active tool from TOOLS array
  // TODO: toggleConfig(id) — flip showConfig[id]

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1000px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Сравнение инструментов документации / Documentation Tools Comparison</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Swagger UI, Redoc и Stoplight — три подхода к документированию API / Swagger UI, Redoc, and Stoplight — three approaches to API documentation
      </p>

      {/* TODO: Mode toggle — pill-style switch "Карточки / Cards" / "Сравнение / Table"
           Container: inline-flex, bg #f1f5f9, padding 3px, border-radius 8px
           Active tab: white bg, shadow; Inactive: transparent */}

      {/* TODO: Cards mode (mode === 'cards'): / Режим карточек
           Tool tabs — 3 buttons with tool.color border/background when active

           Tool card:
             - Colored header with name and tagline
             - UI description block (bg #f8fafc)
               * uiDescription text
               * uiFeatures as <ul>
             - Two-column grid: Pros (green header) | Cons (red header)
             - Yellow block: "Когда использовать: ... / When to use: ..."
             - Toggle button: "Показать/Скрыть пример настройки / Show/Hide setup example"
             - Code block (bg #0f172a): config text, shown when toggled */}

      {/* TODO: Table mode (mode === 'table'): / Режим таблицы
           Comparison table with rows for each criterion and columns for each tool
           Criteria rows:
             Try it out, Mock-сервер / Mock Server, Дизайн / Design, Open Source, Self-host,
             Совместная работа / Collaboration, Design-first, Сложность настройки / Setup Complexity, Цена / Price
           Tool column headers: colored with tool.color
           Values for each cell (you can fill these in based on TOOLS data) */}
    </div>
  )
}
