import { useState } from 'react'

// ============================================
// Task 8.1 Solution: Аудит React 18 приложения
// ============================================

interface DeprecatedPattern {
  id: number
  name: string
  code: string
  replacement: string
  replacementCode: string
  severity: 'high' | 'medium' | 'low'
  category: string
}

const deprecatedPatterns: DeprecatedPattern[] = [
  {
    id: 1,
    name: 'defaultProps',
    code: `function Button({ color }) {\n  return <button style={{ color }} />\n}\nButton.defaultProps = { color: 'blue' }`,
    replacement: 'ES6 default parameters',
    replacementCode: `function Button({ color = 'blue' }) {\n  return <button style={{ color }} />\n}`,
    severity: 'high',
    category: 'Components',
  },
  {
    id: 2,
    name: 'forwardRef',
    code: `const Input = forwardRef((props, ref) => {\n  return <input ref={ref} {...props} />\n})`,
    replacement: 'ref как обычный prop',
    replacementCode: `function Input({ ref, ...props }) {\n  return <input ref={ref} {...props} />\n}`,
    severity: 'high',
    category: 'Refs',
  },
  {
    id: 3,
    name: 'useContext',
    code: `import { useContext } from 'react'\nconst theme = useContext(ThemeContext)`,
    replacement: 'use(Context)',
    replacementCode: `import { use } from 'react'\nconst theme = use(ThemeContext)`,
    severity: 'low',
    category: 'Context',
  },
  {
    id: 4,
    name: 'Context.Provider',
    code: `<ThemeContext.Provider value={theme}>\n  <App />\n</ThemeContext.Provider>`,
    replacement: 'Упрощённый синтаксис',
    replacementCode: `<ThemeContext value={theme}>\n  <App />\n</ThemeContext>`,
    severity: 'low',
    category: 'Context',
  },
  {
    id: 5,
    name: 'propTypes',
    code: `import PropTypes from 'prop-types'\nButton.propTypes = {\n  color: PropTypes.string\n}`,
    replacement: 'TypeScript',
    replacementCode: `interface ButtonProps {\n  color?: string\n}\nfunction Button({ color }: ButtonProps) { ... }`,
    severity: 'high',
    category: 'Types',
  },
  {
    id: 6,
    name: 'String refs',
    code: `class MyComponent extends React.Component {\n  render() {\n    return <input ref="myInput" />\n  }\n}`,
    replacement: 'useRef / createRef',
    replacementCode: `function MyComponent() {\n  const inputRef = useRef(null)\n  return <input ref={inputRef} />\n}`,
    severity: 'high',
    category: 'Refs',
  },
  {
    id: 7,
    name: 'ReactDOM.render',
    code: `import ReactDOM from 'react-dom'\nReactDOM.render(<App />, document.getElementById('root'))`,
    replacement: 'createRoot',
    replacementCode: `import { createRoot } from 'react-dom/client'\ncreateRoot(document.getElementById('root')!).render(<App />)`,
    severity: 'high',
    category: 'ReactDOM',
  },
  {
    id: 8,
    name: 'onSubmit + preventDefault',
    code: `<form onSubmit={(e) => {\n  e.preventDefault()\n  handleSubmit(formData)\n}}>`,
    replacement: 'form action',
    replacementCode: `<form action={async (formData) => {\n  await handleSubmit(formData)\n}}>`,
    severity: 'medium',
    category: 'Forms',
  },
]

