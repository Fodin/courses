import { useState, useActionState } from 'react'

// ============================================
// Задание 6.1: Серверные vs клиентские — Решение
// ============================================

interface ComponentCard {
  id: number
  name: string
  description: string
  code: string
  answer: 'server' | 'client'
  explanation: string
}

const COMPONENT_CARDS: ComponentCard[] = [
  {
    id: 1,
    name: 'ProductList',
    description: 'Компонент получает данные из БД и рендерит список товаров',
    code: `async function ProductList() {
  const products = await db.query('SELECT * FROM products')
  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  )
}`,
    answer: 'server',
    explanation: 'Прямой доступ к БД, async компонент, нет интерактивности — серверный',
  },
  {
    id: 2,
    name: 'SearchInput',
    description: 'Поле поиска с автодополнением и debounce',
    code: `function SearchInput() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => fetchResults(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  return <input value={query} onChange={e => setQuery(e.target.value)} />
}`,
    answer: 'client',
    explanation: 'useState, useEffect, onChange — всё это требует браузера — клиентский',
  },
  {
    id: 3,
    name: 'Footer',
    description: 'Статичный футер с ссылками и копирайтом',
    code: `function Footer() {
  return (
    <footer>
      <nav>
        <a href="/about">О нас</a>
        <a href="/contact">Контакты</a>
      </nav>
      <p>&copy; 2024 MyApp</p>
    </footer>
  )
}`,
    answer: 'server',
    explanation: 'Нет хуков, нет обработчиков событий, статический контент — серверный',
  },
  {
    id: 4,
    name: 'ThemeToggle',
    description: 'Кнопка переключения темы с localStorage',
    code: `function ThemeToggle() {
  const [dark, setDark] = useState(
    () => localStorage.getItem('theme') === 'dark'
  )

  const toggle = () => {
    setDark(d => !d)
    localStorage.setItem('theme', dark ? 'light' : 'dark')
  }

  return <button onClick={toggle}>{dark ? '☀️' : '🌙'}</button>
}`,
    answer: 'client',
    explanation: 'useState, localStorage, onClick — всё это браузерные API — клиентский',
  },
  {
    id: 5,
    name: 'UserProfile',
    description: 'Страница профиля, данные из API на сервере',
    code: `async function UserProfile({ userId }) {
  const user = await fetch(
    \`https://api.example.com/users/\${userId}\`
  ).then(r => r.json())

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  )
}`,
    answer: 'server',
    explanation: 'Async компонент, fetch данных на сервере, нет интерактивности — серверный',
  },
  {
    id: 6,
    name: 'ImageCarousel',
    description: 'Карусель изображений с жестами свайпа',
    code: `function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    // Touch event listeners for swipe
    const el = ref.current
    el?.addEventListener('touchstart', handleTouch)
    return () => el?.removeEventListener('touchstart', handleTouch)
  }, [])

  return <div ref={ref}>...</div>
}`,
    answer: 'client',
    explanation: 'useState, useRef, useEffect, touch events — клиентский',
  },
]

