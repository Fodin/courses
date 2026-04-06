import { useState } from 'react'
import { useLanguage } from '../../src/hooks'

// ============================================
// Задание 11.2: Тюнинг Mosquitto
// ============================================
// Цель: сгенерировать оптимизированный mosquitto.conf для конкретного железа.
//
// TODO:
// 1. Используйте ползунки для выбора параметров роутера
// 2. Реализуйте generateTuning() — создайте конфиг с параметрами:
//    - max_connections (от RAM)
//    - message_size_limit (от сценария)
//    - max_queued_messages (100-500)
//    - max_queued_bytes
//    - memory_limit
//    - sys_interval (30 для слабых, 10 для мощных)
//    - log_type error warning (облегчённый)
// 3. Добавьте таблицу-справочник параметров:
//    | Параметр | По умолчанию | Рекомендуется |
// 4. Примените конфиг на реальном роутере и проверьте через $SYS

type Scenario = 'minimal' | 'iot' | 'full'

export function Task11_2() {
  const { t } = useLanguage()
  const [ram, setRam] = useState(64)
  const [scenario, setScenario] = useState<Scenario>('iot')
  const [output, setOutput] = useState<string[]>([])

  const generateTuning = () => {
    const lines: string[] = []

    lines.push(`# Тюнинг Mosquitto для ${ram} MB RAM, сценарий: ${scenario}`)
    lines.push('')

    // TODO: Рассчитайте max_connections от RAM
    // TODO: Выберите message_size_limit от сценария:
    //   minimal: 512, iot: 4096, full: 65536
    // TODO: Рассчитайте memory_limit = ram * 0.35 * 1_000_000
    // TODO: Задайте max_queued_messages (100 для minimal, 200 для iot, 500 для full)
    // TODO: sys_interval: 60 для minimal/iot, 10 для full

    lines.push('# TODO: добавьте параметры тюнинга')
    lines.push('listener 1883')
    lines.push('protocol mqtt')
    lines.push('')
    lines.push('# TODO: max_connections ?')
    lines.push('# TODO: message_size_limit ?')
    lines.push('# TODO: max_queued_messages ?')
    lines.push('# TODO: max_queued_bytes ?')
    lines.push('# TODO: memory_limit ?')
    lines.push('# TODO: sys_interval ?')
    lines.push('# TODO: log_type ?')

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.11.2')}</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>
            RAM: <strong>{ram} MB</strong>
          </label>
          <input
            type="range"
            min={32}
            max={512}
            step={32}
            value={ram}
            onChange={(e) => setRam(Number(e.target.value))}
            style={{ width: '200px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Сценарий:</label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value as Scenario)}
            style={{ padding: '0.25rem' }}
          >
            <option value="minimal">Минимальный (≤10 датчиков)</option>
            <option value="iot">IoT (до 50 устройств)</option>
            <option value="full">Полный (100+ устройств)</option>
          </select>
        </div>
      </div>

      {/* TODO: Добавьте кнопку вызова generateTuning */}
      <button onClick={generateTuning}>Сгенерировать тюнинг</button>

      {output.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflowX: 'auto', fontSize: '0.85rem' }}>
            {output.join('\n')}
          </pre>
        </div>
      )}

      {/* TODO: Добавьте таблицу-справочник параметров тюнинга:
          | Параметр | По умолчанию | Рекомендуется | Описание |
          Минимум 6 параметров: max_connections, message_size_limit,
          max_queued_messages, memory_limit, sys_interval, log_type */}
    </div>
  )
}
