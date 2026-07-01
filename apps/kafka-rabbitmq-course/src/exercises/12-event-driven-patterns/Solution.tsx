import { useState } from 'react'
import { useLanguage } from '../../hooks'

// ============================================
// Задание 12.1: Event Sourcing — визуализация потока событий
// ============================================

type OrderEventType = 'OrderCreated' | 'ItemAdded' | 'ItemRemoved' | 'OrderPaid'

interface OrderEventBase {
  id: string
  type: OrderEventType
  timestamp: number
  version: number
}

interface OrderCreatedEvent extends OrderEventBase {
  type: 'OrderCreated'
  payload: { orderId: string; customerId: string }
}

interface ItemAddedEvent extends OrderEventBase {
  type: 'ItemAdded'
  payload: { productId: string; name: string; price: number; qty: number }
}

interface ItemRemovedEvent extends OrderEventBase {
  type: 'ItemRemoved'
  payload: { productId: string; name: string }
}

interface OrderPaidEvent extends OrderEventBase {
  type: 'OrderPaid'
  payload: { amount: number; method: string }
}

type OrderEvent = OrderCreatedEvent | ItemAddedEvent | ItemRemovedEvent | OrderPaidEvent

interface OrderState {
  orderId: string
  customerId: string
  items: Array<{ productId: string; name: string; price: number; qty: number }>
  status: 'pending' | 'paid'
  total: number
  version: number
}

const INITIAL_STATE: OrderState | null = null

function applyEvent(state: OrderState | null, event: OrderEvent): OrderState {
  switch (event.type) {
    case 'OrderCreated':
      return {
        orderId: event.payload.orderId,
        customerId: event.payload.customerId,
        items: [],
        status: 'pending',
        total: 0,
        version: event.version,
      }
    case 'ItemAdded': {
      if (!state) throw new Error('Order not created')
      const items = [
        ...state.items,
        {
          productId: event.payload.productId,
          name: event.payload.name,
          price: event.payload.price,
          qty: event.payload.qty,
        },
      ]
      return {
        ...state,
        items,
        total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
        version: event.version,
      }
    }
    case 'ItemRemoved': {
      if (!state) throw new Error('Order not created')
      const items = state.items.filter(i => i.productId !== event.payload.productId)
      return {
        ...state,
        items,
        total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
        version: event.version,
      }
    }
    case 'OrderPaid':
      if (!state) throw new Error('Order not created')
      return { ...state, status: 'paid', version: event.version }
  }
}

const PRESET_EVENTS: OrderEvent[] = [
  {
    id: 'evt-1',
    type: 'OrderCreated',
    timestamp: Date.now() - 5000,
    version: 1,
    payload: { orderId: 'ORD-001', customerId: 'CUS-42' },
  },
  {
    id: 'evt-2',
    type: 'ItemAdded',
    timestamp: Date.now() - 4000,
    version: 2,
    payload: { productId: 'P-01', name: 'Kafka: The Definitive Guide', price: 49, qty: 1 },
  },
  {
    id: 'evt-3',
    type: 'ItemAdded',
    timestamp: Date.now() - 3000,
    version: 3,
    payload: { productId: 'P-02', name: 'Designing Data-Intensive Applications', price: 54, qty: 2 },
  },
  {
    id: 'evt-4',
    type: 'ItemRemoved',
    timestamp: Date.now() - 2000,
    version: 4,
    payload: { productId: 'P-01', name: 'Kafka: The Definitive Guide' },
  },
  {
    id: 'evt-5',
    type: 'OrderPaid',
    timestamp: Date.now() - 1000,
    version: 5,
    payload: { amount: 108, method: 'credit_card' },
  },
]

const EVENT_COLORS: Record<OrderEventType, string> = {
  OrderCreated: '#4f86f7',
  ItemAdded: '#38a169',
  ItemRemoved: '#e53e3e',
  OrderPaid: '#b34ff7',
}

const EVENT_ICONS: Record<OrderEventType, string> = {
  OrderCreated: '📋',
  ItemAdded: '➕',
  ItemRemoved: '➖',
  OrderPaid: '💳',
}

