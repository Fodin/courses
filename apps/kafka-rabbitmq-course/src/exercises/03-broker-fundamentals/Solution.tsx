// ============================================
// Level 3: Broker Fundamentals — Solutions
// ============================================

import { useState } from 'react'
import { useLanguage } from '../../hooks'

// ============================================
// Task 3.1: Anatomy of a Message Broker
// ============================================

interface BrokerComponent {
  id: string
  label: string
  icon: string
  color: string
  bgColor: string
  borderColor: string
  description: string
  details: string[]
  layer: 'connection' | 'routing' | 'storage'
}

const brokerComponents: BrokerComponent[] = [
  {
    id: 'connection',
    label: 'Connection',
    icon: '🔌',
    color: '#1565C0',
    bgColor: '#E3F2FD',
    borderColor: '#90CAF9',
    description: 'TCP-соединение между клиентом и брокером. Один клиент — одно соединение.',
    details: [
      'Устанавливается через TCP (порт 5672) или TLS (5671)',
      'Один физический сокет на клиента',
      'Содержит параметры: heartbeat, frame-max, virtual host',
      'Аутентификация происходит на этапе Connection.Open',
    ],
    layer: 'connection',
  },
  {
    id: 'channel',
    label: 'Channel',
    icon: '📡',
    color: '#6A1B9A',
    bgColor: '#F3E5F5',
    borderColor: '#CE93D8',
    description: 'Виртуальное соединение внутри Connection. Позволяет мультиплексировать операции.',
    details: [
      'Несколько channels на одном Connection (channel multiplexing)',
      'Каждый channel независим: свой счётчик delivery-tag',
      'Publish и consume выполняются через channel, не connection',
      'При ошибке channel закрывается, connection остаётся',
    ],
    layer: 'connection',
  },
  {
    id: 'exchange',
    label: 'Exchange',
    icon: '🔀',
    color: '#E65100',
    bgColor: '#FFF3E0',
    borderColor: '#FFCC80',
    description: 'Маршрутизатор сообщений. Получает сообщения от producer и направляет в очереди по правилам.',
    details: [
      'Типы: direct, fanout, topic, headers',
      'Параметры: durable, auto-delete, internal',
      'Не хранит сообщения — только маршрутизирует',
      'Default exchange (""): доставляет напрямую по имени очереди',
    ],
    layer: 'routing',
  },
  {
    id: 'binding',
    label: 'Binding',
    icon: '🔗',
    color: '#558B2F',
    bgColor: '#F1F8E9',
    borderColor: '#AED581',
    description: 'Правило маршрутизации: связывает Exchange с Queue через routing key или аргументы.',
    details: [
      'Binding key: шаблон для сопоставления с routing key',
      'Для fanout exchange binding key игнорируется',
      'Один exchange может быть привязан к нескольким queues',
      'Создаётся командой queue.bind',
    ],
    layer: 'routing',
  },
  {
    id: 'queue',
    label: 'Queue',
    icon: '📦',
    color: '#00695C',
    bgColor: '#E0F2F1',
    borderColor: '#80CBC4',
    description: 'Хранилище сообщений. Consumer подписывается на queue и получает сообщения.',
    details: [
      'Параметры: durable, exclusive, auto-delete, arguments',
      'x-message-ttl: время жизни сообщения в очереди',
      'x-dead-letter-exchange: куда отправлять rejected/expired сообщения',
      'x-max-length: ограничение количества сообщений',
    ],
    layer: 'storage',
  },
]

interface MessageFlow {
  id: number
  step: string
  from: string
  to: string
  detail: string
  color: string
}

const messageFlowSteps: MessageFlow[] = [
  {
    id: 1,
    step: 'Producer → Exchange',
    from: 'Producer',
    to: 'Exchange',
    detail: 'basic.publish с routing_key="orders.new"',
    color: '#1565C0',
  },
  {
    id: 2,
    step: 'Exchange → Binding',
    from: 'Exchange',
    to: 'Binding',
    detail: 'Сопоставление routing_key с binding_key "orders.*"',
    color: '#E65100',
  },
  {
    id: 3,
    step: 'Binding → Queue',
    from: 'Binding',
    to: 'Queue',
    detail: 'Сообщение помещается в очередь "order-processing"',
    color: '#558B2F',
  },
  {
    id: 4,
    step: 'Queue → Consumer',
    from: 'Queue',
    to: 'Consumer',
    detail: 'basic.deliver — consumer получает сообщение',
    color: '#00695C',
  },
  {
    id: 5,
    step: 'Consumer → ACK',
    from: 'Consumer',
    to: 'Broker',
    detail: 'basic.ack — сообщение удаляется из очереди',
    color: '#2E7D32',
  },
]

