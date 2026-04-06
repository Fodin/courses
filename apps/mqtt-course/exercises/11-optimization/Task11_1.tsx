import { useState } from 'react'
import { useLanguage } from '../../src/hooks'

// ============================================
// Задание 11.1: Ограничения встраиваемых систем
// ============================================
// Цель: оценить ресурсы роутера и рассчитать допустимые параметры Mosquitto.
//
// TODO:
// 1. Выберите профиль роутера или введите параметры вручную
// 2. Реализуйте calculateLimits() — рассчитайте ограничения по формулам:
//    - max_connections = floor(ram_mb * 0.4 / 0.025)  (30 KB на клиента)
//    - memory_limit = ram_mb * 0.35 * 1_000_000
//    - message_size_limit: до 512 если ram <= 32 MB, 4096 если <= 128, иначе 65536
// 3. Сгенерируйте рекомендуемый mosquitto.conf
// 4. На реальном устройстве проверьте: cat /proc/meminfo | grep MemTotal

export function Task11_1() {
  const { t } = useLanguage()
  const [ram, setRam] = useState(64)
  const [output, setOutput] = useState<string[]>([])

  const calculateLimits = () => {
    const lines: string[] = []

    // TODO: Рассчитайте ограничения по формулам выше
    // Пример: const maxConnections = Math.floor((ram * 0.4) / 0.025)

    lines.push(`# Расчёт для ${ram} MB RAM`)
    lines.push('')
    lines.push('# TODO: реализуйте расчёт max_connections')
    lines.push('# TODO: реализуйте расчёт memory_limit')
    lines.push('# TODO: реализуйте выбор message_size_limit')
    lines.push('')
    lines.push('# TODO: сгенерируйте mosquitto.conf с этими значениями')

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.11.1')}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem' }}>
          RAM роутера: <strong>{ram} MB</strong>
        </label>
        {/* TODO: подключите slider к состоянию ram (min=32, max=512, step=32) */}
        <input
          type="range"
          min={32}
          max={512}
          step={32}
          value={ram}
          onChange={(e) => setRam(Number(e.target.value))}
          style={{ width: '300px' }}
        />
      </div>

      {/* TODO: Добавьте выпадающий список с пресетами роутеров:
          - TP-Link TL-WR841N (32 MB)
          - TP-Link Archer C7 (128 MB)
          - GL.iNet GL-MT3000 (512 MB)
      */}

      {/* TODO: Добавьте кнопку вызова calculateLimits */}
      <button onClick={calculateLimits}>Рассчитать лимиты</button>

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
