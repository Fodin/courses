import React, {
  useState,
  useEffect,
  useRef,
  useTransition,
  Component,
  type ReactNode,
  type ErrorInfo,
} from 'react'

// ─── Shared styles ────────────────────────────────────────────────────────────

const btn = (bg: string, color = '#fff'): React.CSSProperties => ({
  padding: '8px 16px',
  borderRadius: 8,
  border: 'none',
  background: bg,
  color,
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: 14,
})

const card = (color: string): React.CSSProperties => ({
  padding: 16,
  borderRadius: 10,
  border: `2px solid ${color}`,
  background: '#fff',
  flex: 1,
})

// ─── Task 10.1: Suspense Mechanics ───────────────────────────────────────────

type ResourceStatus = 'pending' | 'fulfilled' | 'rejected'

interface Resource<T> {
  read(): T
}

function createResource<T>(promise: Promise<T>): Resource<T> {
  let status: ResourceStatus = 'pending'
  let value: T
  let error: unknown

  const suspender = promise.then(
    (v) => { status = 'fulfilled'; value = v },
    (e) => { status = 'rejected'; error = e },
  )

  return {
    read(): T {
      if (status === 'pending')   throw suspender
      if (status === 'rejected')  throw error
      return value
    },
  }
}

interface SuspenseBoundaryState {
  caught: unknown | null
}

class MiniSuspense extends Component<
  { fallback: ReactNode; children: ReactNode },
  SuspenseBoundaryState
> {
  state: SuspenseBoundaryState = { caught: null }

  static getDerivedStateFromError(error: unknown): SuspenseBoundaryState {
    // Ловим всё: и Promise, и Error
    return { caught: error }
  }

  componentDidCatch(error: unknown, _info: ErrorInfo) {
    if (error instanceof Promise) {
      // Подписываемся на resolve Promise — перерендерим children
      error.then(() => {
        this.setState({ caught: null })
      })
    }
  }

  render() {
    const { caught } = this.state
    if (caught instanceof Promise) {
      return <>{this.props.fallback}</>
    }
    if (caught !== null) {
      // Это настоящая ошибка, а не Promise
      return (
        <div style={{ color: '#ef4444', padding: 12, border: '1px solid #ef4444', borderRadius: 8 }}>
          Ошибка: {String(caught)}
        </div>
      )
    }
    return <>{this.props.children}</>
  }
}

interface UserData {
  name: string
  role: string
  joinedYear: number
}

function DataDisplay({ resource }: { resource: Resource<UserData> }) {
  const data = resource.read()
  return (
    <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 8, border: '2px solid #86efac' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#166534', marginBottom: 6 }}>
        {data.name}
      </div>
      <div style={{ fontSize: 14, color: '#4b5563' }}>
        Роль: <strong>{data.role}</strong>
      </div>
      <div style={{ fontSize: 14, color: '#4b5563' }}>
        Год регистрации: <strong>{data.joinedYear}</strong>
      </div>
    </div>
  )
}

function LoadingFallback({ label }: { label: string }) {
  return (
    <div style={{
      padding: 16,
      background: '#fef9c3',
      borderRadius: 8,
      border: '2px solid #fde047',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <div style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        border: '3px solid #fbbf24',
        borderTopColor: 'transparent',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ color: '#92400e', fontWeight: 600 }}>{label}</span>
    </div>
  )
}

function ElapsedTimer({ startTime }: { startTime: number | null }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (startTime === null) { setElapsed(0); return }
    const id = setInterval(() => {
      setElapsed(Math.round((Date.now() - startTime) / 100) * 100)
    }, 100)
    return () => clearInterval(id)
  }, [startTime])

  if (startTime === null) return null

  return (
    <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>
      Прошло: <strong>{(elapsed / 1000).toFixed(1)}s</strong>
    </div>
  )
}

