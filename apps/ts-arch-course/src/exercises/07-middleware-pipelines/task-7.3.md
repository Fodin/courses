# Задание 7.3: Interceptors

## 🎯 Цель

Реализовать паттерн интерсепторов (перехватчиков) с типизированными before/after хуками и обработкой ошибок, следуя модели «луковицы» (onion model).

## Требования

1. Создайте интерфейс `Interceptor<TReq, TRes>` с опциональными хуками:
   - `before: (req: TReq) => TReq` — трансформация запроса
   - `after: (res: TRes) => TRes` — трансформация ответа
   - `onError: (error: Error, req: TReq) => TRes | never` — обработка ошибок
2. Реализуйте `createInterceptorPipeline(interceptors, handler)`:
   - Before хуки выполняются в прямом порядке
   - After хуки выполняются в обратном порядке
   - Error хуки пробуются в обратном порядке
3. Создайте минимум 3 интерсептора: auth (before), timing (before + after), error handler (onError)

## Чеклист

- [ ] `Interceptor<TReq, TRes>` имеет типизированные `before`, `after`, `onError`
- [ ] Before хуки выполняются в прямом порядке (1 -> 2 -> 3)
- [ ] After хуки выполняются в обратном порядке (3 -> 2 -> 1)
- [ ] При ошибке handler пробуются error хуки в обратном порядке
- [ ] Auth интерсептор добавляет заголовок авторизации
- [ ] Error интерсептор возвращает типизированный ответ об ошибке

## Как проверить себя

Создайте pipeline с 3 интерсепторами и проверьте два сценария: успешный запрос (before -> handler -> after) и ошибка handler (before -> handler throws -> onError). Убедитесь, что типы request и response сохраняются на всех этапах.
