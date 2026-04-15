import { useState, useRef } from 'react'

// ─── Task 3.1: Diff Visualizer ────────────────────────────────────────────────

type DiffItem = {
  key: string
  value: string
}

type DiffOpType = 'CREATE' | 'DELETE' | 'UPDATE' | 'NOOP'

type DiffOp = {
  type: DiffOpType
  key: string
  oldValue?: string
  newValue?: string
}

function diffArrays(before: DiffItem[], after: DiffItem[]): DiffOp[] {
  const beforeMap = new Map(before.map(item => [item.key, item.value]))
  const afterMap = new Map(after.map(item => [item.key, item.value]))
  const ops: DiffOp[] = []

  for (const [key, oldValue] of beforeMap) {
    if (!afterMap.has(key)) {
      ops.push({ type: 'DELETE', key, oldValue })
    } else {
      const newValue = afterMap.get(key)!
      if (newValue !== oldValue) {
        ops.push({ type: 'UPDATE', key, oldValue, newValue })
      } else {
        ops.push({ type: 'NOOP', key, oldValue, newValue })
      }
    }
  }

  for (const [key, newValue] of afterMap) {
    if (!beforeMap.has(key)) {
      ops.push({ type: 'CREATE', key, newValue })
    }
  }

  const order: DiffOpType[] = ['DELETE', 'UPDATE', 'CREATE', 'NOOP']
  return ops.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
}

const OP_STYLES: Record<DiffOpType, { bg: string; color: string; label: string }> = {
  CREATE: { bg: '#065f46', color: '#6ee7b7', label: 'CREATE' },
  DELETE: { bg: '#7f1d1d', color: '#fca5a5', label: 'DELETE' },
  UPDATE: { bg: '#78350f', color: '#fcd34d', label: 'UPDATE' },
  NOOP:   { bg: '#1f2937', color: '#9ca3af', label: 'NOOP  ' },
}

let diffIdCounter = 1

