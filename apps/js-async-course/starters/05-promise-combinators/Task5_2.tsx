import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.2: Promise.allSettled — ждём всех
// Task 5.2: Promise.allSettled — wait for all
// ============================================
// Реализуйте визуализацию Promise.allSettled.
// Implement a Promise.allSettled visualization.
//
// Ключевое отличие от Promise.all / Key difference from Promise.all:
// - allSettled ВСЕГДА ждёт всех промисов, независимо от ошибок
//   allSettled ALWAYS waits for all promises, regardless of errors
// - Результат — всегда fulfilled массив объектов {status, value/reason}
//   Result — always fulfilled array of {status, value/reason} objects
// - Собственный промис allSettled никогда не rejected
//   allSettled's own promise is never rejected

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface LoaderState {
  progress: number
  status: 'idle' | 'running' | 'done' | 'error'
  value: string
  error: string
}

interface SettledResult {
  status: 'fulfilled' | 'rejected'
  value?: string
  reason?: string
}

// -----------------------------------------------
// Константы / Constants
// -----------------------------------------------

const LOADER_NAMES = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']
const LOADER_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
const LOADER_DURATIONS = [800, 1400, 600, 1100, 900]

function makeLoaderState(): LoaderState {
  return { progress: 0, status: 'idle', value: '', error: '' }
}

export function Task5_2() {
  const { t } = useLanguage()

  // TODO: loaders, fails (по умолчанию Beta и Epsilon = true), results, running
  // Начальные значения fails: [false, true, false, false, true]
  // Default fails: [false, true, false, false, true]

  // TODO: allComparison — строка для сравнения с Promise.all
  // TODO: allComparison — string for comparison with Promise.all

  // const timersRef = useRef<ReturnType<typeof setInterval>[]>([])

  // -----------------------------------------------
  // TODO: handleReset и handleRun
  // TODO: handleReset and handleRun
  // -----------------------------------------------
  //
  // handleRun():
  // 1. Создайте промисы аналогично заданию 5.1
  //    Create promises similar to task 5.1
  //
  // 2. Запустите Promise.allSettled(promises):
  //    Run Promise.allSettled(promises):
  //    .then(settled => {
  //      // Преобразуйте в SettledResult[]
  //      // Transform to SettledResult[]
  //      const mapped = settled.map(r =>
  //        r.status === 'fulfilled'
  //          ? { status: 'fulfilled', value: r.value }
  //          : { status: 'rejected', reason: r.reason.message }
  //      )
  //      setResults(mapped)
  //
  //      // Установите allComparison:
  //      // Set allComparison:
  //      // - Если есть сбои: "Если бы это был Promise.all — он упал бы на шаге N (Name)..."
  //      //   If there are failures: "If this were Promise.all — it would fail at step N (Name)..."
  //      // - Если нет: "Все промисы выполнились успешно — Promise.all дал бы тот же результат"
  //      //   If none: "All promises fulfilled successfully — Promise.all would give the same result"
  //    })
  //
  // Подсказка: найдите первый индекс где fails[i]=true для сравнения
  // Hint: find the first index where fails[i]=true for comparison

  // useEffect(() => () => timersRef.current.forEach(clearInterval), [])

  return (
    <div className="exercise-container">
      <h2>{t('task.5.2')}</h2>

      {/* TODO: Переключатели сбоев (аналогично 5.1) */}
      {/* TODO: Fail toggles (similar to 5.1) */}

      {/* TODO: Прогресс-бары для 5 загрузок */}
      {/* TODO: Progress bars for 5 loaders */}
      {/* Важно: все загрузки доходят до 100%, даже при ошибке */}
      {/* Important: all loaders reach 100%, even on error */}

      {/* TODO: Таблица результатов (только после завершения ВСЕХ) */}
      {/* TODO: Results table (only after ALL are done) */}
      {/* Колонки: Источник | status | value / reason */}
      {/* Columns: Source | status | value / reason */}
      {/* Fulfilled строки — зелёные, rejected — красные */}
      {/* Fulfilled rows — green, rejected — red */}

      {/* TODO: Блок сравнения с Promise.all (allComparison) */}
      {/* TODO: Comparison block with Promise.all (allComparison) */}

      {/* TODO: Кнопки */}
      {/* TODO: Buttons */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализацию Promise.allSettled
      </div>
    </div>
  )
}