export function Task6_1_Solution() {
  const [answers, setAnswers] = useState<Record<number, 'server' | 'client'>>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (cardId: number, answer: 'server' | 'client') => {
    setAnswers(prev => ({ ...prev, [cardId]: answer }))
  }

  const allAnswered = Object.keys(answers).length === COMPONENT_CARDS.length
  const correctCount = COMPONENT_CARDS.filter(
    card => answers[card.id] === card.answer
  ).length

  return (
    <div className="exercise-container">
      <h2>Задание 6.1: Server vs Client Components</h2>
      <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
        Определите для каждого компонента: серверный он или клиентский?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {COMPONENT_CARDS.map(card => {
          const userAnswer = answers[card.id]
          const isCorrect = userAnswer === card.answer
          const showAnswer = showResults && userAnswer

          return (
            <div
              key={card.id}
              style={{
                padding: '1rem',
                border: `2px solid ${
                  showAnswer
                    ? isCorrect
                      ? '#28a745'
                      : '#dc3545'
                    : '#dee2e6'
                }`,
                borderRadius: '8px',
                background: showAnswer
                  ? isCorrect
                    ? '#d4edda'
                    : '#f8d7da'
                  : '#fff',
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem' }}>{card.name}</h3>
              <p style={{ color: '#6c757d', fontSize: '0.875rem' }}>{card.description}</p>
              <pre
                style={{
                  background: '#1e1e1e',
                  color: '#d4d4d4',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  overflow: 'auto',
                  maxHeight: '150px',
                }}
              >
                {card.code}
              </pre>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button
                  onClick={() => handleAnswer(card.id, 'server')}
                  style={{
                    padding: '0.5rem 1rem',
                    background: userAnswer === 'server' ? '#007bff' : '#e9ecef',
                    color: userAnswer === 'server' ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: userAnswer === 'server' ? 600 : 400,
                  }}
                >
                  Server
                </button>
                <button
                  onClick={() => handleAnswer(card.id, 'client')}
                  style={{
                    padding: '0.5rem 1rem',
                    background: userAnswer === 'client' ? '#007bff' : '#e9ecef',
                    color: userAnswer === 'client' ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: userAnswer === 'client' ? 600 : 400,
                  }}
                >
                  Client
                </button>
              </div>

              {showAnswer && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem',
                    fontSize: '0.875rem',
                    color: isCorrect ? '#155724' : '#721c24',
                  }}
                >
                  {isCorrect ? 'Правильно!' : `Неправильно. Ответ: ${card.answer}`}
                  {' — '}
                  {card.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={() => setShowResults(true)}
          disabled={!allAnswered}
          style={{
            padding: '0.75rem 1.5rem',
            background: allAnswered ? '#28a745' : '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: allAnswered ? 'pointer' : 'not-allowed',
            fontWeight: 600,
          }}
        >
          Проверить ответы
        </button>

        {showResults && (
          <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>
            Результат: {correctCount} / {COMPONENT_CARDS.length}
          </span>
        )}

        {showResults && (
          <button
            onClick={() => {
              setAnswers({})
              setShowResults(false)
            }}
            style={{
              padding: '0.5rem 1rem',
              background: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Начать заново
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================
// Задание 6.2: 'use client' директива — Решение
// ============================================

interface TreeNode {
  name: string
  isClient: boolean
  needsUseClient: boolean
  reason?: string
  children?: TreeNode[]
}

const COMPONENT_TREE: TreeNode = {
  name: 'RootLayout',
  isClient: false,
  needsUseClient: false,
  children: [
    {
      name: 'Header',
      isClient: false,
      needsUseClient: false,
      children: [
        {
          name: 'Logo',
          isClient: false,
          needsUseClient: false,
          reason: 'Статический компонент — серверный',
        },
        {
          name: 'NavMenu',
          isClient: true,
          needsUseClient: true,
          reason: 'useState для мобильного меню — нужен use client',
          children: [
            {
              name: 'NavLink',
              isClient: true,
              needsUseClient: false,
              reason: 'Наследует клиентскую границу от NavMenu',
            },
          ],
        },
        {
          name: 'ThemeSwitch',
          isClient: true,
          needsUseClient: true,
          reason: 'useState + localStorage — нужен use client',
        },
      ],
    },
    {
      name: 'MainContent',
      isClient: false,
      needsUseClient: false,
      children: [
        {
          name: 'ArticleBody',
          isClient: false,
          needsUseClient: false,
          reason: 'Рендер markdown — серверный',
        },
        {
          name: 'CommentSection',
          isClient: true,
          needsUseClient: true,
          reason: 'Форма с useState/onSubmit — нужен use client',
          children: [
            {
              name: 'CommentForm',
              isClient: true,
              needsUseClient: false,
              reason: 'Наследует клиентскую границу от CommentSection',
            },
            {
              name: 'CommentList',
              isClient: true,
              needsUseClient: false,
              reason: 'Наследует клиентскую границу от CommentSection',
            },
          ],
        },
        {
          name: 'Sidebar',
          isClient: false,
          needsUseClient: false,
          reason: 'Статические ссылки — серверный',
        },
      ],
    },
    {
      name: 'Footer',
      isClient: false,
      needsUseClient: false,
      reason: 'Статический контент — серверный',
    },
  ],
}

function TreeNodeView({
  node,
  depth = 0,
  showAnswer,
  selected,
  onToggle,
}: {
  node: TreeNode
  depth?: number
  showAnswer: boolean
  selected: Set<string>
  onToggle: (name: string) => void
}) {
  const isSelected = selected.has(node.name)
  const isCorrectlyMarked = showAnswer && node.needsUseClient === isSelected

  return (
    <div style={{ marginLeft: depth * 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.6rem',
          margin: '0.2rem 0',
          borderRadius: '4px',
          background: showAnswer
            ? isCorrectlyMarked
              ? '#d4edda'
              : '#f8d7da'
            : isSelected
              ? '#cce5ff'
              : '#f8f9fa',
          border: `1px solid ${
            showAnswer
              ? isCorrectlyMarked
                ? '#c3e6cb'
                : '#f5c6cb'
              : isSelected
                ? '#b8daff'
                : '#dee2e6'
          }`,
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
        onClick={() => onToggle(node.name)}
      >
        <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
          {node.isClient ? '(C)' : '(S)'}
        </span>
        <span style={{ fontWeight: 500 }}>{node.name}</span>
        {isSelected && (
          <span
            style={{
              fontSize: '0.7rem',
              background: '#007bff',
              color: '#fff',
              padding: '0.1rem 0.4rem',
              borderRadius: '3px',
            }}
          >
            &apos;use client&apos;
          </span>
        )}
        {showAnswer && node.reason && (
          <span style={{ fontSize: '0.75rem', color: '#6c757d', marginLeft: 'auto' }}>
            {node.reason}
          </span>
        )}
      </div>
      {node.children?.map(child => (
        <TreeNodeView
          key={child.name}
          node={child}
          depth={depth + 1}
          showAnswer={showAnswer}
          selected={selected}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}

function collectNeedsUseClient(node: TreeNode): string[] {
  const result: string[] = []
  if (node.needsUseClient) result.push(node.name)
  node.children?.forEach(child => result.push(...collectNeedsUseClient(child)))
  return result
}

export function Task6_2_Solution() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showAnswer, setShowAnswer] = useState(false)

  const handleToggle = (name: string) => {
    if (showAnswer) return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const correctNames = collectNeedsUseClient(COMPONENT_TREE)
  const correctSet = new Set(correctNames)
  const score =
    correctNames.filter(n => selected.has(n)).length -
    [...selected].filter(n => !correctSet.has(n)).length

  return (
    <div className="exercise-container">
      <h2>Задание 6.2: Расстановка &apos;use client&apos;</h2>
      <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
        Кликните на компоненты, которым нужна директива <code>&apos;use client&apos;</code>.
        Помните: дочерние компоненты наследуют клиентскую границу.
      </p>

      <div
        style={{
          padding: '1rem',
          background: '#fff',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
        }}
      >
        <TreeNodeView
          node={COMPONENT_TREE}
          showAnswer={showAnswer}
          selected={selected}
          onToggle={handleToggle}
        />
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button
          onClick={() => setShowAnswer(true)}
          style={{
            padding: '0.5rem 1rem',
            background: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Показать ответы
        </button>
        <button
          onClick={() => {
            setSelected(new Set())
            setShowAnswer(false)
          }}
          style={{
            padding: '0.5rem 1rem',
            background: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Сбросить
        </button>
        {showAnswer && (
          <span style={{ fontWeight: 600 }}>
            Счёт: {Math.max(0, score)} / {correctNames.length}
          </span>
        )}
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#e2e3e5',
          borderRadius: '4px',
          fontSize: '0.85rem',
        }}
      >
        <strong>Правило:</strong> Ставьте <code>&apos;use client&apos;</code> только на компоненты,
        которые непосредственно используют хуки или браузерные API. Дочерние компоненты автоматически
        становятся клиентскими.
      </div>
    </div>
  )
}

// ============================================
// Задание 6.3: Server Actions — Решение
// ============================================

interface FormResult {
  success: boolean
  message: string
  data?: { name: string; email: string; message: string }
}

// Симуляция серверной функции (в реальном RSC это было бы 'use server')
async function mockServerAction(
  _prevState: FormResult | null,
  formData: FormData
): Promise<FormResult> {
  // Имитация задержки сервера
  await new Promise(resolve => setTimeout(resolve, 1000))

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  // Имитация серверной валидации
  if (!name || name.length < 2) {
    return { success: false, message: 'Имя должно содержать минимум 2 символа' }
  }
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Введите корректный email' }
  }
  if (!message || message.length < 10) {
    return { success: false, message: 'Сообщение должно содержать минимум 10 символов' }
  }

  return {
    success: true,
    message: 'Форма успешно отправлена на сервер!',
    data: { name, email, message },
  }
}

export function Task6_3_Solution() {
  const [state, formAction, isPending] = useActionState(mockServerAction, null)

  return (
    <div className="exercise-container">
      <h2>Задание 6.3: Server Actions (симуляция)</h2>
      <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
        Форма использует паттерн Server Action: <code>{'<form action={fn}>'}</code>.
        В реальном RSC-фреймворке функция выполняется на сервере.
      </p>

      <form action={formAction} style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label htmlFor="sa-name">Имя</label>
          <input
            id="sa-name"
            name="name"
            type="text"
            placeholder="Ваше имя"
            disabled={isPending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="sa-email">Email</label>
          <input
            id="sa-email"
            name="email"
            type="email"
            placeholder="your@email.com"
            disabled={isPending}
          />
        </div>

        <div className="form-group">
          <label htmlFor="sa-message">Сообщение</label>
          <textarea
            id="sa-message"
            name="message"
            rows={4}
            placeholder="Ваше сообщение (минимум 10 символов)..."
            disabled={isPending}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ced4da' }}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '0.75rem 1.5rem',
            background: isPending ? '#6c757d' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isPending ? 'wait' : 'pointer',
            fontWeight: 600,
          }}
        >
          {isPending ? 'Отправка...' : 'Отправить на сервер'}
        </button>

        {state && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: state.success ? '#d4edda' : '#f8d7da',
              color: state.success ? '#155724' : '#721c24',
              borderRadius: '8px',
              border: `1px solid ${state.success ? '#c3e6cb' : '#f5c6cb'}`,
            }}
          >
            <strong>{state.success ? 'Успех!' : 'Ошибка:'}</strong> {state.message}
            {state.data && (
              <pre style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                {JSON.stringify(state.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </form>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffc107',
          fontSize: '0.85rem',
        }}
      >
        <strong>Как это работает в RSC-фреймворке:</strong>
        <pre
          style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            padding: '0.75rem',
            borderRadius: '4px',
            marginTop: '0.5rem',
            fontSize: '0.8rem',
          }}
        >
{`// На сервере (server action):
'use server'
async function submitForm(prevState, formData) {
  const name = formData.get('name')
  await db.insert({ name, ... })
  return { success: true }
}

// На клиенте:
'use client'
function ContactForm() {
  const [state, action, pending] = useActionState(submitForm, null)
  return <form action={action}>...</form>
}`}
        </pre>
      </div>
    </div>
  )
}
