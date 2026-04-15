# Задание 11.2. Effect: типизированные ошибки

## Цель

Научиться работать с typed errors в Effect: определять классы ошибок с `_tag`, строить pipeline с несколькими типами ошибок, перехватывать конкретные ошибки через `catchTag`.

## Требования

1. Определи три класса ошибок с полем `readonly _tag`:
   - `class ParseError { _tag = 'ParseError'; constructor(readonly input: string) {} }`
   - `class RangeError { _tag = 'RangeError'; constructor(readonly value: number, readonly min: number, readonly max: number) {} }`
   - `class FormatError { _tag = 'FormatError'; constructor(readonly expected: string) {} }`
2. Реализуй функции:
   - `parseNumber(s: string): Effect.Effect<number, ParseError>` — `Effect.fail(new ParseError(s))` если `isNaN`
   - `checkRange(n: number, min: number, max: number): Effect.Effect<number, RangeError>` — `Effect.fail(new RangeError(...))` если вне диапазона
   - `formatResult(n: number): Effect.Effect<string, FormatError>` — возвращает `"[${n}]"` если чётное, иначе `Effect.fail(new FormatError("even number required"))`
3. Собери pipeline:
   ```
   parseNumber(input) -> checkRange(n, 1, 100) -> formatResult(n)
   ```
4. Добавь обработку: `catchTag('RangeError', e => Effect.succeed(e.min))` — если число вне диапазона, используй минимальное значение.
5. Отобрази интерактивно: поле ввода строки, кнопка "Run", вывод результата или типа ошибки.

## Чеклист

- [ ] Три класса ошибок с `readonly _tag`
- [ ] `parseNumber` использует `Effect.fail(new ParseError(...))`
- [ ] `checkRange` использует `Effect.fail(new RangeError(...))`
- [ ] Pipeline собран через `pipe` + `Effect.flatMap`
- [ ] `catchTag('RangeError', ...)` перехватывает только этот тип
- [ ] После `catchTag` тип ошибки в pipeline сужается (нет `RangeError`)

## Как проверить себя

1. Ввод `"abc"` → ParseError (pipeline падает)
2. Ввод `"150"` → RangeError перехвачен, используется `1` → `"[1]"` (чётное) → успех
3. Ввод `"7"` → FormatError (нечётное число)
4. Ввод `"42"` → успех, результат `"[42]"`
5. TypeScript должен показывать тип результата pipeline после `catchTag` — `RangeError` исчезает из типа ошибки
