import { useState } from 'react'
import { useLanguage } from '../../src/hooks'

// ============================================
// Задание 11.3: Управление соединениями
// ============================================
// Цель: настроить параметры сессий и keepalive для разных типов клиентов.
//
// TODO:
// 1. Реализуйте generateConfig() для каждого типа сессии
// 2. Для clean session: объясните, что брокер не хранит состояние
//    - Нужен max_queued_messages (меньше памяти)
// 3. Для persistent session: включите persistence в /tmp/
//    - persistence true, persistence_location /tmp/mosquitto/
//    - persistent_client_expiration 1d
// 4. Для каждого сценария keepalive объясните выбор значения
//    - IoT: 300-600 сек (экономия энергии)
//    - Дашборд: 30-60 сек (быстрое обнаружение обрыва)
//    - Мобильный: 60-120 сек (баланс)
// 5. Добавьте max_keepalive в конфиг
// 6. Проверьте на роутере через mosquitto_sub --clean-session 0

type SessionMode = 'clean' | 'persistent'
type KeepaliveScenario = 'iot' | 'dashboard' | 'mobile'

export function Task11_3() {
  const { t } = useLanguage()
  const [sessionMode, setSessionMode] = useState<SessionMode>('clean')
  const [scenario, setScenario] = useState<KeepaliveScenario>('iot')
  const [output, setOutput] = useState<string[]>([])

  const generateConfig = () => {
    const lines: string[] = []

    lines.push('# === Управление сессиями ===')
    lines.push('')

    if (sessionMode === 'clean') {
      // TODO: Добавьте комментарий о clean session
      // TODO: Добавьте подходящие параметры для clean session
      lines.push('# TODO: описание и параметры для clean session')
    } else {
      // TODO: Добавьте параметры для persistent session:
      // persistence true
      // persistence_location /tmp/mosquitto/
      // persistent_client_expiration 1d
      // autosave_interval 300
      lines.push('# TODO: параметры persistence для persistent session')
    }

    lines.push('')
    lines.push('# === Keepalive ===')
    lines.push('')

    // TODO: На основе scenario выберите рекомендуемый keepalive клиента
    // и добавьте max_keepalive в конфиг
    // Сценарии:
    //   iot: client_keepalive=300, max_keepalive=600
    //   dashboard: client_keepalive=30, max_keepalive=60
    //   mobile: client_keepalive=60, max_keepalive=120

    lines.push(`# Сценарий: ${scenario}`)
    lines.push('# TODO: добавьте max_keepalive и объяснение выбора')

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.11.3')}</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Тип сессии:</label>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            <input
              type="radio"
              value="clean"
              checked={sessionMode === 'clean'}
              onChange={() => setSessionMode('clean')}
            />{' '}
            Clean Session (браузеры, дашборды)
          </label>
          <label>
            <input
              type="radio"
              value="persistent"
              checked={sessionMode === 'persistent'}
              onChange={() => setSessionMode('persistent')}
            />{' '}
            Persistent Session (IoT-датчики)
          </label>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Сценарий keepalive:</label>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            <input
              type="radio"
              value="iot"
              checked={scenario === 'iot'}
              onChange={() => setScenario('iot')}
            />{' '}
            IoT-датчик (экономия энергии)
          </label>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            <input
              type="radio"
              value="dashboard"
              checked={scenario === 'dashboard'}
              onChange={() => setScenario('dashboard')}
            />{' '}
            Дашборд (быстрый таймаут)
          </label>
          <label>
            <input
              type="radio"
              value="mobile"
              checked={scenario === 'mobile'}
              onChange={() => setScenario('mobile')}
            />{' '}
            Мобильное приложение
          </label>
        </div>
      </div>

      {/* TODO: Добавьте кнопку вызова generateConfig */}
      <button onClick={generateConfig}>Сгенерировать конфиг</button>

      {output.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflowX: 'auto', fontSize: '0.85rem' }}>
            {output.join('\n')}
          </pre>
        </div>
      )}
    </div>
  )
}
