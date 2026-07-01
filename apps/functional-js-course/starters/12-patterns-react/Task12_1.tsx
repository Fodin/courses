import { useState, useCallback } from 'react'
import { useLanguage } from 'src/hooks'
import { produce } from 'immer'

// ============================================================
// Задание 12.1: Иммутабельный стейт-менеджмент
//
// Цель: построить Mini-Redux на FP-принципах с поддержкой
//       Undo/Redo через стек иммутабельных состояний.
// ============================================================

// --- Types ---

interface Todo {
  id: number
  text: string
  done: boolean
}

type Action =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'TOGGLE_TODO'; id: number }
  | { type: 'DELETE_TODO'; id: number }

interface State {
  todos: Todo[]
  nextId: number
}

interface History {
  past: State[]
  present: State
  future: State[]
}

const initialState: State = {
  todos: [
    { id: 1, text: 'Изучить FP', done: true },
    { id: 2, text: 'Применить в React', done: false },
  ],
  nextId: 3,
}

// ============================================================
// TODO 1: Реализуй pure reducer с Immer produce
//
// Функция принимает state и action, возвращает новый state.
// Используй produce(state, draft => { ... }) из immer.
// Внутри produce можно мутировать draft — immer заботится
// об иммутабельности.
//
// Три кейса:
//   ADD_TODO    → добавить { id: nextId, text, done: false }, nextId++
//   TOGGLE_TODO → найти todo по id, перевернуть done
//   DELETE_TODO → отфильтровать todo по id
// ============================================================
function reducer(_state: State, _action: Action): State {
  // TODO: реализовать через produce(state, draft => { switch ... })
  return _state // заглушка
}

// ============================================================
// TODO 2: Реализуй хук useUndoableReducer
//
// Хранит в стейте объект History: { past, present, future }.
//
// dispatch(action):
//   - текущий present уходит в конец past
//   - новый present = reducer(present, action)
//   - future очищается
//
// undo():
//   - если past пуст — ничего не делаем
//   - последний элемент past становится новым present
//   - прежний present уходит в начало future
//
// redo():
//   - если future пуст — ничего не делаем
//   - первый элемент future становится новым present
//   - прежний present уходит в конец past
// ============================================================
function useUndoableReducer() {
  const [history, setHistory] = useState<History>({
    past: [],
    present: initialState,
    future: [],
  })

  // TODO: реализовать dispatch
  const dispatch = useCallback((_action: Action) => {
    // setHistory(h => ({ past: [...h.past, h.present], present: reducer(...), future: [] }))
  }, [])

  // TODO: реализовать undo
  const undo = useCallback(() => {
    // setHistory(h => { if (h.past.length === 0) return h; ... })
  }, [])

  // TODO: реализовать redo
  const redo = useCallback(() => {
    // setHistory(h => { if (h.future.length === 0) return h; ... })
  }, [])

  return { history, dispatch, undo, redo }
}

// ============================================================
// Компонент задания — завершите TODO выше, UI готов
// ============================================================

export function Task12_1() {
  const { t } = useLanguage()
  const { history, dispatch, undo, redo } = useUndoableReducer()
  const [inputText, setInputText] = useState('')
  const state = history.present

  const handleAdd = () => {
    const trimmed = inputText.trim()
    if (!trimmed) return
    dispatch({ type: 'ADD_TODO', text: trimmed })
    setInputText('')
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.12.1')}</h2>

      {/* Add todo */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Новое задание..."
          style={{
            flex: 1,
            padding: '0.4rem 0.6rem',
            background: '#0f172a',
            border: '1px solid #374151',
            color: '#e5e7eb',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            background: '#14532d',
            color: '#86efac',
            border: '1px solid #22c55e',
            borderRadius: '6px',
            padding: '0.4rem 1rem',
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
        >
          Добавить
        </button>
      </div>

      {/* Undo / Redo */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={undo}
          disabled={history.past.length === 0}
          style={{
            background: history.past.length > 0 ? '#1e3a5f' : '#374151',
            color: history.past.length > 0 ? '#93c5fd' : '#9ca3af',
            border: `1px solid ${history.past.length > 0 ? '#3b82f6' : '#4b5563'}`,
            borderRadius: '6px',
            padding: '0.35rem 0.9rem',
            cursor: history.past.length > 0 ? 'pointer' : 'not-allowed',
            fontFamily: 'monospace',
            marginRight: '0.5rem',
          }}
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={history.future.length === 0}
          style={{
            background: history.future.length > 0 ? '#1e3a5f' : '#374151',
            color: history.future.length > 0 ? '#93c5fd' : '#9ca3af',
            border: `1px solid ${history.future.length > 0 ? '#3b82f6' : '#4b5563'}`,
            borderRadius: '6px',
            padding: '0.35rem 0.9rem',
            cursor: history.future.length > 0 ? 'pointer' : 'not-allowed',
            fontFamily: 'monospace',
            marginRight: '0.5rem',
          }}
        >
          Redo
        </button>
        <span style={{ color: '#6b7280', fontSize: '0.82rem' }}>
          Past: {history.past.length} | Future: {history.future.length}
        </span>
      </div>

      {/* Todo list */}
      {state.todos.length === 0 && (
        <p style={{ color: '#6b7280' }}>Список пуст</p>
      )}
      {state.todos.map(todo => (
        <div
          key={todo.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 0.6rem',
            borderRadius: '6px',
            background: '#1f2937',
            marginBottom: '0.4rem',
          }}
        >
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => dispatch({ type: 'TOGGLE_TODO', id: todo.id })}
            style={{ cursor: 'pointer', accentColor: '#3b82f6' }}
          />
          <span
            style={{
              flex: 1,
              textDecoration: todo.done ? 'line-through' : 'none',
              color: todo.done ? '#6b7280' : '#e5e7eb',
            }}
          >
            {todo.text}
          </span>
          <button
            onClick={() => dispatch({ type: 'DELETE_TODO', id: todo.id })}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            x
          </button>
        </div>
      ))}

      <p style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '1rem' }}>
        Ожидается: reducer — pure функция, Undo/Redo работают через стек состояний.
      </p>
    </div>
  )
}
