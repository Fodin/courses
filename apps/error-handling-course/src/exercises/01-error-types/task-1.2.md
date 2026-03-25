# Задание 1.2: Custom Error классы

## Цель

Научиться создавать собственные классы ошибок с дополнительным контекстом.

## Требования

1. Создайте класс `ValidationError extends Error` с полем `field: string`
2. Создайте класс `HttpError extends Error` с полем `statusCode: number`
3. Создайте класс `NotFoundError extends HttpError` с кодом 404
4. В каждом классе установите `this.name` в имя класса
5. Продемонстрируйте, что `NotFoundError` является и `HttpError`, и `Error`

## Чеклист

- [ ] `ValidationError` создан с полем `field`
- [ ] `HttpError` создан с полем `statusCode`
- [ ] `NotFoundError` наследует от `HttpError`
- [ ] `this.name` установлен во всех классах
- [ ] Цепочка `instanceof` работает корректно
