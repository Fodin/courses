import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 9.1: WebSocket listener — Решение
// ============================================

export function Task9_1_Solution() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'config' | 'test'>('config')
  const [port, setPort] = useState('9001')
  const [bindAddr, setBindAddr] = useState('0.0.0.0')
  const [output, setOutput] = useState<string[]>([])

  const generateConfig = () => {
    const lines: string[] = []
    lines.push('# /etc/mosquitto/mosquitto.conf')
    lines.push('')
    lines.push('# Стандартный MQTT-слушатель (TCP)')
    lines.push('listener 1883')
    lines.push('protocol mqtt')
    lines.push('')
    lines.push('# WebSocket-слушатель')
    lines.push(`listener ${port} ${bindAddr !== '0.0.0.0' ? bindAddr : ''}`.trim())
    lines.push('protocol websockets')
    lines.push('')
    lines.push('# Общие настройки аутентификации')
    lines.push('allow_anonymous false')
    lines.push('password_file /etc/mosquitto/passwd')
    lines.push('')
    lines.push('# Логирование')
    lines.push('log_type all')
    lines.push('log_dest file /var/log/mosquitto.log')
    setOutput(lines)
  }

  const runTest = () => {
    const lines: string[] = []
    lines.push('# Проверка WebSocket-слушателя:')
    lines.push('')
    lines.push('# 1. Убеждаемся, что порт открыт:')
    lines.push(`netstat -tlnp | grep ${port}`)
    lines.push(`# tcp6  0  0 :::${port}  :::*  LISTEN  1234/mosquitto`)
    lines.push('')
    lines.push('# 2. Тест через mosquitto_sub (клиент поддерживает WS):')
    lines.push(`mosquitto_sub -h 192.168.1.1 -p ${port} -t "test/#" \\`)
    lines.push('  --protocol-version mqttv311')
    lines.push('')
    lines.push('# 3. Тест через websocat (утилита):')
    lines.push(`websocat ws://192.168.1.1:${port}/`)
    lines.push('')
    lines.push('# 4. Просмотр лога при подключении:')
    lines.push('logread -f | grep mosquitto')
    lines.push('# New connection from 192.168.1.X on port ' + port + '.')
    lines.push('# New client connected from 192.168.1.X as web-client-1.')
    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('solution.level9.wsListenerTitle')}</h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('config')}
          style={{ fontWeight: activeTab === 'config' ? 'bold' : 'normal' }}
        >
          {t('solution.level9.configuration')}
        </button>
        <button
          onClick={() => setActiveTab('test')}
          style={{ fontWeight: activeTab === 'test' ? 'bold' : 'normal' }}
        >
          {t('solution.level9.testing')}
        </button>
      </div>

      {activeTab === 'config' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>
              {t('solution.level9.wsPortLabel')}:
            </label>
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              style={{ marginRight: '1rem', padding: '0.25rem', width: '80px' }}
            />
            <label style={{ marginRight: '0.5rem' }}>Bind address:</label>
            <select
              value={bindAddr}
              onChange={(e) => setBindAddr(e.target.value)}
              style={{ padding: '0.25rem' }}
            >
              <option value="0.0.0.0">0.0.0.0 ({t('solution.level9.allInterfaces')})</option>
              <option value="127.0.0.1">127.0.0.1 ({t('solution.level9.localhostOnly')})</option>
              <option value="192.168.1.1">192.168.1.1 (LAN)</option>
            </select>
          </div>
          <button onClick={generateConfig}>{t('solution.level9.generateConfig')}</button>
        </div>
      )}

      {activeTab === 'test' && (
        <button onClick={runTest}>{t('solution.level9.showTestCommands')}</button>
      )}

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

// ============================================
// Задание 9.2: Reverse proxy (uhttpd/nginx) — Решение
// ============================================

type ProxyType = 'uhttpd' | 'nginx'

