# Задание 11.1. Effect: основы и ленивость

## Цель

Понять разницу между ленивым (lazy) Effect и нетерпеливым (eager) Promise. Научиться создавать и запускать базовые эффекты.

## Требования

1. Создай функцию `makeCounter()`, которая возвращает `Effect.Effect<number>` — эффект, инкрементирующий внешний счётчик и возвращающий новое значение. Используй `Effect.sync`.
2. Убедись что счётчик не инкрементируется при создании эффекта — только при запуске через `Effect.runSync`.
3. Создай функцию `buildPipeline(start: number)` — Effect-цепочку из трёх шагов через `pipe`:
   - умножить на 2 (`Effect.map`)
   - добавить 10 (`Effect.flatMap` + `Effect.succeed`)
   - преобразовать в строку `"value: N"` (`Effect.map`)
4. Запусти pipeline через `Effect.runSync` и верни результат.
5. Создай `safeDivide(a: number, b: number): Effect.Effect<number, string>` — при `b === 0` возвращает `Effect.fail("division by zero")`, иначе `Effect.succeed(a / b)`.
6. Отобрази интерактивно: поле ввода для `start`, кнопка "Run pipeline", вывод результата.

## Чеклист

- [ ] `makeCounter` использует `Effect.sync`, счётчик не растёт при создании
- [ ] `buildPipeline` использует `pipe` + `Effect.map` + `Effect.flatMap`
- [ ] `safeDivide` возвращает `Effect.fail` при делении на ноль
- [ ] Все эффекты запускаются через `Effect.runSync`
- [ ] Интерактивный UI с полем ввода и кнопкой

## Как проверить себя

1. Создай `makeCounter` и вызови его 3 раза через `Effect.runSync` — счётчик должен увеличиться на 3.
2. Создай эффект через `makeCounter` но не запускай — счётчик не должен измениться.
3. `buildPipeline(5)` → `"value: 20"` (5 * 2 = 10, 10 + 10 = 20)
4. `safeDivide(10, 0)` → в типе ошибки есть `string`, runSync бросает исключение
