# Задание 9.1: Error Hierarchy

## 🎯 Цель

Создать типобезопасную иерархию ошибок на основе discriminated unions с exhaustive handling через switch.

## Требования

1. Создайте базовый интерфейс `BaseAppError` с полями `_tag` (дискриминант), `message`, `timestamp`
2. Создайте минимум 5 конкретных типов ошибок, расширяющих `BaseAppError`, каждый со своими специфичными полями:
   - `ValidationError` — `field`, `rule`
   - `NetworkError` — `url`, `statusCode`
   - `NotFoundError` — `resource`, `id`
   - `AuthorizationError` — `requiredRole`, `currentRole`
   - `RateLimitError` — `retryAfterMs`
3. Создайте union type `AppError` из всех конкретных типов
4. Реализуйте функцию `formatError(error: AppError)` с exhaustive switch
5. Реализуйте функцию `isRetryable(error: AppError)` для определения повторяемых ошибок

## Чеклист

- [ ] Каждый тип ошибки имеет уникальный `_tag` string literal
- [ ] `formatError` использует exhaustive switch (все ветки покрыты)
- [ ] В каждой ветке switch TypeScript сужает тип до конкретной ошибки
- [ ] `isRetryable` определяет повторяемость на основе `_tag`
- [ ] Фабричная функция `createError` добавляет timestamp автоматически
- [ ] Добавление нового типа ошибки вызывает ошибки компиляции в switch

## Как проверить себя

Создайте экземпляры каждого типа ошибки и передайте в `formatError`. Убедитесь, что TypeScript сужает типы в switch. Попробуйте добавить новый тип ошибки в union — компилятор должен указать на неполные switch.
