import { useState } from 'react'
import { produce } from 'immer'

// ============================================
// Task 1.1 Solution: Mutation Traps
// ============================================

interface User {
  name: string
  age: number
  address: { city: string }
}

const INITIAL_USER: User = { name: 'Alice', age: 30, address: { city: 'Moscow' } }

type ActionResult = {
  kind: 'mutate' | 'copy' | null
  original: User
  modified: User | null
  sameRef: boolean | null
  changedFields: string[]
}

function diffFields(a: User, b: User): string[] {
  const changed: string[] = []
  if (a.name !== b.name) changed.push('name')
  if (a.age !== b.age) changed.push('age')
  if (a.address.city !== b.address.city) changed.push('address.city')
  return changed
}

export function Task1_1_Solution() {
  const [userState, setUserState] = useState<User>(JSON.parse(JSON.stringify(INITIAL_USER)))
  const [result, setResult] = useState<ActionResult>({ kind: null, original: INITIAL_USER, modified: null, sameRef: null, changedFields: [] })

  const containerStyle: React.CSSProperties = {
    background: '#111827',
    color: '#e5e7eb',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: 'monospace',
  }

  const panelStyle: React.CSSProperties = {
    background: '#1f2937',
    borderRadius: '8px',
    padding: '1rem',
  }

  const btnStyle = (color: string): React.CSSProperties => ({
    background: color,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1.1rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginRight: '0.5rem',
  })

  const handleMutate = () => {
    // Snapshot before mutation
    const before: User = JSON.parse(JSON.stringify(userState))
    // Direct mutation — the original reference is now dirty
    userState.age = 31
    const after = userState
    setResult({
      kind: 'mutate',
      original: after,
      modified: after,
      sameRef: true,
      changedFields: diffFields(before, after),
    })
    setUserState({ ...after }) // force re-render
  }

  const handleCopy = () => {
    const before: User = JSON.parse(JSON.stringify(userState))
    const copy: User = { ...userState, age: userState.age + 1 }
    setResult({
      kind: 'copy',
      original: before,
      modified: copy,
      sameRef: false,
      changedFields: diffFields(before, copy),
    })
    // original stays unchanged in state
  }

  const handleReset = () => {
    const fresh: User = JSON.parse(JSON.stringify(INITIAL_USER))
    setUserState(fresh)
    setResult({ kind: null, original: INITIAL_USER, modified: null, sameRef: null, changedFields: [] })
  }

  const fieldRow = (label: string, val: unknown, changed: boolean) => (
    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #374151' }}>
      <span style={{ color: '#9ca3af' }}>{label}:</span>
      <span style={{ color: changed ? '#f59e0b' : '#e5e7eb', fontWeight: changed ? 'bold' : 'normal' }}>
        {String(val)}
        {changed && <span style={{ marginLeft: '0.4rem', fontSize: '0.75rem', color: '#f59e0b' }}>(changed)</span>}
      </span>
    </div>
  )

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 1.1 — Ловушки мутаций</h2>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Объект <code style={{ color: '#a5f3fc' }}>user</code> с вложенным адресом. Попробуйте оба способа изменить age.
      </p>

      {/* Initial card */}
      <div style={{ ...panelStyle, marginBottom: '1rem' }}>
        <div style={{ color: '#6ee7b7', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Текущий объект user:</div>
        {fieldRow('name', userState.name, false)}
        {fieldRow('age', userState.age, false)}
        {fieldRow('address.city', userState.address.city, false)}
      </div>

      {/* Buttons */}
      <div style={{ marginBottom: '1rem' }}>
        <button style={btnStyle('#ef4444')} onClick={handleMutate}>Мутировать напрямую (age++)</button>
        <button style={btnStyle('#10b981')} onClick={handleCopy}>Создать копию (spread)</button>
        <button style={btnStyle('#374151')} onClick={handleReset}>Сбросить</button>
      </div>

      {/* Result */}
      {result.kind !== null && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Original */}
          <div style={{ ...panelStyle, flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Оригинал:</div>
            {fieldRow('name', result.original.name, false)}
            {fieldRow('age', result.original.age, result.changedFields.includes('age') && result.kind === 'mutate')}
            {fieldRow('address.city', result.original.address.city, false)}
          </div>

          {/* Modified / Copy */}
          {result.modified && (
            <div style={{ ...panelStyle, flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
                {result.kind === 'copy' ? 'Копия (новый объект):' : 'После мутации:'}
              </div>
              {fieldRow('name', result.modified.name, false)}
              {fieldRow('age', result.modified.age, result.changedFields.includes('age'))}
              {fieldRow('address.city', result.modified.address.city, false)}
            </div>
          )}

          {/* Analysis */}
          <div style={{ ...panelStyle, flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Анализ:</div>
            <div style={{ marginBottom: '0.4rem' }}>
              <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>original === copy:</span>
              <span style={{ marginLeft: '0.5rem', color: result.sameRef ? '#f59e0b' : '#10b981', fontWeight: 'bold' }}>
                {String(result.sameRef)}
              </span>
            </div>
            <div style={{ marginBottom: '0.4rem' }}>
              <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Изменённые поля:</span>
              <span style={{ marginLeft: '0.5rem', color: '#e5e7eb' }}>
                {result.changedFields.length > 0 ? result.changedFields.join(', ') : 'нет'}
              </span>
            </div>
            <div style={{
              marginTop: '0.75rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              background: result.kind === 'mutate' ? '#450a0a' : '#052e16',
              border: `1px solid ${result.kind === 'mutate' ? '#ef4444' : '#10b981'}`,
              fontSize: '0.82rem',
              color: result.kind === 'mutate' ? '#fca5a5' : '#6ee7b7',
            }}>
              {result.kind === 'mutate'
                ? 'Оригинал испорчен: оба указателя ведут на один объект. React не увидит изменение без force-ре-рендера.'
                : 'Оригинал цел: spread создал новую ссылку. Старое значение безопасно хранить в истории.'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 1.2 Solution: Deep Cloning Strategies
// ============================================

interface DeepObj {
  user: {
    name: string
    settings: {
      theme: string
      notifications: { email: boolean; sms: boolean }
    }
    createdAt: Date
  }
}

function makeOriginal(): DeepObj {
  return {
    user: {
      name: 'Bob',
      settings: {
        theme: 'dark',
        notifications: { email: true, sms: false },
      },
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    },
  }
}

type CloneStrategy = 'shallow' | 'json' | 'structured'

interface CloneResult {
  cloned: unknown
  originalAfter: DeepObj
  issue: string | null
  success: string | null
}

export function Task1_2_Solution() {
  const [originals, setOriginals] = useState<Record<CloneStrategy, DeepObj>>({
    shallow: makeOriginal(),
    json: makeOriginal(),
    structured: makeOriginal(),
  })
  const [results, setResults] = useState<Record<CloneStrategy, CloneResult | null>>({
    shallow: null,
    json: null,
    structured: null,
  })

  const containerStyle: React.CSSProperties = {
    background: '#111827',
    color: '#e5e7eb',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: 'monospace',
  }

  const panelStyle: React.CSSProperties = {
    background: '#1f2937',
    borderRadius: '8px',
    padding: '1rem',
    flex: 1,
    minWidth: '240px',
  }

  const btnStyle: React.CSSProperties = {
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.45rem 0.9rem',
    cursor: 'pointer',
    fontSize: '0.82rem',
    marginBottom: '0.75rem',
  }

  const runShallow = () => {
    const orig = originals.shallow
    // Shallow clone — nested objects still shared
    const clone = { ...orig }
    // Mutate nested — affects original too!
    clone.user.settings.theme = 'light'
    setOriginals(prev => ({ ...prev, shallow: { ...orig } }))
    setResults(prev => ({
      ...prev,
      shallow: {
        cloned: clone,
        originalAfter: orig,
        issue: 'Вложенный объект shared: orig.user.settings.theme тоже стал "light"',
        success: null,
      },
    }))
  }

  const runJson = () => {
    const orig = originals.json
    // JSON clone — loses Date type and functions
    const clone = JSON.parse(JSON.stringify(orig))
    clone.user.settings.theme = 'light'
    setResults(prev => ({
      ...prev,
      json: {
        cloned: clone,
        originalAfter: JSON.parse(JSON.stringify(orig)),
        issue: `Date превратился в строку: "${clone.user.createdAt}" (тип: ${typeof clone.user.createdAt})`,
        success: null,
      },
    }))
  }

  const runStructured = () => {
    const orig = originals.structured
    const clone: DeepObj = structuredClone(orig)
    clone.user.settings.theme = 'light'
    setResults(prev => ({
      ...prev,
      structured: {
        cloned: clone,
        originalAfter: JSON.parse(JSON.stringify(orig)),
        issue: null,
        success: `Date сохранён как Date: ${clone.user.createdAt instanceof Date ? 'instanceof Date = true' : 'нет'}. Оригинал не тронут.`,
      },
    }))
  }

  const renderResult = (strategy: CloneStrategy, res: CloneResult) => (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Оригинал после клонирования:</div>
      <div style={{ fontSize: '0.8rem', color: strategy === 'shallow' ? '#fca5a5' : '#a5f3fc' }}>
        theme: <strong>{(res.originalAfter.user.settings.theme)}</strong>
        {strategy === 'shallow' && ' (изменился!)'}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#e5e7eb', marginTop: '0.25rem' }}>
        createdAt type: <strong style={{ color: strategy === 'json' ? '#fca5a5' : '#a5f3fc' }}>
          {strategy === 'json' ? 'string' : 'Date'}
        </strong>
      </div>
      {res.issue && (
        <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.6rem', borderRadius: '4px', background: '#450a0a', border: '1px solid #ef4444', fontSize: '0.78rem', color: '#fca5a5' }}>
          {res.issue}
        </div>
      )}
      {res.success && (
        <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.6rem', borderRadius: '4px', background: '#052e16', border: '1px solid #10b981', fontSize: '0.78rem', color: '#6ee7b7' }}>
          {res.success}
        </div>
      )}
    </div>
  )

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 1.2 — Глубокое клонирование</h2>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Три стратегии клонирования объекта с вложенными данными и <code style={{ color: '#a5f3fc' }}>Date</code>.
        Клонируем и меняем <code style={{ color: '#a5f3fc' }}>theme</code> в копии — смотрим что происходит с оригиналом.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Shallow */}
        <div style={panelStyle}>
          <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '0.5rem' }}>1. Shallow copy ({ "{ ...obj }" })</div>
          <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.6rem', fontSize: '0.75rem', color: '#fde68a', overflowX: 'auto', margin: '0 0 0.5rem' }}>
{`const clone = { ...orig }
clone.user.settings.theme = 'light'
// orig.user === clone.user
// => оригинал тоже изменился`}
          </pre>
          <button style={btnStyle} onClick={runShallow}>Клонировать и модифицировать</button>
          {results.shallow && renderResult('shallow', results.shallow)}
        </div>

        {/* JSON */}
        <div style={panelStyle}>
          <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '0.5rem' }}>2. JSON.parse(JSON.stringify)</div>
          <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.6rem', fontSize: '0.75rem', color: '#fde68a', overflowX: 'auto', margin: '0 0 0.5rem' }}>
{`const clone = JSON.parse(
  JSON.stringify(orig)
)
// Оригинал безопасен, НО:
// Date -> string, fn -> потеряна`}
          </pre>
          <button style={btnStyle} onClick={runJson}>Клонировать и модифицировать</button>
          {results.json && renderResult('json', results.json)}
        </div>

        {/* structuredClone */}
        <div style={panelStyle}>
          <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '0.5rem' }}>3. structuredClone(obj)</div>
          <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.6rem', fontSize: '0.75rem', color: '#6ee7b7', overflowX: 'auto', margin: '0 0 0.5rem' }}>
{`const clone = structuredClone(orig)
clone.user.settings.theme = 'light'
// Оригинал не тронут
// Date сохранён как Date`}
          </pre>
          <button style={{ ...btnStyle, background: '#10b981' }} onClick={runStructured}>Клонировать и модифицировать</button>
          {results.structured && renderResult('structured', results.structured)}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 1.3 Solution: Immer produce
// ============================================

interface Todo {
  id: number
  text: string
  done: boolean
}

interface TodoState {
  todos: Todo[]
  nextId: number
}

const INITIAL_STATE: TodoState = {
  todos: [
    { id: 1, text: 'Изучить иммутабельность', done: false },
    { id: 2, text: 'Разобраться с Immer', done: false },
  ],
  nextId: 3,
}

type HistoryEntry = {
  action: string
  snapshot: TodoState
}

function addManual(state: TodoState, text: string): TodoState {
  return {
    ...state,
    todos: [...state.todos, { id: state.nextId, text, done: false }],
    nextId: state.nextId + 1,
  }
}

function toggleManual(state: TodoState, id: number): TodoState {
  return {
    ...state,
    todos: state.todos.map(t => t.id === id ? { ...t, done: !t.done } : t),
  }
}

function deleteManual(state: TodoState, id: number): TodoState {
  return {
    ...state,
    todos: state.todos.filter(t => t.id !== id),
  }
}

function addImmer(state: TodoState, text: string): TodoState {
  return produce(state, draft => {
    draft.todos.push({ id: draft.nextId, text, done: false })
    draft.nextId++
  })
}

function toggleImmer(state: TodoState, id: number): TodoState {
  return produce(state, draft => {
    const todo = draft.todos.find(t => t.id === id)
    if (todo) todo.done = !todo.done
  })
}

function deleteImmer(state: TodoState, id: number): TodoState {
  return produce(state, draft => {
    const idx = draft.todos.findIndex(t => t.id === id)
    if (idx !== -1) draft.todos.splice(idx, 1)
  })
}

const MANUAL_CODE: Record<string, string> = {
  add: `// Ручной способ
return {
  ...state,
  todos: [
    ...state.todos,
    { id: state.nextId, text, done: false }
  ],
  nextId: state.nextId + 1,
}`,
  toggle: `// Ручной способ
return {
  ...state,
  todos: state.todos.map(t =>
    t.id === id
      ? { ...t, done: !t.done }
      : t
  ),
}`,
  delete: `// Ручной способ
return {
  ...state,
  todos: state.todos.filter(
    t => t.id !== id
  ),
}`,
}

const IMMER_CODE: Record<string, string> = {
  add: `// Immer produce
produce(state, draft => {
  draft.todos.push({
    id: draft.nextId,
    text,
    done: false,
  })
  draft.nextId++
})`,
  toggle: `// Immer produce
produce(state, draft => {
  const todo = draft.todos
    .find(t => t.id === id)
  if (todo) todo.done = !todo.done
})`,
  delete: `// Immer produce
produce(state, draft => {
  const idx = draft.todos
    .findIndex(t => t.id === id)
  if (idx !== -1)
    draft.todos.splice(idx, 1)
})`,
}

function countLines(code: string): number {
  return code.split('\n').length
}

const MANUAL_TOTAL = Object.values(MANUAL_CODE).reduce((s, c) => s + countLines(c), 0)
const IMMER_TOTAL = Object.values(IMMER_CODE).reduce((s, c) => s + countLines(c), 0)

export function Task1_3_Solution() {
  const [state, setState] = useState<TodoState>(JSON.parse(JSON.stringify(INITIAL_STATE)))
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [lastAction, setLastAction] = useState<string>('add')
  const [newText, setNewText] = useState('Новая задача')

  const containerStyle: React.CSSProperties = {
    background: '#111827',
    color: '#e5e7eb',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: 'monospace',
  }

  const panelStyle: React.CSSProperties = {
    background: '#1f2937',
    borderRadius: '8px',
    padding: '1rem',
  }

  const btnSm = (color: string): React.CSSProperties => ({
    background: color,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '0.2rem 0.6rem',
    cursor: 'pointer',
    fontSize: '0.78rem',
    marginLeft: '0.3rem',
  })

  const pushHistory = (action: string, newState: TodoState) => {
    setHistory(prev => [{ action, snapshot: JSON.parse(JSON.stringify(newState)) }, ...prev].slice(0, 5))
  }

  const doAdd = () => {
    const text = newText.trim() || 'Задача'
    const next = addManual(state, text)
    // both manual and immer produce identical result — we use manual for state
    setState(next)
    setLastAction('add')
    pushHistory(`add("${text}")`, next)
  }

  const doToggle = (id: number) => {
    const next = toggleManual(state, id)
    setState(next)
    setLastAction('toggle')
    pushHistory(`toggle(${id})`, next)
  }

  const doDelete = (id: number) => {
    const next = deleteManual(state, id)
    setState(next)
    setLastAction('delete')
    pushHistory(`delete(${id})`, next)
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 1.3 — Immer produce</h2>

      {/* Code comparison */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ ...panelStyle, flex: 1, minWidth: '220px' }}>
          <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Ручной способ ({MANUAL_TOTAL} строк)
          </div>
          <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.6rem', fontSize: '0.72rem', color: '#fde68a', overflowX: 'auto', margin: 0 }}>
            {MANUAL_CODE[lastAction]}
          </pre>
        </div>
        <div style={{ ...panelStyle, flex: 1, minWidth: '220px' }}>
          <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Immer produce ({IMMER_TOTAL} строк)
          </div>
          <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.6rem', fontSize: '0.72rem', color: '#6ee7b7', overflowX: 'auto', margin: 0 }}>
            {IMMER_CODE[lastAction]}
          </pre>
        </div>
      </div>

      {/* Line count badge */}
      <div style={{ ...panelStyle, marginBottom: '1rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div>
          <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Строк кода всего: </span>
          <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>ручной {MANUAL_TOTAL}</span>
          <span style={{ color: '#6b7280', margin: '0 0.5rem' }}>vs</span>
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>Immer {IMMER_TOTAL}</span>
        </div>
        <div style={{ color: '#9ca3af', fontSize: '0.82rem' }}>
          Immer сокращает код на{' '}
          <span style={{ color: '#a5f3fc' }}>{Math.round((1 - IMMER_TOTAL / MANUAL_TOTAL) * 100)}%</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ ...panelStyle, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input
          value={newText}
          onChange={e => setNewText(e.target.value)}
          style={{ background: '#0d1117', border: '1px solid #374151', borderRadius: '6px', padding: '0.4rem 0.75rem', color: '#e5e7eb', fontSize: '0.85rem', flex: 1, minWidth: '150px' }}
          placeholder="Текст задачи..."
        />
        <button style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.85rem' }} onClick={doAdd}>
          Добавить
        </button>
      </div>

      {/* Todo list */}
      <div style={{ ...panelStyle, marginBottom: '1rem' }}>
        <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          Список ({state.todos.length} задач):
        </div>
        {state.todos.length === 0 && (
          <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>Нет задач</div>
        )}
        {state.todos.map(todo => (
          <div key={todo.id} style={{ display: 'flex', alignItems: 'center', padding: '0.35rem 0', borderBottom: '1px solid #374151' }}>
            <span style={{ flex: 1, color: todo.done ? '#6b7280' : '#e5e7eb', textDecoration: todo.done ? 'line-through' : 'none', fontSize: '0.9rem' }}>
              [{todo.id}] {todo.text}
            </span>
            <button style={btnSm('#10b981')} onClick={() => doToggle(todo.id)}>
              {todo.done ? 'Undone' : 'Done'}
            </button>
            <button style={btnSm('#ef4444')} onClick={() => doDelete(todo.id)}>
              Del
            </button>
          </div>
        ))}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={panelStyle}>
          <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.5rem' }}>История (последние 5):</div>
          {history.map((entry, i) => (
            <div key={i} style={{ marginBottom: '0.4rem' }}>
              <span style={{ color: '#a5f3fc', fontSize: '0.78rem' }}>{entry.action}:</span>
              <span style={{ color: '#6b7280', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                todos=[{entry.snapshot.todos.map(t => `{id:${t.id},done:${t.done}}`).join(', ')}]
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
