import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 12.1: Firewall правила — Решение
// ============================================

type FirewallTool = 'uci' | 'iptables' | 'nftables'
type AccessZone = 'lan-only' | 'wan-allow' | 'vpn-only'

export function Task12_1_Solution() {
  const { t } = useLanguage()
  const [tool, setTool] = useState<FirewallTool>('uci')
  const [zone, setZone] = useState<AccessZone>('lan-only')
  const [mqttPort, setMqttPort] = useState('1883')
  const [wsPort, setWsPort] = useState('9001')
  const [output, setOutput] = useState<string[]>([])

  const generateFirewall = () => {
    const lines: string[] = []

    if (tool === 'uci') {
      lines.push('# Настройка firewall через UCI (рекомендуется для OpenWRT)')
      lines.push('')

      if (zone === 'lan-only') {
        lines.push('# Запрет MQTT с WAN (по умолчанию — уже заблокировано):')
        lines.push('# Правило по умолчанию в OpenWRT блокирует весь входящий WAN-трафик.')
        lines.push('# Дополнительно убедитесь, что нет правил "Allow-MQTT from wan".')
        lines.push('')
        lines.push('# Явно разрешить MQTT из LAN (если нужно явное правило):')
        lines.push('uci add firewall rule')
        lines.push("uci set firewall.@rule[-1].name='Allow-MQTT-LAN'")
        lines.push("uci set firewall.@rule[-1].src='lan'")
        lines.push("uci set firewall.@rule[-1].dest_port='" + mqttPort + "'")
        lines.push("uci set firewall.@rule[-1].proto='tcp'")
        lines.push("uci set firewall.@rule[-1].target='ACCEPT'")
        lines.push('uci commit firewall')
        lines.push('/etc/init.d/firewall restart')
      } else if (zone === 'wan-allow') {
        lines.push('# ВНИМАНИЕ: Открытие MQTT в интернет — только с TLS и аутентификацией!')
        lines.push('')
        lines.push('uci add firewall rule')
        lines.push("uci set firewall.@rule[-1].name='Allow-MQTT-WAN'")
        lines.push("uci set firewall.@rule[-1].src='wan'")
        lines.push("uci set firewall.@rule[-1].dest='lan'")
        lines.push(`uci set firewall.@rule[-1].dest_port='${mqttPort} ${wsPort}'`)
        lines.push("uci set firewall.@rule[-1].proto='tcp'")
        lines.push("uci set firewall.@rule[-1].target='ACCEPT'")
        lines.push('uci commit firewall')
        lines.push('/etc/init.d/firewall restart')
        lines.push('')
        lines.push('# Обязательно настройте TLS (порт 8883) вместо 1883!')
      } else {
        lines.push('# Разрешить MQTT только из VPN-интерфейса (tun0):')
        lines.push('')
        lines.push('# Сначала создайте зону для VPN-интерфейса:')
        lines.push('uci add firewall zone')
        lines.push("uci set firewall.@zone[-1].name='vpn'")
        lines.push("uci set firewall.@zone[-1].network='vpn'")
        lines.push("uci set firewall.@zone[-1].input='DROP'")
        lines.push("uci set firewall.@zone[-1].output='ACCEPT'")
        lines.push("uci set firewall.@zone[-1].forward='DROP'")
        lines.push('')
        lines.push('uci add firewall rule')
        lines.push("uci set firewall.@rule[-1].name='Allow-MQTT-VPN'")
        lines.push("uci set firewall.@rule[-1].src='vpn'")
        lines.push("uci set firewall.@rule[-1].dest_port='" + mqttPort + "'")
        lines.push("uci set firewall.@rule[-1].proto='tcp'")
        lines.push("uci set firewall.@rule[-1].target='ACCEPT'")
        lines.push('uci commit firewall && /etc/init.d/firewall restart')
      }

    } else if (tool === 'iptables') {
      lines.push('# Прямые iptables правила (не сохраняются после перезагрузки без iptables-save)')
      lines.push('')

      if (zone === 'lan-only') {
        lines.push('# Разрешить MQTT только из локальной сети (br-lan):')
        lines.push(`iptables -A INPUT -i br-lan -p tcp --dport ${mqttPort} -j ACCEPT`)
        lines.push(`iptables -A INPUT -i br-lan -p tcp --dport ${wsPort} -j ACCEPT`)
        lines.push('')
        lines.push('# Заблокировать MQTT с WAN:')
        lines.push(`iptables -A INPUT -i eth0.2 -p tcp --dport ${mqttPort} -j DROP`)
        lines.push(`iptables -A INPUT -i eth0.2 -p tcp --dport ${wsPort} -j DROP`)
        lines.push('')
        lines.push('# Сохранить правила:')
        lines.push('iptables-save > /etc/iptables.rules')
      } else if (zone === 'wan-allow') {
        lines.push('# Открыть MQTT из WAN (только для TLS!):')
        lines.push(`iptables -A INPUT -p tcp --dport ${mqttPort} -j ACCEPT`)
        lines.push(`iptables -A INPUT -p tcp --dport ${wsPort} -j ACCEPT`)
        lines.push('')
        lines.push('# Rate limiting (защита от брутфорса):')
        lines.push(`iptables -I INPUT -p tcp --dport ${mqttPort} -m recent --name mqtt --update --seconds 60 --hitcount 10 -j DROP`)
        lines.push(`iptables -I INPUT -p tcp --dport ${mqttPort} -m recent --name mqtt --set -j ACCEPT`)
      } else {
        lines.push('# Только из VPN (tun0):')
        lines.push(`iptables -A INPUT -i tun0 -p tcp --dport ${mqttPort} -j ACCEPT`)
        lines.push(`iptables -A INPUT -p tcp --dport ${mqttPort} -j DROP`)
      }

    } else {
      lines.push('# nftables (OpenWRT 22.x+ использует nftables по умолчанию)')
      lines.push('# Файл: /etc/nftables.d/99-mqtt.nft')
      lines.push('')
      lines.push('table inet filter {')
      lines.push('  chain input {')

      if (zone === 'lan-only') {
        lines.push(`    # Разрешить MQTT из LAN:`)
        lines.push(`    iifname "br-lan" tcp dport { ${mqttPort}, ${wsPort} } accept`)
        lines.push(`    # Блокировать MQTT из WAN:`)
        lines.push(`    iifname "eth0.2" tcp dport { ${mqttPort}, ${wsPort} } drop`)
      } else if (zone === 'wan-allow') {
        lines.push(`    # MQTT из любого источника (нужен TLS!):`)
        lines.push(`    tcp dport { ${mqttPort}, ${wsPort} } accept`)
      } else {
        lines.push(`    # Только из VPN:`)
        lines.push(`    iifname "tun0" tcp dport ${mqttPort} accept`)
        lines.push(`    tcp dport ${mqttPort} drop`)
      }

      lines.push('  }')
      lines.push('}')
      lines.push('')
      lines.push('# Применить:')
      lines.push('nft -f /etc/nftables.d/99-mqtt.nft')
    }

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('solution.level12.firewallTitle')}</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>{t('solution.level12.toolLabel')}</label>
          <select
            value={tool}
            onChange={(e) => setTool(e.target.value as FirewallTool)}
            style={{ padding: '0.25rem' }}
          >
            <option value="uci">UCI (OpenWRT GUI)</option>
            <option value="iptables">iptables</option>
            <option value="nftables">nftables (OpenWRT 22+)</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>{t('solution.level12.zoneLabel')}</label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value as AccessZone)}
            style={{ padding: '0.25rem' }}
          >
            <option value="lan-only">{t('solution.level12.zoneLanOnly')}</option>
            <option value="wan-allow">{t('solution.level12.zoneWanAllow')}</option>
            <option value="vpn-only">{t('solution.level12.zoneVpnOnly')}</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>{t('solution.level12.mqttPortLabel')}</label>
          <input
            type="number"
            value={mqttPort}
            onChange={(e) => setMqttPort(e.target.value)}
            style={{ padding: '0.25rem', width: '70px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>{t('solution.level12.wsPortLabel')}</label>
          <input
            type="number"
            value={wsPort}
            onChange={(e) => setWsPort(e.target.value)}
            style={{ padding: '0.25rem', width: '70px' }}
          />
        </div>
      </div>

      <button onClick={generateFirewall}>{t('solution.level12.generateBtn')}</button>

      {output.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          {zone === 'wan-allow' && (
            <div style={{ background: '#4a1a1a', border: '1px solid #ff4444', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              {t('solution.level12.wanWarning')}
            </div>
          )}
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', overflowX: 'auto', fontSize: '0.85rem' }}>
            {output.join('\n')}
          </pre>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 12.2: Rate limiting и защита — Решение
// ============================================

export function Task12_2_Solution() {
  const { t } = useLanguage()
  const [activeSection, setActiveSection] = useState<'mosquitto' | 'iptables' | 'fail2ban'>('mosquitto')
  const [output, setOutput] = useState<string[]>([])

  const generate = () => {
    const lines: string[] = []

    if (activeSection === 'mosquitto') {
      lines.push('# Rate limiting средствами Mosquitto 2.x')
      lines.push('')
      lines.push('# Глобальный лимит соединений:')
      lines.push('max_connections 100')
      lines.push('')
      lines.push('# per_listener_settings: разные лимиты для разных слушателей')
      lines.push('per_listener_settings true')
      lines.push('')
      lines.push('listener 1883')
      lines.push('protocol mqtt')
      lines.push('max_connections 50     # Лимит для MQTT/TCP')
      lines.push('allow_anonymous false')
      lines.push('password_file /etc/mosquitto/passwd')
      lines.push('')
      lines.push('listener 9001')
      lines.push('protocol websockets')
      lines.push('max_connections 20     # Меньше для браузеров')
      lines.push('allow_anonymous false')
      lines.push('password_file /etc/mosquitto/passwd')
      lines.push('')
      lines.push('# Ограничение размера и очереди:')
      lines.push('message_size_limit 4096')
      lines.push('max_queued_messages 50')
      lines.push('max_inflight_messages 10')
    } else if (activeSection === 'iptables') {
      lines.push('# Rate limiting через iptables (защита от DoS/брутфорса)')
      lines.push('')
      lines.push('# Ограничить новые подключения: не более 5 в минуту с одного IP:')
      lines.push('iptables -N MQTT_LIMIT')
      lines.push('iptables -A MQTT_LIMIT -m recent --name mqtt_conn --update --seconds 60 --hitcount 5 \\')
      lines.push('  -j LOG --log-prefix "MQTT-BLOCKED: "')
      lines.push('iptables -A MQTT_LIMIT -m recent --name mqtt_conn --update --seconds 60 --hitcount 5 \\')
      lines.push('  -j DROP')
      lines.push('iptables -A MQTT_LIMIT -m recent --name mqtt_conn --set')
      lines.push('iptables -A MQTT_LIMIT -j ACCEPT')
      lines.push('')
      lines.push('# Применить к MQTT-порту (только новые соединения):')
      lines.push('iptables -A INPUT -p tcp --dport 1883 --syn -j MQTT_LIMIT')
      lines.push('iptables -A INPUT -p tcp --dport 9001 --syn -j MQTT_LIMIT')
      lines.push('')
      lines.push('# Сохранить:')
      lines.push('iptables-save > /etc/iptables.rules')
      lines.push('')
      lines.push('# Проверить заблокированных:')
      lines.push('iptables -L MQTT_LIMIT -n -v')
    } else {
      lines.push('# fail2ban для Mosquitto (если доступен на OpenWRT)')
      lines.push('# opkg install fail2ban  (не всегда доступен)')
      lines.push('')
      lines.push('# /etc/fail2ban/filter.d/mosquitto.conf')
      lines.push('[Definition]')
      lines.push('failregex = .*Client <HOST> disconnected due to protocol error.*')
      lines.push('            .*Client connection from <HOST>: authentication failed.*')
      lines.push('            .*Login check failed.*<HOST>.*')
      lines.push('ignoreregex =')
      lines.push('')
      lines.push('# /etc/fail2ban/jail.d/mosquitto.conf')
      lines.push('[mosquitto]')
      lines.push('enabled  = true')
      lines.push('filter   = mosquitto')
      lines.push('logpath  = /var/log/mosquitto.log')
      lines.push('maxretry = 5')
      lines.push('bantime  = 3600')
      lines.push('findtime = 300')
      lines.push('action   = iptables-allports[name=mosquitto]')
      lines.push('')
      lines.push('# Альтернатива fail2ban для OpenWRT — простой shell-скрипт:')
      lines.push('#!/bin/sh')
      lines.push('# /usr/local/bin/mqtt-banip.sh')
      lines.push('# Читает лог, банит IP с > 5 неудачных попыток за 5 минут')
      lines.push('')
      lines.push("FAILED_IPS=$(logread | grep 'authentication failed' | \\")
      lines.push("  grep -oE '[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+' | \\")
      lines.push('  sort | uniq -c | sort -rn | \\')
      lines.push("  awk '$1 >= 5 {print $2}')")
      lines.push('')
      lines.push('for IP in $FAILED_IPS; do')
      lines.push('  iptables -A INPUT -s "$IP" -j DROP')
      lines.push('  logger -t mqtt-ban "Banned $IP"')
      lines.push('done')
    }

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('solution.level12.rateLimitTitle')}</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['mosquitto', 'iptables', 'fail2ban'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            style={{ fontWeight: activeSection === s ? 'bold' : 'normal' }}
          >
            {s === 'mosquitto' ? t('solution.level12.mosquitto') : s === 'iptables' ? 'iptables' : 'fail2ban'}
          </button>
        ))}
      </div>

      <button onClick={generate}>{t('solution.level12.showBtn')}</button>

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
// Задание 12.3: Чеклист безопасности MQTT — Решение
// ============================================

interface ChecklistItem {
  id: string
  category: string
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  config?: string
}

const CHECKLIST: ChecklistItem[] = [
  // Аутентификация
  { id: 'auth-1', category: 'Аутентификация', title: 'Отключён allow_anonymous', description: 'Анонимные подключения запрещены', severity: 'critical', config: 'allow_anonymous false' },
  { id: 'auth-2', category: 'Аутентификация', title: 'Сложные пароли', description: 'Пароли в password_file имеют длину ≥12 символов', severity: 'high' },
  { id: 'auth-3', category: 'Аутентификация', title: 'ACL настроен', description: 'Файл acl_file ограничивает доступ к топикам', severity: 'high', config: 'acl_file /etc/mosquitto/acl' },
  { id: 'auth-4', category: 'Аутентификация', title: 'Разные пароли для разных устройств', description: 'Каждый датчик/клиент имеет уникальные учётные данные', severity: 'high' },
  // Шифрование
  { id: 'tls-1', category: 'Шифрование', title: 'TLS включён', description: 'Используется порт 8883 (MQTT/TLS) вместо 1883', severity: 'critical', config: 'listener 8883\ncafile /etc/mosquitto/ca.crt\ncertfile /etc/mosquitto/server.crt\nkeyfile /etc/mosquitto/server.key' },
  { id: 'tls-2', category: 'Шифрование', title: 'TLS 1.2+ обязателен', description: 'TLSv1.0 и TLSv1.1 отключены', severity: 'high', config: 'tls_version tlsv1.2' },
  { id: 'tls-3', category: 'Шифрование', title: 'WSS вместо WS', description: 'WebSocket использует TLS (wss://)', severity: 'high' },
  // Сеть
  { id: 'net-1', category: 'Сеть', title: 'Порт 1883 закрыт от WAN', description: 'Firewall блокирует MQTT из интернета', severity: 'critical' },
  { id: 'net-2', category: 'Сеть', title: 'bind_address на LAN', description: 'Брокер слушает только на LAN-интерфейсе', severity: 'high', config: 'bind_address 192.168.1.1' },
  { id: 'net-3', category: 'Сеть', title: 'Rate limiting настроен', description: 'iptables ограничивает новые подключения с одного IP', severity: 'medium' },
  // Ресурсы
  { id: 'res-1', category: 'Ресурсы', title: 'max_connections задан', description: 'Лимит предотвращает DoS через соединения', severity: 'medium', config: 'max_connections 50' },
  { id: 'res-2', category: 'Ресурсы', title: 'message_size_limit задан', description: 'Защита от oversized messages', severity: 'medium', config: 'message_size_limit 4096' },
  { id: 'res-3', category: 'Ресурсы', title: 'memory_limit задан', description: 'Брокер не съест всю RAM', severity: 'high', config: 'memory_limit 25000000' },
  // Мониторинг
  { id: 'mon-1', category: 'Мониторинг', title: 'Логирование включено', description: 'log_type error warning, log_dest syslog', severity: 'medium' },
  { id: 'mon-2', category: 'Мониторинг', title: 'Метрики мониторятся', description: 'Скрипт или collectd собирает $SYS метрики', severity: 'low' },
]

export function Task12_3_Solution() {
  const { t } = useLanguage()
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [showConfig, setShowConfig] = useState<string | null>(null)

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const severities = ['all', 'critical', 'high', 'medium', 'low']
  const filtered = CHECKLIST.filter(
    (item) => filterSeverity === 'all' || item.severity === filterSeverity
  )

  const totalChecked = CHECKLIST.filter((item) => checked.has(item.id)).length
  const criticalChecked = CHECKLIST.filter((item) => item.severity === 'critical' && checked.has(item.id)).length
  const totalCritical = CHECKLIST.filter((item) => item.severity === 'critical').length

  const severityColor = (s: ChecklistItem['severity']) => {
    const colors = { critical: '#ff4444', high: '#ff8800', medium: '#ffcc00', low: '#44bb44' }
    return colors[s]
  }

  return (
    <div className="exercise-container">
      <h2>{t('solution.level12.checklistTitle')}</h2>

      <div style={{ background: '#2d2d2d', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', display: 'flex', gap: '2rem' }}>
        <div>
          <span style={{ color: '#888' }}>{t('solution.level12.completed')}: </span>
          <strong style={{ color: totalChecked === CHECKLIST.length ? '#44bb44' : '#fff' }}>
            {totalChecked}/{CHECKLIST.length}
          </strong>
        </div>
        <div>
          <span style={{ color: '#888' }}>{t('solution.level12.critical')}: </span>
          <strong style={{ color: criticalChecked === totalCritical ? '#44bb44' : '#ff4444' }}>
            {criticalChecked}/{totalCritical}
          </strong>
        </div>
        <div>
          <span style={{ color: '#888' }}>{t('solution.level12.assessment')}: </span>
          <strong style={{ color: totalChecked / CHECKLIST.length >= 0.8 ? '#44bb44' : '#ff8800' }}>
            {Math.round((totalChecked / CHECKLIST.length) * 100)}%
          </strong>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {severities.map((s) => (
          <button
            key={s}
            onClick={() => setFilterSeverity(s)}
            style={{
              fontWeight: filterSeverity === s ? 'bold' : 'normal',
              color: s !== 'all' ? severityColor(s as ChecklistItem['severity']) : undefined,
            }}
          >
            {s === 'all' ? t('solution.level12.all') : s}
          </button>
        ))}
      </div>

      <div>
        {[t('solution.level12.catAuth'), t('solution.level12.catTls'), t('solution.level12.catNet'), t('solution.level12.catRes'), t('solution.level12.catMon')].map((cat) => {
          const items = filtered.filter((item) => item.category === cat)
          if (items.length === 0) return null
          return (
            <div key={cat} style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{cat}</h3>
              {items.map((item) => (
                <div key={item.id} style={{ marginBottom: '0.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checked.has(item.id)}
                      onChange={() => toggleCheck(item.id)}
                      style={{ marginTop: '0.15rem' }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{ textDecoration: checked.has(item.id) ? 'line-through' : 'none', color: checked.has(item.id) ? '#666' : '#fff' }}>
                        {item.title}
                      </span>
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: severityColor(item.severity), textTransform: 'uppercase' }}>
                        [{item.severity}]
                      </span>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>{item.description}</div>
                    </div>
                    {item.config && (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setShowConfig(showConfig === item.id ? null : item.id)
                        }}
                        style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem' }}
                      >
                        {t('solution.level12.configBtn')}
                      </button>
                    )}
                  </label>
                  {showConfig === item.id && item.config && (
                    <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', marginLeft: '1.5rem', marginTop: '0.25rem' }}>
                      {item.config}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
