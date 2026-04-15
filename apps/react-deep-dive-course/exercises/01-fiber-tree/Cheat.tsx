/**
 * Cheat.tsx — полное рабочее решение для уровня 1.
 * Используй только для сверки, после того как попробовал сам.
 *
 * Компоненты: Task1_1, Task1_2, Task1_3, Task1_4 (без суффикса _Solution)
 */

import { useState } from 'react'

// ─── Task 1.1 ────────────────────────────────────────────────────────────────

type WorkTag =
  | 'FunctionComponent'
  | 'HostComponent'
  | 'HostText'
  | 'Fragment'
  | 'ContextProvider'
  | 'ContextConsumer'
  | 'Memo'

type FiberNodeDef = {
  name: string
  tag: WorkTag
  children?: FiberNodeDef[]
}

type FiberNodeBuilt = {
  name: string
  tag: WorkTag
  child: FiberNodeBuilt | null
  sibling: FiberNodeBuilt | null
  returnNode: FiberNodeBuilt | null
}

function buildFiberTree(def: FiberNodeDef, returnNode: FiberNodeBuilt | null): FiberNodeBuilt {
  const node: FiberNodeBuilt = { name: def.name, tag: def.tag, child: null, sibling: null, returnNode }
  if (def.children && def.children.length > 0) {
    const childNodes = def.children.map(c => buildFiberTree(c, node))
    node.child = childNodes[0]
    for (let i = 0; i < childNodes.length - 1; i++) {
      childNodes[i].sibling = childNodes[i + 1]
    }
  }
  return node
}

const TAG_COLORS: Record<WorkTag, string> = {
  FunctionComponent: '#3b82f6',
  HostComponent: '#10b981',
  HostText: '#f59e0b',
  Fragment: '#6b7280',
  ContextProvider: '#8b5cf6',
  ContextConsumer: '#a78bfa',
  Memo: '#06b6d4',
}

function FiberCard({
  node,
  selectedName,
  onSelect,
}: {
  node: FiberNodeBuilt
  selectedName: string | null
  onSelect: (n: FiberNodeBuilt) => void
}) {
  const isSelected = node.name === selectedName
  const color = TAG_COLORS[node.tag]

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
      <div>
        <button
          onClick={() => onSelect(node)}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border: isSelected ? `2px solid ${color}` : '2px solid transparent',
            background: isSelected ? `${color}22` : '#1f2937',
            color: '#e5e7eb',
            cursor: 'pointer',
            fontSize: '13px',
            textAlign: 'left',
            minWidth: '140px',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>{node.name}</div>
          <div
            style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '3px',
              background: color,
              color: '#fff',
              display: 'inline-block',
            }}
          >
            {node.tag}
          </div>
          {node.returnNode && (
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
              return ↑ {node.returnNode.name}
            </div>
          )}
        </button>
        {node.child && (
          <div
            style={{ marginLeft: '24px', marginTop: '8px', borderLeft: '2px dashed #374151', paddingLeft: '12px' }}
          >
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>child ↓</div>
            <FiberCard node={node.child} selectedName={selectedName} onSelect={onSelect} />
          </div>
        )}
      </div>
      {node.sibling && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <div style={{ fontSize: '20px', color: '#6b7280', padding: '8px 0', alignSelf: 'flex-start', marginTop: '8px' }}>→</div>
          <div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>sibling</div>
            <FiberCard node={node.sibling} selectedName={selectedName} onSelect={onSelect} />
          </div>
        </div>
      )}
    </div>
  )
}

const SAMPLE_TREE: FiberNodeDef = {
  name: 'App',
  tag: 'FunctionComponent',
  children: [
    { name: 'Header', tag: 'FunctionComponent' },
    {
      name: 'Main',
      tag: 'HostComponent',
      children: [
        { name: 'Article', tag: 'HostComponent', children: [{ name: 'Hello', tag: 'HostText' }] },
        { name: 'Aside', tag: 'HostComponent' },
      ],
    },
    { name: 'Footer', tag: 'FunctionComponent' },
  ],
}