export function Task3_1_Solution() {
  const { t } = useLanguage()
  const [selectedComponent, setSelectedComponent] = useState<BrokerComponent | null>(null)
  const [flowStep, setFlowStep] = useState<number>(0)
  const [flowLog, setFlowLog] = useState<MessageFlow[]>([])
  const [animating, setAnimating] = useState(false)

  const runFlow = async () => {
    if (animating) return
    setAnimating(true)
    setFlowLog([])
    setFlowStep(0)

    for (let i = 0; i < messageFlowSteps.length; i++) {
      await new Promise(r => setTimeout(r, 700))
      setFlowStep(i + 1)
      setFlowLog(prev => [...prev, messageFlowSteps[i]])
    }

    await new Promise(r => setTimeout(r, 500))
    setAnimating(false)
  }

  const layers = [
    { label: 'Уровень соединения', ids: ['connection', 'channel'], color: '#1565C0' },
    { label: 'Уровень маршрутизации', ids: ['exchange', 'binding'], color: '#E65100' },
    { label: 'Уровень хранения', ids: ['queue'], color: '#00695C' },
  ]

  return (
    <div className="exercise-container" style={{ padding: '1.25rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.3.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Кликните на компонент брокера, чтобы узнать о его роли. Запустите симуляцию, чтобы увидеть путь сообщения.
      </p>

      {/* Broker internals diagram */}
      <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #e0e0e0' }}>
        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#888', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Внутренняя архитектура брокера (AMQP)
        </div>

        {layers.map(layer => (
          <div key={layer.label} style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.72rem', color: layer.color, fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {layer.label}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {layer.ids.map(id => {
                const comp = brokerComponents.find(c => c.id === id)!
                const isSelected = selectedComponent?.id === id
                return (
                  <div
                    key={id}
                    onClick={() => setSelectedComponent(isSelected ? null : comp)}
                    style={{
                      border: `2px solid ${isSelected ? comp.color : comp.borderColor}`,
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      background: isSelected ? comp.bgColor : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      minWidth: '160px',
                      flex: '1',
                      boxShadow: isSelected ? `0 0 0 3px ${comp.borderColor}` : 'none',
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{comp.icon}</div>
                    <div style={{ fontWeight: 700, color: comp.color, fontSize: '0.9rem' }}>{comp.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>{comp.description.split('.')[0]}</div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Component detail panel */}
      {selectedComponent && (
        <div style={{
          border: `2px solid ${selectedComponent.borderColor}`,
          borderRadius: '12px',
          padding: '1.25rem',
          background: selectedComponent.bgColor,
          marginBottom: '1.5rem',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{selectedComponent.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: selectedComponent.color }}>{selectedComponent.label}</div>
              <div style={{ fontSize: '0.85rem', color: '#555' }}>{selectedComponent.description}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.5rem' }}>
            {selectedComponent.details.map((detail, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', alignItems: 'flex-start' }}>
                <span style={{ color: selectedComponent.color, fontWeight: 700, flexShrink: 0 }}>•</span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message flow simulation */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Путь сообщения через брокер</h3>
          <button
            onClick={runFlow}
            disabled={animating}
            style={{
              padding: '0.5rem 1.25rem',
              background: animating ? '#ccc' : '#1565C0',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: animating ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            {animating ? 'Симуляция...' : 'Запустить симуляцию'}
          </button>
        </div>

        {/* Flow steps progress bar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
          {messageFlowSteps.map((step, i) => (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: flowStep > i ? step.color : '#e0e0e0',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem',
                flexShrink: 0,
                transition: 'background 0.3s',
              }}>
                {flowStep > i ? '✓' : i + 1}
              </div>
              {i < messageFlowSteps.length - 1 && (
                <div style={{
                  height: '2px',
                  flex: 1,
                  background: flowStep > i + 1 ? '#2E7D32' : '#e0e0e0',
                  transition: 'background 0.3s',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Flow log terminal */}
        {flowLog.length > 0 && (
          <div style={{
            background: '#0d1117',
            borderRadius: '10px',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            color: '#c9d1d9',
            maxHeight: '220px',
            overflowY: 'auto',
          }}>
            {flowLog.map((entry, i) => (
              <div key={i} style={{ marginBottom: '0.4rem', display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: '#58a6ff', minWidth: '28px' }}>[{entry.id}]</span>
                <span style={{ color: entry.color, fontWeight: 600, minWidth: '180px' }}>{entry.step}</span>
                <span style={{ color: '#8b949e' }}>{entry.detail}</span>
              </div>
            ))}
            {animating && (
              <div style={{ color: '#3fb950', animation: 'blink 1s infinite' }}>_</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Task 3.2: AMQP Protocol: Frame Inspector
// ============================================

type FrameType = 'method' | 'header' | 'body' | 'heartbeat'

interface AmqpFrame {
  type: FrameType
  typeCode: number
  channelId: number
  label: string
  color: string
  bgColor: string
  fields: { name: string; size: string; value: string; description: string }[]
}

interface AmqpCommand {
  id: string
  label: string
  description: string
  icon: string
  frames: AmqpFrame[]
  notes: string[]
}

const amqpCommands: AmqpCommand[] = [
  {
    id: 'basic.publish',
    label: 'basic.publish',
    description: 'Producer публикует сообщение в exchange',
    icon: '📤',
    frames: [
      {
        type: 'method',
        typeCode: 1,
        channelId: 1,
        label: 'Method Frame',
        color: '#1565C0',
        bgColor: '#E3F2FD',
        fields: [
          { name: 'frame-type', size: '1 байт', value: '0x01', description: 'Тип фрейма: метод' },
          { name: 'channel-id', size: '2 байта', value: '0x0001', description: 'Номер channel' },
          { name: 'payload-size', size: '4 байта', value: '0x0000001A', description: 'Размер payload' },
          { name: 'class-id', size: '2 байта', value: '0x003C (60)', description: 'Класс: basic' },
          { name: 'method-id', size: '2 байта', value: '0x0028 (40)', description: 'Метод: publish' },
          { name: 'exchange', size: 'short-str', value: '"orders"', description: 'Имя exchange' },
          { name: 'routing-key', size: 'short-str', value: '"orders.new"', description: 'Routing key' },
          { name: 'mandatory', size: '1 бит', value: '1', description: 'Вернуть если не доставлено' },
          { name: 'frame-end', size: '1 байт', value: '0xCE', description: 'Маркер конца фрейма' },
        ],
      },
      {
        type: 'header',
        typeCode: 2,
        channelId: 1,
        label: 'Header Frame',
        color: '#6A1B9A',
        bgColor: '#F3E5F5',
        fields: [
          { name: 'frame-type', size: '1 байт', value: '0x02', description: 'Тип фрейма: заголовок' },
          { name: 'channel-id', size: '2 байта', value: '0x0001', description: 'Номер channel' },
          { name: 'class-id', size: '2 байта', value: '0x003C', description: 'Класс: basic' },
          { name: 'body-size', size: '8 байт', value: '0x000000000000002F', description: 'Полный размер тела' },
          { name: 'content-type', size: 'short-str', value: '"application/json"', description: 'MIME-тип тела' },
          { name: 'delivery-mode', size: '1 байт', value: '0x02', description: '1=transient, 2=persistent' },
          { name: 'priority', size: '1 байт', value: '0x05', description: 'Приоритет 0-9' },
          { name: 'message-id', size: 'short-str', value: '"msg-uuid-1234"', description: 'Уникальный ID сообщения' },
          { name: 'timestamp', size: '8 байт', value: '0x00000001918F2A00', description: 'Unix timestamp' },
        ],
      },
      {
        type: 'body',
        typeCode: 3,
        channelId: 1,
        label: 'Body Frame',
        color: '#00695C',
        bgColor: '#E0F2F1',
        fields: [
          { name: 'frame-type', size: '1 байт', value: '0x03', description: 'Тип фрейма: тело' },
          { name: 'channel-id', size: '2 байта', value: '0x0001', description: 'Номер channel' },
          { name: 'payload-size', size: '4 байта', value: '0x0000002F', description: 'Размер тела в этом фрейме' },
          { name: 'payload', size: '47 байт', value: '{"orderId":"42","amount":1500}', description: 'Тело сообщения (может быть разбито на несколько body frames)' },
          { name: 'frame-end', size: '1 байт', value: '0xCE', description: 'Маркер конца фрейма' },
        ],
      },
    ],
    notes: [
      'Большие сообщения разбиваются на несколько Body Frame',
      'Method Frame всегда первый',
      'Header Frame содержит content properties (не путать с HTTP headers)',
      'frame-end = 0xCE — инвариант протокола для обнаружения ошибок',
    ],
  },
  {
    id: 'basic.consume',
    label: 'basic.consume',
    description: 'Consumer регистрирует подписку на queue',
    icon: '📥',
    frames: [
      {
        type: 'method',
        typeCode: 1,
        channelId: 2,
        label: 'Method Frame (basic.consume)',
        color: '#1565C0',
        bgColor: '#E3F2FD',
        fields: [
          { name: 'frame-type', size: '1 байт', value: '0x01', description: 'Тип: метод' },
          { name: 'channel-id', size: '2 байта', value: '0x0002', description: 'Channel 2' },
          { name: 'class-id', size: '2 байта', value: '0x003C (60)', description: 'Класс: basic' },
          { name: 'method-id', size: '2 байта', value: '0x0014 (20)', description: 'Метод: consume' },
          { name: 'queue', size: 'short-str', value: '"order-processing"', description: 'Имя очереди' },
          { name: 'consumer-tag', size: 'short-str', value: '"consumer-1"', description: 'Идентификатор consumer' },
          { name: 'no-local', size: '1 бит', value: '0', description: 'Не получать свои сообщения' },
          { name: 'no-ack', size: '1 бит', value: '0', description: '0 = требует ручной ACK' },
          { name: 'exclusive', size: '1 бит', value: '0', description: 'Эксклюзивный потребитель' },
        ],
      },
      {
        type: 'method',
        typeCode: 1,
        channelId: 2,
        label: 'Method Frame (basic.consume-ok) ← ответ брокера',
        color: '#2E7D32',
        bgColor: '#E8F5E9',
        fields: [
          { name: 'frame-type', size: '1 байт', value: '0x01', description: 'Тип: метод' },
          { name: 'channel-id', size: '2 байта', value: '0x0002', description: 'Тот же channel' },
          { name: 'class-id', size: '2 байта', value: '0x003C', description: 'Класс: basic' },
          { name: 'method-id', size: '2 байта', value: '0x0015 (21)', description: 'Метод: consume-ok' },
          { name: 'consumer-tag', size: 'short-str', value: '"consumer-1"', description: 'Подтверждение тега' },
        ],
      },
    ],
    notes: [
      'basic.consume — асинхронная команда: брокер возвращает consume-ok',
      'После consume-ok брокер начинает push-доставку через basic.deliver',
      'no-ack=0 означает, что consumer должен вручную отправить basic.ack',
      'consumer-tag используется для отмены подписки через basic.cancel',
    ],
  },
  {
    id: 'basic.ack',
    label: 'basic.ack',
    description: 'Consumer подтверждает обработку сообщения',
    icon: '✅',
    frames: [
      {
        type: 'method',
        typeCode: 1,
        channelId: 2,
        label: 'Method Frame (basic.ack)',
        color: '#2E7D32',
        bgColor: '#E8F5E9',
        fields: [
          { name: 'frame-type', size: '1 байт', value: '0x01', description: 'Тип: метод' },
          { name: 'channel-id', size: '2 байта', value: '0x0002', description: 'Тот же channel' },
          { name: 'class-id', size: '2 байта', value: '0x003C', description: 'Класс: basic' },
          { name: 'method-id', size: '2 байта', value: '0x0050 (80)', description: 'Метод: ack' },
          { name: 'delivery-tag', size: '8 байт', value: '0x0000000000000007', description: 'ID доставки (порядковый)' },
          { name: 'multiple', size: '1 бит', value: '0', description: '1 = ACK всех до этого тега' },
        ],
      },
    ],
    notes: [
      'delivery-tag — монотонно возрастающий счётчик в рамках channel',
      'multiple=1: ACK всех сообщений с delivery-tag <= указанному',
      'basic.ack не имеет ответа от брокера (одностороннее)',
      'Брокер удаляет сообщение из очереди немедленно после ACK',
    ],
  },
  {
    id: 'connection.start',
    label: 'connection.start',
    description: 'Брокер инициирует рукопожатие при подключении',
    icon: '🤝',
    frames: [
      {
        type: 'method',
        typeCode: 1,
        channelId: 0,
        label: 'Method Frame (connection.start) ← от брокера',
        color: '#E65100',
        bgColor: '#FFF3E0',
        fields: [
          { name: 'frame-type', size: '1 байт', value: '0x01', description: 'Тип: метод' },
          { name: 'channel-id', size: '2 байта', value: '0x0000', description: 'Channel 0 (только для connection)' },
          { name: 'version-major', size: '1 байт', value: '0x00', description: 'AMQP major: 0' },
          { name: 'version-minor', size: '1 байт', value: '0x09', description: 'AMQP minor: 9 (= AMQP 0-9-1)' },
          { name: 'server-properties', size: 'table', value: '{product: "RabbitMQ", version: "3.12"}', description: 'Возможности сервера' },
          { name: 'mechanisms', size: 'long-str', value: '"PLAIN AMQPLAIN"', description: 'Поддерживаемые SASL механизмы' },
          { name: 'locales', size: 'long-str', value: '"en_US"', description: 'Поддерживаемые локали' },
        ],
      },
    ],
    notes: [
      'connection.start всегда идёт по channel 0 — зарезервирован для connection',
      'Перед этим клиент отправляет "AMQP\\0\\0\\9\\1" — протокольный заголовок',
      'Далее: start-ok → tune → tune-ok → open → open-ok',
      'Только после open-ok можно открывать channels и работать с сообщениями',
    ],
  },
]

export function Task3_2_Solution() {
  const { t } = useLanguage()
  const [selectedCommand, setSelectedCommand] = useState<AmqpCommand>(amqpCommands[0])
  const [selectedFrame, setSelectedFrame] = useState<AmqpFrame | null>(null)

  const frameTypeLabels: Record<FrameType, string> = {
    method: 'METHOD',
    header: 'HEADER',
    body: 'BODY',
    heartbeat: 'HEARTBEAT',
  }

  return (
    <div className="exercise-container" style={{ padding: '1.25rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.3.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Выберите AMQP-команду и изучите её разбивку на фреймы. Кликните на фрейм, чтобы увидеть каждое поле.
      </p>

      {/* Command selector */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {amqpCommands.map(cmd => (
          <button
            key={cmd.id}
            onClick={() => { setSelectedCommand(cmd); setSelectedFrame(null) }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: `2px solid ${selectedCommand.id === cmd.id ? '#1565C0' : '#ddd'}`,
              background: selectedCommand.id === cmd.id ? '#E3F2FD' : '#fff',
              color: selectedCommand.id === cmd.id ? '#1565C0' : '#555',
              cursor: 'pointer',
              fontWeight: selectedCommand.id === cmd.id ? 700 : 400,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>{cmd.icon}</span>
            <span style={{ fontFamily: 'monospace' }}>{cmd.label}</span>
          </button>
        ))}
      </div>

      {/* Command description */}
      <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.5rem', border: '1px solid #e0e0e0', fontSize: '0.9rem', color: '#444' }}>
        <strong style={{ color: '#1565C0' }}>{selectedCommand.icon} {selectedCommand.label}</strong> — {selectedCommand.description}
      </div>

      {/* Frames visualization */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#666', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Структура фреймов ({selectedCommand.frames.length} фрейм{selectedCommand.frames.length > 1 ? 'а' : ''})
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {selectedCommand.frames.map((frame, i) => (
            <div
              key={i}
              onClick={() => setSelectedFrame(selectedFrame === frame ? null : frame)}
              style={{
                border: `2px solid ${selectedFrame === frame ? frame.color : frame.borderColor || '#ddd'}`,
                borderRadius: '10px',
                padding: '1rem',
                background: selectedFrame === frame ? frame.bgColor : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flex: '1',
                minWidth: '200px',
                boxShadow: selectedFrame === frame ? `0 2px 12px ${frame.bgColor}` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{
                  background: frame.color,
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}>
                  {frameTypeLabels[frame.type]}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>ch={frame.channelId}</div>
              </div>
              <div style={{ fontWeight: 600, color: frame.color, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{frame.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#777' }}>{frame.fields.length} полей</div>
            </div>
          ))}
        </div>

        {/* Byte layout visualization */}
        <div style={{ marginTop: '1rem', background: '#0d1117', borderRadius: '8px', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#8b949e', overflowX: 'auto' }}>
          <div style={{ color: '#58a6ff', marginBottom: '0.5rem' }}>// Байтовая схема AMQP фрейма</div>
          <div style={{ display: 'flex', gap: '0', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'type\n1 байт', width: '60px', color: '#ff7b72' },
              { label: 'channel\n2 байта', width: '80px', color: '#d2a8ff' },
              { label: 'size\n4 байта', width: '80px', color: '#79c0ff' },
              { label: 'payload\nN байт', width: '200px', color: '#3fb950' },
              { label: 'frame-end\n0xCE', width: '80px', color: '#ff7b72' },
            ].map((block, i) => (
              <div key={i} style={{
                width: block.width,
                padding: '0.4rem',
                border: `1px solid ${block.color}33`,
                background: `${block.color}11`,
                color: block.color,
                textAlign: 'center',
                fontSize: '0.7rem',
                whiteSpace: 'pre',
                lineHeight: 1.4,
              }}>
                {block.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frame field detail */}
      {selectedFrame && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#666', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Поля фрейма: {selectedFrame.label}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', border: '1px solid #e0e0e0', color: '#555', fontWeight: 600 }}>Поле</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', border: '1px solid #e0e0e0', color: '#555', fontWeight: 600 }}>Размер</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', border: '1px solid #e0e0e0', color: '#555', fontWeight: 600 }}>Значение</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', border: '1px solid #e0e0e0', color: '#555', fontWeight: 600 }}>Описание</th>
                </tr>
              </thead>
              <tbody>
                {selectedFrame.fields.map((field, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e0e0e0', fontFamily: 'monospace', color: selectedFrame.color, fontWeight: 600 }}>{field.name}</td>
                    <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e0e0e0', color: '#888', fontFamily: 'monospace', fontSize: '0.8rem' }}>{field.size}</td>
                    <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e0e0e0', fontFamily: 'monospace', color: '#2E7D32' }}>{field.value}</td>
                    <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e0e0e0', color: '#555' }}>{field.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes */}
      <div style={{ background: '#FFF9C4', border: '1px solid #FFE082', borderRadius: '8px', padding: '1rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#F57F17' }}>Заметки о {selectedCommand.label}</div>
        {selectedCommand.notes.map((note, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.3rem', color: '#555' }}>
            <span style={{ color: '#F57F17', fontWeight: 700, flexShrink: 0 }}>•</span>
            <span>{note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Task 3.3: Delivery Guarantees: ACK/NACK Simulator
// ============================================

type MessageState =
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'processing'
  | 'acked'
  | 'nacked'
  | 'requeued'
  | 'dead-lettered'
  | 'timeout'
  | 'redelivering'

interface SimMessage {
  id: number
  payload: string
  deliveryTag: number
  state: MessageState
  redelivered: boolean
  attempt: number
  timestamp: number
  result?: string
}

interface StateInfo {
  label: string
  color: string
  bgColor: string
  icon: string
  description: string
}

const stateInfo: Record<MessageState, StateInfo> = {
  ready: { label: 'В очереди', color: '#1565C0', bgColor: '#E3F2FD', icon: '📦', description: 'Сообщение в очереди, ожидает consumer' },
  delivering: { label: 'Доставка...', color: '#E65100', bgColor: '#FFF3E0', icon: '📡', description: 'Брокер отправляет сообщение consumer' },
  delivered: { label: 'Доставлено', color: '#6A1B9A', bgColor: '#F3E5F5', icon: '📬', description: 'Сообщение у consumer, ожидает обработки' },
  processing: { label: 'Обработка', color: '#F57F17', bgColor: '#FFF9C4', icon: '⚙️', description: 'Consumer обрабатывает сообщение' },
  acked: { label: 'ACK — удалено', color: '#2E7D32', bgColor: '#E8F5E9', icon: '✅', description: 'Consumer подтвердил обработку, сообщение удалено' },
  nacked: { label: 'NACK', color: '#C62828', bgColor: '#FFEBEE', icon: '❌', description: 'Consumer отклонил сообщение' },
  requeued: { label: 'Requeue', color: '#1565C0', bgColor: '#E3F2FD', icon: '🔄', description: 'Сообщение возвращено в начало очереди' },
  'dead-lettered': { label: 'Dead Letter', color: '#880E4F', bgColor: '#FCE4EC', icon: '💀', description: 'Сообщение отправлено в Dead Letter Queue' },
  timeout: { label: 'Timeout!', color: '#BF360C', bgColor: '#FBE9E7', icon: '⏰', description: 'Consumer не ответил вовремя' },
  redelivering: { label: 'Переотправка', color: '#AD1457', bgColor: '#FCE4EC', icon: '🔁', description: 'Брокер повторно доставляет сообщение (redelivered=true)' },
}

const samplePayloads = [
  '{"orderId": "42", "amount": 1500}',
  '{"userId": "usr-99", "action": "signup"}',
  '{"productId": "SKU-001", "qty": 3}',
  '{"event": "payment.received", "sum": 999}',
]

export function Task3_3_Solution() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<SimMessage[]>([])
  const [nextId, setNextId] = useState(1)
  const [nextDeliveryTag, setNextDeliveryTag] = useState(1)
  const [log, setLog] = useState<{ time: string; text: string; color: string }[]>([])
  const [prefetch, setPrefetch] = useState(3)
  const [autoAck, setAutoAck] = useState(false)

  const addLog = (text: string, color: string = '#c9d1d9') => {
    const time = new Date().toLocaleTimeString('ru-RU', { hour12: false })
    setLog(prev => [{ time, text, color }, ...prev].slice(0, 40))
  }

  const updateMessage = (id: number, updates: Partial<SimMessage>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const sendMessage = () => {
    const delivering = messages.filter(m =>
      ['delivering', 'delivered', 'processing'].includes(m.state)
    ).length
    if (delivering >= prefetch) {
      addLog(`BLOCKED: prefetch limit ${prefetch} reached`, '#FF7043')
      return
    }

    const id = nextId
    const tag = nextDeliveryTag
    const payload = samplePayloads[(id - 1) % samplePayloads.length]

    setNextId(id + 1)
    setNextDeliveryTag(tag + 1)

    const msg: SimMessage = {
      id,
      payload,
      deliveryTag: tag,
      state: 'ready',
      redelivered: false,
      attempt: 1,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, msg])
    addLog(`PUBLISH  msg#${id} → queue | payload: ${payload.substring(0, 40)}`, '#58a6ff')

    setTimeout(() => {
      updateMessage(id, { state: 'delivering' })
      addLog(`DELIVER  msg#${id} → consumer | delivery-tag: ${tag}`, '#79c0ff')

      setTimeout(() => {
        updateMessage(id, { state: 'delivered' })
        if (autoAck) {
          addLog(`AUTO-ACK msg#${id} | no-ack mode`, '#3fb950')
          setTimeout(() => updateMessage(id, { state: 'acked', result: 'auto-ack' }), 300)
        } else {
          updateMessage(id, { state: 'processing' })
          addLog(`PROCESS  msg#${id} — ожидание действия consumer...`, '#d2a8ff')
        }
      }, 600)
    }, 500)
  }

  const ackMessage = (msg: SimMessage) => {
    if (!['delivered', 'processing'].includes(msg.state)) return
    updateMessage(msg.id, { state: 'acked', result: 'ACK' })
    addLog(`ACK      msg#${msg.id} | delivery-tag: ${msg.deliveryTag} | удалено из очереди`, '#3fb950')
  }

  const nackRequeue = (msg: SimMessage) => {
    if (!['delivered', 'processing'].includes(msg.state)) return
    updateMessage(msg.id, { state: 'nacked', result: 'NACK+requeue' })
    addLog(`NACK     msg#${msg.id} | requeue=true | возврат в очередь`, '#FF7043')

    setTimeout(() => {
      const newTag = nextDeliveryTag
      setNextDeliveryTag(t => t + 1)
      updateMessage(msg.id, { state: 'requeued' })
      addLog(`REQUEUE  msg#${msg.id} | новый delivery-tag: ${newTag} | redelivered=true`, '#FF7043')

      setTimeout(() => {
        updateMessage(msg.id, {
          state: 'redelivering',
          deliveryTag: newTag,
          redelivered: true,
          attempt: msg.attempt + 1,
        })
        addLog(`REDELIVER msg#${msg.id} (попытка ${msg.attempt + 1}) | redelivered=true`, '#ffa657')

        setTimeout(() => updateMessage(msg.id, { state: 'processing' }), 600)
      }, 700)
    }, 700)
  }

  const nackDeadLetter = (msg: SimMessage) => {
    if (!['delivered', 'processing'].includes(msg.state)) return
    updateMessage(msg.id, { state: 'nacked', result: 'NACK+DLQ' })
    addLog(`NACK     msg#${msg.id} | requeue=false | отправка в DLQ`, '#f85149')

    setTimeout(() => {
      updateMessage(msg.id, { state: 'dead-lettered', result: 'DLQ' })
      addLog(`DLX      msg#${msg.id} → dead-letter-exchange → dlq`, '#ff7b72')
    }, 700)
  }

  const simulateTimeout = (msg: SimMessage) => {
    if (!['delivered', 'processing'].includes(msg.state)) return
    updateMessage(msg.id, { state: 'timeout', result: 'timeout' })
    addLog(`TIMEOUT  msg#${msg.id} | consumer не ответил | переотправка`, '#d29922')

    setTimeout(() => {
      const newTag = nextDeliveryTag
      setNextDeliveryTag(t => t + 1)
      updateMessage(msg.id, {
        state: 'redelivering',
        deliveryTag: newTag,
        redelivered: true,
        attempt: msg.attempt + 1,
      })
      addLog(`REDELIVER msg#${msg.id} (попытка ${msg.attempt + 1}) | новый delivery-tag: ${newTag}`, '#ffa657')

      setTimeout(() => updateMessage(msg.id, { state: 'processing' }), 600)
    }, 1000)
  }

  const clearMessages = () => {
    setMessages([])
    setLog([])
    setNextId(1)
    setNextDeliveryTag(1)
  }

  const activeMessages = messages.filter(m => !['acked', 'dead-lettered'].includes(m.state) || messages.indexOf(m) >= messages.length - 8)
  const stats = {
    total: messages.length,
    acked: messages.filter(m => m.state === 'acked').length,
    deadLettered: messages.filter(m => m.state === 'dead-lettered').length,
    processing: messages.filter(m => ['delivered', 'processing', 'redelivering', 'delivering'].includes(m.state)).length,
  }

  return (
    <div className="exercise-container" style={{ padding: '1.25rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.3.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Отправляйте сообщения и управляйте их подтверждением: ACK (успешно), NACK+Requeue (повтор), NACK+DLQ (в мёртвую очередь), Timeout (не ответил вовремя).
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center', background: '#f8f9fa', padding: '1rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
        <button
          onClick={sendMessage}
          style={{
            padding: '0.6rem 1.25rem',
            background: '#1565C0',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          📤 Отправить сообщение
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <label style={{ color: '#555', fontWeight: 600 }}>Prefetch:</label>
          <input
            type="range"
            min={1}
            max={5}
            value={prefetch}
            onChange={e => setPrefetch(Number(e.target.value))}
            style={{ width: '80px' }}
          />
          <span style={{ fontFamily: 'monospace', color: '#1565C0', fontWeight: 700, minWidth: '20px' }}>{prefetch}</span>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={autoAck}
            onChange={e => setAutoAck(e.target.checked)}
          />
          <span style={{ color: '#555' }}>no-ack mode (auto-ack)</span>
        </label>

        <button
          onClick={clearMessages}
          style={{
            padding: '0.5rem 1rem',
            background: '#fff',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Очистить
        </button>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
          {[
            { label: 'Всего', value: stats.total, color: '#555' },
            { label: 'ACK', value: stats.acked, color: '#2E7D32' },
            { label: 'DLQ', value: stats.deadLettered, color: '#880E4F' },
            { label: 'В работе', value: stats.processing, color: '#E65100' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: stat.color, fontFamily: 'monospace' }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', color: '#888' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* State machine legend */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>State machine</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(Object.entries(stateInfo) as [MessageState, StateInfo][]).map(([state, info]) => (
            <div key={state} style={{
              padding: '3px 8px',
              borderRadius: '6px',
              background: info.bgColor,
              border: `1px solid ${info.color}44`,
              fontSize: '0.72rem',
              color: info.color,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}>
              <span>{info.icon}</span>
              <span>{info.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages list */}
      <div style={{ marginBottom: '1.5rem' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#aaa', padding: '2rem', background: '#f8f9fa', borderRadius: '10px', border: '1px dashed #ddd' }}>
            Нажмите "Отправить сообщение" для начала симуляции
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {activeMessages.slice(-10).reverse().map(msg => {
            const info = stateInfo[msg.state]
            const isActive = ['delivered', 'processing', 'redelivering'].includes(msg.state)

            return (
              <div
                key={msg.id}
                style={{
                  border: `1.5px solid ${info.color}55`,
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  background: info.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  transition: 'all 0.3s',
                }}
              >
                {/* State badge */}
                <div style={{
                  background: info.color,
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0,
                }}>
                  <span>{info.icon}</span>
                  <span>{info.label}</span>
                </div>

                {/* Message info */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#555' }}>
                      msg#{msg.id}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#888' }}>
                      tag={msg.deliveryTag}
                    </span>
                    {msg.redelivered && (
                      <span style={{ fontSize: '0.72rem', background: '#FF7043', color: '#fff', borderRadius: '4px', padding: '1px 5px' }}>
                        redelivered (попытка {msg.attempt})
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#777', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                    {msg.payload}
                  </div>
                </div>

                {/* Actions */}
                {isActive && !autoAck && (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => ackMessage(msg)}
                      style={{ padding: '4px 10px', background: '#2E7D32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      ACK
                    </button>
                    <button
                      onClick={() => nackRequeue(msg)}
                      style={{ padding: '4px 10px', background: '#E65100', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      NACK+Requeue
                    </button>
                    <button
                      onClick={() => nackDeadLetter(msg)}
                      style={{ padding: '4px 10px', background: '#880E4F', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      NACK+DLQ
                    </button>
                    <button
                      onClick={() => simulateTimeout(msg)}
                      style={{ padding: '4px 10px', background: '#BF360C', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                    >
                      Timeout
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Event log */}
      {log.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Лог событий</div>
            <button onClick={() => setLog([])} style={{ padding: '3px 8px', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem' }}>
              Очистить лог
            </button>
          </div>
          <div style={{ background: '#0d1117', borderRadius: '10px', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.78rem', maxHeight: '240px', overflowY: 'auto' }}>
            {log.map((entry, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#58a6ff', flexShrink: 0 }}>{entry.time}</span>
                <span style={{ color: entry.color }}>{entry.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
