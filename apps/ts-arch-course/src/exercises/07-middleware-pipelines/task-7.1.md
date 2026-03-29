# Задание 7.1: Middleware Chain

## 🎯 Цель

Создать типобезопасную цепочку middleware, где каждый middleware получает типизированный контекст и может продолжить цепочку через `next()` или прервать её, вернув результат напрямую.

## Требования

1. Создайте тип `Middleware<TContext>` — функцию, принимающую контекст и `next`, возвращающую `TContext`
2. Реализуйте функцию `createMiddlewareChain(initialContext, ...middlewares)`, которая выполняет middleware последовательно
3. Каждый middleware должен иметь возможность:
   - Вызвать `next()` для передачи управления следующему middleware
   - Вернуть результат напрямую (short-circuit), не вызывая `next()`
4. Создайте интерфейс `RequestContext` с полями: `path`, `method`, `headers`, `body`, `status`, `responseBody`, `logs`
5. Реализуйте минимум 3 middleware: logging, auth, handler

## Чеклист

- [ ] `Middleware<TContext>` принимает `ctx: TContext` и `next: () => TContext`
- [ ] `createMiddlewareChain` выполняет middleware в порядке добавления
- [ ] Middleware может прервать цепочку, не вызвав `next()`
- [ ] Auth middleware возвращает 401 без вызова `next()` при отсутствии токена
- [ ] Logging middleware логирует до и после вызова `next()`
- [ ] Все типы контекста проверяются компилятором

## Как проверить себя

Создайте цепочку из 3-4 middleware и проверьте два сценария: с токеном (цепочка проходит полностью) и без токена (цепочка прерывается на auth). Убедитесь, что все middleware получают правильный тип контекста.
