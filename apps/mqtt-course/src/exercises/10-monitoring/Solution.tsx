import { useState } from 'react'

// ============================================
// Задание 10.1: $SYS топики брокера — Решение
// ============================================

interface SysMetric {
  topic: string
  description: string
  example: string
  category: string
}

const SYS_METRICS: SysMetric[] = [
  // Клиенты
  { topic: '$SYS/broker/clients/connected', description: 'Количество подключённых клиентов', example: '42', category: 'Клиенты' },
  { topic: '$SYS/broker/clients/total', description: 'Всего известных клиентов (включая отключённых)', example: '157', category: 'Клиенты' },
  { topic: '$SYS/broker/clients/maximum', description: 'Максимум подключений за всё время', example: '85', category: 'Клиенты' },
  { topic: '$SYS/broker/clients/disconnected', description: 'Клиенты с persistent session, сейчас offline', example: '12', category: 'Клиенты' },
  // Сообщения
  { topic: '$SYS/broker/messages/received', description: 'Сообщений получено с запуска', example: '12847', category: 'Сообщения' },
  { topic: '$SYS/broker/messages/sent', description: 'Сообщений отправлено с запуска', example: '15321', category: 'Сообщения' },
  { topic: '$SYS/broker/messages/publish/received', description: 'PUBLISH-пакетов получено', example: '8234', category: 'Сообщения' },
  { topic: '$SYS/broker/messages/publish/sent', description: 'PUBLISH-пакетов отправлено', example: '9876', category: 'Сообщения' },
  { topic: '$SYS/broker/messages/retained/count', description: 'Retained сообщений в памяти', example: '234', category: 'Сообщения' },
  // Трафик
  { topic: '$SYS/broker/bytes/received', description: 'Байт получено с запуска', example: '2048576', category: 'Трафик' },
  { topic: '$SYS/broker/bytes/sent', description: 'Байт отправлено с запуска', example: '1538048', category: 'Трафик' },
  { topic: '$SYS/broker/publish/bytes/received', description: 'Байт в PUBLISH-пакетах', example: '512000', category: 'Трафик' },
  // Подписки
  { topic: '$SYS/broker/subscriptions/count', description: 'Активных подписок', example: '89', category: 'Подписки' },
  // Брокер
  { topic: '$SYS/broker/uptime', description: 'Время работы брокера', example: '86400 seconds', category: 'Брокер' },
  { topic: '$SYS/broker/version', description: 'Версия Mosquitto', example: 'mosquitto version 2.0.18', category: 'Брокер' },
  { topic: '$SYS/broker/heap/current', description: 'Текущее использование heap (байт)', example: '524288', category: 'Брокер' },
  { topic: '$SYS/broker/heap/maximum', description: 'Максимальное использование heap (байт)', example: '1048576', category: 'Брокер' },
  // Интервальные метрики
  { topic: '$SYS/broker/load/messages/received/1min', description: 'Сообщений в минуту (1 мин)', example: '45.2', category: 'Нагрузка' },
  { topic: '$SYS/broker/load/messages/received/5min', description: 'Сообщений в минуту (5 мин)', example: '38.7', category: 'Нагрузка' },
  { topic: '$SYS/broker/load/connections/1min', description: 'Подключений в минуту (1 мин)', example: '2.1', category: 'Нагрузка' },
]

