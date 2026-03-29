# Уровень 9: Архитектура ошибок

## 🎯 Цель уровня

Научиться проектировать типобезопасные системы обработки ошибок: иерархии ошибок с discriminated unions, изоляцию доменов ошибок через boundaries, типизированное распространение ошибок через Result-цепочки и паттерны восстановления (retry, fallback, circuit breaker).

---

## Проблема: хаотичная обработка ошибок

В типичном проекте ошибки обрабатываются бессистемно:

```typescript
// ❌ Нетипизированные ошибки
try {
  const user = await fetchUser(id)
  const orders = await fetchOrders(user.id)
  return processOrders(orders)
} catch (error) {
  // error: unknown — что это? Сеть? Валидация? 404?
  console.error(error) // Надежда на лучшее
  throw error          // Пробросить «наверх» и забыть
}
```

Проблемы:
- `catch` получает `unknown` — невозможно обработать конкретный тип ошибки
- Нет различения между сетевой ошибкой, ошибкой валидации и 404
- Стратегия восстановления не привязана к типу ошибки
- Ошибки из разных слоёв смешиваются

---

## Паттерн 1: Иерархия ошибок через Discriminated Unions

Вместо классов наследования используем tagged unions:

```typescript
interface BaseAppError {
  readonly _tag: string
  readonly message: string
  readonly timestamp: number
}

interface ValidationError extends BaseAppError {
  readonly _tag: 'ValidationError'
  readonly field: string
  readonly rule: string
}

interface NetworkError extends BaseAppError {
  readonly _tag: 'NetworkError'
  readonly url: string
  readonly statusCode: number
}

interface NotFoundError extends BaseAppError {
  readonly _tag: 'NotFoundError'
  readonly resource: string
  readonly id: string
}

// Union type — все возможные ошибки
type AppError = ValidationError | NetworkError | NotFoundError
```

### Exhaustive handling

```typescript
function handleError(error: AppError): string {
  switch (error._tag) {
    case 'ValidationError':
      return `Field "${error.field}" failed: ${error.rule}`
      //                ^^^^^^^^^ доступен только для ValidationError
    case 'NetworkError':
      return `HTTP ${error.statusCode} for ${error.url}`
    case 'NotFoundError':
      return `${error.resource} #${error.id} not found`
    // Если добавить новый тип ошибки, TypeScript потребует обработку здесь
  }
}
```

💡 **Ключевая идея**: `_tag` — дискриминант. TypeScript сужает тип в каждой ветке switch, давая доступ к специфичным полям. При добавлении нового типа ошибки компилятор укажет все места, где его нужно обработать.

---

## Паттерн 2: Error Boundaries (границы ошибок)

Boundary изолирует домен ошибок — каждый слой имеет свой тип ошибки:

```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }

interface BoundaryConfig<E> {
  name: string
  catch: (error: unknown) => E  // unknown -> типизированная ошибка
  onError?: (error: E) => void  // Опциональное логирование
}

function createBoundary<E>(config: BoundaryConfig<E>) {
  return {
    run<T>(fn: () => T): Result<T, E> {
      try {
        return { ok: true, value: fn() }
      } catch (error) {
        const mapped = config.catch(error)
        config.onError?.(mapped)
        return { ok: false, error: mapped }
      }
    },
  }
}
```

### Разные boundaries для разных слоёв

```typescript
// Domain boundary: unknown -> DomainError
const domainBoundary = createBoundary<DomainError>({
  name: 'domain',
  catch: (error) => ({
    code: 'DOMAIN_ERROR',
    message: error instanceof Error ? error.message : String(error),
  }),
})

// Infrastructure boundary: unknown -> InfraError
const infraBoundary = createBoundary<InfraError>({
  name: 'infra',
  catch: (error) => ({
    service: 'database',
    operation: 'query',
    cause: String(error),
  }),
})

// Каждый boundary возвращает свой тип ошибки
const domainResult = domainBoundary.run(() => riskyOperation())
// Result<T, DomainError>

const infraResult = infraBoundary.run(() => dbQuery())
// Result<T, InfraError>
```

📌 **Важно**: boundary — это точка, где `unknown` превращается в конкретный тип. Внутри boundary ошибки типизированы, снаружи — всегда `Result<T, E>`.

---

## Паттерн 3: Распространение ошибок через Result-цепочки

Result с методами `map`, `flatMap`, `mapError` для типобезопасного распространения:

```typescript
function okChain<T>(value: T): ResultChain<T, never> {
  return {
    ok: true, value,
    map(fn) { return okChain(fn(value)) },
    flatMap(fn) { return fn(value) },
    mapError() { return this },
    unwrapOr() { return value },
    match(h) { return h.ok(value) },
  }
}

function errChain<E>(error: E): ResultChain<never, E> {
  return {
    ok: false, error,
    map() { return this },           // Пропускаем — ошибка
    flatMap() { return this },       // Пропускаем — ошибка
    mapError(fn) { return errChain(fn(error)) },
    unwrapOr(fallback) { return fallback },
    match(h) { return h.err(error) },
  }
}
```

### Цепочка с накоплением типов ошибок

```typescript
const result = parseEmail(input)          // ResultChain<string, ParseError>
  .flatMap(validateEmail)                  // ResultChain<string, ParseError | ValidationError>
  .flatMap(saveUser)                       // ResultChain<User, ParseError | ValidationError | SaveError>
  .map(user => `Created: ${user.email}`)   // ResultChain<string, ParseError | ValidationError | SaveError>