export function Task12_1_Solution() {
  const { t } = useLanguage()
  const [replayTo, setReplayTo] = useState<number>(PRESET_EVENTS.length)

  const visibleEvents = PRESET_EVENTS.slice(0, replayTo)
  const currentState = visibleEvents.reduce<OrderState | null>(
    (state, event) => applyEvent(state, event),
    INITIAL_STATE
  )

  return (
    <div className="exercise-container">
      <h2>{t('task.12.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Event Store содержит неизменяемую последовательность событий. Двигайте ползунок,
        чтобы воспроизвести события и увидеть, как восстанавливается состояние агрегата.
      </p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Timeline событий */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
          }}>
            Event Store — timeline
          </div>

          {/* Ползунок */}
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="range"
              min={0}
              max={PRESET_EVENTS.length}
              value={replayTo}
              onChange={e => setReplayTo(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#4f86f7' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999' }}>
              <span>Начало (пусто)</span>
              <span>Воспроизведено: {replayTo}/{PRESET_EVENTS.length}</span>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Вертикальная линия */}
            <div style={{
              position: 'absolute',
              left: '18px',
              top: '10px',
              bottom: '10px',
              width: '2px',
              background: '#e2e8f0',
            }} />

            {PRESET_EVENTS.map((event, idx) => {
              const active = idx < replayTo
              const color = EVENT_COLORS[event.type]
              return (
                <div
                  key={event.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                    opacity: active ? 1 : 0.3,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {/* Кружок на timeline */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: active ? color : '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0,
                    zIndex: 1,
                    transition: 'background 0.3s ease',
                    border: `2px solid ${active ? color : '#ddd'}`,
                  }}>
                    {active ? EVENT_ICONS[event.type] : (
                      <span style={{ fontSize: '0.7rem', color: '#aaa' }}>{idx + 1}</span>
                    )}
                  </div>

                  <div style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    background: active ? `${color}12` : '#f9f9f9',
                    borderRadius: '8px',
                    border: `1px solid ${active ? `${color}30` : '#eee'}`,
                    transition: 'all 0.3s ease',
                  }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: active ? color : '#aaa',
                    }}>
                      v{event.version} — {event.type}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>
                      {JSON.stringify(event.payload)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Текущее состояние */}
        <div style={{ flex: '1 1 260px' }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
          }}>
            Текущее состояние агрегата
          </div>

          {currentState === null ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#aaa',
              border: '2px dashed #eee',
              borderRadius: '10px',
            }}>
              Состояние не инициализировано.<br />
              Переместите ползунок вправо.
            </div>
          ) : (
            <div style={{
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              overflow: 'hidden',
            }}>
              {/* Заголовок */}
              <div style={{
                padding: '0.75rem 1rem',
                background: currentState.status === 'paid' ? '#f0fff4' : '#ebf4ff',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {currentState.orderId}
                </span>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: currentState.status === 'paid' ? '#38a16920' : '#4f86f720',
                  color: currentState.status === 'paid' ? '#276749' : '#2b6cb0',
                }}>
                  {currentState.status === 'paid' ? 'ОПЛАЧЕН' : 'В ОБРАБОТКЕ'}
                </span>
              </div>

              <div style={{ padding: '0.75rem 1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
                  Клиент: <strong>{currentState.customerId}</strong>
                  &nbsp;·&nbsp; Версия: <strong>v{currentState.version}</strong>
                </div>

                {/* Позиции */}
                {currentState.items.length === 0 ? (
                  <div style={{ color: '#aaa', fontSize: '0.85rem', padding: '0.5rem 0' }}>
                    Корзина пуста
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '0.4rem' }}>
                      Позиции:
                    </div>
                    {currentState.items.map(item => (
                      <div
                        key={item.productId}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.82rem',
                          padding: '0.3rem 0',
                          borderBottom: '1px solid #f0f0f0',
                        }}
                      >
                        <span style={{ color: '#444' }}>{item.name}</span>
                        <span style={{ color: '#666', fontFamily: 'monospace' }}>
                          {item.qty} × ${item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Итого */}
                <div style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.5rem',
                  borderTop: '2px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                }}>
                  <span>Итого</span>
                  <span style={{ color: '#38a169' }}>${currentState.total}</span>
                </div>
              </div>
            </div>
          )}

          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#fffbeb',
            borderRadius: '8px',
            border: '1px solid #f6e05e',
            fontSize: '0.8rem',
            color: '#744210',
          }}>
            <strong>Ключевой принцип:</strong> состояние никогда не сохраняется напрямую.
            Оно всегда <em>вычисляется</em> из потока событий. Это позволяет воспроизвести
            любой момент истории.
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 12.2: CQRS — разделение чтения и записи
// ============================================

type CommandType = 'CreateProduct' | 'UpdatePrice' | 'AddStock' | 'SetInactive'

interface Command {
  type: CommandType
  payload: Record<string, unknown>
}

interface CQRSEvent {
  id: string
  type: string
  payload: Record<string, unknown>
  timestamp: number
}

interface ProductWriteModel {
  productId: string
  name: string
  price: number
  stock: number
  active: boolean
  version: number
}

// Read Models (проекции)
interface ProductCatalogItem {
  productId: string
  name: string
  price: number
  available: boolean
}

interface InventoryItem {
  productId: string
  name: string
  stock: number
  lowStock: boolean
}

function processCommand(
  state: Map<string, ProductWriteModel>,
  command: Command
): CQRSEvent | null {
  switch (command.type) {
    case 'CreateProduct': {
      const { productId, name, price, stock } = command.payload as {
        productId: string; name: string; price: number; stock: number
      }
      if (state.has(productId)) return null
      return {
        id: `e-${Date.now()}`,
        type: 'ProductCreated',
        payload: { productId, name, price, stock },
        timestamp: Date.now(),
      }
    }
    case 'UpdatePrice': {
      const { productId, price } = command.payload as { productId: string; price: number }
      if (!state.has(productId)) return null
      return {
        id: `e-${Date.now()}`,
        type: 'PriceUpdated',
        payload: { productId, price },
        timestamp: Date.now(),
      }
    }
    case 'AddStock': {
      const { productId, qty } = command.payload as { productId: string; qty: number }
      if (!state.has(productId)) return null
      return {
        id: `e-${Date.now()}`,
        type: 'StockAdded',
        payload: { productId, qty },
        timestamp: Date.now(),
      }
    }
    case 'SetInactive': {
      const { productId } = command.payload as { productId: string }
      if (!state.has(productId)) return null
      return {
        id: `e-${Date.now()}`,
        type: 'ProductDeactivated',
        payload: { productId },
        timestamp: Date.now(),
      }
    }
  }
}

function applyProductEvent(
  state: Map<string, ProductWriteModel>,
  event: CQRSEvent
): Map<string, ProductWriteModel> {
  const next = new Map(state)
  switch (event.type) {
    case 'ProductCreated': {
      const p = event.payload as { productId: string; name: string; price: number; stock: number }
      next.set(p.productId, { ...p, active: true, version: 1 })
      break
    }
    case 'PriceUpdated': {
      const { productId, price } = event.payload as { productId: string; price: number }
      const existing = next.get(productId)
      if (existing) next.set(productId, { ...existing, price, version: existing.version + 1 })
      break
    }
    case 'StockAdded': {
      const { productId, qty } = event.payload as { productId: string; qty: number }
      const existing = next.get(productId)
      if (existing) next.set(productId, { ...existing, stock: existing.stock + qty, version: existing.version + 1 })
      break
    }
    case 'ProductDeactivated': {
      const { productId } = event.payload as { productId: string }
      const existing = next.get(productId)
      if (existing) next.set(productId, { ...existing, active: false, version: existing.version + 1 })
      break
    }
  }
  return next
}

function buildCatalogProjection(writeModels: Map<string, ProductWriteModel>): ProductCatalogItem[] {
  return Array.from(writeModels.values())
    .filter(p => p.active)
    .map(p => ({
      productId: p.productId,
      name: p.name,
      price: p.price,
      available: p.stock > 0,
    }))
}

function buildInventoryProjection(writeModels: Map<string, ProductWriteModel>): InventoryItem[] {
  return Array.from(writeModels.values()).map(p => ({
    productId: p.productId,
    name: p.name,
    stock: p.stock,
    lowStock: p.stock < 10,
  }))
}

const PRESET_COMMANDS: Array<{ label: string; command: Command; color: string }> = [
  {
    label: 'Создать товар A',
    command: { type: 'CreateProduct', payload: { productId: 'P-A', name: 'Widget Pro', price: 29, stock: 50 } },
    color: '#4f86f7',
  },
  {
    label: 'Создать товар B',
    command: { type: 'CreateProduct', payload: { productId: 'P-B', name: 'Gadget X', price: 89, stock: 8 } },
    color: '#4f86f7',
  },
  {
    label: 'Повысить цену A',
    command: { type: 'UpdatePrice', payload: { productId: 'P-A', price: 39 } },
    color: '#ed8936',
  },
  {
    label: 'Добавить склад B',
    command: { type: 'AddStock', payload: { productId: 'P-B', qty: 5 } },
    color: '#38a169',
  },
  {
    label: 'Деактивировать A',
    command: { type: 'SetInactive', payload: { productId: 'P-A' } },
    color: '#e53e3e',
  },
]

export function Task12_2_Solution() {
  const { t } = useLanguage()
  const [writeState, setWriteState] = useState<Map<string, ProductWriteModel>>(new Map())
  const [eventLog, setEventLog] = useState<CQRSEvent[]>([])
  const [lastCommandResult, setLastCommandResult] = useState<string | null>(null)

  const handleCommand = (command: Command) => {
    const event = processCommand(writeState, command)
    if (!event) {
      setLastCommandResult(`Команда ${command.type} отклонена (бизнес-правило)`)
      return
    }
    setLastCommandResult(`Команда принята → событие ${event.type} сохранено`)
    const newState = applyProductEvent(writeState, event)
    setWriteState(newState)
    setEventLog(prev => [...prev, event])
  }

  const catalog = buildCatalogProjection(writeState)
  const inventory = buildInventoryProjection(writeState)

  return (
    <div className="exercise-container">
      <h2>{t('task.12.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        CQRS разделяет запись (команды → события → write store) и чтение (проекции → read models).
        Отправляйте команды и наблюдайте, как обновляются независимые проекции.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Write side */}
        <div style={{ flex: '1 1 220px' }}>
          <div style={{
            fontSize: '0.75rem', fontWeight: 700, color: '#4f86f7',
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem',
          }}>
            Write Side — команды
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {PRESET_COMMANDS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleCommand(item.command)}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: `${item.color}15`,
                  border: `1.5px solid ${item.color}50`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.83rem',
                  fontWeight: 600,
                  color: item.color,
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {lastCommandResult && (
            <div style={{
              padding: '0.6rem',
              background: '#f7fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '0.78rem',
              color: '#555',
            }}>
              {lastCommandResult}
            </div>
          )}

          {/* Event Log */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{
              fontSize: '0.75rem', fontWeight: 700, color: '#888',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem',
            }}>
              Event Store ({eventLog.length})
            </div>
            <div style={{
              maxHeight: '180px', overflowY: 'auto',
              border: '1px solid #eee', borderRadius: '8px',
            }}>
              {eventLog.length === 0 ? (
                <div style={{ padding: '1rem', color: '#aaa', fontSize: '0.8rem', textAlign: 'center' }}>
                  Пусто
                </div>
              ) : (
                eventLog.map((ev, idx) => (
                  <div
                    key={ev.id}
                    style={{
                      padding: '0.4rem 0.6rem',
                      borderBottom: idx < eventLog.length - 1 ? '1px solid #f0f0f0' : 'none',
                      fontSize: '0.75rem',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#4f86f7' }}>{ev.type}</span>
                    <span style={{ color: '#aaa', marginLeft: '0.5rem' }}>
                      {JSON.stringify(ev.payload).slice(0, 40)}...
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Read side */}
        <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Catalog projection */}
          <div>
            <div style={{
              fontSize: '0.75rem', fontWeight: 700, color: '#38a169',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem',
            }}>
              Read Model: каталог товаров
            </div>
            <div style={{
              border: '1px solid #c6f6d5',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#f0fff4',
            }}>
              {catalog.length === 0 ? (
                <div style={{ padding: '1rem', color: '#aaa', fontSize: '0.8rem', textAlign: 'center' }}>
                  Каталог пуст
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#c6f6d5' }}>
                      <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left', color: '#276749' }}>Товар</th>
                      <th style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#276749' }}>Цена</th>
                      <th style={{ padding: '0.4rem 0.6rem', textAlign: 'center', color: '#276749' }}>Наличие</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catalog.map(item => (
                      <tr key={item.productId} style={{ borderTop: '1px solid #e6ffed' }}>
                        <td style={{ padding: '0.4rem 0.6rem', color: '#333' }}>{item.name}</td>
                        <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', fontFamily: 'monospace', color: '#276749', fontWeight: 600 }}>
                          ${item.price}
                        </td>
                        <td style={{ padding: '0.4rem 0.6rem', textAlign: 'center' }}>
                          {item.available
                            ? <span style={{ color: '#38a169' }}>В наличии</span>
                            : <span style={{ color: '#e53e3e' }}>Нет</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Inventory projection */}
          <div>
            <div style={{
              fontSize: '0.75rem', fontWeight: 700, color: '#ed8936',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem',
            }}>
              Read Model: управление складом
            </div>
            <div style={{
              border: '1px solid #fbd38d',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#fffaf0',
            }}>
              {inventory.length === 0 ? (
                <div style={{ padding: '1rem', color: '#aaa', fontSize: '0.8rem', textAlign: 'center' }}>
                  Склад пуст
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#fbd38d' }}>
                      <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left', color: '#7b341e' }}>Товар</th>
                      <th style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#7b341e' }}>Склад</th>
                      <th style={{ padding: '0.4rem 0.6rem', textAlign: 'center', color: '#7b341e' }}>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map(item => (
                      <tr key={item.productId} style={{ borderTop: '1px solid #fef3c7' }}>
                        <td style={{ padding: '0.4rem 0.6rem', color: '#333' }}>{item.name}</td>
                        <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                          {item.stock}
                        </td>
                        <td style={{ padding: '0.4rem 0.6rem', textAlign: 'center' }}>
                          {item.lowStock
                            ? <span style={{ color: '#e53e3e', fontWeight: 600 }}>Мало!</span>
                            : <span style={{ color: '#38a169' }}>OK</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: '#ebf4ff',
        borderRadius: '8px',
        border: '1px solid #bee3f8',
        fontSize: '0.8rem',
        color: '#2b6cb0',
      }}>
        <strong>CQRS:</strong> каталог и склад — это разные read models, построенные на одних событиях.
        Каждая оптимизирована под свой сценарий. Write side получает команду и публикует событие —
        read side подписывается и обновляет проекции асинхронно.
      </div>
    </div>
  )
}

// ============================================
// Задание 12.3: Хореография vs Оркестрация
// ============================================

type FlowStep =
  | 'order-service'
  | 'payment-service'
  | 'inventory-service'
  | 'shipping-service'
  | 'notification-service'

interface ServiceNode {
  id: FlowStep
  label: string
  x: number
  y: number
  color: string
}

const SERVICES_LAYOUT: ServiceNode[] = [
  { id: 'order-service', label: 'Order\nService', x: 60, y: 90, color: '#4f86f7' },
  { id: 'payment-service', label: 'Payment\nService', x: 200, y: 30, color: '#38a169' },
  { id: 'inventory-service', label: 'Inventory\nService', x: 200, y: 150, color: '#ed8936' },
  { id: 'shipping-service', label: 'Shipping\nService', x: 340, y: 90, color: '#b34ff7' },
  { id: 'notification-service', label: 'Notification\nService', x: 200, y: 260, color: '#e53e3e' },
]

// Хореография: кто на что реагирует и что публикует
interface ChoreographyStep {
  from: FlowStep
  event: string
  to: FlowStep
  produces: string
  delay: number
}

const CHOREOGRAPHY_STEPS: ChoreographyStep[] = [
  {
    from: 'order-service',
    event: 'OrderPlaced',
    to: 'payment-service',
    produces: 'PaymentProcessed',
    delay: 600,
  },
  {
    from: 'payment-service',
    event: 'PaymentProcessed',
    to: 'inventory-service',
    produces: 'StockReserved',
    delay: 600,
  },
  {
    from: 'inventory-service',
    event: 'StockReserved',
    to: 'shipping-service',
    produces: 'ShipmentCreated',
    delay: 600,
  },
  {
    from: 'shipping-service',
    event: 'ShipmentCreated',
    to: 'notification-service',
    produces: 'NotificationSent',
    delay: 600,
  },
]

// Оркестрация: оркестратор управляет последовательностью
interface OrchestrationStep {
  service: FlowStep
  command: string
  response: string
  delay: number
}

const ORCHESTRATION_STEPS: OrchestrationStep[] = [
  { service: 'payment-service', command: 'ProcessPayment', response: 'PaymentOK', delay: 600 },
  { service: 'inventory-service', command: 'ReserveStock', response: 'StockOK', delay: 600 },
  { service: 'shipping-service', command: 'CreateShipment', response: 'ShipmentOK', delay: 600 },
  { service: 'notification-service', command: 'SendNotification', response: 'NotifOK', delay: 600 },
]

export function Task12_3_Solution() {
  const { t } = useLanguage()
  const [choreoStep, setChoreoStep] = useState<number>(-1)
  const [orchStep, setOrchStep] = useState<number>(-1)
  const [choreoRunning, setChoreoRunning] = useState(false)
  const [orchRunning, setOrchRunning] = useState(false)
  const [choreoLog, setChoreoLog] = useState<string[]>([])
  const [orchLog, setOrchLog] = useState<string[]>([])

  const runChoreography = async () => {
    setChoreoRunning(true)
    setChoreoStep(-1)
    setChoreoLog([])

    setChoreoLog(['[Order Service] Заказ создан → публикует OrderPlaced'])
    for (let i = 0; i < CHOREOGRAPHY_STEPS.length; i++) {
      const step = CHOREOGRAPHY_STEPS[i]
      await new Promise(r => setTimeout(r, step.delay))
      setChoreoStep(i)
      setChoreoLog(prev => [
        ...prev,
        `[${step.to.replace('-', ' ')}] Получил ${step.event} → обрабатывает → публикует ${step.produces}`,
      ])
    }
    setChoreoRunning(false)
  }

  const runOrchestration = async () => {
    setOrchRunning(true)
    setOrchStep(-1)
    setOrchLog([])

    setOrchLog(['[Orchestrator] Получил команду CreateOrder — начинает saga'])
    for (let i = 0; i < ORCHESTRATION_STEPS.length; i++) {
      const step = ORCHESTRATION_STEPS[i]
      await new Promise(r => setTimeout(r, step.delay))
      setOrchStep(i)
      setOrchLog(prev => [
        ...prev,
        `[Orchestrator → ${step.service.replace('-', ' ')}] ${step.command}`,
        `[${step.service.replace('-', ' ')} → Orchestrator] ${step.response}`,
      ])
    }
    setOrchLog(prev => [...prev, '[Orchestrator] Saga завершена успешно'])
    setOrchRunning(false)
  }

  const resetAll = () => {
    setChoreoStep(-1)
    setOrchStep(-1)
    setChoreoLog([])
    setOrchLog([])
  }

  const SVG_W = 460
  const SVG_H = 320

  const getServicePos = (id: FlowStep) => {
    const s = SERVICES_LAYOUT.find(s => s.id === id)!
    return { x: s.x + 50, y: s.y + 20 }
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.12.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Два подхода к координации распределённых операций: хореография (сервисы реагируют на события
        самостоятельно) и оркестрация (центральный координатор управляет потоком).
        Запустите оба и сравните, как события распространяются.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Хореография */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}>
            <div style={{
              fontSize: '0.8rem', fontWeight: 700, color: '#4f86f7',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              Хореография
            </div>
            <button
              onClick={runChoreography}
              disabled={choreoRunning || orchRunning}
              style={{
                padding: '0.3rem 0.75rem',
                background: choreoRunning ? '#eee' : '#4f86f7',
                color: choreoRunning ? '#999' : '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: choreoRunning ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {choreoRunning ? 'Идёт...' : 'Запустить'}
            </button>
          </div>

          {/* SVG диаграмма */}
          <svg
            width="100%"
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ border: '1px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc', display: 'block' }}
          >
            {/* Линии между сервисами */}
            {CHOREOGRAPHY_STEPS.map((step, idx) => {
              const from = getServicePos(step.from)
              const to = getServicePos(step.to)
              const active = choreoStep >= idx
              return (
                <g key={idx}>
                  <line
                    x1={from.x} y1={from.y}
                    x2={to.x} y2={to.y}
                    stroke={active ? '#4f86f7' : '#dde1e7'}
                    strokeWidth={active ? 2.5 : 1.5}
                    strokeDasharray={active ? '0' : '5 3'}
                  />
                  {active && (
                    <text
                      x={(from.x + to.x) / 2 + 4}
                      y={(from.y + to.y) / 2 - 4}
                      fontSize={9}
                      fill="#4f86f7"
                      fontWeight={600}
                    >
                      {step.event}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Узлы сервисов */}
            {SERVICES_LAYOUT.map(svc => {
              const isActive = choreoStep >= 0 && (
                svc.id === 'order-service' ||
                CHOREOGRAPHY_STEPS.slice(0, choreoStep + 1).some(s => s.to === svc.id)
              )
              return (
                <g key={svc.id} transform={`translate(${svc.x}, ${svc.y})`}>
                  <rect
                    width={100} height={40} rx={8}
                    fill={isActive ? svc.color : '#fff'}
                    stroke={svc.color}
                    strokeWidth={2}
                    style={{ transition: 'fill 0.3s' }}
                  />
                  {svc.label.split('\n').map((line, li) => (
                    <text
                      key={li}
                      x={50} y={14 + li * 14}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={600}
                      fill={isActive ? '#fff' : svc.color}
                      style={{ transition: 'fill 0.3s', userSelect: 'none' }}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              )
            })}
          </svg>

          {/* Лог */}
          <div style={{
            marginTop: '0.75rem',
            maxHeight: '130px',
            overflowY: 'auto',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '0.5rem',
            background: '#f8fafc',
          }}>
            {choreoLog.length === 0 ? (
              <div style={{ color: '#aaa', fontSize: '0.78rem', textAlign: 'center', padding: '0.5rem' }}>
                Нажмите Запустить
              </div>
            ) : choreoLog.map((line, idx) => (
              <div key={idx} style={{ fontSize: '0.75rem', color: '#444', padding: '0.15rem 0', fontFamily: 'monospace' }}>
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Оркестрация */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}>
            <div style={{
              fontSize: '0.8rem', fontWeight: 700, color: '#b34ff7',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              Оркестрация
            </div>
            <button
              onClick={runOrchestration}
              disabled={choreoRunning || orchRunning}
              style={{
                padding: '0.3rem 0.75rem',
                background: orchRunning ? '#eee' : '#b34ff7',
                color: orchRunning ? '#999' : '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: orchRunning ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {orchRunning ? 'Идёт...' : 'Запустить'}
            </button>
          </div>

          {/* Оркестратор + сервисы */}
          <svg
            width="100%"
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ border: '1px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc', display: 'block' }}
          >
            {/* Центральный оркестратор */}
            <g transform="translate(180, 120)">
              <rect
                width={100} height={50} rx={10}
                fill={orchStep >= 0 ? '#b34ff7' : '#fff'}
                stroke="#b34ff7"
                strokeWidth={3}
                style={{ transition: 'fill 0.3s' }}
              />
              <text
                x={50} y={19} textAnchor="middle"
                fontSize={10} fontWeight={700}
                fill={orchStep >= 0 ? '#fff' : '#b34ff7'}
                style={{ userSelect: 'none' }}
              >
                ORCHESTRATOR
              </text>
              <text
                x={50} y={35} textAnchor="middle"
                fontSize={9}
                fill={orchStep >= 0 ? '#e9d8fd' : '#888'}
                style={{ userSelect: 'none' }}
              >
                (Saga Controller)
              </text>
            </g>

            {/* Линии к сервисам + сервисы */}
            {ORCHESTRATION_STEPS.map((step, idx) => {
              const svc = SERVICES_LAYOUT.find(s => s.id === step.service)!
              const active = orchStep >= idx
              const orchCenter = { x: 230, y: 145 }
              const svcCenter = { x: svc.x + 50, y: svc.y + 20 }
              return (
                <g key={idx}>
                  <line
                    x1={orchCenter.x} y1={orchCenter.y}
                    x2={svcCenter.x} y2={svcCenter.y}
                    stroke={active ? '#b34ff7' : '#dde1e7'}
                    strokeWidth={active ? 2.5 : 1.5}
                    strokeDasharray={active ? '0' : '5 3'}
                  />
                  {active && (
                    <text
                      x={(orchCenter.x + svcCenter.x) / 2 + 4}
                      y={(orchCenter.y + svcCenter.y) / 2 - 4}
                      fontSize={8.5}
                      fill="#b34ff7"
                      fontWeight={600}
                    >
                      {step.command}
                    </text>
                  )}
                  <g transform={`translate(${svc.x}, ${svc.y})`}>
                    <rect
                      width={100} height={40} rx={8}
                      fill={active ? svc.color : '#fff'}
                      stroke={svc.color}
                      strokeWidth={2}
                      style={{ transition: 'fill 0.3s' }}
                    />
                    {svc.label.split('\n').map((line, li) => (
                      <text
                        key={li}
                        x={50} y={14 + li * 14}
                        textAnchor="middle"
                        fontSize={10} fontWeight={600}
                        fill={active ? '#fff' : svc.color}
                        style={{ transition: 'fill 0.3s', userSelect: 'none' }}
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                </g>
              )
            })}
          </svg>

          {/* Лог */}
          <div style={{
            marginTop: '0.75rem',
            maxHeight: '130px',
            overflowY: 'auto',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '0.5rem',
            background: '#f8fafc',
          }}>
            {orchLog.length === 0 ? (
              <div style={{ color: '#aaa', fontSize: '0.78rem', textAlign: 'center', padding: '0.5rem' }}>
                Нажмите Запустить
              </div>
            ) : orchLog.map((line, idx) => (
              <div key={idx} style={{ fontSize: '0.75rem', color: '#444', padding: '0.15rem 0', fontFamily: 'monospace' }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={resetAll}
        style={{
          marginTop: '1rem',
          padding: '0.4rem 1rem',
          background: '#f0f0f0',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.83rem',
          color: '#555',
        }}
      >
        Сбросить
      </button>

      {/* Сравнение */}
      <div style={{
        marginTop: '1.25rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
      }}>
        <div style={{
          padding: '0.75rem',
          background: '#ebf4ff',
          borderRadius: '8px',
          border: '1px solid #bee3f8',
          fontSize: '0.8rem',
        }}>
          <div style={{ fontWeight: 700, color: '#2b6cb0', marginBottom: '0.4rem' }}>Хореография</div>
          <div style={{ color: '#555', lineHeight: 1.5 }}>
            + Высокая автономность<br />
            + Нет единой точки отказа<br />
            + Слабая связанность<br />
            - Сложно отследить поток<br />
            - Трудно управлять компенсацией
          </div>
        </div>
        <div style={{
          padding: '0.75rem',
          background: '#f3e8ff',
          borderRadius: '8px',
          border: '1px solid #d6bcfa',
          fontSize: '0.8rem',
        }}>
          <div style={{ fontWeight: 700, color: '#6b21a8', marginBottom: '0.4rem' }}>Оркестрация</div>
          <div style={{ color: '#555', lineHeight: 1.5 }}>
            + Прозрачный поток управления<br />
            + Удобна для компенсаций<br />
            + Легко отлаживать<br />
            - Оркестратор — узкое место<br />
            - Более жёсткая связанность
          </div>
        </div>
      </div>
    </div>
  )
}