export function Task1_1() {
  const root = buildFiberTree(SAMPLE_TREE, null)
  const [selected, setSelected] = useState<FiberNodeBuilt | null>(null)

  return (
    <div className="exercise-container">
      <h2>Задание 1.1: Fiber Node Explorer</h2>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '300px', overflowX: 'auto' }}>
          <div style={{ marginBottom: '12px', fontSize: '13px', color: '#9ca3af' }}>
            Кликни на узел, чтобы увидеть его связи
          </div>
          <FiberCard node={root} selectedName={selected?.name ?? null} onSelect={setSelected} />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          {selected ? (
            <div style={{ padding: '16px', borderRadius: '8px', background: '#1f2937', fontSize: '13px', fontFamily: 'monospace' }}>
              <div style={{ color: '#9ca3af', marginBottom: '12px', fontFamily: 'sans-serif', fontSize: '12px' }}>
                Выбранный Fiber node
              </div>
              {(
                [
                  ['name', selected.name],
                  ['tag', selected.tag],
                  ['child', selected.child?.name ?? 'null'],
                  ['sibling', selected.sibling?.name ?? 'null'],
                  ['return', selected.returnNode?.name ?? 'null'],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k} style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#6b7280' }}>{k}: </span>
                  <span style={{ color: v === 'null' ? '#374151' : '#e5e7eb' }}>{v}</span>
                </div>
              ))}
              <button
                onClick={() => setSelected(null)}
                style={{ marginTop: '12px', padding: '6px 12px', borderRadius: '4px', border: 'none', background: '#374151', color: '#9ca3af', cursor: 'pointer', fontSize: '12px' }}
              >
                Сбросить
              </button>
            </div>
          ) : (
            <div style={{ padding: '16px', borderRadius: '8px', background: '#111827', color: '#4b5563', fontSize: '13px' }}>
              Выбери узел слева
            </div>
          )}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Легенда:</div>
            {(Object.entries(TAG_COLORS) as [WorkTag, string][]).map(([tag, color]) => (
              <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }} />
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Task 1.2 ────────────────────────────────────────────────────────────────

type MyElement = {
  type: string | null
  typeName: string
  props: Record<string, unknown>
  children: (MyElement | string)[]
}

type MyFiber = {
  type: string | null
  tag: 'FunctionComponent' | 'HostComponent' | 'HostText'
  memoizedProps: Record<string, unknown>
  stateNode: null
  child: MyFiber | null
  sibling: MyFiber | null
  returnFiber: MyFiber | null
}

function myCreateElement(
  type: string | { name: string },
  props: Record<string, unknown> | null,
  ...children: (MyElement | string)[]
): MyElement {
  const isFunction = typeof type === 'object' && 'name' in type
  return {
    type: isFunction ? 'function' : (type as string),
    typeName: isFunction ? (type as { name: string }).name : (type as string),
    props: props ?? {},
    children,
  }
}

function myCreateFiber(element: MyElement | string, returnFiber: MyFiber | null): MyFiber {
  if (typeof element === 'string') {
    return { type: null, tag: 'HostText', memoizedProps: { text: element }, stateNode: null, child: null, sibling: null, returnFiber }
  }
  const tag: MyFiber['tag'] = element.type === 'function' ? 'FunctionComponent' : 'HostComponent'
  const fiber: MyFiber = { type: element.typeName, tag, memoizedProps: element.props, stateNode: null, child: null, sibling: null, returnFiber }
  if (element.children.length > 0) {
    const childFibers = element.children.map(c => myCreateFiber(c, fiber))
    fiber.child = childFibers[0]
    for (let i = 0; i < childFibers.length - 1; i++) {
      childFibers[i].sibling = childFibers[i + 1]
    }
  }
  return fiber
}

function getFiberName(f: MyFiber | null): string {
  if (!f) return 'null'
  return f.type ?? f.tag
}

function FiberTree1_2({ fiber, depth = 0 }: { fiber: MyFiber; depth?: number }) {
  const tagColor: Record<string, string> = { FunctionComponent: '#3b82f6', HostComponent: '#10b981', HostText: '#f59e0b' }
  const color = tagColor[fiber.tag]
  return (
    <div style={{ marginLeft: depth * 20 }}>
      <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '4px', background: '#1f2937', border: `1px solid ${color}44`, fontSize: '12px', fontFamily: 'monospace', marginBottom: '4px' }}>
        <span style={{ color }}>[{fiber.tag}]</span>{' '}
        <span style={{ color: '#e5e7eb' }}>{getFiberName(fiber)}</span>
        {fiber.tag === 'HostText' && <span style={{ color: '#6b7280' }}> &quot;{String(fiber.memoizedProps.text)}&quot;</span>}
      </div>
      {fiber.child && <FiberTree1_2 fiber={fiber.child} depth={depth + 1} />}
      {fiber.sibling && <FiberTree1_2 fiber={fiber.sibling} depth={depth} />}
    </div>
  )
}

