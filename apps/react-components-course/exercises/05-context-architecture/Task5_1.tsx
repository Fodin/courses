import { useLanguage } from 'src/hooks'
import { createContext, useContext, useState, useMemo } from 'react'
import type { ReactNode } from 'react'

// ============================================
// Задание 5.1: Фабрика createStrictContext
// ============================================
//
// Реализуйте generic-фабрику createStrictContext<T>, которая создаёт
// типобезопасный контекст и хук с ошибкой при использовании вне провайдера.
// Примените фабрику для ThemeContext и UserContext.

// TODO: Реализуйте фабрику createStrictContext<T>
// Принимает: displayName: string
// Возвращает: [Context, useHook] as const
// Хук должен выбрасывать Error если значение === undefined
// Подсказка: createContext<T | undefined>(undefined)
//
// function createStrictContext<T>(displayName: string) {
//   const Context = createContext<T | undefined>(undefined)
//   Context.displayName = displayName
//   function useCtx(): T {
//     const value = useContext(Context)
//     // TODO: проверка на undefined и throw Error
//     return value
//   }
//   return [Context, useCtx] as const
// }

// TODO: Создайте ThemeContext через createStrictContext
// Тип значения:
// interface ThemeValue {
//   mode: 'light' | 'dark'
//   toggleMode: () => void
// }
// const [ThemeCtx, useTheme] = createStrictContext<ThemeValue>('Theme')

// TODO: Реализуйте ThemeProvider
// - useState для mode
// - useMemo для мемоизации значения
// function ThemeProvider({ children }: { children: ReactNode }) { ... }

// TODO: Создайте UserContext через createStrictContext
// Тип значения:
// interface UserValue {
//   user: { name: string; role: string } | null
//   login: (name: string) => void
//   logout: () => void
// }
// const [UserCtx, useUser] = createStrictContext<UserValue>('User')

// TODO: Реализуйте UserProvider
// - useState для user
// - useMemo для мемоизации значения
// function UserProvider({ children }: { children: ReactNode }) { ... }

// TODO: Создайте компонент ThemeDemo
// - Читает mode и toggleMode через useTheme()
// - Показывает текущую тему
// - Кнопка переключения темы

// TODO: Создайте компонент UserDemo
// - Читает user, login, logout через useUser()
// - Если user === null: input для имени + кнопка "Войти"
// - Если user !== null: имя, роль + кнопка "Выйти"

// TODO: Создайте ErrorBoundary (class component)
// - Ловит ошибки через getDerivedStateFromError
// - Показывает сообщение ошибки в блоке с красным фоном

// TODO: Создайте компонент BadComponent (без провайдера)
// - Вызывает useTheme() — выбросит ошибку
// - ErrorBoundary поймает её

export function Task5_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 5.1</h2>
      <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '1rem' }}>
        Реализуйте createStrictContext, ThemeProvider, UserProvider и демо-компоненты
      </p>

      {/* TODO: Отрендерите ThemeProvider с ThemeDemo внутри */}
      {/* <ThemeProvider><ThemeDemo /></ThemeProvider> */}

      {/* TODO: Отрендерите UserProvider с UserDemo внутри */}
      {/* <UserProvider><UserDemo /></UserProvider> */}

      {/* TODO: Отрендерите блок с ErrorBoundary и кнопкой вызова ошибки */}

      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Здесь должно быть демо createStrictContext с ThemeContext и UserContext
      </div>
    </div>
  )
}
