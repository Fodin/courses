# Задание 5.5: Invariant Types

## Цель

Научиться кодировать доменные инварианты в системе типов TypeScript, делая невалидные состояния невозможными на уровне компиляции.

## Требования

1. Реализуйте тип `NonEmptyArray<T>` и функцию `headOf`, которая безопасно извлекает первый элемент
2. Создайте workflow-типы: `UnverifiedEmail` и `VerifiedEmail` с разными branded types
3. Функция `sendNewsletter` должна принимать только `VerifiedEmail` -- передача `UnverifiedEmail` должна быть ошибкой компиляции
4. Реализуйте `NonNegativeBalance` с операциями `deposit` и `withdraw` (с проверкой достаточности средств)
5. Создайте `Percentage` -- число от 0 до 100 с функцией `applyDiscount`

## Чеклист

- [ ] `NonEmptyArray<T>` гарантирует наличие хотя бы одного элемента через tuple type
- [ ] `headOf` возвращает `T`, а не `T | undefined`
- [ ] `createNonEmpty([])` выбрасывает ошибку
- [ ] `sendNewsletter(unverifiedEmail, ...)` вызывает ошибку компиляции
- [ ] `withdraw` с суммой больше баланса выбрасывает ошибку
- [ ] `createPercentage(150)` выбрасывает ошибку

## Как проверить себя

1. Проверьте тип возврата `headOf` -- он должен быть `T`, а не `T | undefined`
2. Попробуйте передать `UnverifiedEmail` в `sendNewsletter` -- должна быть ошибка TS
3. Цепочка `deposit → withdraw → withdraw` должна корректно отслеживать баланс
