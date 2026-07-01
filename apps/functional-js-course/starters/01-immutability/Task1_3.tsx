import { useState } from 'react'
import { produce } from 'immer'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.3: Immer produce
// Task 1.3: Immer produce
// ============================================
// Сравните ручной иммутабельный подход и Immer produce.
// Compare manual immutable approach and Immer produce.

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

// ---- Ручные иммутабельные операции / Manual immutable operations ----

// TODO: Реализуйте функцию добавления без мутации
// TODO: Implement add function without mutation
// function addManual(state: TodoState, text: string): TodoState { ... }
// Подсказка: используйте spread для корневого объекта и массива
// Hint: use spread for both the root object and the array

// TODO: Реализуйте функцию toggle без мутации
// TODO: Implement toggle function without mutation
// function toggleManual(state: TodoState, id: number): TodoState { ... }
// Подсказка: используйте .map() с conditional spread
// Hint: use .map() with conditional spread

// TODO: Реализуйте функцию удаления без мутации
// TODO: Implement delete function without mutation
// function deleteManual(state: TodoState, id: number): TodoState { ... }
// Подсказка: используйте .filter()
// Hint: use .filter()

// ---- Immer версии / Immer versions ----

// TODO: Реализуйте добавление через produce
// TODO: Implement add via produce
// function addImmer(state: TodoState, text: string): TodoState {
//   return produce(state, draft => {
//     // draft.todos.push(...)
//     // draft.nextId++
//   })
// }

// TODO: Реализуйте toggle через produce
// TODO: Implement toggle via produce
// function toggleImmer(state: TodoState, id: number): TodoState { ... }
// Подсказка: draft.todos.find(t => t.id === id)

// TODO: Реализуйте удаление через produce
// TODO: Implement delete via produce
// function deleteImmer(state: TodoState, id: number): TodoState { ... }
// Подсказка: draft.todos.splice(idx, 1)

// Код для отображения в колонках (измените при необходимости)
// Code to display in columns (modify as needed)
const MANUAL_CODE: Record<string, string> = {
  add: `return {
  ...state,
  todos: [
    ...state.todos,
    { id: state.nextId, text, done: false }
  ],
  nextId: state.nextId + 1,
}`,
  toggle: `return {
  ...state,
  todos: state.todos.map(t =>
    t.id === id
      ? { ...t, done: !t.done }
      : t
  ),
}`,
  delete: `return {
  ...state,
  todos: state.todos.filter(
    t => t.id !== id
  ),
}`,
}

const IMMER_CODE: Record<string, string> = {
  add: `produce(state, draft => {
  draft.todos.push({
    id: draft.nextId,
    text,
    done: false,
  })
  draft.nextId++
})`,
  toggle: `produce(state, draft => {
  const todo = draft.todos
    .find(t => t.id === id)
  if (todo) todo.done = !todo.done
})`,
  delete: `produce(state, draft => {
  const idx = draft.todos
    .findIndex(t => t.id === id)
  if (idx !== -1)
    draft.todos.splice(idx, 1)
})`,
}

export function Task1_3() {
  const { t } = useLanguage()
  const [state, setState] = useState<TodoState>(JSON.parse(JSON.stringify(INITIAL_STATE)))
  const [lastAction, setLastAction] = useState<string>('add')
  const [newText, setNewText] = useState('Новая задача')

  // TODO: Добавьте состояние для истории (последние 5 снапшотов)
  // TODO: Add state for history (last 5 snapshots)
  // const [history, setHistory] = useState<Array<{ action: string; snapshot: TodoState }>>([])

  const doAdd = () => {
    const text = newText.trim() || 'Задача'
    // TODO: Вызовите addManual(state, text) и обновите стейт
    // TODO: Call addManual(state, text) and update state
    // TODO: Обновите lastAction и историю
    // TODO: Update lastAction and history
    setState(prev => prev) // заглушка / placeholder
    setLastAction('add')
    console.log('TODO: implement addManual or addImmer')
  }

  const doToggle = (id: number) => {
    // TODO: Вызовите toggleManual(state, id) и обновите стейт
    // TODO: Call toggleManual(state, id) and update state
    setState(prev => prev) // заглушка / placeholder
    setLastAction('toggle')
    console.log('TODO: implement toggleManual or toggleImmer', id)
  }

  const doDelete = (id: number) => {
    // TODO: Вызовите deleteManual(state, id) и обновите стейт
    // TODO: Call deleteManual(state, id) and update state
    setState(prev => prev) // заглушка / placeholder
    setLastAction('delete')
    console.log('TODO: implement deleteManual or deleteImmer', id)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.1.3')}</h2>

      {/* Сравнение кода / Code comparison */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', background: '#fefce8', borderRadius: '8px', padding: '1rem' }}>
          <strong style={{ color: '#92400e', fontSize: '0.9rem' }}>Ручной способ</strong>
          <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.6rem', fontSize: '0.72rem', color: '#fde68a', margin: '0.5rem 0 0', overflowX: 'auto' }}>
            {MANUAL_CODE[lastAction]}
          </pre>
        </div>
        <div style={{ flex: 1, minWidth: '200px', background: '#f0fdf4', borderRadius: '8px', padding: '1rem' }}>
          <strong style={{ color: '#166534', fontSize: '0.9rem' }}>Immer produce</strong>
          <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.6rem', fontSize: '0.72rem', color: '#6ee7b7', margin: '0.5rem 0 0', overflowX: 'auto' }}>
            {IMMER_CODE[lastAction]}
          </pre>
        </div>
      </div>

      {/* TODO: Добавьте счётчик строк кода */}
      {/* TODO: Add line count badge */}

      {/* Ввод новой задачи / New todo input */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          value={newText}
          onChange={e => setNewText(e.target.value)}
          style={{ flex: 1, minWidth: '150px', border: '1px solid #d1d5db', borderRadius: '6px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
          placeholder="Текст задачи..."
        />
        <button
          onClick={doAdd}
          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Добавить
        </button>
      </div>

      {/* Список задач / Todo list */}
      <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <strong style={{ fontSize: '0.85rem', color: '#374151' }}>Список ({state.todos.length} задач):</strong>
        {state.todos.length === 0 && <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.5rem' }}>Нет задач</div>}
        {state.todos.map(todo => (
          <div key={todo.id} style={{ display: 'flex', alignItems: 'center', padding: '0.35rem 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{
              flex: 1,
              fontSize: '0.9rem',
              color: todo.done ? '#9ca3af' : '#111827',
              textDecoration: todo.done ? 'line-through' : 'none',
            }}>
              [{todo.id}] {todo.text}
            </span>
            <button
              onClick={() => doToggle(todo.id)}
              style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem', marginLeft: '0.3rem' }}
            >
              {todo.done ? 'Undone' : 'Done'}
            </button>
            <button
              onClick={() => doDelete(todo.id)}
              style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem', marginLeft: '0.3rem' }}
            >
              Del
            </button>
          </div>
        ))}
      </div>

      {/* TODO: Добавьте историю последних 5 состояний */}
      {/* TODO: Add history of last 5 states */}
    </div>
  )
}
