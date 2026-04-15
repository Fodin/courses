import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.2: Обработка ошибок в async/await
// Task 6.2: Error handling in async/await
// ============================================
// Реализуйте демонстрацию трёх стратегий обработки ошибок.
// Implement a demonstration of three error handling strategies.

// -----------------------------------------------
// Вспомогательные функции / Helper functions
// -----------------------------------------------

// TODO: Реализуйте simulateFetch(shouldFail): Promise<{data: string}>
// TODO: Implement simulateFetch(shouldFail): Promise<{data: string}>
// Возвращает промис с задержкой 600ms.
// Returns a promise with 600ms delay.
// Если shouldFail === true — реджектит с new Error('Network Error: 503')
// If shouldFail === true — rejects with new Error('Network Error: 503')
// Иначе — резолвит с { data: 'Данные успешно получены!' }
// Otherwise — resolves with { data: 'Данные успешно получены!' }

// TODO: Реализуйте вспомогательную функцию to<T>
// TODO: Implement helper function to<T>
// async function to<T>(promise: Promise<T>): Promise<[Error | null, T | null]>
// При успехе возвращает [null, result]
// On success returns [null, result]
// При ошибке возвращает [error, null]
// On error returns [error, null]

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// TODO: Определите тип стратегии
// TODO: Define strategy type
// type ErrorStrategy = 'tryCatch' | 'dotCatch' | 'goStyle'

// TODO: Определите данные для каждой стратегии (код, плюсы, минусы)
// TODO: Define data for each strategy (code, pros, cons)
// const STRATEGIES = {
//   tryCatch: { label: 'try/catch', color: '#3b82f6', code: `...`, pros: [...], cons: [...] },
//   dotCatch: { label: '.catch() на вызове', ... },
//   goStyle:  { label: 'Go-style [err, data]', ... },
// }

export function Task6_2() {
  const { t } = useLanguage()

  // TODO: Состояние для активной стратегии
  // TODO: State for active strategy
  // const [strategy, setStrategy] = useState<ErrorStrategy>('tryCatch')

  // TODO: Состояние — симулировать ошибку или нет
  // TODO: State — whether to simulate an error
  // const [shouldFail, setShouldFail] = useState(false)

  // TODO: Состояние для фазы выполнения: 'idle' | 'loading' | 'success' | 'error'
  // TODO: State for execution phase
  // type Phase = 'idle' | 'loading' | 'success' | 'error'
  // const [phase, setPhase] = useState<Phase>('idle')

  // TODO: Состояние для лога (массив { text, color })
  // TODO: State for log (array of { text, color })
  // const [logLines, setLogLines] = useState<Array<{text: string, color: string}>>([])

  // -----------------------------------------------
  // TODO: Реализуйте runDemo()
  // TODO: Implement runDemo()
  // -----------------------------------------------
  // Для стратегии 'tryCatch':
  //   try { const result = await simulateFetch(shouldFail); addLog(...); } catch (err) { addLog(...) }
  // Для стратегии 'dotCatch':
  //   const result = await simulateFetch(shouldFail).catch(err => { addLog(err.message); return null })
  //   if (!result) addLog('fallback'); else addLog(result.data)
  // Для стратегии 'goStyle':
  //   const [err, result] = await to(simulateFetch(shouldFail))
  //   if (err) addLog(err.message); else addLog(result.data)

  return (
    <div className="exercise-container">
      <h2>{t('task.6.2')}</h2>

      {/* TODO: Три вкладки для стратегий */}
      {/* TODO: Three tabs for strategies */}

      {/* TODO: Блок кода для текущей стратегии */}
      {/* TODO: Code block for current strategy */}

      {/* TODO: Плюсы и минусы рядом */}
      {/* TODO: Pros and cons side by side */}

      {/* TODO: Кнопка "Запустить", чекбокс "Симулировать ошибку", статус-бейдж */}
      {/* TODO: "Run" button, "Simulate error" checkbox, status badge */}

      {/* TODO: Лог вывода */}
      {/* TODO: Output log */}

      {/* TODO: Таблица сравнения трёх подходов */}
      {/* TODO: Comparison table of three approaches */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте три стратегии обработки ошибок
      </div>
    </div>
  )
}
