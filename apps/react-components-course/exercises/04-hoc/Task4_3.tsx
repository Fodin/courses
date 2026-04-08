import { useState, useContext, createContext, useMemo, type ReactNode } from 'react'
import React from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.3: Композиция HOC через compose
// Task 4.3: HOC Composition via compose
// ============================================
//
// 1. Реализуйте класс ErrorBoundaryClass (extends React.Component)
// 1. Implement the ErrorBoundaryClass class (extends React.Component)
//    - getDerivedStateFromError — переходит в режим ошибки
//    - getDerivedStateFromError — transitions to error state
//    - componentDidCatch — логирует ошибку
//    - componentDidCatch — logs the error
//    - render — показывает fallback или дефолтный UI
//    - render — shows fallback or default UI
// 2. Реализуйте withErrorBoundary<P> HOC
// 2. Implement the withErrorBoundary<P> HOC
// 3. Реализуйте функцию compose (справа налево, через reduceRight)
// 3. Implement the compose function (right to left, via reduceRight)
// 4. Примените compose(withErrorBoundary, withAuth, withLoading)(ReportComponent)
// 4. Apply compose(withErrorBoundary, withAuth, withLoading)(ReportComponent)
// 5. Добавьте кнопки демонстрации всех состояний
// 5. Add buttons to demonstrate all states

// ---- AuthContext (повторяется из задания 4.2) ----
// ---- AuthContext (repeated from task 4.2) ----

interface AuthUser {
  name: string
  role: 'admin' | 'user'
}

interface AuthContextValue {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (role: 'admin' | 'user') => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
})

// TODO: Реализуйте AuthProvider (можно скопировать из задания 4.2)
// TODO: Implement AuthProvider (can copy from task 4.2)
function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ isAuthenticated: false, user: null, login: () => {}, logout: () => {} }}>
      {children}
    </AuthContext.Provider>
  )
}

