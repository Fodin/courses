import { useState } from 'react'

// ============================================
// Задание 3.2: Wildcards: + и #
// ============================================

// TODO: Реализуйте функцию проверки соответствия MQTT wildcard-паттерна топику
// Правила:
// - Топик и паттерн разбиваются на сегменты по символу /
// - + заменяет ровно один сегмент
// - # в конце паттерна совпадает с любым количеством оставшихся сегментов
// - Если сегменты совпали и длины равны — совпадение найдено
function matchesMqttWildcard(pattern: string, topic: string): boolean {
  // TODO: реализуйте алгоритм сопоставления
  void pattern
  void topic
  return false
}

// Тестовые топики для проверки паттернов
const testTopics = [
  'home/living_room/temperature',
  'home/kitchen/temperature',
  'home/bedroom/humidity',
  'home/living_room/light/state',
  'home/kitchen/light/brightness',
  'home/temperature',
  'office/room1/temperature',
  'home/living_room/light/rgb/r',
]

// TODO: Добавьте минимум 4 предустановленных паттерна для быстрого выбора
// Примеры: home/+/temperature, home/#, home/+/light/#, #
const presetPatterns = [
  { pattern: 'home/+/temperature', description: 'Температура в любой комнате' },
  // TODO: добавьте ещё паттерны
]

export function Task3_2() {
  const [pattern, setPattern] = useState('home/+/temperature')
  const [customPattern, setCustomPattern] = useState('')

  const activePattern = customPattern || pattern

  // TODO: вычислите results — массив { topic, matches } для каждого топика
  // Используйте функцию matchesMqttWildcard
  const results = testTopics.map((topic) => ({
    topic,
    // TODO: вызовите matchesMqttWildcard(activePattern, topic)
    matches: false,
  }))

  const matchCount = results.filter((r) => r.matches).length

  return (
    <div className="exercise-container">
      <h2>Задание 3.2: Wildcards: + и #</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Интерактивная демонстрация wildcard-паттернов MQTT.
        Выберите паттерн и посмотрите, какие топики совпадают.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h3 style={{ marginBottom: 12, fontSize: 14, color: '#6b7280' }}>Паттерны</h3>

          {/* TODO: отрендерите кнопки для presetPatterns */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
            {presetPatterns.map(({ pattern: p, description }) => (
              <button
                key={p}
                onClick={() => { setPattern(p); setCustomPattern('') }}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  background: pattern === p && !customPattern ? '#3b82f6' : 'white',
                  color: pattern === p && !customPattern ? 'white' : '#374151',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontFamily: 'monospace' }}>{p}</div>
                <div style={{ fontSize: 11 }}>{description}</div>
              </button>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Свой паттерн:</div>
            <input
              value={customPattern}
              onChange={(e) => setCustomPattern(e.target.value)}
              placeholder="home/+/light/#"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                fontFamily: 'monospace',
                fontSize: 13,
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: 8, fontSize: 14, color: '#6b7280' }}>
            Результаты ({matchCount} совпадений):
          </h3>

          {/* TODO: отрендерите список результатов
               Каждая строка показывает: ✅ или ❌ и имя топика
               Зелёный фон для совпадений, серый для несовпадений */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {results.map(({ topic, matches }) => (
              <div key={topic} style={{
                padding: '6px 10px',
                borderRadius: 6,
                background: matches ? '#f0fdf4' : '#fafafa',
                fontFamily: 'monospace',
                fontSize: 13,
              }}>
                {/* TODO: покажите ✅ или ❌ */}
                {topic}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
