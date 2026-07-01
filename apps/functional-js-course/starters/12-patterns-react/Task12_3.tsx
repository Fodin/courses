import { useState, useRef, useEffect, type ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 12.3: RemoteData и Match
//
// Цель: реализовать ADT RemoteData для моделирования состояния
//       загрузки данных и компонент Match для exhaustive
//       pattern matching.
// ============================================================

// ============================================================
// TODO 1: Определи тип RemoteData<E, A>
//
// Это discriminated union из 4 вариантов:
//   NotAsked — данные ещё не запрашивались
//   Loading   — запрос в процессе
//   Failure   — ошибка типа E
//   Success   — успешные данные типа A
//
// Используй поле 'tag' как дискриминант (не 'type'!).
// ============================================================
type RemoteData<E, A> =
  | { tag: 'NotAsked' }
  | { tag: 'Loading' }
  | { tag: 'Failure'; error: E }
  | { tag: 'Success'; data: A }
// TODO: тип определён выше — используй его в конструкторах

// ============================================================
// TODO 2: Реализуй конструкторы
//
// notAsked<E, A>(): RemoteData<E, A>   → { tag: 'NotAsked' }
// loading<E, A>():  RemoteData<E, A>   → { tag: 'Loading' }
// failure<E, A>(e): RemoteData<E, A>   → { tag: 'Failure', error: e }
// success<E, A>(a): RemoteData<E, A>   → { tag: 'Success', data: a }
// ============================================================
const notAsked = <E, A>(): RemoteData<E, A> => ({ tag: 'NotAsked' }) // TODO
const loading  = <E, A>(): RemoteData<E, A> => ({ tag: 'Loading' })  // TODO
const failure  = <E, A>(_e: E): RemoteData<E, A> => ({ tag: 'NotAsked' }) // TODO: заменить
const success  = <E, A>(_a: A): RemoteData<E, A> => ({ tag: 'NotAsked' }) // TODO: заменить

// ============================================================
// TODO 3: Реализуй функцию mapRD
//
// mapRD<E, A, B>(rd: RemoteData<E, A>, f: (a: A) => B): RemoteData<E, B>
//
// Если rd.tag === 'Success' → применить f к rd.data
// В остальных случаях — вернуть rd без изменений (каст типа)
// ============================================================
function mapRD<E, A, B>(rd: RemoteData<E, A>, _f: (a: A) => B): RemoteData<E, B> {
  // TODO: if (rd.tag === 'Success') return success(_f(rd.data))
  return rd as RemoteData<E, B> // заглушка
}

// ============================================================
// TODO 4: Реализуй функцию getOrElse
//
// getOrElse<E, A>(rd: RemoteData<E, A>, fallback: A): A
//
// Если rd.tag === 'Success' → вернуть rd.data
// Иначе → вернуть fallback
// ============================================================
function getOrElse<E, A>(rd: RemoteData<E, A>, fallback: A): A {
  // TODO: if (rd.tag === 'Success') return rd.data
  return fallback // заглушка
}

// ============================================================
// TODO 5: Реализуй компонент Match
//
// Generic компонент, принимающий:
//   data: RemoteData<E, A>
//   notAsked: () => ReactNode
//   loading: () => ReactNode
//   failure: (e: E) => ReactNode
//   success: (a: A) => ReactNode
//
// Внутри — switch по data.tag, вызов соответствующей функции.
// TypeScript проверит exhaustiveness: все 4 кейса обязательны.
// ============================================================
interface MatchProps<E, A> {
  data: RemoteData<E, A>
  notAsked: () => ReactNode
  loading: () => ReactNode
  failure: (e: E) => ReactNode
  success: (a: A) => ReactNode
}

function Match<E, A>(_props: MatchProps<E, A>): ReactNode {
  // TODO: switch (_props.data.tag) { case 'NotAsked': ... }
  return null // заглушка
}

// ============================================================
// Типы и тестовые данные
// ============================================================

interface User {
  id: number
  name: string
  email: string
}

const MOCK_USERS: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Carol White', email: 'carol@example.com' },
]

