import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 7.1: Dead Letter Exchange
// Task 7.1: Dead Letter Exchange
// ============================================
//
// Цель: реализовать интерактивную визуализацию DLX flow.
// Goal: implement an interactive DLX flow visualization.
// Сообщения попадают в Dead Letter Queue через три механизма:
// Messages reach the Dead Letter Queue via three mechanisms:
// NACK (rejected), TTL Expired, Max Length.
// NACK (rejected), TTL Expired, Max Length.
//
// Каждое сообщение проходит цепочку статусов и отображает маршрут.
// Each message goes through a chain of statuses and shows its route.

// TODO: Определи тип MessageStatus — union type: / Define the MessageStatus type — union type:
// 'queued' | 'processing' | 'rejected' | 'expired' | 'dead-lettered' | 'delivered'
// type MessageStatus = ...

// TODO: Определи интерфейс TrackedMessage: / Define the TrackedMessage interface:
//   id: string
//   body: string
//   ttl: number | null         — TTL в мс (используется только в режиме expired) / TTL in ms (used only in expired mode)
//   rejectReason: 'nack' | 'expired' | 'maxlen' | null
//   status: MessageStatus
//   route: string[]            — массив строк маршрута (каждый шаг — отдельная строка) / array of route strings (each step is a separate string)
//   timestamp: number
// interface TrackedMessage { ... }

// TODO: Создай константу DLX_CONFIG с полями: / Create the DLX_CONFIG constant with fields:
//   mainExchange: 'orders.exchange'
//   mainQueue: 'orders.queue'
//   dlx: 'orders.dlx'
//   dlq: 'orders.dead-letter'
//   dlxRoutingKey: 'dead'
// const DLX_CONFIG = { ... }

// TODO: Создай компонент StatusBadge({ status: MessageStatus }): / Create the StatusBadge({ status: MessageStatus }) component:
// Отображает цветной бейдж со статусом сообщения. / Displays a colored badge with the message status.
// Маппинг статус → { label, bg, color }: / Status mapping → { label, bg, color }:
//   queued       → QUEUED,        #E3F2FD / #1565C0
//   processing   → PROCESSING,    #FFF9C4 / #F57F17
//   rejected     → REJECTED,      #FFEBEE / #C62828
//   expired      → EXPIRED,       #FCE4EC / #880E4F
//   dead-lettered → DEAD LETTERED, #F3E5F5 / #6A1B9A
//   delivered    → DELIVERED,     #E8F5E9 / #2E7D32
// function StatusBadge({ status }: { status: MessageStatus }) { ... }

