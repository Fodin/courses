import { useState } from 'react'
import { useLanguage } from '../../src/hooks'

// ============================================
// Задание 12.2: Rate limiting и защита
// ============================================
// Цель: настроить многоуровневую защиту от DoS и брутфорса.
//
// TODO:
// 1. Реализуйте три секции:
//
//    Секция "mosquitto":
//    - per_listener_settings true
//    - listener 1883: max_connections 50
//    - listener 9001: max_connections 20
//    - message_size_limit 4096, max_queued_messages 50
//
//    Секция "iptables":
//    - Цепочка MQTT_RATE
//    - -m recent --name mqtt_new --update --seconds 60 --hitcount 5 -j DROP
//    - -m recent --name mqtt_new --set -j ACCEPT
//    - Применить к порту 1883: -I INPUT -p tcp --dport 1883 -j MQTT_RATE
//
//    Секция "autoban":
//    - Shell-скрипт /usr/local/bin/mqtt-autoban.sh
//    - Читает logread | grep "authentication failed"
//    - Банит IP с >= 5 ошибками через iptables -A INPUT -s $IP -j DROP
//    - Логирует через logger -t mqtt-autoban
//
// 2. На роутере: протестировать через намеренно неверные пароли
// 3. Проверить: iptables -L INPUT -n | grep DROP

type Section = 'mosquitto' | 'iptables' | 'autoban'

export function Task12_2() {
  const { t } = useLanguage()
  const [section, setSection] = useState<Section>('mosquitto')
  const [maxConnTcp, setMaxConnTcp] = useState('50')
  const [maxConnWs, setMaxConnWs] = useState('20')
  const [threshold, setThreshold] = useState('5')
  const [output, setOutput] = useState<string[]>([])

  const generate = () => {
    const lines: string[] = []

    if (section === 'mosquitto') {
      // TODO: Сгенерируйте конфиг mosquitto.conf с per_listener_settings
      // Два слушателя с разными max_connections
      lines.push('# TODO: добавьте per_listener_settings true')
      lines.push('# TODO: listener 1883 с max_connections ' + maxConnTcp)
      lines.push('# TODO: listener 9001 с max_connections ' + maxConnWs)
      lines.push('# TODO: message_size_limit и max_queued_messages')

    } else if (section === 'iptables') {
      // TODO: Сгенерируйте iptables rate limiting
      // Используйте -m recent для подсчёта подключений
      lines.push('# TODO: iptables -N MQTT_RATE')
      lines.push('# TODO: правила с -m recent --hitcount 5 --seconds 60')
      lines.push('# TODO: применить к порту 1883')

    } else {
      lines.push('#!/bin/sh')
      lines.push(`# THRESHOLD=${threshold}`)
      lines.push('')
      // TODO: Сгенерируйте скрипт автоматического бана:
      // 1. FAILED_IPS=$(logread | grep "authentication failed" | grep -oE IP | sort | uniq -c | awk ...)
      // 2. for IP in $FAILED_IPS; do iptables ... ; logger ...; done
      lines.push('# TODO: получить FAILED_IPS из logread')
      lines.push('# TODO: цикл бана for IP in $FAILED_IPS')
    }

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.12.2')}</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['mosquitto', 'iptables', 'autoban'] as Section[]).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            style={{ fontWeight: section === s ? 'bold' : 'normal' }}
          >
            {s === 'mosquitto' ? 'Mosquitto' : s === 'iptables' ? 'iptables rate' : 'Автобан'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {section === 'mosquitto' && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>max_connections TCP:</label>
              <input type="number" value={maxConnTcp} onChange={(e) => setMaxConnTcp(e.target.value)} style={{ padding: '0.25rem', width: '70px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>max_connections WS:</label>
              <input type="number" value={maxConnWs} onChange={(e) => setMaxConnWs(e.target.value)} style={{ padding: '0.25rem', width: '70px' }} />
            </div>
          </>
        )}
        {section === 'autoban' && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Порог ошибок аут.:</label>
            <input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} style={{ padding: '0.25rem', width: '70px' }} />
          </div>
        )}
      </div>

      {/* TODO: Добавьте кнопку вызова generate */}
      <button onClick={generate}>Показать</button>

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
