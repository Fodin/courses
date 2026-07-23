import { useState } from 'react'

// ============================================
// Задание 0.1: Интуиция циклических зависимостей — Решение
// ============================================

type ModuleId = 'A' | 'B' | 'C' | 'D'

interface Edge {
  from: ModuleId
  to: ModuleId
}

const MODULES: ModuleId[] = ['A', 'B', 'C', 'D']

const SCENARIOS: { label: string; edges: Edge[] }[] = [
  { label: 'Без рёбер', edges: [] },
  { label: 'A -> B', edges: [{ from: 'A', to: 'B' }] },
  {
    label: 'A -> B, B -> A (прямой цикл)',
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'A' },
    ],
  },
  {
    label: 'A -> B, B -> C',
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  },
  {
    label: 'A -> B, B -> C, C -> A (транзитивный цикл)',
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  },
  {
    label: 'A -> B, B -> C, C -> D (без цикла)',
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
    ],
  },
  {
    label: 'A -> B, B -> C, C -> D, D -> B (цикл внутри графа)',
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'B' },
    ],
  },
]

// DFS-детектор цикла: возвращает путь цикла или null
function findCycle(edges: Edge[]): ModuleId[] | null {
  const graph = new Map<ModuleId, ModuleId[]>()
  for (const m of MODULES) graph.set(m, [])
  for (const e of edges) graph.get(e.from)?.push(e.to)

  const visited = new Set<ModuleId>()
  const inStack = new Set<ModuleId>()
  const path: ModuleId[] = []

  function dfs(node: ModuleId): ModuleId[] | null {
    if (inStack.has(node)) {
      const cycleStart = path.indexOf(node)
      return [...path.slice(cycleStart), node]
    }
    if (visited.has(node)) return null

    visited.add(node)
    inStack.add(node)
    path.push(node)

    for (const dep of graph.get(node) ?? []) {
      const found = dfs(dep)
      if (found) return found
    }

    inStack.delete(node)
    path.pop()
    return null
  }

  for (const m of MODULES) {
    const found = dfs(m)
    if (found) return found
  }
  return null
}

const NODE_STYLE: React.CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 18,
  border: '2px solid #4b5563',
  color: '#e5e7eb',
  background: '#1f2937',
}

export function Task0_1_Solution() {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const scenario = SCENARIOS[scenarioIdx]
  const cycle = findCycle(scenario.edges)

  return (
    <div className="exercise-container">
      <h2>Задание 0.1: Интуиция циклических зависимостей</h2>
      <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 16 }}>
        Выберите сценарий графа импортов — DFS-алгоритм определит, есть ли цикл, и подсветит модули,
        входящие в него.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {SCENARIOS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setScenarioIdx(i)}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              borderRadius: 6,
              border: i === scenarioIdx ? '2px solid #60a5fa' : '1px solid #4b5563',
              background: i === scenarioIdx ? '#1e3a5f' : '#111827',
              color: '#e5e7eb',
              cursor: 'pointer',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 32, alignItems: 'center', marginBottom: 20 }}>
        {MODULES.map(m => (
          <div
            key={m}
            style={{
              ...NODE_STYLE,
              border: cycle?.includes(m) ? '2px solid #f87171' : NODE_STYLE.border,
              background: cycle?.includes(m) ? '#3b1d1d' : NODE_STYLE.background,
              color: cycle?.includes(m) ? '#f87171' : NODE_STYLE.color,
            }}
          >
            {m}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong style={{ color: '#9ca3af', fontSize: 13 }}>Рёбра (импорты):</strong>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '8px 0',
            fontFamily: 'monospace',
            fontSize: 13,
          }}
        >
          {scenario.edges.length === 0 && <li style={{ color: '#6b7280' }}>нет рёбер</li>}
          {scenario.edges.map((e, i) => (
            <li key={i} style={{ color: '#e5e7eb' }}>
              {e.from} → {e.to}
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          padding: '12px 16px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          background: cycle ? '#3b1d1d' : '#1a3a2e',
          color: cycle ? '#f87171' : '#34d399',
          borderLeft: `4px solid ${cycle ? '#f87171' : '#34d399'}`,
        }}
      >
        {cycle ? `🔥 Найден цикл: ${cycle.join(' → ')}` : '✅ Цикл не найден — граф ациклический'}
      </div>
    </div>
  )
}
