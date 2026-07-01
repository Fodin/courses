import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-3.3.md
// Task description: task-3.3.md
//
// Создай ACK/NACK симулятор — интерактивное демо жизненного цикла сообщений в RabbitMQ.
// Create an ACK/NACK simulator — an interactive demo of the message lifecycle in RabbitMQ.
//
// Требования:
// Requirements:
// 1. Кнопка "Отправить сообщение" создаёт сообщение, проходящее:
//    ready → delivering (500 мс) → delivered → processing (600 мс)
// 1. "Send Message" button creates a message that goes through:
//    ready → delivering (500 ms) → delivered → processing (600 ms)
// 2. Prefetch (range 1–5): если активных сообщений >= prefetch, новые не отправляются,
//    в лог пишется "BLOCKED: prefetch limit N reached"
// 2. Prefetch (range 1–5): if active messages >= prefetch, new ones are not sent,
//    log writes "BLOCKED: prefetch limit N reached"
// 3. No-ack mode (checkbox): при включении пропускает processing и автоматически делает acked
// 3. No-ack mode (checkbox): when enabled, skips processing and automatically acks
// 4. Для сообщений в состоянии delivered/processing/redelivering — показывать 4 кнопки:
//    ACK, NACK+Requeue, NACK+DLQ, Timeout
// 4. For messages in delivered/processing/redelivering state — show 4 buttons:
//    ACK, NACK+Requeue, NACK+DLQ, Timeout
// 5. ACK: → acked, запись в лог "ACK msg#N | delivery-tag: N | удалено из очереди"
// 5. ACK: → acked, log entry "ACK msg#N | delivery-tag: N | removed from queue"
// 6. NACK+Requeue: → nacked → requeued → redelivering → processing
//    delivery-tag обновляется, redelivered=true, attempt++
// 6. NACK+Requeue: → nacked → requeued → redelivering → processing
//    delivery-tag updated, redelivered=true, attempt++
// 7. NACK+DLQ: → nacked → dead-lettered, запись про dead-letter-exchange
// 7. NACK+DLQ: → nacked → dead-lettered, log entry about dead-letter-exchange
// 8. Timeout: → timeout → redelivering → processing с новым delivery-tag
// 8. Timeout: → timeout → redelivering → processing with new delivery-tag
// 9. Delivery-tag монотонно возрастает — каждая (пере)доставка получает новый тег
// 9. Delivery-tag monotonically increases — each (re)delivery gets a new tag
// 10. Статистика: Всего / ACK / DLQ / В работе
// 10. Statistics: Total / ACK / DLQ / In Progress
// 11. Лог событий: последние 40 записей, новые сверху, тёмный фон (#0d1117)
// 11. Event log: last 40 entries, newest first, dark background (#0d1117)
// 12. Кнопка "Очистить" — полный сброс
// 12. "Clear" button — full reset

// TODO: определи тип MessageState
// TODO: define the MessageState type
// type MessageState =
//   | 'ready'
//   | 'delivering'
//   | 'delivered'
//   | 'processing'
//   | 'acked'
//   | 'nacked'
//   | 'requeued'
//   | 'dead-lettered'
//   | 'timeout'
//   | 'redelivering'

// TODO: определи интерфейс SimMessage
// TODO: define the SimMessage interface
// interface SimMessage {
//   id: number
//   payload: string
//   deliveryTag: number
//   state: MessageState
//   redelivered: boolean
//   attempt: number
//   timestamp: number
//   result?: string
// }

// TODO: определи интерфейс StateInfo
// TODO: define the StateInfo interface
// interface StateInfo {
//   label: string
//   color: string
//   bgColor: string
//   icon: string
//   description: string
// }

// TODO: создай словарь stateInfo для всех 10 состояний
// ready: 'В очереди', delivering: 'Доставка...', delivered: 'Доставлено',
// processing: 'Обработка', acked: 'ACK — удалено', nacked: 'NACK',
// requeued: 'Requeue', dead-lettered: 'Dead Letter', timeout: 'Timeout!',
// redelivering: 'Переотправка'
// TODO: create the stateInfo dictionary for all 10 states
// ready: 'In Queue', delivering: 'Delivering...', delivered: 'Delivered',
// processing: 'Processing', acked: 'ACK — removed', nacked: 'NACK',
// requeued: 'Requeue', dead-lettered: 'Dead Letter', timeout: 'Timeout!',
// redelivering: 'Redelivering'
// const stateInfo: Record<MessageState, StateInfo> = { ... }

// TODO: создай массив samplePayloads — 4 строки с примерами JSON
// TODO: create the samplePayloads array — 4 JSON example strings
// const samplePayloads = [...]

