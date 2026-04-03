import { useState } from 'react'

// ============================================
// Задание 0.1: Квиз — заглушка (квиз рендерится платформой)
// ============================================

export function Task0_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Сеть и протоколы — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>TCP vs UDP</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>TCP</strong> — надёжная доставка с гарантией порядка (HTTP, email).
            <br />
            <strong>UDP</strong> — быстрая отправка без гарантий (видео, игры, DNS).
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>HTTP/1.1 → HTTP/2 → HTTP/3</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>HTTP/2</strong> — мультиплексинг (параллельные потоки в одном TCP).
            <br />
            <strong>HTTP/3</strong> — QUIC поверх UDP, нет HOL blocking.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>WebSocket</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Полнодуплексный канал поверх TCP. Идеален для чатов и уведомлений.
            Начинается как HTTP Upgrade.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>gRPC</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            HTTP/2 + Protocol Buffers. Бинарный, строго типизированный,
            с поддержкой streaming. Для микросервисов.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 0.2: Калькулятор латентности
// ============================================

interface LatencyStep {
  id: string
  name: string
  description: string
  color: string
  firstRequestMs: number
  repeatRequestMs: number
}

interface Preset {
  name: string
  description: string
  steps: Record<string, { first: number; repeat: number }>
}

const defaultSteps: LatencyStep[] = [
  {
    id: 'dns',
    name: 'DNS Lookup',
    description: 'Преобразование домена в IP-адрес',
    color: '#1976d2',
    firstRequestMs: 50,
    repeatRequestMs: 0,
  },
  {
    id: 'tcp',
    name: 'TCP Handshake',
    description: '3-way handshake (SYN → SYN-ACK → ACK)',
    color: '#388e3c',
    firstRequestMs: 30,
    repeatRequestMs: 0,
  },
  {
    id: 'tls',
    name: 'TLS Handshake',
    description: 'Установка шифрованного канала',
    color: '#f57c00',
    firstRequestMs: 40,
    repeatRequestMs: 0,
  },
  {
    id: 'request',
    name: 'HTTP Request',
    description: 'Отправка запроса серверу',
    color: '#7b1fa2',
    firstRequestMs: 15,
    repeatRequestMs: 15,
  },
  {
    id: 'processing',
    name: 'Server Processing',
    description: 'Обработка на сервере (БД, логика)',
    color: '#d32f2f',
    firstRequestMs: 50,
    repeatRequestMs: 50,
  },
  {
    id: 'response',
    name: 'Response Transfer',
    description: 'Передача ответа клиенту',
    color: '#00796b',
    firstRequestMs: 20,
    repeatRequestMs: 20,
  },
]

const presets: Preset[] = [
  {
    name: 'Локальная сеть',
    description: 'Сервер в той же сети (< 1 мс RTT)',
    steps: {
      dns: { first: 5, repeat: 0 },
      tcp: { first: 1, repeat: 0 },
      tls: { first: 2, repeat: 0 },
      request: { first: 1, repeat: 1 },
      processing: { first: 20, repeat: 20 },
      response: { first: 2, repeat: 2 },
    },
  },
  {
    name: 'Один континент',
    description: 'Сервер в другом городе (~30 мс RTT)',
    steps: {
      dns: { first: 50, repeat: 0 },
      tcp: { first: 30, repeat: 0 },
      tls: { first: 40, repeat: 0 },
      request: { first: 15, repeat: 15 },
      processing: { first: 50, repeat: 50 },
      response: { first: 20, repeat: 20 },
    },
  },
  {
    name: 'Межконтинентальный',
    description: 'Сервер на другом конце мира (~150 мс RTT)',
    steps: {
      dns: { first: 120, repeat: 0 },
      tcp: { first: 150, repeat: 0 },
      tls: { first: 200, repeat: 0 },
      request: { first: 75, repeat: 75 },
      processing: { first: 80, repeat: 80 },
      response: { first: 100, repeat: 100 },
    },
  },
]

