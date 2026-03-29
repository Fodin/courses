# Задание 6.1: Custom Type Predicates

## Цель

Научиться создавать переиспользуемые type guard функции с `is`-предикатами для сужения типов.

## Требования

1. Создайте интерфейсы `User`, `Admin` (extends User), `Guest` и union-тип `Actor`
2. Реализуйте type guard функции `isUser`, `isAdmin`, `isGuest` с корректными runtime-проверками и return type `actor is Type`
3. Создайте generic type guard `isNotNull<T>(value: T | null | undefined): value is T` для фильтрации массивов
4. Реализуйте composable guards: `isString`, `isNumber`, `isNonEmptyString` — где сложные guards строятся из простых
5. Продемонстрируйте использование type predicates с `Array.filter` для сужения типа элементов массива
6. Создайте guard для валидации API-ответа: `isSuccessResponse(resp): resp is SuccessResponse`

## Чеклист

- [ ] `isAdmin`, `isUser`, `isGuest` корректно проверяют runtime-свойства
- [ ] Type predicates (`is`) указаны в возвращаемом типе каждого guard
- [ ] `isNotNull` работает с `Array.filter` для сужения типа массива
- [ ] Composable guards строятся из более простых guards
- [ ] API guard проверяет статус и наличие данных
- [ ] Результаты отображаются на странице

## Как проверить себя

1. Нажмите кнопку «Запустить»
2. Убедитесь, что `isAdmin` возвращает `true` для объекта с `role: 'admin'`
3. Убедитесь, что `filter(isNotNull)` убирает `null` и `undefined` из массива
4. Проверьте, что `filter(isNonEmptyString)` фильтрует пустые строки и не-строки
