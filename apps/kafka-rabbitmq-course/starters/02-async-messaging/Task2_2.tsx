import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-2.2.md
// Task description: task-2.2.md
//
// Реализуй интерактивный симулятор Point-to-Point очереди с Competing Consumers.
// Implement an interactive Point-to-Point queue simulator with Competing Consumers.
// Каждое сообщение достаётся ровно одному consumer — это ключевое свойство P2P.
// Each message is delivered to exactly one consumer — this is the key property of P2P.
//
// Требования:
// Requirements:
// 1. Очередь сообщений с отображением текущего числа ожидающих
// 1. Message queue displaying the current number of pending messages
// 2. Кнопка "Отправить сообщение" — ручное добавление в очередь
// 2. "Send Message" button — manual addition to the queue
// 3. Кнопка "Авто-поток" — автоматическая публикация раз в 800ms (on/off)
// 3. "Auto-flow" button — automatic publishing every 800ms (on/off)
// 4. Минимум 2 consumers с состояниями: "свободен" / "занят"
// 4. At least 2 consumers with states: "free" / "busy"
// 5. Свободный consumer автоматически берёт первое сообщение (~1500ms обработки)
// 5. A free consumer automatically picks up the first message (~1500ms processing)
// 6. Занятый consumer НЕ берёт новые сообщения — они копятся в очереди
// 6. A busy consumer does NOT pick up new messages — they accumulate in the queue
// 7. Кнопки "+ Consumer" и "- Consumer" (макс. 4, мин. 1)
// 7. "+ Consumer" and "- Consumer" buttons (max 4, min 1)
// 8. Нельзя удалить занятого consumer
// 8. Cannot remove a busy consumer
// 9. Лог событий с временными метками (кто отправил, кто забрал, кто завершил)
// 9. Event log with timestamps (who sent, who picked up, who completed)
// 10. Счётчик "Обработано" для каждого consumer
// 10. "Processed" counter for each consumer
// 11. Ни одно сообщение НЕ попадает к двум consumers одновременно
// 11. No message is delivered to two consumers simultaneously

// TODO: определи интерфейс Message / define Message interface
// interface Message { id: number; text: string; status: 'in-queue' | 'processing' | 'done'; consumerId?: number }

// TODO: определи интерфейс Consumer / define Consumer interface
// interface Consumer { id: number; name: string; busy: boolean; processedCount: number }

