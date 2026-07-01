import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 7.3: Priority Queue и Delayed Messages
// Task 7.3: Priority Queue and Delayed Messages
// ============================================
//
// Цель: реализовать два механизма в одном компоненте с вкладками:
// Goal: implement two mechanisms in one component with tabs:
// 1. Priority Queue — сообщения потребляются в порядке убывания приоритета
// 1. Priority Queue — messages are consumed in descending priority order
// 2. Delayed Messages — сообщения доставляются с задержкой (прогресс-бар)
// 2. Delayed Messages — messages are delivered with a delay (progress bar)

// TODO: Определи интерфейс PriorityMessage: / Define the PriorityMessage interface:
//   id: string
//   body: string
//   priority: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
//   status: 'queued' | 'consumed'
//   enqueuedAt: number
// interface PriorityMessage { ... }

// TODO: Определи интерфейс DelayedMessage: / Define the DelayedMessage interface:
//   id: string
//   body: string
//   delayMs: number
//   scheduledAt: number
//   deliveredAt: number | null
//   status: 'scheduled' | 'delivered'
// interface DelayedMessage { ... }

// TODO: Создай константу PRIORITY_COLORS: / Create the PRIORITY_COLORS constant:
//   Маппинг числового приоритета → { bg: string; color: string; label: string } / Numeric priority mapping → { bg: string; color: string; label: string }
//   10 → { bg: '#FFEBEE', color: '#B71C1C', label: 'CRITICAL' }
//   9  → { bg: '#FCE4EC', color: '#C62828', label: 'URGENT' }
//   8  → { bg: '#FFF3E0', color: '#E65100', label: 'HIGH' }
//   7  → { bg: '#FFF8E1', color: '#F57F17', label: 'ELEVATED' }
//   5  → { bg: '#E8F5E9', color: '#2E7D32', label: 'NORMAL' }
//   3  → { bg: '#E3F2FD', color: '#1565C0', label: 'LOW' }
//   1  → { bg: '#F3E5F5', color: '#6A1B9A', label: 'BACKGROUND' }
//   0  → { bg: '#F5F5F5', color: '#757575', label: 'MINIMAL' }
// const PRIORITY_COLORS: Record<number, { bg: string; color: string; label: string }> = { ... }

// TODO: Реализуй вспомогательную функцию getPriorityMeta(p: number):
// Implement the helper function getPriorityMeta(p: number):
//   Возвращает { bg, color, label } для числового приоритета. / Returns { bg, color, label } for a numeric priority.
//   Логика: перебрать ключи PRIORITY_COLORS по убыванию, вернуть первый где p >= k. / Logic: iterate PRIORITY_COLORS keys descending, return first where p >= k.
//   Если ничего не найдено — вернуть PRIORITY_COLORS[0]. / If nothing found — return PRIORITY_COLORS[0].
// function getPriorityMeta(p: number) { ... }