export function Task10_1_Solution() {
  const [filterCategory, setFilterCategory] = useState<string>('Все')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSubscribeCmd, setShowSubscribeCmd] = useState(false)

  const categories = ['Все', ...Array.from(new Set(SYS_METRICS.map((m) => m.category)))]

  const filtered = SYS_METRICS.filter((m) => {
    const matchCat = filterCategory === 'Все' || m.category === filterCategory
    const matchSearch =
      m.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="exercise-container">
      <h2>Задание 10.1: $SYS топики брокера</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Категория:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: '0.25rem' }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Поиск:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="топик или описание..."
            style={{ padding: '0.25rem', width: '200px' }}
          />
        </div>
      </div>

      <button onClick={() => setShowSubscribeCmd((v) => !v)} style={{ marginBottom: '1rem' }}>
        {showSubscribeCmd ? 'Скрыть' : 'Показать'} команду подписки
      </button>

      {showSubscribeCmd && (
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {`# Подписка на все $SYS топики:
mosquitto_sub -h localhost -u admin -P pass \\
  -t '$SYS/#' -v

# Только клиенты:
mosquitto_sub -h localhost -u admin -P pass \\
  -t '$SYS/broker/clients/#' -v

# С интервалом обновления (по умолчанию 10 сек):
# sys_interval 10  # в mosquitto.conf`}
        </pre>
      )}

      <p style={{ color: '#888', fontSize: '0.9rem' }}>
        Показано: {filtered.length} из {SYS_METRICS.length} метрик
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Категория</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Топик</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Описание</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Пример</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '0.4rem', color: '#888', whiteSpace: 'nowrap' }}>{m.category}</td>
                <td style={{ padding: '0.4rem', fontFamily: 'monospace', color: '#4ec9b0', whiteSpace: 'nowrap' }}>{m.topic}</td>
                <td style={{ padding: '0.4rem' }}>{m.description}</td>
                <td style={{ padding: '0.4rem', fontFamily: 'monospace', color: '#ce9178' }}>{m.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// Задание 10.2: Скрипты мониторинга — Решение
// ============================================

type ScriptType = 'basic' | 'alert' | 'periodic'

export function Task10_2_Solution() {
  const [scriptType, setScriptType] = useState<ScriptType>('basic')
  const [brokerHost, setBrokerHost] = useState('localhost')
  const [output, setOutput] = useState<string[]>([])

  const generateScript = () => {
    const lines: string[] = []

    if (scriptType === 'basic') {
      lines.push('#!/bin/sh')
      lines.push('# /usr/local/bin/mqtt-stats.sh')
      lines.push('# Базовый скрипт мониторинга Mosquitto')
      lines.push('')
      lines.push('BROKER="' + brokerHost + '"')
      lines.push('USER="monitor"')
      lines.push('PASS="monpass"')
      lines.push('TIMEOUT=5')
      lines.push('')
      lines.push('# Функция чтения одного $SYS топика')
      lines.push('get_metric() {')
      lines.push('  mosquitto_sub -h "$BROKER" -u "$USER" -P "$PASS" \\')
      lines.push('    -t "$1" -C 1 -W "$TIMEOUT" 2>/dev/null || echo "N/A"')
      lines.push('}')
      lines.push('')
      lines.push('echo "=== Mosquitto Status ===" ')
      lines.push('echo "Время: $(date)"')
      lines.push('echo ""')
      lines.push('')
      lines.push('CLIENTS=$(get_metric "$SYS/broker/clients/connected")')
      lines.push('MESSAGES=$(get_metric "$SYS/broker/messages/received")')
      lines.push('UPTIME=$(get_metric "$SYS/broker/uptime")')
      lines.push('HEAP=$(get_metric "$SYS/broker/heap/current")')
      lines.push('RETAINED=$(get_metric "$SYS/broker/messages/retained/count")')
      lines.push('')
      lines.push('echo "Клиентов подключено: $CLIENTS"')
      lines.push('echo "Сообщений получено:  $MESSAGES"')
      lines.push('echo "Retained сообщений:  $RETAINED"')
      lines.push('echo "Uptime:              $UPTIME"')
      lines.push('echo "Heap memory:         ${HEAP} bytes"')
      lines.push('')
      lines.push('# Сохранить в файл для последующего анализа:')
      lines.push('# chmod +x /usr/local/bin/mqtt-stats.sh')
      lines.push('# /usr/local/bin/mqtt-stats.sh >> /var/log/mqtt-stats.log')
    } else if (scriptType === 'alert') {
      lines.push('#!/bin/sh')
      lines.push('# /usr/local/bin/mqtt-alert.sh')
      lines.push('# Скрипт с алертами — отправляет MQTT-сообщение при превышении порогов')
      lines.push('')
      lines.push('BROKER="' + brokerHost + '"')
      lines.push('USER="monitor"')
      lines.push('PASS="monpass"')
      lines.push('')
      lines.push('MAX_CLIENTS=100      # Максимум клиентов')
      lines.push('MAX_HEAP=4194304     # 4 MB heap')
      lines.push('')
      lines.push('get_metric() {')
      lines.push('  mosquitto_sub -h "$BROKER" -u "$USER" -P "$PASS" -t "$1" -C 1 -W 5 2>/dev/null')
      lines.push('}')
      lines.push('')
      lines.push('send_alert() {')
      lines.push('  mosquitto_pub -h "$BROKER" -u "$USER" -P "$PASS" \\')
      lines.push("    -t 'system/mqtt/alert' -m \"$1\" -q 1 -r")
      lines.push('  logger -t mqtt-monitor "ALERT: $1"')
      lines.push('}')
      lines.push('')
      lines.push('CLIENTS=$(get_metric "$SYS/broker/clients/connected")')
      lines.push('HEAP=$(get_metric "$SYS/broker/heap/current")')
      lines.push('')
      lines.push('[ -n "$CLIENTS" ] && [ "$CLIENTS" -gt "$MAX_CLIENTS" ] && \\')
      lines.push('  send_alert "Превышен лимит клиентов: $CLIENTS > $MAX_CLIENTS"')
      lines.push('')
      lines.push('[ -n "$HEAP" ] && [ "$HEAP" -gt "$MAX_HEAP" ] && \\')
      lines.push('  send_alert "Превышен heap: ${HEAP} bytes > $MAX_HEAP"')
      lines.push('')
      lines.push('# Добавить в cron (каждые 5 минут):')
      lines.push('# */5 * * * * /usr/local/bin/mqtt-alert.sh')
    } else {
      lines.push('#!/bin/sh')
      lines.push('# /usr/local/bin/mqtt-periodic.sh')
      lines.push('# Периодический сборщик метрик в CSV-формат')
      lines.push('')
      lines.push('BROKER="' + brokerHost + '"')
      lines.push('USER="monitor"')
      lines.push('PASS="monpass"')
      lines.push('LOG="/var/log/mqtt-metrics.csv"')
      lines.push('')
      lines.push('# Создать заголовок CSV если файла нет:')
      lines.push('if [ ! -f "$LOG" ]; then')
      lines.push('  echo "timestamp,clients,messages_rx,messages_tx,heap,retained" > "$LOG"')
      lines.push('fi')
      lines.push('')
      lines.push('get_metric() {')
      lines.push('  mosquitto_sub -h "$BROKER" -u "$USER" -P "$PASS" -t "$1" -C 1 -W 3 2>/dev/null || echo "0"')
      lines.push('}')
      lines.push('')
      lines.push('TS=$(date +%s)')
      lines.push('CLIENTS=$(get_metric "$SYS/broker/clients/connected")')
      lines.push('MSG_RX=$(get_metric "$SYS/broker/messages/received")')
      lines.push('MSG_TX=$(get_metric "$SYS/broker/messages/sent")')
      lines.push('HEAP=$(get_metric "$SYS/broker/heap/current")')
      lines.push('RETAINED=$(get_metric "$SYS/broker/messages/retained/count")')
      lines.push('')
      lines.push('echo "$TS,$CLIENTS,$MSG_RX,$MSG_TX,$HEAP,$RETAINED" >> "$LOG"')
      lines.push('')
      lines.push('# Ротация: оставить только последние 1440 записей (24 часа при 1 мин/запись):')
      lines.push('tail -1441 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"')
      lines.push('')
      lines.push('# Cron (каждую минуту):')
      lines.push('# * * * * * /usr/local/bin/mqtt-periodic.sh')
    }

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.2: Скрипты мониторинга</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Тип скрипта:</label>
          <select
            value={scriptType}
            onChange={(e) => setScriptType(e.target.value as ScriptType)}
            style={{ padding: '0.25rem' }}
          >
            <option value="basic">Базовый (вывод статистики)</option>
            <option value="alert">Алерты (порог + MQTT уведомление)</option>
            <option value="periodic">Периодический (CSV-лог)</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Хост брокера:</label>
          <input
            type="text"
            value={brokerHost}
            onChange={(e) => setBrokerHost(e.target.value)}
            style={{ padding: '0.25rem', width: '130px' }}
          />
        </div>
      </div>

      <button onClick={generateScript}>Сгенерировать скрипт</button>

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
// Задание 10.3: Интеграция с collectd — Решение
// ============================================

export function Task10_3_Solution() {
  const [brokerHost, setBrokerHost] = useState('localhost')
  const [activeSection, setActiveSection] = useState<'install' | 'script' | 'config'>('install')
  const [output, setOutput] = useState<string[]>([])

  const generate = () => {
    const lines: string[] = []

    if (activeSection === 'install') {
      lines.push('# Установка collectd и плагина exec на OpenWRT:')
      lines.push('opkg update')
      lines.push('opkg install collectd')
      lines.push('opkg install collectd-mod-exec')
      lines.push('opkg install collectd-mod-rrdtool  # для хранения данных')
      lines.push('opkg install collectd-mod-network   # для отправки на сервер')
      lines.push('')
      lines.push('# Включить и запустить:')
      lines.push('/etc/init.d/collectd enable')
      lines.push('/etc/init.d/collectd start')
      lines.push('')
      lines.push('# Статус:')
      lines.push('/etc/init.d/collectd status')
    } else if (activeSection === 'script') {
      lines.push('#!/bin/sh')
      lines.push('# /usr/local/bin/mqtt-collectd.sh')
      lines.push('# Скрипт для collectd-mod-exec')
      lines.push('# Формат вывода: PUTVAL "hostname/plugin-instance/type-instance" N:value')
      lines.push('')
      lines.push('BROKER="' + brokerHost + '"')
      lines.push('USER="monitor"')
      lines.push('PASS="monpass"')
      lines.push('HOST=$(hostname)')
      lines.push('')
      lines.push('get_metric() {')
      lines.push('  mosquitto_sub -h "$BROKER" -u "$USER" -P "$PASS" -t "$1" -C 1 -W 3 2>/dev/null || echo "0"')
      lines.push('}')
      lines.push('')
      lines.push('CLIENTS=$(get_metric "$SYS/broker/clients/connected")')
      lines.push('MSG_RX=$(get_metric "$SYS/broker/messages/received")')
      lines.push('MSG_TX=$(get_metric "$SYS/broker/messages/sent")')
      lines.push('HEAP=$(get_metric "$SYS/broker/heap/current")')
      lines.push('RETAINED=$(get_metric "$SYS/broker/messages/retained/count")')
      lines.push('SUBSCRIPTIONS=$(get_metric "$SYS/broker/subscriptions/count")')
      lines.push('')
      lines.push('# Вывод в формате collectd exec plugin:')
      lines.push('echo "PUTVAL \\"$HOST/mqtt-clients/gauge\\" N:$CLIENTS"')
      lines.push('echo "PUTVAL \\"$HOST/mqtt-messages/derive-rx\\" N:$MSG_RX"')
      lines.push('echo "PUTVAL \\"$HOST/mqtt-messages/derive-tx\\" N:$MSG_TX"')
      lines.push('echo "PUTVAL \\"$HOST/mqtt-memory/bytes\\" N:$HEAP"')
      lines.push('echo "PUTVAL \\"$HOST/mqtt-retained/gauge\\" N:$RETAINED"')
      lines.push('echo "PUTVAL \\"$HOST/mqtt-subscriptions/gauge\\" N:$SUBSCRIPTIONS"')
    } else {
      lines.push('# /etc/collectd/collectd.conf (или /etc/collectd.conf)')
      lines.push('')
      lines.push('# Базовые настройки:')
      lines.push('Hostname "openwrt-router"')
      lines.push('Interval 30')
      lines.push('')
      lines.push('# Плагин Exec — запускает внешний скрипт:')
      lines.push('<Plugin exec>')
      lines.push('  Exec "nobody" "/usr/local/bin/mqtt-collectd.sh"')
      lines.push('</Plugin>')
      lines.push('')
      lines.push('# Хранение в RRD-файлах:')
      lines.push('<Plugin rrdtool>')
      lines.push('  DataDir "/var/lib/collectd/rrd"')
      lines.push('  CacheTimeout 120')
      lines.push('  WritesPerSecond 50')
      lines.push('</Plugin>')
      lines.push('')
      lines.push('# Отправка метрик на внешний сервер:')
      lines.push('<Plugin network>')
      lines.push('  Server "monitoring.example.com" "25826"')
      lines.push('</Plugin>')
      lines.push('')
      lines.push('# Сделать скрипт исполняемым:')
      lines.push('chmod +x /usr/local/bin/mqtt-collectd.sh')
      lines.push('/etc/init.d/collectd restart')
    }

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.3: Интеграция с collectd</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['install', 'script', 'config'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            style={{ fontWeight: activeSection === s ? 'bold' : 'normal' }}
          >
            {s === 'install' ? 'Установка' : s === 'script' ? 'Скрипт exec' : 'Конфиг collectd'}
          </button>
        ))}
      </div>

      {activeSection !== 'install' && (
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
