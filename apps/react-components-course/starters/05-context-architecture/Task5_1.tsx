import { useLanguage } from 'src/hooks'
import { createContext, useContext, useState, useMemo } from 'react'
import type { ReactNode } from 'react'

// ============================================
// Task 5.1: createStrictContext Factory
// Задание 5.1: Фабрика createStrictContext
// ============================================
//
// Implement a generic factory createStrictContext<T> that creates
// a type-safe context and a hook that throws an error when used outside a provider.
// Apply the factory for ThemeContext and UserContext.
//
// Реализуйте generic-фабрику createStrictContext<T>, которая создаёт
// типобезопасный контекст и хук с ошибкой при использовании вне провайдера.
// Примените фабрику для ThemeContext и UserContext.

// TODO: Implement createStrictContext<T> factory
// TODO: Реализуйте фабрику createStrictContext<T>
// Accepts: displayName: string
// Принимает: displayName: string
// Returns: [Context, useHook] as const
// Возвращает: [Context, useHook] as const
// Hook must throw Error if value === undefined
// Хук должен выбрасывать Error если значение === undefined
// Hint: createContext<T | undefined>(undefined)
// Подсказка: createContext<T | undefined>(undefined)
//
// function createStrictContext<T>(displayName: string) {
//   const Context = createContext<T | undefined>(undefined)
//   Context.displayName = displayName
//   function useCtx(): T {
//     const value = useContext(Context)
//     // TODO: check for undefined and throw Error
//     // TODO: проверка на undefined и throw Error
//     return value
//   }
//   return [Context, useCtx] as const
// }

// TODO: Create ThemeContext via createStrictContext
// TODO: Создайте ThemeContext через createStrictContext
// Value type:
// Тип значения:
// interface ThemeValue {
//   mode: 'light' | 'dark'
//   toggleMode: () => void
// }
// const [ThemeCtx, useTheme] = createStrictContext<ThemeValue>('Theme')

// TODO: Implement ThemeProvider
// TODO: Реализуйте ThemeProvider
// - useState for mode
// - useState для mode
// - useMemo for memoizing the value
// - useMemo для мемоизации значения
// function ThemeProvider({ children }: { children: ReactNode }) { ... }

// TODO: Create UserContext via createStrictContext
// TODO: Создайте UserContext через createStrictContext
// Value type:
// Тип значения:
// interface UserValue {
//   user: { name: string; role: string } | null
//   login: (name: string) => void
//   logout: () => void
// }
// const [UserCtx, useUser] = createStrictContext<UserValue>('User')

// TODO: Implement UserProvider
// TODO: Реализуйте UserProvider
// - useState for user
// - useState для user
// - useMemo for memoizing the value
// - useMemo для мемоизации значения
// function UserProvider({ children }: { children: ReactNode }) { ... }

// TODO: Create ThemeDemo component
// TODO: Создайте компонент ThemeDemo
// - Reads mode and toggleMode via useTheme()
// - Читает mode и toggleMode через useTheme()
// - Shows current theme
// - Показывает текущую тему
// - Theme toggle button
// - Кнопка переключения темы

// TODO: Create UserDemo component
// TODO: Создайте компонент UserDemo
// - Reads user, login, logout via useUser()
// - Читает user, login, logout через useUser()
// - If user === null: name input + "Login" button
// - Если user === null: input для имени + кнопка "Войти"
// - If user !== null: name, role + "Logout" button
// - Если user !== null: имя, роль + кнопка "Выйти"

// TODO: Create ErrorBoundary (class component)
// TODO: Создайте ErrorBoundary (class component)
// - Catches errors via getDerivedStateFromError
// - Ловит ошибки через getDerivedStateFromError
// - Shows error message in a red-background block
// - Показывает сообщение ошибки в блоке с красным фоном

// TODO: Create BadComponent (without provider)
// TODO: Создайте компонент BadComponent (без провайдера)
// - Calls useTheme() — will throw an error
// - Вызывает useTheme() — выбросит ошибку
// - ErrorBoundary will catch it
// - ErrorBoundary поймает её

export function Task5_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 5.1</h2>
      <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '1rem' }}>
        Implement createStrictContext, ThemeProvider, UserProvider and demo components
      </p>

      {/* TODO: Render ThemeProvider with ThemeDemo inside */}
      {/* TODO: Отрендерите ThemeProvider с ThemeDemo внутри */}
      {/* <ThemeProvider><ThemeDemo /></ThemeProvider> */}

      {/* TODO: Render UserProvider with UserDemo inside */}
      {/* TODO: Отрендерите UserProvider с UserDemo внутри */}
      {/* <UserProvider><UserDemo /></UserProvider> */}

      {/* TODO: Render block with ErrorBoundary and error-trigger button */}
      {/* TODO: Отрендерите блок с ErrorBoundary и кнопкой вызова ошибки */}

      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Here should be the createStrictContext demo with ThemeContext and UserContext
      </div>
    </div>
  )
}
