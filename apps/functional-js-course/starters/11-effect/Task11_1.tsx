import { useState } from 'react'
import { useLanguage } from 'src/hooks'
import { Effect } from 'effect'

// ============================================================
// Задание 11.1: Effect — основы и ленивость
//
// Цель: понять разницу между lazy Effect и eager Promise.
// Научиться создавать и запускать базовые эффекты.
// ============================================================

// TODO 1: Создай функцию makeCounter
// Она должна возвращать Effect.Effect<number>
// Каждый запуск эффекта инкрементирует counter и возвращает новое значение
// Используй Effect.sync(() => { ... })
//
// ВАЖНО: счётчик НЕ должен инкрементироваться при создании эффекта —
// только при вызове Effect.runSync!
let counter = 0
function makeCounter(): Effect.Effect<number> {
  // TODO: вернуть Effect.sync(() => { counter++; return counter })
  return Effect.succeed(0) // заглушка
}

// TODO 2: Создай функцию buildPipeline
// Принимает start: number
// Возвращает Effect.Effect<string>
// Шаги через pipe:
//   1) Effect.succeed(start)
//   2) Effect.map(n => n * 2)
//   3) Effect.flatMap(n => Effect.succeed(n + 10))
//   4) Effect.map(n => `value: ${n}`)
function buildPipeline(start: number): Effect.Effect<string> {
  // TODO: реализовать цепочку
  return Effect.succeed(`value: ${start}`) // заглушка
}

// TODO 3: Создай safeDivide(a, b)
// Возвращает Effect.Effect<number, string>
// Если b === 0 → Effect.fail("division by zero")
// Иначе → Effect.succeed(a / b)
function safeDivide(a: number, b: number): Effect.Effect<number, string> {
  // TODO: реализовать
  return Effect.succeed(a / b) // заглушка — делит даже на 0!
}

// ============================================================
// Компонент задания — завершите TODO выше, UI готов
// ============================================================

export function Task11_1() {
  const { t } = useLanguage()
  const [counterValue, setCounterValue] = useState<number | null>(null)
  const [counterCount, setCounterCount] = useState(0)

  const [pipeStart, setPipeStart] = useState(5)
  const [pipeResult, setPipeResult] = useState<string | null>(null)

  const [divA, setDivA] = useState('10')
  const [divB, setDivB] = useState('3')
  const [divResult, setDivResult] = useState<string | null>(null)

  const runCounter = () => {
    // TODO: вызвать makeCounter() и запустить через Effect.runSync
    // Обновить counterValue и counterCount
    const effect = makeCounter()
    const val = Effect.runSync(effect)
    setCounterValue(val)
    setCounterCount(prev => prev + 1)
  }

  const runPipeline = () => {
    // TODO: вызвать buildPipeline(pipeStart) и запустить через Effect.runSync
    const result = Effect.runSync(buildPipeline(pipeStart))
    setPipeResult(result)
  }

  const runDivide = () => {
    // TODO: вызвать safeDivide(a, b) и обработать ошибку
    // При успехе показать результат, при ошибке — сообщение об ошибке
    const a = parseFloat(divA)
    const b = parseFloat(divB)
    try {
      const result = Effect.runSync(safeDivide(a, b))
      setDivResult(`Результат: ${result.toFixed(4)}`)
    } catch (e: unknown) {
      const cause = (e as { cause?: unknown }).cause
      setDivResult(`Ошибка: ${cause ?? String(e)}`)
    }
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.11.1')}</h2>

      {/* Демо 1: счётчик */}
      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#1f2937', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>1. Ленивый счётчик</h3>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
          Кнопка создаёт и запускает эффект. Счётчик не должен расти до нажатия.
        </p>
        <button
          onClick={runCounter}
          style={{ background: '#374151', color: '#e5e7eb', border: '1px solid #4b5563', borderRadius: '6px', padding: '0.4rem 1rem', cursor: 'pointer', fontFamily: 'monospace' }}
        >
          runSync(makeCounter())
        </button>
        <p>Запусков: <strong>{counterCount}</strong></p>
        {counterValue !== null && <p>Последний результат: <strong style={{ color: '#86efac' }}>{counterValue}</strong></p>}
      </div>

      {/* Демо 2: pipeline */}
      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#1f2937', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>2. Pipeline: start → ×2 → +10 → строка</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <label style={{ color: '#9ca3af' }}>start:</label>
          <input
            type="number"
            value={pipeStart}
            onChange={e => { setPipeStart(Number(e.target.value)); setPipeResult(null) }}
            style={{ width: '80px', padding: '0.3rem 0.6rem', background: '#0f172a', border: '1px solid #374151', color: '#e5e7eb', borderRadius: '4px', fontFamily: 'monospace' }}
          />
          <button
            onClick={runPipeline}
            style={{ background: '#374151', color: '#e5e7eb', border: '1px solid #4b5563', borderRadius: '6px', padding: '0.4rem 1rem', cursor: 'pointer', fontFamily: 'monospace' }}
          >
            runSync
          </button>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>
          Ожидается: buildPipeline({pipeStart}) → "value: {pipeStart * 2 + 10}"
        </p>
        {pipeResult !== null && (
          <p>Результат: <strong style={{ color: '#93c5fd' }}>{pipeResult}</strong></p>
        )}
      </div>

      {/* Демо 3: safeDivide */}
      <div style={{ padding: '1rem', background: '#1f2937', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>3. safeDivide — деление без исключений</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <input
            value={divA}
            onChange={e => { setDivA(e.target.value); setDivResult(null) }}
            style={{ width: '70px', padding: '0.3rem 0.6rem', background: '#0f172a', border: '1px solid #374151', color: '#e5e7eb', borderRadius: '4px', fontFamily: 'monospace' }}
          />
          <span style={{ color: '#9ca3af' }}>÷</span>
          <input
            value={divB}
            onChange={e => { setDivB(e.target.value); setDivResult(null) }}
            style={{ width: '70px', padding: '0.3rem 0.6rem', background: '#0f172a', border: '1px solid #374151', color: '#e5e7eb', borderRadius: '4px', fontFamily: 'monospace' }}
          />
          <button
            onClick={runDivide}
            style={{ background: '#374151', color: '#e5e7eb', border: '1px solid #4b5563', borderRadius: '6px', padding: '0.4rem 1rem', cursor: 'pointer', fontFamily: 'monospace' }}
          >
            runSync
          </button>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>
          При делении на 0 должен появиться текст ошибки, не Infinity.
        </p>
        {divResult !== null && (
          <p style={{ color: divResult.startsWith('Ошибка') ? '#fca5a5' : '#86efac' }}>
            <strong>{divResult}</strong>
          </p>
        )}
      </div>
    </div>
  )
}