function Demo({
  label,
  delayMs,
  color,
}: {
  label: string
  delayMs: number
  color: string
}) {
  const [resource, setResource] = useState<Resource<UserData> | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [loadCount, setLoadCount] = useState(0)

  const handleLoad = () => {
    const promise = new Promise<UserData>((resolve) => {
      setTimeout(() => {
        resolve({
          name: 'Алексей Петров',
          role: 'Senior React Developer',
          joinedYear: 2021,
        })
      }, delayMs)
    })
    setResource(createResource(promise))
    setStartTime(Date.now())
    setLoadCount(c => c + 1)
  }

  return (
    <div style={card(color)}>
      <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 12,
        background: '#f8fafc',
        padding: '6px 10px',
        borderRadius: 6,
        marginBottom: 12,
        color: '#475569',
      }}>
        задержка: {delayMs}ms
      </div>

      <button style={{ ...btn(color), marginBottom: 12 }} onClick={handleLoad}>
        {loadCount === 0 ? 'Загрузить' : 'Загрузить снова'}
      </button>

      {startTime && <ElapsedTimer startTime={resource ? startTime : null} />}

      <div style={{ marginTop: 12 }}>
        {resource ? (
          <MiniSuspense
            key={loadCount}
            fallback={<LoadingFallback label={`Загрузка... (${delayMs}ms)`} />}
          >
            <DataDisplay resource={resource} />
          </MiniSuspense>
        ) : (
          <div style={{ color: '#9ca3af', fontSize: 14 }}>— нажмите "Загрузить" —</div>
        )}
      </div>
    </div>
  )
}

export function Task10_1_Solution() {
  return (
    <div className="exercise-container">
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <h2 style={{ marginBottom: 4 }}>Задание 10.1: Suspense Mechanics</h2>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
        MiniSuspense ловит thrown Promise через <code>getDerivedStateFromError</code>,
        показывает fallback, при resolve — перерендеривает children.
      </p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <Demo label="Быстрая загрузка" delayMs={1000} color="#3b82f6" />
        <Demo label="Медленная загрузка" delayMs={3000} color="#8b5cf6" />
      </div>

      <div style={{
        padding: '10px 14px',
        background: '#eff6ff',
        borderRadius: 8,
        border: '1px solid #bfdbfe',
        fontSize: 13,
        color: '#1e40af',
      }}>
        <strong>Ключевое:</strong> <code>createResource</code> кэширует Promise.
        Повторные вызовы <code>read()</code> кидают тот же <code>suspender</code> объект
        — React не зацикливается. Без кэша каждый рендер кидал бы новый Promise → infinite loop.
      </div>
    </div>
  )
}

// ─── Task 10.2: Transition vs Sync Update ────────────────────────────────────

const ITEM_COUNT = 8000
const ALL_ITEMS = Array.from({ length: ITEM_COUNT }, (_, i) => {
  const words = ['React', 'Fiber', 'Hook', 'State', 'Effect', 'Memo', 'Ref', 'Context', 'Reducer', 'Portal']
  const w1 = words[i % words.length]
  const w2 = words[(i * 3) % words.length]
  return `${w1}${w2}Item_${i.toString().padStart(4, '0')}`
})

function filterItems(items: string[], query: string): string[] {
  if (!query) return items.slice(0, 50)
  return items.filter(item => item.toLowerCase().includes(query.toLowerCase()))
}

function FpsMonitor() {
  const [fps, setFps] = useState<number>(60)
  const frameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(performance.now())
  const frameCountRef = useRef<number>(0)

  useEffect(() => {
    let animId: number
    const tick = (now: number) => {
      frameCountRef.current += 1
      const delta = now - lastTimeRef.current
      if (delta >= 300) {
        const currentFps = Math.round((frameCountRef.current / delta) * 1000)
        setFps(Math.min(60, currentFps))
        frameCountRef.current = 0
        lastTimeRef.current = now
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [])

  const color = fps >= 50 ? '#16a34a' : fps >= 30 ? '#d97706' : '#dc2626'
  const bg = fps >= 50 ? '#f0fdf4' : fps >= 30 ? '#fefce8' : '#fef2f2'

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 20,
      background: bg,
      border: `1px solid ${color}`,
    }}>
      <div style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
      }} />
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{fps} FPS</span>
    </div>
  )
}

function SyncSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>(() => ALL_ITEMS.slice(0, 50))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    setResults(filterItems(ALL_ITEMS, q))  // sync: тяжёлая фильтрация блокирует поток
  }

  return (
    <div style={card('#ef4444')}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontWeight: 700, color: '#b91c1c' }}>Sync Update</span>
        <FpsMonitor />
      </div>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 11,
        background: '#fef2f2',
        padding: '6px 10px',
        borderRadius: 6,
        marginBottom: 10,
        color: '#7f1d1d',
      }}>
        {'setQuery(q)\nsetResults(filter(8000 items)) // блокирует UI'}
      </div>

      <input
        value={query}
        onChange={handleChange}
        placeholder="Поиск по 8000 элементам..."
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: 8,
          border: '2px solid #fca5a5',
          fontSize: 14,
          marginBottom: 10,
          boxSizing: 'border-box',
          outline: 'none',
        }}
      />

      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
        Найдено: <strong>{results.length}</strong> из {ITEM_COUNT}
      </div>

      <div style={{ height: 200, overflowY: 'auto', fontSize: 12, color: '#374151' }}>
        {results.slice(0, 100).map((item, i) => (
          <div key={i} style={{ padding: '2px 4px', borderBottom: '1px solid #f3f4f6' }}>
            {item}
          </div>
        ))}
        {results.length > 100 && (
          <div style={{ color: '#9ca3af', padding: '4px', fontStyle: 'italic' }}>
            ...и ещё {results.length - 100}
          </div>
        )}
      </div>
    </div>
  )
}

function TransitionSearch() {
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>(() => ALL_ITEMS.slice(0, 50))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)  // sync: input реагирует мгновенно
    startTransition(() => {
      setResults(filterItems(ALL_ITEMS, q))  // transition: можно прервать
    })
  }

  return (
    <div style={card('#10b981')}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontWeight: 700, color: '#065f46' }}>Transition Update</span>
        <FpsMonitor />
      </div>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 11,
        background: '#ecfdf5',
        padding: '6px 10px',
        borderRadius: 6,
        marginBottom: 10,
        color: '#064e3b',
      }}>
        {'setQuery(q)              // sync\nstartTransition(() => {\n  setResults(filter(8000))  // прерываемый\n})'}
      </div>

      <div style={{ position: 'relative', marginBottom: 10 }}>
        <input
          value={query}
          onChange={handleChange}
          placeholder="Поиск по 8000 элементам..."
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 8,
            border: `2px solid ${isPending ? '#6ee7b7' : '#34d399'}`,
            fontSize: 14,
            boxSizing: 'border-box',
            outline: 'none',
            opacity: isPending ? 0.85 : 1,
            transition: 'opacity 0.1s',
          }}
        />
        {isPending && (
          <div style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 11,
            color: '#059669',
            fontWeight: 600,
          }}>
            обновляется...
          </div>
        )}
      </div>

      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
        Найдено: <strong>{results.length}</strong> из {ITEM_COUNT}
        {isPending && <span style={{ color: '#059669', marginLeft: 8 }}>(вычисляется...)</span>}
      </div>

      <div style={{ height: 200, overflowY: 'auto', fontSize: 12, color: '#374151' }}>
        {results.slice(0, 100).map((item, i) => (
          <div key={i} style={{ padding: '2px 4px', borderBottom: '1px solid #f3f4f6' }}>
            {item}
          </div>
        ))}
        {results.length > 100 && (
          <div style={{ color: '#9ca3af', padding: '4px', fontStyle: 'italic' }}>
            ...и ещё {results.length - 100}
          </div>
        )}
      </div>
    </div>
  )
}

export function Task10_2_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: 4 }}>Задание 10.2: Transition vs Sync Update</h2>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
        Быстро набирайте текст в обоих инпутах. Левый (sync) фризит UI при каждом нажатии.
        Правый (transition) остаётся отзывчивым — React может прервать тяжёлую фильтрацию.
      </p>

      <div style={{ display: 'flex', gap: 16 }}>
        <SyncSearch />
        <TransitionSearch />
      </div>

      <div style={{
        marginTop: 16,
        padding: '10px 14px',
        background: '#fefce8',
        borderRadius: 8,
        border: '1px solid #fde68a',
        fontSize: 13,
        color: '#78350f',
      }}>
        <strong>Обратите внимание:</strong> в правом инпуте <code>setQuery</code> синхронный
        (input всегда показывает актуальный ввод), а <code>setResults</code> — transition.
        Это ключевой паттерн: UI feedback синхронный, тяжёлые вычисления — transition.
      </div>
    </div>
  )
}

// ─── Task 10.3: Suspense Waterfall vs Parallel ───────────────────────────────

interface ProfileData {
  name: string
  role: string
  avatar: string
}

interface PostData {
  title: string
  date: string
}