function LoginPrompt() {
  const { login } = useContext(AuthContext)
  return (
    <div style={{ padding: '1.5rem', background: '#fefce8', border: '1px dashed #fbbf24', borderRadius: '8px', color: '#92400e' }}>
      {/* Необходима авторизация */}
      {/* Authorization required */}
      <div style={{ marginBottom: '0.75rem', fontWeight: 600 }}>🔒 Необходима авторизация</div>
      <button onClick={() => login('user')} style={{ padding: '0.4rem 0.75rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
        {/* Войти как user */}
        {/* Login as user */}
        Войти как user
      </button>
    </div>
  )
}

// ---- withLoading (повторяется из задания 4.1) ----
// ---- withLoading (repeated from task 4.1) ----

function Spinner() {
  return <div style={{ padding: '1rem', color: '#64748b' }}>⏳ Загрузка...</div>
}

// TODO: Реализуйте withLoading (можно скопировать из задания 4.1)
// TODO: Implement withLoading (can copy from task 4.1)
// function withLoading<P extends object>(Component: React.ComponentType<P>) { ... }

// ---- withAuth (повторяется из задания 4.2) ----
// ---- withAuth (repeated from task 4.2) ----

// TODO: Реализуйте withAuth (можно скопировать из задания 4.2)
// TODO: Implement withAuth (can copy from task 4.2)
// function withAuth<P extends object>(Component: React.ComponentType<P>) { ... }

// ---- TODO: Реализуйте ErrorBoundaryClass ----
// ---- TODO: Implement ErrorBoundaryClass ----
//
// interface ErrorBoundaryState { hasError: boolean; error: Error | null }
// interface ErrorBoundaryProps { children: ReactNode; fallback?: ReactNode }
//
// class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
//   state: ErrorBoundaryState = { hasError: false, error: null }
//   static getDerivedStateFromError(error: Error): ErrorBoundaryState { ... }
//   componentDidCatch(error: Error, info: React.ErrorInfo) { console.error(...) }
//   render() { if (this.state.hasError) return fallback ?? <DefaultError> ... }
// }

// ---- TODO: Реализуйте withErrorBoundary HOC ----
// ---- TODO: Implement withErrorBoundary HOC ----
// function withErrorBoundary<P extends object>(Component: React.ComponentType<P>, fallback?: ReactNode) {
//   const WithErrorBoundary = (props: P) => (
//     <ErrorBoundaryClass fallback={fallback}><Component {...props} /></ErrorBoundaryClass>
//   )
//   WithErrorBoundary.displayName = `withErrorBoundary(${???})`
//   return WithErrorBoundary
// }

// ---- TODO: Реализуйте compose ----
// ---- TODO: Implement compose ----
//
// Применяет HOC справа налево: compose(f, g, h)(x) = f(g(h(x)))
// Applies HOCs right to left: compose(f, g, h)(x) = f(g(h(x)))
// Подсказка: используйте reduceRight
// Hint: use reduceRight
//
// function compose<P>(
//   ...hocs: Array<(c: React.ComponentType<any>) => React.ComponentType<any>>
// ) {
//   return (Component: React.ComponentType<P>): React.ComponentType<any> =>
//     hocs.reduceRight((acc, hoc) => hoc(acc), Component as React.ComponentType<any>)
// }

// ---- Компонент для демонстрации ----
// ---- Component for demonstration ----

interface ReportProps {
  title: string
  shouldThrow?: boolean
}

function ReportComponent({ title, shouldThrow }: ReportProps) {
  const { user } = useContext(AuthContext)

  // Этот throw будет пойман withErrorBoundary
  // This throw will be caught by withErrorBoundary
  if (shouldThrow) {
    throw new Error(`Ошибка в компоненте "${title}"`)
  }

  return (
    <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
      <div style={{ fontWeight: 600, color: '#1d4ed8', marginBottom: '0.5rem' }}>📋 {title}</div>
      <div style={{ fontSize: '0.9rem', color: '#3b82f6' }}>
        {/* Пользователь: {user?.name} ({user?.role}) */}
        {/* User: {user?.name} ({user?.role}) */}
        Пользователь: {user?.name} ({user?.role})
      </div>
    </div>
  )
}

// TODO: Создайте EnhancedReport через compose ЗДЕСЬ (вне рендера!)
// TODO: Create EnhancedReport via compose HERE (outside render!)
// const EnhancedReport = compose<ReportProps & { isLoading: boolean }>(
//   withErrorBoundary,
//   withAuth,
//   withLoading
// )(ReportComponent)

export function Task4_3() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [shouldThrow, setShouldThrow] = useState(false)

  const simulateLoad = () => {
    setIsLoading(true)
    setShouldThrow(false)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    // TODO: Оберните в <AuthProvider>
    // TODO: Wrap in <AuthProvider>
    <div className="exercise-container">
      <h2>{t('task.title')} 4.3 — Композиция HOC через compose</h2>
      <p style={{ color: '#64748b', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
        {/* Реализуйте compose и примените: compose(withErrorBoundary, withAuth, withLoading)(ReportComponent) */}
        {/* Implement compose and apply: compose(withErrorBoundary, withAuth, withLoading)(ReportComponent) */}
        Реализуйте compose и примените: <code>compose(withErrorBoundary, withAuth, withLoading)(ReportComponent)</code>
      </p>

      <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem' }}>
        {/* Порядок оборачивания (снаружи → внутри): */}
        {/* Wrapping order (outside → inside): */}
        Порядок оборачивания (снаружи → внутрь):{' '}
        <code style={{ color: '#7c3aed' }}>withErrorBoundary → withAuth → withLoading → ReportComponent</code>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* TODO: кнопки login/logout (используйте AuthContext) */}
        {/* TODO: login/logout buttons (use AuthContext) */}
        <button
          onClick={simulateLoad}
          disabled={isLoading}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {/* Загрузка... / Симулировать загрузку */}
          {/* Loading... / Simulate loading */}
          {isLoading ? '⏳ Загрузка...' : 'Симулировать загрузку'}
        </button>
        <button
          onClick={() => setShouldThrow(v => !v)}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', background: '#fff1f2', color: '#e11d48', border: '1px solid #fda4af', borderRadius: '4px', cursor: 'pointer' }}
        >
          {/* Исправить / Сломать компонент */}
          {/* Fix / Break component */}
          {shouldThrow ? '🔧 Исправить' : '💥 Сломать компонент'}
        </button>
      </div>

      {/* TODO: замените на <EnhancedReport title="Отчёт Q1" isLoading={isLoading} shouldThrow={shouldThrow} /> */}
      {/* TODO: replace with <EnhancedReport title="Report Q1" isLoading={isLoading} shouldThrow={shouldThrow} /> */}
      <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '8px', color: '#92400e', fontSize: '0.85rem' }}>
        TODO: EnhancedReport (isLoading={String(isLoading)}, shouldThrow={String(shouldThrow)})
      </div>
    </div>
  )
}
