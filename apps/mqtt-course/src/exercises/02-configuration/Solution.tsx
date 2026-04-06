// ============================================
// Level 2: Basic Configuration — Solutions
// ============================================

import { useState } from 'react'

// ============================================
// Task 2.1: mosquitto.conf — main parameters
// ============================================

interface ConfigParam {
  key: string
  defaultValue: string
  type: 'integer' | 'boolean' | 'string' | 'path'
  category: 'general' | 'network' | 'logging' | 'security' | 'persistence'
  description: string
  example: string
  note?: string
}

const configParams: ConfigParam[] = [
  {
    key: 'listener',
    defaultValue: '1883',
    type: 'integer',
    category: 'network',
    description: 'Порт, на котором брокер принимает MQTT-соединения. Можно указать несколько раз для нескольких listener-ов.',
    example: 'listener 1883\nlistener 8883  # TLS listener',
    note: 'Если не указан bind_address — слушает на всех интерфейсах',
  },
  {
    key: 'bind_address',
    defaultValue: '0.0.0.0',
    type: 'string',
    category: 'network',
    description: 'IP-адрес сетевого интерфейса, на котором будет работать listener. Полезно для изоляции трафика.',
    example: 'bind_address 192.168.1.1  # только LAN интерфейс',
  },
  {
    key: 'max_connections',
    defaultValue: '-1',
    type: 'integer',
    category: 'network',
    description: 'Максимальное количество одновременных клиентских соединений. -1 = без ограничений.',
    example: 'max_connections 100',
    note: 'Для встраиваемых устройств рекомендуется ограничивать',
  },
  {
    key: 'max_inflight_messages',
    defaultValue: '20',
    type: 'integer',
    category: 'network',
    description: 'Максимальное количество QoS 1/2 сообщений в очереди на клиента. 0 = без ограничений.',
    example: 'max_inflight_messages 10',
  },
  {
    key: 'max_queued_messages',
    defaultValue: '1000',
    type: 'integer',
    category: 'network',
    description: 'Максимальная длина очереди сообщений для отключённого клиента с persistent сессией.',
    example: 'max_queued_messages 500',
  },
  {
    key: 'persistence',
    defaultValue: 'false',
    type: 'boolean',
    category: 'persistence',
    description: 'Включить сохранение retained-сообщений и QoS 1/2 очередей на диск. На OpenWRT выключают для защиты flash-памяти.',
    example: 'persistence true\npersistence_file mosquitto.db\npersistence_location /var/lib/mosquitto/',
    note: 'Частая запись на flash изнашивает её — используй tmpfs',
  },
  {
    key: 'persistence_file',
    defaultValue: 'mosquitto.db',
    type: 'string',
    category: 'persistence',
    description: 'Имя файла базы данных для persistence. Путь задаётся отдельным параметром persistence_location.',
    example: 'persistence_file mosquitto.db',
  },
  {
    key: 'persistence_location',
    defaultValue: '/var/lib/mosquitto/',
    type: 'path',
    category: 'persistence',
    description: 'Директория для хранения persistence-данных. Должна существовать и быть доступна для записи.',
    example: 'persistence_location /tmp/mosquitto/',
    note: 'На OpenWRT /tmp — это tmpfs (RAM), данные теряются при перезагрузке',
  },
  {
    key: 'log_dest',
    defaultValue: 'stderr',
    type: 'string',
    category: 'logging',
    description: 'Куда писать логи. Варианты: stdout, stderr, syslog, file <path>, topic.',
    example: 'log_dest syslog\nlog_dest file /tmp/mosquitto.log',
  },
  {
    key: 'log_type',
    defaultValue: 'error warning notice information',
    type: 'string',
    category: 'logging',
    description: 'Уровни логирования. Уровни: debug, error, warning, notice, information, subscribe, unsubscribe, websockets, none, all.',
    example: 'log_type error\nlog_type warning\nlog_type notice',
    note: 'debug генерирует очень много вывода — только для отладки',
  },
  {
    key: 'log_timestamp',
    defaultValue: 'true',
    type: 'boolean',
    category: 'logging',
    description: 'Добавлять временную метку к каждой строке лога.',
    example: 'log_timestamp true',
  },
  {
    key: 'allow_anonymous',
    defaultValue: 'true',
    type: 'boolean',
    category: 'security',
    description: 'Разрешить подключение без имени пользователя и пароля. В продакшне должно быть false.',
    example: 'allow_anonymous false',
    note: 'По умолчанию true — небезопасно для публичных сетей',
  },
  {
    key: 'password_file',
    defaultValue: '',
    type: 'path',
    category: 'security',
    description: 'Путь к файлу паролей пользователей. Создаётся утилитой mosquitto_passwd.',
    example: 'password_file /etc/mosquitto/passwd',
  },
  {
    key: 'acl_file',
    defaultValue: '',
    type: 'path',
    category: 'security',
    description: 'Путь к файлу ACL (Access Control List) для управления доступом к топикам.',
    example: 'acl_file /etc/mosquitto/acl',
  },
  {
    key: 'pid_file',
    defaultValue: '',
    type: 'path',
    category: 'general',
    description: 'Путь к PID-файлу брокера. Используется init-системой для управления процессом.',
    example: 'pid_file /var/run/mosquitto.pid',
  },
  {
    key: 'user',
    defaultValue: 'mosquitto',
    type: 'string',
    category: 'general',
    description: 'Системный пользователь, от имени которого работает брокер после старта.',
    example: 'user mosquitto',
    note: 'На OpenWRT часто запускается от root из-за ограничений',
  },
  {
    key: 'keepalive_interval',
    defaultValue: '60',
    type: 'integer',
    category: 'network',
    description: 'Период keepalive в секундах. Клиент должен посылать PINGREQ не реже этого интервала.',
    example: 'keepalive_interval 60',
  },
  {
    key: 'message_size_limit',
    defaultValue: '0',
    type: 'integer',
    category: 'network',
    description: 'Максимальный размер payload сообщения в байтах. 0 = по умолчанию 268 МБ (spec limit).',
    example: 'message_size_limit 65536  # 64 КБ для IoT',
  },
]