export function Task7_3() {
  const { t } = useLanguage()

  // TODO: Состояние tab: 'priority' | 'delayed' (по умолчанию 'priority')
  // State: tab: 'priority' | 'delayed' (default 'priority')
  const [tab, setTab] = useState<'priority' | 'delayed'>('priority')

  // ── Priority Queue ──────────────────────────────────────────────

  // TODO: Состояние pQueue: PriorityMessage[] / State: pQueue: PriorityMessage[]
  const [pQueue, setPQueue] = useState<unknown[]>([])

  // TODO: Состояние msgBody: string — тело сообщения (по умолчанию 'task')
  // State: msgBody: string — message body (default 'task')
  const [msgBody, setMsgBody] = useState('task')

  // TODO: Состояние msgPriority: number (по умолчанию 5) / State: msgPriority: number (default 5)
  const [msgPriority, setMsgPriority] = useState(5)

  // TODO: Состояние consuming: boolean — флаг автопотребления / State: consuming: boolean — auto-consume flag
  const [consuming, setConsuming] = useState(false)

  // TODO: Ref consumeRef для хранения setInterval handle / Ref consumeRef for storing setInterval handle
  const consumeRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // TODO: Реализуй функцию enqueuePriority(): / Implement the enqueuePriority() function:
  //   Создаёт PriorityMessage с id = `p-${Date.now()}`, / Creates PriorityMessage with id = `p-${Date.now()}`,
  //   body = `${msgBody}-${последние 4 цифры Date.now()}`, / body = `${msgBody}-${last 4 digits of Date.now()}`,
  //   добавляет в pQueue / adds to pQueue
  const enqueuePriority = () => {
    // TODO: реализовать / implement
  }

  // TODO: Вычисли sortedQueue — pQueue фильтр по status='queued', сортировка по priority desc
  // Compute sortedQueue — pQueue filtered by status='queued', sorted by priority desc
  // const sortedQueue = [...]

  // TODO: Вычисли consumedList — pQueue фильтр по status='consumed'
  // Compute consumedList — pQueue filtered by status='consumed'
  // const consumedList = [...]

  // TODO: Реализуй функцию consumeNext(): / Implement the consumeNext() function:
  //   Переводит первый элемент sortedQueue в статус 'consumed' / Moves the first element of sortedQueue to status 'consumed'
  const consumeNext = () => {
    // TODO: реализовать / implement
  }

  // TODO: Реализуй функции startAutoConsume() и stopAutoConsume():
  // Implement the startAutoConsume() and stopAutoConsume() functions:
  //   startAutoConsume: setConsuming(true)
  //   stopAutoConsume: setConsuming(false), очистить consumeRef / clear consumeRef
  const startAutoConsume = () => {
    // TODO: реализовать / implement
  }

  const stopAutoConsume = () => {
    // TODO: реализовать / implement
  }

  // TODO: Добавь useEffect на [consuming]: / Add useEffect on [consuming]:
  //   Если consuming === true: запустить setInterval 600 мс. / If consuming === true: start setInterval 600ms.
  //   Каждый тик: найти сообщение с наивысшим приоритетом и статусом 'queued', / Each tick: find message with highest priority and status 'queued',
  //   перевести в 'consumed'. Если очередь пуста — setConsuming(false), clearInterval.
  //   move to 'consumed'. If queue is empty — setConsuming(false), clearInterval.
  //   Возврат из useEffect: clearInterval. / Cleanup from useEffect: clearInterval.

  // ── Delayed Messages ──────────────────────────────────────────────

  // TODO: Состояние delayedMsgs: DelayedMessage[] / State: delayedMsgs: DelayedMessage[]
  const [delayedMsgs, setDelayedMsgs] = useState<unknown[]>([])

  // TODO: Состояние delayInput: number — задержка в мс (по умолчанию 3000)
  // State: delayInput: number — delay in ms (default 3000)
  const [delayInput, setDelayInput] = useState(3000)

  // TODO: Состояние delayBody: string — тело отложенного сообщения (по умолчанию 'delayed-task')
  // State: delayBody: string — delayed message body (default 'delayed-task')
  const [delayBody, setDelayBody] = useState('delayed-task')

  // TODO: Ref delayTimers для хранения setTimeout-ов по id сообщения
  // Ref delayTimers for storing setTimeouts by message id
  const delayTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  // TODO: Состояние tick: number для принудительного ре-рендера прогресс-бара
  // State: tick: number for forcing progress bar re-render
  // Добавь useEffect с setInterval 200 мс, который инкрементирует tick / Add useEffect with setInterval 200ms that increments tick
  const [tick, setTick] = useState(0)
  void tick // используется для принудительного ре-рендера прогресс-бара / used for forcing progress bar re-render

  // TODO: Реализуй функцию scheduleMessage(): / Implement the scheduleMessage() function:
  //   1. Создаёт DelayedMessage с scheduledAt = Date.now() / Creates DelayedMessage with scheduledAt = Date.now()
  //   2. Добавляет в delayedMsgs / Adds to delayedMsgs
  //   3. Через setTimeout(delayInput) переводит в статус 'delivered', deliveredAt = Date.now()
  //   3. After setTimeout(delayInput) moves to status 'delivered', deliveredAt = Date.now()
  //   4. Сохраняет таймер в delayTimers.current / Saves timer in delayTimers.current
  const scheduleMessage = () => {
    // TODO: реализовать / implement
  }

  // TODO: Добавь useEffect для очистки delayTimers при размонтировании
  // Add useEffect for cleaning up delayTimers on unmount

  // TODO: Реализуй clearPriority(): stopAutoConsume() + setPQueue([])
  // Implement clearPriority(): stopAutoConsume() + setPQueue([])
  const clearPriority = () => {
    // TODO: реализовать / implement
  }

  // TODO: Реализуй clearDelayed(): очистить все delayTimers + setDelayedMsgs([])
  // Implement clearDelayed(): clear all delayTimers + setDelayedMsgs([])
  const clearDelayed = () => {
    // TODO: реализовать / implement
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.7.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        Priority Queue: сообщения с высоким приоритетом потребляются первыми. Delayed Messages:
        планировщик с визуальным таймером.
      </p>

      {/* TODO: Вкладки 'priority' / 'delayed': / Tabs 'priority' / 'delayed':
          Активная вкладка: background #1565C0, цвет #fff, fontWeight 700 / Active tab: background #1565C0, color #fff, fontWeight 700
          Неактивная: background #fff, цвет #333, border 1px solid #ddd / Inactive: background #fff, color #333, border 1px solid #ddd */}

      {tab === 'priority' ? (
        <div>
          {/* TODO: Карточка конфигурации: / Configuration card:
              Отображает: x-max-priority: 10 // диапазон приоритетов 0–10 / Displays: x-max-priority: 10 // priority range 0-10
              Используй monospace шрифт / Use monospace font */}

          {/* TODO: Панель управления Priority Queue: / Priority Queue control panel:
              - Поле ввода "Сообщение" (msgBody) / "Message" input field (msgBody)
              - Выпадающий список "Приоритет" — значения [10, 9, 8, 7, 5, 3, 1, 0] / "Priority" dropdown — values [10, 9, 8, 7, 5, 3, 1, 0]
                Каждый вариант: "{p} — {meta.label}" / Each option: "{p} — {meta.label}"
              - Кнопка "Enqueue" → enqueuePriority() / "Enqueue" button → enqueuePriority()
              - Кнопка "Consume 1" (disabled если sortedQueue пустой) → consumeNext()
              - "Consume 1" button (disabled if sortedQueue empty) → consumeNext()
              - Кнопка "Auto Consume" / "Stop Auto" → startAutoConsume() / stopAutoConsume()
              - Кнопка "Очистить" (если pQueue.length > 0) → clearPriority()
              - "Clear" button (if pQueue.length > 0) → clearPriority() */}

          {/* TODO: Отображение двух списков рядом (flex или grid): / Display two lists side by side (flex or grid):
              Левая часть — "В очереди": / Left part — "In queue":
                sortedQueue.map() → каждое сообщение: / each message:
                  номер позиции, тело (mono), приоритет с цветом из getPriorityMeta()
                  position number, body (mono), priority with color from getPriorityMeta()

              Правая часть — "Потреблено": / Right part — "Consumed":
                consumedList.map() → каждое сообщение: / each message:
                  тело, приоритет с серым цветом (уже обработано)
                  body, priority with gray color (already processed) */}
        </div>
      ) : (
        <div>
          {/* TODO: Панель управления Delayed Messages: / Delayed Messages control panel:
              - Поле ввода "Тело сообщения" (delayBody) / "Message body" input field (delayBody)
              - Выпадающий список "Задержка" (1000 / 2000 / 3000 / 5000 мс) / "Delay" dropdown (1000 / 2000 / 3000 / 5000 ms)
              - Кнопка "Запланировать" → scheduleMessage() / "Schedule" button → scheduleMessage()
              - Кнопка "Очистить" (если delayedMsgs.length > 0) → clearDelayed()
              - "Clear" button (if delayedMsgs.length > 0) → clearDelayed() */}

          {/* TODO: Список отложенных сообщений: / List of delayed messages:
              Каждое сообщение: / Each message:
              - Тело (mono), статус-бейдж (SCHEDULED / DELIVERED) / Body (mono), status badge (SCHEDULED / DELIVERED)
              - Если status === 'scheduled': / If status === 'scheduled':
                Вычисли progress = Math.min(1, (Date.now() - scheduledAt) / delayMs) / Compute progress = Math.min(1, (Date.now() - scheduledAt) / delayMs)
                Прогресс-бар: ширина progress * 100%, синий цвет / Progress bar: width progress * 100%, blue color
                Оставшееся время: Math.max(0, delayMs - (Date.now() - scheduledAt)) мс / Remaining time: Math.max(0, delayMs - (Date.now() - scheduledAt)) ms
              - Если status === 'delivered': / If status === 'delivered':
                Показать "Доставлено в {deliveredAt}" / Show "Delivered at {deliveredAt}" */}
        </div>
      )}

      <div style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '2rem' }}>
        TODO: реализовать интерфейс задания / implement the task interface
      </div>
    </div>
  )
}