export function Task3_1_Solution() {
  const [before, setBefore] = useState<DiffItem[]>([
    { key: 'a', value: 'Alice' },
    { key: 'b', value: 'Bob' },
    { key: 'c', value: 'Charlie' },
  ])
  const [after, setAfter] = useState<DiffItem[]>([
    { key: 'b', value: 'Bobby' },
    { key: 'c', value: 'Charlie' },
    { key: 'd', value: 'Diana' },
  ])

  const ops = diffArrays(before, after)
  const counts = ops.reduce(
    (acc, op) => ({ ...acc, [op.type]: (acc[op.type] ?? 0) + 1 }),
    {} as Record<DiffOpType, number>
  )

  function updateItem(
    list: DiffItem[],
    setList: (l: DiffItem[]) => void,
    idx: number,
    field: 'key' | 'value',
    val: string
  ) {
    setList(list.map((item, i) => (i === idx ? { ...item, [field]: val } : item)))
  }

  function addItem(list: DiffItem[], setList: (l: DiffItem[]) => void) {
    setList([...list, { key: `new${diffIdCounter++}`, value: '' }])
  }

  function removeItem(list: DiffItem[], setList: (l: DiffItem[]) => void, idx: number) {
    setList(list.filter((_, i) => i !== idx))
  }

  const inputStyle: React.CSSProperties = {
    background: '#111827',
    border: '1px solid #374151',
    borderRadius: '4px',
    color: '#e5e7eb',
    padding: '4px 8px',
    fontSize: '13px',
    width: '100px',
  }

  const btnSmall: React.CSSProperties = {
    padding: '2px 8px',
    borderRadius: '4px',
    border: 'none',
    background: '#374151',
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '12px',
  }

  function EditableList({
    label,
    list,
    setList,
  }: {
    label: string
    list: DiffItem[]
    setList: (l: DiffItem[]) => void
  }) {
    return (
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: '#e5e7eb', marginBottom: '8px', fontSize: '14px' }}>
          {label}
        </div>
        {list.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
            <input
              style={inputStyle}
              value={item.key}
              placeholder="key"
              onChange={e => updateItem(list, setList, idx, 'key', e.target.value)}
            />
            <input
              style={inputStyle}
              value={item.value}
              placeholder="value"
              onChange={e => updateItem(list, setList, idx, 'value', e.target.value)}
            />
            <button style={btnSmall} onClick={() => removeItem(list, setList, idx)}>
              x
            </button>
          </div>
        ))}
        <button
          onClick={() => addItem(list, setList)}
          style={{ ...btnSmall, padding: '4px 12px', marginTop: '4px', color: '#60a5fa' }}
        >
          + Добавить
        </button>
      </div>
    )
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.1: Diff Visualizer</h2>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <EditableList label="До (Before)" list={before} setList={setBefore} />
        <EditableList label="После (After)" list={after} setList={setAfter} />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {(['CREATE', 'UPDATE', 'DELETE', 'NOOP'] as DiffOpType[]).map(type => (
          <div
            key={type}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: OP_STYLES[type].bg,
              color: OP_STYLES[type].color,
              fontSize: '13px',
              fontFamily: 'monospace',
            }}
          >
            {type}: {counts[type] ?? 0}
          </div>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'monospace' }}>
          <thead>
            <tr style={{ background: '#1f2937' }}>
              {['Op', 'Key', 'Old Value', 'New Value'].map(col => (
                <th
                  key={col}
                  style={{
                    padding: '8px 14px',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontWeight: 600,
                    borderBottom: '1px solid #374151',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ops.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '16px', color: '#6b7280', textAlign: 'center' }}>
                  Оба списка пусты
                </td>
              </tr>
            ) : (
              ops.map((op, i) => {
                const s = OP_STYLES[op.type]
                return (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#111827' : '#141a24' }}>
                    <td style={{ padding: '8px 14px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: s.bg,
                          color: s.color,
                          fontWeight: 600,
                          fontSize: '12px',
                        }}
                      >
                        {s.label}
                      </span>
                    </td>
                    <td style={{ padding: '8px 14px', color: '#e5e7eb' }}>{op.key}</td>
                    <td style={{ padding: '8px 14px', color: '#fca5a5' }}>{op.oldValue ?? '—'}</td>
                    <td style={{ padding: '8px 14px', color: '#6ee7b7' }}>{op.newValue ?? '—'}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Task 3.2: Key Chaos ──────────────────────────────────────────────────────

type Task = {
  id: number
  name: string
}

let taskIdCounter = 6

export function Task3_2_Solution() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Купить молоко' },
    { id: 2, name: 'Позвонить маме' },
    { id: 3, name: 'Прочитать книгу' },
    { id: 4, name: 'Сделать зарядку' },
    { id: 5, name: 'Написать отчёт' },
  ])
  const [showBug, setShowBug] = useState(true)

  function addToStart() {
    const newId = taskIdCounter++
    setTasks(prev => [{ id: newId, name: `Задача ${newId}` }, ...prev])
  }

  function removeTask(id: number) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const taskItemStyle = (isOdd: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    background: isOdd ? '#1a2233' : '#111827',
    borderRadius: '4px',
    marginBottom: '4px',
  })

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '4px 8px',
    background: '#0f172a',
    border: '1px solid #374151',
    borderRadius: '4px',
    color: '#e5e7eb',
    fontSize: '13px',
    minWidth: 0,
  }

  const delBtn: React.CSSProperties = {
    padding: '4px 10px',
    background: '#7f1d1d',
    color: '#fca5a5',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.2: Key Chaos</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowBug(true)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: showBug ? '#7f1d1d' : '#374151',
            color: showBug ? '#fca5a5' : '#9ca3af',
            cursor: 'pointer',
            fontWeight: showBug ? 700 : 400,
          }}
        >
          С багом (key=index)
        </button>
        <button
          onClick={() => setShowBug(false)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: !showBug ? '#065f46' : '#374151',
            color: !showBug ? '#6ee7b7' : '#9ca3af',
            cursor: 'pointer',
            fontWeight: !showBug ? 700 : 400,
          }}
        >
          Без бага (key=task.id)
        </button>
        <button
          onClick={addToStart}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: '#1e3a5f',
            color: '#60a5fa',
            cursor: 'pointer',
          }}
        >
          + Добавить в начало
        </button>
      </div>

      <div
        style={{
          padding: '12px 16px',
          borderRadius: '6px',
          background: showBug ? '#2d0a0a' : '#0a1f15',
          borderLeft: `4px solid ${showBug ? '#dc2626' : '#059669'}`,
          marginBottom: '16px',
          fontSize: '13px',
          color: '#d1d5db',
          lineHeight: 1.6,
        }}
      >
        {showBug ? (
          <span>
            <strong style={{ color: '#fca5a5' }}>Версия с багом.</strong> key=index.
            Введи заметки в поля, затем удали первую задачу или добавь в начало.
            Заметки сдвинутся к соседним задачам.
          </span>
        ) : (
          <span>
            <strong style={{ color: '#6ee7b7' }}>Версия без бага.</strong> key=task.id (стабильный).
            Заметки всегда остаются у правильных задач.
          </span>
        )}
      </div>

      {showBug
        ? tasks.map((task, index) => (
            <div key={index} style={taskItemStyle(index % 2 === 1)}>
              <span style={{ color: '#6b7280', fontSize: '12px', minWidth: '28px' }}>
                [{index}]
              </span>
              <span style={{ color: '#e5e7eb', fontSize: '13px', minWidth: '150px' }}>
                {task.name}
              </span>
              <input style={inputStyle} placeholder="Заметки..." />
              <button style={delBtn} onClick={() => removeTask(task.id)}>
                Удалить
              </button>
            </div>
          ))
        : tasks.map((task, index) => (
            <div key={task.id} style={taskItemStyle(index % 2 === 1)}>
              <span style={{ color: '#6b7280', fontSize: '12px', minWidth: '28px' }}>
                id{task.id}
              </span>
              <span style={{ color: '#e5e7eb', fontSize: '13px', minWidth: '150px' }}>
                {task.name}
              </span>
              <input style={inputStyle} placeholder="Заметки..." />
              <button style={delBtn} onClick={() => removeTask(task.id)}>
                Удалить
              </button>
            </div>
          ))}
    </div>
  )
}

