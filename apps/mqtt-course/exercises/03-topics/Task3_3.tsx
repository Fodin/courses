import { useState } from 'react'

// ============================================
// Задание 3.3: Системные топики $SYS
// ============================================

// TODO: Опишите интерфейс для записи в справочнике $SYS топиков
// Каждая запись содержит: топик, пример значения, описание, категорию
interface SysTopicEntry {
  topic: string
  // TODO: добавьте поля
}

// TODO: Заполните массив $SYS топиков Mosquitto 2.x
// Нужно минимум по 2-3 топика в каждой категории:
// - Брокер: version, uptime, timestamp
// - Клиенты: connected, disconnected, maximum, total
// - Сообщения: sent, received, dropped, stored
// - Трафик: bytes/sent, bytes/received
// - Нагрузка: load/messages/sent/1min, load/messages/sent/5min
// - Подписки: subscriptions/count
const sysTopics: SysTopicEntry[] = [
  // TODO: добавьте топики
  {
    topic: '$SYS/broker/version',
    // TODO: добавьте остальные поля
  } as SysTopicEntry,
]

// TODO: Извлеките уникальные категории из массива sysTopics
const categories: string[] = []

export function Task3_3() {
  const [activeCategory, setActiveCategory] = useState<string>('все')
  const [search, setSearch] = useState('')

  // TODO: Отфильтруйте sysTopics по активной категории и строке поиска
  // Поиск должен работать по полю topic и description
  const filtered = sysTopics.filter((_entry) => {
    // TODO: реализуйте фильтрацию
    return true
  })

  return (
    <div className="exercise-container">
      <h2>Задание 3.3: Системные топики $SYS</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Справочник $SYS топиков Mosquitto 2.x для мониторинга брокера.
      </p>

      {/* TODO: Рендерите кнопки-фильтры по категориям ("все" + categories) */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {['все', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '4px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: 20,
              background: activeCategory === cat ? '#3b82f6' : 'white',
              color: activeCategory === cat ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* TODO: Поле поиска — обновляет переменную search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск по топику или описанию..."
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          fontSize: 13,
          marginBottom: 12,
          boxSizing: 'border-box',
        }}
      />

      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
        Показано {filtered.length} из {sysTopics.length} топиков
      </div>

      {/* TODO: Рендерите таблицу/список filtered топиков
           Каждая строка показывает: топик (code), пример значения, описание
           Добавьте копирование команды mosquitto_sub при клике */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map((entry) => (
          <div
            key={entry.topic}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
            }}
          >
            <code style={{ fontSize: 12 }}>{entry.topic}</code>
            {/* TODO: покажите остальные поля записи */}
          </div>
        ))}
      </div>

      {/* TODO: Добавьте подсказку об одинарных кавычках в shell */}
    </div>
  )
}
