// ============================================
// Задание 6.1: Каталог типов раннеров и executors
// Task 6.1: GitLab Runner executor catalog
// ============================================
//
// ЦЕЛЬ: Создать интерактивный каталог executor-ов с карточками, бейджами и сравнительной таблицей.
// GOAL: Create an interactive executor catalog with cards, badges and a comparison table.
//
// ТРЕБОВАНИЯ / REQUIREMENTS:
// 1. Определи интерфейс Executor с полями:
//    id, name, description, pros, cons, useCases,
//    isolation: 'full'|'partial'|'none',
//    speed: 'fast'|'medium'|'slow',
//    complexity: 'low'|'medium'|'high',
//    needsDocker, configExample
//    Define Executor interface with the fields above
//
// 2. Создай данные для 4 executor-ов: Docker, Shell, Kubernetes, Docker Machine
//    Create data for 4 executors: Docker, Shell, Kubernetes, Docker Machine
//
// 3. Реализуй фильтрацию карточек по полю isolation (All / Full / None)
//    Implement card filtering by isolation field
//
// 4. Отобрази карточки с: бейджами isolation/speed/complexity, списками pros (✅) и cons (❌)
//    Render cards with: isolation/speed/complexity badges, pros (✅) and cons (❌) lists
//
// 5. При клике на карточку — показывай пример config.toml для этого executor-а
//    On card click — show config.toml example for the selected executor
//
// 6. Добавь сравнительную таблицу внизу: Executor | Изоляция | Скорость | Сложность | Нужен Docker
//    Add comparison table at the bottom
//
// ПОДСКАЗКИ / TIPS:
// - Используй useState для selectedId и filter
//   Use useState for selectedId and filter
// - Для тёмного блока кода: background: '#1e1e1e', color: '#d4d4d4'
//   For dark code block: background: '#1e1e1e', color: '#d4d4d4'
// - Бейдж: фон = color + '22', border = color + '44'
//   Badge: background = color + '22', border = color + '44'

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// TODO: Define Executor interface
// interface Executor { ... }

// TODO: Create EXECUTORS array with 4 items (Docker, Shell, Kubernetes, Docker Machine)
// Создай данные для 4 executor-ов: Docker, Shell, Kubernetes, Docker Machine
// const EXECUTORS: Executor[] = [...]

// TODO: Define label/color maps for isolation, speed, complexity
// Определи маппинги меток/цветов для isolation, speed, complexity
// const ISOLATION_LABELS = { full: 'Full', ... }
// const ISOLATION_COLORS = { full: '#2E7D32', ... }

export function Task6_1() {
  const { t } = useLanguage()
  // TODO: Add filter state ('all' | 'full' | 'partial' | 'none')
  // const [filter, setFilter] = useState<...>('all')

  // TODO: Add selectedId state for active executor card
  // const [selectedId, setSelectedId] = useState<string | null>(null)

  // TODO: Add expandedUseCases state (Set<string>)
  // const [expandedUseCases, setExpandedUseCases] = useState(new Set<string>())

  // TODO: Compute filtered list based on filter state
  // const filtered = filter === 'all' ? EXECUTORS : EXECUTORS.filter(...)

  // TODO: Find selected executor object
  // const selected = EXECUTORS.find(e => e.id === selectedId)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.6.1.title')}</h2>

      {/* TODO: Render filter buttons (All / Isolation: Full / ...) */}
      {/* TODO: Render filter buttons (Все / Изоляция: Полная / ...) */}

      {/* TODO: Render executor cards in a 2-column grid */}
      {/* Each card: name, description, badges, pros, cons, expandable use cases */}
      {/* Выведи карточки в 2-колоночной сетке */}
      {/* Каждая карточка: название, описание, бейджи, pros, cons, раскрывающиеся use cases */}

      {/* TODO: Show config.toml block when a card is selected */}
      {/* Покажи блок config.toml при выборе карточки */}

      {/* TODO: Render comparison table */}
      {/* Columns: Executor | Isolation | Speed | Complexity | Needs Docker */}
      {/* Столбцы: Executor | Изоляция | Скорость | Сложность | Нужен Docker */}
    </div>
  )
}
