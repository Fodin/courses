import { useLanguage } from 'src/hooks'
import { createContext, useContext, useState, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'

// ============================================
// Задание 5.2: Разделить AppContext на 4 контекста
// ============================================
//
// Ниже представлен монолитный AppContext, который хранит user, theme, locale
// и notifications в одном объекте. Разбейте его на 4 независимых контекста
// и докажите оптимизацию с помощью счётчиков рендеров.

// ❌ Монолит — этот контекст нужно разбить:
// interface AppState {
//   user: { name: string; role: string } | null
//   theme: 'light' | 'dark'
//   locale: 'ru' | 'en'
//   notifications: Array<{ id: string; text: string }>
//   setUser: (u: AppState['user']) => void
//   setTheme: (t: AppState['theme']) => void
//   setLocale: (l: AppState['locale']) => void
//   addNotification: (text: string) => void
//   dismissNotification: (id: string) => void
// }

// TODO: Реализуйте createStrictContext (можно скопировать из 5.1)
// function createStrictContext<T>(displayName: string) { ... }

// TODO: UserContext
// interface UserValue { user: ..., setUser: ... }
// const [UserCtx, useUser] = createStrictContext<UserValue>('User')
// function UserProvider({ children }: ...) { ... useMemo ... }

// TODO: ThemeContext
// interface ThemeValue { mode: ..., setMode: ... }
// const [ThemeCtx, useTheme] = createStrictContext<ThemeValue>('Theme')
// function ThemeProvider({ children }: ...) { ... useMemo ... }

// TODO: LocaleContext
// interface LocaleValue { locale: ..., setLocale: ... }
// const [LocaleCtx, useLocale] = createStrictContext<LocaleValue>('Locale')
// function LocaleProvider({ children }: ...) { ... useMemo ... }

// TODO: NotificationsContext
// interface Notification { id: string; text: string }
// interface NotificationsValue { notifications: ..., addNotification: ..., dismissNotification: ... }
// const [NotificationsCtx, useNotifications] = createStrictContext<NotificationsValue>('Notifications')
// function NotificationsProvider({ children }: ...) { ... useMemo ... }

// TODO: Счётчик рендеров через useRef (не useState!)
// function useRenderCount() {
//   const ref = useRef(0)
//   ref.current += 1  // выполняется при каждом рендере компонента
//   return ref.current
// }

// TODO: UserWidget — читает только UserContext
// - показывает имя и роль пользователя
// - кнопка "Войти / Выйти"
// - отображает счётчик рендеров: "Рендеров: {renders}"

// TODO: ThemeWidget — читает только ThemeContext
// - показывает текущую тему
// - кнопка "Сменить тему"
// - отображает счётчик рендеров

// TODO: LocaleWidget — читает только LocaleContext
// - показывает текущую локаль
// - кнопка переключения
// - отображает счётчик рендеров

// TODO: NotificationsWidget — читает только NotificationsContext
// - показывает список уведомлений
// - кнопка "Добавить уведомление"
// - кнопка "✕" для каждого уведомления (dismiss)
// - отображает счётчик рендеров

export function Task5_2() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 5.2</h2>
      <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '1rem' }}>
        Разделите AppContext на 4 контекста. Нажмите "Добавить уведомление" —
        счётчик должен расти только у NotificationsWidget.
      </p>

      {/* TODO: Оберните в 4 провайдера и отрендерите 4 виджета */}
      {/* <UserProvider>
        <ThemeProvider>
          <LocaleProvider>
            <NotificationsProvider>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <UserWidget />
                <ThemeWidget />
                <LocaleWidget />
                <NotificationsWidget />
              </div>
            </NotificationsProvider>
          </LocaleProvider>
        </ThemeProvider>
      </UserProvider> */}

      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Здесь должны быть 4 виджета со счётчиками рендеров
      </div>
    </div>
  )
}
