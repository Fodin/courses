import { useState } from 'react'
import { useLanguage } from 'src/hooks'
import { Effect } from 'effect'

// ============================================================
// Задание 11.2: Effect — типизированные ошибки
//
// Цель: создать typed errors с _tag, построить pipeline
// с несколькими типами ошибок, перехватывать конкретные
// ошибки через Effect.catchTag.
// ============================================================

// TODO 1: Определи классы ошибок с readonly _tag
// Каждый класс — discriminated union по полю _tag

// class ParseError {
//   readonly _tag = 'ParseError'
//   constructor(readonly input: string) {}
// }

// class RangeError {
//   readonly _tag = 'RangeError'
//   constructor(
//     readonly value: number,
//     readonly min: number,
//     readonly max: number
//   ) {}
// }

// class FormatError {
//   readonly _tag = 'FormatError'
//   constructor(readonly expected: string) {}
// }

// ===================================================
// TODO 2: Реализуй функции-шаги pipeline

// parseNumber(s) → Effect<number, ParseError>
// Если isNaN(parseFloat(s)) → Effect.fail(new ParseError(s))
// Иначе → Effect.succeed(parseFloat(s))
function parseNumber(_s: string): Effect.Effect<number, never> {
  // TODO: заменить на корректную реализацию с ParseError
  return Effect.succeed(0)
}

// checkRange(n, min, max) → Effect<number, RangeError>
// Если n < min || n > max → Effect.fail(new RangeError(n, min, max))
// Иначе → Effect.succeed(n)
function checkRange(n: number, _min: number, _max: number): Effect.Effect<number, never> {
  // TODO: заменить на корректную реализацию с RangeError
  return Effect.succeed(n)
}

// formatResult(n) → Effect<string, FormatError>
// Если n чётное → Effect.succeed(`[${n}]`)
// Иначе → Effect.fail(new FormatError('even number required'))
function formatResult(n: number): Effect.Effect<string, never> {
  // TODO: заменить на корректную реализацию с FormatError
  return Effect.succeed(`[${n}]`)
}

// ===================================================
// TODO 3: Собери pipeline
// parseNumber(input) → checkRange(n, 1, 100) → formatResult(n)
// Используй Effect.flatMap для соединения шагов
//
// TODO 4: Добавь catchTag для RangeError
// .pipe(Effect.catchTag('RangeError', e => Effect.succeed(e.min)))
// После этого шага, если число вне диапазона, используем min
// Затем прогоняем результат через formatResult

function runValidation(input: string): Effect.Effect<string, never> {
  // TODO: реализовать полный pipeline с catchTag
  // Подсказка: цепочка выглядит так:
  // parseNumber(input).pipe(
  //   Effect.flatMap(n => checkRange(n, 1, 100)),
  //   Effect.catchTag('RangeError', e => Effect.succeed(e.min)),
  //   Effect.flatMap(n => formatResult(n))
  // )
  return Effect.succeed('[TODO]')
}

// ============================================================
// Компонент задания
// ============================================================

export function Task11_2() {
  const { t } = useLanguage()
  const [input, setInput] = useState('42')
  const [result, setResult] = useState<string | null>(null)
  const [resultType, setResultType] = useState<'ok' | 'error' | null>(null)

  const run = () => {
    try {
      const outcome = Effect.runSync(runValidation(input))
      setResult(`Успех: ${outcome}`)
      setResultType('ok')
    } catch (e: unknown) {
      const cause = (e as { cause?: unknown }).cause
      const tag = (cause as { _tag?: string })?._tag ?? 'UnknownError'
      setResult(`${tag}: ${JSON.stringify(cause)}`)
      setResultType('error')
    }
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.11.2')}</h2>

      <div style={{ padding: '1rem', background: '#1f2937', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>Pipeline: parseNumber → checkRange(1..100) → formatResult</h3>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
          Попробуй: "42" (успех), "abc" (ParseError), "150" (RangeError → catchTag → 1 → "[1]"), "7" (FormatError)
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <input
            value={input}
            onChange={e => { setInput(e.target.value); setResult(null) }}
            placeholder='42, 150, abc, 7...'
            style={{ padding: '0.35rem 0.7rem', background: '#0f172a', border: '1px solid #374151', color: '#e5e7eb', borderRadius: '4px', fontFamily: 'monospace', width: '120px' }}
          />
          <button
            onClick={run}
            style={{ background: '#374151', color: '#e5e7eb', border: '1px solid #4b5563', borderRadius: '6px', padding: '0.4rem 1rem', cursor: 'pointer', fontFamily: 'monospace' }}
          >
            runSync
          </button>
        </div>

        {result !== null && (
          <p style={{ color: resultType === 'ok' ? '#86efac' : '#fca5a5', fontFamily: 'monospace' }}>
            <strong>{result}</strong>
          </p>
        )}
      </div>

      <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '6px', fontSize: '0.8rem', color: '#6b7280' }}>
        <p style={{ margin: '0 0 0.4rem', color: '#374151' }}>// Ожидаемое поведение:</p>
        <p style={{ margin: '0.2rem 0' }}>// "42"  → Успех: "[42]"  (42 чётное ✓)</p>
        <p style={{ margin: '0.2rem 0' }}>// "abc" → ParseError (не число)</p>
        <p style={{ margin: '0.2rem 0' }}>// "150" → RangeError → catchTag → 1 → "[1]"</p>
        <p style={{ margin: '0.2rem 0' }}>// "7"   → FormatError (7 нечётное)</p>
      </div>
    </div>
  )
}
