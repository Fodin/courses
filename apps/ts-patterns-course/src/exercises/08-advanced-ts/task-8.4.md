# Задание 8.4: Effect Pattern

## Цель

Реализовать паттерн Effect — ленивые вычисления с типизированными зависимостями (`R`), ошибками (`E`) и результатом (`A`). TypeScript автоматически объединяет зависимости и ошибки при композиции эффектов.

## Требования

1. Определите `Result<E, A>` — дискриминированное объединение:
   - `{ success: true, value: A }`
   - `{ success: false, error: E }`
2. Создайте конструкторы `ok<A>(value)` и `err<E>(error)`
3. Создайте класс `Effect<R, E, A>` с:
   - `constructor(run: (context: R) => Result<E, A>)`
   - `map<B>(f: (a: A) => B): Effect<R, E, B>`
   - `flatMap<R2, E2, B>(f: (a: A) => Effect<R2, E2, B>): Effect<R & R2, E | E2, B>`
   - `catchError<E2, B>(f: (e: E) => Effect<R, E2, B>): Effect<R, E2, A | B>`
4. Создайте smart-конструкторы:
   - `succeed<A>(value): Effect<unknown, never, A>`
   - `fail<E>(error): Effect<unknown, E, never>`
   - `service<R, A>(f: (ctx: R) => A): Effect<R, never, A>`
   - `serviceWithError<R, E, A>(f: (ctx: R) => Result<E, A>): Effect<R, E, A>`
5. Определите сервисы: `DatabaseService`, `EmailService`, `LoggerService`
6. Определите ошибки: `DatabaseError`, `EmailError`, `NotFoundError`
7. Реализуйте эффекты `findUser`, `sendEmail`, `logMessage`
8. Скомпонуйте `notifyUser` через `flatMap` — TypeScript должен автоматически вывести объединённые `R` и `E`
9. Продемонстрируйте: успех, ошибку, восстановление через `catchError`, трансформацию через `map`

## Чеклист

- [ ] `Effect<R, E, A>` корректно параметризован тремя generic-параметрами
- [ ] `flatMap` объединяет requirements через `R & R2` и errors через `E | E2`
- [ ] `catchError` позволяет восстановиться после ошибки
- [ ] `map` трансформирует значение без изменения `R` и `E`
- [ ] `findUser` требует `{ db: DatabaseService }`, может вернуть `NotFoundError`
- [ ] `sendEmail` требует `{ email: EmailService }`, может вернуть `EmailError`
- [ ] `notifyUser` автоматически требует все три сервиса и может вернуть оба типа ошибок
- [ ] Эффекты ленивые — ничего не выполняется до вызова `.run(context)`

## Как проверить себя

1. Нажмите кнопку запуска — все 4 кейса выполняются корректно
2. Попробуйте запустить `notifyUser` без одного из сервисов в контексте — должна быть ошибка компиляции
3. Убедитесь, что `catchError` перехватывает ошибку `NotFoundError` и возвращает fallback-значение
4. Наведите курсор на тип `notifyUser` — TypeScript должен показать `Effect<{db, email, logger}, NotFoundError | EmailError, string>`