function fetchProfile(id: string): Promise<ProfileData> {
  return new Promise(resolve =>
    setTimeout(() => resolve({
      name: `Пользователь ${id}`,
      role: 'Frontend Developer',
      avatar: id[0].toUpperCase(),
    }), 1200),
  )
}

function fetchPosts(id: string): Promise<PostData[]> {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { title: `Пост #1 от пользователя ${id}`, date: '2024-01-15' },
      { title: `Пост #2 от пользователя ${id}`, date: '2024-02-10' },
      { title: `Пост #3 от пользователя ${id}`, date: '2024-03-05' },
    ]), 800),
  )
}

// Waterfall: ProfileFiber рендерится, получает данные, потом рендерится PostsFiber

class WaterfallMiniSuspense extends Component<
  { fallback: ReactNode; children: ReactNode },
  { caught: unknown | null }
> {
  state = { caught: null }

  static getDerivedStateFromError(error: unknown) {
    return { caught: error }
  }

  componentDidCatch(error: unknown, _info: ErrorInfo) {
    if (error instanceof Promise) {
      error.then(() => this.setState({ caught: null }))
    }
  }

  render() {
    const { caught } = this.state
    const isPromise = caught !== null && typeof (caught as Record<string, unknown>)['then'] === 'function'
    if (isPromise) return <>{this.props.fallback}</>
    if (caught) return <div style={{ color: 'red' }}>Ошибка</div>
    return <>{this.props.children}</>
  }
}

function WaterfallProfile({
  resource,
  postsKey,
}: {
  resource: Resource<ProfileData>
  postsKey: number
}) {
  const profile = resource.read()
  // Fetch posts resource создаётся ЗДЕСЬ — только после получения profile
  const [postsResource] = useState(() => createResource(fetchPosts('1')))

  return (
    <div>
      <ProfileCard profile={profile} />
      <div style={{ marginTop: 8 }}>
        <WaterfallMiniSuspense
          key={postsKey}
          fallback={<SkeletonPosts label="Загрузка постов (800ms)..." />}
        >
          <PostsList resource={postsResource} />
        </WaterfallMiniSuspense>
      </div>
    </div>
  )
}

function ProfileCard({ profile }: { profile: ProfileData }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      background: '#eff6ff',
      borderRadius: 8,
      border: '1px solid #bfdbfe',
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: '#3b82f6',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 18,
        flexShrink: 0,
      }}>
        {profile.avatar}
      </div>
      <div>
        <div style={{ fontWeight: 700, color: '#1e40af' }}>{profile.name}</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>{profile.role}</div>
      </div>
    </div>
  )
}

function PostsList({ resource }: { resource: Resource<PostData[]> }) {
  const posts = resource.read()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {posts.map((post, i) => (
        <div key={i} style={{
          padding: '8px 12px',
          background: '#f0fdf4',
          borderRadius: 6,
          border: '1px solid #86efac',
          fontSize: 13,
        }}>
          <div style={{ fontWeight: 600, color: '#166534' }}>{post.title}</div>
          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{post.date}</div>
        </div>
      ))}
    </div>
  )
}

function SkeletonProfile({ label }: { label: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      background: '#f1f5f9',
      borderRadius: 8,
      border: '1px solid #e2e8f0',
    }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#cbd5e1' }} />
      <div>
        <div style={{ width: 120, height: 14, background: '#cbd5e1', borderRadius: 4, marginBottom: 6 }} />
        <div style={{ width: 80, height: 12, background: '#e2e8f0', borderRadius: 4 }} />
      </div>
      <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>{label}</span>
    </div>
  )
}

function SkeletonPosts({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          padding: '8px 12px',
          background: '#f1f5f9',
          borderRadius: 6,
          border: '1px solid #e2e8f0',
          height: 42,
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{ width: '60%', height: 12, background: '#cbd5e1', borderRadius: 4 }} />
        </div>
      ))}
      <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', textAlign: 'right' }}>{label}</div>
    </div>
  )
}