const categoryConfig: Record<
  ConfigParam['category'],
  { label: string; color: string; bg: string; icon: string }
> = {
  general: { label: 'Общие', color: '#455A64', bg: '#ECEFF1', icon: '⚙️' },
  network: { label: 'Сеть', color: '#1565C0', bg: '#E3F2FD', icon: '🌐' },
  logging: { label: 'Логирование', color: '#E65100', bg: '#FFF3E0', icon: '📝' },
  security: { label: 'Безопасность', color: '#B71C1C', bg: '#FFEBEE', icon: '🔒' },
  persistence: { label: 'Persistence', color: '#6A1B9A', bg: '#F3E5F5', icon: '💾' },
}

export function Task2_1_Solution() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<ConfigParam['category'] | 'all'>('all')
  const [selected, setSelected] = useState<ConfigParam | null>(null)

  const filtered = configParams.filter(p => {
    const matchSearch =
      p.key.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'all' || p.category === activeCategory
    return matchSearch && matchCat
  })

  const categories = ['all', 'general', 'network', 'logging', 'security', 'persistence'] as const

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>mosquitto.conf — основные параметры</h2>
      <p style={{ color: '#555', marginBottom: '1rem' }}>
        Справочник параметров конфигурации Mosquitto 2.x. Нажми на параметр для детального описания.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск параметра..."
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '0.9rem',
            minWidth: '200px',
          }}
        />
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: activeCategory === cat ? (cat === 'all' ? '#555' : categoryConfig[cat].color) : '#ddd',
                background:
                  activeCategory === cat
                    ? cat === 'all'
                      ? '#ECEFF1'
                      : categoryConfig[cat].bg
                    : '#fff',
                color:
                  activeCategory === cat
                    ? cat === 'all'
                      ? '#455A64'
                      : categoryConfig[cat].color
                    : '#666',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: activeCategory === cat ? 700 : 400,
              }}
            >
              {cat === 'all' ? 'Все' : categoryConfig[cat].icon + ' ' + categoryConfig[cat].label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem' }}>
        {/* Params list */}
        <div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
            Найдено: {filtered.length} параметров
          </div>
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              maxHeight: '460px',
              overflowY: 'auto',
            }}
          >
            {filtered.map(param => {
              const cfg = categoryConfig[param.category]
              const isSelected = selected?.key === param.key
              return (
                <div
                  key={param.key}
                  onClick={() => setSelected(param)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.75rem',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    background: isSelected ? '#E3F2FD' : '#fff',
                    transition: 'background 0.15s',
                  }}
                >
                  <span style={{ fontSize: '0.85rem' }}>{cfg.icon}</span>
                  <code style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.85rem', flex: 1 }}>
                    {param.key}
                  </code>
                  <code
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.78rem',
                      color: '#999',
                      background: '#f5f5f5',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {param.defaultValue || '—'}
                  </code>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detail */}
        <div>
          {selected ? (
            <div>
              <div
                style={{
                  padding: '1rem',
                  border: `2px solid ${categoryConfig[selected.category].color}`,
                  borderRadius: '8px',
                  background: categoryConfig[selected.category].bg,
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <code
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      color: categoryConfig[selected.category].color,
                    }}
                  >
                    {selected.key}
                  </code>
                  <span
                    style={{
                      padding: '2px 8px',
                      background: '#fff',
                      border: `1px solid ${categoryConfig[selected.category].color}`,
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      color: categoryConfig[selected.category].color,
                    }}
                  >
                    {selected.type}
                  </span>
                </div>
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#333', lineHeight: 1.6 }}>
                  {selected.description}
                </p>
                <div style={{ fontSize: '0.82rem', color: '#555' }}>
                  <b>Значение по умолчанию:</b>{' '}
                  <code
                    style={{
                      fontFamily: 'monospace',
                      background: '#fff',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {selected.defaultValue || '(не задано)'}
                  </code>
                </div>
                {selected.note && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.5rem',
                      background: '#FFF9C4',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      color: '#F57F17',
                    }}
                  >
                    ⚠️ {selected.note}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>Пример использования:</div>
              <pre
                style={{
                  background: '#1a1a2e',
                  color: '#00ff88',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selected.example}
              </pre>
            </div>
          ) : (
            <div
              style={{
                padding: '2rem',
                border: '2px dashed #ddd',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#aaa',
              }}
            >
              Выберите параметр для просмотра описания
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 2.2: Listeners and ports
// ============================================

interface ListenerConfig {
  id: string
  port: number
  bindAddress: string
  protocol: 'mqtt' | 'websockets'
  tls: boolean
  description: string
  useCase: string
  color: string
  bg: string
}

const listenerPresets: ListenerConfig[] = [
  {
    id: 'mqtt-local',
    port: 1883,
    bindAddress: '127.0.0.1',
    protocol: 'mqtt',
    tls: false,
    description: 'MQTT только локально (только процессы на самом роутере)',
    useCase: 'Локальная автоматизация, скрипты на роутере',
    color: '#2E7D32',
    bg: '#E8F5E9',
  },
  {
    id: 'mqtt-lan',
    port: 1883,
    bindAddress: '192.168.1.1',
    protocol: 'mqtt',
    tls: false,
    description: 'MQTT для LAN-клиентов (устройства в домашней сети)',
    useCase: 'IoT устройства, умный дом',
    color: '#1565C0',
    bg: '#E3F2FD',
  },
  {
    id: 'mqtt-tls',
    port: 8883,
    bindAddress: '0.0.0.0',
    protocol: 'mqtt',
    tls: true,
    description: 'MQTT over TLS/SSL для защищённых соединений',
    useCase: 'Внешние клиенты, чувствительные данные',
    color: '#B71C1C',
    bg: '#FFEBEE',
  },
  {
    id: 'ws-local',
    port: 9001,
    bindAddress: '192.168.1.1',
    protocol: 'websockets',
    tls: false,
    description: 'MQTT over WebSockets для браузерных клиентов',
    useCase: 'Веб-дашборды, JavaScript-клиенты',
    color: '#E65100',
    bg: '#FFF3E0',
  },
  {
    id: 'wss',
    port: 9883,
    bindAddress: '0.0.0.0',
    protocol: 'websockets',
    tls: true,
    description: 'Secure WebSockets (WSS) для браузеров через HTTPS',
    useCase: 'Внешний веб-дашборд через HTTPS',
    color: '#6A1B9A',
    bg: '#F3E5F5',
  },
]

function generateListenerConfig(listeners: ListenerConfig[]): string {
  return listeners
    .map(l => {
      const lines = [
        `# ${l.description}`,
        `listener ${l.port}${l.bindAddress !== '0.0.0.0' ? ' ' + l.bindAddress : ''}`,
        `protocol ${l.protocol}`,
      ]
      if (l.tls) {
        lines.push('cafile /etc/mosquitto/ca.crt')
        lines.push('certfile /etc/mosquitto/server.crt')
        lines.push('keyfile /etc/mosquitto/server.key')
        lines.push('tls_version tlsv1.3')
      }
      return lines.join('\n')
    })
    .join('\n\n')
}

export function Task2_2_Solution() {
  const [selectedListeners, setSelectedListeners] = useState<Set<string>>(
    new Set(['mqtt-lan']),
  )
  const [showConfig, setShowConfig] = useState(false)

  const toggleListener = (id: string) => {
    setSelectedListeners(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size > 1) next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const activeListeners = listenerPresets.filter(l => selectedListeners.has(l.id))
  const configText = generateListenerConfig(activeListeners)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Listeners и порты</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        Mosquitto поддерживает несколько listener-ов одновременно. Выбери нужные и получи готовую конфигурацию.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
        {/* Preset cards */}
        <div>
          <h3 style={{ marginBottom: '0.75rem' }}>Доступные listener-ы</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {listenerPresets.map(preset => {
              const active = selectedListeners.has(preset.id)
              return (
                <div
                  key={preset.id}
                  onClick={() => toggleListener(preset.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    border: `2px solid ${active ? preset.color : '#ddd'}`,
                    borderRadius: '8px',
                    background: active ? preset.bg : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <input
                      type="checkbox"
                      checked={active}
                      readOnly
                      style={{ accentColor: preset.color, width: 16, height: 16 }}
                    />
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: preset.color,
                      }}
                    >
                      :{preset.port}
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        background: '#fff',
                        border: `1px solid ${preset.color}`,
                        borderRadius: '10px',
                        fontSize: '0.72rem',
                        color: preset.color,
                      }}
                    >
                      {preset.protocol}
                      {preset.tls ? ' + TLS' : ''}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#888', marginLeft: 'auto', fontFamily: 'monospace' }}>
                      {preset.bindAddress}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#555' }}>{preset.description}</div>
                  <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.25rem' }}>
                    💡 {preset.useCase}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Generated config */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>Конфигурация</h3>
            <button
              onClick={() => setShowConfig(!showConfig)}
              style={{
                padding: '0.4rem 0.75rem',
                background: showConfig ? '#1565C0' : '#f5f5f5',
                color: showConfig ? '#fff' : '#333',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {showConfig ? 'Скрыть' : 'Показать конфиг'}
            </button>
          </div>

          {/* Active listeners visual */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem' }}>
              Активных listener-ов: <b>{activeListeners.length}</b>
            </div>
            {activeListeners.map(l => (
              <div
                key={l.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  background: l.bg,
                  border: `1px solid ${l.color}`,
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                  fontSize: '0.85rem',
                }}
              >
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: l.color }}>
                  {l.bindAddress}:{l.port}
                </span>
                <span style={{ color: '#555' }}>{l.protocol.toUpperCase()}{l.tls ? ' (TLS)' : ''}</span>
              </div>
            ))}
          </div>

          {showConfig && (
            <div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>
                Готовая конфигурация для mosquitto.conf:
              </div>
              <pre
                style={{
                  background: '#1a1a2e',
                  color: '#00ff88',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  padding: '1rem',
                  borderRadius: '8px',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  maxHeight: '340px',
                  overflowY: 'auto',
                }}
              >
                {configText}
              </pre>
            </div>
          )}

          {/* Port reference table */}
          <div style={{ marginTop: '1.25rem' }}>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Стандартные порты MQTT</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'left' }}>Порт</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'left' }}>Протокол</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'left' }}>Описание</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { port: '1883', proto: 'MQTT', desc: 'Стандартный порт (IANA)' },
                  { port: '8883', proto: 'MQTT/TLS', desc: 'Зашифрованный MQTT (IANA)' },
                  { port: '9001', proto: 'MQTT/WS', desc: 'WebSocket (де-факто стандарт)' },
                  { port: '9883', proto: 'MQTT/WSS', desc: 'Secure WebSocket' },
                ].map(row => (
                  <tr key={row.port}>
                    <td style={{ padding: '6px 8px', border: '1px solid #ddd', fontFamily: 'monospace', fontWeight: 700 }}>
                      {row.port}
                    </td>
                    <td style={{ padding: '6px 8px', border: '1px solid #ddd', fontFamily: 'monospace' }}>
                      {row.proto}
                    </td>
                    <td style={{ padding: '6px 8px', border: '1px solid #ddd', color: '#555' }}>
                      {row.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 2.3: Logging configuration
// ============================================

interface LogType {
  id: string
  label: string
  description: string
  example: string
  verbosity: 1 | 2 | 3 | 4 | 5
}

const logTypes: LogType[] = [
  {
    id: 'error',
    label: 'error',
    description: 'Критические ошибки — брокер не может продолжать работу',
    example: '1712345678: Error: Unable to open log file /var/log/mosquitto.log for writing.',
    verbosity: 1,
  },
  {
    id: 'warning',
    label: 'warning',
    description: 'Предупреждения — нестандартные ситуации, требующие внимания',
    example: '1712345678: Warning: Persistence disabled, use at your own risk.',
    verbosity: 2,
  },
  {
    id: 'notice',
    label: 'notice',
    description: 'Важные события: старт/стоп брокера, подключения, отключения',
    example: '1712345678: New connection from 192.168.1.100 on port 1883.\n1712345678: New client connected from 192.168.1.100 as sensor01 (p2, c1, k60).',
    verbosity: 3,
  },
  {
    id: 'information',
    label: 'information',
    description: 'Информационные сообщения о нормальной работе брокера',
    example: '1712345678: Client sensor01 disconnected.\n1712345678: Saving in-memory store to disk.',
    verbosity: 4,
  },
  {
    id: 'subscribe',
    label: 'subscribe',
    description: 'Все события подписки (SUBSCRIBE / UNSUBSCRIBE)',
    example: '1712345678: sensor01 2 home/sensor/temperature\n1712345678: dashboard 0 home/#',
    verbosity: 5,
  },
  {
    id: 'unsubscribe',
    label: 'unsubscribe',
    description: 'События отписки клиентов от топиков',
    example: '1712345678: sensor01 home/sensor/temperature',
    verbosity: 5,
  },
  {
    id: 'websockets',
    label: 'websockets',
    description: 'Отладочная информация для WebSocket-соединений',
    example: '1712345678: WS handshake from 192.168.1.50.',
    verbosity: 5,
  },
  {
    id: 'debug',
    label: 'debug',
    description: 'Полная трассировка протокола — огромный объём данных',
    example: '1712345678: Received CONNECT from sensor01 (MQTTv5)\n1712345678: Sending CONNACK to sensor01 (0, 0)',
    verbosity: 5,
  },
]

const logDestOptions = [
  { id: 'syslog', label: 'syslog', description: 'Системный журнал OpenWRT (доступен через logread)', recommended: true },
  { id: 'stdout', label: 'stdout', description: 'Стандартный вывод (stdout)' },
  { id: 'stderr', label: 'stderr', description: 'Стандартный поток ошибок (stderr)' },
  { id: 'file', label: 'file /tmp/mosquitto.log', description: 'Файл в /tmp (tmpfs — безопасно для flash)', recommended: true },
  { id: 'topic', label: 'topic', description: 'Публикация логов в топик $SYS/broker/log/+' },
  { id: 'none', label: 'none', description: 'Отключить логирование' },
]

export function Task2_3_Solution() {
  const [selectedDest, setSelectedDest] = useState<string>('syslog')
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set(['error', 'warning', 'notice']),
  )
  const [showTimestamp, setShowTimestamp] = useState(true)
  const [showConfig, setShowConfig] = useState(false)

  const toggleType = (id: string) => {
    if (id === 'none' || id === 'all') {
      setSelectedTypes(new Set([id]))
      return
    }
    setSelectedTypes(prev => {
      const next = new Set(prev)
      next.delete('none')
      next.delete('all')
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next.size > 0 ? next : new Set(['error'])
    })
  }

  const generateLoggingConfig = () => {
    const lines: string[] = ['# Logging configuration']
    const destOpt = logDestOptions.find(d => d.id === selectedDest)
    lines.push(`log_dest ${destOpt?.label || selectedDest}`)
    selectedTypes.forEach(t => lines.push(`log_type ${t}`))
    lines.push(`log_timestamp ${showTimestamp}`)
    if (showTimestamp) lines.push('log_timestamp_format %Y-%m-%dT%H:%M:%S')
    return lines.join('\n')
  }

  const exampleLog = Array.from(selectedTypes)
    .flatMap(t => {
      const lt = logTypes.find(l => l.id === t)
      return lt ? lt.example.split('\n') : []
    })
    .slice(0, 8)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Настройка логирования</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        Правильно настроенные логи — ключ к диагностике проблем. Собери конфигурацию логирования и посмотри пример вывода.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left column */}
        <div>
          {/* log_dest */}
          <h3 style={{ marginBottom: '0.75rem' }}>Назначение логов (log_dest)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {logDestOptions.map(dest => (
              <label
                key={dest.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  border: `1px solid ${selectedDest === dest.id ? '#1565C0' : '#ddd'}`,
                  borderRadius: '6px',
                  background: selectedDest === dest.id ? '#E3F2FD' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="log_dest"
                  checked={selectedDest === dest.id}
                  onChange={() => setSelectedDest(dest.id)}
                  style={{ marginTop: '2px', accentColor: '#1565C0' }}
                />
                <div>
                  <code style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600 }}>
                    {dest.label}
                  </code>
                  {dest.recommended && (
                    <span
                      style={{
                        marginLeft: '0.5rem',
                        padding: '1px 6px',
                        background: '#E8F5E9',
                        color: '#2E7D32',
                        borderRadius: '8px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}
                    >
                      рекомендуется
                    </span>
                  )}
                  <div style={{ fontSize: '0.78rem', color: '#666', marginTop: '2px' }}>
                    {dest.description}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* log_timestamp */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              background: showTimestamp ? '#FFF9C4' : '#fff',
            }}
          >
            <input
              type="checkbox"
              checked={showTimestamp}
              onChange={e => setShowTimestamp(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: '#F57F17' }}
            />
            <div>
              <code style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600 }}>
                log_timestamp true
              </code>
              <div style={{ fontSize: '0.78rem', color: '#666' }}>Добавлять временную метку к каждой строке</div>
            </div>
          </label>
        </div>

        {/* Right column */}
        <div>
          {/* log_type */}
          <h3 style={{ marginBottom: '0.75rem' }}>Типы событий (log_type)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {logTypes.map(lt => {
              const active = selectedTypes.has(lt.id)
              const verbosityColor =
                lt.verbosity <= 2 ? '#B71C1C' : lt.verbosity <= 3 ? '#E65100' : '#2E7D32'
              return (
                <label
                  key={lt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    border: `1px solid ${active ? verbosityColor : '#ddd'}`,
                    borderRadius: '6px',
                    background: active ? (lt.verbosity <= 2 ? '#FFEBEE' : lt.verbosity <= 3 ? '#FFF3E0' : '#E8F5E9') : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleType(lt.id)}
                    style={{ marginTop: '2px', accentColor: verbosityColor }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <code style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600 }}>
                        {lt.label}
                      </code>
                      <span style={{ fontSize: '0.7rem', color: verbosityColor }}>
                        {'▮'.repeat(lt.verbosity)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>
                      {lt.description}
                    </div>
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      </div>

      {/* Config & preview */}
      <div style={{ marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setShowConfig(!showConfig)}
            style={{
              padding: '0.5rem 1rem',
              background: showConfig ? '#1565C0' : '#f5f5f5',
              color: showConfig ? '#fff' : '#333',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {showConfig ? 'Скрыть конфиг' : '📋 Показать конфиг'}
          </button>
        </div>

        {showConfig && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>mosquitto.conf:</div>
              <pre
                style={{
                  background: '#1a1a2e',
                  color: '#00ff88',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {generateLoggingConfig()}
              </pre>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>Пример лог-вывода:</div>
              <div
                style={{
                  background: '#1a1a2e',
                  color: '#aaaaff',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {exampleLog.length > 0
                  ? exampleLog.map((line, i) => <div key={i}>{line}</div>)
                  : <span style={{ color: '#666' }}>Выберите типы событий</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
