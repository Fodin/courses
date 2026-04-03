import { useState, useCallback } from 'react'

// ============================================
// Задание 15.1: Справочная карточка — Distributed Cache
// ============================================

export function Task15_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Distributed Cache (Redis-like) — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Consistent Hashing + Hash Slots</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Проблема</strong>: hash(key) % N при изменении N перемещает ~все ключи.
            <br /><br />
            <strong>Решение</strong>: consistent hashing ring с virtual nodes (vnodes).
            <br /><br />
            <strong>Redis Cluster</strong>: 16384 hash slots, CRC16(key) mod 16384.
            <br /><br />
            <strong>Rebalancing</strong>: перемещаем конкретные слоты, а не весь ring.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Replication (Leader-Follower)</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Async</strong>: leader не ждёт followers {'→'} быстрый write (1 мс), риск потери.
            <br /><br />
            <strong>Sync</strong>: leader ждёт ACK {'→'} нет потери, но медленнее.
            <br /><br />
            <strong>Failover</strong>: followers detect failure {'→'} elect new leader.
            <br /><br />
            <strong>Redis WAIT</strong>: semi-sync — ждать N реплик для критичных writes.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Gossip Protocol</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Принцип</strong>: каждая нода пингует случайную ноду раз в секунду.
            <br /><br />
            <strong>PFAIL</strong>: одна нода считает другую мёртвой (субъективно).
            <br /><br />
            <strong>FAIL</strong>: majority нод согласны {'→'} подтверждённый отказ.
            <br /><br />
            <strong>Преимущество</strong>: нет central coordinator (нет SPOF).
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Persistence: RDB + AOF</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>RDB</strong>: периодический snapshot, быстрый recovery, потеря 1-5 мин.
            <br /><br />
            <strong>AOF</strong>: журнал каждой операции, потеря {'≤'} 1 сек (fsync=everysec).
            <br /><br />
            <strong>Best practice</strong>: RDB + AOF вместе.
            <br /><br />
            <strong>fork()</strong>: RDB через child process + copy-on-write.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Eviction Policies</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>allkeys-lru</strong>: удалить давно не используемые (самый популярный).
            <br /><br />
            <strong>allkeys-lfu</strong>: удалить редко используемые (защита от scan).
            <br /><br />
            <strong>volatile-ttl</strong>: удалить ключи с наименьшим TTL.
            <br /><br />
            <strong>Approximate LRU</strong>: sampling 5 ключей {'→'} ~95% точности.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e0f2f1', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Split-Brain Protection</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Проблема</strong>: сетевой разрыв {'→'} два leader-а {'→'} расхождение данных.
            <br /><br />
            <strong>MIN_REPLICAS_TO_WRITE</strong>: leader требует N реплик для write.
            <br /><br />
            <strong>Majority quorum</strong>: minority partition перестаёт обслуживать.
            <br /><br />
            <strong>CAP</strong>: Redis выбирает AP, для CP — RedisRaft / etcd.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 15.2: Симулятор кластера
// ============================================

const TOTAL_SLOTS = 16384

interface ClusterNode {
  id: string
  name: string
  status: 'active' | 'failed'
  slots: [number, number][]  // Array of [start, end] ranges
  data: Map<string, string>
}

interface LogEntry {
  time: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
}

function simpleHash(key: string): number {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % TOTAL_SLOTS
}

function countSlots(node: ClusterNode): number {
  return node.slots.reduce((sum, [start, end]) => sum + (end - start + 1), 0)
}

function findNodeForSlot(nodes: ClusterNode[], slot: number): ClusterNode | null {
  for (const node of nodes) {
    for (const [start, end] of node.slots) {
      if (slot >= start && slot <= end) return node
    }
  }
  return null
}

function distributeSlots(nodeCount: number): [number, number][][] {
  const slotsPerNode = Math.floor(TOTAL_SLOTS / nodeCount)
  const remainder = TOTAL_SLOTS % nodeCount
  const result: [number, number][][] = []
  let current = 0

  for (let i = 0; i < nodeCount; i++) {
    const count = slotsPerNode + (i < remainder ? 1 : 0)
    result.push([[current, current + count - 1]])
    current += count
  }

  return result
}

function getTimestamp(): string {
  return new Date().toLocaleTimeString('ru-RU')
}

let nodeCounter = 0

function generateNodeName(): string {
  const names = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa']
  const name = names[nodeCounter % names.length]
  nodeCounter++
  return name
}

