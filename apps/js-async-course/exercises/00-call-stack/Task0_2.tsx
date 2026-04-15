import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.2: Блокировка главного потока
// Task 0.2: Main Thread Blocking Demo
// ============================================
// Реализуйте демонстрацию разницы между синхронным вычислением,
// блокирующим UI, и чанковым подходом с setTimeout.
// Implement a demo showing the difference between synchronous computation
// that blocks UI and chunked approach using setTimeout.

// -----------------------------------------------
// Вспомогательные функции / Helper functions
// -----------------------------------------------

// TODO: Реализуйте медленный fibonacci (рекурсивный, без мемоизации)
// TODO: Implement slow fibonacci (recursive, no memoization)
// Намеренно неэффективный — чтобы блокировать поток на секунды
// Intentionally inefficient — to block the thread for seconds
// function fibSlow(n: number): number { ... }
// Базовый случай: n <= 1 → return n
// Base case: n <= 1 → return n
// Рекурсивный: return fibSlow(n-1) + fibSlow(n-2)
// Recursive: return fibSlow(n-1) + fibSlow(n-2)

// TODO: Реализуйте итеративный fibonacci по чанкам (используйте массив memo)
// TODO: Implement iterative chunked fibonacci (use memo array)
// Сигнатура:
// Signature:
// function fibChunked(
//   n: number,
//   onProgress: (msg: string) => void,   // вызывать при каждом чанке / call per chunk
//   onDone: (result: number, ms: number) => void  // вызвать по окончании / call when done
// ): void
//
// Алгоритм:
// Algorithm:
//   1. Запомните start = performance.now()
//   2. Создайте массив memo = [0, 1]
//   3. Определите функцию computeChunk(i):
//      - Посчитайте от i до min(i + 5000, n+1)
//        Compute from i to min(i + 5000, n+1)
//      - Вызовите onProgress(`Вычислено до fib(${Math.min(i, n)}) из fib(${n})...`)
//        Call onProgress(...)
//      - Если i <= n: setTimeout(() => computeChunk(i), 0)  ← уступаем управление!
//        If i <= n: setTimeout(() => computeChunk(i), 0)    ← yield control!
//      - Иначе: onDone(memo[n], Math.round(performance.now() - start))
//   4. Обработайте краевые случаи n < 2 (onDone немедленно)
//   5. Запустите: setTimeout(() => computeChunk(2), 0)

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

type Mode = 'blocking' | 'chunked'

// Символы для спиннера / Spinner characters
const SPINNER_CHARS = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

