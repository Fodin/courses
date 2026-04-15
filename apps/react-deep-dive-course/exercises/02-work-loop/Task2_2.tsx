import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// Планировщик задач с приоритетами — аналог React Scheduler

// Четыре приоритета, как в React Scheduler
type Priority = 'Sync' | 'UserBlocking' | 'Normal' | 'Idle'

// TODO: Заполнить таймауты для каждого приоритета
// Sync: мгновенно (-1), UserBlocking: 250ms, Normal: 5000ms, Idle: Infinity
const TIMEOUTS: Record<Priority, number> = {
  Sync: 0,        // TODO: исправить
  UserBlocking: 0, // TODO: исправить
  Normal: 0,       // TODO: исправить
  Idle: 0,         // TODO: исправить
}

// TODO: Заполнить цвета приоритетов
const PRIORITY_COLORS: Record<Priority, string> = {
  Sync: '#000000',        // TODO: красный
  UserBlocking: '#000000', // TODO: оранжевый
  Normal: '#000000',       // TODO: синий
  Idle: '#000000',         // TODO: серый
}

type Task = {
  id: string
  label: string
  priority: Priority
  createdAt: number
  expirationTime: number  // createdAt + timeout (или Infinity для Idle)
}

type LogEntry = {
  id: string
  label: string
  priority: Priority
  processedAt: number
}

let taskCounter = 0

export function Task2_2() {
  const { t } = useLanguage()

  // TODO: Хранить очередь задач (Task[]), отсортированную по expirationTime
  // const [queue, setQueue] = useState<Task[]>([])

  // TODO: Хранить лог обработанных задач (LogEntry[]), до 10 записей
  // const [log, setLog] = useState<LogEntry[]>([])

  // TODO: Хранить текущее время для отображения "осталось N ms"
  // const [now, setNow] = useState(Date.now())

  // TODO: useEffect — обновлять now каждые 250ms через setInterval

  // TODO: Реализовать addTask(priority: Priority):
  // 1. taskCounter++, label = `${priority} #${taskCounter}`
  // 2. Вычислить expirationTime = Date.now() + TIMEOUTS[priority] (или Infinity для Idle)
  // 3. Если priority === 'Sync': мгновенно добавить в лог (не в очередь)
  // 4. Иначе: добавить Task в очередь, отсортировать по expirationTime
  // 5. Через setTimeout(fn, TIMEOUTS[priority]) — обработать задачу (убрать из очереди, добавить в лог)

  // TODO: Реализовать formatTimeLeft(expirationTime: number): string
  // - Infinity → 'без дедлайна'
  // - diff <= 0 → 'просрочена'
  // - diff < 1000 → `${diff}ms`
  // - иначе → `${(diff / 1000).toFixed(1)}s`

  const PRIORITIES: Priority[] = ['Sync', 'UserBlocking', 'Normal', 'Idle']

  return (
    <div className="exercise-container">
      <h2>{t('task.2.2')}</h2>

      {/* TODO: 4 кнопки добавления задач + кнопка "Очистить" */}
      {/* Каждая кнопка: background = PRIORITY_COLORS[priority], label = "+ {priority}" */}

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '20px' }}>
        {/* TODO: Очередь (слева) */}
        {/* Список задач, отсортированный по expirationTime */}
        {/* Каждая задача: цветная точка, имя, время до дедлайна */}
        {/* Если очередь пуста — заглушка */}

        {/* TODO: Лог (справа) */}
        {/* Последние 10 обработанных задач */}
        {/* Каждая запись: ✓ + имя + время обработки */}
        {/* Если лог пуст — заглушка */}
      </div>

      <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '16px' }}>
        Реализуй TIMEOUTS, PRIORITY_COLORS и addTask
      </p>
    </div>
  )
}