function Timeline({ profileMs, postsMs, mode }: { profileMs: number; postsMs: number; mode: 'waterfall' | 'parallel' }) {
  const total = mode === 'waterfall' ? profileMs + postsMs : Math.max(profileMs, postsMs)
  const scale = 240 / (profileMs + postsMs)

  return (
    <div style={{ marginTop: 12, padding: 10, background: '#1e1e2e', borderRadius: 8 }}>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>
        Таймлайн запросов
      </div>
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 11, color: '#7dd3fc', marginBottom: 3 }}>Profile fetch (1200ms)</div>
        <div style={{ height: 14, background: '#1e3a5f', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: profileMs * scale,
            background: '#3b82f6',
            borderRadius: 3,
          }} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#86efac', marginBottom: 3 }}>Posts fetch (800ms)</div>
        <div style={{ height: 14, background: '#1e3a5f', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
          {mode === 'waterfall' && (
            <div style={{
              position: 'absolute',
              left: 0,
              width: profileMs * scale,
              height: '100%',
              background: '#1e3a5f',
            }} />
          )}
          <div style={{
            height: '100%',
            width: postsMs * scale,
            background: '#10b981',
            borderRadius: 3,
            marginLeft: mode === 'waterfall' ? profileMs * scale : 0,
            position: mode === 'waterfall' ? 'absolute' : 'relative',
            left: mode === 'waterfall' ? profileMs * scale : undefined,
          }} />
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#f8fafc', marginTop: 8, fontWeight: 700 }}>
        Итого: ~{total}ms
      </div>
    </div>
  )
}

function WaterfallScenario() {
  const [key, setKey] = useState(0)
  const [profileResource, setProfileResource] = useState<Resource<ProfileData> | null>(null)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const startRef = useRef<number>(0)
  const doneRef = useRef(false)

  const handleLoad = () => {
    startRef.current = Date.now()
    doneRef.current = false
    setElapsed(null)
    setProfileResource(createResource(fetchProfile('1')))
    setKey(k => k + 1)
    // Ждём 2000ms (1200 + 800) для измерения
    setTimeout(() => {
      if (!doneRef.current) {
        setElapsed(Date.now() - startRef.current)
        doneRef.current = true
      }
    }, 2100)
  }

  return (
    <div style={card('#f59e0b')}>
      <div style={{ fontWeight: 700, fontSize: 15, color: '#92400e', marginBottom: 6 }}>
        Waterfall (последовательно)
      </div>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 11,
        background: '#fefce8',
        padding: 8,
        borderRadius: 6,
        marginBottom: 12,
        color: '#78350f',
      }}>
        {'// Posts fetch запускается ПОСЛЕ Profile resolve\n<Profile>\n  <Posts /> // fetch здесь'}
      </div>

      <button style={{ ...btn('#f59e0b'), marginBottom: 12 }} onClick={handleLoad}>
        Загрузить
      </button>

      {elapsed !== null && (
        <div style={{ fontSize: 13, color: '#92400e', marginBottom: 8, fontWeight: 700 }}>
          Полная загрузка: ~{elapsed}ms
        </div>
      )}

      {profileResource ? (
        <WaterfallMiniSuspense
          key={`profile-${key}`}
          fallback={<SkeletonProfile label="Загрузка профиля (1200ms)..." />}
        >
          <WaterfallProfile resource={profileResource} postsKey={key} />
        </WaterfallMiniSuspense>
      ) : (
        <div style={{ color: '#9ca3af', fontSize: 14 }}>— нажмите "Загрузить" —</div>
      )}

      <Timeline profileMs={1200} postsMs={800} mode="waterfall" />
    </div>
  )
}

