import { useState } from 'react'

// ============================================
// Задание 4.1: Уровни QoS (0, 1, 2) — Решение
// ============================================

type QosLevel = 0 | 1 | 2

interface QosStep {
  from: 'publisher' | 'broker' | 'subscriber'
  to: 'publisher' | 'broker' | 'subscriber'
  packet: string
  description: string
  color: string
}

const qosData: Record<QosLevel, {
  name: string
  tagline: string
  description: string
  steps: QosStep[]
  pros: string[]
  cons: string[]
  useCase: string
  color: string
  packetsCount: number
}> = {
  0: {
    name: 'At most once',
    tagline: 'Максимум один раз (Fire & Forget)',
    description: 'Сообщение отправляется один раз без подтверждения. Может потеряться, но никогда не дублируется.',
    color: '#3b82f6',
    packetsCount: 1,
    steps: [
      { from: 'publisher', to: 'broker', packet: 'PUBLISH', description: 'Издатель отправляет сообщение', color: '#3b82f6' },
      { from: 'broker', to: 'subscriber', packet: 'PUBLISH', description: 'Брокер доставляет подписчику', color: '#3b82f6' },
    ],
    pros: ['Минимальная нагрузка', 'Максимальная скорость', 'Нет накладных расходов'],
    cons: ['Нет гарантии доставки', 'Сообщение может потеряться'],
    useCase: 'Телеметрия: температура, влажность, GPS-координаты',
  },
  1: {
    name: 'At least once',
    tagline: 'Не менее одного раза (с подтверждением)',
    description: 'Сообщение доставляется минимум один раз. При потере подтверждения — повтор. Возможны дубликаты.',
    color: '#f59e0b',
    packetsCount: 2,
    steps: [
      { from: 'publisher', to: 'broker', packet: 'PUBLISH', description: 'Издатель отправляет, ждёт PUBACK', color: '#f59e0b' },
      { from: 'broker', to: 'subscriber', packet: 'PUBLISH', description: 'Брокер доставляет подписчику', color: '#f59e0b' },
      { from: 'subscriber', to: 'broker', packet: 'PUBACK', description: 'Подписчик подтверждает получение', color: '#10b981' },
      { from: 'broker', to: 'publisher', packet: 'PUBACK', description: 'Брокер подтверждает издателю', color: '#10b981' },
    ],
    pros: ['Гарантированная доставка', 'Относительно простой протокол'],
    cons: ['Возможны дубликаты (DUP flag)', 'Больше нагрузка чем QoS 0'],
    useCase: 'Алерты: движение, открытие двери, порог температуры',
  },
  2: {
    name: 'Exactly once',
    tagline: 'Ровно один раз (четырёхшаговый handshake)',
    description: 'Гарантирует ровно одну доставку. Самый надёжный, самый медленный — 4 пакета на сообщение.',
    color: '#8b5cf6',
    packetsCount: 4,
    steps: [
      { from: 'publisher', to: 'broker', packet: 'PUBLISH', description: 'Издатель отправляет, брокер сохраняет', color: '#8b5cf6' },
      { from: 'broker', to: 'publisher', packet: 'PUBREC', description: 'Брокер: "Получено, жди разрешения"', color: '#10b981' },
      { from: 'publisher', to: 'broker', packet: 'PUBREL', description: 'Издатель: "Разрешаю доставить"', color: '#8b5cf6' },
      { from: 'broker', to: 'publisher', packet: 'PUBCOMP', description: 'Брокер: "Доставлено, завершено"', color: '#10b981' },
    ],
    pros: ['Строго ровно одна доставка', 'Нет дубликатов'],
    cons: ['4 пакета вместо 1', 'Держит состояние в памяти', 'В 4× медленнее QoS 0'],
    useCase: 'Управление: клапаны, насосы, критические команды',
  },
}

