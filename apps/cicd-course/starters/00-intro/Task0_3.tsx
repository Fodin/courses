import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 0.3: Ландшафт CI/CD инструментов
// Task 0.3: CI/CD tools landscape
// ============================================

// TODO: Определите типы для характеристик инструментов:
//   ToolType = 'saas' | 'self-hosted' | 'both'
//   EcosystemSize = 'small' | 'medium' | 'large'
//   SetupComplexity = 'low' | 'medium' | 'high'
// TODO: Define types for tool characteristics:
//   ToolType = 'saas' | 'self-hosted' | 'both'
//   EcosystemSize = 'small' | 'medium' | 'large'
//   SetupComplexity = 'low' | 'medium' | 'high'

// TODO: Определите интерфейс CITool с полями:
//   id, name, type (ToolType), free (boolean), freeDetails (string),
//   configFile (string), ecosystem (EcosystemSize),
//   setupComplexity (SetupComplexity), bestFor (string[]),
//   pros (string[]), cons (string[]), color (string), bgColor (string)
// TODO: Define a CITool interface with fields:
//   id, name, type (ToolType), free (boolean), freeDetails (string),
//   configFile (string), ecosystem (EcosystemSize),
//   setupComplexity (SetupComplexity), bestFor (string[]),
//   pros (string[]), cons (string[]), color (string), bgColor (string)

// TODO: Создайте массив tools с данными для 5 инструментов:
//   1. GitHub Actions — SaaS, бесплатный (публичные репо), .github/workflows/*.yml
//   2. GitLab CI     — both, 400 мин/мес, .gitlab-ci.yml
//   3. Jenkins       — self-hosted, open source (нужен сервер), Jenkinsfile
//   4. CircleCI      — SaaS, 6000 мин/мес, .circleci/config.yml
//   5. Travis CI     — SaaS, платный, .travis.yml
//   Для каждого добавьте 3-4 плюса и 2-3 минуса, сценарии использования.
// TODO: Create a tools array with data for 5 tools:
//   1. GitHub Actions — SaaS, free (public repos), .github/workflows/*.yml
//   2. GitLab CI     — both, 400 min/month, .gitlab-ci.yml
//   3. Jenkins       — self-hosted, open source (need server), Jenkinsfile
//   4. CircleCI      — SaaS, 6000 min/month, .circleci/config.yml
//   5. Travis CI     — SaaS, paid, .travis.yml
//   For each add 3-4 pros, 2-3 cons, and use-case scenarios.

// TODO: Создайте словари для отображения значений в читаемый вид:
//   complexityLabel: Record<SetupComplexity, string> — Низкая / Средняя / Высокая
//   complexityColor: Record<SetupComplexity, string> — зелёный / оранжевый / красный
//   ecosystemLabel: Record<EcosystemSize, string>   — Небольшая / Средняя / Большая
// TODO: Create display dictionaries:
//   complexityLabel: Record<SetupComplexity, string> — Low / Medium / High
//   complexityColor: Record<SetupComplexity, string> — green / orange / red
//   ecosystemLabel: Record<EcosystemSize, string>   — Small / Medium / Large

// TODO: Определите тип FilterType = 'all' | ToolType
// TODO: Define FilterType = 'all' | ToolType

export function Task0_3() {
  const { t } = useLanguage()
  // TODO: Создайте состояние filter (FilterType), начальное значение 'all'
  // TODO: Create filter state (FilterType), initial value 'all'
  const [filter, setFilter] = useState<string>('all')

  // TODO: Создайте состояние selectedTool (string | null)
  // TODO: Create selectedTool state (string | null)

  // TODO: Отфильтруйте массив tools по текущему фильтру:
  //   'all' — все инструменты
  //   'saas' — type === 'saas' или type === 'both'
  //   'self-hosted' — type === 'self-hosted' или type === 'both'
  // TODO: Filter the tools array based on current filter:
  //   'all' — all tools
  //   'saas' — type === 'saas' or type === 'both'
  //   'self-hosted' — type === 'self-hosted' or type === 'both'

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.0.3')}</h2>

      {/* TODO: Добавь кнопки фильтрации: "Все", "SaaS", "Self-hosted".
          Активная кнопка выделяется цветом (#1565C0 текст/фон).
          Рядом показывай количество найденных инструментов. */}
      {/* TODO: Add filter buttons: "All", "SaaS", "Self-hosted".
          Active button is highlighted (#1565C0 text/background).
          Show the count of found tools next to the buttons. */}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button onClick={() => setFilter('all')}>{t('task.0.3.filter.all')}</button>
        <button onClick={() => setFilter('saas')}>SaaS</button>
        <button onClick={() => setFilter('self-hosted')}>Self-hosted</button>
      </div>

      {/* TODO: Отобрази карточки отфильтрованных инструментов в сетке (flex wrap).
          Каждая карточка должна содержать:
          - Название инструмента цветом tool.color
          - Бейдж типа (SaaS / Self-hosted / SaaS + Self-hosted) с цветовым кодированием
          - Иконку бесплатного плана (FREE), если tool.free === true
          - Шкалу сложности настройки (3 прямоугольника, закрашенные по уровню)
          - Кнопку "Подробнее" / "Свернуть"
          Выбранная карточка подсвечивается. */}
      {/* TODO: Display filtered tool cards in a grid (flex wrap).
          Each card should contain:
          - Tool name in tool.color
          - Type badge (SaaS / Self-hosted / SaaS + Self-hosted) with color coding
          - FREE badge if tool.free === true
          - Setup complexity scale (3 rectangles, filled by level)
          - "Details" / "Collapse" button
          Selected card is highlighted. */}

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', minWidth: '180px' }}>
          {t('task.0.3.placeholder.cards')}
        </div>
      </div>

      {/* TODO: Если инструмент выбран, покажи детальную панель.
          Детали включают:
          - Конфигурационный файл (в стиле кода — тёмный фон, моноширинный шрифт)
          - Тип, бесплатный план, размер экосистемы
          - Список "Лучше всего для" (bestFor)
          - Список плюсов (pros) с иконкой ✅
          - Список минусов (cons) с иконкой ❌
          Используй grid-layout для размещения секций рядом. */}
      {/* TODO: If a tool is selected, show the detail panel.
          Details include:
          - Config file (code style — dark background, monospace font)
          - Type, free plan, ecosystem size
          - "Best for" list (bestFor)
          - Pros list with ✅ icon
          - Cons list with ❌ icon
          Use grid layout to place sections side by side. */}
    </div>
  )
}
