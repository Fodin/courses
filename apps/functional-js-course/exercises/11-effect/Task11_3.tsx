import { useState } from 'react'
import { useLanguage } from 'src/hooks'
import { Effect, Context, Layer } from 'effect'

// ============================================================
// Задание 11.3: Effect — Layer и Dependency Injection
//
// Цель: определить сервисы через Context.Tag,
// создать несколько реализаций через Layer.succeed,
// запускать одну и ту же программу с разными слоями.
// ============================================================

// TODO 1: Определи сервис Calculator через Context.Tag
//
// class Calculator extends Context.Tag('Calculator')<
//   Calculator,
//   {
//     add:      (a: number, b: number) => Effect.Effect<number>
//     multiply: (a: number, b: number) => Effect.Effect<number>
//   }
// >() {}

// TODO 2: Определи сервис AuditLog через Context.Tag
//
// class AuditLog extends Context.Tag('AuditLog')<
//   AuditLog,
//   { record: (operation: string) => Effect.Effect<void> }
// >() {}

// TODO 3: Создай StandardCalculator — Layer.succeed для Calculator
// Простые синхронные вычисления через Effect.succeed
//
// const StandardCalculator = Layer.succeed(Calculator, {
//   add:      (a, b) => Effect.succeed(a + b),
//   multiply: (a, b) => Effect.succeed(a * b),
// })

// TODO 4: Создай SlowCalculator — с задержкой 500мс
// Используй Effect.promise(() => new Promise(res => setTimeout(res, 500)))
// затем Effect.flatMap(() => Effect.succeed(a + b))
//
// const SlowCalculator = Layer.succeed(Calculator, {
//   add: (a, b) => Effect.promise(
//     () => new Promise<void>(res => setTimeout(res, 500))
//   ).pipe(Effect.flatMap(() => Effect.succeed(a + b))),
//   multiply: (a, b) => Effect.promise(
//     () => new Promise<void>(res => setTimeout(res, 500))
//   ).pipe(Effect.flatMap(() => Effect.succeed(a * b))),
// })

// TODO 5: Создай InMemoryAuditLog — хранит записи в массиве
// Принимает внешний массив для сохранения
//
// function makeInMemoryAuditLog(collector: string[]) {
//   return Layer.succeed(AuditLog, {
//     record: op => Effect.sync(() => { collector.push(op) })
//   })
// }

// TODO 6: Реализуй program через Effect.gen
// Использует yield* Calculator и yield* AuditLog
//
// const program = (a: number, b: number) => Effect.gen(function* () {
//   const calc = yield* Calculator
//   const log  = yield* AuditLog
//   yield* log.record(`add(${a}, ${b})`)
//   const sum = yield* calc.add(a, b)
//   yield* log.record(`multiply(${sum}, 2)`)
//   const result = yield* calc.multiply(sum, 2)
//   return result
// })

// TODO 7: Запускай с нужным Layer
// Effect.runPromise(
//   Effect.provide(
//     program(a, b),
//     Layer.merge(CalcLayer, LogLayer)
//   )
// )

// ============================================================
// Компонент задания — UI готов, реализуйте TODO выше
// ============================================================