// ─── Task 3.3: Key Reset vs useEffect ────────────────────────────────────────

const USERS = [
  { id: 'alice',   name: 'Alice',   role: 'Frontend Engineer' },
  { id: 'bob',     name: 'Bob',     role: 'Backend Engineer' },
  { id: 'charlie', name: 'Charlie', role: 'DevOps' },
]

function ProfileEditorV1({ userId }: { userId: string }) {
  const renderCount = useRef(0)
  renderCount.current++

  const user = USERS.find(u => u.id === userId)!
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  // Track userId changes and reset state during render (simulates the antipattern)
  const prevUserIdRef = useRef(userId)
  if (prevUserIdRef.current !== userId) {
    prevUserIdRef.current = userId
    setName('')
    setBio('')
  }

  const fieldStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    marginBottom: '8px',
    padding: '6px 10px',
    background: '#0f172a',
    border: '1px solid #374151',
    borderRadius: '4px',
    color: '#e5e7eb',
    fontSize: '13px',
    boxSizing: 'border-box',
  }

  return (
    <div
      style={{
        padding: '16px',
        background: '#1a2233',
        borderRadius: '8px',
        border: '2px solid #7f1d1d',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ color: '#fca5a5', fontWeight: 600, fontSize: '13px' }}>
          V1: setState сброс (антипаттерн)
        </span>
        <span style={{ color: '#9ca3af', fontSize: '12px' }}>
          Рендеров: <strong style={{ color: '#f87171' }}>{renderCount.current}</strong>
        </span>
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
        Пользователь: <strong style={{ color: '#e5e7eb' }}>{user.name}</strong> ({user.role})
      </div>
      <input
        style={fieldStyle}
        placeholder="Имя..."
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <textarea
        style={{ ...fieldStyle, resize: 'vertical', minHeight: '60px' }}
        placeholder="Биография..."
        value={bio}
        onChange={e => setBio(e.target.value)}
      />
    </div>
  )
}

