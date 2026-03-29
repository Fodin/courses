# Задание 1.3: Обработка ошибок

## 🎯 Цель

Реализовать централизованную обработку ошибок в Express: error-handling middleware, пользовательские классы ошибок и обёртку для async-обработчиков.

## Требования

1. Создайте error-handling middleware с 4 аргументами `(err, req, res, next)`
2. Реализуйте класс `AppError` с полями `message`, `statusCode`, `code` для типизированных ошибок (404, 409, 401, 403, 422)
3. Реализуйте `asyncHandler` -- обёртку, которая ловит ошибки из async-функций и передаёт их в `next()`
4. Покажите поток ошибки: handler throws -> asyncHandler catches -> errorHandler responds

## Чеклист

- [ ] Error middleware имеет ровно 4 аргумента (Express определяет его по количеству)
- [ ] `AppError` содержит `statusCode` и машиночитаемый `code`
- [ ] `asyncHandler` оборачивает `Promise.resolve(fn()).catch(next)`
- [ ] Показан полный поток: ошибка в handler -> catch -> error middleware -> JSON-ответ клиенту
- [ ] Error middleware стоит последним в цепочке `app.use`

## Как проверить себя

Нажмите "Запустить" и убедитесь, что симуляция показывает: создание ошибок разных типов, прохождение через asyncHandler и формирование JSON-ответа с правильным статус-кодом.
