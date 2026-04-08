import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 7.1: Dead Letter Exchange
// ============================================
//
// Цель: реализовать интерактивную визуализацию DLX flow.
// Сообщения попадают в Dead Letter Queue через три механизма:
// NACK (rejected), TTL Expired, Max Length.
//
// Каждое сообщение проходит цепочку статусов и отображает маршрут.

// TODO: Определи тип MessageStatus — union type:
// 'queued' | 'processing' | 'rejected' | 'expired' | 'dead-lettered' | 'delivered'
// type MessageStatus = ...

// TODO: Определи интерфейс TrackedMessage:
//   id: string
//   body: string
//   ttl: number | null         — TTL в мс (используется только в режиме expired)
//   rejectReason: 'nack' | 'expired' | 'maxlen' | null
//   status: MessageStatus
//   route: string[]            — массив строк маршрута (каждый шаг — отдельная строка)
//   timestamp: number
// interface TrackedMessage { ... }

// TODO: Создай константу DLX_CONFIG с полями:
//   mainExchange: 'orders.exchange'
//   mainQueue: 'orders.queue'
//   dlx: 'orders.dlx'
//   dlq: 'orders.dead-letter'
//   dlxRoutingKey: 'dead'
// const DLX_CONFIG = { ... }

// TODO: Создай компонент StatusBadge({ status: MessageStatus }):
// Отображает цветной бейдж со статусом сообщения.
// Маппинг статус → { label, bg, color }:
//   queued       → QUEUED,        #E3F2FD / #1565C0
//   processing   → PROCESSING,    #FFF9C4 / #F57F17
//   rejected     → REJECTED,      #FFEBEE / #C62828
//   expired      → EXPIRED,       #FCE4EC / #880E4F
//   dead-lettered → DEAD LETTERED, #F3E5F5 / #6A1B9A
//   delivered    → DELIVERED,     #E8F5E9 / #2E7D32
// function StatusBadge({ status }: { status: MessageStatus }) { ... }

export function Task7_1() {
  const { t } = useLanguage()

  // TODO: Состояние messages: TrackedMessage[]
  const [messages, setMessages] = useState<unknown[]>([])

  // TODO: Состояние selectedMsg: TrackedMessage | null (для показа маршрута)
  const [selectedMsg, setSelectedMsg] = useState<unknown>(null)

  // TODO: Состояние msgBody: string — тело публикуемого сообщения (по умолчанию 'order-123')
  const [msgBody, setMsgBody] = useState('order-123')

  // TODO: Состояние ttlMs: number | null — TTL в мс (по умолчанию 3000)
  const [ttlMs, setTtlMs] = useState<number | null>(3000)

  // TODO: Состояние rejectMode: 'nack' | 'expired' | 'maxlen' (по умолчанию 'nack')
  const [rejectMode, setRejectMode] = useState<string>('nack')

  // TODO: Ref для хранения setTimeout-ов: timerRefs.current = Record<string, ReturnType<typeof setTimeout>>
  const timerRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  // TODO: Реализуй функцию clearAll():
  //   - Очищает все таймеры из timerRefs
  //   - Сбрасывает messages, selectedMsg
  const clearAll = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй вспомогательную функцию updateMsg(id: string, patch: Partial<TrackedMessage>):
  //   - Обновляет сообщение с нужным id через setMessages
  //   - Также обновляет selectedMsg если id совпадает
  const updateMsg = (_id: string, _patch: object) => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию publishMessage():
  //   1. Создай TrackedMessage с id = `msg-${Date.now()}`, статус 'queued',
  //      route = [`→ ${DLX_CONFIG.mainExchange}`, `→ ${DLX_CONFIG.mainQueue}`]
  //   2. Добавь в messages через setMessages
  //   3. Через 600 мс переведи в статус 'processing'
  //   4. В зависимости от rejectMode запусти цепочку переходов:
  //      - 'expired' + ttlMs: через ttlMs мс → статус 'expired' с маршрутом x-message-ttl,
  //        затем через 800 мс → статус 'dead-lettered' с полным маршрутом
  //      - 'maxlen': через 1200 мс → статус 'rejected' с маршрутом x-max-length,
  //        затем через 700 мс → статус 'dead-lettered'
  //      - 'nack' (default): через 1500 мс → статус 'rejected' с маршрутом NACK,
  //        затем через 700 мс → статус 'dead-lettered'
  //   5. Сохраняй все таймеры в timerRefs.current
  const publishMessage = () => {
    // TODO: реализовать
  }

  // TODO: Добавь useEffect для очистки таймеров при размонтировании компонента

  // TODO: Вычисли mainQueue — сообщения со статусом 'queued' или 'processing'
  // const mainQueue = messages.filter(...)

  // TODO: Вычисли dlq — сообщения со статусом 'dead-lettered'
  // const dlq = messages.filter(...)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.7.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Визуализация DLX flow: сообщения отклоняются или истекают и попадают в Dead Letter Queue.
      </p>

      {/* TODO: Карточка конфигурации очереди — показывает x-dead-letter-exchange,
          x-dead-letter-routing-key и x-message-ttl из DLX_CONFIG */}

      {/* TODO: Панель управления:
          - Поле ввода "Тело сообщения" (msgBody)
          - Выпадающий список "Причина DLX": nack / expired / maxlen
          - Если rejectMode === 'expired': выпадающий список TTL (1000 / 2000 / 3000 мс)
          - Кнопка "Опубликовать" → publishMessage()
          - Кнопка "Очистить" (только если messages.length > 0) → clearAll() */}

      {/* TODO: Диаграмма двух очередей рядом (flex):
          - Блок orders.queue: заголовок с счётчиком mainQueue.length,
            список сообщений с StatusBadge, клик → setSelectedMsg
          - Стрелка-разделитель
          - Блок orders.dead-letter: заголовок с счётчиком dlq.length,
            список сообщений с StatusBadge, клик → setSelectedMsg */}

      {/* TODO: Список всех сообщений с маршрутом:
          - Клик на сообщение → раскрывает маршрут (route) или скрывает
          - Маршрут показывается как список строк с левой цветной чертой */}

      <div style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '2rem' }}>
        TODO: реализовать интерфейс задания
      </div>
    </div>
  )
}