const comparisonData = [
  { param: 'Гарантия', qos0: 'Не более 1 раза', qos1: 'Не менее 1 раза', qos2: 'Ровно 1 раз' },
  { param: 'Дубликаты', qos0: 'Нет', qos1: 'Возможны', qos2: 'Нет' },
  { param: 'Потери', qos0: 'Возможны', qos1: 'Нет', qos2: 'Нет' },
  { param: 'Пакетов', qos0: '1', qos1: '2–4', qos2: '4' },
  { param: 'RAM (брокер)', qos0: '0', qos1: '~200 байт/msg', qos2: '~400 байт/msg' },
  { param: 'Скорость', qos0: '100%', qos1: '50%', qos2: '25%' },
]

export function Task4_1_Solution() {
  const [activeQos, setActiveQos] = useState<QosLevel>(0)
  const [animStep, setAnimStep] = useState<number>(-1)
  const [showComparison, setShowComparison] = useState(false)

  const data = qosData[activeQos]

  const runAnimation = () => {
    setAnimStep(-1)
    let step = 0
    const interval = setInterval(() => {
      setAnimStep(step)
      step++
      if (step >= data.steps.length) {
        clearInterval(interval)
      }
    }, 800)
  }

  const actorLabel = (actor: string) => {
    const labels: Record<string, string> = {
      publisher: 'Издатель',
      broker: 'Брокер',
      subscriber: 'Подписчик',
    }
    return labels[actor] || actor
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Уровни QoS (0, 1, 2)</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Визуализация handshake для каждого уровня QoS. Нажмите «Запустить» для анимации.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {([0, 1, 2] as QosLevel[]).map((q) => (
          <button
            key={q}
            onClick={() => { setActiveQos(q); setAnimStep(-1) }}
            style={{
              flex: 1,
              padding: '12px 8px',
              border: `2px solid ${activeQos === q ? qosData[q].color : '#e5e7eb'}`,
              borderRadius: 8,
              background: activeQos === q ? qosData[q].color : 'white',
              color: activeQos === q ? 'white' : '#374151',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <div>QoS {q}</div>
            <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.9 }}>
              {qosData[q].packetsCount} пакет{q === 0 ? '' : q === 1 ? 'а' : 'а'}
            </div>
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 16, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
        <div style={{ fontWeight: 600, color: data.color, marginBottom: 4 }}>
          {data.name} — {data.tagline}
        </div>
        <div style={{ fontSize: 14, color: '#374151' }}>{data.description}</div>
      </div>

      {/* Схема handshake */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', margin: 0 }}>
            Схема обмена пакетами
          </h3>
          <button
            onClick={runAnimation}
            style={{
              padding: '6px 16px',
              background: data.color,
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            ▶ Анимировать
          </button>
        </div>

        {/* Акторы */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
          {['publisher', 'broker', 'subscriber'].map((actor) => (
            <div
              key={actor}
              style={{
                textAlign: 'center',
                padding: '8px',
                background: '#f3f4f6',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {actorLabel(actor)}
            </div>
          ))}
        </div>

        {/* Шаги */}
        {data.steps.map((step, idx) => {
          const isActive = animStep >= idx
          const actors = ['publisher', 'broker', 'subscriber']
          const fromIdx = actors.indexOf(step.from)
          const toIdx = actors.indexOf(step.to)
          const isRightward = toIdx > fromIdx

          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 8,
                marginBottom: 4,
                opacity: isActive ? 1 : 0.25,
                transition: 'opacity 0.4s',
              }}
            >
              {actors.map((_, aIdx) => {
                const isFrom = aIdx === fromIdx
                const isTo = aIdx === toIdx
                const isMid = aIdx > Math.min(fromIdx, toIdx) && aIdx < Math.max(fromIdx, toIdx)

                if (isFrom || isTo || isMid) {
                  return (
                    <div
                      key={aIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px 0',
                        position: 'relative',
                      }}
                    >
                      {isFrom && !isTo && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          width: '100%',
                          justifyContent: isRightward ? 'flex-end' : 'flex-start',
                        }}>
                          {!isRightward && <span style={{ fontSize: 16 }}>◄</span>}
                          <span style={{
                            padding: '2px 8px',
                            background: step.color,
                            color: 'white',
                            borderRadius: 4,
                            fontSize: 12,
                            fontFamily: 'monospace',
                            fontWeight: 600,
                          }}>
                            {step.packet}
                          </span>
                          {isRightward && <span style={{ fontSize: 16 }}>►</span>}
                        </div>
                      )}
                      {isMid && (
                        <div style={{
                          width: '100%',
                          height: 2,
                          background: step.color,
                        }} />
                      )}
                      {isTo && !isFrom && (
                        <div style={{
                          width: '100%',
                          height: 2,
                          background: step.color,
                        }} />
                      )}
                    </div>
                  )
                }

                return <div key={aIdx} />
              })}
            </div>
          )
        })}

        {/* Описания шагов */}
        <div style={{ marginTop: 12 }}>
          {data.steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 8px',
                borderRadius: 4,
                marginBottom: 2,
                opacity: animStep >= idx ? 1 : 0.4,
                transition: 'opacity 0.4s',
                background: animStep === idx ? '#f0fdf4' : 'transparent',
              }}
            >
              <span style={{
                minWidth: 20,
                height: 20,
                background: step.color,
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 600,
              }}>
                {idx + 1}
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: step.color, fontWeight: 600, minWidth: 80 }}>
                {step.packet}
              </span>
              <span style={{ fontSize: 13, color: '#374151' }}>{step.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Плюсы/минусы и use case */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
          <div style={{ fontWeight: 600, color: '#15803d', marginBottom: 8 }}>Преимущества</div>
          {data.pros.map((pro) => (
            <div key={pro} style={{ fontSize: 13, color: '#166534', marginBottom: 4 }}>✅ {pro}</div>
          ))}
        </div>
        <div style={{ padding: 12, background: '#fef2f2', borderRadius: 8 }}>
          <div style={{ fontWeight: 600, color: '#b91c1c', marginBottom: 8 }}>Недостатки</div>
          {data.cons.map((con) => (
            <div key={con} style={{ fontSize: 13, color: '#991b1b', marginBottom: 4 }}>⚠️ {con}</div>
          ))}
        </div>
      </div>

      <div style={{ padding: 12, background: '#eff6ff', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
        <strong>Когда использовать:</strong> {data.useCase}
      </div>

      {/* Сравнительная таблица */}
      <button
        onClick={() => setShowComparison(!showComparison)}
        style={{
          padding: '8px 16px',
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          background: 'white',
          cursor: 'pointer',
          fontSize: 13,
          marginBottom: 8,
        }}
      >
        {showComparison ? '▼' : '▶'} Сравнительная таблица QoS 0/1/2
      </button>

      {showComparison && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Параметр</th>
              <th style={{ padding: '8px 12px', textAlign: 'center', border: '1px solid #e5e7eb', color: '#3b82f6' }}>QoS 0</th>
              <th style={{ padding: '8px 12px', textAlign: 'center', border: '1px solid #e5e7eb', color: '#f59e0b' }}>QoS 1</th>
              <th style={{ padding: '8px 12px', textAlign: 'center', border: '1px solid #e5e7eb', color: '#8b5cf6' }}>QoS 2</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row) => (
              <tr key={row.param}>
                <td style={{ padding: '6px 12px', border: '1px solid #e5e7eb', fontWeight: 600 }}>{row.param}</td>
                <td style={{ padding: '6px 12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>{row.qos0}</td>
                <td style={{ padding: '6px 12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>{row.qos1}</td>
                <td style={{ padding: '6px 12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>{row.qos2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// ============================================
// Задание 4.2: Retained Messages — Решение
// ============================================

interface RetainedMessage {
  topic: string
  payload: string
  timestamp: string
  isRetained: boolean
}

export function Task4_2_Solution() {
  const [retainedStore, setRetainedStore] = useState<Map<string, RetainedMessage>>(new Map([
    ['home/temperature', { topic: 'home/temperature', payload: '22.5', timestamp: '10:00:00', isRetained: true }],
    ['home/humidity', { topic: 'home/humidity', payload: '65', timestamp: '10:00:05', isRetained: true }],
    ['device/esp32/status', { topic: 'device/esp32/status', payload: 'online', timestamp: '10:01:00', isRetained: true }],
  ]))
  const [newTopic, setNewTopic] = useState('home/light/state')
  const [newPayload, setNewPayload] = useState('ON')
  const [isRetained, setIsRetained] = useState(true)
  const [log, setLog] = useState<string[]>([
    '> Брокер запущен. 3 retained сообщения в хранилище.',
  ])
  const [subscribedTopic, setSubscribedTopic] = useState('home/#')
  const [newSubscriberReceived, setNewSubscriberReceived] = useState<RetainedMessage[]>([])

  const now = () => new Date().toLocaleTimeString('ru')

  const publish = () => {
    const msg: RetainedMessage = {
      topic: newTopic,
      payload: newPayload,
      timestamp: now(),
      isRetained,
    }

    const newLog = [...log]

    if (isRetained) {
      if (newPayload === '') {
        const newStore = new Map(retainedStore)
        newStore.delete(newTopic)
        setRetainedStore(newStore)
        newLog.push(`> [${now()}] PUBLISH retained=true payload="" → удалено retained для "${newTopic}"`)
      } else {
        const newStore = new Map(retainedStore)
        newStore.set(newTopic, msg)
        setRetainedStore(newStore)
        newLog.push(`> [${now()}] PUBLISH retained=true "${newTopic}" = "${newPayload}" → сохранено`)
      }
    } else {
      newLog.push(`> [${now()}] PUBLISH retained=false "${newTopic}" = "${newPayload}" → доставлено, НЕ сохранено`)
    }

    setLog(newLog)
    setNewSubscriberReceived([])
  }

  const simulateNewSubscriber = () => {
    const received: RetainedMessage[] = []
    retainedStore.forEach((msg, topic) => {
      if (matchesMqttWildcardSimple(subscribedTopic, topic)) {
        received.push(msg)
      }
    })

    const newLog = [...log]
    newLog.push(`> [${now()}] Новый клиент подписался на "${subscribedTopic}"`)
    newLog.push(`> Брокер немедленно отправил ${received.length} retained сообщений`)
    setLog(newLog)
    setNewSubscriberReceived(received)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: Retained Messages</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Демонстрация работы retained-сообщений. Публикуйте сообщения и наблюдайте,
        что получит новый подписчик при подключении.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 12 }}>
            Публикация сообщения
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            <input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Топик"
              style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontFamily: 'monospace', fontSize: 13 }}
            />
            <input
              value={newPayload}
              onChange={(e) => setNewPayload(e.target.value)}
              placeholder="Payload (пусто = удалить retained)"
              style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontFamily: 'monospace', fontSize: 13 }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
              <input
                type="checkbox"
                checked={isRetained}
                onChange={(e) => setIsRetained(e.target.checked)}
              />
              Retained flag
            </label>
            <button
              onClick={publish}
              style={{
                padding: '8px 16px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Опубликовать
            </button>
          </div>

          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>
            Retained хранилище брокера ({retainedStore.size})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {Array.from(retainedStore.values()).map((msg) => (
              <div key={msg.topic} style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: '1px solid #bbf7d0',
                background: '#f0fdf4',
                fontSize: 13,
              }}>
                <code style={{ color: '#166534', display: 'block' }}>{msg.topic}</code>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>"{msg.payload}"</span>
                  <span style={{ color: '#9ca3af', fontSize: 11 }}>{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {retainedStore.size === 0 && (
              <div style={{ color: '#9ca3af', fontSize: 13, fontStyle: 'italic' }}>Хранилище пусто</div>
            )}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 12 }}>
            Симуляция нового подписчика
          </h3>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              value={subscribedTopic}
              onChange={(e) => setSubscribedTopic(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontFamily: 'monospace', fontSize: 13 }}
            />
            <button
              onClick={simulateNewSubscriber}
              style={{
                padding: '8px 16px',
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Подключить клиента
            </button>
          </div>

          {newSubscriberReceived.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#166534', marginBottom: 8, fontWeight: 600 }}>
                Новый клиент сразу получил {newSubscriberReceived.length} сообщений:
              </div>
              {newSubscriberReceived.map((msg) => (
                <div key={msg.topic} style={{
                  padding: '6px 10px',
                  marginBottom: 4,
                  borderRadius: 6,
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  fontSize: 13,
                }}>
                  <code style={{ color: '#1d4ed8' }}>{msg.topic}</code>
                  <span style={{ marginLeft: 8 }}>= "{msg.payload}"</span>
                  <span style={{ marginLeft: 8, fontSize: 11, color: '#6b7280' }}>📌 retained</span>
                </div>
              ))}
            </div>
          )}

          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>
            Лог брокера
          </h3>
          <div style={{
            background: '#1e1e2e',
            color: '#cdd6f4',
            padding: 12,
            borderRadius: 8,
            fontFamily: 'monospace',
            fontSize: 12,
            maxHeight: 200,
            overflowY: 'auto',
          }}>
            {log.map((line, i) => (
              <div key={i} style={{ marginBottom: 2 }}>{line}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 12, background: '#fffbeb', borderRadius: 8, fontSize: 13 }}>
        <strong>Конфигурация Mosquitto:</strong>
        <code style={{ display: 'block', marginTop: 4, color: '#92400e' }}>
          retain_available true{'\n'}
          max_retained_messages 1000
        </code>
        <div style={{ marginTop: 4, color: '#92400e' }}>
          ⚠️ На OpenWRT ограничьте <code>max_retained_messages</code> — каждое retained сообщение занимает RAM.
        </div>
      </div>
    </div>
  )
}

function matchesMqttWildcardSimple(pattern: string, topic: string): boolean {
  const patternParts = pattern.split('/')
  const topicParts = topic.split('/')

  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i]
    if (p === '#') return true
    if (i >= topicParts.length) return false
    if (p !== '+' && p !== topicParts[i]) return false
  }

  return patternParts.length === topicParts.length
}

// ============================================
// Задание 4.3: Last Will and Testament — Решение
// ============================================

interface DeviceState {
  id: string
  name: string
  status: 'online' | 'offline' | 'unknown'
  lwtTopic: string
  lwtPayload: string
  lwtQos: 0 | 1 | 2
  lwtRetain: boolean
  lastSeen: string
}

const initialDevices: DeviceState[] = [
  {
    id: 'esp32-01',
    name: 'Датчик температуры (кухня)',
    status: 'online',
    lwtTopic: 'device/esp32-01/status',
    lwtPayload: 'offline',
    lwtQos: 1,
    lwtRetain: true,
    lastSeen: '10:00:00',
  },
  {
    id: 'esp8266-02',
    name: 'Контроллер света (гостиная)',
    status: 'online',
    lwtTopic: 'device/esp8266-02/status',
    lwtPayload: 'offline',
    lwtQos: 1,
    lwtRetain: true,
    lastSeen: '10:00:01',
  },
  {
    id: 'rpi-monitor',
    name: 'Монитор системы (Raspberry Pi)',
    status: 'online',
    lwtTopic: 'monitor/status',
    lwtPayload: '{"status":"offline","reason":"connection_lost"}',
    lwtQos: 2,
    lwtRetain: true,
    lastSeen: '10:00:02',
  },
]

export function Task4_3_Solution() {
  const [devices, setDevices] = useState<DeviceState[]>(initialDevices)
  const [log, setLog] = useState<string[]>([
    '> [10:00:00] esp32-01 подключился. Will: device/esp32-01/status → "offline" (QoS 1, retain)',
    '> [10:00:01] esp8266-02 подключился. Will: device/esp8266-02/status → "offline" (QoS 1, retain)',
    '> [10:00:02] rpi-monitor подключился. Will: monitor/status → {...} (QoS 2, retain)',
  ])
  const [selectedDevice, setSelectedDevice] = useState<string>('esp32-01')
  const [newLwtTopic, setNewLwtTopic] = useState('device/esp32-01/status')
  const [newLwtPayload, setNewLwtPayload] = useState('offline')
  const [newLwtQos, setNewLwtQos] = useState<0 | 1 | 2>(1)
  const [newLwtRetain, setNewLwtRetain] = useState(true)

  const now = () => new Date().toLocaleTimeString('ru')

  const simulateCrash = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId)
    if (!device) return

    setDevices((prev) => prev.map((d) =>
      d.id === deviceId ? { ...d, status: 'offline' as const } : d
    ))

    setLog((prev) => [
      ...prev,
      `> [${now()}] ⚡ ${deviceId} — соединение оборвалось!`,
      `> [${now()}] Брокер обнаружил разрыв (keep-alive timeout)`,
      `> [${now()}] Брокер публикует LWT: "${device.lwtTopic}" = "${device.lwtPayload}" (QoS ${device.lwtQos}${device.lwtRetain ? ', retain' : ''})`,
    ])
  }

  const simulateNormalDisconnect = (deviceId: string) => {
    setDevices((prev) => prev.map((d) =>
      d.id === deviceId ? { ...d, status: 'offline' as const } : d
    ))

    setLog((prev) => [
      ...prev,
      `> [${now()}] ${deviceId} отправил DISCONNECT`,
      `> [${now()}] Брокер получил DISCONNECT — LWT НЕ отправляется`,
      `> [${now()}] ${deviceId} отключён нормально`,
    ])
  }

  const reconnectDevice = (deviceId: string) => {
    setDevices((prev) => prev.map((d) =>
      d.id === deviceId ? { ...d, status: 'online' as const, lastSeen: now() } : d
    ))

    const device = devices.find((d) => d.id === deviceId)
    setLog((prev) => [
      ...prev,
      `> [${now()}] ${deviceId} переподключился`,
      `> [${now()}] Публикует retained: "${device?.lwtTopic}" = "online"`,
    ])
  }

  const statusColor = (status: string) => {
    if (status === 'online') return '#16a34a'
    if (status === 'offline') return '#dc2626'
    return '#9ca3af'
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.3: Last Will and Testament</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Демонстрация LWT: симулируйте аварийное отключение и нормальный disconnect устройств.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 12 }}>
            Устройства (с настроенным LWT)
          </h3>

          {devices.map((device) => (
            <div
              key={device.id}
              onClick={() => setSelectedDevice(device.id)}
              style={{
                padding: 12,
                borderRadius: 8,
                border: `2px solid ${selectedDevice === device.id ? '#3b82f6' : '#e5e7eb'}`,
                marginBottom: 8,
                cursor: 'pointer',
                background: selectedDevice === device.id ? '#eff6ff' : 'white',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: statusColor(device.status),
                  display: 'inline-block',
                  flexShrink: 0,
                }} />
                <strong style={{ fontSize: 14 }}>{device.name}</strong>
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                ID: <code>{device.id}</code> | Статус: <span style={{ color: statusColor(device.status), fontWeight: 600 }}>{device.status}</span>
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                LWT: <code>{device.lwtTopic}</code> → "{device.lwtPayload}"
              </div>

              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); simulateCrash(device.id) }}
                  disabled={device.status === 'offline'}
                  style={{
                    padding: '4px 10px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: device.status === 'offline' ? 'not-allowed' : 'pointer',
                    fontSize: 12,
                    opacity: device.status === 'offline' ? 0.5 : 1,
                  }}
                >
                  ⚡ Краш
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); simulateNormalDisconnect(device.id) }}
                  disabled={device.status === 'offline'}
                  style={{
                    padding: '4px 10px',
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: device.status === 'offline' ? 'not-allowed' : 'pointer',
                    fontSize: 12,
                    opacity: device.status === 'offline' ? 0.5 : 1,
                  }}
                >
                  DISCONNECT
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); reconnectDevice(device.id) }}
                  disabled={device.status === 'online'}
                  style={{
                    padding: '4px 10px',
                    background: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: device.status === 'online' ? 'not-allowed' : 'pointer',
                    fontSize: 12,
                    opacity: device.status === 'online' ? 0.5 : 1,
                  }}
                >
                  Переподключить
                </button>
              </div>
            </div>
          ))}

          {/* LWT конфигурация */}
          <div style={{ marginTop: 16, padding: 12, background: '#f9fafb', borderRadius: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Пример настройки LWT:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Will Topic:</label>
                <input
                  value={newLwtTopic}
                  onChange={(e) => setNewLwtTopic(e.target.value)}
                  style={{ width: '100%', padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 4, fontFamily: 'monospace', fontSize: 12, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Will Payload:</label>
                <input
                  value={newLwtPayload}
                  onChange={(e) => setNewLwtPayload(e.target.value)}
                  style={{ width: '100%', padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 4, fontFamily: 'monospace', fontSize: 12, boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <label style={{ fontSize: 12, color: '#6b7280' }}>QoS:</label>
                {([0, 1, 2] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setNewLwtQos(q)}
                    style={{
                      padding: '2px 10px',
                      border: '1px solid #e5e7eb',
                      borderRadius: 4,
                      background: newLwtQos === q ? '#3b82f6' : 'white',
                      color: newLwtQos === q ? 'white' : '#374151',
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >
                    {q}
                  </button>
                ))}
                <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input type="checkbox" checked={newLwtRetain} onChange={(e) => setNewLwtRetain(e.target.checked)} />
                  retain
                </label>
              </div>
            </div>
            <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 11, background: '#1e1e2e', color: '#cdd6f4', padding: 8, borderRadius: 4 }}>
              {`# Python paho-mqtt`}{'\n'}
              {`client.will_set(`}{'\n'}
              {`  topic='${newLwtTopic}',`}{'\n'}
              {`  payload='${newLwtPayload}',`}{'\n'}
              {`  qos=${newLwtQos},`}{'\n'}
              {`  retain=${newLwtRetain ? 'True' : 'False'}`}{'\n'}
              {`)`}
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>
            Лог брокера
          </h3>
          <div style={{
            background: '#1e1e2e',
            color: '#cdd6f4',
            padding: 12,
            borderRadius: 8,
            fontFamily: 'monospace',
            fontSize: 11,
            height: 300,
            overflowY: 'auto',
          }}>
            {log.map((line, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 2,
                  color: line.includes('⚡') ? '#f38ba8' :
                    line.includes('LWT') ? '#fab387' :
                      line.includes('переподключился') ? '#a6e3a1' : '#cdd6f4',
                }}
              >
                {line}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: 12, background: '#fffbeb', borderRadius: 8, fontSize: 13 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Паттерн Online/Offline:</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12 }}>
              <div style={{ color: '#16a34a' }}>1. will_set(topic, "offline", retain=True)</div>
              <div style={{ color: '#16a34a' }}>2. client.connect(broker)</div>
              <div style={{ color: '#3b82f6' }}>3. publish(topic, "online", retain=True)</div>
              <div style={{ marginTop: 4, color: '#6b7280' }}>--- при нормальном завершении ---</div>
              <div style={{ color: '#f59e0b' }}>4. publish(topic, "offline", retain=True)</div>
              <div style={{ color: '#f59e0b' }}>5. client.disconnect() ← LWT не отправляется!</div>
              <div style={{ marginTop: 4, color: '#6b7280' }}>--- при аварии ---</div>
              <div style={{ color: '#ef4444' }}>4. [обрыв соединения]</div>
              <div style={{ color: '#ef4444' }}>5. Брокер → publish LWT "offline"</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