function ProfileEditorV2({ userId }: { userId: string }) {
  const renderCount = useRef(0)
  renderCount.current++

  const user = USERS.find(u => u.id === userId)!
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  const fieldStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    marginBottom: '8px',
    padding: '6px 10px',
    background: '#0f172a',
    border: '1px solid #374151',
    borderRadius: '4px',
    color: '#e5e7eb',
    fontSize: '13px',
    boxSizing: 'border-box',
  }

  return (
    <div
      style={{
        padding: '16px',
        background: '#1a2233',
        borderRadius: '8px',
        border: '2px solid #065f46',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ color: '#6ee7b7', fontWeight: 600, fontSize: '13px' }}>
          V2: key={'{userId}'} (правильный)
        </span>
        <span style={{ color: '#9ca3af', fontSize: '12px' }}>
          Рендеров: <strong style={{ color: '#34d399' }}>{renderCount.current}</strong>
        </span>
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
        Пользователь: <strong style={{ color: '#e5e7eb' }}>{user.name}</strong> ({user.role})
      </div>
      <input
        style={fieldStyle}
        placeholder="Имя..."
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <textarea
        style={{ ...fieldStyle, resize: 'vertical', minHeight: '60px' }}
        placeholder="Биография..."
        value={bio}
        onChange={e => setBio(e.target.value)}
      />
    </div>
  )
}

export function Task3_3_Solution() {
  const [userId, setUserId] = useState('alice')

  return (
    <div className="exercise-container">
      <h2>Задание 3.3: Key Reset vs useEffect</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {USERS.map(user => (
          <button
            key={user.id}
            onClick={() => setUserId(user.id)}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              border: 'none',
              background: userId === user.id ? '#3b82f6' : '#374151',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: userId === user.id ? 700 : 400,
            }}
          >
            {user.name}
          </button>
        ))}
      </div>

      <div
        style={{
          padding: '12px 16px',
          borderRadius: '6px',
          background: '#0f172a',
          marginBottom: '20px',
          fontSize: '13px',
          color: '#9ca3af',
          lineHeight: 1.6,
        }}
      >
        Введи текст в поля обоих редакторов, затем переключи пользователя.
        Счётчик рендеров покажет разницу в эффективности.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ProfileEditorV1 userId={userId} />
        <ProfileEditorV2 key={userId} userId={userId} />
      </div>

      <div
        style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: '#1e3a5f',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#93c5fd',
          lineHeight: 1.7,
        }}
      >
        <strong>You Might Not Need an Effect:</strong> смена userId — это не "изменение пропса, на которое надо реагировать".
        Это семантически другой компонент. key выражает это намерение явно и без лишних рендеров.
      </div>
    </div>
  )
}

// ─── Task 3.4: Reconciliation Step-by-Step ───────────────────────────────────

type RecFiber = {
  key: string
  value: string
  index: number
}

type RecOpType = 'PLACEMENT' | 'UPDATE' | 'DELETION' | 'NOOP'

type RecOp = {
  type: RecOpType
  key: string
  oldIndex?: number
  newIndex?: number
  note: string
}

type RecStep = {
  phase: 1 | 2
  description: string
  currentOldKey?: string
  currentNewKey?: string
}

type RecResult = {
  ops: RecOp[]
  steps: RecStep[]
}