// Спиннер (готов)
function Spinner() {
  const [dots, setDots] = useState('.')
  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 400)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#93c5fd', padding: '0.5rem 0', fontSize: '0.82rem' }}>
      <div
        style={{
          width: '12px',
          height: '12px',
          border: '2px solid #374151',
          borderTop: '2px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      Загрузка{dots}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ============================================================
// Компонент задания — завершите TODO выше, UI готов
// ============================================================

export function Task12_3() {
  const { t } = useLanguage()
  const [rdState, setRdState] = useState<RemoteData<string, User[]>>(notAsked())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  const handleLoad = () => {
    clearTimer()
    setRdState(loading())
    timerRef.current = setTimeout(() => {
      setRdState(success(MOCK_USERS))
    }, 1500)
  }

  const handleError = () => {
    clearTimer()
    setRdState(loading())
    timerRef.current = setTimeout(() => {
      setRdState(failure('Ошибка сети: сервер не ответил за 5 секунд'))
    }, 1500)
  }

  const handleReset = () => {
    clearTimer()
    setRdState(notAsked())
  }

  const userCount = getOrElse(mapRD(rdState, users => users.length), 0)

  const panelStyle: React.CSSProperties = {
    background: '#1f2937',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
  }

  const btnStyle = (variant: 'default' | 'success' | 'danger' = 'default'): React.CSSProperties => ({
    background: variant === 'success' ? '#14532d' : variant === 'danger' ? '#4c1d1d' : '#374151',
    color: variant === 'success' ? '#86efac' : variant === 'danger' ? '#fca5a5' : '#e5e7eb',
    border: `1px solid ${variant === 'success' ? '#22c55e' : variant === 'danger' ? '#ef4444' : '#4b5563'}`,
    borderRadius: '6px',
    padding: '0.35rem 0.9rem',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: '0.82rem',
    marginRight: '0.4rem',
  })

  return (
    <div className="exercise-container">
      <h2>{t('task.12.3')}</h2>

      {/* Controls */}
      <div style={{ marginBottom: '1rem' }}>
        <button style={btnStyle()} onClick={handleReset}>Не загружено</button>
        <button style={btnStyle('success')} onClick={handleLoad}>Загрузить</button>
        <button style={btnStyle('danger')} onClick={handleError}>Симулировать ошибку</button>
        <span style={{
          display: 'inline-block',
          padding: '0.15rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 600,
          background: '#1e3a5f',
          color: '#93c5fd',
          marginLeft: '0.5rem',
        }}>
          {rdState.tag}
        </span>
        {rdState.tag === 'Success' && (
          <span style={{
            display: 'inline-block',
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: '#14532d',
            color: '#86efac',
            marginLeft: '0.4rem',
          }}>
            {userCount} пользователей
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Left: if/else */}
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0, color: '#f9fafb', fontSize: '0.9rem' }}>Без Match (if/else)</h3>
          <div style={{
            background: '#0f172a',
            borderRadius: '6px',
            padding: '0.75rem',
            fontSize: '0.75rem',
            color: '#94a3b8',
            whiteSpace: 'pre',
            marginBottom: '0.75rem',
            overflowX: 'auto',
          }}>{`if (state === 'loading') {
  return <Spinner />
}
if (state === 'error') {
  return <Error msg={error} />
}
if (state === 'success') {
  return <UserList users={users} />
}
// NotAsked — надо не забыть!`}</div>
          <div style={{ padding: '0.5rem', background: '#111827', borderRadius: '6px', minHeight: '60px' }}>
            {rdState.tag === 'NotAsked' && (
              <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>Нажмите "Загрузить"</div>
            )}
            {rdState.tag === 'Loading' && <Spinner />}
            {rdState.tag === 'Failure' && (
              <div style={{ color: '#fca5a5', fontSize: '0.82rem' }}>
                Ошибка: {(rdState as { tag: 'Failure'; error: string }).error}
              </div>
            )}
            {rdState.tag === 'Success' && (
              (rdState as { tag: 'Success'; data: User[] }).data.map(u => (
                <div key={u.id} style={{ fontSize: '0.8rem', color: '#e5e7eb', padding: '0.2rem 0' }}>
                  {u.name}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Match component */}
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0, color: '#f9fafb', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Match компонент</span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '0.1rem 0.4rem',
              borderRadius: '4px',
              background: '#14532d',
              color: '#86efac',
            }}>exhaustive</span>
          </h3>
          <div style={{
            background: '#0f172a',
            borderRadius: '6px',
            padding: '0.75rem',
            fontSize: '0.75rem',
            color: '#94a3b8',
            whiteSpace: 'pre',
            marginBottom: '0.75rem',
            overflowX: 'auto',
          }}>{`<Match
  data={rd}
  notAsked={() => <Placeholder />}
  loading={() => <Spinner />}
  failure={e => <Error msg={e} />}
  success={users => <List users={users} />}
/>`}</div>
          <div style={{ padding: '0.5rem', background: '#111827', borderRadius: '6px', minHeight: '60px' }}>
            <Match
              data={rdState}
              notAsked={() => (
                <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>Нажмите "Загрузить"</div>
              )}
              loading={() => <Spinner />}
              failure={e => (
                <div style={{ color: '#fca5a5', fontSize: '0.82rem' }}>Ошибка: {e}</div>
              )}
              success={users => (
                <div>
                  {users.map(u => (
                    <div key={u.id} style={{ fontSize: '0.8rem', color: '#e5e7eb', padding: '0.2rem 0' }}>
                      {u.name}
                    </div>
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>
        Ожидается: Match рендерит контент для текущего состояния.
        mapRD и getOrElse работают корректно.
      </p>
    </div>
  )
}
