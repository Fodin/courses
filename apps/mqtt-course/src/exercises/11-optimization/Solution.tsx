import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 11.1: Ограничения встраиваемых систем — Решение
// ============================================

interface RouterProfile {
  name: string
  ram: string
  flash: string
  cpu: string
  maxClients: number
  maxMsgPerSec: number
  heapLimit: string
  notes: string
}

const ROUTER_PROFILES: RouterProfile[] = [
  {
    name: 'TP-Link TL-WR841N (минимальный)',
    ram: '32 MB',
    flash: '4 MB',
    cpu: 'MIPS 32 @ 560 MHz',
    maxClients: 10,
    maxMsgPerSec: 50,
    heapLimit: '4 MB',
    notes: 'solution.level11.notesMinimal',
  },
  {
    name: 'TP-Link Archer C7 (средний)',
    ram: '128 MB',
    flash: '16 MB',
    cpu: 'MIPS 74Kc @ 750 MHz',
    maxClients: 50,
    maxMsgPerSec: 500,
    heapLimit: '16 MB',
    notes: 'solution.level11.notesBalanced',
  },
  {
    name: 'GL.iNet GL-MT3000 (мощный)',
    ram: '512 MB',
    flash: '256 MB',
    cpu: 'ARM Cortex-A53 @ 1.3 GHz',
    maxClients: 200,
    maxMsgPerSec: 5000,
    heapLimit: '64 MB',
    notes: 'solution.level11.notesFull',
  },
  {
    name: 'Raspberry Pi + OpenWRT (мощный)',
    ram: '1-4 GB',
    flash: 'microSD',
    cpu: 'ARM Cortex-A72 @ 1.8 GHz',
    maxClients: 1000,
    maxMsgPerSec: 50000,
    heapLimit: '512 MB',
    notes: 'solution.level11.notesPi',
  },
]