export function Task8_1_Solution() {
  const [filter, setFilter] = useState<string>('all')
  const [found, setFound] = useState<Set<number>>(new Set())

  const categories = ['all', ...new Set(deprecatedPatterns.map((p) => p.category))]
  const filtered = filter === 'all' ? deprecatedPatterns : deprecatedPatterns.filter((p) => p.category === filter)

  const severityColors = { high: '#ef5350', medium: '#ff9800', low: '#4caf50' }
  const severityLabels = { high: 'Критично', medium: 'Средне', low: 'Низкий' }

  return (
    <div className="exercise-container">
      <h2>Решение 8.1: Аудит React 18 приложения</h2>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: filter === cat ? '#1976d2' : '#fff',
              color: filter === cat ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {cat === 'all' ? 'Все' : cat}
          </button>
        ))}
      </div>

      <p style={{ marginTop: '0.5rem', color: '#666' }}>
        Найдено: {found.size} / {deprecatedPatterns.length} паттернов
      </p>

      {filtered.map((pattern) => (
        <div
          key={pattern.id}
          style={{
            margin: '0.75rem 0',
            borderRadius: '8px',
            border: `1px solid ${found.has(pattern.id) ? '#4caf50' : '#ddd'}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              background: found.has(pattern.id) ? '#e8f5e9' : '#f5f5f5',
            }}
          >
            <div>
              <strong>{pattern.name}</strong>
              <span
                style={{
                  marginLeft: '0.5rem',
                  fontSize: '0.75rem',
                  padding: '0.1rem 0.5rem',
                  borderRadius: '4px',
                  background: severityColors[pattern.severity],
                  color: '#fff',
                }}
              >
                {severityLabels[pattern.severity]}
              </span>
            </div>
            <button
              onClick={() => setFound((prev) => new Set([...prev, pattern.id]))}
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                background: found.has(pattern.id) ? '#4caf50' : '#fff',
                color: found.has(pattern.id) ? '#fff' : '#333',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {found.has(pattern.id) ? '✓ Найдено' : 'Отметить'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
            <div style={{ padding: '0.75rem', background: '#ffebee' }}>
              <small style={{ color: '#c62828' }}>React 18 (deprecated)</small>
              <pre style={{ fontSize: '0.75rem', margin: '0.25rem 0', whiteSpace: 'pre-wrap' }}>{pattern.code}</pre>
            </div>
            <div style={{ padding: '0.75rem', background: '#e8f5e9' }}>
              <small style={{ color: '#2e7d32' }}>React 19 ({pattern.replacement})</small>
              <pre style={{ fontSize: '0.75rem', margin: '0.25rem 0', whiteSpace: 'pre-wrap' }}>
                {pattern.replacementCode}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// Task 8.2 Solution: Пошаговая миграция
// ============================================

interface MigrationStep {
  id: number
  title: string
  description: string
  commands?: string
  tips: string[]
}

const migrationSteps: MigrationStep[] = [
  {
    id: 1,
    title: '1. Обновить зависимости',
    description: 'Обновите react, react-dom и типы до версии 19',
    commands: 'npm install react@19 react-dom@19\nnpm install -D @types/react@19 @types/react-dom@19',
    tips: ['Обновите также eslint-plugin-react-hooks до v5+', 'Обновите @testing-library/react до v16+'],
  },
  {
    id: 2,
    title: '2. Запустить codemod',
    description: 'Автоматически мигрирует большинство паттернов',
    commands: 'npx codemod@latest react/19/migration-recipe',
    tips: ['Проверьте diff после codemod', 'Некоторые изменения могут быть некорректны'],
  },
  {
    id: 3,
    title: '3. Убрать forwardRef',
    description: 'Замените forwardRef на ref как обычный prop',
    tips: [
      'forwardRef(fn) → function Component({ ref, ...props })',
      'Ref cleanup: ref callback может возвращать функцию очистки',
    ],
  },
  {
    id: 4,
    title: '4. Убрать defaultProps',
    description: 'Замените defaultProps на ES6 default parameters',
    tips: [
      'Component.defaultProps = {} → деструктуризация с дефолтами',
      'Для class components defaultProps всё ещё поддерживается',
    ],
  },
  {
    id: 5,
    title: '5. Обновить Context',
    description: 'Используйте новый синтаксис провайдера и use()',
    tips: [
      '<Context.Provider> → <Context>',
      'useContext(Ctx) → use(Ctx) (опционально)',
      'use() можно вызывать условно',
    ],
  },
  {
    id: 6,
    title: '6. Мигрировать формы',
    description: 'Используйте form actions и новые хуки',
    tips: [
      'onSubmit + preventDefault → action={fn}',
      'Добавьте useActionState для состояния формы',
      'useFormStatus для pending-индикатора',
    ],
  },
  {
    id: 7,
    title: '7. Тесты и проверка',
    description: 'Запустите тесты и проверьте консоль на warnings',
    commands: 'npm test\nnpm run build',
    tips: ['React 19 удалил некоторые warnings', 'Проверьте StrictMode поведение', 'Тестируйте формы'],
  },
]

export function Task8_2_Solution() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const toggleStep = (id: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const progress = Math.round((completedSteps.size / migrationSteps.length) * 100)

  return (
    <div className="exercise-container">
      <h2>Решение 8.2: Пошаговая миграция</h2>

      <div
        style={{
          marginTop: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '8px',
            width: `${progress}%`,
            background: progress === 100 ? '#4caf50' : '#1976d2',
            transition: 'width 0.3s',
          }}
        />
      </div>
      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
        Прогресс: {completedSteps.size} / {migrationSteps.length} шагов ({progress}%)
      </p>

      {migrationSteps.map((step) => (
        <div
          key={step.id}
          style={{
            margin: '0.75rem 0',
            padding: '1rem',
            borderRadius: '8px',
            border: `1px solid ${completedSteps.has(step.id) ? '#4caf50' : '#ddd'}`,
            background: completedSteps.has(step.id) ? '#f1f8e9' : '#fff',
            transition: 'all 0.3s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              checked={completedSteps.has(step.id)}
              onChange={() => toggleStep(step.id)}
              style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
            />
            <div>
              <strong style={{ textDecoration: completedSteps.has(step.id) ? 'line-through' : 'none' }}>
                {step.title}
              </strong>
              <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>{step.description}</p>
            </div>
          </div>

          {step.commands && (
            <pre
              style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                background: '#263238',
                color: '#aed581',
                borderRadius: '4px',
                fontSize: '0.8rem',
                overflow: 'auto',
              }}
            >
              {step.commands}
            </pre>
          )}

          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', fontSize: '0.85rem', color: '#555' }}>
            {step.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      ))}

      {progress === 100 && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1.5rem',
            background: '#e8f5e9',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #4caf50',
          }}
        >
          <h3>🎉 Миграция завершена!</h3>
          <p>Ваше приложение готово к React 19</p>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 8.3 Solution: Финальный рефакторинг
// ============================================

// Демонстрация компонента, использующего ВСЕ возможности React 19

import { use, useOptimistic, useActionState, Suspense, createContext } from 'react'

const AppThemeContext = createContext<'light' | 'dark'>('light')

function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

const todosPromise = delay(
  [
    { id: 1, text: 'Обновить React до v19', done: true },
    { id: 2, text: 'Убрать forwardRef', done: true },
    { id: 3, text: 'Мигрировать формы на actions', done: false },
    { id: 4, text: 'Добавить useOptimistic', done: false },
  ],
  1000
)

function TodoItem({
  todo,
  onToggle,
}: {
  todo: { id: number; text: string; done: boolean; pending?: boolean }
  onToggle: (id: number) => void
}) {
  const theme = use(AppThemeContext)

  return (
    <li
      style={{
        padding: '0.75rem',
        margin: '0.25rem 0',
        background: theme === 'dark' ? '#424242' : '#f5f5f5',
        color: theme === 'dark' ? '#fff' : '#333',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: todo.pending ? 0.5 : 1,
        transition: 'all 0.2s',
      }}
    >
      <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
        {todo.done ? '✅' : '⬜'} {todo.text}
        {todo.pending && ' (сохранение...)'}
      </span>
      <button onClick={() => onToggle(todo.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
        {todo.done ? 'Отменить' : 'Готово'}
      </button>
    </li>
  )
}

function TodoList({ todosPromise: tp }: { todosPromise: Promise<{ id: number; text: string; done: boolean }[]> }) {
  const initialTodos = use(tp)
  const [todos, setTodos] = useState(initialTodos)
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, updatedTodo: { id: number; done: boolean }) =>
      state.map((t) => (t.id === updatedTodo.id ? { ...t, done: updatedTodo.done, pending: true } : t))
  )

  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    addOptimistic({ id, done: !todo.done })
    await delay(null, 800)
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {(optimisticTodos as Array<{ id: number; text: string; done: boolean; pending?: boolean }>).map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />
      ))}
    </ul>
  )
}

interface AddTodoState {
  error?: string
  success?: boolean
}

function AddTodoForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: AddTodoState, formData: FormData): Promise<AddTodoState> => {
      const text = formData.get('todo') as string
      if (!text.trim()) return { error: 'Введите текст задачи' }
      await delay(null, 500)
      onAdd(text)
      return { success: true }
    },
    {} as AddTodoState
  )

  return (
    <form action={formAction} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      <input
        name="todo"
        placeholder="Новая задача..."
        style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button type="submit" disabled={isPending} style={{ padding: '0.5rem 1rem' }}>
        {isPending ? 'Добавление...' : 'Добавить'}
      </button>
      {state.error && <span style={{ color: 'red', fontSize: '0.85rem', alignSelf: 'center' }}>{state.error}</span>}
    </form>
  )
}

export function Task8_3_Solution() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <div className="exercise-container">
      <h2>Решение 8.3: Финальный рефакторинг</h2>

      <p>Этот компонент использует все основные API React 19:</p>
      <ul style={{ fontSize: '0.85rem', color: '#666' }}>
        <li>
          <code>use(Context)</code> — чтение темы условно
        </li>
        <li>
          <code>use(Promise)</code> — загрузка данных с Suspense
        </li>
        <li>
          <code>useOptimistic</code> — мгновенное обновление UI
        </li>
        <li>
          <code>useActionState</code> — обработка формы
        </li>
        <li>
          <code>{'<title>'}</code> — метаданные в компоненте
        </li>
      </ul>

      <button
        onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        style={{ margin: '0.5rem 0', padding: '0.5rem 1rem' }}
      >
        Тема: {theme === 'light' ? 'Светлая' : 'Тёмная'}
      </button>

      <title>Миграция — React 19 Курс</title>

      <AppThemeContext value={theme}>
        <div
          style={{
            padding: '1rem',
            borderRadius: '8px',
            background: theme === 'dark' ? '#333' : '#fff',
            color: theme === 'dark' ? '#fff' : '#333',
            border: '1px solid #ddd',
            transition: 'all 0.3s',
          }}
        >
          <AddTodoForm onAdd={(text) => console.log('Add:', text)} />

          <Suspense fallback={<div style={{ padding: '1rem', textAlign: 'center' }}>⏳ Загрузка задач...</div>}>
            <TodoList todosPromise={todosPromise} />
          </Suspense>
        </div>
      </AppThemeContext>
    </div>
  )
}
