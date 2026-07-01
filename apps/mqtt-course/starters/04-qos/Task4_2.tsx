import { useState } from 'react'

// ============================================
// Задание 4.2: Retained Messages
// ============================================

interface RetainedMessage {
  topic: string
  payload: string
  timestamp: string
}

// TODO: Реализуйте функцию сопоставления MQTT wildcard с топиком
// Используйте алгоритм из задания 3.2
function matchesMqttWildcard(pattern: string, topic: string): boolean {
  // TODO: реализуйте
  void pattern
  void topic
  return false
}

export function Task4_2() {
  // Начальное retained хранилище брокера
  const [retainedStore, setRetainedStore] = useState<Map<string, RetainedMessage>>(new Map([
    ['home/temperature', { topic: 'home/temperature', payload: '22.5', timestamp: '10:00:00' }],
    ['home/humidity', { topic: 'home/humidity', payload: '65', timestamp: '10:00:05' }],
  ]))

  const [newTopic, setNewTopic] = useState('home/light/state')
  const [newPayload, setNewPayload] = useState('ON')
  const [isRetained, setIsRetained] = useState(true)
  const [log, setLog] = useState<string[]>(['> Брокер запущен. 2 retained сообщения в хранилище.'])
  const [subscribedTopic, setSubscribedTopic] = useState('home/#')
  const [newSubscriberReceived, setNewSubscriberReceived] = useState<RetainedMessage[]>([])

  const now = () => new Date().toLocaleTimeString('ru')

  // TODO: Реализуйте функцию publish
  // Логика:
  // - Если isRetained И payload пуст → удалить из retainedStore
  // - Если isRetained И payload не пуст → добавить/обновить в retainedStore
  // - Если не isRetained → только добавить в лог (не сохранять)
  // В любом случае добавьте запись в log
  const publish = () => {
    // TODO: реализуйте
    void setRetainedStore
    void setLog
    void setNewSubscriberReceived
    console.log('publish called:', newTopic, newPayload, isRetained)
  }

  // TODO: Реализуйте функцию симуляции нового подписчика
  // Логика:
  // 1. Пройти по retainedStore и найти сообщения, совпадающие с subscribedTopic (через matchesMqttWildcard)
  // 2. Записать совпадения в newSubscriberReceived
  // 3. Добавить запись в лог о том, сколько retained получил новый клиент
  const simulateNewSubscriber = () => {
    // TODO: реализуйте
    const received: RetainedMessage[] = []
    void received
    void setNewSubscriberReceived
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: Retained Messages</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Демонстрация работы retained-сообщений. Публикуйте и наблюдайте,
        что получит новый подписчик.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 12 }}>
            Публикация
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            <input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Топик"
              style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontFamily: 'monospace', fontSize: 13 }}
            />
            <input
              value={newPayload}
              onChange={(e) => setNewPayload(e.target.value)}
              placeholder="Payload (пусто = удалить retained)"
              style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontFamily: 'monospace', fontSize: 13 }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
              <input
                type="checkbox"
                checked={isRetained}
                onChange={(e) => setIsRetained(e.target.checked)}
              />
              Retained flag
            </label>
            <button
              onClick={publish}
              style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
            >
              Опубликовать
            </button>
          </div>

          {/* TODO: Отобразите содержимое retainedStore */}
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>
            Retained хранилище ({retainedStore.size})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {Array.from(retainedStore.values()).map((msg) => (
              <div key={msg.topic} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #bbf7d0', background: '#f0fdf4', fontSize: 13 }}>
                <code style={{ color: '#166534', display: 'block' }}>{msg.topic}</code>
                <span>"{msg.payload}"</span>
              </div>
            ))}
            {retainedStore.size === 0 && <div style={{ color: '#9ca3af', fontSize: 13 }}>Хранилище пусто</div>}
          </div>
        </div>

        <div>
          {/* TODO: Поле для топика подписки + кнопка "Подключить клиента" */}
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 12 }}>
            Новый подписчик
          </h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              value={subscribedTopic}
              onChange={(e) => setSubscribedTopic(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontFamily: 'monospace', fontSize: 13 }}
            />
            <button
              onClick={simulateNewSubscriber}
              style={{ padding: '8px 16px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Подключить
            </button>
          </div>

          {/* TODO: Показать newSubscriberReceived — что получил новый клиент */}
          {newSubscriberReceived.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#166534' }}>
                Получено {newSubscriberReceived.length} retained сообщений:
              </div>
              {newSubscriberReceived.map((msg) => (
                <div key={msg.topic} style={{ padding: '6px 10px', marginBottom: 4, borderRadius: 6, background: '#eff6ff', fontSize: 13 }}>
                  <code>{msg.topic}</code> = "{msg.payload}"
                </div>
              ))}
            </div>
          )}

          {/* TODO: Лог брокера — список строк из log */}
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>Лог</h3>
          <div style={{ background: '#1e1e2e', color: '#cdd6f4', padding: 12, borderRadius: 8, fontFamily: 'monospace', fontSize: 11, maxHeight: 150, overflowY: 'auto' }}>
            {log.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        </div>
      </div>
    </div>
  )
}