function ElementTree({ el, depth = 0 }: { el: MyElement | string; depth?: number }) {
  if (typeof el === 'string') {
    return <div style={{ marginLeft: depth * 20, fontSize: '12px', fontFamily: 'monospace', color: '#f59e0b', marginBottom: '4px' }}>&quot;{el}&quot;</div>
  }
  return (
    <div style={{ marginLeft: depth * 20 }}>
      <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#e5e7eb', marginBottom: '4px' }}>
        &lt;<span style={{ color: el.type === 'function' ? '#3b82f6' : '#10b981' }}>{el.typeName}</span>&gt;
      </div>
      {el.children.map((c, i) => <ElementTree key={i} el={c} depth={depth + 1} />)}
    </div>
  )
}

const Nav = { name: 'Nav' }
const DEMO_ELEMENT = myCreateElement('div', { className: 'app' },
  myCreateElement(Nav, {}),
  myCreateElement('main', null,
    myCreateElement('h1', null, 'Hello'),
    myCreateElement('p', null, 'World')
  )
)

export function Task1_2() {
  const [renderKey, setRenderKey] = useState(0)
  const [selectedFiber, setSelectedFiber] = useState<MyFiber | null>(null)
  const fiberRoot = myCreateFiber(DEMO_ELEMENT, null)
  const allFibers: MyFiber[] = []
  function collectFibers(f: MyFiber | null) {
    if (!f) return
    allFibers.push(f)
    collectFibers(f.child)
    collectFibers(f.sibling)
  }
  collectFibers(fiberRoot)

  return (
    <div className="exercise-container">
      <h2>Задание 1.2: createElement → Fiber</h2>
      <button
        onClick={() => { setRenderKey(k => k + 1); setSelectedFiber(null) }}
        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '13px', marginBottom: '20px' }}
      >
        Пересоздать (симуляция рендера #{renderKey + 1})
      </button>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>React Elements</div>
          <div style={{ background: '#111827', padding: '12px', borderRadius: '6px' }}>
            <ElementTree el={DEMO_ELEMENT} />
          </div>
        </div>
        <div style={{ fontSize: '24px', color: '#374151', alignSelf: 'center' }}>→</div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Fiber Nodes</div>
          <div style={{ background: '#111827', padding: '12px', borderRadius: '6px' }}>
            <FiberTree1_2 fiber={fiberRoot} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Инспектор</div>
          <div style={{ background: '#1f2937', padding: '12px', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace', minHeight: '80px' }}>
            {selectedFiber ? (
              <>
                <div style={{ color: '#9ca3af', marginBottom: '8px' }}>{getFiberName(selectedFiber)}</div>
                {([['type', selectedFiber.type ?? 'null'], ['tag', selectedFiber.tag], ['child', getFiberName(selectedFiber.child)], ['sibling', getFiberName(selectedFiber.sibling)], ['return', getFiberName(selectedFiber.returnFiber)]] as [string, string][]).map(([k, v]) => (
                  <div key={k} style={{ color: '#6b7280', marginBottom: '2px' }}>{k}: <span style={{ color: '#e5e7eb' }}>{v}</span></div>
                ))}
              </>
            ) : <span style={{ color: '#4b5563' }}>Выбери fiber ниже...</span>}
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Узлы:</div>
          {allFibers.map((f, i) => (
            <button key={i} onClick={() => setSelectedFiber(f)} style={{ display: 'block', margin: '3px 0', padding: '4px 8px', border: '1px solid #374151', borderRadius: '4px', background: selectedFiber === f ? '#1f2937' : '#111827', color: '#9ca3af', cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace', width: '100%', textAlign: 'left' }}>
              {getFiberName(f)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Task 1.3 ────────────────────────────────────────────────────────────────

type FiberTag3 = 'FunctionComponent' | 'HostComponent' | 'HostText' | 'Fragment' | 'ContextProvider' | 'ContextConsumer' | 'Memo'
type FiberNodeDef3 = { name: string; tag: FiberTag3; children?: FiberNodeDef3[] }
type DomNode = { name: string; children: DomNode[] }

const HOST_TAGS: FiberTag3[] = ['HostComponent', 'HostText']

function flattenToDom(fiber: FiberNodeDef3): DomNode[] {
  if (HOST_TAGS.includes(fiber.tag)) {
    return [{ name: fiber.name, children: (fiber.children ?? []).flatMap(c => flattenToDom(c)) }]
  }
  return (fiber.children ?? []).flatMap(c => flattenToDom(c))
}

function FiberTreeView({ node, depth = 0 }: { node: FiberNodeDef3; depth?: number }) {
  const isHost = HOST_TAGS.includes(node.tag)
  const tagColors: Record<FiberTag3, string> = {
    HostComponent: '#10b981', HostText: '#f59e0b', FunctionComponent: '#3b82f6',
    Fragment: '#6b7280', ContextProvider: '#8b5cf6', ContextConsumer: '#a78bfa', Memo: '#06b6d4',
  }
  const color = tagColors[node.tag]
  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '4px', background: isHost ? '#0f2a1e' : '#1a1a2e', border: `1px solid ${color}33`, fontSize: '12px', marginBottom: '4px', opacity: isHost ? 1 : 0.65, fontStyle: isHost ? 'normal' : 'italic' }}>
        <span style={{ color, fontSize: '10px' }}>{node.tag}</span>
        <span style={{ color: isHost ? '#e5e7eb' : '#6b7280' }}>{node.name}</span>
      </div>
      {(node.children ?? []).map((c, i) => <FiberTreeView key={i} node={c} depth={depth + 1} />)}
    </div>
  )
}

function DomTreeView({ node, depth = 0 }: { node: DomNode; depth?: number }) {
  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '4px', background: '#0f2a1e', border: '1px solid #10b98133', fontSize: '12px', color: '#10b981', marginBottom: '4px' }}>
        &lt;{node.name}&gt;
      </div>
      {node.children.map((c, i) => <DomTreeView key={i} node={c} depth={depth + 1} />)}
    </div>
  )
}

const EXAMPLES_3: { label: string; tree: FiberNodeDef3 }[] = [
  {
    label: 'Context + Fragment',
    tree: { name: 'App', tag: 'FunctionComponent', children: [{ name: 'ThemeContext.Provider', tag: 'ContextProvider', children: [{ name: 'Fragment', tag: 'Fragment', children: [{ name: 'nav', tag: 'HostComponent', children: [{ name: 'Home', tag: 'HostText' }] }, { name: 'main', tag: 'HostComponent', children: [{ name: 'Article', tag: 'FunctionComponent', children: [{ name: 'article', tag: 'HostComponent' }] }] }] }] }] },
  },
  {
    label: 'Memo + nested Fragment',
    tree: { name: 'Page', tag: 'FunctionComponent', children: [{ name: 'div', tag: 'HostComponent', children: [{ name: 'Fragment', tag: 'Fragment', children: [{ name: 'h1', tag: 'HostComponent', children: [{ name: 'Title', tag: 'HostText' }] }, { name: 'p', tag: 'HostComponent', children: [{ name: 'Content', tag: 'HostText' }] }] }, { name: 'MemoFooter', tag: 'Memo', children: [{ name: 'footer', tag: 'HostComponent' }] }] }] },
  },
]

export function Task1_3() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const example = EXAMPLES_3[exampleIdx]
  const domTree = flattenToDom(example.tree)

  return (
    <div className="exercise-container">
      <h2>Задание 1.3: Fiber vs DOM</h2>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {EXAMPLES_3.map((ex, i) => (
          <button key={i} onClick={() => setExampleIdx(i)} style={{ padding: '6px 14px', borderRadius: '6px', border: exampleIdx === i ? '2px solid #3b82f6' : '2px solid transparent', background: exampleIdx === i ? '#1e3a5f' : '#1f2937', color: '#e5e7eb', cursor: 'pointer', fontSize: '13px' }}>
            {ex.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Fiber-дерево (все узлы)</div>
          <div style={{ background: '#0d1117', padding: '12px', borderRadius: '6px', minHeight: '120px' }}>
            <FiberTreeView node={example.tree} />
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#4b5563', fontStyle: 'italic' }}>Полупрозрачные узлы не создают DOM</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '24px', color: '#374151' }}>→</div>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>DOM-дерево (только host-узлы)</div>
          <div style={{ background: '#0d1117', padding: '12px', borderRadius: '6px', minHeight: '120px' }}>
            {domTree.map((n, i) => <DomTreeView key={i} node={n} />)}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#4b5563', fontStyle: 'italic' }}>Fragment, FC, Provider исчезли</div>
        </div>
      </div>
      <div style={{ marginTop: '20px', padding: '12px', borderRadius: '6px', background: '#111827', fontSize: '12px', color: '#6b7280', lineHeight: 1.6 }}>
        <strong style={{ color: '#e5e7eb' }}>flattenToDom:</strong> HostComponent и HostText — остаются. Fragment, FC, ContextProvider, Memo — прозрачны.
      </div>
    </div>
  )
}

// ─── Task 1.4 ────────────────────────────────────────────────────────────────

type FiberTag4 = 'FunctionComponent' | 'HostComponent' | 'HostText' | 'Fragment' | 'ContextProvider'
type Fiber4 = { name: string; tag: FiberTag4; child: Fiber4 | null; sibling: Fiber4 | null; returnFiber: Fiber4 | null }
type FiberDiagnostic = { name: string; depth: number; childCount: number; tag: FiberTag4; hasChildren: boolean; hasSibling: boolean; returnName: string | null }

function buildFiber4(def: { name: string; tag: string; children?: typeof def[] }, returnFiber: Fiber4 | null): Fiber4 {
  const node: Fiber4 = { name: def.name, tag: def.tag as FiberTag4, child: null, sibling: null, returnFiber }
  if (def.children && def.children.length > 0) {
    const kids = def.children.map(c => buildFiber4(c, node))
    node.child = kids[0]
    for (let i = 0; i < kids.length - 1; i++) kids[i].sibling = kids[i + 1]
  }
  return node
}

function traverseFiber(root: Fiber4): FiberDiagnostic[] {
  const result: FiberDiagnostic[] = []
  const depthMap = new Map<Fiber4, number>()
  depthMap.set(root, 0)
  let workInProgress: Fiber4 | null = root

  while (workInProgress !== null) {
    const depth = depthMap.get(workInProgress) ?? 0
    let childCount = 0
    let cur: Fiber4 | null = workInProgress.child
    while (cur) { childCount++; cur = cur.sibling }

    result.push({ name: workInProgress.name, tag: workInProgress.tag, depth, childCount, hasChildren: workInProgress.child !== null, hasSibling: workInProgress.sibling !== null, returnName: workInProgress.returnFiber?.name ?? null })

    if (workInProgress.child) {
      depthMap.set(workInProgress.child, depth + 1)
      workInProgress = workInProgress.child
    } else {
      let node: Fiber4 | null = workInProgress
      workInProgress = null
      while (node !== null) {
        if (node.sibling) {
          const parentDepth = node.returnFiber ? (depthMap.get(node.returnFiber) ?? 0) : 0
          depthMap.set(node.sibling, parentDepth + 1)
          workInProgress = node.sibling
          break
        }
        node = node.returnFiber
      }
    }
  }

  return result
}

const TREE_4_DEF = {
  name: 'App', tag: 'FunctionComponent',
  children: [{ name: 'ThemeContext.Provider', tag: 'ContextProvider', children: [{ name: 'div', tag: 'HostComponent', children: [{ name: 'Header', tag: 'FunctionComponent', children: [{ name: 'nav', tag: 'HostComponent', children: [{ name: 'Home', tag: 'HostText', children: [] }] }] }, { name: 'main', tag: 'HostComponent', children: [{ name: 'h1', tag: 'HostComponent', children: [{ name: 'Title', tag: 'HostText', children: [] }] }, { name: 'p', tag: 'HostComponent', children: [{ name: 'Text', tag: 'HostText', children: [] }] }] }] }] }],
}

const TAG_BG: Record<FiberTag4, string> = { FunctionComponent: '#1e3a5f', HostComponent: '#0f2a1e', HostText: '#2d1b00', Fragment: '#1f2937', ContextProvider: '#2d1b4e' }
const TAG_TEXT: Record<FiberTag4, string> = { FunctionComponent: '#60a5fa', HostComponent: '#34d399', HostText: '#fbbf24', Fragment: '#9ca3af', ContextProvider: '#a78bfa' }

export function Task1_4() {
  const [filter, setFilter] = useState<'all' | FiberTag4>('all')
  const fiberRoot = buildFiber4(TREE_4_DEF, null)
  const diagnostics = traverseFiber(fiberRoot)
  const filtered = filter === 'all' ? diagnostics : diagnostics.filter(d => d.tag === filter)
  const maxDepth = diagnostics.reduce((m, d) => Math.max(m, d.depth), 0)
  const hostCount = diagnostics.filter(d => d.tag === 'HostComponent').length

  const FILTERS = [
    { label: 'Все', value: 'all' as const },
    { label: 'FC', value: 'FunctionComponent' as const },
    { label: 'Host', value: 'HostComponent' as const },
    { label: 'Text', value: 'HostText' as const },
    { label: 'Provider', value: 'ContextProvider' as const },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 1.4: Fiber Detective</h2>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {([{ label: 'Всего узлов', value: diagnostics.length, color: '#e5e7eb' }, { label: 'Макс. глубина', value: maxDepth, color: '#60a5fa' }, { label: 'HostComponent', value: hostCount, color: '#34d399' }] as { label: string; value: number; color: string }[]).map(s => (
          <div key={s.label} style={{ padding: '10px 16px', borderRadius: '6px', background: '#1f2937', textAlign: 'center', minWidth: '100px' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)} style={{ padding: '4px 12px', borderRadius: '4px', border: filter === f.value ? '1px solid #3b82f6' : '1px solid #374151', background: filter === f.value ? '#1e3a5f' : '#111827', color: filter === f.value ? '#60a5fa' : '#6b7280', cursor: 'pointer', fontSize: '12px' }}>
            {f.label}
          </button>
        ))}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'monospace' }}>
          <thead>
            <tr style={{ background: '#1f2937' }}>
              {['Имя', 'Tag', 'Depth', 'Children', 'Sibling?', 'Return'].map(col => (
                <th key={col} style={{ padding: '8px 12px', textAlign: 'left', color: '#9ca3af', fontWeight: 600, borderBottom: '1px solid #374151', whiteSpace: 'nowrap' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={i} style={{ background: TAG_BG[d.tag] ?? '#111827', borderBottom: '1px solid #1f2937' }}>
                <td style={{ padding: '6px 12px', color: '#e5e7eb' }}>{'\u00a0\u00a0'.repeat(d.depth)}{d.name}</td>
                <td style={{ padding: '6px 12px' }}>
                  <span style={{ padding: '2px 6px', borderRadius: '3px', background: TAG_BG[d.tag], color: TAG_TEXT[d.tag], fontSize: '11px', border: `1px solid ${TAG_TEXT[d.tag]}44` }}>{d.tag}</span>
                </td>
                <td style={{ padding: '6px 12px', color: '#6b7280' }}>{d.depth}</td>
                <td style={{ padding: '6px 12px', color: d.childCount > 0 ? '#e5e7eb' : '#374151' }}>{d.childCount}</td>
                <td style={{ padding: '6px 12px', color: d.hasSibling ? '#34d399' : '#374151' }}>{d.hasSibling ? '✓' : '—'}</td>
                <td style={{ padding: '6px 12px', color: '#6b7280' }}>{d.returnName ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: '12px', fontSize: '11px', color: '#4b5563' }}>
        Порядок строк = порядок обхода DFS (child → sibling → return), как это делает React.
      </p>
    </div>
  )
}