export function Task0_2() {
  const { t } = useLanguage()

  // TODO: Состояние режима / Mode state
  // const [mode, setMode] = useState<Mode>('blocking')

  // TODO: Флаг выполнения / Running flag
  // const [isRunning, setIsRunning] = useState(false)

  // TODO: Результат вычисления (строка для отображения) / Computation result string
  // const [result, setResult] = useState<string | null>(null)

  // TODO: Время блокировки / Block time in ms
  // const [blockTime, setBlockTime] = useState<number | null>(null)

  // TODO: Счётчик кликов / Click counter
  // const [clickCount, setClickCount] = useState(0)

  // TODO: Прогресс чанкового вычисления / Chunked computation progress
  // const [progress, setProgress] = useState<string>('')

  // TODO: Индекс кадра спиннера / Spinner frame index
  // const [spinnerFrame, setSpinnerFrame] = useState(0)

  // TODO: Ref для хранения intervalId спиннера
  // TODO: Ref for storing spinner intervalId
  // const spinnerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // -----------------------------------------------
  // TODO: Реализуйте startSpinner() и stopSpinner()
  // TODO: Implement startSpinner() and stopSpinner()
  // -----------------------------------------------
  // startSpinner: clearInterval если уже запущен, затем:
  //   spinnerRef.current = setInterval(() => {
  //     setSpinnerFrame(f => (f + 1) % SPINNER_CHARS.length)
  //   }, 80)
  // stopSpinner: clearInterval(spinnerRef.current), spinnerRef.current = null

  // TODO: useEffect для очистки спиннера при unmount
  // TODO: useEffect to clean up spinner on unmount
  // useEffect(() => { return () => stopSpinner() }, [])

  // -----------------------------------------------
  // TODO: Реализуйте runBlocking()
  // TODO: Implement runBlocking()
  // -----------------------------------------------
  // 1. setIsRunning(true), setResult(null), setBlockTime(null)
  // 2. setProgress('Вычисляется...')
  // 3. startSpinner()
  // 4. setTimeout(() => {                  ← даём React один кадр для ре-рендера
  //      const t0 = performance.now()
  //      const r = fibSlow(42)             ← БЛОКИРУЕТ ПОТОК
  //      const elapsed = Math.round(performance.now() - t0)
  //      stopSpinner()
  //      setBlockTime(elapsed)
  //      setResult(`fib(42) = ${r}`)
  //      setProgress('')
  //      setIsRunning(false)
  //    }, 16)

  // -----------------------------------------------
  // TODO: Реализуйте runChunked()
  // TODO: Implement runChunked()
  // -----------------------------------------------
  // 1. setIsRunning(true), setResult(null), setBlockTime(null)
  // 2. startSpinner()
  // 3. fibChunked(
  //      500_000,
  //      (msg) => setProgress(msg),
  //      (_res, ms) => {
  //        stopSpinner()
  //        setResult(`fib(500 000) вычислен за ${ms} мс`)
  //        setProgress('')
  //        setBlockTime(ms)
  //        setIsRunning(false)
  //      }
  //    )

  // -----------------------------------------------
  // TODO: Реализуйте handleReset()
  // TODO: Implement handleReset()
  // -----------------------------------------------
  // stopSpinner(), setIsRunning(false), setResult(null), setBlockTime(null),
  // setClickCount(0), setProgress(''), setSpinnerFrame(0)

  // -----------------------------------------------
  // TODO: handleRun — вызывает нужную функцию в зависимости от mode
  // TODO: handleRun — calls the right function depending on mode
  // -----------------------------------------------
  // if (mode === 'blocking') runBlocking() else runChunked()

  return (
    <div className="exercise-container">
      <h2>{t('task.0.2')}</h2>

      {/* TODO: Добавьте вкладки (Синхронная блокировка / Чанкинг через setTimeout) */}
      {/* TODO: Add tabs (Synchronous blocking / Chunking via setTimeout) */}
      {/* При переключении — вызывайте handleReset() */}
      {/* When switching — call handleReset() */}

      {/* TODO: Блок с описанием текущего режима */}
      {/* TODO: Mode description block */}
      {/* Синхронный: "fibonacci(42) блокирует Call Stack на несколько секунд..." */}
      {/* Chunked: "Вычисление разбивается на небольшие части..." */}

      {/* TODO: Блок с кодом (<pre>) — показывайте разный код для каждого режима */}
      {/* TODO: Code block (<pre>) — show different code per mode */}
      {/* Blocking: fibSlow рекурсивная функция */}
      {/* Chunked: computeChunk с setTimeout */}

      {/* TODO: Анимированный спиннер */}
      {/* TODO: Animated spinner */}
      {/* Показывайте SPINNER_CHARS[spinnerFrame] когда isRunning */}
      {/* Show SPINNER_CHARS[spinnerFrame] when isRunning */}
      {/* Иначе — статичный символ '◉' */}
      {/* Otherwise — static '◉' */}

      {/* TODO: Кнопка "Кликни меня" с счётчиком */}
      {/* TODO: "Click me" button with counter */}
      {/* onClick={() => setClickCount(c => c + 1)} */}
      {/* В режиме блокировки клики не регистрируются во время вычисления */}
      {/* In blocking mode, clicks are not registered during computation */}

      {/* TODO: Результат после вычисления */}
      {/* TODO: Result after computation */}
      {/* Показывайте result и blockTime после завершения */}
      {/* Show result and blockTime after completion */}

      {/* TODO: Кнопки управления */}
      {/* TODO: Control buttons */}
      {/* "Запустить fibonacci(42)" / "Запустить fibonacci(500000)" */}
      {/* "Сброс" */}
      {/* Кнопка запуска — disabled пока isRunning */}
      {/* Start button — disabled while isRunning */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте демо блокировки главного потока
      </div>
    </div>
  )
}
