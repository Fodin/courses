import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 5.1: Direct Exchange
// ============================================
//
// Цель: реализовать симулятор Direct Exchange.
// Direct Exchange маршрутизирует сообщение только в те очереди,
// у которых binding key точно совпадает с routing key сообщения.
//
// Одна и та же очередь может иметь несколько binding keys.
// Один routing key может связывать несколько очередей.

// TODO: Определи интерфейс DirectBinding:
//   queue: string         — имя очереди
//   routingKey: string    — ключ привязки (exact match)
//   color: string         — цвет для визуализации
//   bgColor: string       — фоновый цвет
//   messages: string[]    — последние сообщения в очереди
// interface DirectBinding { ... }

// TODO: Определи интерфейс DirectMessage:
//   id: number
//   routingKey: string
//   payload: string
//   timestamp: string
// interface DirectMessage { ... }

// TODO: Создай массив initialDirectBindings с 4 привязками:
//   1. queue: 'orders.new',       routingKey: 'order.created'
//   2. queue: 'orders.paid',      routingKey: 'order.paid'
//   3. queue: 'orders.cancelled', routingKey: 'order.cancelled'
//   4. queue: 'notifications',    routingKey: 'order.created'  ← та же очередь, что у #1!
// const initialDirectBindings: DirectBinding[] = [...]

// TODO: Создай массив directRoutingKeys с 5 примерами ключей:
//   'order.created', 'order.paid', 'order.cancelled', 'order.shipped', 'user.registered'
// const directRoutingKeys: string[] = [...]

export function Task5_1() {
  const { t } = useLanguage()

  // TODO: Объяви состояния:
  //   bindings       — массив DirectBinding (initialDirectBindings)
  //   selectedKey    — выбранный routing key (string, по умолчанию 'order.created')
  //   customKey      — пользовательский routing key (string, по умолчанию '')
  //   animating      — список имён очередей в анимации (string[])
  //   log            — лог сообщений (DirectMessage[])
  //   messageCount   — счётчик отправленных сообщений (number, 0)
  const [bindings, setBindings] = useState<string[]>([])
  const [selectedKey, setSelectedKey] = useState('order.created')
  const [customKey, setCustomKey] = useState('')
  const [animating, setAnimating] = useState<string[]>([])
  const [log, setLog] = useState<string[]>([])
  const [messageCount, setMessageCount] = useState(0)

  // TODO: Реализуй функцию publish():
  //   1. Определи активный ключ: customKey.trim() если не пустой, иначе selectedKey
  //   2. Получи временную метку через new Date().toLocaleTimeString()
  //   3. Найди все привязки с routingKey === активный ключ → matched[]
  //   4. Обнови bindings: добавь строку вида `[ts] routing_key="${key}"` в начало messages
  //      (только для совпавших, сохраняй не более 5 сообщений: .slice(0, 4))
  //   5. Установи animating = matched.map(b => b.queue)
  //   6. Увеличь messageCount
  //   7. Создай объект DirectMessage и добавь его в начало log (не более 10 записей)
  //   8. Через 900 мс сбрось animating в []
  const publish = () => {
    // TODO: реализовать
    console.log('TODO: publish()')
  }

  // TODO: Реализуй функцию clearQueues():
  //   - Сбрасывает messages в [] для каждой привязки
  //   - Очищает log
  const clearQueues = () => {
    // TODO: реализовать
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Direct Exchange направляет сообщение только в те очереди, у которых routing key точно совпадает с ключом сообщения.
      </p>

      {/* TODO: Схема архитектуры (Producer → Exchange → Queues)
          Отобрази горизонтальную схему:
          - Блок Producer с иконкой 📤 и текущим routing key
          - Стрелка → с подписью PUBLISH
          - Блок Direct Exchange с иконкой 🔀
          - Для каждой привязки: badge с routingKey → линия → блок очереди

          Визуальные состояния:
          - Binding key подсвечивается если совпадает с текущим ключом
          - Очередь подсвечивается если isAnimating (animating.includes(b.queue))
          - Внутри очереди: имя, счётчик "N msg", последнее сообщение
      */}
      <div
        style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ color: '#999', textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
          TODO: Отобразить схему Direct Exchange
          <br />
          <small>Producer → Exchange → [{bindings.length} очередей]</small>
        </div>
      </div>

      {/* TODO: Панель управления (2 колонки):
          Левая:
          - Заголовок "Выбрать routing key"
          - Кнопки для каждого ключа из directRoutingKeys
          - Поле ввода своего ключа (customKey)

          Правая:
          - Псевдокод AMQP: channel.basicPublish(exchange, routingKey, body)
          - Кнопки "Опубликовать" и "Очистить"
          - Лог маршрутизации (тёмный терминал)
      */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Выбрать routing key</h3>
          <div style={{ color: '#999', fontSize: '0.85rem' }}>
            TODO: кнопки для каждого ключа + поле ввода своего
          </div>
        </div>
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Публикация</h3>
          <div style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            TODO: псевдокод channel.basicPublish(...)
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
              Опубликовать
            </button>
            <button
              onClick={clearQueues}
              style={{
                padding: '0.75rem 1rem',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Очистить
            </button>
          </div>
          {/* TODO: отобразить log в виде тёмного терминала */}
          {log.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#1a1a2e', borderRadius: '8px', color: '#00ff88', fontFamily: 'monospace', fontSize: '0.75rem' }}>
              TODO: отобразить лог маршрутизации
            </div>
          )}
        </div>
      </div>

      {/* TODO: Информационный блок о принципах Direct Exchange */}
      <div
        style={{
          padding: '1rem',
          background: '#E3F2FD',
          borderRadius: '8px',
          fontSize: '0.85rem',
          border: '1px solid #90CAF9',
        }}
      >
        <strong>Как работает Direct Exchange:</strong>
        <ul style={{ margin: '0.5rem 0 0 1.25rem', lineHeight: '1.7' }}>
          <li>TODO: добавить принципы работы Direct Exchange</li>
        </ul>
      </div>
    </div>
  )
}
