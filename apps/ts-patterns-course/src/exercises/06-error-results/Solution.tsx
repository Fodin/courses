import { useState } from 'react'

// ============================================
// Задание 6.1: Result / Either — Решение
// ============================================

class Ok<T> {
  readonly _tag = 'ok' as const
  constructor(readonly value: T) {}

  map<U>(fn: (value: T) => U): Result<U, never> {
    return new Ok(fn(this.value))
  }

  flatMap<U, E2>(fn: (value: T) => Result<U, E2>): Result<U, E2> {
    return fn(this.value)
  }

  match<R>(handlers: { ok: (value: T) => R; err: (error: never) => R }): R {
    return handlers.ok(this.value)
  }
}

class Err<E> {
  readonly _tag = 'err' as const
  constructor(readonly error: E) {}

  map<U>(_fn: (value: never) => U): Result<U, E> {
    return this as unknown as Result<U, E>
  }

  flatMap<U, E2>(_fn: (value: never) => Result<U, E2>): Result<never, E | E2> {
    return this as unknown as Result<never, E | E2>
  }

  match<R>(handlers: { ok: (value: never) => R; err: (error: E) => R }): R {
    return handlers.err(this.error)
  }
}

type Result<T, E> = Ok<T> | Err<E>

function ok<T>(value: T): Result<T, never> {
  return new Ok(value)
}

function err<E>(error: E): Result<never, E> {
  return new Err(error)
}

function fromThrowable<T>(fn: () => T): Result<T, Error> {
  try {
    return ok(fn())
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)))
  }
}

