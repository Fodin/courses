# Задание 3.3: Type-safe ошибки

## Цель
Создать систему типизированных ошибок с кодами и дополнительным контекстом.

## Требования
1. Определите union тип кодов ошибок: `VALIDATION`, `NOT_FOUND`, `UNAUTHORIZED`, `NETWORK`, `UNKNOWN`
2. Создайте generic интерфейс `TypedError<C>` с полями `code`, `message`, `details?`
3. Специализируйте: `ValidationErr` с полем `field`, `NotFoundErr` с `resource` и `id`
4. Создайте функцию `handleAppError(error)`, обрабатывающую каждый код через switch
5. Отобразите обработку 5 разных ошибок

## Чеклист
- [ ] Union тип кодов определён
- [ ] `TypedError` generic интерфейс создан
- [ ] Специализированные типы с дополнительными полями
- [ ] `handleAppError` обрабатывает все коды
- [ ] TypeScript сужает тип в каждом case
