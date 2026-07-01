import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from 'src/hooks'

// Task 6.1: useMemo vs useEffect for derived state
//
// This component has a BAD version: visibleTodos computed via useState + useEffect.
// Every time todos or filter changes → 2 renders happen (one for todos, one for visibleTodos).
//
// Your task: refactor to useMemo → 1 render per change.
// The render counter will prove the difference.

type Todo = {
  id: number
  text: string
  done: boolean
}

type Filter = 'all' | 'active' | 'done'

export function Task6_1() {
  const { t } = useLanguage()

  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Изучить useMemo', done: true },
    { id: 2, text: 'Понять useCallback', done: false },
    { id: 3, text: 'Написать React.memo', done: false },
  ])
  const [filter, setFilter] = useState<Filter>('all')
  const [newTodo, setNewTodo] = useState('')

  // TODO: add a renderCount ref and increment it every render
  // (useRef — not useState, to avoid extra renders)

  // ─── BAD VERSION (uncomment to see 2 renders per change) ──────────────────
  // const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos)
  //
  // useEffect(() => {
  //   if (filter === 'all') setVisibleTodos(todos)
  //   else if (filter === 'done') setVisibleTodos(todos.filter(t => t.done))
  //   else setVisibleTodos(todos.filter(t => !t.done))
  // }, [todos, filter])
  // ──────────────────────────────────────────────────────────────────────────

  // TODO: replace the bad version above with useMemo
  // visibleTodos should be computed during render, not via Effect
  // deps: [todos, filter]
  const visibleTodos: Todo[] = [] // Replace this line

  // TODO: also track when visibleTodos was last computed
  // (hint: use a ref updated inside the useMemo factory)

  function handleAdd() {
    if (!newTodo.trim()) return
    setTodos(prev => [...prev, { id: Date.now(), text: newTodo.trim(), done: false }])
    setNewTodo('')
  }

  function handleToggle(id: number) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const filters: Filter[] = ['all', 'active', 'done']
  const filterLabels: Record<Filter, string> = { all: 'Все', active: 'Активные', done: 'Выполненные' }

  return (
    <div className="exercise-container">
      <h2>{t('task.6.1')}</h2>

      {/* TODO: display render counter here */}
      <div style={{ marginBottom: 16, padding: '8px 12px', background: '#f9fafb', borderRadius: 8 }}>
        <strong>Счётчик рендеров:</strong> {/* renderCount.current */}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Новое todo (ввод НЕ должен пересчитывать visibleTodos)"
          style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db' }}
        />
        <button
          onClick={handleAdd}
          style={{ padding: '6px 14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Добавить
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: filter === f ? '#3b82f6' : 'white',
              color: filter === f ? 'white' : '#374151',
              cursor: 'pointer',
            }}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* TODO: show "Последний пересчёт: [time]" — should NOT update when typing newTodo */}

      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {visibleTodos.map(todo => (
          <li
            key={todo.id}
            onClick={() => handleToggle(todo.id)}
            style={{
              padding: '8px 12px',
              marginBottom: 4,
              borderRadius: 6,
              background: todo.done ? '#f0fdf4' : '#f9fafb',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              textDecoration: todo.done ? 'line-through' : 'none',
            }}
          >
            {todo.done ? '✅' : '⬜'} {todo.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
