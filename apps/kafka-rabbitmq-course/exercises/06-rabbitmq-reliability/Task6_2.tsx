import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 6.2: Consumer Prefetch
// ============================================
//
// Цель: визуализировать влияние prefetchCount (QoS) на распределение
// сообщений между consumers с разной скоростью обработки.
//
// prefetchCount определяет максимальное количество сообщений, которые
// broker может отправить consumer до получения ACK.
// При prefetchCount=1 — строгий round-robin.
// При высоком prefetchCount — быстрый consumer получает больше сообщений.

// TODO: Определи интерфейс ConsumerState:
//   id: number
//   name: string
//   speed: number    — мс на одно сообщение
//   queue: number[]  — слоты in-flight (индексы заполненных)
//   processed: number
//   color: string
// interface ConsumerState { ... }

// TODO: Определи интерфейс QueueMessage:
//   id: number
//   assignedTo: number | null   — id consumer или null (ещё в очереди)
// interface QueueMessage { ... }

export function Task6_2() {
  const { t } = useLanguage()

  // TODO: Объяви состояния:
  //   prefetchCount  — number (по умолчанию 3, диапазон 1-10)
  //   isRunning      — boolean (false)
  //   totalMessages  — number (фиксировано 20, не меняется)
  //   queueMessages  — QueueMessage[] ([])
  //   consumers      — ConsumerState[] (два consumer, см. ниже)
  //   log            — string[] ([])
  //
  // Начальные consumers:
  //   { id: 1, name: 'Consumer-1 (быстрый)', speed: 300,  queue: [], processed: 0, color: '#42a5f5' }
  //   { id: 2, name: 'Consumer-2 (медленный)', speed: 1200, queue: [], processed: 0, color: '#ef9a9a' }
  const [prefetchCount, setPrefetchCount] = useState(3)
  const [isRunning, setIsRunning] = useState(false)
  const [queueMessages, setQueueMessages] = useState<string[]>([])
  const [consumers, setConsumers] = useState<string[]>([])
  const [log, setLog] = useState<string[]>([])

  // TODO: Объяви runningRef = useRef(false)
  //   Используется внутри tick() чтобы избежать stale closure
  const runningRef = useRef(false)

  // TODO: Объяви intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // TODO: Реализуй функцию reset():
  //   1. runningRef.current = false
  //   2. clearInterval(intervalRef.current) если задан
  //   3. Сброси isRunning, queueMessages ([]), log ([])
  //   4. Сброси consumers: те же объекты, но queue: [], processed: 0
  const reset = () => {
    // TODO: реализовать
    console.log('TODO: reset()')
  }

  // TODO: Реализуй функцию runSimulation():
  //   1. Вызови reset()
  //   2. Создай msgs: QueueMessage[] — 20 элементов с id от 1 до 20, assignedTo: null
  //   3. setQueueMessages(msgs)
  //   4. Инициализируй simConsumers (те же 2 consumer с нулями) и setConsumers
  //   5. runningRef.current = true, setIsRunning(true)
  //
  //   6. Создай consState — массив из simConsumers с доп. полями:
  //      inFlight: number (0), nextFreeAt: number (Date.now())
  //
  //   7. let unassigned = [...msgs], let time = 0, simLogs: string[] = []
  //
  //   8. Определи функцию tick():
  //      - Если !runningRef.current — return
  //      - time += 50, now = Date.now()
  //      - Для каждого consState: если inFlight > 0 && now >= nextFreeAt:
  //          * freed = Math.min(inFlight, 1), inFlight -= freed, processed += freed
  //          * setConsumers: обновить processed и queue (Array.from({length: inFlight}))
  //      - Пока unassigned.length > 0:
  //          * Найди consumer = consState.find(c => c.inFlight < prefetchCount)
  //          * Если не найден — break
  //          * msg = unassigned.shift()!
  //          * consumer.inFlight++
  //          * consumer.nextFreeAt = now + consumer.speed * consumer.inFlight
  //          * msg.assignedTo = consumer.id
  //          * Добавь в simLogs строку: `[${time}ms] msg-${msg.id} → ${consumer.name} (in-flight: ${consumer.inFlight}/${prefetchCount})`
  //          * simLogs.length > 30 → simLogs.shift()
  //          * setLog([...simLogs])
  //          * setQueueMessages: обновить assignedTo у msg
  //          * setConsumers: обновить queue у consumer
  //      - Проверь allDone = consState.every(c => c.inFlight === 0) && unassigned.length === 0
  //          * Если true: runningRef.current = false, setIsRunning(false), clearInterval, добавь итог в log
  //
  //   9. intervalRef.current = setInterval(tick, 50)
  const runSimulation = () => {
    // TODO: реализовать
    console.log('TODO: runSimulation()')
  }

  // TODO: Добавь useEffect для очистки intervalRef и runningRef при размонтировании
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      runningRef.current = false
    }
  }, [])

  // TODO: Вычисли unassignedCount и assignedCount из queueMessages
  const unassignedCount = 0
  const assignedCount = 0

  return (
    <div className="exercise-container">
      <h2>{t('task.6.2')}</h2>

      {/* TODO: Панель управления (flexbox row):
          - Range "prefetchCount (QoS): N" от 1 до 10
            Под range: описание режима:
            prefetch=1 → 'Round-robin, равномерно'
            2-4 → 'Умеренный буфер'
            5-7 → 'Большой буфер'
            8+ → 'Высокая параллельность'
          - Кнопка "Запустить симуляцию" (disabled если isRunning)
          - Кнопка "Сброс"
      */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: '#aaa' }}>
            prefetchCount (QoS): {prefetchCount}
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={prefetchCount}
            onChange={(e) => setPrefetchCount(Number(e.target.value))}
            style={{ width: '160px' }}
          />
          {/* TODO: добавить подпись режима под range */}
          <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>
            TODO: подпись для prefetch={prefetchCount}
          </div>
        </div>

        <button onClick={runSimulation} disabled={isRunning} style={{ padding: '0.4rem 0.9rem' }}>
          {isRunning ? 'Симуляция...' : 'Запустить симуляцию'}
        </button>
        <button onClick={reset} style={{ padding: '0.4rem 0.9rem' }}>
          Сброс
        </button>
      </div>

      {/* TODO: Секция очереди — показывать только если queueMessages.length > 0
          Заголовок: "Queue (N ожидают, M распределено):"
          Сетка ячеек (flex wrap, gap 4px), каждая 28x28px:
          - Если assignedTo !== null: background = consumer.color
          - Иначе: background = '#444'
          - title={`msg-N → Consumer-X`} или просто msg-N
          - Текст внутри: m.id (маленький шрифт, белый)
          Под сеткой — легенда: цветные квадратики для каждого consumer + 'Ожидает' (#444)
      */}
      {queueMessages.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.5rem' }}>
            Queue ({unassignedCount} ожидают, {assignedCount} распределено):
          </div>
          <div style={{ color: '#666', fontSize: '0.85rem' }}>
            TODO: отобразить сетку ячеек сообщений
          </div>
        </div>
      )}

      {/* TODO: Секция consumers — flex row, две карточки:
          Для каждого consumer (ConsumerState):
          - Карточка: background '#1e1e1e', border '2px solid consumer.color'
          - Заголовок: consumer.name цветом consumer.color
          - "Скорость: Nмс/сообщение" серым
          - "In-flight: queue.length / prefetchCount" серым
          - Prefetch buffer: Array.from({length: prefetchCount}) квадратиков 20x20px
            * i < queue.length → background = consumer.color
            * иначе → background = '#333'
          - "Обработано: N" белым, жирным
      */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {consumers.length === 0 && (
          <div style={{ color: '#666', fontSize: '0.85rem' }}>
            TODO: отобразить две карточки consumers
          </div>
        )}
      </div>

      {/* TODO: Лог — показывать только если log.length > 0
          Тёмный блок, fontFamily monospace, 0.75rem, maxHeight 160px overflowY auto
          Для каждой строки:
          - Если содержит 'завершена' → color '#66bb6a'
          - Иначе → color '#aaa'
          Показывать последние 20 строк: log.slice(-20)
      */}
      {log.length > 0 && (
        <div style={{ color: '#666', fontSize: '0.8rem', marginBottom: '1rem' }}>
          TODO: лог событий — {log.length} записей
        </div>
      )}

      {/* TODO: Информационный блок (тёмный фон, 0.8rem):
          "Наблюдение: при prefetch=1 сообщения распределяются round-robin, но медленный
           consumer тормозит. При большом prefetch быстрый consumer 'захватывает' больше
           сообщений и обрабатывает их быстрее."
      */}
      <div style={{ marginTop: '1rem', background: '#1e1e1e', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: '#aaa' }}>
        TODO: добавить наблюдение о влиянии prefetchCount на распределение
      </div>
    </div>
  )
}
