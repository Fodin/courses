---
name: Error Handling Course Terminology
description: Standard terminology and translation choices for error handling JavaScript/TypeScript course
type: reference
---

## Key Technical Terms

### Promise and Async Patterns
- асинхронный код → asynchronous code
- асинхронные ошибки → asynchronous errors
- цепочка промисов → promise chain
- отклоняется → rejects (for promises)
- проваливается (об ошибке) → falls through
- await → await (unchanged)
- try/catch → try/catch (unchanged)
- .then/.catch → .then/.catch (unchanged)

### Error Handling
- обработка ошибок → error handling
- обработчик → handler
- необработанное отклонение → unhandled rejection
- пробросить (ошибку) → re-throw / throw
- забытый → forgotten
- ошибка обработки → processing error
- таймаут → timeout

### Promise Methods
- Promise.all → Promise.all
- Promise.allSettled → Promise.allSettled
- Promise.race → Promise.race
- Promise.any → Promise.any
- Promise.reject → Promise.reject
- AggregateError → AggregateError

### Retry Pattern
- паттерн retry → retry pattern
- максимальное число попыток → maximum number of attempts
- задержка между попытками → delay between attempts
- повторные попытки → retry attempts
- экспоненциальная задержка → exponential backoff

### TypeScript Patterns
- Result тип → Result type
- Either паттерн → Either pattern
- union type → union type (unchanged)
- дискриминант → discriminant
- сужение типов → type narrowing
- discriminated unions → discriminated unions (unchanged)
- exhaustive handling → exhaustive handling (unchanged)
- assertNever → assertNever (unchanged)
- Тип-безопасная → type-safe

### States and Status
- состояние → state
- статус → status (in code context)
- успешный результат → successful result
- состояние загрузки → loading state
- idle → idle (unchanged)
- loading → loading (unchanged)
- success → success (unchanged)
- error → error (unchanged)

### Error Codes
- VALIDATION → VALIDATION
- NOT_FOUND → NOT_FOUND
- UNAUTHORIZED → UNAUTHORIZED
- NETWORK → NETWORK
- UNKNOWN → UNKNOWN

## Technical Context Preferences
- Field names in code never translated (e.g., `details`, `field`, `resource`, `id`)
- Status/discriminant values always in lowercase English (e.g., 'fulfilled', 'rejected')
- Code comments should be translated to English
- Error messages in code examples can be translated or kept English depending on context