result.match({
  ok: (msg) => showSuccess(msg),
  err: (error) => {
    // error: ParseError | ValidationError | SaveError
    switch (error._tag) { /* exhaustive */ }
  },
})
```

🔥 **Ключевой момент**: `flatMap` **накапливает** типы ошибок через union. TypeScript точно знает, какие ошибки могут возникнуть в цепочке.

---

## Паттерн 4: Стратегии восстановления

### Retry

```typescript
function retry<T, E>(
  operation: () => Result<T, E>,
  config: { maxAttempts: number; delayMs: number }
): Result<T, E & { attempts: number }> {
  let lastError: E | undefined
  for (let i = 1; i <= config.maxAttempts; i++) {
    const result = operation()
    if (result.ok) return result
    lastError = result.error
  }
  return err({ ...lastError!, attempts: config.maxAttempts })
}
```

### Fallback

```typescript
function withFallback<T, E1, E2>(
  primary: () => Result<T, E1>,
  fallback: () => Result<T, E2>
): Result<T, { primary: E1; fallback: E2 }> {
  const result = primary()
  if (result.ok) return result
  const fallbackResult = fallback()
  if (fallbackResult.ok) return fallbackResult
  return err({ primary: result.error, fallback: fallbackResult.error })
}
```

### Circuit Breaker

```typescript
function createCircuitBreaker<T, E>(config: {
  failureThreshold: number
  resetTimeMs: number
}) {
  const state = { failures: 0, state: 'closed', lastFailureTime: 0 }

  return {
    execute(op: () => Result<T, E>): Result<T, E | { circuitOpen: true }> {
      if (state.state === 'open') {
        const elapsed = Date.now() - state.lastFailureTime
        if (elapsed < config.resetTimeMs) {
          return err({ circuitOpen: true })
        }
        state.state = 'half-open'
      }
      const result = op()
      if (result.ok) { state.failures = 0; state.state = 'closed' }
      else {
        state.failures++
        state.lastFailureTime = Date.now()
        if (state.failures >= config.failureThreshold) state.state = 'open'
      }
      return result
    },
  }
}
```

---

## ⚠️ Частые ошибки новичков

### Ошибка 1: catch (error: Error) вместо unknown

```typescript
// ❌ error может быть не Error
try { ... } catch (error: Error) { // TypeScript не позволит!
  // В JS можно бросить что угодно: throw "string", throw 42
}

// ✅ Всегда unknown, затем type guard
try { ... } catch (error: unknown) {
  if (error instanceof Error) { /* Error */ }
  else { /* другой тип */ }
}
```

### Ошибка 2: Смешение ошибок из разных слоёв

```typescript
// ❌ Один catch для всех слоёв
try {
  validate(data)      // ValidationError
  await db.save(data) // DatabaseError
  await notify(data)  // NotificationError
} catch (error) {
  // Какой это тип? Невозможно определить
}

// ✅ Каждый слой изолирован через boundary
const validated = domainBoundary.run(() => validate(data))
const saved = infraBoundary.run(() => db.save(data))
```

### Ошибка 3: throw внутри Result-цепочки

```typescript
// ❌ throw ломает Result-цепочку
function processData(input: string): ResultChain<Data, ProcessError> {
  if (!input) throw new Error('Empty input') // Выйдет из Result!
  return okChain(parse(input))
}

// ✅ Используйте errChain вместо throw
function processData(input: string): ResultChain<Data, ProcessError> {
  if (!input) return errChain({ _tag: 'ProcessError', reason: 'Empty input' })
  return okChain(parse(input))
}
```

### Ошибка 4: Retry без условия

```typescript
// ❌ Retry для всех ошибок — бессмысленно для ValidationError
retry(() => validateAndSave(data), { maxAttempts: 5 })

// ✅ Retry только для retryable-ошибок
const result = validateAndSave(data)
if (!result.ok && isRetryable(result.error)) {
  return retry(() => save(data), { maxAttempts: 3 })
}
```

---

## 💡 Best Practices

1. **Discriminated unions** вместо классов ошибок — `_tag` обеспечивает exhaustive checking
2. **Error boundaries** на каждом слое — domain, infra, presentation
3. **Result-цепочки** вместо try/catch — типы ошибок накапливаются и проверяются
4. **Retry только для retryable** — сетевые ошибки да, валидация нет
5. **Circuit breaker для внешних сервисов** — предотвращает каскадные сбои
6. **mapError для нормализации** — приводите ошибки к единому формату на границе слоя

---

## 📌 Итоги

| Паттерн | Когда использовать | Особенности |
|---------|-------------------|-------------|
| Error Hierarchy | Классификация ошибок | Exhaustive switch, специфичные поля |
| Error Boundaries | Изоляция слоёв | unknown -> типизированная ошибка |
| Result Chains | Распространение ошибок | map/flatMap, накопление типов |
| Recovery Strategies | Восстановление после сбоев | retry, fallback, circuit breaker |
