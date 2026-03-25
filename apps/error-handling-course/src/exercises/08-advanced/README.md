# 🔥 Уровень 8: Продвинутые паттерны

## Введение

На этом уровне мы объединяем все изученные техники: функциональный подход к ошибкам, тестирование ошибок и создание полноценного приложения с комплексной обработкой ошибок.

🎯 **Цель уровня:** освоить паттерн Result для функциональной обработки ошибок, научиться тестировать ошибки и собрать все знания курса в финальном проекте.

## 🔥 Функциональная обработка ошибок

### Операции над Result

```typescript
type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E }

// Трансформация значения
function map<T, U, E>(result: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return result.ok ? ok(fn(result.value)) : result
}

// Цепочка Result-операций
function flatMap<T, U, E>(result: Result<T, E>, fn: (v: T) => Result<U, E>): Result<U, E> {
  return result.ok ? fn(result.value) : result
}

// Трансформация ошибки
function mapError<T, E, F>(result: Result<T, E>, fn: (e: E) => F): Result<T, F> {
  return result.ok ? result : err(fn(result.error))
}

// Значение по умолчанию
function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.ok ? result.value : defaultValue
}
```

💡 **Подсказка:** `map` аналогичен `Array.map` — трансформирует значение внутри контейнера, не меняя структуру. `flatMap` — то же самое, но функция сама возвращает `Result`, что позволяет выстраивать цепочки без вложенности.

### Цепочка (pipeline)

```typescript
const result = flatMap(
  flatMap(
    safeParseNumber(input),
    validatePositive
  ),
  safeSqrt
)

const output = map(result, v => `Ответ: ${v.toFixed(2)}`)
const text = unwrapOr(output, 'Ошибка вычисления')
```

## 🔥 Тестирование ошибок

### 🎯 Что тестировать

1. **Функция бросает ошибку** при невалидных данных
2. **Тип ошибки** соответствует ожиданию
3. **Сообщение ошибки** содержит нужную информацию
4. **Функция НЕ бросает** при валидных данных

### Паттерн тестирования throw

```typescript
function expectToThrow(fn: () => void, ErrorType?: new (...args: any[]) => Error) {
  try {
    fn()
    throw new Error('Expected function to throw')
  } catch (e) {
    if (e.message === 'Expected function to throw') throw e
    if (ErrorType && !(e instanceof ErrorType)) {
      throw new Error(`Expected ${ErrorType.name}, got ${e.constructor.name}`)
    }
  }
}

// Использование
expectToThrow(() => divideByZero(10, 0))
expectToThrow(() => validateAge(-1), RangeError)
```

### Тестирование async ошибок

```typescript
async function expectAsyncToThrow(fn: () => Promise<unknown>) {
  try {
    await fn()
    throw new Error('Expected promise to reject')
  } catch (e) {
    if (e.message === 'Expected promise to reject') throw e
    return e // Вернуть для дальнейших проверок
  }
}
```

## 🎯 Финальный проект: Todo с обработкой ошибок

Объединяем все техники:

- ✅ **Custom errors** (AppError с code)
- ✅ **API обработка** (simulateTodoApi)
- ✅ **Состояния загрузки** (loading/error)
- ✅ **UI ошибки** (role="alert", inline)
- ✅ **Retry** (повтор при серверной ошибке)
- ✅ **Валидация** (пустой текст)
- ✅ **Graceful degradation** (приложение продолжает работать при ошибке)

## ⚠️ Частые ошибки новичков

### 1. ❌ Использование try/catch вместо Result для ожидаемых ошибок

```typescript
// ❌ Плохо — throw для бизнес-логики
function parseAge(input: string): number {
  const n = Number(input)
  if (isNaN(n)) throw new Error('Не число')
  if (n < 0) throw new Error('Отрицательный возраст')
  return n
}

// Вызывающий код обязан помнить про try/catch, иначе приложение упадёт
const age = parseAge(userInput) // 🐛 Может бросить, но ничего не подсказывает об этом
```

