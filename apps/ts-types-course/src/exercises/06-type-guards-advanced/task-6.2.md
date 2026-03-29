# Задание 6.2: Assertion Functions

## Цель

Научиться использовать `asserts` для runtime-валидации с автоматическим сужением типов — assertion бросает ошибку или гарантирует тип.

## Требования

1. Создайте функцию `assertDefined<T>(value: T | null | undefined): asserts value is T`, которая бросает ошибку для null/undefined
2. Создайте функцию `assertIsUser(value: unknown): asserts value is User` с полной проверкой всех полей объекта
3. Создайте assertion-функции для числовых ограничений: `assertPositive`, `assertInRange`
4. Создайте `assertNonEmptyArray<T>(arr: T[]): asserts arr is [T, ...T[]]` для непустых массивов
5. Продемонстрируйте цепочку assertions: последовательные вызовы сужают тип шаг за шагом
6. Покажите обработку ошибок через try/catch для каждой assertion

## Чеклист

- [ ] `assertDefined` бросает ошибку для null/undefined, сужает тип до `T`
- [ ] `assertIsUser` проверяет все поля и бросает ошибку с описанием невалидного поля
- [ ] `assertPositive` и `assertInRange` корректно валидируют числа
- [ ] `assertNonEmptyArray` сужает до tuple-типа `[T, ...T[]]`
- [ ] Показаны try/catch примеры с корректной обработкой ошибок
- [ ] Результаты отображаются на странице

## Как проверить себя

1. Нажмите кнопку «Запустить»
2. Убедитесь, что `assertDefined("Alice")` не бросает ошибку, а `assertDefined(null)` — бросает
3. Убедитесь, что `assertIsUser` даёт понятное сообщение для невалидных данных
4. Проверьте, что `assertNonEmptyArray` позволяет деструктуризацию `[first, ...rest]`
