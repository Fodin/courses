import { useContext, createContext, type ReactNode } from 'react'
import React from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.2: withAuth HOC + AuthContext
// ============================================
//
// 1. Создайте AuthContext с типом AuthContextValue (описан ниже)
// 2. Реализуйте AuthProvider — управляет состоянием авторизации
// 3. Реализуйте HOC withAuth<P>:
//    - Читает isAuthenticated из AuthContext
//    - Если не авторизован → рендерит LoginPrompt
//    - Если авторизован → рендерит Component
//    - Поддерживает options.requiredRole (если роль не совпадает → AccessDenied)
// 4. Установите displayName: withAuth(ComponentName)
//
// ВАЖНО: useContext нужно вызывать внутри возвращаемого компонента,
// не в самой функции-фабрике withAuth!

// --- Типы ---

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

// --- TODO: Создайте AuthContext ---
// Используйте createContext с начальными значениями по умолчанию
const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
})

// --- TODO: Реализуйте AuthProvider ---
// Управляет состоянием user через useState
// Предоставляет login(role) и logout через Context.Provider
// Используйте useMemo для значения провайдера
function AuthProvider({ children }: { children: ReactNode }) {
  // TODO: useState для user: AuthUser | null
  // TODO: useMemo для value

  // Заглушка — замените реализацией
  return (
    <AuthContext.Provider value={{ isAuthenticated: false, user: null, login: () => {}, logout: () => {} }}>
      {children}
    </AuthContext.Provider>
  )
}

// --- TODO: Реализуйте компонент LoginPrompt ---
// Показывается неавторизованным пользователям
// Содержит кнопки "Войти как user" и "Войти как admin"
// Использует AuthContext для вызова login()
function LoginPrompt() {
  // TODO: useContext(AuthContext)
  return (
    <div style={{ padding: '1.5rem', background: '#fefce8', border: '1px dashed #fbbf24', borderRadius: '8px', color: '#92400e' }}>
      <div style={{ marginBottom: '0.75rem', fontWeight: 600 }}>🔒 Необходима авторизация</div>
      {/* TODO: кнопки login('user') и login('admin') */}
      <div style={{ fontSize: '0.85rem' }}>TODO: добавьте кнопки входа</div>
    </div>
  )
}

// --- TODO: Реализуйте компонент AccessDenied ---
// Показывается при недостаточных правах (role не совпадает)
function AccessDenied() {
  return (
    <div style={{ padding: '1.5rem', background: '#fef2f2', border: '1px dashed #fca5a5', borderRadius: '8px', color: '#991b1b', textAlign: 'center' }}>
      {/* TODO: сообщение о недостаточных правах */}
      <div>⛔ TODO: сообщение об ошибке доступа</div>
    </div>
  )
}

// --- TODO: Реализуйте withAuth HOC ---

interface WithAuthOptions {
  requiredRole?: 'admin' | 'user'
}

// TODO: Раскомментируйте и реализуйте withAuth
// function withAuth<P extends object>(Component: React.ComponentType<P>, options: WithAuthOptions = {}) {
//   const WithAuth = (props: P) => {
//     const { isAuthenticated, user } = useContext(AuthContext)
//     if (!isAuthenticated) return <LoginPrompt />
//     if (options.requiredRole && user?.role !== options.requiredRole) return <AccessDenied />
//     return <Component {...props} />
//   }
//   WithAuth.displayName = `withAuth(${Component.displayName ?? Component.name ?? 'Component'})`
//   return WithAuth
// }

// --- Компоненты для демонстрации ---

function Dashboard() {
  const { user, logout } = useContext(AuthContext)
  return (
    <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
      <div style={{ fontWeight: 600, color: '#166534', marginBottom: '0.5rem' }}>📊 Dashboard</div>
      <div style={{ fontSize: '0.9rem', color: '#15803d' }}>Добро пожаловать, {user?.name}!</div>
      <button
        onClick={logout}
        style={{ marginTop: '0.75rem', padding: '0.3rem 0.75rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
      >
        Выйти
      </button>
    </div>
  )
}

function AdminPanel() {
  return (
    <div style={{ padding: '1rem', background: '#faf5ff', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
      <div style={{ fontWeight: 600, color: '#6b21a8', marginBottom: '0.5rem' }}>⚙️ Admin Panel</div>
      <div style={{ fontSize: '0.9rem', color: '#7c3aed' }}>Только для администраторов</div>
    </div>
  )
}

// TODO: Создайте ProtectedDashboard и ProtectedAdminPanel через withAuth
// const ProtectedDashboard = withAuth(Dashboard)
// const ProtectedAdminPanel = withAuth(AdminPanel, { requiredRole: 'admin' })

export function Task4_2() {
  const { t } = useLanguage()

  return (
    // TODO: Оберните содержимое в <AuthProvider>...</AuthProvider>
    <div className="exercise-container">
      <h2>{t('task.title')} 4.2 — withAuth HOC</h2>
      <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        Реализуйте AuthContext, AuthProvider и HOC withAuth. Dashboard — для всех авторизованных.
        AdminPanel — только для admin.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1 }}>
            withAuth(Dashboard)
          </div>
          {/* TODO: замените на <ProtectedDashboard /> */}
          <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '8px', color: '#92400e', fontSize: '0.85rem' }}>
            TODO: ProtectedDashboard
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1 }}>
            withAuth(AdminPanel, &#123; requiredRole: 'admin' &#125;)
          </div>
          {/* TODO: замените на <ProtectedAdminPanel /> */}
          <div style={{ padding: '1rem', background: '#fef9c3', borderRadius: '8px', color: '#92400e', fontSize: '0.85rem' }}>
            TODO: ProtectedAdminPanel (только admin)
          </div>
        </div>
      </div>
    </div>
  )
}