export function Task15_2_Solution() {
  const [nodes, setNodes] = useState<ClusterNode[]>(() => {
    nodeCounter = 0
    const slotDistribution = distributeSlots(3)
    return slotDistribution.map((slots, i) => ({
      id: `node-${i}`,
      name: generateNodeName(),
      status: 'active' as const,
      slots,
      data: new Map(),
    }))
  })
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: getTimestamp(), message: 'Кластер инициализирован: 3 ноды, 16384 слота', type: 'info' },
  ])
  const [keyInput, setKeyInput] = useState('')
  const [valueInput, setValueInput] = useState('')
  const [getKeyInput, setGetKeyInput] = useState('')
  const [getResult, setGetResult] = useState<string | null>(null)

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev.slice(-49), { time: getTimestamp(), message, type }])
  }, [])

  const handleAddNode = useCallback(() => {
    setNodes(prev => {
      const activeNodes = prev.filter(n => n.status === 'active')
      if (activeNodes.length === 0) return prev

      const newNodeName = generateNodeName()
      const newNodeId = `node-${Date.now()}`

      // Steal slots from each active node proportionally
      const totalActiveSlots = activeNodes.reduce((s, n) => s + countSlots(n), 0)
      const targetPerNode = Math.floor(totalActiveSlots / (activeNodes.length + 1))
      const slotsToTake = targetPerNode

      let stolenSlots: [number, number][] = []
      let remaining = slotsToTake
      const updatedNodes = prev.map(node => {
        if (node.status !== 'active' || remaining <= 0) return node
        const nodeSlotCount = countSlots(node)
        const toSteal = Math.min(
          Math.ceil(slotsToTake / activeNodes.length),
          remaining,
          Math.floor(nodeSlotCount / 2)
        )
        if (toSteal <= 0) return node

        // Take from the end of the last range
        const newSlots: [number, number][] = []
        let stolen = 0
        const sortedRanges = [...node.slots].sort((a, b) => a[0] - b[0])

        for (let i = sortedRanges.length - 1; i >= 0 && stolen < toSteal; i--) {
          const [start, end] = sortedRanges[i]
          const rangeSize = end - start + 1

          if (rangeSize <= toSteal - stolen) {
            stolenSlots.push([start, end])
            stolen += rangeSize
            sortedRanges.splice(i, 1)
          } else {
            const cutPoint = end - (toSteal - stolen) + 1
            stolenSlots.push([cutPoint, end])
            sortedRanges[i] = [start, cutPoint - 1]
            stolen = toSteal
          }
        }

        remaining -= stolen

        // Move data for stolen slots
        const newData = new Map(node.data)
        for (const [key] of node.data) {
          const slot = simpleHash(key)
          for (const [s, e] of stolenSlots) {
            if (slot >= s && slot <= e) {
              newData.delete(key)
              break
            }
          }
        }

        return { ...node, slots: sortedRanges, data: newData }
      })

      // Merge adjacent stolen slot ranges
      stolenSlots.sort((a, b) => a[0] - b[0])
      const mergedSlots: [number, number][] = []
      for (const range of stolenSlots) {
        if (mergedSlots.length > 0 && mergedSlots[mergedSlots.length - 1][1] + 1 === range[0]) {
          mergedSlots[mergedSlots.length - 1][1] = range[1]
        } else {
          mergedSlots.push([...range])
        }
      }

      const newNode: ClusterNode = {
        id: newNodeId,
        name: newNodeName,
        status: 'active',
        slots: mergedSlots,
        data: new Map(),
      }

      addLog(`Добавлена нода ${newNodeName}: получила ${countSlots(newNode)} слотов (rebalancing)`, 'success')
      return [...updatedNodes, newNode]
    })
  }, [addLog])

  const handleRemoveNode = useCallback((nodeId: string) => {
    setNodes(prev => {
      const nodeToRemove = prev.find(n => n.id === nodeId)
      if (!nodeToRemove) return prev
      const activeOthers = prev.filter(n => n.id !== nodeId && n.status === 'active')
      if (activeOthers.length === 0) {
        addLog(`Невозможно удалить ${nodeToRemove.name}: нет других активных нод`, 'error')
        return prev
      }

      const slotsToRedistribute = nodeToRemove.slots
      const slotsPerNode = Math.ceil(
        slotsToRedistribute.reduce((s, [a, b]) => s + (b - a + 1), 0) / activeOthers.length
      )

      // Flatten all slots to redistribute
      const allSlots: number[] = []
      for (const [start, end] of slotsToRedistribute) {
        for (let i = start; i <= end; i++) allSlots.push(i)
      }

      let idx = 0
      const updatedNodes = prev
        .filter(n => n.id !== nodeId)
        .map((node, nodeIdx) => {
          if (node.status !== 'active') return node
          const take = nodeIdx < activeOthers.length - 1
            ? slotsPerNode
            : allSlots.length - idx
          const newSlotNums = allSlots.slice(idx, idx + take)
          idx += take

          if (newSlotNums.length === 0) return node

          // Convert to ranges
          const newRanges: [number, number][] = []
          let rangeStart = newSlotNums[0]
          let rangeEnd = newSlotNums[0]
          for (let i = 1; i < newSlotNums.length; i++) {
            if (newSlotNums[i] === rangeEnd + 1) {
              rangeEnd = newSlotNums[i]
            } else {
              newRanges.push([rangeStart, rangeEnd])
              rangeStart = newSlotNums[i]
              rangeEnd = newSlotNums[i]
            }
          }
          newRanges.push([rangeStart, rangeEnd])

          return { ...node, slots: [...node.slots, ...newRanges].sort((a, b) => a[0] - b[0]) }
        })

      addLog(
        `Удалена нода ${nodeToRemove.name}: ${countSlots(nodeToRemove)} слотов перераспределены между ${activeOthers.length} нодами`,
        'warning'
      )
      return updatedNodes
    })
  }, [addLog])

  const handleKillNode = useCallback((nodeId: string) => {
    setNodes(prev =>
      prev.map(n => {
        if (n.id !== nodeId) return n
        addLog(`Нода ${n.name} УПАЛА! ${n.data.size} ключей недоступны. Слоты: ${countSlots(n)}`, 'error')
        return { ...n, status: 'failed' }
      })
    )
  }, [addLog])

  const handleRecoverNode = useCallback((nodeId: string) => {
    setNodes(prev =>
      prev.map(n => {
        if (n.id !== nodeId) return n
        addLog(`Нода ${n.name} восстановлена. Данные потеряны (${n.data.size} ключей). Слоты возвращены.`, 'success')
        return { ...n, status: 'active', data: new Map() }
      })
    )
  }, [addLog])

  const handlePut = useCallback(() => {
    if (!keyInput.trim() || !valueInput.trim()) return
    const slot = simpleHash(keyInput)
    const targetNode = findNodeForSlot(nodes, slot)

    if (!targetNode) {
      addLog(`PUT "${keyInput}": слот ${slot} не назначен ни одной ноде!`, 'error')
      return
    }

    if (targetNode.status === 'failed') {
      addLog(`PUT "${keyInput}": нода ${targetNode.name} недоступна (slot ${slot})! ОШИБКА`, 'error')
      return
    }

    setNodes(prev =>
      prev.map(n => {
        if (n.id !== targetNode.id) return n
        const newData = new Map(n.data)
        newData.set(keyInput, valueInput)
        return { ...n, data: newData }
      })
    )
    addLog(`PUT "${keyInput}" = "${valueInput}" → slot ${slot} → ${targetNode.name}`, 'success')
    setKeyInput('')
    setValueInput('')
  }, [keyInput, valueInput, nodes, addLog])

  const handleGet = useCallback(() => {
    if (!getKeyInput.trim()) return
    const slot = simpleHash(getKeyInput)
    const targetNode = findNodeForSlot(nodes, slot)

    if (!targetNode) {
      addLog(`GET "${getKeyInput}": слот ${slot} не назначен!`, 'error')
      setGetResult('ERROR: slot unassigned')
      return
    }

    if (targetNode.status === 'failed') {
      addLog(`GET "${getKeyInput}": нода ${targetNode.name} недоступна (slot ${slot})!`, 'error')
      setGetResult(`ERROR: node ${targetNode.name} is down`)
      return
    }

    const value = targetNode.data.get(getKeyInput)
    if (value !== undefined) {
      addLog(`GET "${getKeyInput}" → slot ${slot} → ${targetNode.name} → "${value}"`, 'success')
      setGetResult(value)
    } else {
      addLog(`GET "${getKeyInput}" → slot ${slot} → ${targetNode.name} → (nil) cache miss`, 'info')
      setGetResult('(nil)')
    }
  }, [getKeyInput, nodes, addLog])

  const totalSlots = nodes.reduce((sum, n) => sum + countSlots(n), 0)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Симулятор Redis Cluster</h2>

      {/* Cluster overview */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleAddNode}
          style={{
            padding: '0.5rem 1rem',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          + Add Node
        </button>
        <span style={{ alignSelf: 'center', fontSize: '0.85rem', color: '#666' }}>
          Нод: {nodes.length} | Слотов назначено: {totalSlots} / {TOTAL_SLOTS}
          {totalSlots !== TOTAL_SLOTS && (
            <span style={{ color: '#f44336', fontWeight: 'bold' }}> (ПОТЕРЯ СЛОТОВ!)</span>
          )}
        </span>
      </div>

      {/* Nodes table */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>Ноды кластера</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Нода</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Статус</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Слоты</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Кол-во</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Ключей</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Распределение</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map(node => {
              const slotCount = countSlots(node)
              const pct = ((slotCount / TOTAL_SLOTS) * 100).toFixed(1)
              const isActive = node.status === 'active'
              return (
                <tr key={node.id} style={{ background: isActive ? 'white' : '#ffebee' }}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                    {node.name}
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                    <span
                      style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        background: isActive ? '#e8f5e9' : '#ffcdd2',
                        color: isActive ? '#2e7d32' : '#c62828',
                      }}
                    >
                      {isActive ? 'ACTIVE' : 'FAILED'}
                    </span>
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    {node.slots.map(([s, e]) => `${s}-${e}`).join(', ')}
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                    {slotCount}
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                    {node.data.size}
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                    <div
                      style={{
                        height: '16px',
                        background: '#e0e0e0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        minWidth: '100px',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: isActive
                            ? 'linear-gradient(90deg, #66bb6a, #43a047)'
                            : 'linear-gradient(90deg, #ef5350, #c62828)',
                          borderRadius: '8px',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#888' }}>{pct}%</span>
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                      {isActive ? (
                        <>
                          <button
                            onClick={() => handleKillNode(node.id)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                            }}
                          >
                            Kill
                          </button>
                          <button
                            onClick={() => handleRemoveNode(node.id)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: '#ff9800',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                            }}
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleRecoverNode(node.id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#2196f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          Recover
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* PUT / GET */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>PUT key/value</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              placeholder="key"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', flex: 1, minWidth: '80px' }}
            />
            <input
              placeholder="value"
              value={valueInput}
              onChange={e => setValueInput(e.target.value)}
              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', flex: 1, minWidth: '80px' }}
            />
            <button
              onClick={handlePut}
              style={{
                padding: '0.4rem 1rem',
                background: '#43a047',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              SET
            </button>
          </div>
          {keyInput && (
            <div style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: '#666' }}>
              hash slot: {simpleHash(keyInput)}
            </div>
          )}
        </div>

        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>GET key</h4>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              placeholder="key"
              value={getKeyInput}
              onChange={e => setGetKeyInput(e.target.value)}
              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
            />
            <button
              onClick={handleGet}
              style={{
                padding: '0.4rem 1rem',
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              GET
            </button>
          </div>
          {getResult !== null && (
            <div
              style={{
                marginTop: '0.5rem',
                padding: '0.4rem',
                background: getResult.startsWith('ERROR') ? '#ffcdd2' : '#f5f5f5',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
              }}
            >
              {getResult}
            </div>
          )}
        </div>
      </div>

      {/* Event log */}
      <div>
        <h3 style={{ margin: '0 0 0.5rem' }}>Лог событий</h3>
        <div
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '0.5rem',
            background: '#fafafa',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
          }}
        >
          {logs.map((log, i) => (
            <div
              key={i}
              style={{
                padding: '0.2rem 0',
                borderBottom: '1px solid #f0f0f0',
                color:
                  log.type === 'error'
                    ? '#c62828'
                    : log.type === 'success'
                      ? '#2e7d32'
                      : log.type === 'warning'
                        ? '#e65100'
                        : '#333',
              }}
            >
              <span style={{ color: '#999' }}>[{log.time}]</span> {log.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 15.3: Полный System Design — Distributed Cache
// ============================================

interface DesignSection {
  title: string
  content: string
}

const designSections: DesignSection[] = [
  {
    title: '1. Requirements & Estimates',
    content: `Functional: GET/SET/DELETE (sub-ms), TTL, atomic counters (INCR/DECR),
data structures (strings, hashes, lists, sets, sorted sets), Pub/Sub.

Use cases: user profiles, session data, timelines, counters (likes, followers),
feed cache, rate limiting, leaderboards.

Non-Functional: 500M users, 200M DAU, 2M cache RPS (peak), <1ms p99 latency,
50 TB hot data, 99.99% availability, ≤1 sec data loss on crash.

Back-of-the-envelope:
- 50 TB / 64 GB per node ≈ 800 primary nodes
- Replication factor 3 → 2400 total nodes
- 2M RPS / 800 nodes ≈ 2500 RPS per node (легко для Redis: 100K+ RPS/node)
- Memory overhead: ~70 bytes metadata per key
- 50 TB / 1 KB avg value ≈ 50B keys × 70 bytes ≈ 3.5 TB overhead (7%)`,
  },
  {
    title: '2. Data Partitioning (Hash Slots)',
    content: `Strategy: 16384 hash slots, CRC16(key) mod 16384.

Распределение: 16384 slots / 800 nodes ≈ 20 slots per node.
Каждый slot ≈ 50 TB / 16384 ≈ 3 GB data.

Multi-key operations: hash tags {user:42}.profile, {user:42}.timeline →
оба ключа на одной ноде (hash по содержимому {}).

Hot key mitigation (celebrity profiles):
1. Local cache на application servers (TTL 5 sec)
2. Key sharding: user:42:profile:{0-9} → 10 копий на разных нодах
3. Read from followers (READONLY mode) → 3x read capacity

Rebalancing при добавлении ноды:
- CLUSTER SETSLOT <slot> MIGRATING → IMPORTING → NODE
- Live migration: ключи переносятся по одному, клиент получает ASK redirect`,
  },
  {
    title: '3. Replication & Failover',
    content: `Topology: каждый primary (leader) + 2 followers (replicas).
800 primaries × 3 = 2400 total Redis instances.

Replication: async по умолчанию (replication lag ~1 ms).
Для критичных данных: WAIT 1 1000 (ждать ACK от 1 реплики, timeout 1 sec).

Automatic Failover:
1. Gossip: followers отправляют PING leader-у каждые 100 ms
2. PFAIL: нет PONG в течение cluster-node-timeout (15 sec)
3. Followers gossip PFAIL → majority agrees → FAIL
4. Best follower (min replication offset) → promotes to leader
5. Клиенты получают MOVED redirect

Failover time: 15 sec detection + ~2 sec election = ~17 sec unavailability.
Данные потеряны: writes за последнюю ~1 sec (async replication lag).

Split-brain protection:
- min-replicas-to-write: 1 (leader нужна хотя бы 1 реплика)
- min-replicas-max-lag: 10 (максимальный replication lag в секундах)
- Minority partition: не набирает majority → не выбирает нового leader`,
  },
  {
    title: '4. Memory Management & Eviction',
    content: `Eviction policy: allkeys-lfu.
Почему LFU для social network:
- Профили знаменитостей = high frequency → остаются в кэше
- One-time scan (migration, analytics) не вытесняет hot keys
- LRU вытеснил бы celebrity profiles при массовом scan

maxmemory: 58 GB из 64 GB (overhead для fragmentation, child process fork).

Large keys — проблема для latency:
- Timeline list 10K items × 1 KB = 10 MB → LRANGE O(N)
- Решение: paginate (LRANGE 0 100), или sorted set с score = timestamp
- Lazy deletion: UNLINK вместо DEL (async в background thread)

Memory optimization:
- ziplist encoding для small hashes/lists (<128 elements)
- intset для sets of integers
- Redis object sharing для small integers (0-9999)
- Сжатие values на application level (gzip for JSON > 1KB)`,
  },
  {
    title: '5. Persistence & Recovery',
    content: `RDB: BGSAVE каждые 5 минут.
- fork() + copy-on-write → parent continues serving
- На 64 GB: fork ~1 sec, snapshot ~30 sec write
- ⚠️ Peak memory: 64 GB × 2 (worst case copy-on-write) → нужен запас RAM

AOF: appendfsync everysec.
- Потеря ≤ 1 секунды при крахе
- AOF rewrite (compaction) раз в час или при размере 2x
- Rewrite: fork → child writes compact AOF → atomic rename

Recovery priority: AOF (более полный) → RDB (fallback).

Warm-up strategy после полного restart:
1. Загрузить RDB/AOF → восстановить RAM state (~5-10 min для 64 GB)
2. Не всё нужно warm up: ждать natural cache misses
3. Для critical data (sessions): pre-warm из БД batch-запросами
4. Rate limit warm-up: не более 10K QPS к БД (не перегрузить)

Backup: RDB-файлы → S3 каждый час. 2400 nodes × 64 GB RDB ≈ 150 TB backup.`,
  },
  {
    title: '6. Caching Patterns',
    content: `Pattern: Cache-Aside (lazy loading).
Read: cache hit → return. Cache miss → read DB → write cache → return.
Write: write DB → delete cache (не update! — избежать race condition).

Cache stampede protection:
1. Singleflight / distributed lock: первый запрос блокирует, остальные ждут
2. Probabilistic early expiration: обновить кэш ДО истечения TTL
   refresh_at = ttl - ttl * beta * ln(random())
3. Stale-while-revalidate: отдать stale, обновить в background

Invalidation:
- Event-driven: App → Kafka → Cache Invalidation Service → redis.del(key)
- TTL-based: 5 min для profiles, 30 sec для counters, 1 min для timelines
- Hybrid: Kafka для immediate invalidation + TTL как safety net

Write-behind (для counters):
- INCR likes:post:123 в Redis (мгновенно)
- Background worker: batch flush в DB каждые 10 sec
- Риск: потеря ~10 sec updates при крахе Redis node`,
  },
  {
    title: '7. Monitoring & Observability',
    content: `Key metrics:
- Cache hit rate: target > 95% (ниже → пересмотреть TTL, eviction, capacity)
- Memory usage: alert at 80%, critical at 90%
- Replication lag: alert at > 1 sec (risk of data loss on failover)
- Eviction rate: высокий → нужно больше памяти или пересмотр TTL
- Connected clients: мониторить connection leaks
- Slow log: команды > 10 ms (KEYS, LRANGE на большие lists)
- Keyspace misses: trending up → возможно thundering herd

Alerting:
- PagerDuty: node down, split-brain detected, memory > 95%
- Slack: hit rate < 90%, replication lag > 5 sec, eviction spike
- Dashboard: Grafana с Redis Exporter (Prometheus)

Capacity planning:
- Growth: +20% data per quarter → plan node additions ahead
- Seasonal peaks: pre-scale before events (Black Friday, New Year)`,
  },
]

export function Task15_3_Solution() {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]))

  const toggleSection = useCallback((index: number) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    setOpenSections(new Set(designSections.map((_, i) => i)))
  }, [])

  const collapseAll = useCallback(() => {
    setOpenSections(new Set())
  }, [])

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>System Design: Distributed Cache для социальной сети</h2>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
        50 TB hot data, 2M RPS, 500M users, 99.99% availability, {'<'}1 ms p99 latency
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={expandAll}
          style={{
            padding: '0.4rem 0.8rem',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          Раскрыть всё
        </button>
        <button
          onClick={collapseAll}
          style={{
            padding: '0.4rem 0.8rem',
            background: '#757575',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          Свернуть всё
        </button>
      </div>

      {designSections.map((section, i) => {
        const isOpen = openSections.has(i)
        return (
          <div
            key={i}
            style={{
              marginBottom: '0.5rem',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => toggleSection(i)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: isOpen ? '#e3f2fd' : '#fafafa',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                textAlign: 'left',
              }}
            >
              <span>{section.title}</span>
              <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                ▼
              </span>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: '1rem',
                  background: 'white',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  fontFamily: 'monospace',
                }}
              >
                {section.content}
              </div>
            )}
          </div>
        )
      })}

      {/* Architecture overview */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        }}
      >
        <h3 style={{ margin: '0 0 0.5rem' }}>Итоговая архитектура</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Компонент</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Решение</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Обоснование</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Partitioning', '16384 hash slots', 'Простая миграция слотов, CRC16 routing'],
              ['Replication', 'Async leader + 2 followers', 'Sub-ms writes, WAIT для critical data'],
              ['Membership', 'Gossip protocol', 'Децентрализованный, нет SPOF'],
              ['Eviction', 'allkeys-lfu', 'Защита от scan, hot keys остаются'],
              ['Persistence', 'RDB (5 min) + AOF (everysec)', 'Fast recovery + min data loss'],
              ['Routing', 'Smart client (JedisCluster)', 'No proxy hop, MOVED/ASK redirects'],
              ['Invalidation', 'Kafka events + TTL safety net', 'Immediate + guaranteed eventual'],
              ['Hot keys', 'Local cache + key sharding', 'Распределение нагрузки celebrity profiles'],
            ].map(([component, solution, reason], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                  {component}
                </td>
                <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #eee' }}>{solution}</td>
                <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #eee', color: '#666' }}>
                  {reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
