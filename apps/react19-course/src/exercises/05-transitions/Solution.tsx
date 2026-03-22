import { useState, useTransition, Suspense, lazy, useDeferredValue, memo } from 'react'

// ============================================
// Задание 5.1: useTransition + isPending — Решение
// ============================================

function SlowList({ count }: { count: number }) {
  const items = []
  for (let i = 0; i < count; i++) {
    items.push(<SlowItem key={i} text={`Элемент ${i + 1}`} />)
  }
  return <ul style={{ listStyle: 'none', padding: 0 }}>{items}</ul>
}

function SlowItem({ text }: { text: string }) {
  const startTime = performance.now()
  // Искусственная задержка рендеринга (~1ms на элемент)
  while (performance.now() - startTime < 1) {
    // блокируем
  }
  return (
    <li style={{ padding: '0.25rem 0.5rem', borderBottom: '1px solid #eee' }}>
      {text}
    </li>
  )
}

const tabContent: Record<string, { label: string; count: number }> = {
  home: { label: 'Главная', count: 10 },
  posts: { label: 'Публикации', count: 500 },
  settings: { label: 'Настройки', count: 50 },
}

export function Task5_1_Solution() {
  const [activeTab, setActiveTab] = useState('home')
  const [isPending, startTransition] = useTransition()

  function handleTabChange(tab: string) {
    startTransition(() => {
      setActiveTab(tab)
    })
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: useTransition + isPending</h2>

      <div style={{ maxWidth: '600px' }}>
        {/* Навигация вкладок */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {Object.entries(tabContent).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              style={{
                padding: '0.5rem 1rem',
                background: activeTab === key ? '#1976d2' : '#e0e0e0',
                color: activeTab === key ? '#fff' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {label}
              {key === 'posts' && ' (500)'}
            </button>
          ))}
        </div>

        {/* Контент с индикатором загрузки */}
        <div
          style={{
            opacity: isPending ? 0.5 : 1,
            transition: 'opacity 0.2s',
            padding: '1rem',
            background: '#f5f5f5',
            borderRadius: '8px',
            maxHeight: '400px',
            overflow: 'auto',
          }}
        >
          {isPending && (
            <div style={{ textAlign: 'center', padding: '0.5rem', color: '#1976d2' }}>
              Загрузка вкладки...
            </div>
          )}
          <h3>{tabContent[activeTab].label}</h3>
          <SlowList count={tabContent[activeTab].count} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 5.2: Async transitions — Решение
// ============================================

interface User {
  id: number
  name: string
  email: string
  company: { name: string }
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users')
  if (!response.ok) throw new Error('Ошибка загрузки')
  // Искусственная задержка для демонстрации
  await new Promise(resolve => setTimeout(resolve, 1500))
  return response.json()
}

export function Task5_2_Solution() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleLoadUsers() {
    setError(null)
    startTransition(async () => {
      try {
        const data = await fetchUsers()
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
      }
    })
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.2: Async transitions</h2>

      <div style={{ maxWidth: '600px' }}>
        <button
          onClick={handleLoadUsers}
          disabled={isPending}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            cursor: isPending ? 'wait' : 'pointer',
          }}
        >
          {isPending ? 'Загрузка пользователей...' : 'Загрузить пользователей'}
        </button>

        {error && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#ffebee',
              borderRadius: '8px',
              color: '#c62828',
            }}
          >
            {error}
          </div>
        )}

        {users.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3>Пользователи ({users.length}):</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {users.map(user => (
                <li
                  key={user.id}
                  style={{
                    padding: '0.75rem 1rem',
                    marginBottom: '0.5rem',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                  }}
                >
                  <strong>{user.name}</strong>
                  <br />
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    {user.email} — {user.company.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Задание 5.3: Suspense при навигации — Решение
// ============================================

// Имитация lazy-loaded компонентов с задержкой
const HomePage = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>(resolve =>
      setTimeout(
        () =>
          resolve({
            default: () => (
              <div style={{ padding: '2rem', background: '#e8f5e9', borderRadius: '8px' }}>
                <h3>Главная страница</h3>
                <p>Добро пожаловать! Это домашняя страница приложения.</p>
                <p>Выберите раздел в навигации выше.</p>
              </div>
            ),
          }),
        800
      )
    )
)

const AboutPage = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>(resolve =>
      setTimeout(
        () =>
          resolve({
            default: () => (
              <div style={{ padding: '2rem', background: '#e3f2fd', borderRadius: '8px' }}>
                <h3>О проекте</h3>
                <p>Это демонстрация Suspense при навигации в React 19.</p>
                <p>Компоненты загружаются лениво с помощью React.lazy().</p>
              </div>
            ),
          }),
        1200
      )
    )
)

const ContactPage = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>(resolve =>
      setTimeout(
        () =>
          resolve({
            default: () => (
              <div style={{ padding: '2rem', background: '#fff3e0', borderRadius: '8px' }}>
                <h3>Контакты</h3>
                <p>Email: demo@example.com</p>
                <p>Телефон: +7 (999) 123-45-67</p>
              </div>
            ),
          }),
        1500
      )
    )
)

const pages: Record<string, { label: string; component: React.LazyExoticComponent<React.ComponentType> }> = {
  home: { label: 'Главная', component: HomePage },
  about: { label: 'О проекте', component: AboutPage },
  contact: { label: 'Контакты', component: ContactPage },
}

export function Task5_3_Solution() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isPending, startTransition] = useTransition()

  function navigateTo(page: string) {
    startTransition(() => {
      setCurrentPage(page)
    })
  }

  const PageComponent = pages[currentPage].component

  return (
    <div className="exercise-container">
      <h2>Задание 5.3: Suspense при навигации</h2>

      <div style={{ maxWidth: '600px' }}>
        {/* Навигация */}
        <nav style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {Object.entries(pages).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => navigateTo(key)}
              style={{
                padding: '0.5rem 1rem',
                background: currentPage === key ? '#1976d2' : '#e0e0e0',
                color: currentPage === key ? '#fff' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {isPending && (
          <div style={{ marginBottom: '0.5rem', color: '#1976d2', fontStyle: 'italic' }}>
            Загрузка страницы...
          </div>
        )}

        {/* Контент страницы с Suspense */}
        <div style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 0.3s' }}>
          <Suspense
            fallback={
              <div
                style={{
                  padding: '3rem',
                  textAlign: 'center',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  Загрузка...
                </div>
                <div style={{ color: '#999' }}>Компонент загружается впервые</div>
              </div>
            }
          >
            <PageComponent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 5.4: useDeferredValue initialValue — Решение
// ============================================

const ALL_ITEMS = [
  'React', 'React Router', 'React Query', 'React Hook Form',
  'Redux', 'Redux Toolkit', 'Recoil', 'Remix',
  'Next.js', 'Nuxt.js', 'Nest.js', 'Node.js',
  'TypeScript', 'JavaScript', 'Tailwind CSS', 'Styled Components',
  'Vite', 'Webpack', 'Rollup', 'esbuild',
  'Jest', 'Vitest', 'Cypress', 'Playwright',
  'GraphQL', 'REST API', 'tRPC', 'gRPC',
  'Docker', 'Kubernetes', 'GitHub Actions', 'Vercel',
  'PostgreSQL', 'MongoDB', 'Redis', 'Prisma',
  'Zustand', 'Jotai', 'MobX', 'XState',
]

const SearchResults = memo(function SearchResults({ query }: { query: string }) {
  if (query === '') {
    return (
      <div style={{ padding: '1rem', color: '#999', textAlign: 'center' }}>
        Введите запрос для поиска...
      </div>
    )
  }

  // Искусственная задержка рендеринга для демонстрации
  const startTime = performance.now()
  while (performance.now() - startTime < 100) {
    // блокируем
  }

  const filtered = ALL_ITEMS.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  )

  if (filtered.length === 0) {
    return (
      <div style={{ padding: '1rem', color: '#999', textAlign: 'center' }}>
        Ничего не найдено по запросу &quot;{query}&quot;
      </div>
    )
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {filtered.map(item => (
        <li
          key={item}
          style={{
            padding: '0.5rem 1rem',
            borderBottom: '1px solid #eee',
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  )
})

export function Task5_4_Solution() {
  const [query, setQuery] = useState('')
  // React 19: useDeferredValue с initialValue
  const deferredQuery = useDeferredValue(query, '')
  const isStale = deferredQuery !== query

  return (
    <div className="exercise-container">
      <h2>Задание 5.4: useDeferredValue initialValue</h2>

      <div style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label htmlFor="search">Поиск технологий:</label>
          <input
            id="search"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="React, TypeScript, Docker..."
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
          Запрос: &quot;{query}&quot; | Отложенный: &quot;{deferredQuery}&quot;
          {isStale && <span style={{ marginLeft: '0.5rem', color: '#f57c00' }}>(обновление...)</span>}
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            opacity: isStale ? 0.6 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          <SearchResults query={deferredQuery} />
        </div>
      </div>
    </div>
  )
}
