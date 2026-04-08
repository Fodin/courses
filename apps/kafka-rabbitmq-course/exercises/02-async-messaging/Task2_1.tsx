import { useState, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-2.1.md
//
// Реализуй параллельную анимацию, которая наглядно показывает разницу между
// синхронной цепочкой вызовов и асинхронной коммуникацией через очередь.
//
// Требования:
// 1. Два блока рядом: "Синхронный вызов" (слева) и "Асинхронная очередь" (справа)
// 2. Синхронный блок: цепочка из 4 сервисов (Order → Payment → Inventory → Notification)
// 3. Каждый сервис проходит состояния: idle → waiting → processing → done
// 4. Синхронная анимация — строго последовательная, каждый ждёт предыдущего
// 5. Асинхронный блок: Order Service завершается быстро (~300ms), кладёт сообщение в очередь,
//    затем workers стартуют параллельно
// 6. После завершения — отображать реально измеренное время для каждой модели
// 7. Кнопки заблокированы (disabled) во время выполнения анимации
// 8. Добавить итоговый вывод-объяснение под обоими блоками

// TODO: определи тип ServiceStatus
// type ServiceStatus = 'idle' | 'waiting' | 'processing' | 'done' | 'error'

// TODO: определи интерфейс ServiceState
// interface ServiceState { name: string; status: ServiceStatus; duration: number }

// TODO: определи объект STATUS_COLORS: Record<ServiceStatus, { bg, border, text }>
// idle: серый, waiting: жёлтый, processing: синий, done: зелёный, error: красный

// TODO: определи объект STATUS_LABELS: Record<ServiceStatus, string>
// Русские метки для каждого статуса

// TODO: определи константу SYNC_SERVICES: ServiceState[]
// [Order(800ms), Payment(1200ms), Inventory(700ms), Notification(500ms)] — все idle

// TODO: определи константу ASYNC_SERVICES: ServiceState[]
// [Order(300ms), Message Queue(100ms), Payment Worker(1200ms), Inventory Worker(700ms)] — все idle

// TODO: реализуй компонент ServiceBox({ service, isDark })
// Карточка с именем сервиса, цветной рамкой и меткой статуса
// При status === 'processing' — анимированный полосой прогресса (animation: 'pulse')
// Цвета применять через transition: 'all 0.3s ease'

export function Task2_1() {
  const { t } = useLanguage()

  // TODO: добавь состояния:
  // syncServices (ServiceState[]) — копия SYNC_SERVICES
  // asyncServices (ServiceState[]) — копия ASYNC_SERVICES
  // syncRunning (boolean), asyncRunning (boolean)
  // syncTime (number | null), asyncTime (number | null)
  // syncDone (boolean), asyncDone (boolean)

  // TODO: добавь useRef для syncStartRef и asyncStartRef (number)

  // TODO: реализуй функцию resetSync()
  // Сбрасывает syncServices в idle, syncRunning=false, syncTime=null, syncDone=false

  // TODO: реализуй функцию resetAsync()
  // Аналогично для async-состояний

  // TODO: реализуй async функцию runSync() через useCallback
  // Алгоритм:
  // 1. resetSync(), setSyncRunning(true), syncStartRef.current = Date.now()
  // 2. for i in 0..SYNC_SERVICES.length:
  //    setSyncServices: idx < i → 'done', idx === i → 'processing', иначе → 'waiting'
  //    await setTimeout(SYNC_SERVICES[i].duration)
  // 3. setSyncServices: все → 'done'
  // 4. setSyncTime(Date.now() - syncStartRef.current)
  // 5. setSyncRunning(false), setSyncDone(true)

  // TODO: реализуй async функцию runAsync() через useCallback
  // Алгоритм:
  // 1. resetAsync(), setAsyncRunning(true), asyncStartRef.current = Date.now()
  // 2. Показать Order Service как processing (остальные idle), await 300ms
  // 3. Order → done, Message Queue → processing, await 200ms
  // 4. Order и Queue → done, Payment Worker и Inventory Worker → processing
  // 5. await Math.max(1200, 700) — дождаться медленнейшего worker
  // 6. Все → done, setAsyncTime(Date.now() - asyncStartRef.current)
  // 7. setAsyncRunning(false), setAsyncDone(true)

  return (
    <div className="exercise-container">
      <h2>{t('task.2.1')}</h2>

      {/* TODO: пояснительный текст под заголовком */}

      {/* TODO: grid с двумя колонками */}

      {/* TODO: левый блок — синхронный */}
      {/* Заголовок "Синхронный вызов" + badge "HTTP/gRPC" (красный) */}
      {/* syncServices.map: ServiceBox + стрелка ↓ между ними */}
      {/* Если syncDone && syncTime !== null: зелёная плашка с временем */}
      {/* Кнопка "Запустить синхронно" (disabled при syncRunning) */}

      {/* TODO: правый блок — асинхронный */}
      {/* Заголовок "Асинхронная очередь" + badge "Message Queue" (зелёный) */}
      {/* asyncServices.map: ServiceBox + разделитель (↓ или ↤ ↦ после queue) */}
      {/* Если asyncDone && asyncTime !== null: зелёная плашка с временем */}
      {/* Кнопка "Запустить асинхронно" (disabled при asyncRunning) */}

      {/* TODO: блок с ключевым выводом */}
      {/* Показывать всегда (не зависит от состояния анимации) */}
      {/* Текст: Order Service заблокирован в sync vs. возвращает немедленно в async */}
    </div>
  )
}