export function Task7_1() {
  const { t } = useLanguage()

  // TODO: Состояние messages: TrackedMessage[] / State: messages: TrackedMessage[]
  const [messages, setMessages] = useState<unknown[]>([])

  // TODO: Состояние selectedMsg: TrackedMessage | null (для показа маршрута) / State: selectedMsg for showing route
  const [selectedMsg, setSelectedMsg] = useState<unknown>(null)

  // TODO: Состояние msgBody: string — тело публикуемого сообщения (по умолчанию 'order-123') / State: message body (default 'order-123')
  const [msgBody, setMsgBody] = useState('order-123')

  // TODO: Состояние ttlMs: number | null — TTL в мс (по умолчанию 3000) / State: TTL in ms (default 3000)
  const [ttlMs, setTtlMs] = useState<number | null>(3000)

  // TODO: Состояние rejectMode: 'nack' | 'expired' | 'maxlen' (по умолчанию 'nack') / State: rejection mode (default 'nack')
  const [rejectMode, setRejectMode] = useState<string>('nack')

  // TODO: Ref для хранения setTimeout-ов: timerRefs.current = Record<string, ReturnType<typeof setTimeout>>
  // Ref for storing setTimeouts: timerRefs.current = Record<string, ReturnType<typeof setTimeout>>
  const timerRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  // TODO: Реализуй функцию clearAll(): / Implement the clearAll() function:
  //   - Очищает все таймеры из timerRefs / Clear all timers from timerRefs
  //   - Сбрасывает messages, selectedMsg / Reset messages, selectedMsg
  const clearAll = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй вспомогательную функцию updateMsg(id: string, patch: Partial<TrackedMessage>):
  // Implement the helper function updateMsg(id: string, patch: Partial<TrackedMessage>):
  //   - Обновляет сообщение с нужным id через setMessages / Update the message with given id via setMessages
  //   - Также обновляет selectedMsg если id совпадает / Also update selectedMsg if id matches
  const updateMsg = (_id: string, _patch: object) => {
    // TODO: реализовать / implement
  }

  // TODO: Реализуй функцию publishMessage(): / Implement the publishMessage() function:
  //   1. Создай TrackedMessage с id = `msg-${Date.now()}`, статус 'queued', / Create TrackedMessage with id = `msg-${Date.now()}`, status 'queued',
  //      route = [`→ ${DLX_CONFIG.mainExchange}`, `→ ${DLX_CONFIG.mainQueue}`]
  //   2. Добавь в messages через setMessages / Add to messages via setMessages
  //   3. Через 600 мс переведи в статус 'processing' / After 600ms switch to status 'processing'
  //   4. В зависимости от rejectMode запусти цепочку переходов: / Depending on rejectMode, start the transition chain:
  //      - 'expired' + ttlMs: через ttlMs мс → статус 'expired' с маршрутом x-message-ttl, / 'expired' + ttlMs: after ttlMs ms → status 'expired' with route x-message-ttl,
  //        затем через 800 мс → статус 'dead-lettered' с полным маршрутом / then after 800ms → status 'dead-lettered' with full route
  //      - 'maxlen': через 1200 мс → статус 'rejected' с маршрутом x-max-length, / 'maxlen': after 1200ms → status 'rejected' with route x-max-length,
  //        затем через 700 мс → статус 'dead-lettered' / then after 700ms → status 'dead-lettered'
  //      - 'nack' (default): через 1500 мс → статус 'rejected' с маршрутом NACK, / 'nack' (default): after 1500ms → status 'rejected' with route NACK,
  //        затем через 700 мс → статус 'dead-lettered' / then after 700ms → status 'dead-lettered'
  //   5. Сохраняй все таймеры в timerRefs.current / Save all timers in timerRefs.current
  const publishMessage = () => {
    // TODO: реализовать / implement
  }

  // TODO: Добавь useEffect для очистки таймеров при размонтировании компонента
  // Add useEffect for cleaning up timers on component unmount

  // TODO: Вычисли mainQueue — сообщения со статусом 'queued' или 'processing'
  // Compute mainQueue — messages with status 'queued' or 'processing'
  // const mainQueue = messages.filter(...)

  // TODO: Вычисли dlq — сообщения со статусом 'dead-lettered'
  // Compute dlq — messages with status 'dead-lettered'
  // const dlq = messages.filter(...)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.7.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Визуализация DLX flow: сообщения отклоняются или истекают и попадают в Dead Letter Queue.
      </p>

      {/* TODO: Карточка конфигурации очереди — показывает x-dead-letter-exchange, / Queue configuration card — shows x-dead-letter-exchange,
          x-dead-letter-routing-key и x-message-ttl из DLX_CONFIG
          x-dead-letter-routing-key and x-message-ttl from DLX_CONFIG */}

      {/* TODO: Панель управления: / Control panel:
          - Поле ввода "Тело сообщения" (msgBody) / "Message body" input field (msgBody)
          - Выпадающий список "Причина DLX": nack / expired / maxlen / "DLX reason" dropdown: nack / expired / maxlen
          - Если rejectMode === 'expired': выпадающий список TTL (1000 / 2000 / 3000 мс) / If rejectMode === 'expired': TTL dropdown (1000 / 2000 / 3000 ms)
          - Кнопка "Опубликовать" → publishMessage() / "Publish" button → publishMessage()
          - Кнопка "Очистить" (только если messages.length > 0) → clearAll() / "Clear" button (only if messages.length > 0) → clearAll() */}

      {/* TODO: Диаграмма двух очередей рядом (flex): / Two-queue side-by-side diagram (flex):
          - Блок orders.queue: заголовок с счётчиком mainQueue.length, / orders.queue block: header with mainQueue.length counter,
            список сообщений с StatusBadge, клик → setSelectedMsg / list of messages with StatusBadge, click → setSelectedMsg
          - Стрелка-разделитель / Arrow separator
          - Блок orders.dead-letter: заголовок с счётчиком dlq.length, / orders.dead-letter block: header with dlq.length counter,
            список сообщений с StatusBadge, клик → setSelectedMsg / list of messages with StatusBadge, click → setSelectedMsg */}

      {/* TODO: Список всех сообщений с маршрутом: / List of all messages with route:
          - Клик на сообщение → раскрывает маршрут (route) или скрывает / Click on message → expands (route) or hides
          - Маршрут показывается как список строк с левой цветной чертой / Route shown as a list of strings with a colored left border */}

      <div style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '2rem' }}>
        TODO: реализовать интерфейс задания / implement the task interface
      </div>
    </div>
  )
}
