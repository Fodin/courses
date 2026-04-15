import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Task 14.2: Architecture Decision Tree
//
// Создайте интерактивное дерево архитектурных решений.
// Пользователь выбирает ветки, пока не доходит до листового узла — решения.
//
// Структура дерева:
//   "Мне нужно..."
//     ├─ вычислить из данных → (тяжёлое? → useMemo, лёгкое → computed)
//     ├─ синхронизировать с внешним store → useSyncExternalStore
//     ├─ реагировать на действие → (transition? → useTransition, нет → handler)
//     ├─ предотвратить лишние ре-рендеры → (дочерний → memo, контекст → split)
//     ├─ работать с DOM → (до paint → useLayoutEffect, после → useEffect)
//     └─ сбросить state при смене entity → key prop
//
// Требования:
// - Минимум 10 листовых решений
// - Каждое решение: название + объяснение + код
// - Хлебные крошки (breadcrumbs) показывают пройденный путь
// - Кнопка "Назад" на каждом шаге кроме корневого
// - Кнопка "Начать заново" на листовых узлах

// ─── TODO: Типы ───────────────────────────────────────────────────────────────
// type TreeLeaf = { type: 'leaf'; id: string; label: string; solution: string; explanation: string; code: string }
// type TreeNode = { type: 'node'; id: string; question: string; options: Array<{ label: string; child: TreeNode | TreeLeaf }> }

// ─── TODO: Данные дерева ─────────────────────────────────────────────────────
// const DECISION_TREE: TreeNode = {
//   type: 'node',
//   id: 'root',
//   question: 'Мне нужно...',
//   options: [
//     { label: 'вычислить значение из props/state', child: { ... } },
//     ...
//   ],
// }

// ─── TODO: Функция для получения текущего узла по пути ───────────────────────
// function findCurrent(tree: TreeNode, path: number[]): TreeNode | TreeLeaf { ... }

// ─── Main component ───────────────────────────────────────────────────────────

export function Task14_2() {
  const { t } = useLanguage()

  // TODO: useState для пути: const [path, setPath] = useState<number[]>([])

  // TODO: Вычислить текущий узел по пути

  // TODO: choose(optionIndex) — добавить к пути
  // TODO: goBack() — убрать последний элемент пути
  // TODO: reset() — сбросить путь в []

  return (
    <div className="exercise-container">
      <h2>{t('task.14.2')}</h2>

      {/* TODO: Хлебные крошки (breadcrumbs) */}

      {/* TODO: Если текущий узел — вопрос (type === 'node'):
          Показать вопрос и кнопки-варианты */}

      {/* TODO: Если текущий узел — решение (type === 'leaf'):
          Показать solution, explanation, code блок */}

      {/* TODO: Кнопки навигации: "Назад" и "Начать заново" */}

      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 10, border: '2px solid #86efac', marginTop: 16 }}>
        <p style={{ margin: 0, fontSize: 14 }}>
          Реализуйте дерево решений с минимум 10 листовыми узлами.
          Путь отображается в хлебных крошках. Листовые узлы показывают
          решение с кодовым примером.
        </p>
      </div>
    </div>
  )
}
