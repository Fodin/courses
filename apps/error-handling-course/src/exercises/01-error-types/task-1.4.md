# Задание 1.4: Type guards для ошибок

## Цель

Научиться писать type guards для безопасной работы с ошибками в TypeScript.

## Требования

1. Напишите type guard `isError(value: unknown): value is Error`
2. Напишите type guard `isApiError(value)` для объектов вида `{ error: { code, message } }`
3. Напишите type guard `isErrorWithCode(error)` для ошибок с полем `code`
4. Создайте функцию `getErrorMessage(error: unknown): string`, которая:
   - Для `Error` возвращает `error.message`
   - Для API-ошибки возвращает `[code] message`
   - Для строки возвращает саму строку
   - Для остального — `"Неизвестная ошибка"`
5. Протестируйте на массиве разных значений

## Чеклист

- [ ] `isError` корректно определяет `Error`
- [ ] `isApiError` корректно определяет API-ошибки
- [ ] `isErrorWithCode` проверяет наличие поля `code`
- [ ] `getErrorMessage` обрабатывает все случаи
- [ ] Результаты тестов на странице