function reconcileChildren(oldFibers: RecFiber[], newElements: RecFiber[]): RecResult {
  const ops: RecOp[] = []
  const steps: RecStep[] = []

  let oldIdx = 0
  let newIdx = 0

  steps.push({ phase: 1, description: 'Фаза 1: линейный поиск (пока ключи совпадают)' })

  while (oldIdx < oldFibers.length && newIdx < newElements.length) {
    const old = oldFibers[oldIdx]
    const next = newElements[newIdx]

    steps.push({
      phase: 1,
      description: `Сравниваем old[${oldIdx}]="${old.key}" vs new[${newIdx}]="${next.key}"`,
      currentOldKey: old.key,
      currentNewKey: next.key,
    })

    if (old.key !== next.key) {
      steps.push({
        phase: 1,
        description: `Ключи не совпали ("${old.key}" != "${next.key}") — прерываем фазу 1`,
        currentOldKey: old.key,
        currentNewKey: next.key,
      })
      break
    }

    if (old.value !== next.value) {
      ops.push({ type: 'UPDATE', key: old.key, oldIndex: old.index, newIndex: next.index, note: `${old.value} -> ${next.value}` })
      steps.push({ phase: 1, description: `key="${old.key}" совпал, value изменился -> UPDATE`, currentOldKey: old.key, currentNewKey: next.key })
    } else {
      ops.push({ type: 'NOOP', key: old.key, oldIndex: old.index, newIndex: next.index, note: 'без изменений' })
      steps.push({ phase: 1, description: `key="${old.key}" совпал, value тот же -> NOOP`, currentOldKey: old.key, currentNewKey: next.key })
    }

    oldIdx++
    newIdx++
  }

  if (oldIdx >= oldFibers.length && newIdx >= newElements.length) {
    steps.push({ phase: 1, description: 'Оба списка исчерпаны в фазе 1. Готово!' })
    return { ops, steps }
  }

  // Handle remaining new elements if old fibers are exhausted
  if (oldIdx >= oldFibers.length) {
    for (; newIdx < newElements.length; newIdx++) {
      const next = newElements[newIdx]
      ops.push({ type: 'PLACEMENT', key: next.key, newIndex: newIdx, note: 'новый элемент' })
      steps.push({ phase: 1, description: `Старые fibers кончились, new[${newIdx}]="${next.key}" -> PLACEMENT`, currentNewKey: next.key })
    }
    return { ops, steps }
  }

  // Handle remaining old fibers if new elements are exhausted
  if (newIdx >= newElements.length) {
    for (; oldIdx < oldFibers.length; oldIdx++) {
      const old = oldFibers[oldIdx]
      ops.push({ type: 'DELETION', key: old.key, oldIndex: old.index, note: 'удалён' })
      steps.push({ phase: 1, description: `Новые элементы кончились, old[${oldIdx}]="${old.key}" -> DELETION`, currentOldKey: old.key })
    }
    return { ops, steps }
  }

  steps.push({ phase: 2, description: 'Фаза 2: строим Map из оставшихся старых fibers' })

  const existingMap = new Map<string, RecFiber>()
  for (let i = oldIdx; i < oldFibers.length; i++) {
    existingMap.set(oldFibers[i].key, oldFibers[i])
  }

  const mapKeys = Array.from(existingMap.keys()).map(k => `"${k}"`).join(', ')
  steps.push({ phase: 2, description: `Map: { ${mapKeys} }` })

  let lastPlacedIndex = 0

  for (; newIdx < newElements.length; newIdx++) {
    const next = newElements[newIdx]
    const existing = existingMap.get(next.key)

    steps.push({
      phase: 2,
      description: `new[${newIdx}]="${next.key}" — ${existing ? `найден в Map (oldIndex=${existing.index})` : 'не найден в Map'}`,
      currentNewKey: next.key,
      currentOldKey: existing?.key,
    })

    if (!existing) {
      ops.push({ type: 'PLACEMENT', key: next.key, newIndex: newIdx, note: 'новый элемент' })
      steps.push({ phase: 2, description: `"${next.key}" не найден -> PLACEMENT (создание)`, currentNewKey: next.key })
    } else {
      existingMap.delete(next.key)

      if (existing.index < lastPlacedIndex) {
        ops.push({ type: 'PLACEMENT', key: next.key, oldIndex: existing.index, newIndex: newIdx, note: `переместился (oldIdx=${existing.index} < lastPlaced=${lastPlacedIndex})` })
        steps.push({
          phase: 2,
          description: `"${next.key}" oldIndex=${existing.index} < lastPlaced=${lastPlacedIndex} -> PLACEMENT (перемещение)`,
          currentNewKey: next.key,
          currentOldKey: next.key,
        })
      } else {
        lastPlacedIndex = existing.index
        if (next.value !== existing.value) {
          ops.push({ type: 'UPDATE', key: next.key, oldIndex: existing.index, newIndex: newIdx, note: `${existing.value} -> ${next.value}` })
          steps.push({ phase: 2, description: `"${next.key}" на месте, value изменился -> UPDATE`, currentNewKey: next.key, currentOldKey: next.key })
        } else {
          ops.push({ type: 'NOOP', key: next.key, oldIndex: existing.index, newIndex: newIdx, note: 'на месте, без изменений' })
          steps.push({ phase: 2, description: `"${next.key}" на месте, value тот же -> NOOP (lastPlaced=${lastPlacedIndex})`, currentNewKey: next.key, currentOldKey: next.key })
        }
      }
    }
  }

  for (const [key, fiber] of existingMap) {
    ops.push({ type: 'DELETION', key, oldIndex: fiber.index, note: 'не найден в новых элементах' })
    steps.push({ phase: 2, description: `"${key}" остался в Map -> DELETION`, currentOldKey: key })
  }

  steps.push({ phase: 2, description: 'Фаза 2 завершена.' })
  return { ops, steps }
}

