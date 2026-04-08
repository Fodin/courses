import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-2.2.md
//
// Реализуй интерактивный симулятор Point-to-Point очереди с Competing Consumers.
// Каждое сообщение достаётся ровно одному consumer — это ключевое свойство P2P.
//
// Требования:
// 1. Очередь сообщений с отображением текущего числа ожидающих
// 2. Кнопка "Отправить сообщение" — ручное добавление в очередь
// 3. Кнопка "Авто-поток" — автоматическая публикация раз в 800ms (on/off)
// 4. Минимум 2 consumers с состояниями: "свободен" / "занят"
// 5. Свободный consumer автоматически берёт первое сообщение (~1500ms обработки)
// 6. Занятый consumer НЕ берёт новые сообщения — они копятся в очереди
// 7. Кнопки "+ Consumer" и "- Consumer" (макс. 4, мин. 1)
// 8. Нельзя удалить занятого consumer
// 9. Лог событий с временными метками (кто отправил, кто забрал, кто завершил)
// 10. Счётчик "Обработано" для каждого consumer
// 11. Ни одно сообщение НЕ попадает к двум consumers одновременно

// TODO: определи интерфейс Message
// interface Message { id: number; text: string; status: 'in-queue' | 'processing' | 'done'; consumerId?: number }

// TODO: определи интерфейс Consumer
// interface Consumer { id: number; name: string; busy: boolean; processedCount: number }

export function Task2_2() {
  const { t } = useLanguage()

  // TODO: добавь состояние queue (Message[]) — пустой массив
  // TODO: добавь состояние consumers (Consumer[]) — два начальных: Consumer A, Consumer B
  // TODO: добавь состояние history (string[]) — лог событий
  // TODO: добавь состояние msgCounter (number) — счётчик для номеров сообщений
  // TODO: добавь состояние autoProducing (boolean)

  // TODO: добавь useRef autoRef для хранения setInterval-таймера авто-потока

  // TODO: реализуй функцию pushMessage(text?: string) через useCallback
  // 1. Формирует текст: text ?? `Order #${msgCounter}`
  // 2. Инкрементирует msgCounter
  // 3. Добавляет сообщение в queue со статусом 'in-queue'
  // 4. Пишет в history: `[HH:MM:SS] Producer -> Queue: "Order #N"`

  // TODO: реализуй polling-механизм через useEffect + setInterval (каждые 300ms)
  // При каждом тике:
  // 1. Найди первое сообщение со статусом 'in-queue'
  // 2. Найди первого свободного consumer (busy === false)
  // 3. Если оба найдены:
  //    - Обнови consumer: busy = true
  //    - Обнови сообщение: status = 'processing', consumerId = consumer.id
  //    - Запиши в history: `[time] Consumer X <- Queue: "..."`
  //    - Через 1500ms:
  //        * Удали сообщение из queue (filter по id)
  //        * Обнови consumer: busy = false, processedCount++
  //        * Запиши в history: `[time] Consumer X DONE: "..."`
  // Очищай interval в cleanup функции useEffect

  // TODO: реализуй функцию toggleAutoProducing()
  // Если включён — clearInterval(autoRef.current), setAutoProducing(false)
  // Если выключен — setInterval каждые 800ms с вызовом pushMessage(), setAutoProducing(true)

  // TODO: реализуй функцию addConsumer()
  // Добавляет нового consumer (макс. 4), имя по следующей букве (A, B, C, D)
  // Использует setConsumers с проверкой prev.length < 4

  // TODO: реализуй функцию removeConsumer()
  // Удаляет последнего consumer (мин. 1), только если он не занят
  // Использует setConsumers с проверкой !last.busy && prev.length > 1

  return (
    <div className="exercise-container">
      <h2>{t('task.2.2')}</h2>

      {/* TODO: панель управления — кнопки в одну строку */}
      {/* [Отправить сообщение] [Авто-поток ON/OFF] [+ Consumer] [- Consumer] */}
      {/* "Авто-поток" — зелёный если включён, серый если выключен */}

      {/* TODO: секция очереди */}
      {/* Заголовок: "Очередь" + счётчик `(N ожидают)` */}
      {/* queue.filter(m => m.status === 'in-queue').map — плашки сообщений */}
      {/* Если очередь пуста — текст "(пусто)" */}

      {/* TODO: секция consumers */}
      {/* consumers.map — карточка каждого consumer */}
      {/* Карточка: имя, статус (свободен/занят), processedCount */}
      {/* Если consumer.busy — показать "обрабатывает" + текст обрабатываемого сообщения */}
      {/* Цвет рамки: зелёный если свободен, оранжевый если занят */}

      {/* TODO: лог событий */}
      {/* Заголовок "Лог событий" */}
      {/* Прокручиваемый блок (max-height: 200px, overflow-y: auto) */}
      {/* history.map — моноширинный текст с временными метками */}
      {/* Если лог пуст — "(нет событий)" */}
    </div>
  )
}
