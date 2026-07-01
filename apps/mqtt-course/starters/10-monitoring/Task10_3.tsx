import { useState } from 'react'
import { useLanguage } from '../../src/hooks'

// ============================================
// Задание 10.3: Интеграция с collectd
// ============================================
// Цель: настроить collectd-mod-exec для автоматического сбора MQTT-метрик.
//
// TODO:
// 1. Изучите формат PUTVAL: PUTVAL "hostname/plugin/type" N:value
// 2. Реализуйте генерацию скрипта для collectd exec
// 3. Скрипт должен выводить PUTVAL для 5+ метрик
// 4. Реализуйте генерацию collectd.conf с Plugin exec и Plugin rrdtool
// 5. На роутере:
//    opkg install collectd collectd-mod-exec
//    chmod +x /usr/local/bin/mqtt-collectd.sh
//    /etc/init.d/collectd restart
//    # Через минуту проверить: ls /tmp/rrd/$(hostname)/

type Section = 'install' | 'script' | 'config'

export function Task10_3() {
  const { t } = useLanguage()
  const [section, setSection] = useState<Section>('install')
  const [brokerHost, setBrokerHost] = useState('localhost')
  const [output, setOutput] = useState<string[]>([])

  const generate = () => {
    const lines: string[] = []

    if (section === 'install') {
      // TODO: Добавьте команды установки collectd и collectd-mod-exec
      // opkg update && opkg install collectd collectd-mod-exec collectd-mod-rrdtool
      lines.push('# TODO: добавьте команды opkg install')

    } else if (section === 'script') {
      lines.push('#!/bin/sh')
      lines.push(`# BROKER="${brokerHost}"`)
      lines.push('')
      // TODO: Реализуйте скрипт в формате collectd exec:
      // 1. Функция get() с mosquitto_sub -C 1 -W 3
      // 2. Получить 5+ метрик: CLIENTS, MSG_RX, MSG_TX, HEAP, RETAINED, DROPPED, SUBS
      // 3. Вывести PUTVAL строки:
      //    echo "PUTVAL \"$HOST/mqtt-broker/gauge-clients\" N:$CLIENTS"
      //    echo "PUTVAL \"$HOST/mqtt-broker/derive-messages_rx\" N:$MSG_RX"
      //    echo "PUTVAL \"$HOST/mqtt-broker/bytes-heap\" N:$HEAP"
      //    ... и т.д.
      lines.push('# TODO: реализуйте функцию get()')
      lines.push('# TODO: получите метрики и выведите PUTVAL строки')

    } else {
      // TODO: Реализуйте конфиг collectd.conf:
      // Hostname, Interval 30
      // <Plugin exec>
      //   Exec "nobody" "/usr/local/bin/mqtt-collectd.sh"
      // </Plugin>
      // <Plugin rrdtool>
      //   DataDir "/tmp/rrd"
      // </Plugin>
      lines.push('# TODO: добавьте конфиг collectd.conf')
    }

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.10.3')}</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['install', 'script', 'config'] as Section[]).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            style={{ fontWeight: section === s ? 'bold' : 'normal' }}
          >
            {s === 'install' ? 'Установка' : s === 'script' ? 'Скрипт exec' : 'Конфиг collectd'}
          </button>
        ))}
      </div>

      {section !== 'install' && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Хост брокера:</label>
          <input
            type="text"
            value={brokerHost}
            onChange={(e) => setBrokerHost(e.target.value)}
            style={{ padding: '0.25rem', width: '130px' }}
          />
        </div>
      )}

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
