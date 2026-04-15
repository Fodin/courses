# Задание 11.3. Effect: Layer и Dependency Injection

## Цель

Понять паттерн Layer для инъекции зависимостей в Effect. Научиться определять сервисы через `Context.Tag`, создавать реализации через `Layer.succeed`, и менять поведение программы без изменения бизнес-логики.

## Требования

1. Определи два сервиса через `Context.Tag`:
   - `class Calculator` — сервис с методами `add(a: number, b: number): Effect.Effect<number>` и `multiply(a: number, b: number): Effect.Effect<number>`
   - `class AuditLog` — сервис с методом `record(operation: string): Effect.Effect<void>`
2. Создай две реализации `Calculator`:
   - `StandardCalculator` — обычные операции
   - `SlowCalculator` — добавляет задержку 500мс через `Effect.promise(() => new Promise(res => setTimeout(res, 500))).pipe(Effect.flatMap(() => Effect.succeed(a + b)))`
3. Создай две реализации `AuditLog`:
   - `ConsoleAuditLog` — `Layer.succeed` с `record: op => Effect.sync(() => console.log('[AUDIT]', op))`
   - `InMemoryAuditLog` — хранит записи в массиве (используй `Ref` или передай массив снаружи)
4. Реализуй программу через `Effect.gen`:
   ```typescript
   const program = (a: number, b: number) => Effect.gen(function* () {
     const calc = yield* Calculator
     const log  = yield* AuditLog
     yield* log.record(`add(${a}, ${b})`)
     const sum = yield* calc.add(a, b)
     yield* log.record(`multiply(${sum}, 2)`)
     const result = yield* calc.multiply(sum, 2)
     return result
   })
   ```
5. Запускай `Effect.provide(program(a, b), Layer.merge(CalcLayer, LogLayer))`.
6. Покажи переключатель реализаций и лог записей.

## Чеклист

- [ ] Два сервиса через `Context.Tag`
- [ ] Каждый сервис имеет минимум 2 реализации через `Layer.succeed`
- [ ] `program` использует `Effect.gen` и `yield*` для получения сервисов
- [ ] `Effect.provide` + `Layer.merge` для инъекции зависимостей
- [ ] Переключение Layer меняет поведение без изменения `program`
- [ ] Для `SlowCalculator` — визуально видна задержка

## Как проверить себя

1. С `StandardCalculator`: `program(3, 4)` → 14 сразу (3 + 4 = 7, 7 * 2 = 14)
2. С `SlowCalculator`: тот же результат 14, но с задержкой ~1 секунду
3. Переключение `AuditLog` меняет где логи появляются (консоль vs UI)
4. `program` — один и тот же код в обоих случаях
