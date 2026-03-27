# Задание 0.2: Type Guards

## Цель

Научиться создавать пользовательские type guard функции для безопасного сужения типов.

## Требования

1. Создайте типы `SuccessResponse` и `ErrorResponse` с полем-дискриминантом `status`
2. Создайте type guard функции:
   - `isErrorResponse(resp): resp is ErrorResponse`
   - `isSuccessResponse(resp): resp is SuccessResponse`
3. Создайте систему фигур (`Circle`, `Rectangle`, `Triangle`) с полем `kind`
4. Создайте type guard `isCircle`, `isRectangle` и функцию `getArea` на их основе
5. Создайте универсальный guard `isNonNullable<T>` для фильтрации null/undefined

## Чеклист

- [ ] API response guards корректно сужают тип
- [ ] Shape guards работают с discriminated union
- [ ] `getArea` вычисляет площадь для всех фигур
- [ ] `isNonNullable` фильтрует null и undefined из массива
- [ ] Результаты отображаются на странице