export function Task6_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Basic Ok/Err
    log.push('--- Result basics ---')
    const success = ok(42)
    const failure = err('something went wrong')
    log.push(`ok(42)._tag = "${success._tag}", value = ${success.value}`)
    log.push(`err("...")._tag = "${failure._tag}", error = "${failure.error}"`)

    // map
    log.push('')
    log.push('--- map ---')
    const doubled = ok(5).map(x => x * 2)
    log.push(`ok(5).map(x => x * 2) = Ok(${(doubled as Ok<number>).value})`)
    const errMapped = err('fail').map(x => (x as number) * 2)
    log.push(`err("fail").map(x => x * 2) = Err("${(errMapped as Err<string>).error}")`)

    // flatMap chain
    log.push('')
    log.push('--- flatMap chain ---')
    const parseNumber = (s: string): Result<number, string> => {
      const n = parseInt(s, 10)
      return isNaN(n) ? err(`"${s}" is not a number`) : ok(n)
    }
    const validatePositive = (n: number): Result<number, string> =>
      n > 0 ? ok(n) : err(`${n} is not positive`)

    const chain1 = ok('42').flatMap(parseNumber).flatMap(validatePositive)
    log.push(`ok("42") → parseNumber → validatePositive = Ok(${(chain1 as Ok<number>).value})`)

    const chain2 = ok('abc').flatMap(parseNumber).flatMap(validatePositive)
    log.push(`ok("abc") → parseNumber → validatePositive = Err("${(chain2 as Err<string>).error}")`)

    const chain3 = ok('-5').flatMap(parseNumber).flatMap(validatePositive)
    log.push(`ok("-5") → parseNumber → validatePositive = Err("${(chain3 as Err<string>).error}")`)

    // match
    log.push('')
    log.push('--- match ---')
    const matchResult = ok(100).match({
      ok: v => `Success: ${v}`,
      err: e => `Error: ${e}`,
    })
    log.push(`ok(100).match(...) = "${matchResult}"`)

    const matchErr = err('oops').match({
      ok: v => `Success: ${v}`,
      err: e => `Error: ${e}`,
    })
    log.push(`err("oops").match(...) = "${matchErr}"`)

    // fromThrowable
    log.push('')
    log.push('--- fromThrowable ---')
    const safeJsonParse = (s: string) => fromThrowable(() => JSON.parse(s))
    const parsed = safeJsonParse('{"name":"Alice"}')
    log.push(`fromThrowable(JSON.parse, '{"name":"Alice"}') = Ok(${JSON.stringify((parsed as Ok<unknown>).value)})`)

    const parseFail = safeJsonParse('invalid json')
    log.push(`fromThrowable(JSON.parse, 'invalid json') = Err("${(parseFail as Err<Error>).error.message}")`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.1: Result / Either</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 6.2: Validation — Решение
// ============================================

class Valid<A> {
  readonly _tag = 'valid' as const
  constructor(readonly value: A) {}

  map<B>(fn: (a: A) => B): Validation<never, B> {
    return new Valid(fn(this.value))
  }
}

class Invalid<E> {
  readonly _tag = 'invalid' as const
  constructor(readonly errors: E[]) {}

  map<B>(_fn: (a: never) => B): Validation<E, B> {
    return this as unknown as Validation<E, B>
  }
}

type Validation<E, A> = Valid<A> | Invalid<E>

function valid<A>(value: A): Validation<never, A> {
  return new Valid(value)
}

function invalid<E>(errors: E[]): Validation<E, never> {
  return new Invalid(errors)
}

function combine<E, T extends Record<string, Validation<E, unknown>>>(
  validations: T
): Validation<E, { [K in keyof T]: T[K] extends Validation<E, infer A> ? A : never }> {
  const allErrors: E[] = []
  const values: Record<string, unknown> = {}

  for (const [key, val] of Object.entries(validations)) {
    if (val._tag === 'invalid') {
      allErrors.push(...(val as Invalid<E>).errors)
    } else {
      values[key] = (val as Valid<unknown>).value
    }
  }

  if (allErrors.length > 0) {
    return invalid(allErrors) as Validation<E, { [K in keyof T]: T[K] extends Validation<E, infer A> ? A : never }>
  }

  return valid(values) as Validation<E, { [K in keyof T]: T[K] extends Validation<E, infer A> ? A : never }>
}

function validateName(name: string): Validation<string, string> {
  if (!name.trim()) return invalid(['Name is required'])
  if (name.trim().length < 2) return invalid(['Name must be at least 2 characters'])
  return valid(name.trim())
}

function validateEmail(email: string): Validation<string, string> {
  if (!email.includes('@')) return invalid(['Email must contain @'])
  return valid(email)
}

function validatePassword(password: string): Validation<string, string> {
  const errors: string[] = []
  if (password.length < 8) errors.push('Password must be at least 8 characters')
  if (!/\d/.test(password)) errors.push('Password must contain a digit')
  return errors.length > 0 ? invalid(errors) : valid(password)
}

export function Task6_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Valid form
    log.push('--- Valid form ---')
    const validForm = combine({
      name: validateName('Alice'),
      email: validateEmail('alice@example.com'),
      password: validatePassword('secret123'),
    })
    if (validForm._tag === 'valid') {
      log.push(`Valid: ${JSON.stringify(validForm.value)}`)
    }

    // Invalid form — all errors
    log.push('')
    log.push('--- Invalid form (all errors at once) ---')
    const invalidForm = combine({
      name: validateName(''),
      email: validateEmail('bad-email'),
      password: validatePassword('short'),
    })
    if (invalidForm._tag === 'invalid') {
      log.push(`Errors (${invalidForm.errors.length}):`)
      for (const e of invalidForm.errors) {
        log.push(`  - ${e}`)
      }
    }

    // Partially invalid
    log.push('')
    log.push('--- Partially invalid form ---')
    const partial = combine({
      name: validateName('Bob'),
      email: validateEmail('no-at-sign'),
      password: validatePassword('goodpass1'),
    })
    if (partial._tag === 'invalid') {
      log.push(`Errors (${partial.errors.length}):`)
      for (const e of partial.errors) {
        log.push(`  - ${e}`)
      }
    }

    // map on Valid
    log.push('')
    log.push('--- map ---')
    const mapped = validateName('Alice').map(n => n.toUpperCase())
    if (mapped._tag === 'valid') {
      log.push(`validateName("Alice").map(toUpperCase) = Valid("${mapped.value}")`)
    }

    const mappedInvalid = validateName('').map(n => n.toUpperCase())
    log.push(`validateName("").map(toUpperCase)._tag = "${mappedInvalid._tag}"`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.2: Validation</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 6.3: Option / Maybe — Решение
// ============================================

class Some<T> {
  readonly _tag = 'some' as const
  constructor(readonly value: T) {}

  map<U>(fn: (value: T) => U): Option<U> {
    return new Some(fn(this.value))
  }

  flatMap<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.value)
  }

  getOrElse(_defaultValue: T): T {
    return this.value
  }
}