function ParallelScenario() {
  const [key, setKey] = useState(0)
  const [resources, setResources] = useState<{
    profile: Resource<ProfileData>
    posts: Resource<PostData[]>
  } | null>(null)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const startRef = useRef<number>(0)

  const handleLoad = () => {
    startRef.current = Date.now()
    setElapsed(null)
    // Оба fetch стартуют ОДНОВРЕМЕННО
    setResources({
      profile: createResource(fetchProfile('2')),
      posts: createResource(fetchPosts('2')),
    })
    setKey(k => k + 1)
    setTimeout(() => {
      setElapsed(Date.now() - startRef.current)
    }, 1300)
  }

  return (
    <div style={card('#10b981')}>
      <div style={{ fontWeight: 700, fontSize: 15, color: '#065f46', marginBottom: 6 }}>
        Parallel (одновременно)
      </div>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 11,
        background: '#ecfdf5',
        padding: 8,
        borderRadius: 6,
        marginBottom: 12,
        color: '#064e3b',
      }}>
        {'// Оба fetch стартуют до рендера\nconst p = createResource(fetchProfile())\nconst posts = createResource(fetchPosts())\n<Profile resource={p} />\n<Posts resource={posts} />'}
      </div>

      <button style={{ ...btn('#10b981'), marginBottom: 12 }} onClick={handleLoad}>
        Загрузить
      </button>

      {elapsed !== null && (
        <div style={{ fontSize: 13, color: '#065f46', marginBottom: 8, fontWeight: 700 }}>
          Полная загрузка: ~{elapsed}ms
        </div>
      )}

      {resources ? (
        <WaterfallMiniSuspense
          key={key}
          fallback={<SkeletonProfile label="Загрузка профиля и постов..." />}
        >
          <div>
            <ProfileCard profile={resources.profile.read()} />
            <div style={{ marginTop: 8 }}>
              <WaterfallMiniSuspense
                key={`posts-${key}`}
                fallback={<SkeletonPosts label="Загрузка постов..." />}
              >
                <PostsList resource={resources.posts} />
              </WaterfallMiniSuspense>
            </div>
          </div>
        </WaterfallMiniSuspense>
      ) : (
        <div style={{ color: '#9ca3af', fontSize: 14 }}>— нажмите "Загрузить" —</div>
      )}

      <Timeline profileMs={1200} postsMs={800} mode="parallel" />
    </div>
  )
}

export function Task10_3_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: 4 }}>Задание 10.3: Suspense Waterfall vs Parallel</h2>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
        Нажмите "Загрузить" в обоих сценариях и сравните время. Waterfall ~2000ms, Parallel ~1200ms.
      </p>

      <div style={{ display: 'flex', gap: 16 }}>
        <WaterfallScenario />
        <ParallelScenario />
      </div>

      <div style={{
        marginTop: 16,
        padding: '10px 14px',
        background: '#fefce8',
        borderRadius: 8,
        border: '1px solid #fde68a',
        fontSize: 13,
        color: '#78350f',
      }}>
        <strong>Суть waterfall:</strong> дочерний компонент не начинает fetch пока родитель не
        разрешил suspend. Решение — поднять fetch в родителя и передавать уже запущенные
        Promise как props. Это называется "fetch-then-render" в отличие от "render-then-fetch".
      </div>
    </div>
  )
}

// ─── Task 10.4: Concurrent Tree Walk ─────────────────────────────────────────

type NodeState = 'idle' | 'processing' | 'sync-done' | 'transition-done' | 'interrupted'

interface TreeNode {
  id: string
  name: string
  parentId: string | null
  depth: number
}

const TREE_NODES: TreeNode[] = [
  { id: 'app',      name: 'App',      parentId: null,     depth: 0 },
  { id: 'header',   name: 'Header',   parentId: 'app',    depth: 1 },
  { id: 'logo',     name: 'Logo',     parentId: 'header', depth: 2 },
  { id: 'nav',      name: 'Nav',      parentId: 'header', depth: 2 },
  { id: 'nav1',     name: 'NavItem1', parentId: 'nav',    depth: 3 },
  { id: 'nav2',     name: 'NavItem2', parentId: 'nav',    depth: 3 },
  { id: 'main',     name: 'Main',     parentId: 'app',    depth: 1 },
  { id: 'sidebar',  name: 'Sidebar',  parentId: 'main',   depth: 2 },
  { id: 'widget1',  name: 'Widget1',  parentId: 'sidebar',depth: 3 },
  { id: 'widget2',  name: 'Widget2',  parentId: 'sidebar',depth: 3 },
  { id: 'content',  name: 'Content',  parentId: 'main',   depth: 2 },
  { id: 'card1',    name: 'Card1',    parentId: 'content',depth: 3 },
  { id: 'card2',    name: 'Card2',    parentId: 'content',depth: 3 },
  { id: 'card3',    name: 'Card3',    parentId: 'content',depth: 3 },
  { id: 'footer',   name: 'Footer',   parentId: 'app',    depth: 1 },
  { id: 'links',    name: 'Links',    parentId: 'footer', depth: 2 },
  { id: 'copy',     name: 'Copy',     parentId: 'footer', depth: 2 },
]

