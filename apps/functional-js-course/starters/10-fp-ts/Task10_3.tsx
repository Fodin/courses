import { useState } from 'react'
import { useLanguage } from 'src/hooks'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
// TODO: импортировать { pipe } from 'fp-ts/function'
// import { pipe } from 'fp-ts/function'

// Типы ошибок — каждый шаг имеет свой тип
interface AuthError { type: 'AuthError'; message: string }
interface NetworkError { type: 'NetworkError'; message: string }
interface ForbiddenError { type: 'ForbiddenError'; message: string }

// Типы данных
interface User { id: string; name: string }
interface Profile { userId: string; role: string }
interface Permission { resource: string; access: string }

// TODO: реализовать функцию authenticate
// Должна возвращать TE.TaskEither<AuthError, User>
// При fail=true — TE.left({ type: 'AuthError', message: '...' })
// При fail=false — TE.right({ id: 'user-1', name: 'Alice' })
// ОБЯЗАТЕЛЬНО: с задержкой через setTimeout (имитация сети)
function authenticate(fail: boolean): TE.TaskEither<AuthError, User> {
  // TODO: return () => new Promise(resolve => setTimeout(() => resolve(...), 400))
  return () => Promise.resolve(E.left({ type: 'AuthError', message: 'not implemented' }))
}

// TODO: реализовать fetchProfile аналогично
function fetchProfile(user: User, fail: boolean): TE.TaskEither<NetworkError, Profile> {
  // TODO
  return () => Promise.resolve(E.left({ type: 'NetworkError', message: 'not implemented' }))
}

// TODO: реализовать checkPermissions аналогично
function checkPermissions(profile: Profile, fail: boolean): TE.TaskEither<ForbiddenError, Permission> {
  // TODO
  return () => Promise.resolve(E.left({ type: 'ForbiddenError', message: 'not implemented' }))
}

export function Task10_3() {
  const { t } = useLanguage()
  const [authFail, setAuthFail] = useState(false)
  const [networkFail, setNetworkFail] = useState(false)
  const [forbiddenFail, setForbiddenFail] = useState(false)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const run = async () => {
    if (running) return
    setRunning(true)
    setResult(null)

    // TODO: скомпоновать workflow через pipe + TE.flatMap
    // const workflow = pipe(
    //   authenticate(authFail),
    //   TE.flatMap(user => fetchProfile(user, networkFail)),
    //   TE.flatMap(profile => checkPermissions(profile, forbiddenFail))
    // )
    // const outcome = await workflow()
    // if (E.isLeft(outcome)) { ... } else { ... }

    setResult('TODO: реализуйте workflow')
    setRunning(false)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.10.3')}</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span>Точки отказа:</span>
        {[
          { label: 'Auth fails', value: authFail, set: setAuthFail },
          { label: 'Network fails', value: networkFail, set: setNetworkFail },
          { label: 'Forbidden', value: forbiddenFail, set: setForbiddenFail },
        ].map(({ label, value, set }) => (
          <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={value} onChange={e => set(e.target.checked)} />
            {label}
          </label>
        ))}
        <button
          onClick={run}
          disabled={running}
          style={{
            padding: '0.35rem 0.9rem',
            background: running ? '#1f2937' : '#1e3a5f',
            color: running ? '#6b7280' : '#93c5fd',
            border: '1px solid #374151',
            borderRadius: '6px',
            cursor: running ? 'not-allowed' : 'pointer',
            fontFamily: 'monospace',
          }}
        >
          {running ? 'Выполняется...' : 'Выполнить'}
        </button>
      </div>

      {result && (
        <div style={{ padding: '0.5rem 0.8rem', background: '#1f2937', borderRadius: '6px' }}>
          {result}
        </div>
      )}

      <div style={{ marginTop: '1rem', background: '#1f2937', padding: '1rem', borderRadius: '8px', fontSize: '0.82rem', color: '#9ca3af' }}>
        <p>Подсказка: TaskEither = () =&gt; Promise&lt;Either&lt;E, A&gt;&gt;</p>
        <p>Не забудьте вызвать workflow() с () чтобы запустить!</p>
        <p>TE.flatMap для цепочки шагов с short-circuit при ошибке</p>
      </div>
    </div>
  )
}