const REC_OP_STYLES: Record<RecOpType, { bg: string; color: string }> = {
  PLACEMENT: { bg: '#065f46', color: '#6ee7b7' },
  UPDATE:    { bg: '#78350f', color: '#fcd34d' },
  DELETION:  { bg: '#7f1d1d', color: '#fca5a5' },
  NOOP:      { bg: '#1f2937', color: '#9ca3af' },
}

type Preset = {
  label: string
  old: RecFiber[]
  new: RecFiber[]
}

const PRESETS: Record<string, Preset> = {
  addToStart: {
    label: 'Добавить в начало',
    old: [
      { key: 'B', value: 'Bob', index: 0 },
      { key: 'C', value: 'Charlie', index: 1 },
    ],
    new: [
      { key: 'A', value: 'Alice', index: 0 },
      { key: 'B', value: 'Bob', index: 1 },
      { key: 'C', value: 'Charlie', index: 2 },
    ],
  },
  removeMiddle: {
    label: 'Удалить из середины',
    old: [
      { key: 'A', value: 'Alice', index: 0 },
      { key: 'B', value: 'Bob', index: 1 },
      { key: 'C', value: 'Charlie', index: 2 },
    ],
    new: [
      { key: 'A', value: 'Alice', index: 0 },
      { key: 'C', value: 'Charlie', index: 1 },
    ],
  },
  reorder: {
    label: 'Переупорядочить [A,B,C,D] -> [B,C,D,A]',
    old: [
      { key: 'A', value: 'Alice', index: 0 },
      { key: 'B', value: 'Bob', index: 1 },
      { key: 'C', value: 'Charlie', index: 2 },
      { key: 'D', value: 'Diana', index: 3 },
    ],
    new: [
      { key: 'B', value: 'Bob', index: 0 },
      { key: 'C', value: 'Charlie', index: 1 },
      { key: 'D', value: 'Diana', index: 2 },
      { key: 'A', value: 'Alice', index: 3 },
    ],
  },
}

