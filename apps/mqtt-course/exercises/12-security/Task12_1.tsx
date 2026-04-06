import { useState } from 'react'
import { useLanguage } from '../../src/hooks'

// ============================================
// Задание 12.1: Firewall правила для MQTT
// ============================================
// Цель: настроить firewall OpenWRT для защиты MQTT-брокера.
//
// TODO:
// 1. Выберите инструмент (UCI рекомендуется для OpenWRT)
// 2. Выберите зону доступа (только LAN — наиболее безопасно)
// 3. Реализуйте generateFirewall() — сгенерируйте правила:
//    Для UCI: uci add firewall rule + uci set ... + uci commit
//    Для iptables: iptables -A INPUT ... -j DROP/ACCEPT
//    Для nftables: блок table inet filter { chain input { ... } }
// 4. Добавьте предупреждение при выборе wan-allow
// 5. На роутере: применить правила и проверить nmap-ом

type FirewallTool = 'uci' | 'iptables' | 'nftables'
type AccessZone = 'lan-only' | 'wan-allow' | 'vpn-only'

export function Task12_1() {
  const { t } = useLanguage()
  const [tool, setTool] = useState<FirewallTool>('uci')
  const [zone, setZone] = useState<AccessZone>('lan-only')
  const [mqttPort, setMqttPort] = useState('1883')
  const [output, setOutput] = useState<string[]>([])

  const generateFirewall = () => {
    const lines: string[] = []

    lines.push(`# Firewall для MQTT — инструмент: ${tool}, зона: ${zone}`)
    lines.push('')

    if (tool === 'uci') {
      // TODO: Сгенерируйте UCI команды для настройки firewall
      // Для lan-only: правило Block-MQTT-WAN
      // Для wan-allow: правило Allow-MQTT-WAN (с предупреждением!)
      // Для vpn-only: создать зону vpn + правило

      // Структура UCI команд:
      // uci add firewall rule
      // uci set firewall.@rule[-1].name='...'
      // uci set firewall.@rule[-1].src='...'
      // uci set firewall.@rule[-1].dest_port='...'
      // uci set firewall.@rule[-1].proto='tcp'
      // uci set firewall.@rule[-1].target='DROP'/'ACCEPT'
      // uci commit firewall && /etc/init.d/firewall restart

      lines.push('# TODO: добавьте UCI команды для настройки firewall')

    } else if (tool === 'iptables') {
      // TODO: Сгенерируйте iptables правила
      // Для lan-only: разрешить из br-lan, заблокировать из eth0.2
      // Для wan-allow: разрешить + rate limiting
      // Для vpn-only: разрешить из tun0, DROP остальное

      lines.push('# TODO: добавьте iptables правила')

    } else {
      // TODO: Сгенерируйте nftables конфиг
      // table inet filter { chain input { ... } }

      lines.push('# TODO: добавьте nftables конфиг')
    }

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.12.1')}</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Инструмент:</label>
          <select value={tool} onChange={(e) => setTool(e.target.value as FirewallTool)} style={{ padding: '0.25rem' }}>
            <option value="uci">UCI (OpenWRT)</option>
            <option value="iptables">iptables</option>
            <option value="nftables">nftables</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Зона доступа:</label>
          <select value={zone} onChange={(e) => setZone(e.target.value as AccessZone)} style={{ padding: '0.25rem' }}>
            <option value="lan-only">Только LAN (рекомендуется)</option>
            <option value="wan-allow">Разрешить из WAN</option>
            <option value="vpn-only">Только VPN</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>MQTT порт:</label>
          <input
            type="number"
            value={mqttPort}
            onChange={(e) => setMqttPort(e.target.value)}
            style={{ padding: '0.25rem', width: '70px' }}
          />
        </div>
      </div>

      {/* TODO: Добавьте предупреждение при zone === 'wan-allow' */}
      {zone === 'wan-allow' && (
        <div style={{ background: '#4a1a1a', border: '1px solid #ff4444', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
          Открытие MQTT в интернет требует TLS (порт 8883)!
        </div>
      )}

      {/* TODO: Добавьте кнопку вызова generateFirewall */}
      <button onClick={generateFirewall}>Сгенерировать правила</button>

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
