import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.3: Промисификация callback-API
// Task 3.3: Promisification of callback-API
// ============================================
// Реализуйте компонент, сравнивающий callback и Promise версии API.
// Implement a component comparing callback and Promise API versions.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Запись на timeline / Timeline entry
interface TimelineEntry {
  label: string                         // Название операции / Operation name
  startMs: number                       // Время старта / Start time
  endMs: number | null                  // Время завершения / End time (null = ещё выполняется)
  status: 'running' | 'ok' | 'error'   // Статус / Status
  result: string                        // Результат или ошибка / Result or error message
}

// -----------------------------------------------
// Симулированные callback-API / Simulated callback-APIs
// -----------------------------------------------
// Эти функции имитируют Node.js-style callback API:
// These functions simulate Node.js-style callback API:
//   callbackReadFile(filename, cb) — 600мс, ENOENT при "missing" в имени
//   callbackFetchUser(userId, cb)  — 800мс, ошибка при userId <= 0

// TODO: Реализуйте callbackReadFile
// TODO: Implement callbackReadFile
// function callbackReadFile(
//   filename: string,
//   cb: (err: Error | null, data: string | null) => void
// ): void {
//   setTimeout(() => {
//     if (filename.includes('missing')) {
//       cb(new Error(`ENOENT: no such file — ${filename}`), null)
//     } else {
//       cb(null, `Содержимое файла "${filename}" (42 байта)`)
//     }
//   }, 600)
// }

// TODO: Реализуйте callbackFetchUser
// TODO: Implement callbackFetchUser
// function callbackFetchUser(
//   userId: number,
//   cb: (err: Error | null, user: { id: number; name: string } | null) => void
// ): void {
//   setTimeout(() => {
//     if (userId <= 0) {
//       cb(new Error(`Неверный userId: ${userId}`), null)
//     } else {
//       cb(null, { id: userId, name: `User_${userId}` })
//     }
//   }, 800)
// }

// -----------------------------------------------
// Promise-обёртки / Promise wrappers
// -----------------------------------------------

// TODO: Реализуйте readFileAsync используя шаблон промисификации
// TODO: Implement readFileAsync using the promisification pattern
//
// Шаблон / Pattern:
// function readFileAsync(filename: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     callbackReadFile(filename, (err, data) => {
//       if (err) reject(err)
//       else resolve(data!)
//     })
//   })
// }

// TODO: Реализуйте fetchUserAsync
// TODO: Implement fetchUserAsync
// function fetchUserAsync(userId: number): Promise<{ id: number; name: string }> { ... }

// -----------------------------------------------
// TODO: Реализуйте компонент Task3_3
// TODO: Implement the Task3_3 component
// -----------------------------------------------

// Состояния / States:
//   - filename: string — 'data.txt'
//   - userId: number — 1
//   - isRunning: boolean — идёт ли демо / is demo running
//   - timeline: TimelineEntry[] — записи timeline / timeline entries
//   - activeTab: 'pattern' | 'promisify' — активная вкладка / active tab

// Refs:
//   - startRef — performance.now() в момент старта / performance.now() at start

// -----------------------------------------------
// Логика runDemo() / runDemo() logic
// -----------------------------------------------
// 1. setIsRunning(true), startRef.current = performance.now()
// 2. Создать 4 начальных записи timeline (status: 'running', endMs: null):
//    Create 4 initial timeline entries (status: 'running', endMs: null):
//    - 'Callback: readFile("${filename}")'
//    - 'Promise: readFile("${filename}")'
//    - 'Callback: fetchUser(${userId})'
//    - 'Promise: fetchUser(${userId})'
// 3. Запустить все 4 операции параллельно через Promise.all
//    Run all 4 operations in parallel via Promise.all
//    Для каждой операции в колбэке/then — обновить запись timeline:
//    For each operation in callback/then — update timeline entry:
//      endMs: now(), status: 'ok'|'error', result: data|error.message
// 4. Дождаться Promise.all, setIsRunning(false)
//    Await Promise.all, setIsRunning(false)
//
// updateEntry(index, updates): обновляет одну запись в timeline
// updateEntry(index, updates): updates a single timeline entry
// const updateEntry = (index: number, updates: Partial<TimelineEntry>) => {
//   setTimeline(prev => prev.map((e, i) => i === index ? { ...e, ...updates } : e))
// }

// -----------------------------------------------
// Два сниппета кода для вкладок / Two code snippets for tabs
// -----------------------------------------------
// Вкладка 1 ("pattern"): показывает callback API и promisify() функцию
// Tab 1 ("pattern"): shows callback API and promisify() function
//
// Вкладка 2 ("promisify"): показывает Node.js util.promisify и fs.promises
// Tab 2 ("promisify"): shows Node.js util.promisify and fs.promises

export function Task3_3() {
  const { t } = useLanguage()

  // TODO: Объявите состояния и ref
  // TODO: Declare state and ref

  // TODO: Реализуйте updateEntry, runDemo, handleReset
  // TODO: Implement updateEntry, runDemo, handleReset

  return (
    <div className="exercise-container">
      <h2>{t('task.3.3')}</h2>

      {/* TODO: Две вкладки (Шаблон промисификации / util.promisify) */}
      {/* TODO: Two tabs (Promisification Pattern / util.promisify) */}

      {/* TODO: Содержимое вкладки — код */}
      {/* TODO: Tab content — code */}

      {/* TODO: Секция демонстрации */}
      {/* TODO: Demo section */}
      {/* Поля: имя файла (текст) и userId (число) */}
      {/* Fields: filename (text) and userId (number) */}

      {/* TODO: Кнопки Запустить / Сброс */}
      {/* TODO: Run / Reset buttons */}

      {/* TODO: Timeline — горизонтальные прогресс-бары */}
      {/* TODO: Timeline — horizontal progress bars */}
      {/* Для каждой из 4 операций: */}
      {/* For each of 4 operations: */}
      {/*   - Метка операции / Operation label */}
      {/*   - Горизонтальный бар (ширина = endMs / maxDuration * 100%) */}
      {/*   - Horizontal bar (width = endMs / maxDuration * 100%) */}
      {/*   - Цвет: синий (running), зелёный (ok), красный (error) */}
      {/*   - Color: blue (running), green (ok), red (error) */}
      {/*   - Результат под баром / Result below bar */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте сравнение callback vs Promise API
      </div>
    </div>
  )
}
