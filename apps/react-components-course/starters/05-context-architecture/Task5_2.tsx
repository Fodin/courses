import { useLanguage } from 'src/hooks'
import { createContext, useContext, useState, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'

// ============================================
// Task 5.2: Split AppContext into 4 contexts
// Задание 5.2: Разделить AppContext на 4 контекста
// ============================================
//
// Below is a monolithic AppContext that holds user, theme, locale
// and notifications in one object. Split it into 4 independent contexts
// and prove the optimization with render counters.
//
// Ниже представлен монолитный AppContext, который хранит user, theme, locale
// и notifications в одном объекте. Разбейте его на 4 независимых контекста
// и докажите оптимизацию с помощью счётчиков рендеров.

// Monolith — this context needs to be split:
// Монолит — этот контекст нужно разбить:
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

// TODO: Implement createStrictContext (can copy from 5.1)
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
// TODO: NotificationsContext
// interface Notification { id: string; text: string }
// interface NotificationsValue { notifications: ..., addNotification: ..., dismissNotification: ... }
// const [NotificationsCtx, useNotifications] = createStrictContext<NotificationsValue>('Notifications')
// function NotificationsProvider({ children }: ...) { ... useMemo ... }

// TODO: Render counter via useRef (not useState!)
// TODO: Счётчик рендеров через useRef (не useState!)
// function useRenderCount() {
//   const ref = useRef(0)
//   ref.current += 1  // runs on every component render
//   return ref.current
// }

// TODO: UserWidget — reads only UserContext
// TODO: UserWidget — читает только UserContext
// - shows user name and role
// - показывает имя и роль пользователя
// - "Login / Logout" button
// - кнопка "Войти / Выйти"
// - displays render counter: "Renders: {renders}"
// - отображает счётчик рендеров: "Рендеров: {renders}"

// TODO: ThemeWidget — reads only ThemeContext
// TODO: ThemeWidget — читает только ThemeContext
// - shows current theme
// - показывает текущую тему
// - "Change theme" button
// - кнопка "Сменить тему"
// - displays render counter
// - отображает счётчик рендеров

// TODO: LocaleWidget — reads only LocaleContext
// TODO: LocaleWidget — читает только LocaleContext
// - shows current locale
// - показывает текущую локаль
// - toggle button
// - кнопка переключения
// - displays render counter
// - отображает счётчик рендеров

// TODO: NotificationsWidget — reads only NotificationsContext
// TODO: NotificationsWidget — читает только NotificationsContext
// - shows notification list
// - показывает список уведомлений
// - "Add notification" button
// - кнопка "Добавить уведомление"
// - "x" button for each notification (dismiss)
// - кнопка "✕" для каждого уведомления (dismiss)
// - displays render counter
// - отображает счётчик рендеров

export function Task5_2() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 5.2</h2>
      <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '1rem' }}>
        Split AppContext into 4 contexts. Press "Add notification" —
        the counter should only increase for NotificationsWidget.
      </p>

      {/* TODO: Wrap in 4 providers and render 4 widgets */}
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
        Here should be 4 widgets with render counters
      </div>
    </div>
  )
}
