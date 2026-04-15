import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.1: Конструктор Promise — визуализатор состояний
// Task 3.1: Promise Constructor — State Visualizer
// ============================================
// Реализуйте интерактивный визуализатор жизненного цикла промиса.
// Implement an interactive Promise lifecycle visualizer.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Три состояния промиса / Three promise states
type PromiseState = 'pending' | 'fulfilled' | 'rejected'

// Тип записи в лог-панели / Log entry type
interface LogEntry {
  time: number        // Время с момента сброса (мс) / Time since reset (ms)
  type: LogEntryType  // Тип события / Event type
  message: string     // Текст записи / Log message
}

// Типы событий лога / Log event types
// sync   — executor выполнился синхронно / executor ran synchronously
// async  — колбэк .then()/.catch() выполнился асинхронно / .then()/.catch() callback ran asynchronously
// error  — попытка изменить settled промис / attempt to change settled promise
// info   — информационное сообщение / informational message
type LogEntryType = 'sync' | 'async' | 'error' | 'info'

// -----------------------------------------------
// Константы для отображения / Display constants
// -----------------------------------------------

// Цвета для каждого состояния / Colors for each state
// pending: '#64748b', fulfilled: '#10b981', rejected: '#ef4444'
const STATE_COLORS: Record<PromiseState, string> = {
  pending: '#64748b',
  fulfilled: '#10b981',
  rejected: '#ef4444',
}

// Метки состояний / State labels
const STATE_LABELS: Record<PromiseState, string> = {
  pending: 'pending (ожидание)',
  fulfilled: 'fulfilled (выполнен)',
  rejected: 'rejected (отклонён)',
}

// Цвета типов лога / Log type colors
const LOG_COLORS: Record<LogEntryType, string> = {
  sync: '#60a5fa',   // синий / blue
  async: '#a78bfa',  // фиолетовый / purple
  error: '#f87171',  // красный / red
  info: '#94a3b8',   // серый / gray
}

// -----------------------------------------------
// TODO: Реализуйте компонент Task3_1
// TODO: Implement the Task3_1 component
// -----------------------------------------------
// Состояния (state):
// States needed:
//   - promiseState: PromiseState — текущее состояние / current state ('pending')
//   - inputValue: string — значение для resolve / resolve value ('42')
//   - settledValue: string | null — значение после settle / value after settle
//   - log: LogEntry[] — записи лога / log entries
//   - isSettled: boolean — заблокирован ли промис / is promise locked
//   - showLock: boolean — показывать ли иконку замка / show lock icon
//
// Refs:
//   - startTimeRef — performance.now() в момент сброса / performance.now() at reset

// -----------------------------------------------
// Логика кнопок / Button logic
// -----------------------------------------------
//
// handleResolve():
//   Если isSettled — показать замок (showLock=true, через 1200мс false),
//   добавить IGNORE-запись в лог, выйти.
//   If isSettled — show lock, add IGNORE log entry, return.
//
//   Иначе:
//   Otherwise:
//   1. Добавить SYNC-запись: `executor: resolve("${inputValue}") вызван`
//   2. Установить promiseState='fulfilled', settledValue=inputValue, isSettled=true
//   3. Через Promise.resolve().then(...) добавить ASYNC-запись: `.then(value => ...) — колбэк выполнен асинхронно (микротаска)`
//
// handleReject():
//   Аналогично, но:
//   SYNC: `executor: reject(new Error("Ошибка!")) вызван`
//   State: rejected, settledValue='Error: Ошибка!'
//   ASYNC: `.catch(err => ...) — колбэк выполнен асинхронно (микротаска)`
//
// handleThrow():
//   Аналогично reject, но:
//   SYNC: `executor: throw new Error("throw внутри executor") — перехватывается как reject`
//   State: rejected, settledValue='Error: throw внутри executor'
//   ASYNC: `.catch(err => ...) — колбэк выполнен асинхронно (микротаска)`
//
// handleReset():
//   promiseState='pending', settledValue=null, isSettled=false, showLock=false, log=[]
//   Обновить startTimeRef.current = performance.now()

export function Task3_1() {
  const { t } = useLanguage()

  // TODO: Объявите состояния
  // TODO: Declare state variables

  // TODO: Объявите ref для отсчёта времени
  // TODO: Declare time tracking ref

  // TODO: Вспомогательная функция addLog(type, message)
  // TODO: Helper function addLog(type, message)
  // const addLog = (type: LogEntryType, message: string) => {
  //   const elapsed = Math.round(performance.now() - startTimeRef.current)
  //   setLog(prev => [...prev, { time: elapsed, type, message }])
  // }

  // TODO: Реализуйте handleResolve, handleReject, handleThrow, handleReset
  // TODO: Implement handleResolve, handleReject, handleThrow, handleReset

  return (
    <div className="exercise-container">
      <h2>{t('task.3.1')}</h2>

      {/* TODO: Отображение трёх состояний (pending / fulfilled / rejected) */}
      {/* TODO: Display three states (pending / fulfilled / rejected) */}
      {/* Для каждого состояния: цветная рамка если активно, точка-индикатор, название, значение */}
      {/* For each state: colored border if active, dot indicator, name, value */}

      {/* TODO: Индикатор замка (showLock) */}
      {/* TODO: Lock indicator (showLock) */}
      {/* Показывать 🔒 и сообщение о блокировке при showLock=true */}
      {/* Show 🔒 and block message when showLock=true */}

      {/* TODO: Поле ввода значения для resolve */}
      {/* TODO: Input for resolve value */}

      {/* TODO: Кнопки resolve / reject / throw / сброс */}
      {/* TODO: Buttons resolve / reject / throw / reset */}

      {/* TODO: Лог событий с временными метками и цветными типами */}
      {/* TODO: Event log with timestamps and colored types */}
      {/* Типы: SYNC (синий), ASYNC (фиолетовый), IGNORE (красный) */}
      {/* Types: SYNC (blue), ASYNC (purple), IGNORE (red) */}

      {/* TODO: Текущее состояние промиса внизу */}
      {/* TODO: Current promise state display at bottom */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализатор состояний Promise
      </div>
    </div>
  )
}
