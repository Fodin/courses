import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.3: Практические функторы
// Task 5.3: Practical Functors
// ============================================
// Реализуйте три функтора с реальным применением.
// Implement three functors with real-world use cases.

// ---------------------------------------------------
// TODO: Реализуйте Lazy<T>
// TODO: Implement Lazy<T>
// ---------------------------------------------------
// Оборачивает () => T вместо T.
// Wraps () => T instead of T.
//
// class Lazy<T> {
//   constructor(private thunk: () => T) {}
//   static of<T>(thunk: () => T): Lazy<T>
//   map<U>(fn: (x: T) => U): Lazy<U>
//   // ВАЖНО: map не выполняет thunk! / IMPORTANT: map must NOT run the thunk!
//   // Только оборачивает: new Lazy(() => fn(this.thunk()))
//   // Just wraps: new Lazy(() => fn(this.thunk()))
//   run(): T
// }

// ---------------------------------------------------
// TODO: Реализуйте Validated<T>
// TODO: Implement Validated<T>
// ---------------------------------------------------
// interface ValidatedData<T> { isValid: boolean; value: T; errors: string[] }
//
// class Validated<T> {
//   constructor(readonly data: ValidatedData<T>) {}
//   static of<T>(value: T): Validated<T>         // isValid: true, errors: []
//   map<U>(fn: (x: T) => U): Validated<U>        // пропускается если !isValid / skipped if !isValid
//   validate(predicate: (v: T) => boolean, errorMsg: string): Validated<T>
//   // Если !predicate(value) → isValid = false, errors.push(errorMsg)
//   // If !predicate(value) → isValid = false, errors.push(errorMsg)
// }

// ---------------------------------------------------
// TODO: Реализуйте EventMapper<T>
// TODO: Implement EventMapper<T>
// ---------------------------------------------------
// class EventMapper<T> {
//   constructor(readonly payload: T) {}
//   static of<T>(payload: T): EventMapper<T>
//   map<U>(fn: (payload: T) => U): EventMapper<U>
// }

interface EventPayload {
  type: string
  x: number
  y: number
  timestamp: number
}

export function Task5_3() {
  const { t } = useLanguage()

  // --- Lazy state ---
  const [lazyRan, setLazyRan] = useState(false)

  // --- Validated state ---
  const [emailInput, setEmailInput] = useState('  User@Example.COM  ')

  // --- EventMapper state ---
  const [events, setEvents] = useState<EventPayload[]>([])

  // TODO: Реализуйте runLazy() — создать Lazy цепочку и запустить через run()
  // TODO: Implement runLazy() — create a Lazy chain and execute via run()
  const runLazy = () => {
    // const lazy = Lazy.of(() => 'raw data from "server"')
    //   .map(s => s.toUpperCase())
    //   .map(s => s.replace(/"/g, '').trim())
    //   .map(s => `[PROCESSED] ${s}`)
    // setLazyResult(lazy.run())
    setLazyRan(true)
  }

  // TODO: Реализуйте валидацию email через Validated
  // TODO: Implement email validation via Validated
  // Validated.of(emailInput).map(trim).validate(...).map(toLowerCase)

  // TODO: Реализуйте generateEvent() — создать mock event, применить EventMapper
  // TODO: Implement generateEvent() — create mock event, apply EventMapper
  const generateEvent = () => {
    const raw: EventPayload = {
      type: 'click',
      x: Math.floor(Math.random() * 800),
      y: Math.floor(Math.random() * 600),
      timestamp: Date.now(),
    }
    setEvents(prev => [raw, ...prev.slice(0, 4)])
    // TODO: Применить EventMapper.of(raw).map(центрировать).map(нормализовать)
    // TODO: Apply EventMapper.of(raw).map(center).map(normalize)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.5.3')}</h2>

      {/* --- Lazy --- */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#c4b5fd' }}>1. Lazy — отложенные вычисления</h3>

        {/* TODO: Показать код цепочки */}
        {/* TODO: Show chain code */}

        {/* TODO: До run() — показать "Вычисление отложено" */}
        {/* TODO: Before run() — show "Computation deferred" */}
        {!lazyRan && <p style={{ color: '#6b7280' }}>Вычисление отложено...</p>}

        {/* TODO: После run() — показать результат */}
        {/* TODO: After run() — show result */}

        <button onClick={runLazy} style={{ padding: '0.35rem 0.8rem', cursor: 'pointer' }}>
          lazy.run()
        </button>
      </div>

      {/* --- Validated --- */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#c4b5fd' }}>2. Validated — валидатор email</h3>

        <input
          value={emailInput}
          onChange={e => setEmailInput(e.target.value)}
          style={{ display: 'block', marginBottom: '0.5rem', padding: '0.35rem', fontFamily: 'monospace' }}
          placeholder="Введите email"
        />

        {/* TODO: Показать результат валидации */}
        {/* TODO: Show validation result */}
        {/* Если валидно — показать нормализованный email */}
        {/* If valid — show normalized email */}
        {/* Если нет — список ошибок */}
        {/* If not — list of errors */}
      </div>

      {/* --- EventMapper --- */}
      <div>
        <h3 style={{ color: '#c4b5fd' }}>3. EventMapper — трансформация событий</h3>

        <button onClick={generateEvent} style={{ padding: '0.35rem 0.8rem', cursor: 'pointer', marginBottom: '0.8rem' }}>
          Сгенерировать событие
        </button>

        {/* TODO: Таблица: исходный x/y → после map x/y → norm */}
        {/* TODO: Table: raw x/y → mapped x/y → norm */}
        {events.length > 0 && (
          <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>
            Последнее событие: x={events[0].x}, y={events[0].y}
            {/* TODO: применить EventMapper и показать трансформированные значения */}
            {/* TODO: apply EventMapper and show transformed values */}
          </p>
        )}
      </div>
    </div>
  )
}
