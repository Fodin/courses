import { useState, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-2.1.md
// Task description: task-2.1.md
//
// Реализуй параллельную анимацию, которая наглядно показывает разницу между
// Implement a parallel animation that clearly shows the difference between
// синхронной цепочкой вызовов и асинхронной коммуникацией через очередь.
// a synchronous call chain and asynchronous messaging via a queue.
//
// Требования:
// Requirements:
// 1. Два блока рядом: "Синхронный вызов" (слева) и "Асинхронная очередь" (справа)
// 1. Two side-by-side blocks: "Sync Call" (left) and "Async Queue" (right)
// 2. Синхронный блок: цепочка из 4 сервисов (Order → Payment → Inventory → Notification)
// 2. Sync block: chain of 4 services (Order → Payment → Inventory → Notification)
// 3. Каждый сервис проходит состояния: idle → waiting → processing → done
// 3. Each service goes through states: idle → waiting → processing → done
// 4. Синхронная анимация — строго последовательная, каждый ждёт предыдущего
// 4. Sync animation — strictly sequential, each waits for the previous one
// 5. Асинхронный блок: Order Service завершается быстро (~300ms), кладёт сообщение в очередь,
// 5. Async block: Order Service finishes quickly (~300ms), puts a message in the queue,
//    затем workers стартуют параллельно
//    then workers start in parallel
// 6. После завершения — отображать реально измеренное время для каждой модели
// 6. After completion — display actual measured time for each model
// 7. Кнопки заблокированы (disabled) во время выполнения анимации
// 7. Buttons are locked (disabled) while animation is running
// 8. Добавить итоговый вывод-объяснение под обоими блоками
// 8. Add a concluding explanation block below both blocks

// TODO: определи тип ServiceStatus / define type ServiceStatus
// type ServiceStatus = 'idle' | 'waiting' | 'processing' | 'done' | 'error'

// TODO: определи интерфейс ServiceState / define interface ServiceState
// interface ServiceState { name: string; status: ServiceStatus; duration: number }

// TODO: определи объект STATUS_COLORS: Record<ServiceStatus, { bg, border, text }>
// TODO: define STATUS_COLORS: Record<ServiceStatus, { bg, border, text }>
// idle: серый, waiting: жёлтый, processing: синий, done: зелёный, error: красный
// idle: grey, waiting: yellow, processing: blue, done: green, error: red

// TODO: определи объект STATUS_LABELS: Record<ServiceStatus, string>
// TODO: define STATUS_LABELS: Record<ServiceStatus, string>
// Русские метки для каждого статуса / Russian labels for each status

// TODO: определи константу SYNC_SERVICES: ServiceState[]
// TODO: define constant SYNC_SERVICES: ServiceState[]
// [Order(800ms), Payment(1200ms), Inventory(700ms), Notification(500ms)] — все idle
// [Order(800ms), Payment(1200ms), Inventory(700ms), Notification(500ms)] — all idle

// TODO: определи константу ASYNC_SERVICES: ServiceState[]
// TODO: define constant ASYNC_SERVICES: ServiceState[]
// [Order(300ms), Message Queue(100ms), Payment Worker(1200ms), Inventory Worker(700ms)] — все idle
// [Order(300ms), Message Queue(100ms), Payment Worker(1200ms), Inventory Worker(700ms)] — all idle

// TODO: реализуй компонент ServiceBox({ service, isDark })
// TODO: implement ServiceBox({ service, isDark }) component
// Карточка с именем сервиса, цветной рамкой и меткой статуса
// Card with service name, colored border and status label
// При status === 'processing' — анимированный полосой прогресса (animation: 'pulse')
// When status === 'processing' — animated progress bar (animation: 'pulse')
// Цвета применять через transition: 'all 0.3s ease'
// Apply colors via transition: 'all 0.3s ease'

export function Task2_1() {
  const { t } = useLanguage()

  // TODO: добавь состояния / add states:
  // syncServices (ServiceState[]) — копия SYNC_SERVICES / copy of SYNC_SERVICES
  // asyncServices (ServiceState[]) — копия ASYNC_SERVICES / copy of ASYNC_SERVICES
  // syncRunning (boolean), asyncRunning (boolean)
  // syncTime (number | null), asyncTime (number | null)
  // syncDone (boolean), asyncDone (boolean)

  // TODO: добавь useRef для syncStartRef и asyncStartRef (number)
  // TODO: add useRef for syncStartRef and asyncStartRef (number)

  // TODO: реализуй функцию resetSync() / implement resetSync() function
  // Сбрасывает syncServices в idle, syncRunning=false, syncTime=null, syncDone=false
  // Resets syncServices to idle, syncRunning=false, syncTime=null, syncDone=false

  // TODO: реализуй функцию resetAsync() / implement resetAsync() function
  // Аналогично для async-состояний / Similarly for async states

  // TODO: реализуй async функцию runSync() через useCallback
  // TODO: implement async function runSync() via useCallback
  // Алгоритм: / Algorithm:
  // 1. resetSync(), setSyncRunning(true), syncStartRef.current = Date.now()
  // 2. for i in 0..SYNC_SERVICES.length:
  //    setSyncServices: idx < i → 'done', idx === i → 'processing', иначе → 'waiting'
  //    setSyncServices: idx < i → 'done', idx === i → 'processing', else → 'waiting'
  //    await setTimeout(SYNC_SERVICES[i].duration)
  // 3. setSyncServices: все → 'done' / setSyncServices: all → 'done'
  // 4. setSyncTime(Date.now() - syncStartRef.current)
  // 5. setSyncRunning(false), setSyncDone(true)

  // TODO: реализуй async функцию runAsync() через useCallback
  // TODO: implement async function runAsync() via useCallback
  // Алгоритм: / Algorithm:
  // 1. resetAsync(), setAsyncRunning(true), asyncStartRef.current = Date.now()
  // 2. Показать Order Service как processing (остальные idle), await 300ms
  // 2. Show Order Service as processing (others idle), await 300ms
  // 3. Order → done, Message Queue → processing, await 200ms
  // 4. Order и Queue → done, Payment Worker и Inventory Worker → processing
  // 4. Order and Queue → done, Payment Worker and Inventory Worker → processing
  // 5. await Math.max(1200, 700) — дождаться медленнейшего worker
  // 5. await Math.max(1200, 700) — wait for the slowest worker
  // 6. Все → done, setAsyncTime(Date.now() - asyncStartRef.current)
  // 6. All → done, setAsyncTime(Date.now() - asyncStartRef.current)
  // 7. setAsyncRunning(false), setAsyncDone(true)

  return (
    <div className="exercise-container">
      <h2>{t('task.2.1')}</h2>

      {/* TODO: пояснительный текст под заголовком */}
      {/* TODO: explanatory text below the heading */}

      {/* TODO: grid с двумя колонками */}
      {/* TODO: grid with two columns */}

      {/* TODO: левый блок — синхронный */}
      {/* TODO: left block — synchronous */}
      {/* Заголовок "Синхронный вызов" + badge "HTTP/gRPC" (красный) */}
      {/* Heading "Sync Call" + badge "HTTP/gRPC" (red) */}
      {/* syncServices.map: ServiceBox + стрелка ↓ между ними */}
      {/* syncServices.map: ServiceBox + arrow ↓ between them */}
      {/* Если syncDone && syncTime !== null: зелёная плашка с временем */}
      {/* If syncDone && syncTime !== null: green banner with time */}
      {/* Кнопка "Запустить синхронно" (disabled при syncRunning) */}
      {/* Button "Run Synchronously" (disabled when syncRunning) */}

      {/* TODO: правый блок — асинхронный */}
      {/* TODO: right block — asynchronous */}
      {/* Заголовок "Асинхронная очередь" + badge "Message Queue" (зелёный) */}
      {/* Heading "Async Queue" + badge "Message Queue" (green) */}
      {/* asyncServices.map: ServiceBox + разделитель (↓ или ↤ ↦ после queue) */}
      {/* asyncServices.map: ServiceBox + separator (↓ or ↤ ↦ after queue) */}
      {/* Если asyncDone && asyncTime !== null: зелёная плашка с временем */}
      {/* If asyncDone && asyncTime !== null: green banner with time */}
      {/* Кнопка "Запустить асинхронно" (disabled при asyncRunning) */}
      {/* Button "Run Asynchronously" (disabled when asyncRunning) */}

      {/* TODO: блок с ключевым выводом */}
      {/* TODO: key takeaway block */}
      {/* Показывать всегда (не зависит от состояния анимации) */}
      {/* Show always (independent of animation state) */}
      {/* Текст: Order Service заблокирован в sync vs. возвращает немедленно в async */}
      {/* Text: Order Service is blocked in sync vs. returns immediately in async */}
    </div>
  )
}