export function Task2_2() {
  const { t } = useLanguage()

  // TODO: добавь состояние queue (Message[]) — пустой массив
  // TODO: add state queue (Message[]) — empty array
  // TODO: добавь состояние consumers (Consumer[]) — два начальных: Consumer A, Consumer B
  // TODO: add state consumers (Consumer[]) — two initial: Consumer A, Consumer B
  // TODO: добавь состояние history (string[]) — лог событий
  // TODO: add state history (string[]) — event log
  // TODO: добавь состояние msgCounter (number) — счётчик для номеров сообщений
  // TODO: add state msgCounter (number) — counter for message numbers
  // TODO: добавь состояние autoProducing (boolean)
  // TODO: add state autoProducing (boolean)

  // TODO: добавь useRef autoRef для хранения setInterval-таймера авто-потока
  // TODO: add useRef autoRef for storing the auto-flow setInterval timer

  // TODO: реализуй функцию pushMessage(text?: string) через useCallback
  // TODO: implement pushMessage(text?: string) function via useCallback
  // 1. Формирует текст: text ?? `Order #${msgCounter}`
  // 1. Form text: text ?? `Order #${msgCounter}`
  // 2. Инкрементирует msgCounter
  // 2. Increment msgCounter
  // 3. Добавляет сообщение в queue со статусом 'in-queue'
  // 3. Add message to queue with status 'in-queue'
  // 4. Пишет в history: `[HH:MM:SS] Producer -> Queue: "Order #N"`
  // 4. Write to history: `[HH:MM:SS] Producer -> Queue: "Order #N"`

  // TODO: реализуй polling-механизм через useEffect + setInterval (каждые 300ms)
  // TODO: implement polling mechanism via useEffect + setInterval (every 300ms)
  // При каждой тике:
  // On each tick:
  // 1. Найди первое сообщение со статусом 'in-queue'
  // 1. Find the first message with status 'in-queue'
  // 2. Найди первого свободного consumer (busy === false)
  // 2. Find the first free consumer (busy === false)
  // 3. Если оба найдены:
  // 3. If both found:
  //    - Обнови consumer: busy = true
  //    - Update consumer: busy = true
  //    - Обнови сообщение: status = 'processing', consumerId = consumer.id
  //    - Update message: status = 'processing', consumerId = consumer.id
  //    - Запиши в history: `[time] Consumer X <- Queue: "..."`
  //    - Write to history: `[time] Consumer X <- Queue: "..."`
  //    - Через 1500ms:
  //    - After 1500ms:
  //        * Удали сообщение из queue (filter по id)
  //        * Remove message from queue (filter by id)
  //        * Обнови consumer: busy = false, processedCount++
  //        * Update consumer: busy = false, processedCount++
  //        * Запиши в history: `[time] Consumer X DONE: "..."`
  //        * Write to history: `[time] Consumer X DONE: "..."`
  // Очищай interval в cleanup функции useEffect
  // Clear interval in useEffect cleanup function

  // TODO: реализуй функцию toggleAutoProducing()
  // TODO: implement toggleAutoProducing() function
  // Если включён — clearInterval(autoRef.current), setAutoProducing(false)
  // If enabled — clearInterval(autoRef.current), setAutoProducing(false)
  // Если выключен — setInterval каждые 800ms с вызовом pushMessage(), setAutoProducing(true)
  // If disabled — setInterval every 800ms calling pushMessage(), setAutoProducing(true)

  // TODO: реализуй функцию addConsumer()
  // TODO: implement addConsumer() function
  // Добавляет нового consumer (макс. 4), имя по следующей букве (A, B, C, D)
  // Adds a new consumer (max 4), name by next letter (A, B, C, D)
  // Использует setConsumers с проверкой prev.length < 4
  // Uses setConsumers with check prev.length < 4

  // TODO: реализуй функцию removeConsumer()
  // TODO: implement removeConsumer() function
  // Удаляет последнего consumer (мин. 1), только если он не занят
  // Removes the last consumer (min 1), only if it is not busy
  // Использует setConsumers с проверкой !last.busy && prev.length > 1
  // Uses setConsumers with check !last.busy && prev.length > 1

  return (
    <div className="exercise-container">
      <h2>{t('task.2.2')}</h2>

      {/* TODO: панель управления — кнопки в одну строку */}
      {/* TODO: control panel — buttons in one row */}
      {/* [Отправить сообщение] [Авто-поток ON/OFF] [+ Consumer] [- Consumer] */}
      {/* [Send Message] [Auto-flow ON/OFF] [+ Consumer] [- Consumer] */}
      {/* "Авто-поток" — зелёный если включён, серый если выключен */}
      {/* "Auto-flow" — green if enabled, grey if disabled */}

      {/* TODO: секция очереди */}
      {/* TODO: queue section */}
      {/* Заголовок: "Очередь" + счётчик `(N ожидают)` */}
      {/* Heading: "Queue" + counter `(N pending)` */}
      {/* queue.filter(m => m.status === 'in-queue').map — плашки сообщений */}
      {/* queue.filter(m => m.status === 'in-queue').map — message bars */}
      {/* Если очередь пуста — текст "(пусто)" */}
      {/* If queue is empty — text "(empty)" */}

      {/* TODO: секция consumers */}
      {/* TODO: consumers section */}
      {/* consumers.map — карточка каждого consumer */}
      {/* consumers.map — card for each consumer */}
      {/* Карточка: имя, статус (свободен/занят), processedCount */}
      {/* Card: name, status (free/busy), processedCount */}
      {/* Если consumer.busy — показать "обрабатывает" + текст обрабатываемого сообщения */}
      {/* If consumer.busy — show "processing" + text of the message being processed */}
      {/* Цвет рамки: зелёный если свободен, оранжевый если занят */}
      {/* Border color: green if free, orange if busy */}

      {/* TODO: лог событий */}
      {/* TODO: event log */}
      {/* Заголовок "Лог событий" */}
      {/* Heading "Event Log" */}
      {/* Прокручиваемый блок (max-height: 200px, overflow-y: auto) */}
      {/* Scrollable block (max-height: 200px, overflow-y: auto) */}
      {/* history.map — моноширинный текст с временными метками */}
      {/* history.map — monospace text with timestamps */}
      {/* Если лог пуст — "(нет событий)" */}
      {/* If log is empty — "(no events)" */}
    </div>
  )
}
