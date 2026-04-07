import { useState } from 'react'
import { useLanguage } from '@courses/platform'

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
    title: 'solution.level8.localCloudTitle',
    description:
      'solution.level8.localCloudDesc',
    diagram: `Датчики ──► Mosquitto (OpenWRT) ──Bridge──► AWS IoT / HiveMQ Cloud
             локальная сеть               интернет`,
    useCases: ['solution.level8.localCloudUseCase1', 'solution.level8.localCloudUseCase2', 'solution.level8.localCloudUseCase3'],
  },
  {
    id: 'two-sites',
    title: 'solution.level8.twoSitesTitle',
    description:
      'solution.level8.twoSitesDesc',
    diagram: `Офис А: Mosquitto ◄──Bridge──► Mosquitto: Офис Б
               датчики А          VPN/интернет          датчики Б`,
    useCases: ['solution.level8.twoSitesUseCase1', 'solution.level8.twoSitesUseCase2', 'solution.level8.twoSitesUseCase3'],
  },
  {
    id: 'hierarchy',
    title: 'solution.level8.hierarchyTitle',
    description:
      'solution.level8.hierarchyDesc',
    diagram: `Объект 1: Mosquitto ──►
Объект 2: Mosquitto ──► Центральный Mosquitto ──► Dashboard / SCADA
Объект 3: Mosquitto ──►`,
    useCases: ['solution.level8.hierarchyUseCase1', 'solution.level8.hierarchyUseCase2', 'solution.level8.hierarchyUseCase3'],
  },
]

