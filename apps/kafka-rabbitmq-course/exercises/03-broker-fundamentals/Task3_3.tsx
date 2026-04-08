import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-3.3.md
//
// Создай ACK/NACK симулятор — интерактивное демо жизненного цикла сообщений в RabbitMQ.
//
// Требования:
// 1. Кнопка "Отправить сообщение" создаёт сообщение, проходящее:
//    ready → delivering (500 мс) → delivered → processing (600 мс)
// 2. Prefetch (range 1–5): если активных сообщений >= prefetch, новые не отправляются,
//    в лог пишется "BLOCKED: prefetch limit N reached"
// 3. No-ack mode (checkbox): при включении пропускает processing и автоматически делает acked
// 4. Для сообщений в состоянии delivered/processing/redelivering — показывать 4 кнопки:
//    ACK, NACK+Requeue, NACK+DLQ, Timeout
// 5. ACK: → acked, запись в лог "ACK msg#N | delivery-tag: N | удалено из очереди"
// 6. NACK+Requeue: → nacked → requeued → redelivering → processing
//    delivery-tag обновляется, redelivered=true, attempt++
// 7. NACK+DLQ: → nacked → dead-lettered, запись про dead-letter-exchange
// 8. Timeout: → timeout → redelivering → processing с новым delivery-tag
// 9. Delivery-tag монотонно возрастает — каждая (пере)доставка получает новый тег
// 10. Статистика: Всего / ACK / DLQ / В работе
// 11. Лог событий: последние 40 записей, новые сверху, тёмный фон (#0d1117)
// 12. Кнопка "Очистить" — полный сброс

// TODO: определи тип MessageState
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
// const stateInfo: Record<MessageState, StateInfo> = { ... }

// TODO: создай массив samplePayloads — 4 строки с примерами JSON
// const samplePayloads = [...]

export function Task3_3() {
  const { t } = useLanguage()

  // TODO: состояние для массива сообщений
  // const [messages, setMessages] = useState<SimMessage[]>([])

  // TODO: счётчик для id следующего сообщения
  // const [nextId, setNextId] = useState(1)

  // TODO: счётчик для delivery-tag следующей доставки
  // const [nextDeliveryTag, setNextDeliveryTag] = useState(1)

  // TODO: лог событий
  // const [log, setLog] = useState<{ time: string; text: string; color: string }[]>([])

  // TODO: настройка prefetch (1–5)
  // const [prefetch, setPrefetch] = useState(3)

  // TODO: флаг no-ack mode
  // const [autoAck, setAutoAck] = useState(false)

  // TODO: вспомогательная функция addLog(text, color)
  // Добавляет запись с текущим временем в лог, обрезает до 40 записей
  // const addLog = (text: string, color: string = '#c9d1d9') => { ... }

  // TODO: вспомогательная функция updateMessage(id, updates)
  // Обновляет поля конкретного сообщения по id
  // const updateMessage = (id: number, updates: Partial<SimMessage>) => { ... }

  // TODO: реализуй sendMessage
  // 1. Проверить prefetch-лимит (delivering/delivered/processing.length >= prefetch → BLOCKED)
  // 2. Создать новое сообщение в состоянии 'ready'
  // 3. Через 500 мс → 'delivering', запись в лог
  // 4. Через ещё 600 мс → если autoAck: 'acked', иначе 'processing'
  // const sendMessage = () => { ... }

  // TODO: реализуй ackMessage(msg)
  // Работает только для delivered/processing
  // → acked, запись в лог
  // const ackMessage = (msg: SimMessage) => { ... }

  // TODO: реализуй nackRequeue(msg)
  // → nacked → (700 мс) → requeued + новый delivery-tag
  // → (700 мс) → redelivering + redelivered=true + attempt++
  // → (600 мс) → processing
  // const nackRequeue = (msg: SimMessage) => { ... }

  // TODO: реализуй nackDeadLetter(msg)
  // → nacked → (700 мс) → dead-lettered
  // const nackDeadLetter = (msg: SimMessage) => { ... }

  // TODO: реализуй simulateTimeout(msg)
  // → timeout → (1000 мс) → redelivering + новый delivery-tag + redelivered=true + attempt++
  // → (600 мс) → processing
  // const simulateTimeout = (msg: SimMessage) => { ... }

  // TODO: реализуй clearMessages — полный сброс всего состояния

  // TODO: вычисли статистику
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
      </p>

      {/* TODO: панель управления */}
      {/* Кнопка "Отправить сообщение" (синяя) */}
      {/* Range input для prefetch (1–5) с подписью значения */}
      {/* Checkbox "no-ack mode (auto-ack)" */}
      {/* Кнопка "Очистить" */}
      {/* Статистика справа: Всего / ACK / DLQ / В работе */}

      {/* TODO: легенда state machine */}
      {/* Для каждого состояния из stateInfo: цветной бейдж с иконкой и label */}

      {/* TODO: список сообщений */}
      {/* Если messages.length === 0: заглушка с подсказкой */}
      {/* Для каждого активного сообщения (последние 10, новые сверху): */}
      {/*   - Бейдж состояния (иконка + label, цвет из stateInfo) */}
      {/*   - Информация: msg#N, tag=N, redelivered badge (если redelivered), payload */}
      {/*   - Кнопки ACK / NACK+Requeue / NACK+DLQ / Timeout */}
      {/*     (только если isActive: delivered/processing/redelivering И !autoAck) */}

      {/* TODO: лог событий */}
      {/* Показывать если log.length > 0 */}
      {/* Тёмный фон (#0d1117), моноширинный шрифт */}
      {/* Каждая запись: время | текст (с цветом) */}
    </div>
  )
}
