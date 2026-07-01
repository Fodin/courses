import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.2: Асинхронный pipe
// Task 4.2: Async pipe
// ============================================
// Реализуйте asyncPipe для цепочек async-функций.
// Implement asyncPipe for chains of async functions.
//
// asyncPipe(f, g, h)(x):
//   1. acc = await f(x)
//   2. acc = await g(acc)
//   3. acc = await h(acc)
//   4. return acc

// TODO: Реализуйте asyncPipe
// TODO: Implement asyncPipe
// async function asyncPipe(...fns) {
//   return async (value) => {
//     let acc = value
//     for (const fn of fns) {
//       acc = await ???
//     }
//     return acc
//   }
// }

// TODO: Реализуйте 4 async-функции симуляции:
// TODO: Implement 4 async simulation functions:
// fetchUser(id)         — delay 500ms, throw if id not in {1,2,3}
// enrichProfile(user)   — delay 300ms, add avatar + bio fields
// validateAccess(prof)  — delay 200ms, throw if role === 'guest'
// formatResponse(data)  — no delay, format for UI display

// TODO: Интерфейс: select userId, select failAt, кнопка "Запустить"
// TODO: UI: userId select, failAt select, "Run" button

// TODO: Состояние: шаги таймлайна с полями { label, duration, status, result? }
// TODO: State: timeline steps with { label, duration, status, result? }
// status: 'idle' | 'running' | 'done' | 'error'

export function Task4_2() {
  const { t } = useLanguage()

  // TODO: Добавьте состояние для userId, failAt, steps, finalResult, error, running
  // TODO: Add state for userId, failAt, steps, finalResult, error, running

  return (
    <div className="exercise-container">
      <h2>{t('task.4.2')}</h2>

      {/* TODO: Показать реализацию asyncPipe в блоке кода */}
      {/* TODO: Display asyncPipe implementation in a code block */}

      {/* TODO: Управление: select userId, select failAt, кнопка Запустить */}
      {/* TODO: Controls: userId select, failAt select, Run button */}
      {/* Кнопка disabled когда running === true */}
      {/* Button disabled when running === true */}

      {/* TODO: Таймлайн: 4 строки (по одной на шаг) */}
      {/* TODO: Timeline: 4 rows (one per step) */}
      {/* Каждая строка: номер, имя функции, полоса длительности, статус */}
      {/* Each row: number, fn name, duration bar, status */}
      {/* idle = серый, running = жёлтый, done = зелёный, error = красный */}
      {/* idle = gray, running = yellow, done = green, error = red */}

      {/* TODO: При done — показать краткий preview результата шага */}
      {/* TODO: On done — show brief result preview for step */}

      {/* TODO: Карточка финального результата (имя, роль, bio) */}
      {/* TODO: Final result card (name, role, bio) */}
      {/* или блок ошибки с сообщением */}
      {/* or error block with message */}
    </div>
  )
}
