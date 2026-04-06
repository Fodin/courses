import { useState } from 'react'

// ============================================
// Задание 8.1: Концепция Bridge — Решение
// ============================================

interface BridgeScenario {
  id: string
  title: string
  description: string
  diagram: string
  useCases: string[]
}

const bridgeScenarios: BridgeScenario[] = [
  {
    id: 'local-cloud',
    title: 'Локальная сеть → Облако',
    description:
      'Локальный брокер на OpenWRT собирает данные с IoT-устройств. Bridge пересылает нужные топики в облачный MQTT (AWS IoT, HiveMQ Cloud). Устройства не знают об облаке — они работают с локальным брокером.',
    diagram: `Датчики ──► Mosquitto (OpenWRT) ──Bridge──► AWS IoT / HiveMQ Cloud
             локальная сеть               интернет`,
    useCases: ['Мониторинг умного дома через облачное приложение', 'Сбор телеметрии с удалённых объектов', 'Резервирование: облако как fallback'],
  },
  {
    id: 'two-sites',
    title: 'Два офиса / объекта',
    description:
      'Два брокера на разных площадках связаны мостом. Каждый имеет локальных клиентов, но нужные данные автоматически реплицируются между площадками.',
    diagram: `Офис А: Mosquitto ◄──Bridge──► Mosquitto: Офис Б
               датчики А          VPN/интернет          датчики Б`,
    useCases: ['Синхронизация состояния между офисами', 'Централизованный мониторинг нескольких объектов', 'Масштабирование: разгрузка центрального брокера'],
  },
  {
    id: 'hierarchy',
    title: 'Иерархическая архитектура',
    description:
      'Несколько локальных брокеров (edge) пересылают данные на центральный брокер (hub). Классическая архитектура для промышленного IoT.',
    diagram: `Объект 1: Mosquitto ──►
Объект 2: Mosquitto ──► Центральный Mosquitto ──► Dashboard / SCADA
Объект 3: Mosquitto ──►`,
    useCases: ['Промышленные SCADA-системы', 'Городские IoT-сети', 'Мониторинг распределённой инфраструктуры'],
  },
]

