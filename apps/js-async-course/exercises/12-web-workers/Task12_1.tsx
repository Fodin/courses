import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.1: Web Worker — тяжёлое вычисление
// Task 12.1: Web Worker — Heavy Computation
// ============================================
// Покажите разницу между выполнением fib(N) на главном потоке
// и в Web Worker. В первом случае UI замирает, во втором — нет.
//
// Demonstrate the difference between running fib(N) on the main thread
// and in a Web Worker. In the first case UI freezes, in the second — it stays responsive.

// -----------------------------------------------
// Вспомогательные функции / Helper functions
// -----------------------------------------------

// Синхронный Фибоначчи — намеренно медленный (экспоненциальный)
// Synchronous Fibonacci — deliberately slow (exponential complexity)
function fibSync(n: number): number {
  if (n <= 1) return n
  return fibSync(n - 1) + fibSync(n - 2)
}

// TODO: Код воркера (строка для Blob)
// TODO: Worker code string for Blob
// Воркер должен:
// Worker should:
//   1. Слушать self.onmessage — получать число n
//      Listen to self.onmessage — receive number n
//   2. Вычислить fib(n) внутри воркера
//      Compute fib(n) inside the worker
//   3. Отправить { result, elapsed } через self.postMessage
//      Send { result, elapsed } via self.postMessage
//
// const WORKER_FIB_CODE = `
//   self.onmessage = function(e) { ... }
// `

export function Task12_1() {
  const { t } = useLanguage()

  // TODO: Состояние для режима ('main' | 'worker')
  // TODO: State for mode ('main' | 'worker')
  // const [mode, setMode] = useState<'main' | 'worker'>('main')

  // TODO: N для Фибоначчи (слайдер 30–45)
  // TODO: N for Fibonacci (slider 30–45)
  // const [n, setN] = useState(38)

  // TODO: Состояния для результата, времени, запущено ли
  // TODO: States for result, elapsed time, isRunning flag
  // const [isRunning, setIsRunning] = useState(false)
  // const [result, setResult] = useState<string | null>(null)
  // const [elapsed, setElapsed] = useState<number | null>(null)

  // TODO: Спиннер — массив символов + frame index
  // TODO: Spinner — chars array + frame index
  // const spinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  // const [spinnerFrame, setSpinnerFrame] = useState(0)
  // const spinnerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // TODO: ref для воркера (чтобы terminate при размонтировании)
  // TODO: ref for worker (to terminate on unmount)
  // const workerRef = useRef<Worker | null>(null)

  // TODO: Счётчик кликов — чтобы проверить отзывчивость UI
  // TODO: Click counter — to verify UI responsiveness
  // const [clickCount, setClickCount] = useState(0)

  // -----------------------------------------------
  // TODO: Реализуйте startSpinner() и stopSpinner()
  // TODO: Implement startSpinner() and stopSpinner()
  // -----------------------------------------------
  // startSpinner: setInterval(80ms) меняет spinnerFrame каждые 80мс
  // stopSpinner: clearInterval + null

  // -----------------------------------------------
  // TODO: Реализуйте runOnMain()
  // TODO: Implement runOnMain()
  // -----------------------------------------------
  // 1. setIsRunning(true), startSpinner(), очистить result/elapsed
  // 2. setTimeout(() => {
  //      const t0 = performance.now()
  //      const res = fibSync(n)
  //      const ms = Math.round(performance.now() - t0)
  //      stopSpinner()
  //      setResult(`fib(${n}) = ${res}`)
  //      setElapsed(ms)
  //      setIsRunning(false)
  //    }, 16)

  // -----------------------------------------------
  // TODO: Реализуйте runOnWorker()
  // TODO: Implement runOnWorker()
  // -----------------------------------------------
  // 1. setIsRunning(true), startSpinner()
  // 2. Создать Blob из WORKER_FIB_CODE
  // 3. URL.createObjectURL(blob) → new Worker(url) → URL.revokeObjectURL(url)
  // 4. worker.postMessage(n)
  // 5. worker.onmessage = (e) => { stopSpinner(), setResult(...), setElapsed(...), worker.terminate() }
  // 6. worker.onerror = (e) => { stopSpinner(), setResult('Ошибка: ' + e.message) }

  // TODO: useEffect для cleanup (stopSpinner + workerRef.current?.terminate())

  return (
    <div className="exercise-container">
      <h2>{t('task.12.1')}</h2>

      {/* TODO: Добавьте вкладки "Main Thread" | "Web Worker" */}
      {/* TODO: Add tabs "Main Thread" | "Web Worker" */}

      {/* TODO: Слайдер N (30–45) с меткой и подсказкой по времени */}
      {/* TODO: Slider N (30–45) with label and time hint */}

      {/* TODO: Визуализация двух потоков — цветные блоки Main Thread / Worker Thread */}
      {/* TODO: Two-thread visualization — colored blocks Main Thread / Worker Thread */}
      {/* Активный поток подсвечивается (красный для Main, зелёный для Worker) */}
      {/* Active thread highlighted (red for Main, green for Worker) */}

      {/* TODO: Спиннер + кнопка "Кликни меня: N" */}
      {/* TODO: Spinner + "Click me: N" button */}

      {/* TODO: Блок с результатом (если result !== null) */}
      {/* TODO: Result block (if result !== null) */}

      {/* TODO: Кнопки "Запустить fib(N)" и "Сброс" */}
      {/* TODO: Buttons "Run fib(N)" and "Reset" */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте Web Worker для тяжёлого вычисления
      </div>
    </div>
  )
}
