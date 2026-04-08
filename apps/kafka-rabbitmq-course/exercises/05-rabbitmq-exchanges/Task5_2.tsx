import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 5.2: Fanout Exchange
// ============================================
//
// Цель: реализовать симулятор Fanout Exchange.
// Fanout Exchange игнорирует routing key и рассылает сообщение
// во ВСЕ привязанные (active: true) очереди.
//
// Ключевые особенности:
// - Routing key принимается, но полностью игнорируется при маршрутизации
// - Можно динамически добавлять и удалять привязки (очереди)
// - Можно временно отключить привязку (unbind) не удаляя очередь

// TODO: Определи интерфейс FanoutQueue:
//   id: string
//   name: string
//   color: string
//   bgColor: string
//   messages: string[]
//   active: boolean   ← если false, очередь не получает сообщения
// interface FanoutQueue { ... }

// TODO: Объяви массив queueColors из 3 объектов { color, bgColor }
// для циклического назначения цветов новым очередям:
//   { color: '#E65100', bgColor: '#FFF3E0' }
//   { color: '#00838F', bgColor: '#E0F7FA' }
//   { color: '#AD1457', bgColor: '#FCE4EC' }
// const queueColors = [...]

export function Task5_2() {
  const { t } = useLanguage()

  // TODO: Объяви состояния:
  //   queues        — массив FanoutQueue (3 начальных очереди)
  //   animating     — boolean (анимация отправки)
  //   routingKey    — string (ввод пользователя, игнорируется при маршрутизации)
  //   messageCount  — number
  //   log           — string[] (лог рассылок)
  //   newQueueName  — string (поле ввода имени новой очереди)
  const [queues, setQueues] = useState<string[]>([])
  const [animating, setAnimating] = useState(false)
  const [routingKey, setRoutingKey] = useState('user.registered')
  const [messageCount, setMessageCount] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const [newQueueName, setNewQueueName] = useState('')

  // TODO: Инициализируй начальные очереди в useState выше:
  //   { id: 'q1', name: 'email-notifications', color: '#1565C0', bgColor: '#E3F2FD', messages: [], active: true }
  //   { id: 'q2', name: 'push-notifications',  color: '#2E7D32', bgColor: '#E8F5E9', messages: [], active: true }
  //   { id: 'q3', name: 'analytics-events',    color: '#6A1B9A', bgColor: '#F3E5F5', messages: [], active: true }

  // TODO: Реализуй функцию publish():
  //   1. Найди activeQueues = queues.filter(q => q.active)
  //   2. Установи animating = true
  //   3. Через 600 мс (setTimeout):
  //      - Добавь строку `[ts] msg#N routing_key="${routingKey}"` в messages каждой активной очереди
  //      - Добавь строку лога: `[ts] FANOUT msg#N → K очередей: name1, name2, ...`
  //      - Сбрось animating = false
  const publish = () => {
    // TODO: реализовать
    console.log('TODO: publish()')
  }

  // TODO: Реализуй функцию toggleQueue(id: string):
  //   Переключает active у очереди с данным id
  const toggleQueue = (_id: string) => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию addQueue():
  //   1. Проверь, что newQueueName.trim() не пустой
  //   2. Определи цвет: queueColors[queues.length % queueColors.length]
  //   3. Добавь новую очередь с id = `q${Date.now()}`
  //   4. Очисти newQueueName
  const addQueue = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию removeQueue(id: string):
  //   Удаляет очередь из массива
  const removeQueue = (_id: string) => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию clearAll():
  //   Сбрасывает messages во всех очередях и очищает log
  const clearAll = () => {
    // TODO: реализовать
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Fanout Exchange рассылает каждое сообщение во ВСЕ привязанные очереди. Routing key полностью игнорируется.
      </p>

      {/* TODO: Схема (Producer → Fanout Exchange → список очередей)
          - Exchange подсвечивается при animating
          - Каждая очередь с opacity 0.35 если active: false
          - Для каждой очереди: кнопки "unbind"/"bind" и "✕" (удалить)
          - Анимированная стрелка → при animating && q.active
          - Показывать последнее сообщение и счётчик msg
      */}
      <div
        style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ color: '#999', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
          TODO: Отобразить схему Fanout Exchange
          <br />
          <small>Producer → Exchange → [{queues.length} очередей]</small>
        </div>
      </div>

      {/* TODO: Панель управления (2 колонки):
          Левая:
          - Поле routing key с подписью "(игнорируется Fanout)"
          - Кнопки "Broadcast" и "Очистить"
          - Поле + кнопка "+ Bind" для добавления новой очереди

          Правая:
          - Лог рассылок (тёмный терминал) или заглушка "Нажмите Broadcast"
      */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Управление</h3>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '4px' }}>
              Routing key (игнорируется Fanout):
            </label>
            <input
              value={routingKey}
              onChange={e => setRoutingKey(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={publish}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#E65100',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Broadcast
            </button>
            <button
              onClick={clearAll}
              style={{
                padding: '0.75rem 1rem',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Очистить
            </button>
          </div>
          {/* TODO: поле ввода newQueueName + кнопка addQueue */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              value={newQueueName}
              onChange={e => setNewQueueName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addQueue()}
              placeholder="новая очередь..."
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
              }}
            />
            <button
              onClick={addQueue}
              style={{
                padding: '0.5rem 0.75rem',
                background: '#2E7D32',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              + Bind
            </button>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Лог рассылок</h3>
          {/* TODO: если log не пустой — тёмный терминал с записями, иначе — заглушка */}
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#999',
              border: '2px dashed #ddd',
              borderRadius: '8px',
              fontSize: '0.85rem',
            }}
          >
            Нажмите "Broadcast" для отправки
          </div>
        </div>
      </div>

      {/* TODO: Блок сценариев использования Fanout Exchange (4 пункта с иконками):
          📧 Уведомления пользователям (email + push + SMS)
          📊 Рассылка событий в несколько аналитических систем
          🔄 Cache invalidation во всех нодах кластера
          📡 Трансляция live-данных нескольким потребителям
      */}
      <div
        style={{
          padding: '1rem',
          background: '#E8F5E9',
          borderRadius: '8px',
          fontSize: '0.85rem',
          border: '1px solid #A5D6A7',
        }}
      >
        <strong>Сценарии использования Fanout Exchange:</strong>
        <div style={{ color: '#999', marginTop: '0.5rem' }}>
          TODO: добавить 4 сценария использования с иконками
        </div>
      </div>
    </div>
  )
}