export function Task8_1_Solution() {
  const [selected, setSelected] = useState<string>('local-cloud')

  const scenario = bridgeScenarios.find((s) => s.id === selected)!

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Концепция MQTT Bridge</h2>

      <div
        style={{
          padding: '0.75rem 1rem',
          background: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          lineHeight: 1.6,
        }}
      >
        <strong>Bridge (мост)</strong> — это механизм Mosquitto, позволяющий двум брокерам обмениваться
        сообщениями. Один брокер выступает клиентом для другого: подключается к нему и публикует / получает
        сообщения от своего имени. Клиенты каждого брокера не знают, что данные пришли с другого сервера.
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {bridgeScenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            style={{
              flex: 1,
              minWidth: '150px',
              padding: '0.6rem 0.8rem',
              border: `2px solid ${selected === s.id ? '#1976d2' : '#e0e0e0'}`,
              background: selected === s.id ? '#e3f2fd' : '#fafafa',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: selected === s.id ? 'bold' : 'normal',
              fontSize: '0.87rem',
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>Схема</h3>
          <pre
            style={{
              background: '#263238',
              color: '#80cbc4',
              padding: '1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              lineHeight: 1.8,
              fontFamily: 'monospace',
            }}
          >
            {scenario.diagram}
          </pre>

          <p style={{ margin: '1rem 0 0.5rem', lineHeight: 1.6, color: '#333' }}>
            {scenario.description}
          </p>
        </div>

        <div style={{ flex: '1', minWidth: '220px' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>Сценарии использования</h3>
          <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
            {scenario.useCases.map((u, i) => (
              <li key={i} style={{ marginBottom: '0.6rem', lineHeight: 1.5 }}>
                {u}
              </li>
            ))}
          </ul>

          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#f5f5f5',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem' }}>Как работает под капотом</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6 }}>
              Mosquitto-мост создаёт MQTT-соединение к удалённому брокеру — он ведёт себя как
              обычный MQTT-клиент. Разница лишь в том, что этот клиент управляется брокером:
              он автоматически подписывается на нужные топики и пересылает сообщения в обе стороны.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 8.2: Настройка моста — Решение
// ============================================

interface BridgeParam {
  key: string
  value: string
  required: boolean
  description: string
}

const bridgeParams: BridgeParam[] = [
  { key: 'connection', value: 'bridge-to-cloud', required: true, description: 'Уникальное имя соединения. Используется в логах и для идентификации нескольких мостов.' },
  { key: 'address', value: 'mqtt.example.com:1883', required: true, description: 'Адрес и порт удалённого брокера. Для TLS используйте порт 8883.' },
  { key: 'topic', value: 'sensors/# out 0', required: true, description: 'Топик(и) для пересылки. Формат: <паттерн> <направление> <QoS> [локальный_префикс] [удалённый_префикс]' },
  { key: 'remote_username', value: 'bridge_user', required: false, description: 'Имя пользователя для аутентификации на удалённом брокере.' },
  { key: 'remote_password', value: 'strong_password', required: false, description: 'Пароль для удалённого брокера.' },
  { key: 'bridge_cafile', value: '/etc/mosquitto/certs/ca.crt', required: false, description: 'CA сертификат для TLS-подключения к удалённому брокеру.' },
  { key: 'keepalive_interval', value: '60', required: false, description: 'Keep-alive интервал в секундах. Брокер отправляет PINGREQ каждые N секунд.' },
  { key: 'start_type', value: 'automatic', required: false, description: 'automatic — соединение поддерживается всегда. lazy — только когда есть сообщения. once — одноразовое подключение.' },
]

export function Task8_2_Solution() {
  const [showOptional, setShowOptional] = useState(false)
  const [selectedParam, setSelectedParam] = useState<string | null>(null)
  const [remoteAddr, setRemoteAddr] = useState('mqtt.example.com:1883')
  const [connName, setConnName] = useState('bridge-to-cloud')

  const displayed = showOptional ? bridgeParams : bridgeParams.filter((p) => p.required)

  const configText = `# Мост настраивается как отдельная секция в mosquitto.conf

connection ${connName}
address ${remoteAddr}
topic sensors/# out 0
topic commands/# in 0`

  const fullConfig = configText + (showOptional
    ? `
remote_username bridge_user
remote_password strong_password
bridge_cafile /etc/mosquitto/certs/ca.crt
keepalive_interval 60
start_type automatic`
    : '')

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Настройка моста в Mosquitto</h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>Параметры</h3>
            <label style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showOptional}
                onChange={(e) => setShowOptional(e.target.checked)}
                style={{ marginRight: '0.3rem' }}
              />
              Показать все
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {displayed.map((p) => (
              <div
                key={p.key}
                onClick={() => setSelectedParam(selectedParam === p.key ? null : p.key)}
                style={{
                  padding: '0.6rem 0.8rem',
                  border: `1px solid ${selectedParam === p.key ? '#1976d2' : p.required ? '#4caf50' : '#e0e0e0'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: selectedParam === p.key ? '#e3f2fd' : '#fafafa',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <code style={{ color: '#1976d2', fontSize: '0.85rem' }}>{p.key}</code>
                  {p.required && (
                    <span style={{ fontSize: '0.7rem', background: '#4caf50', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                      обязательно
                    </span>
                  )}
                </div>
                <code style={{ fontSize: '0.82rem', color: '#555' }}>{p.value}</code>
                {selectedParam === p.key && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#333', lineHeight: 1.5, borderTop: '1px solid #e0e0e0', paddingTop: '0.5rem' }}>
                    {p.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: '1', minWidth: '260px' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
              Имя соединения:
            </label>
            <input
              value={connName}
              onChange={(e) => setConnName(e.target.value)}
              style={{ width: '100%', padding: '0.4rem 0.6rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.87rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
              Адрес удалённого брокера:
            </label>
            <input
              value={remoteAddr}
              onChange={(e) => setRemoteAddr(e.target.value)}
              style={{ width: '100%', padding: '0.4rem 0.6rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.87rem', boxSizing: 'border-box' }}
            />
          </div>

          <h3 style={{ margin: '0 0 0.5rem' }}>mosquitto.conf</h3>
          <pre
            style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {fullConfig}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 8.3: Фильтрация топиков в мосте — Решение
// ============================================

interface TopicRule {
  pattern: string
  direction: 'in' | 'out' | 'both'
  qos: 0 | 1 | 2
  localPrefix: string
  remotePrefix: string
  description: string
  example: string
}

const topicDirections = {
  out: { label: 'out →', color: '#1976d2', desc: 'Локальные топики пересылаются на удалённый брокер' },
  in: { label: '← in', color: '#388e3c', desc: 'Топики с удалённого брокера получаются локально' },
  both: { label: '⇄ both', color: '#f57c00', desc: 'Двунаправленная синхронизация топика' },
}

const topicRules: TopicRule[] = [
  {
    pattern: 'sensors/#',
    direction: 'out',
    qos: 0,
    localPrefix: '',
    remotePrefix: 'home/',
    description: 'Все данные датчиков пересылаются в облако с добавлением префикса "home/"',
    example: 'sensors/temp → home/sensors/temp',
  },
  {
    pattern: 'commands/#',
    direction: 'in',
    qos: 1,
    localPrefix: '',
    remotePrefix: '',
    description: 'Команды из облака получаются локально на тех же топиках',
    example: 'commands/light → commands/light (QoS 1 гарантирует доставку)',
  },
  {
    pattern: 'status',
    direction: 'both',
    qos: 2,
    localPrefix: 'local/',
    remotePrefix: 'remote/',
    description: 'Двунаправленная синхронизация статуса с маппингом префиксов',
    example: 'local/status ⇄ remote/status',
  },
  {
    pattern: 'alerts/#',
    direction: 'out',
    qos: 2,
    localPrefix: '',
    remotePrefix: '',
    description: 'Критические оповещения с гарантией доставки exactly-once',
    example: 'alerts/fire → alerts/fire (QoS 2)',
  },
]

export function Task8_3_Solution() {
  const [selectedRule, setSelectedRule] = useState<number | null>(null)
  const [customPattern, setCustomPattern] = useState('sensors/#')
  const [customDir, setCustomDir] = useState<'in' | 'out' | 'both'>('out')
  const [customQos, setCustomQos] = useState<0 | 1 | 2>(0)

  const configLine = (r: TopicRule) =>
    `topic ${r.pattern} ${r.direction} ${r.qos}${r.localPrefix ? ' ' + r.localPrefix : ''}${r.remotePrefix ? ' ' + r.remotePrefix : ''}`

  const customLine = `topic ${customPattern} ${customDir} ${customQos}`

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Фильтрация топиков в MQTT Bridge</h2>

      <div
        style={{
          padding: '0.75rem 1rem',
          background: '#f3e5f5',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.88rem',
          lineHeight: 1.6,
        }}
      >
        <strong>Формат строки topic:</strong>
        <code
          style={{
            display: 'block',
            background: '#1e1e1e',
            color: '#ce93d8',
            padding: '0.5rem 0.75rem',
            borderRadius: '4px',
            marginTop: '0.4rem',
            fontSize: '0.85rem',
          }}
        >
          topic &lt;паттерн&gt; &lt;направление&gt; &lt;QoS&gt; [локальный_префикс] [удалённый_префикс]
        </code>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h3 style={{ margin: '0 0 0.75rem' }}>Примеры правил (кликните для деталей)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {topicRules.map((rule, i) => {
              const dir = topicDirections[rule.direction]
              return (
                <div
                  key={i}
                  onClick={() => setSelectedRule(selectedRule === i ? null : i)}
                  style={{
                    padding: '0.7rem 0.9rem',
                    border: `1px solid ${selectedRule === i ? dir.color : '#e0e0e0'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: selectedRule === i ? `${dir.color}12` : '#fafafa',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '0.87rem' }}>{rule.pattern}</code>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.5rem',
                          background: dir.color,
                          color: '#fff',
                          borderRadius: '3px',
                        }}
                      >
                        {dir.label}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.5rem',
                          background: '#546e7a',
                          color: '#fff',
                          borderRadius: '3px',
                        }}
                      >
                        QoS {rule.qos}
                      </span>
                    </div>
                  </div>
                  <code style={{ fontSize: '0.8rem', color: '#888' }}>{configLine(rule)}</code>

                  {selectedRule === i && (
                    <div style={{ marginTop: '0.5rem', borderTop: '1px solid #e0e0e0', paddingTop: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.25rem', fontSize: '0.83rem', color: '#333' }}>
                        {rule.description}
                      </p>
                      <div style={{ fontSize: '0.82rem', color: '#666', fontStyle: 'italic' }}>
                        Пример: {rule.example}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ flex: '1', minWidth: '240px' }}>
          <h3 style={{ margin: '0 0 0.75rem' }}>Конструктор правила</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem' }}>
              Паттерн:
              <input
                value={customPattern}
                onChange={(e) => setCustomPattern(e.target.value)}
                style={{ display: 'block', width: '100%', padding: '0.35rem 0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.2rem', fontSize: '0.87rem', boxSizing: 'border-box' }}
              />
            </label>
            <label style={{ fontSize: '0.85rem' }}>
              Направление:
              <select
                value={customDir}
                onChange={(e) => setCustomDir(e.target.value as 'in' | 'out' | 'both')}
                style={{ display: 'block', width: '100%', padding: '0.35rem 0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.2rem', fontSize: '0.87rem' }}
              >
                <option value="out">out → (отправлять в облако)</option>
                <option value="in">← in (получать из облака)</option>
                <option value="both">⇄ both (в обе стороны)</option>
              </select>
            </label>
            <label style={{ fontSize: '0.85rem' }}>
              QoS:
              <select
                value={customQos}
                onChange={(e) => setCustomQos(Number(e.target.value) as 0 | 1 | 2)}
                style={{ display: 'block', width: '100%', padding: '0.35rem 0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.2rem', fontSize: '0.87rem' }}
              >
                <option value={0}>QoS 0 — без гарантий (быстро)</option>
                <option value={1}>QoS 1 — хотя бы один раз</option>
                <option value={2}>QoS 2 — ровно один раз (медленно)</option>
              </select>
            </label>
          </div>

          <div style={{ fontSize: '0.83rem', color: '#555', marginBottom: '0.5rem' }}>
            Сгенерированная строка конфига:
          </div>
          <pre
            style={{
              background: '#1e1e1e',
              color: '#a5d6a7',
              padding: '0.75rem',
              borderRadius: '6px',
              fontSize: '0.87rem',
              margin: '0 0 0.75rem',
            }}
          >
            {customLine}
          </pre>

          <div
            style={{
              padding: '0.75rem',
              background: '#fff3e0',
              borderRadius: '6px',
              fontSize: '0.82rem',
              lineHeight: 1.6,
            }}
          >
            <strong>{topicDirections[customDir].label}</strong> — {topicDirections[customDir].desc}
          </div>
        </div>
      </div>
    </div>
  )
}