class NoneClass {
  readonly _tag = 'none' as const

  map<U>(_fn: (value: never) => U): Option<U> {
    return this as unknown as Option<U>
  }

  flatMap<U>(_fn: (value: never) => Option<U>): Option<U> {
    return this as unknown as Option<U>
  }

  getOrElse<T>(defaultValue: T): T {
    return defaultValue
  }
}

type Option<T> = Some<T> | NoneClass

function some<T>(value: T): Option<T> {
  return new Some(value)
}

const none: Option<never> = new NoneClass()

function fromNullable<T>(value: T | null | undefined): Option<T> {
  return value === null || value === undefined ? (none as Option<T>) : some(value)
}

interface Address {
  street?: string
  city?: string
  zip?: string
}

interface UserProfile {
  name: string
  address?: Address
  phone?: string
}

export function Task6_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Basic Some/None
    log.push('--- Option basics ---')
    log.push(`some(42)._tag = "${some(42)._tag}", value = ${(some(42) as Some<number>).value}`)
    log.push(`none._tag = "${none._tag}"`)

    // map
    log.push('')
    log.push('--- map ---')
    const mappedSome = some(5).map(x => x * 2)
    log.push(`some(5).map(x => x * 2) = Some(${(mappedSome as Some<number>).value})`)
    const mappedNone = none.map((x: number) => x * 2)
    log.push(`none.map(x => x * 2)._tag = "${mappedNone._tag}"`)

    // getOrElse
    log.push('')
    log.push('--- getOrElse ---')
    log.push(`some(5).getOrElse(0) = ${some(5).getOrElse(0)}`)
    log.push(`none.getOrElse(0) = ${none.getOrElse(0)}`)

    // fromNullable
    log.push('')
    log.push('--- fromNullable ---')
    log.push(`fromNullable(42)._tag = "${fromNullable(42)._tag}"`)
    log.push(`fromNullable(null)._tag = "${fromNullable(null)._tag}"`)
    log.push(`fromNullable(undefined)._tag = "${fromNullable(undefined)._tag}"`)
    log.push(`fromNullable("")._tag = "${fromNullable('')._tag}" (empty string is Some!)`)

    // Deep property access
    log.push('')
    log.push('--- Safe nested access ---')
    const user1: UserProfile = {
      name: 'Alice',
      address: { street: 'Main St', city: 'Springfield', zip: '12345' },
    }
    const user2: UserProfile = { name: 'Bob' }
    const user3: UserProfile = { name: 'Charlie', address: { city: 'Portland' } }

    const getStreet = (user: UserProfile): Option<string> =>
      fromNullable(user.address).flatMap(a => fromNullable(a.street))

    const street1 = getStreet(user1).map(s => s.toUpperCase()).getOrElse('Unknown')
    const street2 = getStreet(user2).map(s => s.toUpperCase()).getOrElse('Unknown')
    const street3 = getStreet(user3).map(s => s.toUpperCase()).getOrElse('Unknown')

    log.push(`Alice's street: ${street1}`)
    log.push(`Bob's street: ${street2} (no address)`)
    log.push(`Charlie's street: ${street3} (no street in address)`)

    // flatMap chain
    log.push('')
    log.push('--- flatMap chain ---')
    const findUser = (id: number): Option<UserProfile> =>
      id === 1 ? some(user1) : id === 2 ? some(user2) : (none as Option<UserProfile>)

    const result = fromNullable(1)
      .flatMap(findUser)
      .flatMap(u => fromNullable(u.address))
      .flatMap(a => fromNullable(a.city))
      .getOrElse('City not found')

    log.push(`User 1 city: ${result}`)

    const result2 = fromNullable(99)
      .flatMap(findUser)
      .flatMap(u => fromNullable(u.address))
      .flatMap(a => fromNullable(a.city))
      .getOrElse('City not found')

    log.push(`User 99 city: ${result2}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.3: Option / Maybe</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
