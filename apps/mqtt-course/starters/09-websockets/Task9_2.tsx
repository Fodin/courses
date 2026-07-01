import { useState } from 'react'
import { useLanguage } from '../../src/hooks'

// ============================================
// Задание 9.2: Reverse proxy (uhttpd/nginx)
// ============================================
// Цель: настроить nginx для проксирования WebSocket-трафика к Mosquitto.
//
// TODO:
// 1. Выберите тип прокси (nginx рекомендуется для WS)
// 2. Нажмите "Сгенерировать конфиг" и изучите вывод
// 3. Найдите критически важные заголовки:
//    - proxy_set_header Upgrade $http_upgrade
//    - proxy_set_header Connection "upgrade"
//    - proxy_http_version 1.1
// 4. Установите nginx на роутере: opkg install nginx
// 5. Примените конфиг и протестируйте:
//    curl -v -H "Upgrade: websocket" -H "Connection: Upgrade" \
//    -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
//    -H "Sec-WebSocket-Version: 13" \
//    http://192.168.1.1/mqtt
//    (ожидаем: 101 Switching Protocols)

type ProxyType = 'uhttpd' | 'nginx'

export function Task9_2() {
  const { t } = useLanguage()
  const [proxyType, setProxyType] = useState<ProxyType>('nginx')
  const [mqttWsPort, setMqttWsPort] = useState('9001')
  const [output, setOutput] = useState<string[]>([])

  const generateProxy = () => {
    const lines: string[] = []

    if (proxyType === 'nginx') {
      // TODO: Добавьте nginx конфиг с обязательными заголовками WebSocket
      // Структура:
      // server {
      //   listen 80;
      //   location /mqtt {
      //     proxy_pass http://127.0.0.1:<port>;
      //     proxy_http_version 1.1;
      //     proxy_set_header Upgrade ...
      //     proxy_set_header Connection ...
      //     proxy_read_timeout 3600s;
      //   }
      // }
      lines.push('# TODO: добавьте nginx конфиг')
    } else {
      // TODO: Добавьте объяснение, что uhttpd не поддерживает WS proxy
      // и команды для открытия порта напрямую через uci/iptables
      lines.push('# TODO: добавьте объяснение и команды firewall')
    }

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.9.2')}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Тип прокси:</label>
        <label style={{ marginRight: '1.5rem' }}>
          <input
            type="radio"
            value="nginx"
            checked={proxyType === 'nginx'}
            onChange={() => setProxyType('nginx')}
          />{' '}
          nginx
        </label>
        <label>
          <input
            type="radio"
            value="uhttpd"
            checked={proxyType === 'uhttpd'}
            onChange={() => setProxyType('uhttpd')}
          />{' '}
          uhttpd
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.25rem' }}>Порт Mosquitto WS:</label>
        {/* TODO: Подключите input к состоянию mqttWsPort */}
        <input
          type="number"
          value={mqttWsPort}
          onChange={(e) => setMqttWsPort(e.target.value)}
          style={{ padding: '0.25rem', width: '80px' }}
        />
      </div>

      {/* TODO: Добавьте кнопку вызова generateProxy */}
      <button onClick={generateProxy}>Сгенерировать конфиг</button>

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
