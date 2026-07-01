import { useState } from 'react'
import { useLanguage } from 'src/hooks'

type FiberTag =
  | 'FunctionComponent'
  | 'HostComponent'
  | 'HostText'
  | 'Fragment'
  | 'ContextProvider'

// Fiber node с реальными linked list связями
type Fiber = {
  name: string
  tag: FiberTag
  child: Fiber | null
  sibling: Fiber | null
  returnFiber: Fiber | null
}

// Результат анализа одного узла
type FiberDiagnostic = {
  name: string
  depth: number
  childCount: number
  tag: FiberTag
  hasChildren: boolean
  hasSibling: boolean
  returnName: string | null
}

// Вспомогательная функция: строит Fiber-дерево из декларативного описания
function buildFiber(
  def: { name: string; tag: string; children?: typeof def[] },
  returnFiber: Fiber | null
): Fiber {
  const node: Fiber = {
    name: def.name,
    tag: def.tag as FiberTag,
    child: null,
    sibling: null,
    returnFiber,
  }
  if (def.children && def.children.length > 0) {
    const kids = def.children.map(c => buildFiber(c, node))
    node.child = kids[0]
    for (let i = 0; i < kids.length - 1; i++) {
      kids[i].sibling = kids[i + 1]
    }
  }
  return node
}

// TODO: Реализовать traverseFiber(root)
// ВАЖНО: использовать итеративный цикл while, НЕ рекурсию
// Алгоритм:
//   workInProgress = root
//   while (workInProgress !== null):
//     1. Записать диагностику текущего узла
//     2. Если есть child → перейти к нему (depth + 1)
//     3. Иначе → идти вверх через return в поисках sibling:
//        - Если у текущего или предка есть sibling → перейти к sibling
//        - Если вернулись выше root → остановиться (workInProgress = null)
// Считать childCount: перебор child.sibling цепочки
// Считать depth: хранить в Map<Fiber, number>
function traverseFiber(root: Fiber): FiberDiagnostic[] {
  const result: FiberDiagnostic[] = []
  // TODO: реализовать итеративный DFS

  // Подсказка: создай depthMap = new Map<Fiber, number>()
  // depthMap.set(root, 0)
  // let workInProgress: Fiber | null = root
  // while (workInProgress !== null) { ... }

  return result
}

// Тестовое дерево
const TREE_DEF = {
  name: 'App',
  tag: 'FunctionComponent',
  children: [
    {
      name: 'ThemeContext.Provider',
      tag: 'ContextProvider',
      children: [
        {
          name: 'div',
          tag: 'HostComponent',
          children: [
            {
              name: 'Header',
              tag: 'FunctionComponent',
              children: [
                {
                  name: 'nav',
                  tag: 'HostComponent',
                  children: [{ name: 'Home', tag: 'HostText', children: [] }],
                },
              ],
            },
            {
              name: 'main',
              tag: 'HostComponent',
              children: [
                {
                  name: 'h1',
                  tag: 'HostComponent',
                  children: [{ name: 'Title', tag: 'HostText', children: [] }],
                },
                {
                  name: 'p',
                  tag: 'HostComponent',
                  children: [{ name: 'Text', tag: 'HostText', children: [] }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

type FilterTag = 'all' | FiberTag

export function Task1_4() {
  const { t } = useLanguage()
  const [filter, setFilter] = useState<FilterTag>('all')

  // TODO: построить fiber дерево из TREE_DEF
  // const fiberRoot = buildFiber(TREE_DEF, null)

  // TODO: получить диагностику через traverseFiber
  // const diagnostics = traverseFiber(fiberRoot)

  // TODO: отфильтровать по filter
  // const filtered = filter === 'all' ? diagnostics : diagnostics.filter(...)

  // TODO: вычислить статистику: maxDepth, hostCount

  const FILTERS: { label: string; value: FilterTag }[] = [
    { label: 'Все', value: 'all' },
    { label: 'FC', value: 'FunctionComponent' },
    { label: 'Host', value: 'HostComponent' },
    { label: 'Text', value: 'HostText' },
    { label: 'Provider', value: 'ContextProvider' },
  ]

  return (
    <div className="exercise-container">
      <h2>{t('task.1.4')}</h2>

      {/* TODO: блок статистики: всего узлов, макс глубина, host-узлов */}

      {/* TODO: кнопки фильтрации по типу */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: '4px 12px',
              borderRadius: '4px',
              border: filter === f.value ? '1px solid #3b82f6' : '1px solid #374151',
              background: filter === f.value ? '#1e3a5f' : '#111827',
              color: filter === f.value ? '#60a5fa' : '#6b7280',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* TODO: таблица с колонками: Имя, Tag, Depth, Children, Sibling?, Return */}
      {/* Строки раскрашены по tag: FC — синий фон, Host — зелёный, Text — жёлтый... */}
      {/* Имя узла с отступом по depth (для визуального дерева) */}

      <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '16px' }}>
        Реализуй traverseFiber (итеративный DFS), затем отобрази результаты в таблице
      </p>
    </div>
  )
}
