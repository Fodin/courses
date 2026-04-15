/**
 * Cheat Sheet: Level 11 — Effect
 *
 * Используйте этот файл как справочник при выполнении заданий.
 * Не копируйте код напрямую — попробуйте написать самостоятельно.
 */

import { Effect, Context, Layer } from 'effect'

// ============================================================
// 1. Создание Effect
// ============================================================

// Успешный синхронный эффект
const success = Effect.succeed(42)                    // Effect<number, never, never>

// Провальный эффект
const failure = Effect.fail('something went wrong')   // Effect<never, string, never>

// Ленивый синхронный эффект (побочные эффекты)
const lazySync = Effect.sync(() => {
  console.log('Выполняется только при runSync/runPromise')
  return Math.random()
})

// Ленивый async эффект
const lazyAsync = Effect.promise(() =>
  fetch('/api/users').then(r => r.json())
)

// Async с обработкой ошибки
class FetchError { readonly _tag = 'FetchError'; constructor(readonly url: string) {} }

const safeAsync = Effect.tryPromise({
  try: () => fetch('/api/data').then(r => r.json()),
  catch: () => new FetchError('/api/data')
})

// ============================================================
// 2. Трансформации
// ============================================================

// map — преобразование успешного значения
const mapped = Effect.succeed(5).pipe(
  Effect.map(n => n * 2)        // Effect<number, never, never> → 10
)

// flatMap — цепочка эффектов
const chained = Effect.succeed(5).pipe(
  Effect.flatMap(n =>
    n > 0 ? Effect.succeed(n * 10) : Effect.fail('negative')
  )
)

// tap — побочный эффект без изменения значения
const tapped = Effect.succeed(42).pipe(
  Effect.tap(n => Effect.sync(() => console.log('Got:', n))),
  Effect.map(n => n + 1)  // n по-прежнему 42
)

// ============================================================
// 3. Обработка ошибок
// ============================================================

class NetworkError { readonly _tag = 'NetworkError'; constructor(readonly url: string) {} }
class AuthError    { readonly _tag = 'AuthError'; constructor(readonly reason: string) {} }

declare const riskyEffect: Effect.Effect<string, NetworkError | AuthError>

// catchTag — перехват конкретного типа (убирает его из E)
const recovered = riskyEffect.pipe(
  Effect.catchTag('NetworkError', e =>
    Effect.succeed(`fallback for ${e.url}`)  // NetworkError убран из типа
  )
)
// тип: Effect<string, AuthError>

// catchAll — перехват всех ошибок
const safeEffect = riskyEffect.pipe(
  Effect.catchAll(e =>
    Effect.succeed(`error: ${e._tag}`)
  )
)
// тип: Effect<string, never>

// mapError — преобразование ошибки
const mappedError = riskyEffect.pipe(
  Effect.mapError(e => ({ tag: e._tag, handled: true }))
)

// ============================================================
// 4. Запуск эффектов
// ============================================================

// runSync — только синхронные эффекты
const syncResult = Effect.runSync(Effect.succeed(42))  // 42

// runPromise — любые эффекты, возвращает Promise
async function runAsync() {
  const result = await Effect.runPromise(Effect.succeed(42))
  console.log(result) // 42
}

// runSyncExit — возвращает Exit вместо бросания исключения
// import { Exit } from 'effect'
// const exit = Effect.runSyncExit(riskyEffect)
// if (Exit.isSuccess(exit)) { ... }
// if (Exit.isFailure(exit)) { ... }

// ============================================================
// 5. Effect.gen — генераторный синтаксис
// ============================================================

// Аналог async/await, но для Effect
const programGen = Effect.gen(function* () {
  const a = yield* Effect.succeed(10)    // a = 10
  const b = yield* Effect.succeed(20)    // b = 20
  if (a > 5) {
    return a + b
  }
  return yield* Effect.fail('too small')
})
// тип: Effect<number, string, never>

// ============================================================
// 6. Context.Tag — определение сервисов
// ============================================================

// Сервис определяется как класс-тег
class Calculator extends Context.Tag('Calculator')<
  Calculator,
  {
    add:      (a: number, b: number) => Effect.Effect<number>
    multiply: (a: number, b: number) => Effect.Effect<number>
  }
>() {}

class Logger extends Context.Tag('Logger')<
  Logger,
  { log: (msg: string) => Effect.Effect<void> }
>() {}

// ============================================================
// 7. Layer — реализации сервисов
// ============================================================

// Layer.succeed — простая реализация
const StandardCalc = Layer.succeed(Calculator, {
  add:      (a, b) => Effect.succeed(a + b),
  multiply: (a, b) => Effect.succeed(a * b),
})

const ConsoleLogger = Layer.succeed(Logger, {
  log: msg => Effect.sync(() => console.log('[LOG]', msg)),
})

const SilentLogger = Layer.succeed(Logger, {
  log: _msg => Effect.succeed(undefined),
})

// ============================================================
// 8. Использование сервисов + инъекция Layer
// ============================================================

// Программа объявляет зависимости через yield*
const businessLogic = (a: number, b: number) => Effect.gen(function* () {
  const calc   = yield* Calculator   // получаем из контекста
  const logger = yield* Logger

  yield* logger.log(`Computing ${a} + ${b}`)
  const sum = yield* calc.add(a, b)

  yield* logger.log(`Multiplying ${sum} * 2`)
  const result = yield* calc.multiply(sum, 2)

  return result
})
// тип: Effect<number, never, Calculator | Logger>

// Слияние слоёв
const AppLayer = Layer.merge(StandardCalc, ConsoleLogger)

// Инъекция — убирает Requirements из типа
const runnable = Effect.provide(businessLogic(3, 4), AppLayer)
// тип: Effect<number, never, never>

// Запуск
Effect.runPromise(runnable).then(console.log)  // 14

// ============================================================
// 9. Частые ошибки
// ============================================================

// ОШИБКА 1: забыть запустить Effect
const notRun = Effect.sync(() => console.log('hello'))
// ^ ничего не произойдёт! Нужен Effect.runSync(notRun)

// ОШИБКА 2: Effect.sync с async-кодом
// const bad = Effect.sync(() => fetch('/api'))  // crash!
// const good = Effect.promise(() => fetch('/api').then(r => r.json()))

// ОШИБКА 3: не передавать Layer через Effect.provide
// Effect.runPromise(businessLogic(1, 2))  // ошибка: missing Calculator, Logger
// Effect.runPromise(Effect.provide(businessLogic(1, 2), AppLayer))  // правильно

export {}