export function Task11_1_Solution() {
  const { t } = useLanguage()
  const [selectedProfile, setSelectedProfile] = useState<RouterProfile>(ROUTER_PROFILES[0])
  const [showConfig, setShowConfig] = useState(false)

  const generateConfig = (profile: RouterProfile) => {
    const lines: string[] = []
    lines.push(`# Конфиг для: ${profile.name}`)
    lines.push(`# RAM: ${profile.ram}, Flash: ${profile.flash}`)
    lines.push('')
    lines.push('listener 1883')
    lines.push('protocol mqtt')
    lines.push('')
    lines.push(`max_connections ${profile.maxClients}`)
    lines.push(`message_size_limit ${profile.maxClients <= 10 ? '512' : '4096'}`)
    lines.push(`max_queued_messages ${profile.maxClients * 10}`)
    lines.push(`memory_limit ${profile.heapLimit.replace(' MB', '000000').replace(' MB', '')}`)
    lines.push('')
    if (profile.maxClients <= 10) {
      lines.push('# Минимальные настройки — TLS отключён')
      lines.push('allow_anonymous false')
      lines.push('# Нет persistence — экономия flash')
      lines.push('# persistence false')
      lines.push('sys_interval 60')
    } else {
      lines.push('allow_anonymous false')
      lines.push('password_file /etc/mosquitto/passwd')
      lines.push(`sys_interval ${profile.maxClients >= 200 ? 10 : 30}`)
    }
    return lines
  }

  return (
    <div className="exercise-container">
      <h2>{t('solution.level11.embeddedConstraintsTitle')}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem' }}>{t('solution.level11.routerProfileLabel')}:</label>
        <select
          onChange={(e) => {
            setSelectedProfile(ROUTER_PROFILES[Number(e.target.value)])
            setShowConfig(false)
          }}
          style={{ padding: '0.25rem', width: '100%', maxWidth: '400px' }}
        >
          {ROUTER_PROFILES.map((p, i) => (
            <option key={i} value={i}>{p.name}</option>
          ))}
        </select>
      </div>

      <div style={{ background: '#2d2d2d', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <tbody>
            {[
              ['RAM', selectedProfile.ram],
              ['Flash', selectedProfile.flash],
              ['CPU', selectedProfile.cpu],
              [t('solution.level11.maxClients'), String(selectedProfile.maxClients)],
              [t('solution.level11.maxMsgPerSec'), String(selectedProfile.maxMsgPerSec)],
              [t('solution.level11.heapLimit'), selectedProfile.heapLimit],
            ].map(([k, v]) => (
              <tr key={k}>
                <td style={{ padding: '0.3rem', color: '#888', width: '40%' }}>{k}:</td>
                <td style={{ padding: '0.3rem', fontFamily: 'monospace', color: '#4ec9b0' }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: '0.5rem', color: '#ce9178', fontSize: '0.85rem' }}>
          {t(selectedProfile.notes)}
        </p>
      </div>

      <button onClick={() => setShowConfig((v) => !v)}>
        {showConfig ? t('solution.level11.hide') : t('solution.level11.show')} {t('solution.level11.recommendedConfig')}
      </button>

      {showConfig && (
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflowX: 'auto', fontSize: '0.85rem', marginTop: '1rem' }}>
          {generateConfig(selectedProfile).join('\n')}
        </pre>
      )}
    </div>
  )
}

// ============================================
// Задание 11.2: Тюнинг Mosquitto — Решение
// ============================================

interface TuningParam {
  name: string
  default: string
  recommended: string
  description: string
  impact: 'memory' | 'cpu' | 'reliability' | 'throughput'
}

const TUNING_PARAMS: TuningParam[] = [
  { name: 'max_connections', default: '-1 (без лимита)', recommended: '50-100', description: 'solution.level11.tuningMaxConn', impact: 'memory' },
  { name: 'message_size_limit', default: '0 (без лимита, макс 268 MB)', recommended: '4096', description: 'solution.level11.tuningMsgSize', impact: 'memory' },
  { name: 'max_queued_messages', default: '1000', recommended: '100-500', description: 'solution.level11.tuningQueuedMsgs', impact: 'memory' },
  { name: 'max_queued_bytes', default: '0', recommended: '1048576 (1 MB)', description: 'solution.level11.tuningQueuedBytes', impact: 'memory' },
  { name: 'memory_limit', default: '0', recommended: '32000000 (32 MB)', description: 'solution.level11.tuningMemoryLimit', impact: 'memory' },
  { name: 'sys_interval', default: '10', recommended: '30-60', description: 'solution.level11.tuningSysInterval', impact: 'cpu' },
  { name: 'max_keepalive', default: '65535', recommended: '300', description: 'solution.level11.tuningMaxKeepalive', impact: 'reliability' },
  { name: 'persistent_client_expiration', default: 'нет', recommended: '1d', description: 'solution.level11.tuningPersistExpiration', impact: 'memory' },
  { name: 'max_inflight_messages', default: '20', recommended: '10', description: 'solution.level11.tuningInflight', impact: 'throughput' },
  { name: 'log_type', default: 'error warning notice', recommended: 'error warning', description: 'solution.level11.tuningLogType', impact: 'cpu' },
]

export function Task11_2_Solution() {
  const { t } = useLanguage()
  const [ram, setRam] = useState(64)
  const [output, setOutput] = useState<string[]>([])

  const generateTuning = () => {
    const lines: string[] = []
    lines.push(`# Тюнинг Mosquitto для ${ram} MB RAM`)
    lines.push('')

    const factor = ram / 64 // Нормализация относительно 64 MB

    lines.push('# === Лимиты соединений ===')
    lines.push(`max_connections ${Math.min(Math.round(20 * factor), 500)}`)
    lines.push(`message_size_limit ${ram <= 32 ? 512 : ram <= 128 ? 4096 : 65536}`)
    lines.push('')
    lines.push('# === Управление памятью ===')
    const heapMb = Math.round(ram * 0.4)
    lines.push(`memory_limit ${heapMb * 1000000}  # ${heapMb} MB`)
    lines.push(`max_queued_messages ${Math.round(100 * factor)}`)
    lines.push(`max_queued_bytes ${Math.round(524288 * factor)}  # ${Math.round(0.5 * factor)} MB`)
    lines.push(`persistent_client_expiration 1d`)
    lines.push('')
    lines.push('# === Производительность ===')
    lines.push(`sys_interval ${ram <= 32 ? 60 : 30}`)
    lines.push(`max_inflight_messages ${Math.min(Math.round(10 * factor), 40)}`)
    lines.push(`max_keepalive 300`)
    lines.push('')
    lines.push('# === Логирование (облегчённое) ===')
    lines.push(`log_type error warning${ram <= 32 ? '' : ' notice'}`)
    lines.push(`log_dest syslog`)

    setOutput(lines)
  }

  const impactColor = (impact: TuningParam['impact']) => {
    const colors = {
      memory: '#4ec9b0',
      cpu: '#dcdcaa',
      reliability: '#569cd6',
      throughput: '#ce9178',
    }
    return colors[impact]
  }

  return (
    <div className="exercise-container">
      <h2>{t('solution.level11.tuningTitle')}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem' }}>
          {t('solution.level11.routerRam')}: <strong>{ram} MB</strong>
        </label>
        <input
          type="range"
          min={32}
          max={512}
          step={32}
          value={ram}
          onChange={(e) => setRam(Number(e.target.value))}
          style={{ width: '300px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px', fontSize: '0.75rem', color: '#888' }}>
          <span>32 MB</span><span>128 MB</span><span>256 MB</span><span>512 MB</span>
        </div>
      </div>

      <button onClick={generateTuning} style={{ marginBottom: '1rem' }}>
        {t('solution.level11.generateTuning')}
      </button>

      {output.length > 0 && (
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflowX: 'auto', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {output.join('\n')}
        </pre>
      )}

      <h3 style={{ marginTop: '1rem' }}>{t('solution.level11.paramsReference')}</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444' }}>
              <th style={{ padding: '0.4rem', textAlign: 'left' }}>{t('solution.level11.param')}</th>
              <th style={{ padding: '0.4rem', textAlign: 'left' }}>{t('solution.level11.defaultValue')}</th>
              <th style={{ padding: '0.4rem', textAlign: 'left' }}>{t('solution.level11.recommended')}</th>
              <th style={{ padding: '0.4rem', textAlign: 'left' }}>{t('solution.level11.description')}</th>
              <th style={{ padding: '0.4rem', textAlign: 'left' }}>{t('solution.level11.affects')}</th>
            </tr>
          </thead>
          <tbody>
            {TUNING_PARAMS.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '0.35rem', fontFamily: 'monospace', color: '#4ec9b0', whiteSpace: 'nowrap' }}>{p.name}</td>
                <td style={{ padding: '0.35rem', fontFamily: 'monospace', color: '#888', whiteSpace: 'nowrap' }}>{p.default}</td>
                <td style={{ padding: '0.35rem', fontFamily: 'monospace', color: '#ce9178', whiteSpace: 'nowrap' }}>{p.recommended}</td>
                <td style={{ padding: '0.35rem' }}>{t(p.description)}</td>
                <td style={{ padding: '0.35rem', color: impactColor(p.impact), whiteSpace: 'nowrap' }}>{p.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// Задание 11.3: Управление соединениями — Решение
// ============================================

type SessionMode = 'clean' | 'persistent'
type KeepAliveScenario = 'iot' | 'dashboard' | 'mobile'

export function Task11_3_Solution() {
  const { t } = useLanguage()
  const [sessionMode, setSessionMode] = useState<SessionMode>('clean')
  const [scenario, setScenario] = useState<KeepAliveScenario>('iot')
  const [output, setOutput] = useState<string[]>([])

  const generateConfig = () => {
    const lines: string[] = []

    // Session settings
    lines.push('# === Управление сессиями ===')
    lines.push('')

    if (sessionMode === 'clean') {
      lines.push('# Clean Session (clean: true у клиента)')
      lines.push('# Брокер не хранит состояние после отключения.')
      lines.push('# Подходит для: браузеры, временные клиенты, дашборды.')
      lines.push('')
      lines.push('# mosquitto.conf — ничего дополнительно не нужно.')
      lines.push('# Но можно ограничить память под очереди:')
      lines.push('max_queued_messages 100')
      lines.push('max_queued_bytes 524288')
    } else {
      lines.push('# Persistent Session (clean: false у клиента)')
      lines.push('# Брокер хранит подписки и очередь сообщений клиента.')
      lines.push('# Подходит для: IoT-датчики, которые редко подключаются.')
      lines.push('')
      lines.push('# Включить persistence (обязательно для persistent sessions):')
      lines.push('persistence true')
      lines.push('persistence_location /tmp/mosquitto/')
      lines.push('')
      lines.push('# Очищать мёртвые сессии через 1 день:')
      lines.push('persistent_client_expiration 1d')
      lines.push('')
      lines.push('# Ограничить очередь на клиента:')
      lines.push('max_queued_messages 200')
    }

    lines.push('')
    lines.push('# === Keepalive настройки ===')
    lines.push('')

    const keepAliveSettings: Record<KeepAliveScenario, { client: number; maxKeepalive: number; note: string }> = {
      iot: { client: 300, maxKeepalive: 600, note: 'Датчики редко посылают данные, большой keepalive OK' },
      dashboard: { client: 30, maxKeepalive: 60, note: 'Дашборды нужно быстро обнаруживать как offline' },
      mobile: { client: 60, maxKeepalive: 120, note: 'Мобильные клиенты: баланс между батареей и надёжностью' },
    }

    const ks = keepAliveSettings[scenario]
    lines.push(`# Сценарий: ${scenario}`)
    lines.push(`# ${ks.note}`)
    lines.push('')
    lines.push('# На клиенте (пример mosquitto_pub):')
    lines.push(`# --keepalive ${ks.client}`)
    lines.push('')
    lines.push('# В mosquitto.conf — максимальный keepalive (защита от слишком долгих):')
    lines.push(`max_keepalive ${ks.maxKeepalive}`)
    lines.push('')
    lines.push('# Как работает keepalive:')
    lines.push('# Клиент должен отправлять PINGREQ каждые <keepalive> секунд.')
    lines.push('# Брокер закрывает соединение, если не было пакетов за keepalive * 1.5.')
    lines.push(`# При keepalive=${ks.client}: таймаут = ${Math.round(ks.client * 1.5)} секунд.`)

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('solution.level11.connManagementTitle')}</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('solution.level11.sessionTypeLabel')}:</label>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            <input type="radio" value="clean" checked={sessionMode === 'clean'}
              onChange={() => setSessionMode('clean')} />{' '}
            Clean Session
          </label>
          <label>
            <input type="radio" value="persistent" checked={sessionMode === 'persistent'}
              onChange={() => setSessionMode('persistent')} />{' '}
            Persistent Session
          </label>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('solution.level11.clientScenarioLabel')}:</label>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            <input type="radio" value="iot" checked={scenario === 'iot'}
              onChange={() => setScenario('iot')} />{' '}
            {t('solution.level11.iotSensor')}
          </label>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            <input type="radio" value="dashboard" checked={scenario === 'dashboard'}
              onChange={() => setScenario('dashboard')} />{' '}
            {t('solution.level11.dashboardOnline')}
          </label>
          <label>
            <input type="radio" value="mobile" checked={scenario === 'mobile'}
              onChange={() => setScenario('mobile')} />{' '}
            {t('solution.level11.mobileApp')}
          </label>
        </div>
      </div>

      <button onClick={generateConfig}>{t('solution.level11.generateConfig')}</button>

      {output.length > 0 && (
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflowX: 'auto', fontSize: '0.85rem', marginTop: '1rem' }}>
          {output.join('\n')}
        </pre>
      )}
    </div>
  )
}