`throw` для ожидаемых ситуаций (невалидный ввод) делает ошибки невидимыми на уровне типов. Вызывающий код не знает, что функция может бросить — компилятор TypeScript не предупредит о пропущенном catch. `Result` делает возможность ошибки явной.

```typescript
// ✅ Хорошо — Result делает ошибку явной в типах
function parseAge(input: string): Result<number, string> {
  const n = Number(input)
  if (isNaN(n)) return err('Не число')
  if (n < 0) return err('Отрицательный возраст')
  return ok(n)
}

// Вызывающий код ОБЯЗАН обработать оба случая
const result = parseAge(userInput)
if (!result.ok) {
  showError(result.error)
}
```

### 2. ❌ Забыть проверить маркер в expectToThrow

```typescript
// ❌ Плохо — если функция не бросает, тест тихо проходит
function expectToThrow(fn: () => void) {
  try {
    fn()
  } catch (e) {
    return // Ошибка поймана — тест прошёл
  }
}

expectToThrow(() => safeFunction()) // 🐛 Тест "прошёл", хотя функция не бросила!
```

Без маркерной ошибки `expectToThrow` не отличает ситуацию «функция бросила ожидаемую ошибку» от «функция отработала без ошибки». Тест будет зелёным в обоих случаях — бесполезный тест.

```typescript
// ✅ Хорошо — маркер гарантирует провал теста, если функция не бросает
function expectToThrow(fn: () => void) {
  try {
    fn()
    throw new Error('Expected function to throw') // Маркер
  } catch (e) {
    if (e.message === 'Expected function to throw') throw e // Пробрасываем маркер
    // Иначе — поймали ожидаемую ошибку, тест прошёл
  }
}
```

### 3. ❌ Вложенные flatMap без промежуточных переменных

```typescript
// ❌ Плохо — нечитаемая вложенность
const result = flatMap(
  flatMap(
    flatMap(
      flatMap(
        safeParseNumber(input),
        validatePositive
      ),
      safeSqrt
    ),
    formatNumber
  ),
  saveToDatabase
)
```

Глубокая вложенность `flatMap` делает код трудным для чтения и отладки. Непонятно, на каком этапе произошла ошибка, и сложно вставить промежуточное логирование.

```typescript
// ✅ Хорошо — промежуточные переменные с понятными именами
const parsed = safeParseNumber(input)
const validated = flatMap(parsed, validatePositive)
const calculated = flatMap(validated, safeSqrt)
const formatted = flatMap(calculated, formatNumber)
const saved = flatMap(formatted, saveToDatabase)
```

### 4. ❌ Не тестировать «счастливый путь» наряду с ошибками

```typescript
// ❌ Плохо — тестируем только ошибочные случаи
expectToThrow(() => divide(10, 0))
expectToThrow(() => divide(0, 0))
// А что если divide(10, 2) тоже бросает? Мы этого не узнаем!
```

Если тестировать только ошибочные случаи, можно пропустить ситуацию, когда функция бросает ошибку и на валидных данных. Баг останется незамеченным.

```typescript
// ✅ Хорошо — тестируем и ошибки, и нормальную работу
// Ошибочные случаи
expectToThrow(() => divide(10, 0))

// Счастливый путь — НЕ должен бросать
const result = divide(10, 2)
assert(result === 5)
```

## 📌 Итоги курса

Вы изучили:

1. 🔥 **Основы** — try/catch/finally, throw, Error object
2. 🔥 **Типы ошибок** — встроенные, custom, иерархия, type guards
3. 🔥 **Асинхронность** — Promises, async/await, retry
4. 🔥 **TypeScript** — Result type, discriminated unions, exhaustive handling
5. 🔥 **React** — Error Boundaries, fallback UI, recovery
6. 🔥 **Data fetching** — fetch errors, API errors, loading states
7. 🔥 **Формы** — валидация, серверные ошибки, a11y
8. 🔥 **Глобальная обработка** — window.onerror, логирование, мониторинг
9. 🔥 **Продвинутые паттерны** — функциональный подход, тестирование
