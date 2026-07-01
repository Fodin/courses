import { useState } from 'react'

// ============================================
// Задание 8.3: Фильтрация топиков в мосте
// ============================================

// TODO: Опишите интерфейс TopicRule с полями:
//   pattern (string), direction ('in' | 'out' | 'both'),
//   qos (0 | 1 | 2), localPrefix (string), remotePrefix (string),
//   description (string), example (string)

// TODO: Создайте объект topicDirections с тремя ключами (out, in, both):
//   Каждый: { label: string, color: string, desc: string }
//   out: label='out →', color='#1976d2'
//   in: label='← in', color='#388e3c'
//   both: label='⇄ both', color='#f57c00'

// TODO: Создайте массив topicRules с 4 правилами:
//   1. pattern='sensors/#', direction='out', qos=0, localPrefix='', remotePrefix='home/'
//      description: данные датчиков пересылаются в облако с добавлением "home/"
//      example: sensors/temp → home/sensors/temp
//
//   2. pattern='commands/#', direction='in', qos=1, без префиксов
//      description: команды из облака получаются локально
//      example: commands/light → commands/light (QoS 1 гарантирует доставку)
//
//   3. pattern='status', direction='both', qos=2, localPrefix='local/', remotePrefix='remote/'
//      description: двунаправленная синхронизация статуса
//      example: local/status ⇄ remote/status
//
//   4. pattern='alerts/#', direction='out', qos=2, без префиксов
//      description: критические оповещения с exactly-once доставкой
//      example: alerts/fire → alerts/fire (QoS 2)

export function Task8_3() {
  // TODO: Создайте состояние selectedRule (number | null) — индекс раскрытого правила
  const [selectedRule, setSelectedRule] = useState<number | null>(null)

  // TODO: Создайте состояние customPattern (string) — паттерн в конструкторе, 'sensors/#'
  const [customPattern, setCustomPattern] = useState('sensors/#')

  // TODO: Создайте состояние customDir ('in' | 'out' | 'both') — направление в конструкторе, 'out'
  const [customDir, setCustomDir] = useState<'in' | 'out' | 'both'>('out')

  // TODO: Создайте состояние customQos (0 | 1 | 2) — QoS в конструкторе, 0
  const [customQos, setCustomQos] = useState<0 | 1 | 2>(0)

  // TODO: Вычислите configLine(rule) — строку конфига из полей TopicRule:
  //   "topic {pattern} {direction} {qos}" + (localPrefix ? " " + localPrefix : "") + ...
  //   Функция используется для каждого правила в списке

  // TODO: Вычислите customLine — строка конфига для конструктора:
  //   "topic {customPattern} {customDir} {customQos}"

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Фильтрация топиков в MQTT Bridge</h2>

      {/* TODO: Добавьте блок с форматом строки topic (фиолетовый фон #f3e5f5):
          "Формат: topic <паттерн> <направление> <QoS> [локальный_префикс] [удалённый_префикс]"
          Пример в <code> тёмном блоке */}

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Левая часть: примеры правил */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h3 style={{ margin: '0 0 0.75rem' }}>Примеры правил (кликните для деталей)</h3>

          {/* TODO: Отобразите список topicRules.
              Каждое правило — кликабельная карточка:
              - Паттерн топика (code)
              - Бейджи: направление (цветной) и QoS (тёмно-серый)
              - Строка конфига (configLine)
              - При клике раскрывается description и example
              - Рамка соответствует цвету направления */}
          <div style={{ color: '#999', fontStyle: 'italic' }}>
            Правила появятся здесь...
          </div>
        </div>

        {/* Правая часть: конструктор правила */}
        <div style={{ flex: '1', minWidth: '240px' }}>
          <h3 style={{ margin: '0 0 0.75rem' }}>Конструктор правила</h3>

          {/* TODO: Добавьте три поля:
              1. Текстовый input для customPattern
              2. <select> для customDir (out / in / both) с описаниями
              3. <select> для customQos (0 / 1 / 2) с пояснениями */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem' }}>
              Паттерн:
              <input
                value={customPattern}
                onChange={(e) => setCustomPattern(e.target.value)}
                style={{ display: 'block', width: '100%', padding: '0.35rem 0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.2rem', fontSize: '0.87rem', boxSizing: 'border-box' }}
              />
            </label>
            <label style={{ fontSize: '0.85rem' }}>
              Направление:
              <select
                value={customDir}
                onChange={(e) => setCustomDir(e.target.value as 'in' | 'out' | 'both')}
                style={{ display: 'block', width: '100%', padding: '0.35rem 0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.2rem', fontSize: '0.87rem' }}
              >
                <option value="out">out → (отправлять в облако)</option>
                <option value="in">← in (получать из облака)</option>
                <option value="both">⇄ both (в обе стороны)</option>
              </select>
            </label>
            <label style={{ fontSize: '0.85rem' }}>
              QoS:
              <select
                value={customQos}
                onChange={(e) => setCustomQos(Number(e.target.value) as 0 | 1 | 2)}
                style={{ display: 'block', width: '100%', padding: '0.35rem 0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.2rem', fontSize: '0.87rem' }}
              >
                <option value={0}>QoS 0 — без гарантий</option>
                <option value={1}>QoS 1 — хотя бы один раз</option>
                <option value={2}>QoS 2 — ровно один раз</option>
              </select>
            </label>
          </div>

          {/* TODO: Отобразите customLine в зелёном <pre> на тёмном фоне */}
          <pre
            style={{
              background: '#1e1e1e',
              color: '#a5d6a7',
              padding: '0.75rem',
              borderRadius: '6px',
              fontSize: '0.87rem',
              margin: '0 0 0.75rem',
            }}
          >
            # Строка конфига появится здесь...
          </pre>

          {/* TODO: Добавьте информационный блок (оранжевый #fff3e0):
              - Текущее направление customDir из topicDirections
              - Его desc
              - Если customDir === 'both': предупреждение о петлях */}
        </div>
      </div>
    </div>
  )
}
