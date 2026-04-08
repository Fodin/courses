// ============================================
// Level 5: RabbitMQ Exchange Types — Solutions
// ============================================

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Task 5.1: Direct Exchange — routing by key
// ============================================

interface DirectBinding {
  queue: string
  routingKey: string
  color: string
  bgColor: string
  messages: string[]
}

interface DirectMessage {
  id: number
  routingKey: string
  payload: string
  timestamp: string
}

const initialDirectBindings: DirectBinding[] = [
  { queue: 'orders.new', routingKey: 'order.created', color: '#1565C0', bgColor: '#E3F2FD', messages: [] },
  { queue: 'orders.paid', routingKey: 'order.paid', color: '#2E7D32', bgColor: '#E8F5E9', messages: [] },
  { queue: 'orders.cancelled', routingKey: 'order.cancelled', color: '#C62828', bgColor: '#FFEBEE', messages: [] },
  { queue: 'notifications', routingKey: 'order.created', color: '#6A1B9A', bgColor: '#F3E5F5', messages: [] },
]

const directRoutingKeys = ['order.created', 'order.paid', 'order.cancelled', 'order.shipped', 'user.registered']

export function Task5_1_Solution() {
  const { t } = useLanguage()
  const [bindings, setBindings] = useState<DirectBinding[]>(initialDirectBindings)
  const [selectedKey, setSelectedKey] = useState('order.created')
  const [customKey, setCustomKey] = useState('')
  const [animating, setAnimating] = useState<string[]>([])
  const [log, setLog] = useState<DirectMessage[]>([])
  const [messageCount, setMessageCount] = useState(0)

  const publish = () => {
    const key = customKey.trim() || selectedKey
    const ts = new Date().toLocaleTimeString()
    const matched: string[] = []

    const updated = bindings.map(b => {
      if (b.routingKey === key) {
        matched.push(b.queue)
        return { ...b, messages: [`[${ts}] routing_key="${key}"`, ...b.messages.slice(0, 4)] }
      }
      return b
    })

    setBindings(updated)
    setAnimating(matched)
    setMessageCount(c => c + 1)

    const newMsg: DirectMessage = {
      id: messageCount + 1,
      routingKey: key,
      payload: `{ "id": ${messageCount + 1}, "routing_key": "${key}" }`,
      timestamp: ts,
    }
    setLog(prev => [newMsg, ...prev.slice(0, 9)])

    setTimeout(() => setAnimating([]), 900)
  }

  const clearQueues = () => {
    setBindings(bindings.map(b => ({ ...b, messages: [] })))
    setLog([])
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Direct Exchange направляет сообщение только в те очереди, у которых routing key точно совпадает с ключом сообщения.
      </p>

      {/* Architecture diagram */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0',
          marginBottom: '1.5rem',
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '1.25rem',
          overflowX: 'auto',
        }}
      >
        {/* Producer */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px' }}>
          <div
            style={{
              border: '2px solid #1565C0',
              borderRadius: '8px',
              padding: '0.75rem',
              background: '#E3F2FD',
              textAlign: 'center',
              width: '100px',
            }}
          >
            <div style={{ fontSize: '1.5rem' }}>📤</div>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1565C0' }}>Producer</div>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px', textAlign: 'center' }}>
            routing_key=<br />
            <span style={{ fontFamily: 'monospace', color: '#1565C0', fontWeight: 700 }}>
              "{customKey.trim() || selectedKey}"
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', marginTop: '20px', flexShrink: 0 }}>
          <div style={{ color: '#999', fontSize: '0.7rem', marginRight: '4px' }}>PUBLISH</div>
          <div style={{ fontSize: '1.2rem', color: '#888' }}>→</div>
        </div>

        {/* Exchange */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px' }}>
          <div
            style={{
              border: '2px solid #E65100',
              borderRadius: '8px',
              padding: '0.75rem',
              background: '#FFF3E0',
              textAlign: 'center',
              width: '100px',
            }}
          >
            <div style={{ fontSize: '1.5rem' }}>🔀</div>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#E65100' }}>Direct</div>
            <div style={{ fontSize: '0.7rem', color: '#888' }}>Exchange</div>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px' }}>exact match</div>
        </div>

        {/* Bindings lines and queues */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, marginLeft: '0.5rem' }}>
          {bindings.map(b => {
            const isMatch = b.routingKey === (customKey.trim() || selectedKey)
            const isAnimating = animating.includes(b.queue)
            return (
              <div key={b.queue} style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                {/* Binding line */}
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: '0.65rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: isMatch ? b.bgColor : '#f5f5f5',
                      border: `1px solid ${isMatch ? b.color : '#ddd'}`,
                      color: isMatch ? b.color : '#999',
                      fontFamily: 'monospace',
                      fontWeight: isMatch ? 700 : 400,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {b.routingKey}
                  </div>
                  <div
                    style={{
                      width: '30px',
                      height: '2px',
                      background: isAnimating ? b.color : (isMatch ? b.color : '#ddd'),
                      transition: 'background 0.3s',
                      position: 'relative',
                    }}
                  >
                    {isAnimating && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          left: '50%',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: b.color,
                          animation: 'none',
                          transform: 'translateX(-50%)',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ fontSize: '1rem', color: isMatch ? b.color : '#ccc' }}>→</div>
                </div>

                {/* Queue */}
                <div
                  style={{
                    border: `2px solid ${isAnimating ? b.color : (isMatch ? b.color : '#ddd')}`,
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    background: isAnimating ? b.bgColor : (isMatch ? b.bgColor : '#fff'),
                    transition: 'all 0.3s',
                    minWidth: '160px',
                    flex: 1,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: b.color, fontFamily: 'monospace' }}>
                      {b.queue}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        background: b.messages.length > 0 ? b.bgColor : '#f5f5f5',
                        color: b.messages.length > 0 ? b.color : '#999',
                        border: `1px solid ${b.messages.length > 0 ? b.color : '#ddd'}`,
                      }}
                    >
                      {b.messages.length} msg
                    </span>
                  </div>
                  {b.messages.length > 0 && (
                    <div
                      style={{
                        fontSize: '0.65rem',
                        color: '#666',
                        fontFamily: 'monospace',
                        marginTop: '4px',
                        borderTop: '1px solid #eee',
                        paddingTop: '4px',
                      }}
                    >
                      {b.messages[0]}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Выбрать routing key</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {directRoutingKeys.map(key => (
              <button
                key={key}
                onClick={() => { setSelectedKey(key); setCustomKey('') }}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: `2px solid ${selectedKey === key && !customKey ? '#E65100' : '#ddd'}`,
                  borderRadius: '6px',
                  background: selectedKey === key && !customKey ? '#FFF3E0' : '#fff',
                  color: selectedKey === key && !customKey ? '#E65100' : '#333',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  fontWeight: selectedKey === key && !customKey ? 700 : 400,
                }}
              >
                {key}
              </button>
            ))}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <input
                value={customKey}
                onChange={e => setCustomKey(e.target.value)}
                placeholder="свой ключ..."
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: `2px solid ${customKey ? '#E65100' : '#ddd'}`,
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Публикация</h3>
          <div
            style={{
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ color: '#888', marginBottom: '4px' }}>// AMQP publish</div>
            <div>channel.<span style={{ color: '#E65100' }}>basicPublish</span>(</div>
            <div style={{ paddingLeft: '1rem' }}>
              exchange: <span style={{ color: '#2E7D32' }}>"orders"</span>,
            </div>
            <div style={{ paddingLeft: '1rem' }}>
              routingKey: <span style={{ color: '#1565C0' }}>"{customKey.trim() || selectedKey}"</span>,
            </div>
            <div style={{ paddingLeft: '1rem' }}>
              body: <span style={{ color: '#6A1B9A' }}>"{`{ id: ${messageCount + 1} }`}"</span>
            </div>
            <div>)</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={publish}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#E65100',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              Опубликовать
            </button>
            <button
              onClick={clearQueues}
              style={{
                padding: '0.75rem 1rem',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Очистить
            </button>
          </div>

          {/* Routing result */}
          {log.length > 0 && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#1a1a2e',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#00ff88',
                maxHeight: '150px',
                overflowY: 'auto',
              }}
            >
              {log.map(msg => {
                const matched = bindings.filter(b => b.routingKey === msg.routingKey)
                return (
                  <div key={msg.id} style={{ marginBottom: '6px' }}>
                    <div style={{ color: '#88aaff' }}>[{msg.timestamp}] PUBLISH routing_key="{msg.routingKey}"</div>
                    {matched.length > 0 ? (
                      matched.map(b => (
                        <div key={b.queue}>→ ROUTE → {b.queue}</div>
                      ))
                    ) : (
                      <div style={{ color: '#ff6666' }}>→ UNROUTABLE (нет совпадений)</div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          padding: '1rem',
          background: '#E3F2FD',
          borderRadius: '8px',
          fontSize: '0.85rem',
          border: '1px solid #90CAF9',
        }}
      >
        <strong>Как работает Direct Exchange:</strong>
        <ul style={{ margin: '0.5rem 0 0 1.25rem', lineHeight: '1.7' }}>
          <li>Сообщение маршрутизируется во все очереди, у которых binding key == routing key</li>
          <li>Одна очередь может иметь несколько binding keys</li>
          <li>Один routing key может связывать несколько очередей (fanout поведение)</li>
          <li>Если совпадений нет — сообщение теряется (или идёт в alternate exchange)</li>
        </ul>
      </div>
    </div>
  )
}

// ============================================
// Task 5.2: Fanout Exchange — broadcast
// ============================================

interface FanoutQueue {
  id: string
  name: string
  color: string
  bgColor: string
  messages: string[]
  active: boolean
}

export function Task5_2_Solution() {
  const { t } = useLanguage()
  const [queues, setQueues] = useState<FanoutQueue[]>([
    { id: 'q1', name: 'email-notifications', color: '#1565C0', bgColor: '#E3F2FD', messages: [], active: true },
    { id: 'q2', name: 'push-notifications', color: '#2E7D32', bgColor: '#E8F5E9', messages: [], active: true },
    { id: 'q3', name: 'analytics-events', color: '#6A1B9A', bgColor: '#F3E5F5', messages: [], active: true },
  ])
  const [animating, setAnimating] = useState(false)
  const [routingKey, setRoutingKey] = useState('user.registered')
  const [messageCount, setMessageCount] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const [newQueueName, setNewQueueName] = useState('')

  const queueColors = [
    { color: '#E65100', bgColor: '#FFF3E0' },
    { color: '#00838F', bgColor: '#E0F7FA' },
    { color: '#AD1457', bgColor: '#FCE4EC' },
  ]

  const publish = () => {
    const activeQueues = queues.filter(q => q.active)
    const ts = new Date().toLocaleTimeString()
    const count = messageCount + 1
    setMessageCount(count)
    setAnimating(true)

    setTimeout(() => {
      setQueues(prev =>
        prev.map(q => {
          if (!q.active) return q
          return {
            ...q,
            messages: [
              `[${ts}] msg#${count} routing_key="${routingKey}"`,
              ...q.messages.slice(0, 4),
            ],
          }
        })
      )
      setLog(prev => [
        `[${ts}] FANOUT msg#${count} → ${activeQueues.length} очередей: ${activeQueues.map(q => q.name).join(', ')}`,
        ...prev.slice(0, 9),
      ])
      setAnimating(false)
    }, 600)
  }

  const toggleQueue = (id: string) => {
    setQueues(prev => prev.map(q => q.id === id ? { ...q, active: !q.active } : q))
  }

  const addQueue = () => {
    const name = newQueueName.trim()
    if (!name) return
    const colorIdx = queues.length % queueColors.length
    setQueues(prev => [
      ...prev,
      {
        id: `q${Date.now()}`,
        name,
        ...queueColors[colorIdx],
        messages: [],
        active: true,
      },
    ])
    setNewQueueName('')
  }

  const removeQueue = (id: string) => {
    setQueues(prev => prev.filter(q => q.id !== id))
  }

  const clearAll = () => {
    setQueues(prev => prev.map(q => ({ ...q, messages: [] })))
    setLog([])
  }

  const activeCount = queues.filter(q => q.active).length

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Fanout Exchange рассылает каждое сообщение во ВСЕ привязанные очереди. Routing key полностью игнорируется.
      </p>

      {/* Visual */}
      <div
        style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Producer */}
          <div style={{ textAlign: 'center', minWidth: '100px' }}>
            <div
              style={{
                border: '2px solid #1565C0',
                borderRadius: '8px',
                padding: '0.75rem',
                background: '#E3F2FD',
              }}
            >
              <div style={{ fontSize: '1.5rem' }}>📤</div>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1565C0' }}>Producer</div>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '4px', fontFamily: 'monospace' }}>
              key="{routingKey.slice(0, 10)}"<br/>(игнорируется)
            </div>
          </div>

          <div style={{ textAlign: 'center', color: '#999' }}>
            <div style={{ fontSize: '0.65rem', color: '#888' }}>PUBLISH</div>
            <div style={{ fontSize: '1.5rem' }}>→</div>
          </div>

          {/* Exchange */}
          <div style={{ textAlign: 'center', minWidth: '100px' }}>
            <div
              style={{
                border: `3px solid ${animating ? '#E65100' : '#E65100'}`,
                borderRadius: '8px',
                padding: '0.75rem',
                background: animating ? '#FFE0B2' : '#FFF3E0',
                transition: 'background 0.3s',
              }}
            >
              <div style={{ fontSize: '1.5rem' }}>📢</div>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#E65100' }}>Fanout</div>
              <div style={{ fontSize: '0.7rem', color: '#888' }}>Exchange</div>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '4px' }}>
              broadcast → {activeCount} очередей
            </div>
          </div>

          {/* Fan arrows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            {queues.map(q => (
              <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: q.active ? 1 : 0.35 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  <div
                    style={{
                      width: '40px',
                      height: '2px',
                      background: animating && q.active ? q.color : '#ddd',
                      transition: 'background 0.3s',
                    }}
                  />
                  <span style={{ color: animating && q.active ? q.color : '#ccc', fontSize: '1rem' }}>→</span>
                </div>
                <div
                  style={{
                    flex: 1,
                    border: `2px solid ${animating && q.active ? q.color : q.active ? q.color : '#ddd'}`,
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    background: animating && q.active ? q.bgColor : q.active ? '#fff' : '#f9f9f9',
                    transition: 'all 0.3s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: q.active ? q.color : '#aaa', fontFamily: 'monospace' }}>
                      {q.name}
                    </div>
                    {q.messages.length > 0 && q.active && (
                      <div style={{ fontSize: '0.65rem', color: '#666', fontFamily: 'monospace', marginTop: '2px' }}>
                        {q.messages[0]}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        background: q.active ? q.bgColor : '#f5f5f5',
                        color: q.active ? q.color : '#aaa',
                        border: `1px solid ${q.active ? q.color : '#ddd'}`,
                      }}
                    >
                      {q.messages.length} msg
                    </span>
                    <button
                      onClick={() => toggleQueue(q.id)}
                      title={q.active ? 'Отключить binding' : 'Подключить binding'}
                      style={{
                        padding: '2px 6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: q.active ? '#fff' : '#f5f5f5',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        color: q.active ? '#C62828' : '#2E7D32',
                      }}
                    >
                      {q.active ? 'unbind' : 'bind'}
                    </button>
                    <button
                      onClick={() => removeQueue(q.id)}
                      title="Удалить очередь"
                      style={{
                        padding: '2px 6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        color: '#888',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Управление</h3>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '4px' }}>
              Routing key (игнорируется Fanout):
            </label>
            <input
              value={routingKey}
              onChange={e => setRoutingKey(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={publish}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#E65100',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Broadcast
            </button>
            <button
              onClick={clearAll}
              style={{
                padding: '0.75rem 1rem',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Очистить
            </button>
          </div>

          {/* Add queue */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              value={newQueueName}
              onChange={e => setNewQueueName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addQueue()}
              placeholder="новая очередь..."
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
              }}
            />
            <button
              onClick={addQueue}
              style={{
                padding: '0.5rem 0.75rem',
                background: '#2E7D32',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              + Bind
            </button>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Лог рассылок</h3>
          {log.length > 0 ? (
            <div
              style={{
                background: '#1a1a2e',
                color: '#00ff88',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                padding: '0.75rem',
                borderRadius: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
                lineHeight: '1.6',
              }}
            >
              {log.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#999',
                border: '2px dashed #ddd',
                borderRadius: '8px',
                fontSize: '0.85rem',
              }}
            >
              Нажмите "Broadcast" для отправки
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          padding: '1rem',
          background: '#E8F5E9',
          borderRadius: '8px',
          fontSize: '0.85rem',
          border: '1px solid #A5D6A7',
        }}
      >
        <strong>Сценарии использования Fanout Exchange:</strong>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
          {[
            { icon: '📧', text: 'Уведомления пользователям (email + push + SMS)' },
            { icon: '📊', text: 'Рассылка событий в несколько аналитических систем' },
            { icon: '🔄', text: 'Cache invalidation во всех нодах кластера' },
            { icon: '📡', text: 'Трансляция live-данных нескольким потребителям' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 5.3: Topic Exchange — wildcard routing
// ============================================

interface TopicBinding {
  id: string
  pattern: string
  queue: string
  color: string
  bgColor: string
}

const initialTopicBindings: TopicBinding[] = [
  { id: 'b1', pattern: 'order.#', queue: 'all-orders', color: '#1565C0', bgColor: '#E3F2FD' },
  { id: 'b2', pattern: 'order.created.*', queue: 'new-orders', color: '#2E7D32', bgColor: '#E8F5E9' },
  { id: 'b3', pattern: '*.paid.*', queue: 'payments', color: '#6A1B9A', bgColor: '#F3E5F5' },
  { id: 'b4', pattern: 'user.#', queue: 'user-events', color: '#E65100', bgColor: '#FFF3E0' },
  { id: 'b5', pattern: '#.error', queue: 'error-handler', color: '#C62828', bgColor: '#FFEBEE' },
]

function matchTopicPattern(pattern: string, key: string): boolean {
  const pp = pattern.split('.')
  const kp = key.split('.')
  let pi = 0
  let ki = 0
  while (pi < pp.length && ki < kp.length) {
    if (pp[pi] === '#') {
      // # matches zero or more words
      if (pi === pp.length - 1) return true
      // try to match remaining pattern against remaining key
      for (let j = ki; j <= kp.length; j++) {
        if (matchTopicPattern(pp.slice(pi + 1).join('.'), kp.slice(j).join('.'))) return true
      }
      return false
    } else if (pp[pi] === '*') {
      pi++
      ki++
    } else if (pp[pi] === kp[ki]) {
      pi++
      ki++
    } else {
      return false
    }
  }
  // consume trailing # patterns
  while (pi < pp.length && pp[pi] === '#') pi++
  return pi === pp.length && ki === kp.length
}

function highlightPattern(pattern: string, key: string): React.ReactNode[] {
  const pp = pattern.split('.')
  const kp = key.split('.')
  const result: React.ReactNode[] = []

  pp.forEach((seg, idx) => {
    if (idx > 0) result.push(<span key={`dot-${idx}`} style={{ color: '#888' }}>.</span>)
    const isWild = seg === '*' || seg === '#'
    const isMatch = isWild || seg === kp[idx]
    result.push(
      <span
        key={`seg-${idx}`}
        style={{
          color: isWild ? '#E65100' : isMatch ? '#2E7D32' : '#C62828',
          fontWeight: isWild || isMatch ? 700 : 400,
        }}
      >
        {seg}
      </span>
    )
  })
  return result
}

const topicExamples = [
  'order.created.eu',
  'order.paid.us',
  'order.cancelled.eu',
  'order.error',
  'user.registered',
  'user.login.mobile',
  'payment.processed.us',
  'system.error',
]

export function Task5_3_Solution() {
  const { t } = useLanguage()
  const [bindings, setBindings] = useState<TopicBinding[]>(initialTopicBindings)
  const [routingKey, setRoutingKey] = useState('order.created.eu')
  const [newPattern, setNewPattern] = useState('')
  const [newQueue, setNewQueue] = useState('')
  const [log, setLog] = useState<Array<{ key: string; matched: string[]; ts: string }>>([])

  const matchedBindings = bindings.filter(b => matchTopicPattern(b.pattern, routingKey))

  const publish = () => {
    const ts = new Date().toLocaleTimeString()
    const matched = bindings.filter(b => matchTopicPattern(b.pattern, routingKey)).map(b => b.queue)
    setLog(prev => [{ key: routingKey, matched, ts }, ...prev.slice(0, 9)])
  }

  const addBinding = () => {
    if (!newPattern.trim() || !newQueue.trim()) return
    const colors = [
      { color: '#00838F', bgColor: '#E0F7FA' },
      { color: '#AD1457', bgColor: '#FCE4EC' },
      { color: '#558B2F', bgColor: '#F1F8E9' },
    ]
    const c = colors[bindings.length % colors.length]
    setBindings(prev => [
      ...prev,
      { id: `b${Date.now()}`, pattern: newPattern.trim(), queue: newQueue.trim(), ...c },
    ])
    setNewPattern('')
    setNewQueue('')
  }

  const removeBinding = (id: string) => {
    setBindings(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Topic Exchange маршрутизирует по паттернам. <code style={{ background: '#f5f5f5', padding: '1px 4px' }}>*</code> — ровно одно слово,{' '}
        <code style={{ background: '#f5f5f5', padding: '1px 4px' }}>#</code> — ноль или более слов.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left: routing key input + examples */}
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Routing Key для отправки</h3>
          <input
            value={routingKey}
            onChange={e => setRoutingKey(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem',
              border: '2px solid #E65100',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '1rem',
              boxSizing: 'border-box',
              marginBottom: '0.75rem',
            }}
          />
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem' }}>
            Примеры (нажмите):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {topicExamples.map(ex => (
              <button
                key={ex}
                onClick={() => setRoutingKey(ex)}
                style={{
                  padding: '4px 8px',
                  border: `1px solid ${routingKey === ex ? '#E65100' : '#ddd'}`,
                  borderRadius: '4px',
                  background: routingKey === ex ? '#FFF3E0' : '#fff',
                  color: routingKey === ex ? '#E65100' : '#333',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                }}
              >
                {ex}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Добавить binding</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                value={newPattern}
                onChange={e => setNewPattern(e.target.value)}
                placeholder="паттерн: order.*.eu"
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}
              />
              <input
                value={newQueue}
                onChange={e => setNewQueue(e.target.value)}
                placeholder="имя очереди: eu-orders"
                style={{
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}
              />
              <button
                onClick={addBinding}
                style={{
                  padding: '0.5rem',
                  background: '#6A1B9A',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                + Добавить binding
              </button>
            </div>
          </div>
        </div>

        {/* Right: bindings table with match highlight */}
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            Bindings ({matchedBindings.length} совпадений из {bindings.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {bindings.map(b => {
              const isMatch = matchTopicPattern(b.pattern, routingKey)
              return (
                <div
                  key={b.id}
                  style={{
                    border: `2px solid ${isMatch ? b.color : '#eee'}`,
                    borderRadius: '8px',
                    padding: '0.6rem 0.75rem',
                    background: isMatch ? b.bgColor : '#fafafa',
                    transition: 'all 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: '2px' }}>
                      {isMatch ? highlightPattern(b.pattern, routingKey) : (
                        <span style={{ color: '#aaa' }}>{b.pattern}</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isMatch ? b.color : '#bbb' }}>
                      → {b.queue}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{isMatch ? '✅' : '❌'}</span>
                    <button
                      onClick={() => removeBinding(b.id)}
                      style={{
                        padding: '2px 6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        color: '#888',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Publish button + log */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <button
          onClick={publish}
          style={{
            padding: '0.75rem 2rem',
            background: '#E65100',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.95rem',
          }}
        >
          Опубликовать
        </button>
        <div style={{ fontSize: '0.85rem', color: '#666', paddingTop: '0.75rem' }}>
          {matchedBindings.length > 0
            ? `→ Попадёт в: ${matchedBindings.map(b => b.queue).join(', ')}`
            : '→ Нет совпадений — сообщение будет потеряно'}
        </div>
      </div>

      {log.length > 0 && (
        <div
          style={{
            background: '#1a1a2e',
            color: '#00ff88',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            padding: '0.75rem',
            borderRadius: '8px',
            maxHeight: '180px',
            overflowY: 'auto',
            marginBottom: '1.5rem',
          }}
        >
          {log.map((entry, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <div style={{ color: '#88aaff' }}>[{entry.ts}] TOPIC routing_key="{entry.key}"</div>
              {entry.matched.length > 0 ? (
                entry.matched.map((q, j) => <div key={j}>  → ROUTE → {q}</div>)
              ) : (
                <div style={{ color: '#ff6666' }}>  → UNROUTABLE</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Wildcard reference */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
        }}
      >
        <div
          style={{
            padding: '1rem',
            background: '#FFF3E0',
            borderRadius: '8px',
            border: '1px solid #FFCC80',
            fontSize: '0.85rem',
          }}
        >
          <strong style={{ color: '#E65100' }}>* (звёздочка)</strong>
          <ul style={{ margin: '0.5rem 0 0 1.25rem', lineHeight: '1.7' }}>
            <li>Заменяет ровно одно слово</li>
            <li><code>order.*</code> → <code>order.created</code> ✅</li>
            <li><code>order.*</code> → <code>order.created.eu</code> ❌</li>
            <li><code>*.paid.*</code> → <code>order.paid.eu</code> ✅</li>
          </ul>
        </div>
        <div
          style={{
            padding: '1rem',
            background: '#E8F5E9',
            borderRadius: '8px',
            border: '1px solid #A5D6A7',
            fontSize: '0.85rem',
          }}
        >
          <strong style={{ color: '#2E7D32' }}># (решётка)</strong>
          <ul style={{ margin: '0.5rem 0 0 1.25rem', lineHeight: '1.7' }}>
            <li>Заменяет ноль или более слов</li>
            <li><code>order.#</code> → <code>order.created.eu</code> ✅</li>
            <li><code>order.#</code> → <code>order</code> ✅ (ноль слов)</li>
            <li><code>#.error</code> → <code>system.error</code> ✅</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 5.4: Headers Exchange + Comparison
// ============================================

interface HeadersBinding {
  id: string
  queue: string
  headers: Record<string, string>
  xMatch: 'all' | 'any'
  color: string
  bgColor: string
}

interface ExchangeType {
  name: string
  icon: string
  color: string
  bgColor: string
  routing: string
  speed: string
  complexity: string
  useCases: string[]
  when: string
  example: string
}

const headersBindings: HeadersBinding[] = [
  {
    id: 'h1',
    queue: 'eu-mobile-orders',
    headers: { region: 'eu', platform: 'mobile' },
    xMatch: 'all',
    color: '#1565C0',
    bgColor: '#E3F2FD',
  },
  {
    id: 'h2',
    queue: 'premium-orders',
    headers: { tier: 'premium' },
    xMatch: 'any',
    color: '#6A1B9A',
    bgColor: '#F3E5F5',
  },
  {
    id: 'h3',
    queue: 'mobile-or-tablet',
    headers: { platform: 'mobile', platform2: 'tablet' },
    xMatch: 'any',
    color: '#E65100',
    bgColor: '#FFF3E0',
  },
  {
    id: 'h4',
    queue: 'us-all-platforms',
    headers: { region: 'us' },
    xMatch: 'all',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
  },
]

const exchangeTypes: ExchangeType[] = [
  {
    name: 'Direct',
    icon: '🎯',
    color: '#1565C0',
    bgColor: '#E3F2FD',
    routing: 'Точное совпадение routing key',
    speed: 'Высокая',
    complexity: 'Простой',
    useCases: ['Очереди задач', 'Маршрутизация по типу события', 'RPC'],
    when: 'Когда знаете точный ключ заранее',
    example: 'routing_key="order.created" → очередь orders',
  },
  {
    name: 'Fanout',
    icon: '📢',
    color: '#E65100',
    bgColor: '#FFF3E0',
    routing: 'Routing key игнорируется — всем',
    speed: 'Очень высокая',
    complexity: 'Самый простой',
    useCases: ['Push-уведомления', 'Cache invalidation', 'Логирование событий'],
    when: 'Когда нужно уведомить всех подписчиков',
    example: 'PUBLISH → email + push + SMS + analytics',
  },
  {
    name: 'Topic',
    icon: '🌿',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    routing: 'Wildcard паттерны (* и #)',
    speed: 'Высокая',
    complexity: 'Средний',
    useCases: ['Геораспределённые системы', 'Многоуровневые события', 'Сложная маршрутизация'],
    when: 'Когда нужна гибкая иерархическая маршрутизация',
    example: 'order.#.eu → все европейские заказы',
  },
  {
    name: 'Headers',
    icon: '🏷️',
    color: '#6A1B9A',
    bgColor: '#F3E5F5',
    routing: 'Совпадение заголовков AMQP (x-match: all/any)',
    speed: 'Низкая',
    complexity: 'Сложный',
    useCases: ['Контент-роутинг', 'A/B тестирование', 'Роутинг по метаданным'],
    when: 'Когда routing key недостаточно, нужны сложные правила',
    example: 'headers: {region: eu, tier: premium} → vip-queue',
  },
]

export function Task5_4_Solution() {
  const { t } = useLanguage()
  const [messageHeaders, setMessageHeaders] = useState<Record<string, string>>({
    region: 'eu',
    platform: 'mobile',
    tier: 'standard',
  })
  const [headerInput, setHeaderInput] = useState({ key: '', value: '' })
  const [view, setView] = useState<'headers' | 'comparison'>('headers')
  const [activeExchange, setActiveExchange] = useState('Direct')
  const [log, setLog] = useState<string[]>([])

  const matchHeaders = (binding: HeadersBinding): boolean => {
    const checks = Object.entries(binding.headers).map(([k, v]) => messageHeaders[k] === v)
    if (binding.xMatch === 'all') return checks.every(Boolean)
    return checks.some(Boolean)
  }

  const matchedBindings = headersBindings.filter(matchHeaders)

  const publish = () => {
    const ts = new Date().toLocaleTimeString()
    const matched = matchedBindings.map(b => b.queue)
    const headerStr = Object.entries(messageHeaders).map(([k, v]) => `${k}=${v}`).join(', ')
    setLog(prev => [
      `[${ts}] HEADERS {${headerStr}} → ${matched.length > 0 ? matched.join(', ') : 'UNROUTABLE'}`,
      ...prev.slice(0, 9),
    ])
  }

  const addHeader = () => {
    if (!headerInput.key.trim()) return
    setMessageHeaders(prev => ({ ...prev, [headerInput.key.trim()]: headerInput.value.trim() }))
    setHeaderInput({ key: '', value: '' })
  }

  const removeHeader = (key: string) => {
    setMessageHeaders(prev => {
      const copy = { ...prev }
      delete copy[key]
      return copy
    })
  }

  const activeExchangeData = exchangeTypes.find(e => e.name === activeExchange)!

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.4')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Headers Exchange маршрутизирует по заголовкам AMQP. Затем — сравнение всех 4 типов Exchange.
      </p>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['headers', 'comparison'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: `2px solid ${view === v ? '#6A1B9A' : '#ddd'}`,
              background: view === v ? '#6A1B9A' : '#fff',
              color: view === v ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: view === v ? 700 : 400,
              fontSize: '0.9rem',
            }}
          >
            {v === 'headers' ? '🏷️ Headers Exchange' : '📊 Сравнение типов'}
          </button>
        ))}
      </div>

      {view === 'headers' ? (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Message headers editor */}
            <div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Заголовки сообщения</h3>
              <div
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ background: '#f5f5f5', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#888', fontFamily: 'monospace' }}>
                  AMQP message headers
                </div>
                {Object.entries(messageHeaders).map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem 0.75rem',
                      borderTop: '1px solid #f0f0f0',
                    }}
                  >
                    <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      <span style={{ color: '#6A1B9A', fontWeight: 700 }}>{k}</span>
                      <span style={{ color: '#888' }}>: </span>
                      <span style={{ color: '#2E7D32' }}>"{v}"</span>
                    </div>
                    <button
                      onClick={() => removeHeader(k)}
                      style={{
                        padding: '2px 6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        color: '#C62828',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  value={headerInput.key}
                  onChange={e => setHeaderInput(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="ключ"
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                  }}
                />
                <input
                  value={headerInput.value}
                  onChange={e => setHeaderInput(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="значение"
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                  }}
                />
                <button
                  onClick={addHeader}
                  style={{
                    padding: '0.4rem 0.75rem',
                    background: '#6A1B9A',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  +
                </button>
              </div>
              <button
                onClick={publish}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#E65100',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                Опубликовать с этими заголовками
              </button>
            </div>

            {/* Bindings */}
            <div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                Bindings ({matchedBindings.length} совпадений)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {headersBindings.map(b => {
                  const isMatch = matchHeaders(b)
                  const checks = Object.entries(b.headers).map(([k, v]) => ({
                    key: k,
                    expected: v,
                    actual: messageHeaders[k],
                    match: messageHeaders[k] === v,
                  }))
                  return (
                    <div
                      key={b.id}
                      style={{
                        border: `2px solid ${isMatch ? b.color : '#eee'}`,
                        borderRadius: '8px',
                        padding: '0.75rem',
                        background: isMatch ? b.bgColor : '#fafafa',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: b.color, fontFamily: 'monospace' }}>
                          {b.queue}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: b.xMatch === 'all' ? '#E3F2FD' : '#FFF3E0',
                              color: b.xMatch === 'all' ? '#1565C0' : '#E65100',
                              fontWeight: 700,
                            }}
                          >
                            x-match: {b.xMatch}
                          </span>
                          <span>{isMatch ? '✅' : '❌'}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {checks.map(c => (
                          <span
                            key={c.key}
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: c.match ? '#E8F5E9' : '#FFEBEE',
                              color: c.match ? '#2E7D32' : '#C62828',
                              fontSize: '0.75rem',
                              fontFamily: 'monospace',
                              border: `1px solid ${c.match ? '#A5D6A7' : '#EF9A9A'}`,
                            }}
                          >
                            {c.key}={c.expected} {c.match ? '✓' : `(got: ${c.actual || '—'})`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {log.length > 0 && (
            <div
              style={{
                background: '#1a1a2e',
                color: '#00ff88',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                padding: '0.75rem',
                borderRadius: '8px',
                maxHeight: '130px',
                overflowY: 'auto',
              }}
            >
              {log.map((line, i) => <div key={i}>{line}</div>)}
            </div>
          )}
        </div>
      ) : (
        /* Comparison view */
        <div>
          {/* Exchange selector */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {exchangeTypes.map(ex => (
              <button
                key={ex.name}
                onClick={() => setActiveExchange(ex.name)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  border: `2px solid ${activeExchange === ex.name ? ex.color : '#ddd'}`,
                  background: activeExchange === ex.name ? ex.bgColor : '#fff',
                  color: ex.color,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                {ex.icon} {ex.name}
              </button>
            ))}
          </div>

          {/* Detail card */}
          <div
            style={{
              border: `2px solid ${activeExchangeData.color}`,
              borderRadius: '12px',
              padding: '1.25rem',
              background: activeExchangeData.bgColor,
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#888', display: 'block' }}>Алгоритм маршрутизации</span>
                  <span style={{ fontWeight: 700, color: activeExchangeData.color }}>{activeExchangeData.routing}</span>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#888', display: 'block' }}>Производительность</span>
                  <span style={{ fontWeight: 700 }}>{activeExchangeData.speed}</span>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#888', display: 'block' }}>Сложность конфигурации</span>
                  <span style={{ fontWeight: 700 }}>{activeExchangeData.complexity}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '4px' }}>Когда использовать</span>
                  <span style={{ fontSize: '0.85rem' }}>{activeExchangeData.when}</span>
                </div>
              </div>
              <div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '4px' }}>Use cases</span>
                  {activeExchangeData.useCases.map(uc => (
                    <div key={uc} style={{ fontSize: '0.85rem', marginBottom: '2px' }}>
                      ✅ {uc}
                    </div>
                  ))}
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '4px' }}>Пример</span>
                  <code
                    style={{
                      display: 'block',
                      padding: '0.5rem',
                      background: 'rgba(255,255,255,0.7)',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    {activeExchangeData.example}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', border: '1px solid #ddd', minWidth: '140px' }}>
                    Критерий
                  </th>
                  {exchangeTypes.map(ex => (
                    <th
                      key={ex.name}
                      style={{
                        padding: '0.6rem 0.75rem',
                        textAlign: 'center',
                        border: '1px solid #ddd',
                        background: ex.bgColor,
                        color: ex.color,
                        fontWeight: 700,
                      }}
                    >
                      {ex.icon} {ex.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Routing по', key: 'routing' as const },
                  { label: 'Скорость', key: 'speed' as const },
                  { label: 'Сложность', key: 'complexity' as const },
                  { label: 'Когда применять', key: 'when' as const },
                ].map(row => (
                  <tr key={row.label}>
                    <td style={{ padding: '0.6rem 0.75rem', border: '1px solid #ddd', fontWeight: 600, color: '#444' }}>
                      {row.label}
                    </td>
                    {exchangeTypes.map(ex => (
                      <td
                        key={ex.name}
                        style={{
                          padding: '0.6rem 0.75rem',
                          border: '1px solid #ddd',
                          textAlign: 'center',
                          fontSize: '0.78rem',
                          background: activeExchange === ex.name ? ex.bgColor : 'transparent',
                        }}
                      >
                        {ex[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Decision tree */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '0.85rem',
            }}
          >
            <strong style={{ display: 'block', marginBottom: '0.75rem' }}>Дерево выбора Exchange:</strong>
            <div style={{ fontFamily: 'monospace', lineHeight: '1.8' }}>
              <div>Нужна рассылка всем подписчикам? <strong style={{ color: '#E65100' }}>→ Fanout</strong></div>
              <div style={{ paddingLeft: '1rem' }}>↓ нет</div>
              <div>Известен точный ключ, нет wildcard? <strong style={{ color: '#1565C0' }}>→ Direct</strong></div>
              <div style={{ paddingLeft: '1rem' }}>↓ нет</div>
              <div>Нужны иерархические паттерны (* и #)? <strong style={{ color: '#2E7D32' }}>→ Topic</strong></div>
              <div style={{ paddingLeft: '1rem' }}>↓ нет</div>
              <div>Routing по метаданным/заголовкам? <strong style={{ color: '#6A1B9A' }}>→ Headers</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
