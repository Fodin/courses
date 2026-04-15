import { useState, useMemo } from 'react'

// ─── Shared styles ────────────────────────────────────────────────────────────

const s = {
  container: {
    fontFamily: 'system-ui, sans-serif',
    padding: '20px',
    maxWidth: 960,
    margin: '0 auto',
  } as React.CSSProperties,

  h2: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16,
    color: '#1e293b',
  } as React.CSSProperties,

  btn: (active?: boolean, color?: string): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: 8,
    border: `1px solid ${active ? (color ?? '#3b82f6') : '#e2e8f0'}`,
    background: active ? (color ?? '#3b82f6') : '#fff',
    color: active ? '#fff' : '#374151',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    transition: 'all 0.15s',
  }),
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 14.1 — Full Lifecycle Diagram
// ═══════════════════════════════════════════════════════════════════════════════

interface BlockInfo {
  title: string
  text: string
  phase?: 'trigger' | 'schedule' | 'render' | 'commit' | 'effect'
}

const LIFECYCLE_BLOCKS: Record<string, BlockInfo> = {
  setState: {
    title: 'setState / dispatch',
    phase: 'trigger',
    text: 'Вызов setState создаёт объект Update и добавляет его в circular linked list очереди хука. Затем вызывается scheduleUpdateOnFiber — корень помечается как нуждающийся в обновлении.',
  },
  dispatchSetState: {
    title: 'dispatchSetState',
    phase: 'trigger',
    text: 'Внутренняя функция React (ReactFiberHooks.js). Вычисляет eager state: если Object.is(current, new) — рендер не запускается. Иначе вызывает scheduleUpdateOnFiber.',
  },
  scheduler: {
    title: 'Scheduler',
    phase: 'schedule',
    text: 'Отдельный пакет React. Принимает обновления, назначает приоритеты (Lanes). Использует MessageChannel для планирования — работа запускается в следующей макрозадаче, позволяя браузеру обработать события между рендерами.',
  },
  workLoop: {
    title: 'Work Loop',
    phase: 'render',
    text: 'workLoopConcurrent обходит Fiber-дерево в цикле (не рекурсии). На каждой итерации вызывает performUnitOfWork. Если shouldYield() = true — цикл прерывается, управление возвращается браузеру.',
  },
  beginWork: {
    title: 'beginWork',
    phase: 'render',
    text: 'Для каждого Fiber-узла: вызывает функцию компонента (renderWithHooks), запускает хуки, возвращает child-файберы. Если props и context не изменились — bailout (пропуск).',
  },
  reconciliation: {
    title: 'Reconciliation',
    phase: 'render',
    text: 'Сравнивает текущее дерево с новым JSX. O(n) алгоритм: совпадение по type+key → обновить Fiber, несовпадение → пересоздать. Для списков: фаза 1 (линейная) + фаза 2 (Map по ключам).',
  },
  completeWork: {
    title: 'completeWork',
    phase: 'render',
    text: 'Создаёт реальные DOM-узлы (для HostComponent), собирает effectList. bubbleProperties поднимает subtreeFlags от детей к родителю — Commit может пропустить поддерево без флагов.',
  },
  beforeMutation: {
    title: 'Before Mutation',
    phase: 'commit',
    text: 'Первая подфаза Commit. getSnapshotBeforeUpdate для классовых компонентов. Cleanup useLayoutEffect (DOM ещё старый). Синхронная, не прерываемая.',
  },
  mutation: {
    title: 'Mutation',
    phase: 'commit',
    text: 'DOM изменяется здесь: insertBefore, appendChild, removeChild. После этой подфазы — root.current = finishedWork (flip). Старое дерево станет workInProgress для следующего рендера.',
  },
  layout: {
    title: 'Layout',
    phase: 'commit',
    text: 'useLayoutEffect setup вызывается здесь — DOM уже обновлён, браузер ещё не перерисовал. componentDidMount/Update для классовых компонентов. Блокирует visual update!',
  },
  domUpdate: {
    title: 'DOM Update',
    phase: 'effect',
    text: 'Браузер получает обновлённый DOM и перерисовывает страницу (paint). Пользователь видит изменения. Происходит между Layout и Passive эффектами.',
  },
  passive: {
    title: 'Passive Effects (useEffect)',
    phase: 'effect',
    text: 'useEffect cleanup → useEffect setup. Выполняется асинхронно после paint браузера. Не блокирует визуальное обновление. Именно поэтому useEffect не подходит для измерения DOM.',
  },
}

