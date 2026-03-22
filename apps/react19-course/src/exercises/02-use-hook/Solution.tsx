import { useState, use, Suspense, createContext, Component, type ReactNode } from 'react'

// ============================================
// Task 2.1 Solution: use(Promise)
// ============================================

function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

const usersPromise = delay(
  [
    { id: 1, name: 'Анна', role: 'Frontend' },
    { id: 2, name: 'Борис', role: 'Backend' },
    { id: 3, name: 'Вика', role: 'Designer' },
  ],
  1500
)

function UserList({ dataPromise }: { dataPromise: Promise<{ id: number; name: string; role: string }[]> }) {
  const users = use(dataPromise)

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {users.map((user) => (
        <li
          key={user.id}
          style={{
            padding: '0.75rem',
            margin: '0.5rem 0',
            background: '#f5f5f5',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <strong>{user.name}</strong>
          <span style={{ color: '#666' }}>{user.role}</span>
        </li>
      ))}
    </ul>
  )
}

export function Task2_1_Solution() {
  return (
    <div className="exercise-container">
      <h2>Решение 2.1: use(Promise)</h2>
      <p>
        Хук <code>use()</code> читает значение из промиса. Компонент приостанавливается (suspends), пока данные
        загружаются.
      </p>

      <Suspense
        fallback={
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>⏳ Загрузка пользователей...</div>
        }
      >
        <UserList dataPromise={usersPromise} />
      </Suspense>

      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '0.85rem',
        }}
      >
        <strong>Важно:</strong> Промис создаётся <em>вне</em> компонента или кэшируется. Нельзя создавать промис прямо
        в рендере — это вызовет бесконечный цикл.
      </div>
    </div>
  )
}

// ============================================
// Task 2.2 Solution: use(Context)
// ============================================

const ThemeContext = createContext<'light' | 'dark'>('light')

function ThemedCard() {
  const theme = use(ThemeContext)

  return (
    <div
      style={{
        padding: '1.5rem',
        borderRadius: '8px',
        background: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#333',
        border: `1px solid ${theme === 'dark' ? '#555' : '#ddd'}`,
        transition: 'all 0.3s',
      }}
    >
      <h3>Карточка с темой</h3>
      <p>
        Текущая тема: <strong>{theme === 'dark' ? 'Тёмная' : 'Светлая'}</strong>
      </p>
      <p>
        Используем <code>use(ThemeContext)</code> вместо <code>useContext(ThemeContext)</code>
      </p>
    </div>
  )
}

export function Task2_2_Solution() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <div className="exercise-container">
      <h2>Решение 2.2: use(Context)</h2>

      <button
        onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}
      >
        Переключить тему
      </button>

      <ThemeContext value={theme}>
        <ThemedCard />
      </ThemeContext>

      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#e8f5e9',
          borderRadius: '8px',
          fontSize: '0.85rem',
        }}
      >
        <strong>React 19:</strong> Вместо <code>{'<ThemeContext.Provider value={...}>'}</code> теперь можно писать{' '}
        <code>{'<ThemeContext value={...}>'}</code>
      </div>
    </div>
  )
}

// ============================================
// Task 2.3 Solution: Условный use()
// ============================================

const UserContext = createContext({ name: 'Гость', isLoggedIn: false })

function Greeting({ showUser }: { showUser: boolean }) {
  if (showUser) {
    const user = use(UserContext)
    return (
      <div
        style={{
          padding: '1rem',
          background: '#e8f5e9',
          borderRadius: '8px',
          border: '1px solid #4caf50',
        }}
      >
        <p>
          Привет, <strong>{user.name}</strong>!
        </p>
        <p>Статус: {user.isLoggedIn ? '✅ Авторизован' : '❌ Не авторизован'}</p>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '8px',
      }}
    >
      <p>Контекст пользователя не используется</p>
    </div>
  )
}

export function Task2_3_Solution() {
  const [showUser, setShowUser] = useState(false)

  return (
    <div className="exercise-container">
      <h2>Решение 2.3: Условный use()</h2>

      <p>
        В отличие от <code>useContext</code>, <code>use()</code> можно вызывать внутри условий и циклов!
      </p>

      <button
        onClick={() => setShowUser(!showUser)}
        style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}
      >
        {showUser ? 'Скрыть пользователя' : 'Показать пользователя'}
      </button>

      <UserContext value={{ name: 'Алексей', isLoggedIn: true }}>
        <Greeting showUser={showUser} />
      </UserContext>

      <pre
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px',
          fontSize: '0.8rem',
          overflow: 'auto',
        }}
      >
        {`// ✅ Это работает с use()!
function Greeting({ showUser }) {
  if (showUser) {
    const user = use(UserContext)  // Условный вызов
    return <p>Привет, {user.name}!</p>
  }
  return <p>Нет пользователя</p>
}

// ❌ Это НЕ работает с useContext!
// useContext нельзя вызывать условно`}
      </pre>
    </div>
  )
}

// ============================================
// Task 2.4 Solution: Suspense + use + ErrorBoundary
// ============================================

class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '1rem',
            background: '#ffebee',
            borderRadius: '8px',
            border: '1px solid #ef5350',
          }}
        >
          <h4>Ошибка загрузки</h4>
          <p>{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ padding: '0.5rem 1rem' }}
          >
            Попробовать снова
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function createDataPromise(shouldFail: boolean) {
  return new Promise<{ title: string; body: string }[]>((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Сервер вернул ошибку 500'))
      } else {
        resolve([
          { title: 'Статья 1', body: 'Содержание первой статьи...' },
          { title: 'Статья 2', body: 'Содержание второй статьи...' },
          { title: 'Статья 3', body: 'Содержание третьей статьи...' },
        ])
      }
    }, 1500)
  })
}

function ArticleList({ dataPromise }: { dataPromise: Promise<{ title: string; body: string }[]> }) {
  const articles = use(dataPromise)

  return (
    <div>
      {articles.map((article, i) => (
        <div
          key={i}
          style={{
            padding: '1rem',
            margin: '0.5rem 0',
            background: '#f5f5f5',
            borderRadius: '8px',
          }}
        >
          <h4>{article.title}</h4>
          <p style={{ color: '#666' }}>{article.body}</p>
        </div>
      ))}
    </div>
  )
}

export function Task2_4_Solution() {
  const [shouldFail, setShouldFail] = useState(false)
  const [key, setKey] = useState(0)
  const [promise, setPromise] = useState(() => createDataPromise(false))

  const reload = (fail: boolean) => {
    setShouldFail(fail)
    setPromise(createDataPromise(fail))
    setKey((k) => k + 1)
  }

  return (
    <div className="exercise-container">
      <h2>Решение 2.4: Suspense + use + ErrorBoundary</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => reload(false)} style={{ padding: '0.5rem 1rem' }}>
          Загрузить (успех)
        </button>
        <button onClick={() => reload(true)} style={{ padding: '0.5rem 1rem' }}>
          Загрузить (ошибка)
        </button>
      </div>

      <ErrorBoundary key={key} fallback={<p>Ошибка!</p>}>
        <Suspense
          fallback={
            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>⏳ Загрузка статей...</div>
          }
        >
          <ArticleList dataPromise={promise} />
        </Suspense>
      </ErrorBoundary>

      <pre
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#fff3e0',
          borderRadius: '8px',
          fontSize: '0.8rem',
          overflow: 'auto',
        }}
      >
        {`<ErrorBoundary>        ← ловит ошибки
  <Suspense fallback>   ← показывает loading
    <Component />       ← use(promise) внутри
  </Suspense>
</ErrorBoundary>`}
      </pre>
    </div>
  )
}
