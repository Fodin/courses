import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 7.3: Priority Queue и Delayed Messages
// ============================================
//
// Цель: реализовать два механизма в одном компоненте с вкладками:
// 1. Priority Queue — сообщения потребляются в порядке убывания приоритета
// 2. Delayed Messages — сообщения доставляются с задержкой (прогресс-бар)

// TODO: Определи интерфейс PriorityMessage:
//   id: string
//   body: string
//   priority: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
//   status: 'queued' | 'consumed'
//   enqueuedAt: number
// interface PriorityMessage { ... }

// TODO: Определи интерфейс DelayedMessage:
//   id: string
//   body: string
//   delayMs: number
//   scheduledAt: number
//   deliveredAt: number | null
//   status: 'scheduled' | 'delivered'
// interface DelayedMessage { ... }

// TODO: Создай константу PRIORITY_COLORS:
//   Маппинг числового приоритета → { bg: string; color: string; label: string }
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
//   Возвращает { bg, color, label } для числового приоритета.
//   Логика: перебрать ключи PRIORITY_COLORS по убыванию, вернуть первый где p >= k.
//   Если ничего не найдено — вернуть PRIORITY_COLORS[0].
// function getPriorityMeta(p: number) { ... }

export function Task7_3() {
  const { t } = useLanguage()

  // TODO: Состояние tab: 'priority' | 'delayed' (по умолчанию 'priority')
  const [tab, setTab] = useState<'priority' | 'delayed'>('priority')

  // ── Priority Queue ──────────────────────────────────────────────

  // TODO: Состояние pQueue: PriorityMessage[]
  const [pQueue, setPQueue] = useState<unknown[]>([])

  // TODO: Состояние msgBody: string — тело сообщения (по умолчанию 'task')
  const [msgBody, setMsgBody] = useState('task')

  // TODO: Состояние msgPriority: number (по умолчанию 5)
  const [msgPriority, setMsgPriority] = useState(5)

  // TODO: Состояние consuming: boolean — флаг автопотребления
  const [consuming, setConsuming] = useState(false)

  // TODO: Ref consumeRef для хранения setInterval handle
  const consumeRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // TODO: Реализуй функцию enqueuePriority():
  //   Создаёт PriorityMessage с id = `p-${Date.now()}`,
  //   body = `${msgBody}-${последние 4 цифры Date.now()}`,
  //   добавляет в pQueue
  const enqueuePriority = () => {
    // TODO: реализовать
  }

  // TODO: Вычисли sortedQueue — pQueue фильтр по status='queued', сортировка по priority desc
  // const sortedQueue = [...]

  // TODO: Вычисли consumedList — pQueue фильтр по status='consumed'
  // const consumedList = [...]

  // TODO: Реализуй функцию consumeNext():
  //   Переводит первый элемент sortedQueue в статус 'consumed'
  const consumeNext = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй функции startAutoConsume() и stopAutoConsume():
  //   startAutoConsume: setConsuming(true)
  //   stopAutoConsume: setConsuming(false), очистить consumeRef
  const startAutoConsume = () => {
    // TODO: реализовать
  }

  const stopAutoConsume = () => {
    // TODO: реализовать
  }

  // TODO: Добавь useEffect на [consuming]:
  //   Если consuming === true: запустить setInterval 600 мс.
  //   Каждый тик: найти сообщение с наивысшим приоритетом и статусом 'queued',
  //   перевести в 'consumed'. Если очередь пуста — setConsuming(false), clearInterval.
  //   Возврат из useEffect: clearInterval.

  // ── Delayed Messages ──────────────────────────────────────────────

  // TODO: Состояние delayedMsgs: DelayedMessage[]
  const [delayedMsgs, setDelayedMsgs] = useState<unknown[]>([])

  // TODO: Состояние delayInput: number — задержка в мс (по умолчанию 3000)
  const [delayInput, setDelayInput] = useState(3000)

  // TODO: Состояние delayBody: string — тело отложенного сообщения (по умолчанию 'delayed-task')
  const [delayBody, setDelayBody] = useState('delayed-task')

  // TODO: Ref delayTimers для хранения setTimeout-ов по id сообщения
  const delayTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  // TODO: Состояние tick: number для принудительного ре-рендера прогресс-бара
  // Добавь useEffect с setInterval 200 мс, который инкрементирует tick
  const [tick, setTick] = useState(0)
  void tick // используется для принудительного ре-рендера прогресс-бара

  // TODO: Реализуй функцию scheduleMessage():
  //   1. Создаёт DelayedMessage с scheduledAt = Date.now()
  //   2. Добавляет в delayedMsgs
  //   3. Через setTimeout(delayInput) переводит в статус 'delivered', deliveredAt = Date.now()
  //   4. Сохраняет таймер в delayTimers.current
  const scheduleMessage = () => {
    // TODO: реализовать
  }

  // TODO: Добавь useEffect для очистки delayTimers при размонтировании

  // TODO: Реализуй clearPriority(): stopAutoConsume() + setPQueue([])
  const clearPriority = () => {
    // TODO: реализовать
  }

  // TODO: Реализуй clearDelayed(): очистить все delayTimers + setDelayedMsgs([])
  const clearDelayed = () => {
    // TODO: реализовать
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.7.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        Priority Queue: сообщения с высоким приоритетом потребляются первыми. Delayed Messages:
        планировщик с визуальным таймером.
      </p>

      {/* TODO: Вкладки 'priority' / 'delayed':
          Активная вкладка: background #1565C0, цвет #fff, fontWeight 700
          Неактивная: background #fff, цвет #333, border 1px solid #ddd */}

      {tab === 'priority' ? (
        <div>
          {/* TODO: Карточка конфигурации:
              Отображает: x-max-priority: 10 // диапазон приоритетов 0–10
              Используй monospace шрифт */}

          {/* TODO: Панель управления Priority Queue:
              - Поле ввода "Сообщение" (msgBody)
              - Выпадающий список "Приоритет" — значения [10, 9, 8, 7, 5, 3, 1, 0]
                Каждый вариант: "{p} — {meta.label}"
              - Кнопка "Enqueue" → enqueuePriority()
              - Кнопка "Consume 1" (disabled если sortedQueue пустой) → consumeNext()
              - Кнопка "Auto Consume" / "Stop Auto" → startAutoConsume() / stopAutoConsume()
              - Кнопка "Очистить" (если pQueue.length > 0) → clearPriority() */}

          {/* TODO: Отображение двух списков рядом (flex или grid):
              Левая часть — "В очереди":
                sortedQueue.map() → каждое сообщение:
                  номер позиции, тело (mono), приоритет с цветом из getPriorityMeta()

              Правая часть — "Потреблено":
                consumedList.map() → каждое сообщение:
                  тело, приоритет с серым цветом (уже обработано) */}
        </div>
      ) : (
        <div>
          {/* TODO: Панель управления Delayed Messages:
              - Поле ввода "Тело сообщения" (delayBody)
              - Выпадающий список "Задержка" (1000 / 2000 / 3000 / 5000 мс)
              - Кнопка "Запланировать" → scheduleMessage()
              - Кнопка "Очистить" (если delayedMsgs.length > 0) → clearDelayed() */}

          {/* TODO: Список отложенных сообщений:
              Каждое сообщение:
              - Тело (mono), статус-бейдж (SCHEDULED / DELIVERED)
              - Если status === 'scheduled':
                Вычисли progress = Math.min(1, (Date.now() - scheduledAt) / delayMs)
                Прогресс-бар: ширина progress * 100%, синий цвет
                Оставшееся время: Math.max(0, delayMs - (Date.now() - scheduledAt)) мс
              - Если status === 'delivered':
                Показать "Доставлено в {deliveredAt}" */}
        </div>
      )}

      <div style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '2rem' }}>
        TODO: реализовать интерфейс задания
      </div>
    </div>
  )
}