const PHASE_COLORS: Record<string, string> = {
  trigger: '#7c3aed',
  schedule: '#0284c7',
  render: '#059669',
  commit: '#d97706',
  effect: '#db2777',
}

const PHASE_LABELS: Record<string, string> = {
  trigger: 'Триггер',
  schedule: 'Планировщик',
  render: 'Render Phase',
  commit: 'Commit Phase',
  effect: 'Effects',
}

function LifecycleBlock({
  id,
  label,
  active,
  onClick,
  compact,
}: {
  id: string
  label: string
  active: boolean
  onClick: (id: string) => void
  compact?: boolean
}) {
  const info = LIFECYCLE_BLOCKS[id]
  const color = PHASE_COLORS[info.phase ?? 'render']

  return (
    <div
      onClick={() => onClick(id)}
      style={{
        padding: compact ? '6px 12px' : '10px 16px',
        borderRadius: 8,
        border: `2px solid ${active ? color : '#e2e8f0'}`,
        background: active ? color : '#fff',
        color: active ? '#fff' : '#1e293b',
        cursor: 'pointer',
        fontSize: compact ? 12 : 13,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        transition: 'all 0.2s',
        boxShadow: active ? `0 0 0 3px ${color}33` : 'none',
        userSelect: 'none',
      }}
    >
      {label}
    </div>
  )
}

function Arrow() {
  return (
    <span style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1, userSelect: 'none' }}>→</span>
  )
}