export function Task9_2_Solution() {
  const { t } = useLanguage()
  const [proxyType, setProxyType] = useState<ProxyType>('uhttpd')
  const [mqttWsPort, setMqttWsPort] = useState('9001')
  const [publicPath, setPublicPath] = useState('/mqtt')
  const [output, setOutput] = useState<string[]>([])

  const generateProxy = () => {
    const lines: string[] = []

    if (proxyType === 'uhttpd') {
      lines.push('# uhttpd reverse proxy для WebSocket MQTT')
      lines.push('# Файл: /etc/config/uhttpd')
      lines.push('')
      lines.push('config uhttpd main')
      lines.push("  option listen_http '0.0.0.0:80'")
      lines.push("  option listen_https '0.0.0.0:443'")
      lines.push("  option redirect_https '1'")
      lines.push('')
      lines.push('# Проксирование WebSocket:')
      lines.push('# uhttpd НЕ поддерживает WebSocket proxy напрямую.')
      lines.push('# Используйте nginx или подключайтесь напрямую к порту ' + mqttWsPort + '.')
      lines.push('')
      lines.push('# Альтернатива — открыть порт напрямую в firewall:')
      lines.push('uci add firewall rule')
      lines.push("uci set firewall.@rule[-1].name='Allow-MQTT-WS'")
      lines.push("uci set firewall.@rule[-1].src='wan'")
      lines.push("uci set firewall.@rule[-1].dest_port='" + mqttWsPort + "'")
      lines.push("uci set firewall.@rule[-1].proto='tcp'")
      lines.push("uci set firewall.@rule[-1].target='ACCEPT'")
      lines.push('uci commit firewall && /etc/init.d/firewall restart')
    } else {
      lines.push('# nginx reverse proxy для WebSocket MQTT')
      lines.push('# Файл: /etc/nginx/nginx.conf')
      lines.push('')
      lines.push('server {')
      lines.push('  listen 80;')
      lines.push('  server_name _;')
      lines.push('')
      lines.push(`  location ${publicPath} {`)
      lines.push('    proxy_pass http://127.0.0.1:' + mqttWsPort + ';')
      lines.push('    proxy_http_version 1.1;')
      lines.push('')
      lines.push('    # Обязательно для WebSocket upgrade:')
      lines.push("    proxy_set_header Upgrade $http_upgrade;")
      lines.push("    proxy_set_header Connection 'upgrade';")
      lines.push("    proxy_set_header Host $host;")
      lines.push('')
      lines.push('    # Таймаут для долгоживущих WS-соединений:')
      lines.push('    proxy_read_timeout 3600s;')
      lines.push('    proxy_send_timeout 3600s;')
      lines.push('  }')
      lines.push('}')
      lines.push('')
      lines.push('# Установка nginx на OpenWRT:')
      lines.push('opkg update && opkg install nginx')
      lines.push('/etc/init.d/nginx enable && /etc/init.d/nginx start')
    }

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('solution.level9.reverseProxyTitle')}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('solution.level9.proxyTypeLabel')}:</label>
        <label style={{ marginRight: '1.5rem' }}>
          <input
            type="radio"
            value="uhttpd"
            checked={proxyType === 'uhttpd'}
            onChange={() => setProxyType('uhttpd')}
          />{' '}
          uhttpd ({t('solution.level9.uhttpdDesc')})
        </label>
        <label>
          <input
            type="radio"
            value="nginx"
            checked={proxyType === 'nginx'}
            onChange={() => setProxyType('nginx')}
          />{' '}
          nginx
        </label>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>{t('solution.level9.mosquittoWsPortLabel')}:</label>
          <input
            type="number"
            value={mqttWsPort}
            onChange={(e) => setMqttWsPort(e.target.value)}
            style={{ padding: '0.25rem', width: '80px' }}
          />
        </div>
        {proxyType === 'nginx' && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>{t('solution.level9.pathLabel')}:</label>
            <input
              type="text"
              value={publicPath}
              onChange={(e) => setPublicPath(e.target.value)}
              style={{ padding: '0.25rem', width: '120px' }}
            />
          </div>
        )}
      </div>

      <button onClick={generateProxy}>{t('solution.level9.generateConfig')}</button>

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

// ============================================
// Задание 9.3: Веб-клиент MQTT — Решение
// ============================================

type MqttLib = 'mqttjs' | 'paho'

