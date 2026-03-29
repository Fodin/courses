# Задание 12.1: Error Classes

## Цель

Научиться различать operational и programmer errors, создавать пользовательские иерархии ошибок с кодами, использовать `Error.captureStackTrace` и `error.cause`.

## Требования

1. Объясните разницу между operational errors и programmer errors с примерами
2. Покажите системные коды ошибок Node.js (ENOENT, EACCES, EADDRINUSE и др.)
3. Создайте иерархию пользовательских ошибок: AppError → ValidationError, NotFoundError, DatabaseError
4. Продемонстрируйте Error.captureStackTrace для чистых stack traces
5. Покажите error.cause (ES2022) для цепочки ошибок
6. Продемонстрируйте проверку типа ошибки через instanceof

## Чеклист

- [ ] Operational vs programmer errors объяснены
- [ ] Системные коды ошибок перечислены
- [ ] Иерархия пользовательских ошибок создана
- [ ] Error.captureStackTrace использован
- [ ] error.cause для цепочки ошибок показан
- [ ] instanceof проверка продемонстрирована

## Как проверить себя

1. Нажмите "Запустить" — должны отобразиться все типы ошибок
2. Убедитесь, что каждый класс ошибки имеет уникальный code и statusCode
3. Проверьте, что error.cause сохраняет оригинальную ошибку
4. Убедитесь, что instanceof корректно определяет тип ошибки
