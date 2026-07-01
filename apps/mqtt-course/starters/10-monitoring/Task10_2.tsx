import { useState } from 'react'
import { useLanguage } from '../../src/hooks'

// ============================================
// Задание 10.2: Скрипты мониторинга
// ============================================
// Цель: создать shell-скрипт сбора метрик с алертами для OpenWRT.
//
// TODO:
// 1. Выберите тип скрипта и заполните параметры
// 2. Реализуйте генерацию скрипта в generateScript()
// 3. Скрипт должен:
//    - Иметь функцию get_metric() с флагами -C 1 -W 5
//    - Выводить 6 метрик: clients, msg_rx, msg_tx, heap, retained, dropped
//    - Содержать логику алерта (порог + mosquitto_pub)
//    - Писать CSV в /tmp/ (не во flash)
// 4. На роутере: chmod +x скрипт и добавить в cron

type ScriptType = 'basic' | 'alert' | 'csv'

export function Task10_2() {
  const { t } = useLanguage()
  const [scriptType, setScriptType] = useState<ScriptType>('basic')
  const [brokerHost, setBrokerHost] = useState('localhost')
  const [maxClients, setMaxClients] = useState('50')
  const [output, setOutput] = useState<string[]>([])

  const generateScript = () => {
    const lines: string[] = []

    lines.push('#!/bin/sh')
    lines.push('# Автор: студент')
    lines.push('')

    if (scriptType === 'basic') {
      // TODO: Реализуйте базовый скрипт:
      // 1. Переменные BROKER, USER, PASS
      // 2. Функция get_metric() с -C 1 -W 5
      // 3. Вызовы get_metric для 6 метрик
      // 4. echo с результатами
      lines.push(`BROKER="${brokerHost}"`)
      lines.push('# TODO: добавьте USER, PASS')
      lines.push('')
      lines.push('# TODO: реализуйте функцию get_metric()')
      lines.push('')
      lines.push('# TODO: получите 6 метрик и выведите их')

    } else if (scriptType === 'alert') {
      // TODO: Реализуйте скрипт с алертами:
      // 1. Получить clients через get_metric()
      // 2. Сравнить с MAX_CLIENTS
      // 3. Если превышен — mosquitto_pub в system/mqtt/alert
      // 4. Логировать через logger -t mqtt-monitor "..."
      lines.push(`BROKER="${brokerHost}"`)
      lines.push(`MAX_CLIENTS=${maxClients}`)
      lines.push('')
      lines.push('# TODO: реализуйте get_metric()')
      lines.push('')
      lines.push('# TODO: получите CLIENTS и сравните с MAX_CLIENTS')
      lines.push('# Используйте: [ "$CLIENTS" -gt "$MAX_CLIENTS" ] && ...')

    } else {
      // TODO: Реализуйте CSV-логирование:
      // 1. LOG="/tmp/mqtt-metrics.csv"
      // 2. Создать заголовок если файла нет
      // 3. Записать строку: timestamp,clients,msg_rx,...
      // 4. Ротация: tail -1001 "$LOG" > "$LOG.tmp" && mv
      lines.push('LOG="/tmp/mqtt-metrics.csv"')
      lines.push('')
      lines.push('# TODO: создать заголовок CSV если файла нет')
      lines.push('# TODO: собрать метрики и записать строку в CSV')
      lines.push('# TODO: реализовать ротацию')
    }

    setOutput(lines)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.10.2')}</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem' }}>Тип скрипта:</label>
          <select
            value={scriptType}
            onChange={(e) => setScriptType(e.target.value as ScriptType)}
            style={{ padding: '0.25rem' }}
          >
            <option value="basic">Базовый вывод статистики</option>
            <option value="alert">Алерты при превышении порога</option>
            <option value="csv">CSV-логирование</option>
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
        {scriptType === 'alert' && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Порог клиентов:</label>
            <input
              type="number"
              value={maxClients}
              onChange={(e) => setMaxClients(e.target.value)}
              style={{ padding: '0.25rem', width: '70px' }}
            />
          </div>
        )}
      </div>

      {/* TODO: Добавьте кнопку вызова generateScript */}
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
