import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.3: requestIdleCallback — фоновая работа
// Task 11.3: requestIdleCallback — background work
// ============================================
// Обработайте 10 000 элементов двумя способами:
// Process 10,000 items in two ways:
//   1. Синхронно — всё за один вызов (UI замерзает)
//   1. Synchronously — all in one call (UI freezes)
//   2. Через requestIdleCallback — чанками в idle-время (UI не тормозит)
//   2. Via requestIdleCallback — in chunks during idle time (UI stays responsive)
// Покажите прогресс, анимацию-индикатор и лог idle-периодов.
// Show progress, animation indicator, and idle period log.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Запись об одном idle-периоде / Record for one idle period
interface IdleEntry {
  id: number        // Порядковый номер / Sequential number
  items: number     // Обработано элементов / Items processed in this period
  remaining: number // timeRemaining() при старте / timeRemaining() at start
}

// -----------------------------------------------
// Константы / Constants
// -----------------------------------------------
const TOTAL = 10000 // Всего элементов для обработки / Total items to process

// -----------------------------------------------
// Вспомогательная функция симуляции работы
// Helper function to simulate work
// -----------------------------------------------
// Имитирует "тяжёлую" обработку одного элемента
// Simulates "heavy" processing of one item
function processItem(i: number): number {
  // Не упрощайте — нагрузка должна быть ощутимой!
  // Don't simplify — the load must be noticeable!
  if (i % 100 === 0) {
    const arr = Array.from({ length: 100 }, (_, k) => k * Math.random())
    arr.sort()
  }
  return Math.sqrt(i * 17 + Math.sin(i) * 100)
}

export function Task11_3() {
  const { t } = useLanguage()

  // TODO: Состояние
  // TODO: State
  // - mode: 'sync' | 'ric' | null — текущий режим (null = не запущено)
  // - progress: number — прогресс 0..100
  // - processed: number — обработано элементов
  // - done: boolean — завершена ли задача
  // - totalTime: number — общее время в ms
  // - animAngle: number — угол вращения спиннера (0..360)
  // - idleLog: IdleEntry[] — лог idle-периодов (только в rIC-режиме)

  // TODO: Refs
  // TODO: Refs
  // - animRef: useRef<number | null> — id rAF спиннера
  // - ricRef: useRef<number | null> — id requestIdleCallback
  // - runningRef: useRef<boolean> — флаг работы
  // - startTimeRef: useRef<number> — время начала
  // - idleChunkIdRef: useRef<number> — счётчик idle-периодов

  // -----------------------------------------------
  // TODO: Реализуйте startAnim() и stopAnim()
  // TODO: Implement startAnim() and stopAnim()
  // -----------------------------------------------
  // startAnim: запустить rAF-цикл, который каждый кадр увеличивает angle на 3° и обновляет animAngle
  // startAnim: start rAF loop that each frame increments angle by 3° and updates animAngle
  // stopAnim: cancelAnimationFrame(animRef.current)

  // -----------------------------------------------
  // TODO: Реализуйте runSync()
  // TODO: Implement runSync()
  // -----------------------------------------------
  // 1. setMode('sync'), сбросить прогресс, запустить startAnim()
  // 2. setTimeout(() => {
  //      // Синхронный цикл по всем TOTAL элементам
  //      for (let i = 0; i < TOTAL; i++) processItem(i)
  //      // Зафиксировать время, setDone(true), stopAnim()
  //    }, 0)

  // -----------------------------------------------
  // TODO: Реализуйте runRIC()
  // TODO: Implement runRIC()
  // -----------------------------------------------
  // 1. setMode('ric'), сбросить прогресс, запустить startAnim()
  // 2. Объявить cursor = 0
  // 3. Функция idleWork(deadline: IdleDeadline):
  //    - Зафиксировать remaining = Math.round(deadline.timeRemaining())
  //    - Работать пока cursor < TOTAL && deadline.timeRemaining() > 1:
  //        processItem(cursor++)
  //    - Добавить запись в idleLog (последние 10)
  //    - Обновить processed и progress
  //    - Если cursor < TOTAL:
  //        ricRef.current = requestIdleCallback(idleWork, { timeout: 2000 })
  //    - Иначе: зафиксировать время, setDone(true), stopAnim()
  // 4. ricRef.current = requestIdleCallback(idleWork, { timeout: 2000 })

  // TODO: Реализуйте reset()
  // TODO: Implement reset()

  // TODO: useEffect для cleanup при размонтировании
  // TODO: useEffect for cleanup on unmount

  const isRunning = false // TODO: вычислить из mode и done / compute from mode and done

  return (
    <div className="exercise-container">
      <h2>{t('task.11.3')}</h2>

      {/* TODO: Спиннер */}
      {/* TODO: Spinner */}
      {/* div с border-top цветным, transform: rotate(animAngle + 'deg') */}
      {/* div with colored border-top, transform: rotate(animAngle + 'deg') */}
      {/* Подпись: "замер!" при sync+running, "крутится" при ric+running */}
      {/* Label: "frozen!" when sync+running, "spinning" when ric+running */}

      {/* TODO: Прогресс-бар */}
      {/* TODO: Progress bar */}
      {/* processed / TOTAL, width = progress + '%' */}
      {/* Цвет: красный для sync, зелёный для ric */}
      {/* Color: red for sync, green for ric */}

      {/* TODO: Лог idle-периодов (только в rIC-режиме) */}
      {/* TODO: Idle period log (only in rIC mode) */}
      {/* idleLog.map — для каждой записи: id, полоска remaining, количество элементов */}
      {/* idleLog.map — for each entry: id, remaining bar, item count */}

      {/* TODO: Кнопки */}
      {/* TODO: Buttons */}
      {/* "Синхронно" — красный, disabled во время работы */}
      {/* "Synchronously" — red, disabled during work */}
      {/* "Через rIC" — зелёный, disabled во время работы */}
      {/* "Via rIC" — green, disabled during work */}
      {/* "Сброс" — всегда доступен */}
      {/* "Reset" — always available */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте демонстрацию requestIdleCallback
      </div>
    </div>
  )
}