export function Task14_1_Solution() {
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleClick = (id: string) => {
    setActiveId(prev => (prev === id ? null : id))
  }

  const info = activeId ? LIFECYCLE_BLOCKS[activeId] : null
  const phaseColor = info ? PHASE_COLORS[info.phase ?? 'render'] : '#3b82f6'

  return (
    <div className="exercise-container" style={s.container}>
      <h2 style={s.h2}>Задание 14.1 — Full Lifecycle Diagram</h2>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        {Object.entries(PHASE_LABELS).map(([phase, label]) => (
          <div key={phase} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: PHASE_COLORS[phase],
              }}
            />
            <span style={{ color: '#6b7280' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Main flow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 16,
        }}
      >
        <LifecycleBlock
          id="setState"
          label="setState"
          active={activeId === 'setState'}
          onClick={handleClick}
        />
        <Arrow />
        <LifecycleBlock
          id="dispatchSetState"
          label="dispatchSetState"
          active={activeId === 'dispatchSetState'}
          onClick={handleClick}
        />
        <Arrow />
        <LifecycleBlock
          id="scheduler"
          label="Scheduler"
          active={activeId === 'scheduler'}
          onClick={handleClick}
        />
        <Arrow />
        <LifecycleBlock
          id="workLoop"
          label="Work Loop"
          active={activeId === 'workLoop'}
          onClick={handleClick}
        />
        <Arrow />
        <LifecycleBlock
          id="beginWork"
          label="beginWork"
          active={activeId === 'beginWork'}
          onClick={handleClick}
        />
        <Arrow />
        <LifecycleBlock
          id="reconciliation"
          label="Reconciliation"
          active={activeId === 'reconciliation'}
          onClick={handleClick}
        />
        <Arrow />
        <LifecycleBlock
          id="completeWork"
          label="completeWork"
          active={activeId === 'completeWork'}
          onClick={handleClick}
        />
      </div>

      {/* Commit phase group */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            border: '2px dashed #d97706',
            borderRadius: 12,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#d97706',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginRight: 4,
            }}
          >
            Commit Phase
          </span>
          <LifecycleBlock
            id="beforeMutation"
            label="Before Mutation"
            active={activeId === 'beforeMutation'}
            onClick={handleClick}
            compact
          />
          <Arrow />
          <LifecycleBlock
            id="mutation"
            label="Mutation"
            active={activeId === 'mutation'}
            onClick={handleClick}
            compact
          />
          <Arrow />
          <LifecycleBlock
            id="layout"
            label="Layout"
            active={activeId === 'layout'}
            onClick={handleClick}
            compact
          />
        </div>
        <Arrow />
        <LifecycleBlock
          id="domUpdate"
          label="DOM Update"
          active={activeId === 'domUpdate'}
          onClick={handleClick}
        />
        <Arrow />
        <LifecycleBlock
          id="passive"
          label="useEffect"
          active={activeId === 'passive'}
          onClick={handleClick}
        />
      </div>

      {/* Info panel */}
      {info && (
        <div
          style={{
            borderRadius: 12,
            border: `2px solid ${phaseColor}`,
            background: `${phaseColor}11`,
            padding: 20,
            marginTop: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 8,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: phaseColor,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {PHASE_LABELS[info.phase ?? 'render']}
              </span>
              <h3 style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
                {info.title}
              </h3>
            </div>
            <button
              onClick={() => setActiveId(null)}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 18,
                color: '#94a3b8',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#374151' }}>{info.text}</p>
        </div>
      )}

      {!info && (
        <div
          style={{
            padding: 16,
            borderRadius: 10,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            color: '#94a3b8',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          Кликните на любой блок, чтобы узнать подробности этого этапа
        </div>
      )}

      {activeId && (
        <button
          onClick={() => setActiveId(null)}
          style={{ ...s.btn(), marginTop: 12 }}
        >
          Сбросить
        </button>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 14.2 — Architecture Decision Tree
// ═══════════════════════════════════════════════════════════════════════════════

interface TreeLeaf {
  type: 'leaf'
  id: string
  label: string
  solution: string
  explanation: string
  code: string
}

interface TreeNode {
  type: 'node'
  id: string
  question: string
  options: Array<{
    label: string
    child: TreeNode | TreeLeaf
  }>
}

type TreeItem = TreeNode | TreeLeaf

const DECISION_TREE: TreeNode = {
  type: 'node',
  id: 'root',
  question: 'Мне нужно...',
  options: [
    {
      label: 'вычислить значение из props/state',
      child: {
        type: 'node',
        id: 'compute',
        question: 'Насколько тяжёлое вычисление?',
        options: [
          {
            label: 'лёгкое (< 1ms) — строка, фильтр небольшого массива',
            child: {
              type: 'leaf',
              id: 'computed-render',
              label: 'Computed during render',
              solution: 'const x = compute(data)',
              explanation:
                'Вычисляйте прямо в теле компонента. React рендеры быстрые. useMemo добавляет накладные расходы — его стоит применять только при реальной проблеме производительности.',
              code: '// Прямо в теле компонента\nconst fullName = `${firstName} ${lastName}`\nconst activeItems = items.filter(i => i.active)\nconst total = cart.reduce((sum, i) => sum + i.price, 0)',
            },
          },
          {
            label: 'тяжёлое (> 1ms) — сортировка, поиск в большом массиве',
            child: {
              type: 'leaf',
              id: 'usememo',
              label: 'useMemo',
              solution: 'useMemo(() => expensive(), [deps])',
              explanation:
                'Кэширует результат вычисления между рендерами. Пересчёт только при изменении зависимостей. Сначала убедитесь что проблема реальна через Profiler.',
              code: 'const sorted = useMemo(\n  () => [...bigList].sort(compareFn),\n  [bigList]\n)',
            },
          },
        ],
      },
    },
    {
      label: 'синхронизировать с внешним store или API браузера',
      child: {
        type: 'node',
        id: 'external',
        question: 'Что именно нужно синхронизировать?',
        options: [
          {
            label: 'внешний store (Zustand, Redux, кастомный)',
            child: {
              type: 'leaf',
              id: 'useSES-store',
              label: 'useSyncExternalStore',
              solution: 'useSyncExternalStore(subscribe, getSnapshot)',
              explanation:
                'Единственный безопасный способ подписаться на внешний store в Concurrent Mode. Защищает от tearing — несогласованности UI при параллельных рендерах.',
              code: 'const value = useSyncExternalStore(\n  store.subscribe,\n  store.getSnapshot,\n  store.getServerSnapshot,\n)',
            },
          },
          {
            label: 'browser API (navigator.onLine, matchMedia, innerWidth)',
            child: {
              type: 'leaf',
              id: 'useSES-browser',
              label: 'useSyncExternalStore (browser API)',
              solution: 'useSyncExternalStore(subscribe, getSnapshot)',
              explanation:
                'Тот же хук, но getSnapshot читает значение из browser API. Subscribe — addEventListener. Не используйте useEffect+useState для подобных подписок.',
              code: 'const isOnline = useSyncExternalStore(\n  (cb) => {\n    window.addEventListener("online", cb)\n    window.addEventListener("offline", cb)\n    return () => {\n      window.removeEventListener("online", cb)\n      window.removeEventListener("offline", cb)\n    }\n  },\n  () => navigator.onLine,\n  () => true,\n)',
            },
          },
        ],
      },
    },
    {
      label: 'реагировать на действие пользователя',
      child: {
        type: 'node',
        id: 'action',
        question: 'Нужна плавность без заморозки UI?',
        options: [
          {
            label: 'нет — простое обновление (форма, счётчик)',
            child: {
              type: 'leaf',
              id: 'event-handler',
              label: 'Event handler',
              solution: 'onClick={() => doSomething()}',
              explanation:
                'Обычный обработчик события. Вся логика прямо в нём. Не нужен useEffect для ответа на действие пользователя — это самый частый YMNAE антипаттерн.',
              code: 'function Form() {\n  const [value, setValue] = useState("")\n\n  const handleSubmit = () => {\n    sendData(value)      // ← прямо здесь\n    sendAnalytics(value) // ← и аналитика тоже\n    setValue("")\n  }\n\n  return <button onClick={handleSubmit}>Отправить</button>\n}',
            },
          },
          {
            label: 'да — тяжёлый рендер (поиск, фильтрация 10k+ элементов)',
            child: {
              type: 'leaf',
              id: 'transition',
              label: 'useTransition',
              solution: 'startTransition(() => setFilter(v))',
              explanation:
                'Переводит обновление в TransitionLane — Scheduler может прервать рендер при новом вводе. UI остаётся отзывчивым. isPending показывает что идёт фоновый рендер.',
              code: 'const [isPending, startTransition] = useTransition()\n\nconst handleChange = (e) => {\n  const v = e.target.value\n  // мгновенно:\n  setInputValue(v)\n  // может прерываться:\n  startTransition(() => {\n    setFilter(v)\n  })\n}',
            },
          },
        ],
      },
    },
    {
      label: 'предотвратить лишние ре-рендеры',
      child: {
        type: 'node',
        id: 'memo',
        question: 'Что именно ре-рендерится лишний раз?',
        options: [
          {
            label: 'дочерний компонент (получает стабильные props)',
            child: {
              type: 'leaf',
              id: 'react-memo',
              label: 'React.memo',
              solution: 'export default React.memo(Child)',
              explanation:
                'Оборачивает компонент: если props не изменились (Object.is сравнение) — рендер пропускается. Требует стабильных props: функции через useCallback, объекты через useMemo.',
              code: 'const Child = React.memo(({ onClick, style }) => {\n  return <div style={style} onClick={onClick}>...</div>\n})\n\n// В родителе:\nconst handleClick = useCallback(() => {}, []) // стабильная\nconst style = useMemo(() => ({ color }), [color]) // стабильная\n<Child onClick={handleClick} style={style} />',
            },
          },
          {
            label: 'компоненты из-за изменений Context',
            child: {
              type: 'leaf',
              id: 'context-split',
              label: 'Context Splitting',
              solution: 'Разделить Context по частоте изменений',
              explanation:
                'Один большой Context → ре-рендер всех подписчиков при любом изменении. Разделите по частоте: UserContext (редко), ThemeContext (иногда), SearchContext (часто).',
              code: '// Вместо одного AppContext:\nconst UserContext = createContext(defaultUser)\nconst ThemeContext = createContext("light")\nconst SearchContext = createContext(defaultSearch)\n\n// Объектные значения — мемоизировать!\nconst searchValue = useMemo(\n  () => ({ query, setQuery }),\n  [query]\n)',
            },
          },
          {
            label: 'state поднят выше чем нужно',
            child: {
              type: 'leaf',
              id: 'colocation',
              label: 'State Colocation',
              solution: 'Перенести state туда где он используется',
              explanation:
                'Если state нужен только в одном поддереве — перенесите его туда. Ре-рендер не пойдёт выше. Паттерн "children as props" помогает изолировать часто меняющийся state.',
              code: '// До: state в корне → всё ре-рендерится\nfunction Page() {\n  const [search, setSearch] = useState("")\n  return <><ArticleContent /><Search q={search} onChange={setSearch} /></>\n}\n\n// После: state внутри → только Search и его дети\nfunction Page() {\n  return <><ArticleContent /><Search /></>\n}\nfunction Search() {\n  const [search, setSearch] = useState("")\n  // ...\n}',
            },
          },
        ],
      },
    },
    {
      label: 'работать с DOM напрямую',
      child: {
        type: 'node',
        id: 'dom',
        question: 'Когда нужен доступ к DOM?',
        options: [
          {
            label: 'до отрисовки браузера (измерить, скорректировать позицию)',
            child: {
              type: 'leaf',
              id: 'layout-effect',
              label: 'useLayoutEffect',
              solution: 'useLayoutEffect(() => { measure(ref.current) }, [])',
              explanation:
                'Выполняется синхронно после Mutation и до paint браузера. Используйте для измерений DOM и синхронных обновлений (tooltip позиция, scroll restore). Блокирует paint!',
              code: 'function Tooltip({ target }) {\n  const ref = useRef(null)\n  const [pos, setPos] = useState({ top: 0 })\n\n  useLayoutEffect(() => {\n    const rect = target.getBoundingClientRect()\n    setPos({ top: rect.bottom }) // до paint\n  }, [target])\n\n  return <div ref={ref} style={pos}>...</div>\n}',
            },
          },
          {
            label: 'после отрисовки (подписка, аналитика, третьи библиотеки)',
            child: {
              type: 'leaf',
              id: 'use-effect',
              label: 'useEffect',
              solution: 'useEffect(() => { setup(); return cleanup }, [deps])',
              explanation:
                'Выполняется асинхронно после paint. Не блокирует визуальное обновление. Обязательно возвращайте функцию cleanup для отписки.',
              code: 'useEffect(() => {\n  const controller = new AbortController()\n\n  fetch("/api/data", { signal: controller.signal })\n    .then(r => r.json())\n    .then(setData)\n\n  return () => controller.abort()\n}, [id])',
            },
          },
        ],
      },
    },
    {
      label: 'сбросить state компонента при смене entity',
      child: {
        type: 'leaf',
        id: 'key-reset',
        label: 'key prop для сброса',
        solution: '<Component key={entityId} />',
        explanation:
          'Когда key меняется — React пересоздаёт компонент с нуля. Весь state сбрасывается. Это быстрее и понятнее чем useEffect(() => { setState(initial) }, [id]).',
        code: '// Вместо:\nuseEffect(() => {\n  setComment("")\n  setDraft(null)\n}, [postId])\n\n// Просто:\n<CommentEditor key={postId} postId={postId} />',
      },
    },
  ],
}

interface BreadcrumbItem {
  label: string
  pathIndex: number
}

function findPath(
  node: TreeItem,
  chosenPath: number[],
  depth: number,
): { current: TreeItem; breadcrumbs: BreadcrumbItem[] } {
  let current: TreeItem = node
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Начало', pathIndex: -1 }]

  for (let i = 0; i < depth && i < chosenPath.length; i++) {
    if (current.type !== 'node') break
    const optionIndex = chosenPath[i]
    const option = current.options[optionIndex]
    if (!option) break
    breadcrumbs.push({ label: option.label, pathIndex: i })
    current = option.child
  }

  return { current, breadcrumbs }
}

export function Task14_2_Solution() {
  const [chosenPath, setChosenPath] = useState<number[]>([])

  const depth = chosenPath.length
  const { current, breadcrumbs } = findPath(DECISION_TREE, chosenPath, depth)

  const choose = (optionIndex: number) => {
    setChosenPath(prev => [...prev, optionIndex])
  }

  const goBack = () => {
    setChosenPath(prev => prev.slice(0, -1))
  }

  const reset = () => setChosenPath([])

  return (
    <div className="exercise-container" style={s.container}>
      <h2 style={s.h2}>Задание 14.2 — Architecture Decision Tree</h2>

      {/* Breadcrumbs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
          marginBottom: 20,
          fontSize: 12,
          color: '#6b7280',
        }}
      >
        {breadcrumbs.map((crumb, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <span>›</span>}
            <span
              style={{
                color: i === breadcrumbs.length - 1 ? '#1e293b' : '#3b82f6',
                fontWeight: i === breadcrumbs.length - 1 ? 600 : 400,
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={crumb.label}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </div>

      {/* Node: question with options */}
      {current.type === 'node' && (
        <div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>
            {current.question}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {current.options.map((option, i) => (
              <button
                key={i}
                onClick={() => choose(i)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '2px solid #e2e8f0',
                  background: '#fff',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: 14,
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#3b82f6'
                  e.currentTarget.style.background = '#eff6ff'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e2e8f0'
                  e.currentTarget.style.background = '#fff'
                }}
              >
                <span>{option.label}</span>
                <span style={{ color: '#94a3b8' }}>→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Leaf: solution */}
      {current.type === 'leaf' && (
        <div
          style={{
            borderRadius: 12,
            border: '2px solid #10b981',
            background: '#f0fdf4',
            padding: 24,
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#059669',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Решение
            </span>
            <h3 style={{ margin: '4px 0', fontSize: 20, fontWeight: 700, color: '#1e293b' }}>
              {current.solution}
            </h3>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#374151', marginBottom: 16 }}>
            {current.explanation}
          </p>
          <pre
            style={{
              background: '#1e293b',
              color: '#e2e8f0',
              borderRadius: 8,
              padding: 16,
              fontSize: 13,
              lineHeight: 1.6,
              overflow: 'auto',
              margin: 0,
            }}
          >
            {current.code}
          </pre>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        {depth > 0 && (
          <button onClick={goBack} style={s.btn()}>
            ← Назад
          </button>
        )}
        {depth > 0 && (
          <button onClick={reset} style={s.btn()}>
            Начать заново
          </button>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 14.3 — React Source Code Navigator
// ═══════════════════════════════════════════════════════════════════════════════

interface Concept {
  id: string
  name: string
  levelRange: '01-05' | '06-10' | '11-14'
  levelLabel: string
  file: string
  githubPath: string
  keyFunctions: Array<{ name: string; description: string }>
  description: string
  emoji: string
}

const CONCEPTS: Concept[] = [
  {
    id: 'fiber-node',
    name: 'Fiber Node',
    levelRange: '01-05',
    levelLabel: 'Уровень 01',
    file: 'react-reconciler/src/ReactFiber.js',
    githubPath: 'packages/react-reconciler/src/ReactFiber.js',
    emoji: '🌳',
    description:
      'Fiber — внутреннее представление компонента. Linked list с полями child, sibling, return. Каждый компонент, каждый DOM-элемент — отдельный Fiber-узел.',
    keyFunctions: [
      { name: 'createFiber()', description: 'Создаёт новый Fiber-узел с нуля' },
      { name: 'createWorkInProgress()', description: 'Клонирует current → workInProgress (double buffering)' },
      { name: 'FiberNode constructor', description: 'Определяет структуру: tag, key, type, stateNode, child, sibling, return, alternate' },
      { name: 'createFiberFromTypeAndProps()', description: 'Создаёт Fiber по типу (функция/класс/строка)' },
    ],
  },
  {
    id: 'work-loop',
    name: 'Work Loop',
    levelRange: '01-05',
    levelLabel: 'Уровень 02',
    file: 'react-reconciler/src/ReactFiberWorkLoop.js',
    githubPath: 'packages/react-reconciler/src/ReactFiberWorkLoop.js',
    emoji: '🔄',
    description:
      'Сердце React. Итеративный обход Fiber-дерева вместо рекурсии. workLoopConcurrent проверяет shouldYield() на каждой итерации — работа может быть прервана.',
    keyFunctions: [
      { name: 'workLoopConcurrent()', description: 'while (workInProgress && !shouldYield()) — основной цикл' },
      { name: 'performUnitOfWork()', description: 'Один шаг: beginWork → completeUnitOfWork' },
      { name: 'renderRootConcurrent()', description: 'Запускает render phase, обрабатывает Suspense' },
      { name: 'commitRoot()', description: 'Запускает три подфазы commit (sync, no interruption)' },
      { name: 'scheduleUpdateOnFiber()', description: 'Точка входа от setState — запускает всю машину' },
    ],
  },
  {
    id: 'reconciliation',
    name: 'Reconciliation',
    levelRange: '01-05',
    levelLabel: 'Уровень 03',
    file: 'react-reconciler/src/ReactChildFiber.js',
    githubPath: 'packages/react-reconciler/src/ReactChildFiber.js',
    emoji: '🔍',
    description:
      'O(n) алгоритм сравнения children. Два прохода для списков: линейный (по key/type) и Map-based (для перемещённых элементов). Ставит флаги Placement/Update/Deletion.',
    keyFunctions: [
      { name: 'reconcileChildFibers()', description: 'Точка входа — выбирает алгоритм по типу children' },
      { name: 'reconcileChildrenArray()', description: 'Два прохода для массивов — фаза 1 linear, фаза 2 Map' },
      { name: 'reconcileSingleElement()', description: 'Обновление одного дочернего элемента' },
      { name: 'mapRemainingChildren()', description: 'Строит Map<key|index, Fiber> для фазы 2' },
      { name: 'placeChild()', description: 'Ставит флаг Placement если нужна вставка' },
    ],
  },
  {
    id: 'hooks',
    name: 'Hooks Dispatcher',
    levelRange: '01-05',
    levelLabel: 'Уровень 04',
    file: 'react-reconciler/src/ReactFiberHooks.js',
    githubPath: 'packages/react-reconciler/src/ReactFiberHooks.js',
    emoji: '🪝',
    description:
      'Хуки — linked list в fiber.memoizedState. Два dispatcher: HooksDispatcherOnMount и HooksDispatcherOnUpdate. Переключение через ReactCurrentDispatcher.current.',
    keyFunctions: [
      { name: 'mountState() / updateState()', description: 'Реализация useState на mount и update' },
      { name: 'mountMemo() / updateMemo()', description: 'Реализация useMemo — хранит [value, deps]' },
      { name: 'mountEffect() / updateEffect()', description: 'Создаёт Effect object с create/destroy/deps' },
      { name: 'renderWithHooks()', description: 'Вызывает функцию компонента с правильным dispatcher' },
      { name: 'dispatchSetState()', description: 'Внутренняя функция setState — создаёт Update, планирует рендер' },
    ],
  },
  {
    id: 'commit',
    name: 'Effects & Commit',
    levelRange: '01-05',
    levelLabel: 'Уровень 05',
    file: 'react-reconciler/src/ReactFiberCommitWork.js',
    githubPath: 'packages/react-reconciler/src/ReactFiberCommitWork.js',
    emoji: '✅',
    description:
      'Commit — синхронная финальная фаза. Три подфазы: Before Mutation, Mutation (DOM изменяется), Layout (useLayoutEffect). Passive Effects (useEffect) — асинхронно после paint.',
    keyFunctions: [
      { name: 'commitMutationEffects()', description: 'DOM операции: insertBefore, appendChild, removeChild' },
      { name: 'commitLayoutEffects()', description: 'Запускает useLayoutEffect, componentDidMount' },
      { name: 'commitPassiveEffects()', description: 'Запускает useEffect cleanup → useEffect setup' },
      { name: 'commitHookEffectListMount()', description: 'Обходит linked list Effect-объектов для mount' },
      { name: 'commitHookEffectListUnmount()', description: 'Cleanup эффектов (destroy функции)' },
    ],
  },
  {
    id: 'scheduler',
    name: 'Scheduler',
    levelRange: '01-05',
    levelLabel: 'Уровень 02',
    file: 'scheduler/src/forks/Scheduler.js',
    githubPath: 'packages/scheduler/src/forks/Scheduler.js',
    emoji: '⏱',
    description:
      'Независимый пакет, не знает о React. Min-heap задач, MessageChannel для планирования. shouldYield() проверяет deadline — 5ms frame budget.',
    keyFunctions: [
      { name: 'scheduleCallback()', description: 'Добавить задачу с приоритетом в min-heap' },
      { name: 'shouldYield()', description: 'performance.now() > deadline → true (надо прерваться)' },
      { name: 'performWorkUntilDeadline()', description: 'onmessage handler MessageChannel — основной тик' },
      { name: 'flushWork()', description: 'Выполняет задачи из кучи до deadline' },
      { name: 'peek() / pop() / push()', description: 'Операции с min-heap (taskQueue)' },
    ],
  },
  {
    id: 'lanes',
    name: 'Lanes (приоритеты)',
    levelRange: '01-05',
    levelLabel: 'Уровень 02',
    file: 'react-reconciler/src/ReactFiberLane.js',
    githubPath: 'packages/react-reconciler/src/ReactFiberLane.js',
    emoji: '🏎',
    description:
      'Система приоритетов на битовых масках. SyncLane (1) — наивысший, IdleLane — наинизший. Позволяет объединять несколько Lane через OR и быстро проверять пересечения через AND.',
    keyFunctions: [
      { name: 'SyncLane / DefaultLane / TransitionLane / IdleLane', description: 'Константы приоритетов (битовые маски)' },
      { name: 'getHighestPriorityLane()', description: 'Берёт Lane с наименьшим числовым значением' },
      { name: 'mergeLanes()', description: 'Объединяет Lanes через OR' },
      { name: 'isSubsetOfLanes()', description: 'Проверяет включение через AND' },
      { name: 'requestUpdateLane()', description: 'Определяет Lane для нового обновления по контексту' },
    ],
  },
  {
    id: 'suspense',
    name: 'Suspense & Concurrent',
    levelRange: '06-10',
    levelLabel: 'Уровень 10',
    file: 'react-reconciler/src/ReactFiberThrow.js',
    githubPath: 'packages/react-reconciler/src/ReactFiberThrow.js',
    emoji: '⏸',
    description:
      'Suspense работает через throw Promise. throwException перехватывает Promise, находит ближайший SuspenseComponent, сохраняет Promise в dehydratedFragment.',
    keyFunctions: [
      { name: 'throwException()', description: 'Перехватывает thrown value (Promise или Error)' },
      { name: 'getSuspenseHandler()', description: 'Находит ближайший Suspense boundary' },
      { name: 'attachRetryListener()', description: 'Слушает resolve Promise → повторный рендер' },
      { name: 'markRootPinged()', description: 'Помечает корень для повторного рендера после resolve' },
    ],
  },
  {
    id: 'rsc',
    name: 'Server Components (RSC)',
    levelRange: '11-14',
    levelLabel: 'Уровень 11',
    file: 'react-client/src/ReactFlightClient.js',
    githubPath: 'packages/react-client/src/ReactFlightClient.js',
    emoji: '🌐',
    description:
      'Flight protocol — текстовый формат строк M/I/J/S/P. Клиент парсит чанки, строит React-элементы, лениво загружает Client Component чанки по их ID.',
    keyFunctions: [
      { name: 'processModelRow()', description: 'Парсит одну строку Flight payload' },
      { name: 'resolveModule()', description: 'Загружает и разрешает Client Component по ID' },
      { name: 'createFromReadableStream()', description: 'Создаёт RSC дерево из ReadableStream' },
      { name: 'resolveModel()', description: 'Преобразует JSON строку в React-элемент' },
    ],
  },
]

const LEVEL_FILTERS = ['all', '01-05', '06-10', '11-14'] as const
type LevelFilter = (typeof LEVEL_FILTERS)[number]

const GITHUB_BASE = 'https://github.com/facebook/react/blob/main'

export function Task14_3_Solution() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [filter, setFilter] = useState<LevelFilter>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return CONCEPTS.filter(c => {
      const matchLevel = filter === 'all' || c.levelRange === filter
      const matchSearch =
        search === '' ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.file.toLowerCase().includes(search.toLowerCase())
      return matchLevel && matchSearch
    })
  }, [filter, search])

  const handleCardClick = (id: string) => {
    setOpenId(prev => (prev === id ? null : id))
  }

  return (
    <div className="exercise-container" style={s.container}>
      <h2 style={s.h2}>Задание 14.3 — React Source Code Navigator</h2>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {LEVEL_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={s.btn(filter === f)}
            >
              {f === 'all' ? 'Все' : `Уровни ${f}`}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по названию или файлу..."
          style={{
            padding: '6px 12px',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            fontSize: 13,
            outline: 'none',
            flex: 1,
            minWidth: 200,
          }}
        />
      </div>

      {/* Concept cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}
      >
        {filtered.map(concept => {
          const isOpen = openId === concept.id
          return (
            <div
              key={concept.id}
              onClick={() => handleCardClick(concept.id)}
              style={{
                borderRadius: 12,
                border: `2px solid ${isOpen ? '#3b82f6' : '#e2e8f0'}`,
                background: isOpen ? '#eff6ff' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                overflow: 'hidden',
              }}
            >
              {/* Card header */}
              <div style={{ padding: '14px 16px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 6,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 20, marginRight: 8 }}>{concept.emoji}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>
                      {concept.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      background: '#f1f5f9',
                      color: '#475569',
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {concept.levelLabel}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#3b82f6',
                    fontFamily: 'monospace',
                    marginBottom: 8,
                    wordBreak: 'break-all',
                  }}
                >
                  {concept.file}
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                  {concept.description}
                </p>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div
                  style={{
                    borderTop: '1px solid #bfdbfe',
                    padding: '14px 16px',
                    background: '#fff',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10 }}>
                    Ключевые функции:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                    {concept.keyFunctions.map((fn, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <code
                          style={{
                            fontSize: 12,
                            background: '#f1f5f9',
                            padding: '2px 6px',
                            borderRadius: 4,
                            whiteSpace: 'nowrap',
                            color: '#7c3aed',
                            flexShrink: 0,
                          }}
                        >
                          {fn.name}
                        </code>
                        <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>
                          {fn.description}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      padding: '10px 12px',
                      background: '#f8fafc',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 4px', fontWeight: 600 }}>
                      GitHub (facebook/react):
                    </p>
                    <span
                      style={{
                        fontSize: 12,
                        color: '#3b82f6',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                      }}
                    >
                      {GITHUB_BASE}/{concept.githubPath}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: 40,
            color: '#94a3b8',
            fontSize: 14,
          }}
        >
          Ничего не найдено. Попробуйте другой поиск или сбросьте фильтр.
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: 12, color: '#94a3b8' }}>
        Показано {filtered.length} из {CONCEPTS.length} концепций
      </div>
    </div>
  )
}
