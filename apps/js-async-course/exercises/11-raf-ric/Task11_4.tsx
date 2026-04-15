import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.4: Планировщик задач с тремя очередями
// Task 11.4: Task scheduler with three queues
// ============================================
// Реализуйте визуальный планировщик с тремя очередями:
// Implement a visual scheduler with three queues:
//   - Urgent (срочные): выполняются каждый кадр полностью
//   - Urgent: processed completely every frame
//   - Animation (rAF): до 2 задач за кадр
//   - Animation (rAF): up to 2 tasks per frame
//   - Background (rIC): только в idle-время
//   - Background (rIC): only during idle time
// Покажите timeline выполнения и приоритет очередей.
// Show execution timeline and queue priority.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

type TaskType = 'urgent' | 'animation' | 'background'

interface ScheduledTask {
  id: number
  type: TaskType
  label: string
  status: 'pending' | 'done'
}

interface TimelineEntry {
  frameId: number
  tasks: Array<{ type: TaskType; label: string }>
}

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// Конфигурация очередей / Queue configuration
const TYPE_CONFIG: Record<TaskType, {
  color: string
  bg: string
  label: string
  api: string
  taskLabels: string[]
}> = {
  urgent: {
    color: '#ef4444',
    bg: '#450a0a',
    label: 'Срочные',
    api: 'queueMicrotask / sync',
    taskLabels: ['Обновить DOM', 'Синхр. состояние', 'Критичный рендер', 'Flush буфера'],
  },
  animation: {
    color: '#8b5cf6',
    bg: '#2e1065',
    label: 'Анимация',
    api: 'requestAnimationFrame',
    taskLabels: ['Animate sprite', 'Scroll parallax', 'Canvas draw', 'CSS transition'],
  },
  background: {
    color: '#10b981',
    bg: '#052e16',
    label: 'Фоновые',
    api: 'requestIdleCallback',
    taskLabels: ['Prefetch данных', 'Индексировать', 'Сжать изображение', 'Логировать'],
  },
}

export function Task11_4() {
  const { t } = useLanguage()

  // TODO: Состояние
  // TODO: State
  // - tasks: ScheduledTask[] — все задачи (pending + done)
  // - timeline: TimelineEntry[] — последние 5 записей (новые сверху)
  // - stats: { urgent: number, animation: number, background: number } — выполнено
  // - running: boolean
  // - frameId: number — номер текущего кадра

  // TODO: Refs
  // TODO: Refs
  // - taskIdRef: useRef<number>(0) — счётчик id задач
  // - urgentQueueRef: useRef<ScheduledTask[]>([]) — очередь срочных
  // - animQueueRef: useRef<ScheduledTask[]>([]) — очередь анимации
  // - bgQueueRef: useRef<ScheduledTask[]>([]) — очередь фоновых
  // - rafRef: useRef<number | null> — id requestAnimationFrame
  // - ricRef: useRef<number | null> — id requestIdleCallback
  // - runningRef: useRef<boolean>
  // - frameIdRef: useRef<number>(0)

  // -----------------------------------------------
  // TODO: Реализуйте addTask(type: TaskType)
  // TODO: Implement addTask(type: TaskType)
  // -----------------------------------------------
  // 1. Создать задачу: { id: ++taskIdRef.current, type, label, status: 'pending' }
  //    Выбрать label из TYPE_CONFIG[type].taskLabels по id % length
  // 2. Добавить в соответствующую очередь (urgentQueueRef/animQueueRef/bgQueueRef)
  // 3. setTasks(prev => [...prev, task])

  // -----------------------------------------------
  // TODO: Реализуйте processFrame()
  // TODO: Implement processFrame()
  // -----------------------------------------------
  // Вызывается через requestAnimationFrame. Логика одного кадра:
  // Called via requestAnimationFrame. Logic of one frame:
  //
  // 1. Проверить runningRef.current
  // 2. Увеличить frameIdRef.current, обновить setFrameId
  //
  // 3. СРОЧНЫЕ: забрать ВСЕ из urgentQueueRef.current (splice(0)):
  //    - Добавить в frameTasks с type: 'urgent'
  //    - Пометить как done в tasks state
  //    - Увеличить stats.urgent
  //
  // 4. АНИМАЦИЯ: забрать первые 2 из animQueueRef.current (splice(0, 2)):
  //    - Аналогично добавить в frameTasks и обновить state
  //    - Увеличить stats.animation
  //
  // 5. Если frameTasks.length > 0 — добавить запись в timeline (последние 5, новые сверху)
  //
  // 6. Запланировать следующий кадр: rafRef.current = requestAnimationFrame(processFrame)
  //
  // 7. ФОНОВЫЕ: если bgQueueRef.current.length > 0 && ricRef.current === null:
  //    ricRef.current = requestIdleCallback((deadline) => {
  //      ricRef.current = null
  //      const batch = []
  //      while (bgQueueRef.current.length > 0 && deadline.timeRemaining() > 2) {
  //        batch.push(bgQueueRef.current.shift()!)
  //      }
  //      // Обновить tasks, stats.background, timeline для batch
  //    }, { timeout: 3000 })

  // -----------------------------------------------
  // TODO: Реализуйте start() и stop()
  // TODO: Implement start() and stop()
  // -----------------------------------------------
  // start: runningRef.current = true, setRunning(true), frameIdRef.current = 0
  //        rafRef.current = requestAnimationFrame(processFrame)
  // stop:  runningRef.current = false, setRunning(false)
  //        cancelAnimationFrame(rafRef.current)
  //        cancelIdleCallback(ricRef.current) если есть
  //        rafRef.current = null, ricRef.current = null

  // TODO: Реализуйте reset()
  // TODO: Implement reset()
  // Вызвать stop(), очистить все очереди и state

  // TODO: useEffect для cleanup при размонтировании
  // TODO: useEffect for cleanup on unmount

  return (
    <div className="exercise-container">
      <h2>{t('task.11.4')}</h2>

      {/* TODO: Три колонки с очередями */}
      {/* TODO: Three queue columns */}
      {/* Для каждого type из TYPE_CONFIG: */}
      {/* For each type in TYPE_CONFIG: */}
      {/*   - Заголовок + бейдж с количеством pending задач */}
      {/*   - Header + badge with pending task count */}
      {/*   - Список до 4 pending задач */}
      {/*   - List of up to 4 pending tasks */}
      {/*   - Кнопка "+ Добавить" */}
      {/*   - "+ Add" button */}
      {/*   - Счётчик выполненных */}
      {/*   - Completed counter */}

      {/* TODO: Timeline последних кадров */}
      {/* TODO: Recent frames timeline */}
      {/* timeline.map — для каждой записи: номер кадра + цветные теги задач */}
      {/* timeline.map — for each entry: frame number + colored task tags */}

      {/* TODO: Планка приоритетов */}
      {/* TODO: Priority bar */}
      {/* Urgent > Animation > Background */}

      {/* TODO: Кнопки управления */}
      {/* TODO: Control buttons */}
      {/* Запустить / Остановить / Сброс */}
      {/* Start / Stop / Reset */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте планировщик с тремя очередями задач
      </div>
    </div>
  )
}
