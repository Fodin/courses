import { useState } from 'react'
import { useLanguage } from '../../src/hooks'

// ============================================
// Задание 9.3: Веб-клиент MQTT
// ============================================
// Цель: сгенерировать код браузерного MQTT-клиента на MQTT.js.
//
// TODO:
// 1. Заполните параметры подключения (IP, порт, топик)
// 2. Реализуйте generateClient() — создайте массив строк кода HTML/JS
// 3. Код должен содержать:
//    - Подключение MQTT.js из CDN
//    - mqtt.connect('ws://...', { clientId, username, password })
//    - Обработчик события 'connect' с вызовом subscribe()
//    - Обработчик события 'message' с отображением данных
//    - Обработчики 'error' и 'offline'
//    - Кнопку публикации сообщения
//    - window.onbeforeunload = () => client.end()
// 4. Создайте реальный HTML-файл и проверьте его в браузере

export function Task9_3() {
  const { t } = useLanguage()
  const [brokerHost, setBrokerHost] = useState('192.168.1.1')
  const [wsPort, setWsPort] = useState('9001')
  const [topic, setTopic] = useState('sensors/#')
  const [username, setUsername] = useState('webuser')
  const [output, setOutput] = useState<string[]>([])

  const generateClient = () => {
    const lines: string[] = []

    // TODO: Сгенерируйте HTML-страницу с MQTT-клиентом
    // Используйте переменные: brokerHost, wsPort, topic, username
    //
    // Шаблон:
    // lines.push('<!DOCTYPE html>')
    // lines.push('<html>')
    // ...
    // lines.push(`const client = mqtt.connect('ws://${brokerHost}:${wsPort}', {`)
    // lines.push(`  clientId: 'web-' + Math.random().toString(16).slice(2),`)
    // lines.push(`  username: '${username}',`)
    // lines.push(`  password: 'ваш-пароль',`)
    // lines.push('})')
    // ...
    // lines.push(`  client.subscribe('${topic}', { qos: 1 })`)
    // ...

    lines.push('// TODO: реализуйте генерацию кода')
    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.9.3')}</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>IP брокера:</label>
          <input
            type="text"
            value={brokerHost}
            onChange={(e) => setBrokerHost(e.target.value)}
            style={{ padding: '0.25rem', width: '130px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>WS порт:</label>
          <input
            type="number"
            value={wsPort}
            onChange={(e) => setWsPort(e.target.value)}
            style={{ padding: '0.25rem', width: '80px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Топик:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ padding: '0.25rem', width: '130px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Пользователь:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '0.25rem', width: '100px' }}
          />
        </div>
      </div>

      {/* TODO: Добавьте кнопку вызова generateClient */}
      <button onClick={generateClient}>Сгенерировать код клиента</button>

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
