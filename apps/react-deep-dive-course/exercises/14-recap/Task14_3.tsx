import { useMemo, useState } from 'react'
import { useLanguage } from 'src/hooks'

// Task 14.3: React Source Code Navigator
//
// Создайте интерактивный справочник концепций курса с маппингом
// на файлы исходного кода React.
//
// Требования:
// - Минимум 8 концепций: Fiber Node, Work Loop, Reconciliation,
//   Hooks Dispatcher, Effects Commit, Scheduler, Lanes, Suspense
// - Каждая карточка: название + уровень + файл + функции + описание
// - Клик раскрывает карточку (список функций + GitHub ссылка)
// - Повторный клик закрывает карточку
// - Фильтр по уровням: "Все", "01-05", "06-10", "11-14"
// - Поиск по названию/файлу

// ─── TODO: Тип Concept ────────────────────────────────────────────────────────
// interface Concept {
//   id: string
//   name: string
//   levelRange: '01-05' | '06-10' | '11-14'
//   levelLabel: string
//   file: string
//   githubPath: string
//   keyFunctions: Array<{ name: string; description: string }>
//   description: string
//   emoji: string
// }

// ─── TODO: Данные концепций ───────────────────────────────────────────────────
// const CONCEPTS: Concept[] = [
//   {
//     id: 'fiber-node',
//     name: 'Fiber Node',
//     levelRange: '01-05',
//     levelLabel: 'Уровень 01',
//     file: 'react-reconciler/src/ReactFiber.js',
//     githubPath: 'packages/react-reconciler/src/ReactFiber.js',
//     emoji: '🌳',
//     description: '...',
//     keyFunctions: [
//       { name: 'createFiber()', description: '...' },
//       ...
//     ],
//   },
//   // ... минимум 8 концепций
// ]

// ─── TODO: ConceptCard компонент ─────────────────────────────────────────────
// Props: concept, isOpen, onToggle
// При isOpen — показывает список функций и ссылку на GitHub
// function ConceptCard(...) { ... }

// ─── Main component ───────────────────────────────────────────────────────────

export function Task14_3() {
  const { t } = useLanguage()

  // TODO: useState для openId (открытая карточка)
  // const [openId, setOpenId] = useState<string | null>(null)

  // TODO: useState для filter ('all' | '01-05' | '06-10' | '11-14')
  // TODO: useState для search

  // TODO: useMemo для фильтрации CONCEPTS по filter и search
  // const filtered = useMemo(() => { ... }, [filter, search])

  return (
    <div className="exercise-container">
      <h2>{t('task.14.3')}</h2>

      {/* TODO: Панель фильтров (кнопки: Все, 01-05, 06-10, 11-14) */}

      {/* TODO: Поиск (input) */}

      {/* TODO: Сетка карточек концепций (grid layout) */}
      {/* Каждая карточка: emoji + название + уровень + файл + описание */}
      {/* При открытии: список функций + GitHub URL */}

      {/* TODO: Счётчик "Показано X из Y" */}

      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 10, border: '2px solid #86efac', marginTop: 16 }}>
        <p style={{ margin: 0, fontSize: 14 }}>
          Создайте справочник из минимум 8 концепций. Каждая карточка кликабельна
          и раскрывает детали: ключевые функции и ссылку на GitHub. Реализуйте
          фильтрацию по уровням и поиск.
        </p>
      </div>
    </div>
  )
}
