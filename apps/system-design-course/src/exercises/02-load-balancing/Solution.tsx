import { useState } from 'react'

// ============================================
// Задание 2.1: Справочная карточка по алгоритмам
// ============================================

export function Task2_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Балансировка нагрузки — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>L4 vs L7</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>L4</strong> — транспортный уровень (TCP/UDP). Видит IP + порт. Быстрый (~10M pps).
            <br />
            <strong>L7</strong> — прикладной уровень (HTTP). Видит URL, заголовки, cookies. Умная маршрутизация.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Алгоритмы</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Round Robin</strong> — по кругу.{' '}
            <strong>Weighted</strong> — с учётом мощности.{' '}
            <strong>Least Conn</strong> — наименее загруженный.{' '}
            <strong>IP Hash</strong> — sticky.{' '}
            <strong>Consistent Hash</strong> — минимум перемещений.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Health Checks</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Active</strong> — LB сам опрашивает серверы (GET /health каждые N сек).
            <br />
            <strong>Passive</strong> — LB отслеживает ошибки в реальных ответах. Best practice — оба.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Consistent Hashing</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Серверы и ключи на хэш-кольце. Ключ идёт к ближайшему серверу по часовой стрелке.
            При добавлении сервера перемещается ~1/N ключей. Virtual nodes для равномерности.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 2.2: Симулятор балансировки
// ============================================

type Algorithm = 'round-robin' | 'weighted' | 'least-connections'

interface Server {
  id: number
  name: string
  weight: number
  requests: number
  activeConnections: number
}

const INITIAL_SERVERS: Server[] = [
  { id: 1, name: 'Server 1', weight: 3, requests: 0, activeConnections: 0 },
  { id: 2, name: 'Server 2', weight: 1, requests: 0, activeConnections: 0 },
  { id: 3, name: 'Server 3', weight: 2, requests: 0, activeConnections: 0 },
  { id: 4, name: 'Server 4', weight: 1, requests: 0, activeConnections: 0 },
]

function getNextServerRoundRobin(servers: Server[], counter: number): number {
  return counter % servers.length
}

function getNextServerWeighted(servers: Server[], counter: number): number {
  const totalWeight = servers.reduce((sum, s) => sum + s.weight, 0)
  let position = counter % totalWeight
  for (let i = 0; i < servers.length; i++) {
    position -= servers[i].weight
    if (position < 0) return i
  }
  return 0
}

function getNextServerLeastConnections(servers: Server[]): number {
  let minIdx = 0
  let minConn = servers[0].activeConnections
  for (let i = 1; i < servers.length; i++) {
    if (servers[i].activeConnections < minConn) {
      minConn = servers[i].activeConnections
      minIdx = i
    }
  }
  return minIdx
}

function calculateStdDev(values: number[]): number {
  if (values.length === 0) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  return Math.sqrt(variance)
}