export function Task0_2_Solution() {
  const [steps, setSteps] = useState<LatencyStep[]>(defaultSteps)
  const [activePreset, setActivePreset] = useState<number>(1)
  const [showRepeat, setShowRepeat] = useState(false)

  const applyPreset = (presetIndex: number) => {
    const preset = presets[presetIndex]
    setActivePreset(presetIndex)
    setSteps((prev) =>
      prev.map((step) => ({
        ...step,
        firstRequestMs: preset.steps[step.id].first,
        repeatRequestMs: preset.steps[step.id].repeat,
      }))
    )
  }

  const updateStep = (id: string, field: 'firstRequestMs' | 'repeatRequestMs', value: number) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    )
    setActivePreset(-1)
  }

  const totalFirst = steps.reduce((sum, s) => sum + s.firstRequestMs, 0)
  const totalRepeat = steps.reduce((sum, s) => sum + s.repeatRequestMs, 0)
  const maxMs = Math.max(totalFirst, 1)

  const currentSteps = showRepeat
    ? steps.map((s) => ({ ...s, currentMs: s.repeatRequestMs }))
    : steps.map((s) => ({ ...s, currentMs: s.firstRequestMs }))
  const currentTotal = showRepeat ? totalRepeat : totalFirst

  let accumulated = 0

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Калькулятор латентности HTTP-запроса</h2>

      {/* Presets */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>Пресеты</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={() => applyPreset(i)}
              style={{
                padding: '0.5rem 1rem',
                border: `2px solid ${activePreset === i ? '#1976d2' : '#e0e0e0'}`,
                background: activePreset === i ? '#1976d2' : 'white',
                color: activePreset === i ? 'white' : '#333',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              <strong>{preset.name}</strong>
              <br />
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggle first/repeat */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          onClick={() => setShowRepeat(false)}
          style={{
            padding: '0.4rem 0.8rem',
            border: '1px solid #e0e0e0',
            background: !showRepeat ? '#263238' : 'white',
            color: !showRepeat ? 'white' : '#333',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Первый запрос
        </button>
        <button
          onClick={() => setShowRepeat(true)}
          style={{
            padding: '0.4rem 0.8rem',
            border: '1px solid #e0e0e0',
            background: showRepeat ? '#263238' : 'white',
            color: showRepeat ? 'white' : '#333',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Повторный запрос (keep-alive + DNS cache)
        </button>
      </div>

      {/* Waterfall diagram */}
      <div
        style={{
          padding: '1rem',
          background: '#fafafa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          marginBottom: '1.5rem',
        }}
      >
        <h3 style={{ margin: '0 0 1rem' }}>
          Waterfall — {showRepeat ? 'повторный' : 'первый'} запрос: <span style={{ color: '#1976d2' }}>{currentTotal} мс</span>
        </h3>

        {currentSteps.map((step) => {
          const offset = accumulated
          accumulated += step.currentMs
          const widthPercent = maxMs > 0 ? (step.currentMs / maxMs) * 100 : 0
          const offsetPercent = maxMs > 0 ? (offset / maxMs) * 100 : 0

          return (
            <div key={step.id} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '150px', fontSize: '0.8rem', textAlign: 'right', flexShrink: 0, color: '#555' }}>
                {step.name}
              </div>
              <div style={{ flex: 1, position: 'relative', height: '28px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                {step.currentMs > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${offsetPercent}%`,
                      width: `${Math.max(widthPercent, 1)}%`,
                      height: '100%',
                      background: step.color,
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      minWidth: '30px',
                    }}
                  >
                    {step.currentMs} мс
                  </div>
                )}
                {step.currentMs === 0 && (
                  <div style={{ position: 'absolute', left: `${offsetPercent}%`, height: '100%', display: 'flex', alignItems: 'center', paddingLeft: '4px', fontSize: '0.75rem', color: '#999' }}>
                    cached / reused
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Total bar */}
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '2px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '150px', fontSize: '0.85rem', textAlign: 'right', fontWeight: 'bold', flexShrink: 0 }}>
            ИТОГО
          </div>
          <div style={{ flex: 1, position: 'relative', height: '32px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #1976d2, #d32f2f)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}
            >
              {currentTotal} мс
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div
        style={{
          padding: '1rem',
          background: '#e8f5e9',
          borderRadius: '8px',
          border: '1px solid #4caf50',
          marginBottom: '1.5rem',
        }}
      >
        <h4 style={{ margin: '0 0 0.5rem' }}>Сравнение: первый vs повторный запрос</h4>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
          <div>
            <strong>Первый запрос:</strong> {totalFirst} мс
          </div>
          <div>
            <strong>Повторный запрос:</strong> {totalRepeat} мс
          </div>
          <div>
            <strong>Экономия:</strong>{' '}
            <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>
              {totalFirst - totalRepeat} мс ({totalFirst > 0 ? Math.round(((totalFirst - totalRepeat) / totalFirst) * 100) : 0}%)
            </span>
          </div>
        </div>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#555' }}>
          Повторный запрос пропускает DNS (кэш), TCP и TLS (keep-alive / connection pool).
        </p>
      </div>

      {/* Sliders */}
      <div>
        <h3 style={{ margin: '0 0 0.75rem' }}>Настройка задержек (мс)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#263238', color: 'white' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Этап</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Описание</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', width: '120px' }}>Первый (мс)</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', width: '120px' }}>Повторный (мс)</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step) => (
              <tr key={step.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '0.5rem' }}>
                  <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '2px', background: step.color, marginRight: '0.5rem', verticalAlign: 'middle' }} />
                  <strong>{step.name}</strong>
                </td>
                <td style={{ padding: '0.5rem', fontSize: '0.85rem', color: '#666' }}>{step.description}</td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                  <input
                    type="number"
                    min={0}
                    max={1000}
                    value={step.firstRequestMs}
                    onChange={(e) => updateStep(step.id, 'firstRequestMs', Math.max(0, Number(e.target.value)))}
                    style={{ width: '70px', padding: '0.25rem', textAlign: 'center', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                  <input
                    type="number"
                    min={0}
                    max={1000}
                    value={step.repeatRequestMs}
                    onChange={(e) => updateStep(step.id, 'repeatRequestMs', Math.max(0, Number(e.target.value)))}
                    style={{ width: '70px', padding: '0.25rem', textAlign: 'center', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// Задание 0.3: Выбор протокола
// ============================================

interface Scenario {
  id: number
  title: string
  description: string
  requirements: string[]
  correctProtocol: string
  explanation: string
  alternatives: Array<{ protocol: string; why: string }>
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: 'Мессенджер (чат) в реальном времени',
    description: 'Приложение для обмена сообщениями, где пользователи видят сообщения мгновенно. Тысячи одновременных пользователей.',
    requirements: ['Мгновенная доставка', 'Push от сервера', 'Двунаправленная связь', 'Масштабирование до тысяч соединений'],
    correctProtocol: 'WebSocket',
    explanation: 'WebSocket обеспечивает полнодуплексную связь — сервер может мгновенно отправлять сообщения клиенту без запроса. Одно постоянное TCP-соединение эффективнее, чем polling. Для чатов это стандартный выбор.',
    alternatives: [
      { protocol: 'HTTP Long Polling', why: 'Работает, но менее эффективно: каждый poll — отдельный HTTP-запрос. Выше латентность и нагрузка на сервер.' },
      { protocol: 'SSE (Server-Sent Events)', why: 'Только однонаправленный push (сервер → клиент). Для чата нужна двунаправленная связь.' },
      { protocol: 'gRPC Bidirectional Streaming', why: 'Технически возможно, но overkill для клиентского приложения и не поддерживается браузерами напрямую.' },
    ],
  },
  {
    id: 2,
    title: 'Стриминг видео (YouTube-подобный)',
    description: 'Платформа для просмотра видео. Видео передаётся сегментами. Допустимы минимальные потери качества.',
    requirements: ['Большой объём данных', 'Адаптивный bitrate', 'Допустимы потери', 'Минимальная задержка буферизации'],
    correctProtocol: 'HTTP/2 (Adaptive Bitrate Streaming)',
    explanation: 'Видеостриминг (YouTube, Netflix) использует HTTP-based протоколы (HLS, DASH) поверх HTTP/2. Видео разбивается на маленькие сегменты (2-10 сек), и клиент запрашивает их последовательно. HTTP/2 мультиплексинг позволяет параллельно загружать сегменты разного качества.',
    alternatives: [
      { protocol: 'UDP (RTP/RTSP)', why: 'Используется для live-стриминга с минимальной задержкой (WebRTC), но для VOD (видео по запросу) HTTP-based решения проще масштабировать через CDN.' },
      { protocol: 'WebSocket', why: 'Можно стримить через WS, но теряется совместимость с CDN, кэширование и адаптивный bitrate.' },
      { protocol: 'gRPC Streaming', why: 'Не поддерживается браузерами. Нет интеграции с CDN. Видеостриминг — не его задача.' },
    ],
  },
  {
    id: 3,
    title: 'REST API для мобильного приложения магазина',
    description: 'CRUD API: список товаров, корзина, заказы. Нужно работать на мобильном интернете с разным качеством связи.',
    requirements: ['CRUD операции', 'Кэширование', 'Совместимость с мобильными клиентами', 'Работа на нестабильной сети'],
    correctProtocol: 'HTTP/2 + REST (JSON)',
    explanation: 'REST поверх HTTP/2 — стандарт для мобильных приложений. HTTP/2 сжимает заголовки, мультиплексирует запросы и экономит батарею. JSON — универсальный формат, поддерживаемый всеми платформами. Встроенное кэширование (ETags, Cache-Control) снижает трафик.',
    alternatives: [
      { protocol: 'GraphQL', why: 'Хороший вариант для мобильных API (запрашиваешь только нужные поля), но добавляет сложность. Для простого магазина REST достаточен.' },
      { protocol: 'gRPC', why: 'Быстрее REST, но мобильные клиенты (iOS/Android) требуют дополнительных библиотек. Нет встроенного кэширования на HTTP-уровне.' },
      { protocol: 'HTTP/3 (QUIC)', why: 'Отличный выбор для мобильных (лучше работает при смене сети Wi-Fi → LTE), но поддержка пока не повсеместная.' },
    ],
  },
  {
    id: 4,
    title: 'Сбор данных с IoT-датчиков',
    description: 'Тысячи датчиков температуры и влажности отправляют показания каждые 5 секунд. Устройства с ограниченными ресурсами, нестабильная сеть.',
    requirements: ['Тысячи устройств', 'Маленькие пакеты (< 100 байт)', 'Нестабильная сеть', 'Минимальный overhead', 'Экономия батареи'],
    correctProtocol: 'MQTT',
    explanation: 'MQTT — протокол для IoT с минимальным overhead (заголовок 2 байта). Работает по модели pub/sub: датчики публикуют данные в топики, сервер подписывается. Три уровня QoS (0 — без гарантий, 1 — минимум раз, 2 — ровно раз). Встроенный механизм keep-alive и reconnect.',
    alternatives: [
      { protocol: 'HTTP', why: 'Слишком тяжёлый для IoT: заголовки HTTP-запроса (300+ байт) больше, чем сами данные (< 100 байт). Каждый запрос — новое TCP-соединение.' },
      { protocol: 'CoAP', why: 'Хорошая альтернатива — работает поверх UDP, ещё легче MQTT. Но менее распространён и хуже с экосистемой инструментов.' },
      { protocol: 'WebSocket', why: 'Постоянное TCP-соединение — лишний расход для устройств с ограниченными ресурсами. MQTT оптимизирован именно для IoT-сценариев.' },
    ],
  },
  {
    id: 5,
    title: 'Взаимодействие микросервисов внутри дата-центра',
    description: 'Десятки микросервисов общаются друг с другом. Нужна строгая типизация API, минимальная латентность, поддержка streaming.',
    requirements: ['Строгая типизация', 'Минимальный latency', 'Streaming', 'Code generation', 'Высокая производительность'],
    correctProtocol: 'gRPC',
    explanation: 'gRPC идеален для inter-service коммуникации: Protocol Buffers обеспечивают строгий контракт и генерацию кода на любом языке. Бинарная сериализация в 3-10x компактнее JSON. HTTP/2 мультиплексинг минимизирует overhead соединений. Четыре режима streaming покрывают любые паттерны.',
    alternatives: [
      { protocol: 'REST (JSON)', why: 'Работает, но без строгой типизации (OpenAPI опционален). JSON текстовый и больше по размеру. Нет встроенного streaming.' },
      { protocol: 'Apache Thrift', why: 'Похожий на gRPC, но менее популярный. gRPC выигрывает за счёт HTTP/2, экосистемы и поддержки Google/CNCF.' },
      { protocol: 'Message Queue (Kafka/RabbitMQ)', why: 'Подходит для асинхронной коммуникации, но gRPC лучше для синхронных вызовов с низкой латентностью.' },
    ],
  },
]

const protocolColors: Record<string, string> = {
  'WebSocket': '#1976d2',
  'HTTP/2 (Adaptive Bitrate Streaming)': '#388e3c',
  'HTTP/2 + REST (JSON)': '#f57c00',
  'MQTT': '#7b1fa2',
  'gRPC': '#d32f2f',
}

export function Task0_3_Solution() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set())

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const revealAnswer = (id: number) => {
    setRevealedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const revealAll = () => {
    setRevealedIds(new Set(scenarios.map((s) => s.id)))
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Выбор протокола: 5 сценариев</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Для каждого сценария подумайте, какой протокол подойдёт лучше всего. Нажмите
        &laquo;Показать ответ&raquo;, чтобы увидеть рекомендацию и обоснование.
      </p>

      <button
        onClick={revealAll}
        style={{
          padding: '0.5rem 1rem',
          background: '#263238',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
        }}
      >
        Показать все ответы
      </button>

      {scenarios.map((scenario) => {
        const isRevealed = revealedIds.has(scenario.id)
        const isExpanded = expandedId === scenario.id
        const color = protocolColors[scenario.correctProtocol] || '#333'

        return (
          <div
            key={scenario.id}
            style={{
              marginBottom: '1rem',
              border: `1px solid ${isRevealed ? color : '#e0e0e0'}`,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1rem',
                background: isRevealed ? `${color}10` : '#fafafa',
                cursor: 'pointer',
              }}
              onClick={() => toggleExpand(scenario.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>
                    {scenario.id}. {scenario.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{scenario.description}</p>
                </div>
                {isRevealed && (
                  <div
                    style={{
                      padding: '0.4rem 0.8rem',
                      background: color,
                      color: 'white',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                      marginLeft: '1rem',
                    }}
                  >
                    {scenario.correctProtocol}
                  </div>
                )}
              </div>

              {/* Requirements */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {scenario.requirements.map((req, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '0.2rem 0.5rem',
                      background: '#e0e0e0',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: '#555',
                    }}
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Reveal button */}
            {!isRevealed && (
              <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e0e0e0' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    revealAnswer(scenario.id)
                    setExpandedId(scenario.id)
                  }}
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
              </div>
            )}

            {/* Expanded details */}
            {isRevealed && isExpanded && (
              <div style={{ padding: '1rem', borderTop: '1px solid #e0e0e0' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem', color }}>Почему {scenario.correctProtocol}?</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>{scenario.explanation}</p>
                </div>

                <h4 style={{ margin: '0 0 0.5rem' }}>Почему не другие?</h4>
                {scenario.alternatives.map((alt, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: '#fff3e0',
                      borderRadius: '6px',
                      marginBottom: '0.5rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    <strong>{alt.protocol}:</strong> {alt.why}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