export function Task9_3_Solution() {
  const { t } = useLanguage()
  const [lib, setLib] = useState<MqttLib>('mqttjs')
  const [brokerHost, setBrokerHost] = useState('192.168.1.1')
  const [wsPort, setWsPort] = useState('9001')
  const [topic, setTopic] = useState('sensors/#')
  const [output, setOutput] = useState<string[]>([])

  const generateClient = () => {
    const lines: string[] = []

    if (lib === 'mqttjs') {
      lines.push('<!-- Подключение MQTT.js через CDN -->')
      lines.push('<script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>')
      lines.push('')
      lines.push('<script>')
      lines.push('// Подключение к брокеру через WebSocket')
      lines.push(`const client = mqtt.connect('ws://${brokerHost}:${wsPort}', {`)
      lines.push("  clientId: 'web-' + Math.random().toString(16).slice(2),")
      lines.push("  username: 'webuser',")
      lines.push("  password: 'secret',")
      lines.push('  keepalive: 60,')
      lines.push('  clean: true,')
      lines.push('  reconnectPeriod: 1000,  // авто-переподключение каждые 1с')
      lines.push('})')
      lines.push('')
      lines.push("client.on('connect', () => {")
      lines.push("  console.log('Connected to MQTT broker via WebSocket')")
      lines.push(`  client.subscribe('${topic}', { qos: 1 }, (err) => {`)
      lines.push("    if (err) console.error('Subscribe error:', err)")
      lines.push('  })')
      lines.push('})')
      lines.push('')
      lines.push("client.on('message', (topic, payload) => {")
      lines.push("  console.log(`[${topic}] ${payload.toString()}`)")
      lines.push('  displayMessage(topic, payload.toString())')
      lines.push('})')
      lines.push('')
      lines.push("client.on('error', (err) => {")
      lines.push("  console.error('MQTT error:', err.message)")
      lines.push('})')
      lines.push('')
      lines.push("client.on('offline', () => {")
      lines.push("  console.warn('MQTT client offline, reconnecting...')")
      lines.push('})')
      lines.push('')
      lines.push('// Публикация сообщения:')
      lines.push("client.publish('home/cmd/light', 'ON', { qos: 1, retain: false })")
      lines.push('</script>')
    } else {
      lines.push('<!-- Подключение Eclipse Paho через CDN -->')
      lines.push('<script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.1.0/paho-mqtt.min.js"></script>')
      lines.push('')
      lines.push('<script>')
      lines.push('// Paho использует WebSocket по умолчанию')
      lines.push(`const client = new Paho.Client('${brokerHost}', Number('${wsPort}'), '/mqtt',`)
      lines.push("  'paho-web-' + Math.random().toString(16).slice(2))")
      lines.push('')
      lines.push('client.onConnectionLost = (resp) => {')
      lines.push("  if (resp.errorCode !== 0) {")
      lines.push("    console.error('Connection lost:', resp.errorMessage)")
      lines.push('  }')
      lines.push('}')
      lines.push('')
      lines.push('client.onMessageArrived = (message) => {')
      lines.push('  console.log(`[${message.destinationName}] ${message.payloadString}`)')
      lines.push('}')
      lines.push('')
      lines.push('client.connect({')
      lines.push("  userName: 'webuser',")
      lines.push("  password: 'secret',")
      lines.push('  keepAliveInterval: 60,')
      lines.push('  onSuccess: () => {')
      lines.push("    console.log('Connected!')")
      lines.push(`    client.subscribe('${topic}', { qos: 1 })`)
      lines.push('  },')
      lines.push('  onFailure: (err) => {')
      lines.push("    console.error('Connection failed:', err.errorMessage)")
      lines.push('  },')
      lines.push('})')
      lines.push('')
      lines.push('// Публикация сообщения:')
      lines.push("const msg = new Paho.Message('ON')")
      lines.push("msg.destinationName = 'home/cmd/light'")
      lines.push('msg.qos = 1')
      lines.push('client.send(msg)')
      lines.push('</script>')
    }

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('solution.level9.webClientTitle')}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('solution.level9.libraryLabel')}:</label>
        <label style={{ marginRight: '1.5rem' }}>
          <input
            type="radio"
            value="mqttjs"
            checked={lib === 'mqttjs'}
            onChange={() => setLib('mqttjs')}
          />{' '}
          MQTT.js ({t('solution.level9.recommended')})
        </label>
        <label>
          <input
            type="radio"
            value="paho"
            checked={lib === 'paho'}
            onChange={() => setLib('paho')}
          />{' '}
          Eclipse Paho
        </label>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>{t('solution.level9.brokerIpLabel')}:</label>
          <input
            type="text"
            value={brokerHost}
            onChange={(e) => setBrokerHost(e.target.value)}
            style={{ padding: '0.25rem', width: '130px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>{t('solution.level9.wsPortLabel2')}:</label>
          <input
            type="number"
            value={wsPort}
            onChange={(e) => setWsPort(e.target.value)}
            style={{ padding: '0.25rem', width: '80px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>{t('solution.level9.subscribeTopicLabel')}:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ padding: '0.25rem', width: '130px' }}
          />
        </div>
      </div>

      <button onClick={generateClient}>{t('solution.level9.generateClientCode')}</button>

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
