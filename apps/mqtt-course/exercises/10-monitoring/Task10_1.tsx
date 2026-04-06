import { useState } from 'react'
import { useLanguage } from '../../src/hooks'

// ============================================
// Задание 10.1: $SYS топики брокера
// ============================================
// Цель: изучить встроенную телеметрию Mosquitto через $SYS-топики.
//
// TODO:
// 1. Нажмите "Загрузить метрики" и изучите таблицу
// 2. Найдите 3 топика для мониторинга производительности (нагрузка, dropped, heap)
// 3. На реальном роутере выполните:
//    mosquitto_sub -h localhost -u monitor -P pass -t '$SYS/#' -v -W 15
// 4. Настройте sys_interval в mosquitto.conf:
//    sys_interval 30
// 5. Добавьте пользователя monitor в ACL:
//    user monitor
//    topic read $SYS/#

interface SysMetric {
  topic: string
  description: string
  category: string
}

export function Task10_1() {
  const { t } = useLanguage()
  const [filterCategory, setFilterCategory] = useState('Все')
  const [metrics, setMetrics] = useState<SysMetric[]>([])
  const [loaded, setLoaded] = useState(false)

  const loadMetrics = () => {
    // TODO: Заполните массив метриками $SYS/broker/...
    // Нужно минимум 10 метрик в 4 категориях:
    // Клиенты, Сообщения, Ресурсы, Нагрузка
    //
    // Формат объекта:
    // { topic: '$SYS/broker/clients/connected', description: '...', category: 'Клиенты' }

    const data: SysMetric[] = [
      // TODO: добавьте метрики
    ]

    setMetrics(data)
    setLoaded(true)
  }

  // TODO: Получите уникальные категории из массива metrics
  const categories = ['Все']

  // TODO: Реализуйте фильтрацию по категории
  const filtered = metrics

  return (
    <div className="exercise-container">
      <h2>{t('task.10.1')}</h2>

      <button onClick={loadMetrics} style={{ marginBottom: '1rem' }}>
        Загрузить метрики
      </button>

      {loaded && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '0.5rem' }}>Категория:</label>
            {/* TODO: Добавьте select для фильтрации по категории */}
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

          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            Показано: {filtered.length} из {metrics.length}
          </p>

          {/* TODO: Выведите таблицу с топиками, описаниями и категориями */}
          <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {filtered.length === 0 && (
              <p style={{ color: '#888' }}>Заполните массив metrics в функции loadMetrics()</p>
            )}
            {filtered.map((m, i) => (
              <div key={i} style={{ padding: '0.25rem 0', borderBottom: '1px solid #333' }}>
                <span style={{ color: '#4ec9b0' }}>{m.topic}</span>
                {' — '}
                <span>{m.description}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
