import { useState } from 'react'

// ============================================
// Задание 7.1: Persistence database в Mosquitto
// ============================================

// TODO: Опишите интерфейс PersistenceParam с полями:
//   key (string), value (string), description (string), type ('bool' | 'path' | 'number')

// TODO: Создайте массив persistenceParams с 4 параметрами:
//   1. persistence = true (bool) — включает запись на диск
//   2. persistence_location = /var/lib/mosquitto/ (path) — директория для БД
//   3. autosave_interval = 300 (number) — интервал автосохранения в секундах
//   4. autosave_on_changes = false (bool) — сохранять при каждом изменении
//   Для каждого напишите понятное description.

// TODO: Создайте массив savedItems с перечислением того, что сохраняется:
//   - Retained-сообщения (✅)
//   - Подписки QoS 1/2 (✅)
//   - Очереди QoS 1/2 (✅)
//   - Незавершённые транзакции QoS 2 (✅)
//   - QoS 0 сообщения (❌)
//   Поля: item (string), description (string), retained (boolean)

export function Task7_1() {
  // TODO: Создайте состояние selectedParam (string | null) — выбранный параметр
  const [selectedParam, setSelectedParam] = useState<string | null>(null)

  // TODO: Создайте состояние autosave (number) — значение autosave_interval, по умолчанию 300
  const [autosave, setAutosave] = useState(300)

  // TODO: Вычислите configText — строки конфига, обновляемые при изменении autosave:
  //   persistence true
  //   persistence_location /var/lib/mosquitto/
  //   autosave_interval {autosave}
  //   autosave_on_changes false

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Persistence Database в Mosquitto</h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Левая часть: параметры */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h3 style={{ margin: '0 0 0.75rem' }}>Параметры</h3>

          {/* TODO: Отобразите список persistenceParams.
              Каждый параметр — кликабельная карточка:
              - Показывает key и текущее value (для autosave_interval — значение из состояния)
              - При клике раскрывает description
              - Активная карточка имеет синюю рамку и фон */}
          <div style={{ color: '#999', fontStyle: 'italic', marginBottom: '1rem' }}>
            Параметры появятся здесь...
          </div>

          {/* TODO: Добавьте слайдер для autosave_interval (0–3600, шаг 60).
              Показывайте текущее значение в секундах и минутах.
              Подписи: "0 (только при завершении)" и "3600с (1 час)" */}
          <div>
            <label style={{ fontSize: '0.88rem' }}>
              autosave_interval: <strong>{autosave}с</strong>
            </label>
            <input
              type="range"
              min={0}
              max={3600}
              step={60}
              value={autosave}
              onChange={(e) => setAutosave(Number(e.target.value))}
              style={{ width: '100%', marginTop: '0.25rem' }}
            />
          </div>
        </div>

        {/* Правая часть: превью конфига + список сохраняемого */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>mosquitto.conf</h3>

          {/* TODO: Отобразите configText в <pre> с тёмным фоном (#1e1e1e) */}
          <pre
            style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.83rem',
              lineHeight: 1.7,
              margin: '0 0 1rem',
            }}
          >
            # Конфиг появится здесь...
          </pre>

          <h3 style={{ margin: '0 0 0.5rem' }}>Что сохраняется в mosquitto.db</h3>

          {/* TODO: Отобразите savedItems как список карточек.
              ✅ зелёный фон (#e8f5e9) для retained=true
              ❌ красный фон (#ffebee) для retained=false
              Показывайте item (жирный) и description */}
          <div style={{ color: '#999', fontStyle: 'italic' }}>
            Список сохраняемых данных появится здесь...
          </div>
        </div>
      </div>
    </div>
  )
}
