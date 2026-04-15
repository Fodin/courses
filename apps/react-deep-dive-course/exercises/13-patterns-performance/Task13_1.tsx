import { createContext, useContext, useMemo, useRef, useState } from 'react'
import { useLanguage } from 'src/hooks'

// Task 13.1: Context Splitting
//
// Проблема: приложение с одним большим AppContext. При вводе текста в поиск
// ре-рендерятся ВСЕ компоненты — UserCard, ThemeToggle, SearchResults.
// Хотя user и theme при этом не меняются!
//
// Задача: разделить AppContext на три независимых контекста:
//   UserContext    — данные пользователя (меняется редко)
//   ThemeContext   — тема (меняется иногда)
//   SearchContext  — поисковый запрос (меняется при каждом вводе)
//
// После разделения:
//   - ввод в поиск → ре-рендерится только SearchResults
//   - смена пользователя → ре-рендерится только UserCard
//   - смена темы → ре-рендерится только ThemeToggle

// ─── TODO: Определите типы ────────────────────────────────────────────────────
// interface User { name: string; avatar: string }
// type Theme = 'light' | 'dark'
// interface SearchCtx { query: string; setQuery: (q: string) => void }

// ─── TODO: Создайте три контекста ─────────────────────────────────────────────
// const UserContext = createContext<User>(...)
// const ThemeContext = createContext<Theme>(...)
// const SearchContext = createContext<SearchCtx>(...)

// ─── TODO: UserCard ───────────────────────────────────────────────────────────
// Использует только UserContext.
// Показывает: user.avatar, user.name и счётчик рендеров (useRef).
// function UserCard() { ... }

// ─── TODO: ThemeToggle ───────────────────────────────────────────────────────
// Использует только ThemeContext.
// Показывает: текущую тему и счётчик рендеров.
// function ThemeToggle() { ... }

// ─── TODO: SearchResults ─────────────────────────────────────────────────────
// Использует только SearchContext.
// Показывает: отфильтрованный список из ['React', 'Fiber', 'Hooks', 'Context', 'Concurrent']
// и счётчик рендеров.
// function SearchResults() { ... }

// ─── Main component ───────────────────────────────────────────────────────────

export function Task13_1() {
  const { t } = useLanguage()

  // TODO: state для user (useState с массивом пользователей), theme, query

  // TODO: мемоизировать searchValue через useMemo:
  // const searchValue = useMemo(() => ({ query, setQuery }), [query])

  return (
    <div className="exercise-container">
      <h2>{t('task.13.1')}</h2>

      {/* TODO: Обернуть содержимое в три Provider */}
      {/* TODO: Кнопки: "Сменить пользователя", "Переключить тему", поле ввода */}
      {/* TODO: Три компонента рядом: UserCard, ThemeToggle, SearchResults */}

      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 10, border: '2px solid #86efac' }}>
        <p>
          Разделите один AppContext на три независимых: UserContext, ThemeContext, SearchContext.
          Каждый компонент должен ре-рендериться только при изменении своих данных.
        </p>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Подсказка: значение SearchContext &#123;&#123; query, setQuery &#125;&#125; нужно мемоизировать через useMemo,
          иначе новый объект создаётся при каждом рендере провайдера.
        </p>
      </div>
    </div>
  )
}
