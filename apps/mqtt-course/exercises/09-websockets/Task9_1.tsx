import { useState } from 'react'
import { useLanguage } from '../../src/hooks'

// ============================================
// Задание 9.1: WebSocket listener
// ============================================
// Цель: настроить Mosquitto для WebSocket-подключений из браузера.
//
// TODO:
// 1. В поле "Порт" укажите номер WebSocket-порта (стандарт — 9001)
// 2. Нажмите "Сгенерировать конфиг" и изучите вывод
// 3. Найдите строку `protocol websockets` — без неё браузер не подключится
// 4. Перейдите на реальный роутер и примените конфигурацию:
//    - Отредактируйте /etc/mosquitto/mosquitto.conf
//    - Добавьте второй listener с protocol websockets
//    - Перезапустите: /etc/init.d/mosquitto restart
// 5. Проверьте: netstat -tlnp | grep 9001

export function Task9_1() {
  const { t } = useLanguage()
  const [port, setPort] = useState('9001')
  const [output, setOutput] = useState<string[]>([])

  const generateConfig = () => {
    // TODO: Реализуйте генерацию конфига mosquitto.conf
    // Конфиг должен содержать:
    // - listener 1883 с protocol mqtt
    // - listener <port> с protocol websockets
    // - allow_anonymous false
    // - password_file /etc/mosquitto/passwd
    const lines: string[] = []

    // TODO: Добавьте строки конфига в массив lines
    // Пример: lines.push('listener 1883')

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.9.1')}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem' }}>
          WebSocket порт:
        </label>
        {/* TODO: Подключите input к состоянию port */}
        <input
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          style={{ padding: '0.25rem', width: '80px' }}
        />
      </div>

      {/* TODO: Добавьте кнопку, которая вызывает generateConfig */}
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
