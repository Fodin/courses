// ============================================
// Cheat sheet — Level 5: Функторы
// ============================================
// Этот файл — шпаргалка с ключевыми концепциями.
// This file is a cheat sheet with key concepts.

// ---------------------------------------------------
// Box — простейший функтор / Box — the simplest functor
// ---------------------------------------------------

class Box<T> {
  private constructor(private readonly value: T) {}

  static of<T>(value: T): Box<T> {
    return new Box(value)
  }

  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.value))
  }

  fold<U>(fn: (value: T) => U): U {
    return fn(this.value)
  }

  inspect(): string {
    return `Box(${String(this.value)})`
  }

  getValue(): T {
    return this.value
  }
}

// Использование / Usage:
const result = Box.of('  hello world  ')
  .map(s => s.trim())
  .map(s => s.toUpperCase())
  .fold(s => s)
// => 'HELLO WORLD'

// ---------------------------------------------------
// Законы функторов / Functor laws
// ---------------------------------------------------

// Закон 1 — Идентичность / Law 1 — Identity:
// F.map(x => x) === F
Box.of(42).map(x => x).inspect() // Box(42) — то же значение

// Закон 2 — Композиция / Law 2 — Composition:
// F.map(f).map(g) === F.map(x => g(f(x)))
const f = (x: number) => x + 1
const g = (x: number) => x * 2
Box.of(5).map(f).map(g).inspect()               // Box(12)
Box.of(5).map(x => g(f(x))).inspect()           // Box(12) — то же самое

// ---------------------------------------------------
// Lazy — отложенные вычисления / Lazy — deferred computation
// ---------------------------------------------------

class Lazy<T> {
  private constructor(private readonly thunk: () => T) {}

  static of<T>(thunk: () => T): Lazy<T> {
    return new Lazy(thunk)
  }

  map<U>(fn: (value: T) => U): Lazy<U> {
    // map НЕ выполняет thunk — только описывает трансформацию
    // map does NOT execute thunk — only describes the transformation
    return new Lazy(() => fn(this.thunk()))
  }

  run(): T {
    return this.thunk() // выполняется только здесь / runs only here
  }
}

const lazyResult = Lazy.of(() => 'raw data')
  .map(s => s.toUpperCase())
  .map(s => `[${s}]`)
// Ничего не выполнено! / Nothing executed yet!
lazyResult.run() // => '[RAW DATA]'

// ---------------------------------------------------
// Validated — функтор с валидацией / Validated — validation functor
// ---------------------------------------------------

interface ValidatedData<T> {
  isValid: boolean
  value: T
  errors: string[]
}

class Validated<T> {
  private constructor(readonly data: ValidatedData<T>) {}

  static of<T>(value: T): Validated<T> {
    return new Validated({ isValid: true, value, errors: [] })
  }

  map<U>(fn: (value: T) => U): Validated<U> {
    // map пропускается если невалидно / map is skipped if invalid
    const newValue = fn(this.data.value)
    return new Validated<U>({
      isValid: this.data.isValid,
      value: newValue,
      errors: this.data.errors,
    })
  }

  validate(predicate: (v: T) => boolean, errorMsg: string): Validated<T> {
    if (!this.data.isValid) return this
    if (!predicate(this.data.value)) {
      return new Validated<T>({
        isValid: false,
        value: this.data.value,
        errors: [errorMsg],
      })
    }
    return this
  }
}

// Использование / Usage:
const emailResult = Validated.of('  User@Example.COM  ')
  .map(s => s.trim())
  .validate(s => s.includes('@'), 'Нет символа @')
  .validate(s => s.includes('.'), 'Нет точки')
  .map(s => s.toLowerCase())
// emailResult.data.isValid === true
// emailResult.data.value === 'user@example.com'

// ---------------------------------------------------
// EventMapper — функтор событий / EventMapper — event functor
// ---------------------------------------------------

class EventMapper<T> {
  private constructor(readonly payload: T) {}

  static of<T>(payload: T): EventMapper<T> {
    return new EventMapper(payload)
  }

  map<U>(fn: (payload: T) => U): EventMapper<U> {
    return new EventMapper(fn(this.payload))
  }
}

// Использование / Usage:
const event = EventMapper.of({ type: 'click', x: 600, y: 450, timestamp: Date.now() })
  .map(e => ({ ...e, x: e.x - 400, y: e.y - 300 }))             // центрировать
  .map(e => ({ x: e.x, y: e.y, norm: Math.sqrt(e.x ** 2 + e.y ** 2) | 0 }))
// event.payload = { x: 200, y: 150, norm: 250 }

export { Box, Lazy, Validated, EventMapper, result }
