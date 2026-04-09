import { useState } from 'react'

// TODO: Define type VersionStrategy = 'url' | 'header' | 'query'

// TODO: Define interface Scenario:
//   id, title, description, tags (string[]),
//   options: { id: VersionStrategy, label: string }[]
//   correct: VersionStrategy
//   rationale: string
//   warning?: string

// TODO: Create SCENARIOS array with 4 entries:
//   1. id 'public-api', title 'Публичный API с тысячами клиентов'
//      tags: ['Публичный API', '5000+ клиентов', 'Разные SDK']
//      correct: 'url'
//      rationale: URL versioning — лучший выбор для публичного API...
//      warning: Header versioning технически чище, но простота важнее...
//
//   2. id 'internal-microservice', title 'Внутренний микросервис'
//      tags: ['Внутренний', '3 клиента', 'Один язык']
//      correct: 'header'
//      rationale: Для внутреннего сервиса с известными клиентами...
//
//   3. id 'mobile-app', title 'Мобильное приложение'
//      tags: ['iOS/Android', 'Медленные обновления', 'Долгая поддержка']
//      correct: 'url'
//      rationale: Для мобильных приложений URL versioning наиболее надёжен...
//
//   4. id 'saas-platform', title 'SaaS-платформа с тарифными планами'
//      tags: ['SaaS', 'Тарифные планы', 'Корпоративные клиенты']
//      correct: 'header'
//      rationale: Для SaaS с тарифами Header versioning даёт максимальную гибкость...
//      warning: Stripe реализует это через заголовок Stripe-Version...

export function Task6_3() {
  // TODO: currentScenario state (default 0)
  // TODO: selected state: Record<string, VersionStrategy> (which option user picked per scenario)
  // TODO: revealed state: Record<string, boolean> (which scenarios have been checked)

  // TODO: Derive:
  //   scenario = SCENARIOS[currentScenario]
  //   userChoice = selected[scenario.id]
  //   isRevealed = revealed[scenario.id]
  //   isCorrect = userChoice === scenario.correct
  //   allAnswered = all scenarios revealed
  //   score = count of correct answers

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '860px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h2 style={{ margin: 0 }}>Выбор стратегии версионирования</h2>
        {/* TODO: Show score badge "X/4 верно" when allAnswered
             green bg (#10b981) if perfect score, orange (#f59e0b) otherwise */}
      </div>
      <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Для каждого сценария выберите наиболее подходящую стратегию версионирования.
      </p>

      {/* TODO: Render 4 progress segments (flex row):
           - Completed correct: green
           - Completed wrong: red
           - Current: blue
           - Future: gray
           Each segment is clickable to navigate */}

      {/* TODO: Render scenario card:
           Header (gray bg): tags + scenario title + description
           Body: 3 option buttons
             - Before reveal: selected = blue border, unselected = gray border
             - After reveal: correct = green, selected-wrong = red, correct-not-selected = green
           Footer: "Проверить" button (active only when option selected, disabled after reveal) */}

      {/* TODO: After reveal, show result block:
           - Green bg if correct, red bg if wrong
           - "✅ Правильно!" or "❌ Не совсем верно"
           - Rationale text
           - Optional warning text (italic, brown) */}

      {/* TODO: Navigation buttons:
           - "← Назад" (disabled at scenario 0)
           - "Следующий →" blue bg (disabled at last scenario) */}
    </div>
  )
}