export function Task8_1_Solution() {
  const { t } = useLanguage()
  const [selected, setSelected] = useState<string>('local-cloud')

  const scenario = bridgeScenarios.find((s) => s.id === selected)!

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>{t('solution.level8.bridgeHeading')}</h2>

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
        <strong>{t('solution.level8.bridgeTerm')}</strong>{t('solution.level8.bridgeExplain')}
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
            {t(s.title)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>{t('solution.level8.diagramHeading')}</h3>
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
            {t(scenario.description)}
          </p>
        </div>

        <div style={{ flex: '1', minWidth: '220px' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>{t('solution.level8.useCasesHeading')}</h3>
          <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
            {scenario.useCases.map((u, i) => (
              <li key={i} style={{ marginBottom: '0.6rem', lineHeight: 1.5 }}>
                {t(u)}
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
            <h4 style={{ margin: '0 0 0.5rem' }}>{t('solution.level8.howItWorksHeading')}</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6 }}>
              {t('solution.level8.howItWorksDesc')}
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
  { key: 'connection', value: 'bridge-to-cloud', required: true, description: 'solution.level8.paramConnDesc' },
  { key: 'address', value: 'mqtt.example.com:1883', required: true, description: 'solution.level8.paramAddrDesc' },
  { key: 'topic', value: 'sensors/# out 0', required: true, description: 'solution.level8.paramTopicDesc' },
  { key: 'remote_username', value: 'bridge_user', required: false, description: 'solution.level8.paramUserDesc' },
  { key: 'remote_password', value: 'strong_password', required: false, description: 'solution.level8.paramPassDesc' },
  { key: 'bridge_cafile', value: '/etc/mosquitto/certs/ca.crt', required: false, description: 'solution.level8.paramCaDesc' },
  { key: 'keepalive_interval', value: '60', required: false, description: 'solution.level8.paramKeepaliveDesc' },
  { key: 'start_type', value: 'automatic', required: false, description: 'solution.level8.paramStartDesc' },
]

export function Task8_2_Solution() {
  const { t } = useLanguage()
  const [showOptional, setShowOptional] = useState(false)
  const [selectedParam, setSelectedParam] = useState<string | null>(null)
  const [remoteAddr, setRemoteAddr] = useState('mqtt.example.com:1883')
  const [connName, setConnName] = useState('bridge-to-cloud')

  const displayed = showOptional ? bridgeParams : bridgeParams.filter((p) => p.required)

  const configText = `# ${t('solution.level8.bridgeConfigComment')}

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
      <h2>{t('solution.level8.bridgeConfigTitle')}</h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>{t('solution.level8.paramsHeading')}</h3>
            <label style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showOptional}
                onChange={(e) => setShowOptional(e.target.checked)}
                style={{ marginRight: '0.3rem' }}
              />
              {t('solution.level8.showAll')}
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
                      {t('solution.level8.required')}
                    </span>
                  )}
                </div>
                <code style={{ fontSize: '0.82rem', color: '#555' }}>{p.value}</code>
                {selectedParam === p.key && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#333', lineHeight: 1.5, borderTop: '1px solid #e0e0e0', paddingTop: '0.5rem' }}>
                    {t(p.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: '1', minWidth: '260px' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
              {t('solution.level8.connNameLabel')}:
            </label>
            <input
              value={connName}
              onChange={(e) => setConnName(e.target.value)}
              style={{ width: '100%', padding: '0.4rem 0.6rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.87rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
              {t('solution.level8.remoteBrokerLabel')}:
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
  out: { label: 'out →', color: '#1976d2', desc: 'solution.level8.dirOutDesc' },
  in: { label: '← in', color: '#388e3c', desc: 'solution.level8.dirInDesc' },
  both: { label: '⇄ both', color: '#f57c00', desc: 'solution.level8.dirBothDesc' },
}

const topicRules: TopicRule[] = [
  {
    pattern: 'sensors/#',
    direction: 'out',
    qos: 0,
    localPrefix: '',
    remotePrefix: 'home/',
    description: 'solution.level8.ruleSensorsDesc',
    example: 'sensors/temp → home/sensors/temp',
  },
  {
    pattern: 'commands/#',
    direction: 'in',
    qos: 1,
    localPrefix: '',
    remotePrefix: '',
    description: 'solution.level8.ruleCommandsDesc',
    example: 'commands/light → commands/light (QoS 1 гарантирует доставку)',
  },
  {
    pattern: 'status',
    direction: 'both',
    qos: 2,
    localPrefix: 'local/',
    remotePrefix: 'remote/',
    description: 'solution.level8.ruleStatusDesc',
    example: 'local/status ⇄ remote/status',
  },
  {
    pattern: 'alerts/#',
    direction: 'out',
    qos: 2,
    localPrefix: '',
    remotePrefix: '',
    description: 'solution.level8.ruleAlertsDesc',
    example: 'alerts/fire → alerts/fire (QoS 2)',
  },
]

export function Task8_3_Solution() {
  const { t } = useLanguage()
  const [selectedRule, setSelectedRule] = useState<number | null>(null)
  const [customPattern, setCustomPattern] = useState('sensors/#')
  const [customDir, setCustomDir] = useState<'in' | 'out' | 'both'>('out')
  const [customQos, setCustomQos] = useState<0 | 1 | 2>(0)

  const configLine = (r: TopicRule) =>
    `topic ${r.pattern} ${r.direction} ${r.qos}${r.localPrefix ? ' ' + r.localPrefix : ''}${r.remotePrefix ? ' ' + r.remotePrefix : ''}`

  const customLine = `topic ${customPattern} ${customDir} ${customQos}`

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>{t('solution.level8.topicFilterTitle')}</h2>

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
        <strong>{t('solution.level8.topicFormatLabel')}</strong>
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
          topic &lt;{t('solution.level8.pattern')}&gt; &lt;{t('solution.level8.direction')}&gt; &lt;QoS&gt; [{t('solution.level8.localPrefix')}] [{t('solution.level8.remotePrefix')}]
        </code>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h3 style={{ margin: '0 0 0.75rem' }}>{t('solution.level8.ruleExamplesHeading')}</h3>
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
                        {t(rule.description)}
                      </p>
                      <div style={{ fontSize: '0.82rem', color: '#666', fontStyle: 'italic' }}>
                        {t('solution.level8.example')}: {rule.example}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ flex: '1', minWidth: '240px' }}>
          <h3 style={{ margin: '0 0 0.75rem' }}>{t('solution.level8.ruleBuilderHeading')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem' }}>
              {t('solution.level8.pattern')}:
              <input
                value={customPattern}
                onChange={(e) => setCustomPattern(e.target.value)}
                style={{ display: 'block', width: '100%', padding: '0.35rem 0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.2rem', fontSize: '0.87rem', boxSizing: 'border-box' }}
              />
            </label>
            <label style={{ fontSize: '0.85rem' }}>
              {t('solution.level8.direction')}:
              <select
                value={customDir}
                onChange={(e) => setCustomDir(e.target.value as 'in' | 'out' | 'both')}
                style={{ display: 'block', width: '100%', padding: '0.35rem 0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.2rem', fontSize: '0.87rem' }}
              >
                <option value="out">{t('solution.level8.dirOutOption')}</option>
                <option value="in">{t('solution.level8.dirInOption')}</option>
                <option value="both">{t('solution.level8.dirBothOption')}</option>
              </select>
            </label>
            <label style={{ fontSize: '0.85rem' }}>
              QoS:
              <select
                value={customQos}
                onChange={(e) => setCustomQos(Number(e.target.value) as 0 | 1 | 2)}
                style={{ display: 'block', width: '100%', padding: '0.35rem 0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.2rem', fontSize: '0.87rem' }}
              >
                <option value={0}>{t('solution.level8.qos0Option')}</option>
                <option value={1}>{t('solution.level8.qos1Option')}</option>
                <option value={2}>{t('solution.level8.qos2Option')}</option>
              </select>
            </label>
          </div>

          <div style={{ fontSize: '0.83rem', color: '#555', marginBottom: '0.5rem' }}>
            {t('solution.level8.generatedConfigLine')}:
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
            <strong>{topicDirections[customDir].label}</strong> — {t(topicDirections[customDir].desc)}
          </div>
        </div>
      </div>
    </div>
  )
}