export function Task3_4_Solution() {
  const [oldFibers, setOldFibers] = useState<RecFiber[]>(PRESETS['reorder'].old)
  const [newElements, setNewElements] = useState<RecFiber[]>(PRESETS['reorder'].new)
  const [result, setResult] = useState<RecResult | null>(null)
  const [stepIdx, setStepIdx] = useState(0)

  function runReconcile() {
    const r = reconcileChildren(oldFibers, newElements)
    setResult(r)
    setStepIdx(0)
  }

  function applyPreset(key: string) {
    const p = PRESETS[key]
    setOldFibers(p.old)
    setNewElements(p.new)
    setResult(null)
    setStepIdx(0)
  }

  const currentStep = result?.steps[stepIdx]

  function FiberList({
    items,
    label,
    highlightKey,
  }: {
    items: RecFiber[]
    label: string
    highlightKey?: string
  }) {
    return (
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: '#e5e7eb', marginBottom: '8px', fontSize: '13px' }}>
          {label}
        </div>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              padding: '6px 10px',
              marginBottom: '4px',
              borderRadius: '4px',
              background: item.key === highlightKey ? '#1e3a5f' : '#1f2937',
              border: `1px solid ${item.key === highlightKey ? '#3b82f6' : 'transparent'}`,
              fontFamily: 'monospace',
              fontSize: '13px',
              color: item.key === highlightKey ? '#60a5fa' : '#e5e7eb',
              transition: 'all 0.15s',
            }}
          >
            [{i}] key="{item.key}" value="{item.value}"
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.4: Reconciliation Step-by-Step</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {Object.entries(PRESETS).map(([key, p]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: '#374151',
              color: '#d1d5db',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={runReconcile}
          style={{
            padding: '6px 18px',
            borderRadius: '6px',
            border: 'none',
            background: '#3b82f6',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          Запустить reconciliation
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <FiberList
          items={oldFibers}
          label="Старые fibers (current tree)"
          highlightKey={currentStep?.currentOldKey}
        />
        <FiberList
          items={newElements}
          label="Новые элементы (JSX)"
          highlightKey={currentStep?.currentNewKey}
        />
      </div>

      {result && (
        <>
          <div
            style={{
              padding: '14px 16px',
              background: currentStep?.phase === 1 ? '#1e3a5f' : '#1a1a3f',
              borderRadius: '8px',
              marginBottom: '12px',
              borderLeft: `4px solid ${currentStep?.phase === 1 ? '#3b82f6' : '#8b5cf6'}`,
            }}
          >
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
              Фаза {currentStep?.phase} | Шаг {stepIdx + 1} / {result.steps.length}
            </div>
            <div style={{ color: '#e5e7eb', fontSize: '14px', lineHeight: 1.5 }}>
              {currentStep?.description}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <button
              onClick={() => setStepIdx(i => Math.max(0, i - 1))}
              disabled={stepIdx === 0}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                border: 'none',
                background: stepIdx === 0 ? '#1f2937' : '#374151',
                color: stepIdx === 0 ? '#4b5563' : '#e5e7eb',
                cursor: stepIdx === 0 ? 'default' : 'pointer',
              }}
            >
              Назад
            </button>
            <button
              onClick={() => setStepIdx(i => Math.min(result.steps.length - 1, i + 1))}
              disabled={stepIdx === result.steps.length - 1}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                border: 'none',
                background: stepIdx === result.steps.length - 1 ? '#1f2937' : '#3b82f6',
                color: stepIdx === result.steps.length - 1 ? '#4b5563' : '#fff',
                cursor: stepIdx === result.steps.length - 1 ? 'default' : 'pointer',
              }}
            >
              Вперёд
            </button>
            <button
              onClick={() => setStepIdx(result.steps.length - 1)}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#374151',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              В конец
            </button>
          </div>

          <div style={{ fontWeight: 600, color: '#e5e7eb', marginBottom: '8px', fontSize: '14px' }}>
            Итоговые операции:
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {(['PLACEMENT', 'UPDATE', 'DELETION', 'NOOP'] as RecOpType[]).map(t => {
              const count = result.ops.filter(o => o.type === t).length
              return (
                <span
                  key={t}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '4px',
                    background: REC_OP_STYLES[t].bg,
                    color: REC_OP_STYLES[t].color,
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                >
                  {t}: {count}
                </span>
              )
            })}
          </div>

          {result.ops.map((op, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '10px',
                padding: '6px 10px',
                background: '#111827',
                borderRadius: '4px',
                marginBottom: '4px',
                fontSize: '13px',
                fontFamily: 'monospace',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: REC_OP_STYLES[op.type].bg,
                  color: REC_OP_STYLES[op.type].color,
                  fontSize: '12px',
                  minWidth: '80px',
                  textAlign: 'center',
                }}
              >
                {op.type}
              </span>
              <span style={{ color: '#e5e7eb' }}>key="{op.key}"</span>
              <span style={{ color: '#6b7280' }}>{op.note}</span>
            </div>
          ))}
        </>
      )}

      {!result && (
        <div
          style={{
            color: '#6b7280',
            fontSize: '13px',
            padding: '24px',
            textAlign: 'center',
            background: '#111827',
            borderRadius: '8px',
          }}
        >
          Выбери пресет и нажми "Запустить reconciliation" для пошаговой визуализации
        </div>
      )}
    </div>
  )
}