export function Task3_3() {
  const { t } = useLanguage()

  // TODO: состояние для массива сообщений
  // TODO: state for messages array
  // const [messages, setMessages] = useState<SimMessage[]>([])

  // TODO: счётчик для id следующего сообщения
  // TODO: counter for the next message id
  // const [nextId, setNextId] = useState(1)

  // TODO: счётчик для delivery-tag следующей доставки
  // TODO: counter for the next delivery tag
  // const [nextDeliveryTag, setNextDeliveryTag] = useState(1)

  // TODO: лог событий
  // TODO: event log
  // const [log, setLog] = useState<{ time: string; text: string; color: string }[]>([])

  // TODO: настройка prefetch (1–5)
  // TODO: prefetch setting (1–5)
  // const [prefetch, setPrefetch] = useState(3)

  // TODO: флаг no-ack mode
  // TODO: no-ack mode flag
  // const [autoAck, setAutoAck] = useState(false)

  // TODO: вспомогательная функция addLog(text, color)
  // Добавляет запись с текущим временем в лог, обрезает до 40 записей
  // TODO: helper function addLog(text, color)
  // Adds an entry with current time to the log, trims to 40 entries
  // const addLog = (text: string, color: string = '#c9d1d9') => { ... }

  // TODO: вспомогательная функция updateMessage(id, updates)
  // Обновляет поля конкретного сообщения по id
  // TODO: helper function updateMessage(id, updates)
  // Updates fields of a specific message by id
  // const updateMessage = (id: number, updates: Partial<SimMessage>) => { ... }

  // TODO: реализуй sendMessage
  // 1. Проверить prefetch-лимит (delivering/delivered/processing.length >= prefetch → BLOCKED)
  // 2. Создать новое сообщение в состоянии 'ready'
  // 3. Через 500 мс → 'delivering', запись в лог
  // 4. Через ещё 600 мс → если autoAck: 'acked', иначе 'processing'
  // TODO: implement sendMessage
  // 1. Check prefetch limit (delivering/delivered/processing.length >= prefetch → BLOCKED)
  // 2. Create a new message in 'ready' state
  // 3. After 500 ms → 'delivering', log entry
  // 4. After another 600 ms → if autoAck: 'acked', otherwise 'processing'
  // const sendMessage = () => { ... }

  // TODO: реализуй ackMessage(msg)
  // Работает только для delivered/processing
  // → acked, запись в лог
  // TODO: implement ackMessage(msg)
  // Works only for delivered/processing
  // → acked, log entry
  // const ackMessage = (msg: SimMessage) => { ... }

  // TODO: реализуй nackRequeue(msg)
  // → nacked → (700 мс) → requeued + новый delivery-tag
  // → (700 мс) → redelivering + redelivered=true + attempt++
  // → (600 мс) → processing
  // TODO: implement nackRequeue(msg)
  // → nacked → (700 ms) → requeued + new delivery-tag
  // → (700 ms) → redelivering + redelivered=true + attempt++
  // → (600 ms) → processing
  // const nackRequeue = (msg: SimMessage) => { ... }

  // TODO: реализуй nackDeadLetter(msg)
  // → nacked → (700 мс) → dead-lettered
  // TODO: implement nackDeadLetter(msg)
  // → nacked → (700 ms) → dead-lettered
  // const nackDeadLetter = (msg: SimMessage) => { ... }

  // TODO: реализуй simulateTimeout(msg)
  // → timeout → (1000 мс) → redelivering + новый delivery-tag + redelivered=true + attempt++
  // → (600 мс) → processing
  // TODO: implement simulateTimeout(msg)
  // → timeout → (1000 ms) → redelivering + new delivery-tag + redelivered=true + attempt++
  // → (600 ms) → processing
  // const simulateTimeout = (msg: SimMessage) => { ... }

  // TODO: реализуй clearMessages — полный сброс всего состояния
  // TODO: implement clearMessages — full reset of all state

  // TODO: вычисли статистику
  // TODO: compute statistics
  // const stats = {
  //   total: messages.length,
  //   acked: ...,
  //   deadLettered: ...,
  //   processing: ...,
  // }

  return (
    <div className="exercise-container" style={{ padding: '1.25rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.3.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        {/* TODO: добавь подсказку */}
        {/* TODO: add a hint */}
      </p>

      {/* TODO: панель управления */}
      {/* TODO: control panel */}
      {/* Кнопка "Отправить сообщение" (синяя) */}
      {/* "Send Message" button (blue) */}
      {/* Range input для prefetch (1–5) с подписью значения */}
      {/* Range input for prefetch (1–5) with value label */}
      {/* Checkbox "no-ack mode (auto-ack)" */}
      {/* Checkbox "no-ack mode (auto-ack)" */}
      {/* Кнопка "Очистить" */}
      {/* "Clear" button */}
      {/* Статистика справа: Всего / ACK / DLQ / В работе */}
      {/* Statistics on the right: Total / ACK / DLQ / In Progress */}

      {/* TODO: легенда state machine */}
      {/* TODO: state machine legend */}
      {/* Для каждого состояния из stateInfo: цветной бейдж с иконкой и label */}
      {/* For each state from stateInfo: colored badge with icon and label */}

      {/* TODO: список сообщений */}
      {/* TODO: message list */}
      {/* Если messages.length === 0: заглушка с подсказкой */}
      {/* If messages.length === 0: placeholder with a hint */}
      {/* Для каждого активного сообщения (последние 10, новые сверху): */}
      {/* For each active message (last 10, newest first): */}
      {/*   - Бейдж состояния (иконка + label, цвет из stateInfo) */}
      {/*   - State badge (icon + label, color from stateInfo) */}
      {/*   - Информация: msg#N, tag=N, redelivered badge (если redelivered), payload */}
      {/*   - Info: msg#N, tag=N, redelivered badge (if redelivered), payload */}
      {/*   - Кнопки ACK / NACK+Requeue / NACK+DLQ / Timeout */}
      {/*   - ACK / NACK+Requeue / NACK+DLQ / Timeout buttons */}
      {/*     (только если isActive: delivered/processing/redelivering И !autoAck) */}
      {/*     (only if isActive: delivered/processing/redelivering AND !autoAck) */}

      {/* TODO: лог событий */}
      {/* TODO: event log */}
      {/* Показывать если log.length > 0 */}
      {/* Show if log.length > 0 */}
      {/* Тёмный фон (#0d1117), моноширинный шрифт */}
      {/* Dark background (#0d1117), monospace font */}
      {/* Каждая запись: время | текст (с цветом) */}
      {/* Each entry: time | text (with color) */}
    </div>
  )
}