// DFS order: сначала корень, потом дети слева направо (как React)
function getDfsOrder(nodes: TreeNode[]): string[] {
  const result: string[] = []
  const childrenMap = new Map<string | null, string[]>()
  nodes.forEach(n => {
    const siblings = childrenMap.get(n.parentId) ?? []
    siblings.push(n.id)
    childrenMap.set(n.parentId, siblings)
  })

  function dfs(id: string | null) {
    const children = childrenMap.get(id) ?? []
    for (const childId of children) {
      result.push(childId)
      dfs(childId)
    }
  }
  dfs(null)
  return result
}

const DFS_ORDER = getDfsOrder(TREE_NODES)

const NODE_COLORS: Record<NodeState, { bg: string; border: string; text: string }> = {
  'idle':            { bg: '#f1f5f9', border: '#cbd5e1', text: '#64748b' },
  'processing':      { bg: '#fef9c3', border: '#fde047', text: '#713f12' },
  'sync-done':       { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  'transition-done': { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af' },
  'interrupted':     { bg: '#fed7aa', border: '#fb923c', text: '#7c2d12' },
}

interface LogEntry {
  time: string
  message: string
  color: string
}

function TreeNodeView({
  node,
  state,
  children,
}: {
  node: TreeNode
  state: NodeState
  children?: ReactNode
}) {
  const colors = NODE_COLORS[state]
  return (
    <div style={{ marginLeft: node.depth === 0 ? 0 : 16 }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 8,
        border: `2px solid ${colors.border}`,
        background: colors.bg,
        color: colors.text,
        fontSize: 12,
        fontWeight: 600,
        marginBottom: 4,
        transition: 'all 0.2s ease',
        minWidth: 80,
        justifyContent: 'center',
      }}>
        {node.name}
      </div>
      {children && <div style={{ marginLeft: 8, borderLeft: '2px solid #e2e8f0', paddingLeft: 8 }}>{children}</div>}
    </div>
  )
}

function renderTree(
  nodes: TreeNode[],
  nodeStates: Record<string, NodeState>,
  parentId: string | null = null,
): ReactNode {
  const children = nodes.filter(n => n.parentId === parentId)
  return children.map(node => (
    <TreeNodeView key={node.id} node={node} state={nodeStates[node.id] ?? 'idle'}>
      {renderTree(nodes, nodeStates, node.id)}
    </TreeNodeView>
  ))
}

export function Task10_4_Solution() {
  const [nodeStates, setNodeStates] = useState<Record<string, NodeState>>(() =>
    Object.fromEntries(TREE_NODES.map(n => [n.id, 'idle' as NodeState])),
  )
  const [log, setLog] = useState<LogEntry[]>([])
  const isRunningRef = useRef(false)
  const isTransitionRunningRef = useRef(false)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const addLog = (message: string, color: string) => {
    const time = new Date().toLocaleTimeString('ru-RU', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    } as Intl.DateTimeFormatOptions)
    setLog(prev => [...prev.slice(-19), { time, message, color }])
  }

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(id => clearTimeout(id))
    timeoutsRef.current = []
  }

  const resetAll = () => {
    clearTimeouts()
    isRunningRef.current = false
    isTransitionRunningRef.current = false
    setNodeStates(Object.fromEntries(TREE_NODES.map(n => [n.id, 'idle' as NodeState])))
    addLog('Сброс — все узлы сброшены в idle', '#94a3b8')
  }

  const runSyncWalk = () => {
    if (isRunningRef.current) {
      addLog('Sync update проигнорирован — sync уже выполняется', '#f59e0b')
      return
    }

    // Если transition идёт — прерываем его
    if (isTransitionRunningRef.current) {
      clearTimeouts()
      isTransitionRunningRef.current = false
      // Помечаем незавершённые узлы как interrupted
      setNodeStates(prev => {
        const next = { ...prev }
        TREE_NODES.forEach(n => {
          if (next[n.id] === 'idle' || next[n.id] === 'processing') {
            next[n.id] = 'interrupted'
          }
        })
        return next
      })
      addLog('Transition прерван — sync update захватывает управление', '#fb923c')
    }

    isRunningRef.current = true
    addLog(`Sync update запущен (${DFS_ORDER.length} узлов, 80ms/узел)`, '#10b981')

    // Сначала сброс в idle (кроме interrupted — они остаются)
    setNodeStates(prev => {
      const next = { ...prev }
      TREE_NODES.forEach(n => {
        if (next[n.id] !== 'interrupted') next[n.id] = 'idle'
      })
      return next
    })

    DFS_ORDER.forEach((id, index) => {
      const t1 = setTimeout(() => {
        setNodeStates(prev => ({ ...prev, [id]: 'processing' }))
      }, index * 80)

      const t2 = setTimeout(() => {
        setNodeStates(prev => ({ ...prev, [id]: 'sync-done' }))
        if (index === DFS_ORDER.length - 1) {
          isRunningRef.current = false
          addLog(`Sync завершён (${DFS_ORDER.length} узлов)`, '#16a34a')
        }
      }, index * 80 + 60)

      timeoutsRef.current.push(t1, t2)
    })
  }

  const runTransitionWalk = () => {
    if (isRunningRef.current) {
      addLog('Transition проигнорирован — sync уже выполняется', '#f59e0b')
      return
    }
    if (isTransitionRunningRef.current) {
      addLog('Transition уже выполняется', '#f59e0b')
      return
    }

    clearTimeouts()
    isTransitionRunningRef.current = true
    addLog(`Transition update запущен (${DFS_ORDER.length} узлов, 150ms/узел)`, '#3b82f6')

    setNodeStates(Object.fromEntries(TREE_NODES.map(n => [n.id, 'idle' as NodeState])))

    DFS_ORDER.forEach((id, index) => {
      const t1 = setTimeout(() => {
        if (!isTransitionRunningRef.current) return
        setNodeStates(prev => ({ ...prev, [id]: 'processing' }))
      }, index * 150)

      const t2 = setTimeout(() => {
        if (!isTransitionRunningRef.current) return
        setNodeStates(prev => ({ ...prev, [id]: 'transition-done' }))
        if (index === DFS_ORDER.length - 1) {
          isTransitionRunningRef.current = false
          addLog(`Transition завершён (${DFS_ORDER.length} узлов)`, '#1d4ed8')
        }
      }, index * 150 + 110)

      timeoutsRef.current.push(t1, t2)
    })
  }

  const legend: Array<{ state: NodeState; label: string }> = [
    { state: 'idle', label: 'Не обработан' },
    { state: 'processing', label: 'Обрабатывается' },
    { state: 'sync-done', label: 'Sync завершён' },
    { state: 'transition-done', label: 'Transition завершён' },
    { state: 'interrupted', label: 'Transition прерван' },
  ]

  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: 4 }}>Задание 10.4: Concurrent Tree Walk</h2>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>
        Запустите Transition, затем в середине нажмите Sync — transition прервётся (оранжевые узлы),
        sync обработает дерево первым (зелёные).
      </p>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {legend.map(({ state, label }) => {
          const c = NODE_COLORS[state]
          return (
            <div key={state} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 8px',
              borderRadius: 6,
              border: `1.5px solid ${c.border}`,
              background: c.bg,
              fontSize: 11,
              color: c.text,
              fontWeight: 600,
            }}>
              {label}
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button style={btn('#16a34a')} onClick={runSyncWalk}>
          Sync Update (80ms/узел)
        </button>
        <button style={btn('#1d4ed8')} onClick={runTransitionWalk}>
          Transition Update (150ms/узел)
        </button>
        <button style={btn('#e5e7eb', '#374151')} onClick={resetAll}>
          Сбросить
        </button>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* Tree */}
        <div style={{
          flex: '0 0 auto',
          padding: 16,
          background: '#f8fafc',
          borderRadius: 10,
          border: '1px solid #e2e8f0',
          minWidth: 260,
        }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, fontWeight: 600 }}>
            Fiber Tree (DFS порядок)
          </div>
          {renderTree(TREE_NODES, nodeStates)}
        </div>

        {/* Log */}
        <div style={{
          flex: 1,
          background: '#0f172a',
          borderRadius: 10,
          padding: 12,
          overflow: 'hidden',
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>
            Лог событий:
          </div>
          <div style={{ height: 340, overflowY: 'auto' }}>
            {log.length === 0 ? (
              <div style={{ color: '#475569', fontSize: 13, fontStyle: 'italic' }}>
                — нажмите кнопку —
              </div>
            ) : (
              [...log].reverse().map((entry, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: 8,
                  padding: '3px 0',
                  borderBottom: '1px solid #1e293b',
                  fontSize: 12,
                }}>
                  <span style={{ color: '#475569', fontFamily: 'monospace', flexShrink: 0 }}>
                    {entry.time}
                  </span>
                  <span style={{ color: entry.color }}>
                    {entry.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