export function Task2_2_Solution() {
  const [servers, setServers] = useState<Server[]>(INITIAL_SERVERS.map(s => ({ ...s })))
  const [algorithm, setAlgorithm] = useState<Algorithm>('round-robin')
  const [rrCounter, setRrCounter] = useState(0)
  const [totalRequests, setTotalRequests] = useState(0)
  const [batchSize, setBatchSize] = useState(10)

  const sendRequests = (count: number) => {
    setServers(prev => {
      const next = prev.map(s => ({ ...s }))
      let counter = rrCounter

      for (let i = 0; i < count; i++) {
        let idx: number
        switch (algorithm) {
          case 'round-robin':
            idx = getNextServerRoundRobin(next, counter)
            break
          case 'weighted':
            idx = getNextServerWeighted(next, counter)
            break
          case 'least-connections':
            idx = getNextServerLeastConnections(next)
            break
        }
        next[idx].requests++
        next[idx].activeConnections++
        counter++
      }

      setRrCounter(counter)
      setTotalRequests(prev2 => prev2 + count)
      return next
    })
  }

  const reset = () => {
    setServers(INITIAL_SERVERS.map(s => ({ ...s })))
    setRrCounter(0)
    setTotalRequests(0)
  }

  const maxRequests = Math.max(...servers.map(s => s.requests), 1)
  const totalWeight = servers.reduce((sum, s) => sum + s.weight, 0)
  const stdDev = calculateStdDev(servers.map(s => s.requests))

  const algorithmDescriptions: Record<Algorithm, string> = {
    'round-robin': 'Запросы по кругу: 1 → 2 → 3 → 4 → 1 → ... Не учитывает мощность серверов.',
    'weighted': `Учитывает вес серверов. Веса: ${servers.map(s => `${s.name}=${s.weight}`).join(', ')}. Всего ${totalWeight} частей.`,
    'least-connections': 'Запрос идёт на сервер с наименьшим числом активных соединений.',
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Симулятор балансировки нагрузки</h2>

      {/* Algorithm selector */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>Алгоритм</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {([
            ['round-robin', 'Round Robin'],
            ['weighted', 'Weighted RR'],
            ['least-connections', 'Least Connections'],
          ] as [Algorithm, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setAlgorithm(key)}
              style={{
                padding: '0.5rem 1rem',
                border: `2px solid ${algorithm === key ? '#1976d2' : '#e0e0e0'}`,
                background: algorithm === key ? '#1976d2' : 'white',
                color: algorithm === key ? 'white' : '#333',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#666' }}>
          {algorithmDescriptions[algorithm]}
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => sendRequests(1)}
          style={{
            padding: '0.5rem 1rem',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          +1 запрос
        </button>
        <button
          onClick={() => sendRequests(batchSize)}
          style={{
            padding: '0.5rem 1rem',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          +{batchSize} запросов
        </button>
        <select
          value={batchSize}
          onChange={(e) => setBatchSize(Number(e.target.value))}
          style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          {[10, 20, 50, 100].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <button
          onClick={reset}
          style={{
            padding: '0.5rem 1rem',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Сброс
        </button>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>
          Всего запросов: {totalRequests}
        </span>
      </div>

      {/* Server bars */}
      <div style={{
        padding: '1rem',
        background: '#fafafa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        marginBottom: '1rem',
      }}>
        <h3 style={{ margin: '0 0 1rem' }}>Серверы</h3>
        {servers.map((server) => {
          const pct = maxRequests > 0 ? (server.requests / maxRequests) * 100 : 0
          const expectedPct = algorithm === 'weighted'
            ? ((server.weight / totalWeight) * 100).toFixed(1)
            : (100 / servers.length).toFixed(1)
          const actualPct = totalRequests > 0 ? ((server.requests / totalRequests) * 100).toFixed(1) : '0.0'

          return (
            <div key={server.id} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                  {server.name} (weight: {server.weight})
                </span>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>
                  {server.requests} req ({actualPct}%) | ожидалось ~{expectedPct}%
                </span>
              </div>
              <div style={{ height: '28px', background: '#eee', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: server.weight >= 3 ? '#1976d2' : server.weight >= 2 ? '#42a5f5' : '#90caf9',
                    borderRadius: '4px',
                    transition: 'width 0.3s',
                    minWidth: server.requests > 0 ? '2px' : '0',
                  }}
                />
                <span style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: pct > 30 ? 'white' : '#333',
                }}>
                  {server.requests}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
      }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#555', marginBottom: '0.25rem' }}>Стандартное отклонение</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1976d2' }}>{stdDev.toFixed(1)}</div>
          <div style={{ fontSize: '0.75rem', color: '#888' }}>чем меньше, тем равномернее</div>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#555', marginBottom: '0.25rem' }}>Макс. загрузка</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#388e3c' }}>
            {servers.reduce((max, s) => s.requests > max.requests ? s : max, servers[0]).name}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#888' }}>{Math.max(...servers.map(s => s.requests))} req</div>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#555', marginBottom: '0.25rem' }}>Мин. загрузка</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#e65100' }}>
            {servers.reduce((min, s) => s.requests < min.requests ? s : min, servers[0]).name}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#888' }}>{Math.min(...servers.map(s => s.requests))} req</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 2.3: Визуализатор Consistent Hashing
// ============================================

interface HashNode {
  name: string
  position: number
  isVirtual: boolean
  parentServer: string
}

interface HashKey {
  name: string
  position: number
  assignedTo: string
}

function simpleHash(str: string, max: number): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return ((hash % max) + max) % max
}

function findAssignedServer(keyPos: number, nodes: HashNode[]): string {
  if (nodes.length === 0) return '(none)'
  const sorted = [...nodes].sort((a, b) => a.position - b.position)
  for (const node of sorted) {
    if (node.position >= keyPos) return node.parentServer
  }
  return sorted[0].parentServer
}

function calculateModNRedistribution(
  keys: { name: string; position: number }[],
  oldServerCount: number,
  newServerCount: number,
): number {
  if (oldServerCount === 0 || newServerCount === 0) return 0
  let moved = 0
  for (const key of keys) {
    const oldIdx = key.position % oldServerCount
    const newIdx = key.position % newServerCount
    if (oldIdx !== newIdx || oldIdx >= newServerCount) moved++
  }
  return moved
}

export function Task2_3_Solution() {
  const RING_SIZE = 360
  const [serverNames, setServerNames] = useState<string[]>(['A', 'B', 'C'])
  const [keys, setKeys] = useState<string[]>(['user:1', 'user:2', 'user:3', 'order:1', 'order:2'])
  const [useVirtualNodes, setUseVirtualNodes] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)
  const [redistribution, setRedistribution] = useState<{ consistent: number; modN: number } | null>(null)
  const VIRTUAL_COUNT = 4

  // Build nodes
  const nodes: HashNode[] = []
  for (const server of serverNames) {
    if (useVirtualNodes) {
      for (let v = 0; v < VIRTUAL_COUNT; v++) {
        nodes.push({
          name: `${server}-v${v}`,
          position: simpleHash(`${server}-v${v}`, RING_SIZE),
          isVirtual: v > 0,
          parentServer: server,
        })
      }
    } else {
      nodes.push({
        name: server,
        position: simpleHash(server, RING_SIZE),
        isVirtual: false,
        parentServer: server,
      })
    }
  }

  // Build keys
  const hashKeys: HashKey[] = keys.map(k => ({
    name: k,
    position: simpleHash(k, RING_SIZE),
    assignedTo: findAssignedServer(simpleHash(k, RING_SIZE), nodes),
  }))

  // Distribution stats
  const distribution: Record<string, number> = {}
  for (const server of serverNames) distribution[server] = 0
  for (const key of hashKeys) {
    if (distribution[key.assignedTo] !== undefined) distribution[key.assignedTo]++
  }

  const nextServerName = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (const letter of alphabet) {
      if (!serverNames.includes(letter)) return letter
    }
    return `S${serverNames.length + 1}`
  }

  const addServer = () => {
    const name = nextServerName()
    const oldAssignments = hashKeys.map(k => k.assignedTo)

    // Calculate new assignments with the new server
    const newNames = [...serverNames, name]
    const newNodes: HashNode[] = []
    for (const server of newNames) {
      if (useVirtualNodes) {
        for (let v = 0; v < VIRTUAL_COUNT; v++) {
          newNodes.push({
            name: `${server}-v${v}`,
            position: simpleHash(`${server}-v${v}`, RING_SIZE),
            isVirtual: v > 0,
            parentServer: server,
          })
        }
      } else {
        newNodes.push({
          name: server,
          position: simpleHash(server, RING_SIZE),
          isVirtual: false,
          parentServer: server,
        })
      }
    }

    const newAssignments = keys.map(k => findAssignedServer(simpleHash(k, RING_SIZE), newNodes))
    let movedConsistent = 0
    for (let i = 0; i < oldAssignments.length; i++) {
      if (oldAssignments[i] !== newAssignments[i]) movedConsistent++
    }

    const movedModN = calculateModNRedistribution(
      keys.map(k => ({ name: k, position: simpleHash(k, RING_SIZE) })),
      serverNames.length,
      newNames.length,
    )

    setServerNames(newNames)
    setLastAction(`Добавлен сервер ${name}`)
    setRedistribution({ consistent: movedConsistent, modN: movedModN })
  }

  const removeServer = (name: string) => {
    if (serverNames.length <= 1) return
    const oldAssignments = hashKeys.map(k => k.assignedTo)

    const newNames = serverNames.filter(s => s !== name)
    const newNodes: HashNode[] = []
    for (const server of newNames) {
      if (useVirtualNodes) {
        for (let v = 0; v < VIRTUAL_COUNT; v++) {
          newNodes.push({
            name: `${server}-v${v}`,
            position: simpleHash(`${server}-v${v}`, RING_SIZE),
            isVirtual: v > 0,
            parentServer: server,
          })
        }
      } else {
        newNodes.push({
          name: server,
          position: simpleHash(server, RING_SIZE),
          isVirtual: false,
          parentServer: server,
        })
      }
    }

    const newAssignments = keys.map(k => findAssignedServer(simpleHash(k, RING_SIZE), newNodes))
    let movedConsistent = 0
    for (let i = 0; i < oldAssignments.length; i++) {
      if (oldAssignments[i] !== newAssignments[i]) movedConsistent++
    }

    const movedModN = calculateModNRedistribution(
      keys.map(k => ({ name: k, position: simpleHash(k, RING_SIZE) })),
      serverNames.length,
      newNames.length,
    )

    setServerNames(newNames)
    setLastAction(`Удалён сервер ${name}`)
    setRedistribution({ consistent: movedConsistent, modN: movedModN })
  }

  const addKey = () => {
    const keyTypes = ['user', 'order', 'product', 'session', 'cache']
    const type = keyTypes[Math.floor(Math.random() * keyTypes.length)]
    const id = Math.floor(Math.random() * 100) + 1
    const newKey = `${type}:${id}`
    if (!keys.includes(newKey)) {
      setKeys(prev => [...prev, newKey])
    }
    setRedistribution(null)
    setLastAction(`Добавлен ключ ${newKey}`)
  }

  const sortedNodes = [...nodes].sort((a, b) => a.position - b.position)

  // Colors for servers
  const serverColors: Record<string, string> = {}
  const colorPalette = ['#1976d2', '#388e3c', '#e65100', '#7b1fa2', '#c62828', '#00838f', '#4e342e', '#283593']
  serverNames.forEach((name, i) => {
    serverColors[name] = colorPalette[i % colorPalette.length]
  })

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Визуализатор Consistent Hashing</h2>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
        <button
          onClick={addServer}
          style={{ padding: '0.5rem 1rem', background: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          + Сервер
        </button>
        <button
          onClick={addKey}
          style={{ padding: '0.5rem 1rem', background: '#4caf50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          + Ключ
        </button>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={useVirtualNodes}
            onChange={(e) => { setUseVirtualNodes(e.target.checked); setRedistribution(null) }}
          />
          Virtual Nodes ({VIRTUAL_COUNT} на сервер)
        </label>
      </div>

      {/* Redistribution info */}
      {redistribution && lastAction && (
        <div style={{
          padding: '0.75rem 1rem',
          background: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          border: '1px solid #90caf9',
        }}>
          <strong>{lastAction}</strong>
          <br />
          Consistent Hashing: перемещено {redistribution.consistent} из {keys.length} ключей ({keys.length > 0 ? Math.round((redistribution.consistent / keys.length) * 100) : 0}%)
          <br />
          hash % N: перемещено бы {redistribution.modN} из {keys.length} ключей ({keys.length > 0 ? Math.round((redistribution.modN / keys.length) * 100) : 0}%)
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Servers on ring */}
        <div style={{
          padding: '1rem',
          background: '#fafafa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        }}>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem' }}>
            Серверы на кольце (0...{RING_SIZE - 1})
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#263238', color: 'white' }}>
                <th style={{ padding: '0.4rem', textAlign: 'left' }}>Узел</th>
                <th style={{ padding: '0.4rem', textAlign: 'right' }}>Позиция</th>
                <th style={{ padding: '0.4rem', textAlign: 'center' }}>Сервер</th>
                <th style={{ padding: '0.4rem', textAlign: 'center' }}>Действие</th>
              </tr>
            </thead>
            <tbody>
              {sortedNodes.map((node, i) => (
                <tr key={node.name} style={{ borderBottom: '1px solid #e0e0e0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '0.4rem', fontFamily: 'monospace' }}>
                    {node.isVirtual ? <span style={{ opacity: 0.6 }}>{node.name}</span> : <strong>{node.name}</strong>}
                  </td>
                  <td style={{ padding: '0.4rem', textAlign: 'right', fontFamily: 'monospace' }}>{node.position}</td>
                  <td style={{ padding: '0.4rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.15rem 0.4rem',
                      background: serverColors[node.parentServer] || '#999',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                    }}>
                      {node.parentServer}
                    </span>
                  </td>
                  <td style={{ padding: '0.4rem', textAlign: 'center' }}>
                    {!node.isVirtual && (
                      <button
                        onClick={() => removeServer(node.parentServer)}
                        disabled={serverNames.length <= 1}
                        style={{
                          padding: '0.15rem 0.4rem',
                          background: serverNames.length <= 1 ? '#ccc' : '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: serverNames.length <= 1 ? 'not-allowed' : 'pointer',
                          fontSize: '0.7rem',
                        }}
                      >
                        X
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Keys mapping */}
        <div style={{
          padding: '1rem',
          background: '#fafafa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        }}>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem' }}>
            Ключи ({hashKeys.length})
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#263238', color: 'white' }}>
                <th style={{ padding: '0.4rem', textAlign: 'left' }}>Ключ</th>
                <th style={{ padding: '0.4rem', textAlign: 'right' }}>Хэш</th>
                <th style={{ padding: '0.4rem', textAlign: 'center' }}>Сервер</th>
              </tr>
            </thead>
            <tbody>
              {hashKeys.sort((a, b) => a.position - b.position).map((key, i) => (
                <tr key={key.name} style={{ borderBottom: '1px solid #e0e0e0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '0.4rem', fontFamily: 'monospace' }}>{key.name}</td>
                  <td style={{ padding: '0.4rem', textAlign: 'right', fontFamily: 'monospace' }}>{key.position}</td>
                  <td style={{ padding: '0.4rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.15rem 0.4rem',
                      background: serverColors[key.assignedTo] || '#999',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                    }}>
                      {key.assignedTo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution stats */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: '#fafafa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
      }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem' }}>Распределение ключей по серверам</h3>
        {serverNames.map(name => {
          const count = distribution[name] || 0
          const pct = keys.length > 0 ? (count / keys.length) * 100 : 0
          const idealPct = 100 / serverNames.length
          return (
            <div key={name} style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.85rem' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    background: serverColors[name],
                    borderRadius: '2px',
                    marginRight: '0.3rem',
                    verticalAlign: 'middle',
                  }} />
                  Server {name}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>
                  {count} ключей ({pct.toFixed(1)}%) | идеал: {idealPct.toFixed(1)}%
                </span>
              </div>
              <div style={{ height: '20px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: serverColors[name],
                  borderRadius: '4px',
                  transition: 'width 0.3s',
                  minWidth: count > 0 ? '2px' : '0',
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// Задание 2.4: Проектирование балансировки
// ============================================

interface TrafficType {
  id: string
  name: string
  description: string
  characteristics: string
  correctLbLevel: string
  correctAlgorithm: string
  correctHealthCheck: string
  explanation: string
}

const trafficTypes: TrafficType[] = [
  {
    id: 'websocket',
    name: 'WebSocket',
    description: 'Долгоживущие соединения для чата и уведомлений в реальном времени. Клиент держит постоянное соединение с сервером.',
    characteristics: 'Persistent connections, stateful, long-lived',
    correctLbLevel: 'L7',
    correctAlgorithm: 'IP Hash / Consistent Hashing',
    correctHealthCheck: 'Active + Passive',
    explanation: 'WebSocket требует L7 для корректного Upgrade заголовка. IP Hash / Consistent Hashing обеспечивает sticky-поведение — один клиент всегда попадает на один сервер, что критично для постоянного соединения. Active health checks нужны для быстрого обнаружения падения (пользователи не смогут переподключиться к мёртвому серверу), passive — для отслеживания ошибок в реальном трафике.',
  },
  {
    id: 'rest',
    name: 'REST API',
    description: 'Короткие HTTP-запросы: CRUD операции, поиск, авторизация. Время обработки варьируется от 5 мс до 2 секунд.',
    characteristics: 'Short-lived, stateless, variable latency',
    correctLbLevel: 'L7',
    correctAlgorithm: 'Least Connections',
    correctHealthCheck: 'Active + Passive',
    explanation: 'L7 для маршрутизации по URL (разные endpoints → разные backend pools). Least Connections — лучший выбор при переменном времени обработки: серверы с тяжёлыми запросами автоматически получают меньше новых. Active + Passive health checks обеспечивают максимальную надёжность для API, от которого зависит всё приложение.',
  },
  {
    id: 'static',
    name: 'Static Files',
    description: 'Изображения, CSS, JS, видео. Контент не меняется, отлично кэшируется. Нагрузка в основном на I/O и сеть.',
    characteristics: 'Cacheable, read-only, I/O-heavy',
    correctLbLevel: 'L7',
    correctAlgorithm: 'Consistent Hashing',
    correctHealthCheck: 'Active',
    explanation: 'L7 для маршрутизации по URL (/static/* → отдельный пул). Consistent Hashing по URL — один и тот же файл всегда попадает на один сервер, что максимизирует попадание в кэш сервера (cache hit rate). При добавлении серверов перемещается минимум файлов. Active health check достаточен — статика проще, passive менее критичен.',
  },
]

const lbLevelOptions = ['L4', 'L7']
const algorithmOptions = [
  'Round Robin',
  'Weighted Round Robin',
  'Least Connections',
  'IP Hash / Consistent Hashing',
  'Consistent Hashing',
]
const healthCheckOptions = ['Active', 'Passive', 'Active + Passive']

export function Task2_4_Solution() {
  const [answers, setAnswers] = useState<Record<string, { lbLevel: string; algorithm: string; healthCheck: string }>>({})
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)

  const setAnswer = (id: string, field: 'lbLevel' | 'algorithm' | 'healthCheck', value: string) => {
    setAnswers(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  const reveal = (id: string) => {
    setRevealed(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const revealAll = () => {
    setShowAll(true)
    setRevealed(new Set(trafficTypes.map(t => t.id)))
  }

  const getScore = () => {
    let correct = 0
    let total = 0
    trafficTypes.forEach(tt => {
      const answer = answers[tt.id]
      if (answer) {
        total += 3
        if (answer.lbLevel === tt.correctLbLevel) correct++
        if (answer.algorithm === tt.correctAlgorithm) correct++
        if (answer.healthCheck === tt.correctHealthCheck) correct++
      }
    })
    return { correct, total }
  }

  const score = getScore()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Проектирование многоуровневой балансировки</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Система обрабатывает три типа трафика. Для каждого выберите уровень балансировщика, алгоритм и тип health check.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <button
          onClick={revealAll}
          style={{
            padding: '0.5rem 1rem',
            background: '#263238',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Показать все ответы
        </button>
        {score.total > 0 && (
          <span style={{ fontSize: '0.85rem', color: '#666' }}>
            Совпадений: {score.correct}/{score.total}
          </span>
        )}
      </div>

      {trafficTypes.map(tt => {
        const isRevealed = revealed.has(tt.id) || showAll
        const answer = answers[tt.id] || { lbLevel: '', algorithm: '', healthCheck: '' }
        const lbCorrect = answer.lbLevel === tt.correctLbLevel
        const algoCorrect = answer.algorithm === tt.correctAlgorithm
        const hcCorrect = answer.healthCheck === tt.correctHealthCheck

        return (
          <div
            key={tt.id}
            style={{
              marginBottom: '1rem',
              border: `1px solid ${isRevealed ? '#4caf50' : '#e0e0e0'}`,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '1rem', background: isRevealed ? '#f1f8e9' : '#fafafa' }}>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>{tt.name}</h3>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#666' }}>{tt.description}</p>
              <span style={{ padding: '0.2rem 0.5rem', background: '#e0e0e0', borderRadius: '4px', fontSize: '0.75rem' }}>
                {tt.characteristics}
              </span>
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid #e0e0e0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                    Уровень LB {isRevealed && (lbCorrect ? ' ✅' : answer.lbLevel ? ' ❌' : '')}
                  </label>
                  <select
                    value={answer.lbLevel}
                    onChange={(e) => setAnswer(tt.id, 'lbLevel', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    <option value="">Выберите...</option>
                    {lbLevelOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                    Алгоритм {isRevealed && (algoCorrect ? ' ✅' : answer.algorithm ? ' ❌' : '')}
                  </label>
                  <select
                    value={answer.algorithm}
                    onChange={(e) => setAnswer(tt.id, 'algorithm', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    <option value="">Выберите...</option>
                    {algorithmOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                    Health Check {isRevealed && (hcCorrect ? ' ✅' : answer.healthCheck ? ' ❌' : '')}
                  </label>
                  <select
                    value={answer.healthCheck}
                    onChange={(e) => setAnswer(tt.id, 'healthCheck', e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    <option value="">Выберите...</option>
                    {healthCheckOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!isRevealed && (
                <button
                  onClick={() => reveal(tt.id)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: 'white',
                    border: '1px solid #1976d2',
                    color: '#1976d2',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Показать ответ
                </button>
              )}

              {isRevealed && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', background: '#e8f5e9', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <strong>LB:</strong> {tt.correctLbLevel}
                    </div>
                    <div style={{ padding: '0.5rem', background: '#e8f5e9', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <strong>Алгоритм:</strong> {tt.correctAlgorithm}
                    </div>
                    <div style={{ padding: '0.5rem', background: '#e8f5e9', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <strong>HC:</strong> {tt.correctHealthCheck}
                    </div>
                  </div>
                  <div style={{ padding: '0.5rem', background: '#fff3e0', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <strong>Обоснование:</strong> {tt.explanation}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