export function Task11_3() {
  const { t } = useLanguage()
  const [calcMode, setCalcMode] = useState<'standard' | 'slow'>('standard')
  const [inputA, setInputA] = useState('3')
  const [inputB, setInputB] = useState('4')
  const [logs, setLogs] = useState<string[]>([])
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    const a = parseFloat(inputA) || 0
    const b = parseFloat(inputB) || 0
    const collector: string[] = []

    setLoading(true)
    setResult(null)
    setLogs([])

    try {
      // TODO: раскомментировать после реализации сервисов и программы
      //
      // const calcLayer = calcMode === 'standard' ? StandardCalculator : SlowCalculator
      // const logLayer  = makeInMemoryAuditLog(collector)
      // const outcome   = await Effect.runPromise(
      //   Effect.provide(program(a, b), Layer.merge(calcLayer, logLayer))
      // )
      // setResult(`Результат: ${outcome}`)
      // setLogs(collector)

      // Заглушка — удали после реализации
      await new Promise(res => setTimeout(res, calcMode === 'slow' ? 500 : 0))
      setResult(`TODO: реализуй сервисы и program (ожидается ${(a + b) * 2})`)
      setLogs(['TODO: здесь будут записи AuditLog'])
    } catch (e) {
      setResult(`Ошибка: ${String(e)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.11.3')}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Controls */}
        <div style={{ padding: '1rem', background: '#1f2937', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0 }}>Настройки</h3>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.83rem', margin: '0 0 0.5rem' }}>Реализация Calculator:</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['standard', 'slow'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setCalcMode(mode)}
                  style={{
                    background: calcMode === mode ? '#1e3a5f' : '#374151',
                    color: calcMode === mode ? '#93c5fd' : '#e5e7eb',
                    border: `1px solid ${calcMode === mode ? '#3b82f6' : '#4b5563'}`,
                    borderRadius: '6px', padding: '0.35rem 0.9rem', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.82rem',
                  }}
                >
                  {mode === 'standard' ? 'Standard' : 'Slow (500ms)'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: '#9ca3af', fontSize: '0.83rem', margin: '0 0 0.3rem' }}>a:</p>
              <input value={inputA} onChange={e => setInputA(e.target.value)}
                style={{ width: '70px', padding: '0.3rem 0.6rem', background: '#0f172a', border: '1px solid #374151', color: '#e5e7eb', borderRadius: '4px', fontFamily: 'monospace' }}
              />
            </div>
            <div>
              <p style={{ color: '#9ca3af', fontSize: '0.83rem', margin: '0 0 0.3rem' }}>b:</p>
              <input value={inputB} onChange={e => setInputB(e.target.value)}
                style={{ width: '70px', padding: '0.3rem 0.6rem', background: '#0f172a', border: '1px solid #374151', color: '#e5e7eb', borderRadius: '4px', fontFamily: 'monospace' }}
              />
            </div>
          </div>

          <p style={{ color: '#9ca3af', fontSize: '0.82rem', margin: '0 0 0.75rem' }}>
            Программа: (a + b) * 2<br />
            Ожидается: ({inputA} + {inputB}) * 2 = {(parseFloat(inputA) || 0 + parseFloat(inputB) || 0) * 2}
          </p>

          <button
            onClick={run}
            disabled={loading}
            style={{ background: loading ? '#374151' : '#1e3a5f', color: loading ? '#6b7280' : '#93c5fd', border: `1px solid ${loading ? '#4b5563' : '#3b82f6'}`, borderRadius: '6px', padding: '0.4rem 1rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}
          >
            {loading ? 'Выполняется...' : 'Effect.runPromise'}
          </button>
        </div>

        {/* Result */}
        <div style={{ padding: '1rem', background: '#1f2937', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0 }}>Результат и AuditLog</h3>

          {result !== null && (
            <p style={{ color: result.startsWith('Ошибка') ? '#fca5a5' : '#86efac', fontFamily: 'monospace', marginBottom: '1rem' }}>
              <strong>{result}</strong>
            </p>
          )}

          <div>
            <p style={{ color: '#9ca3af', fontSize: '0.83rem', margin: '0 0 0.4rem' }}>AuditLog записи:</p>
            {logs.length === 0
              ? <p style={{ color: '#4b5563', fontSize: '0.82rem' }}>Записей нет</p>
              : logs.map((line, i) => (
                <div key={i} style={{ background: '#1a3a1e', border: '1px solid #16a34a', borderRadius: '4px', padding: '0.3rem 0.7rem', marginBottom: '0.3rem', color: '#86efac', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  {line}
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div style={{ padding: '0.75rem 1rem', background: '#0f172a', borderRadius: '6px', marginTop: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>
        <p style={{ margin: '0 0 0.3rem', color: '#374151' }}>// Пример структуры program:</p>
        <p style={{ margin: '0.2rem 0' }}>// const calc = yield* Calculator   ← DI из Layer</p>
        <p style={{ margin: '0.2rem 0' }}>// const log  = yield* AuditLog     ← DI из Layer</p>
        <p style={{ margin: '0.2rem 0' }}>// yield* log.record('add(a, b)')</p>
        <p style={{ margin: '0.2rem 0' }}>// const sum = yield* calc.add(a, b)</p>
        <p style={{ margin: '0.2rem 0' }}>// return yield* calc.multiply(sum, 2)</p>
      </div>
    </div>
  )
}
