# Задание 10.3: TaskEither — async workflow

## Цель

Построить типобезопасный async workflow с несколькими точками отказа, используя `TaskEither` из fp-ts.

## Требования

1. Импортировать `* as TE from 'fp-ts/TaskEither'` и `* as E from 'fp-ts/Either'`
2. Реализовать три async функции с задержкой (setTimeout):
   - `authenticate(fail: boolean): TE.TaskEither<AuthError, User>`
   - `fetchProfile(user: User, fail: boolean): TE.TaskEither<NetworkError, Profile>`
   - `checkPermissions(profile: Profile, fail: boolean): TE.TaskEither<ForbiddenError, Permission>`
3. Скомпоновать через `pipe` + `TE.flatMap`
4. Запустить workflow через `await workflow()`
5. Показать визуализацию шагов: pending → running → ok/error
6. Чекбоксы для каждой точки отказа

## Чеклист

- [ ] Каждая функция возвращает `() => Promise<Either<Error, Value>>` (TaskEither = ленивый async)
- [ ] `TE.flatMap` для цепочки зависимых шагов
- [ ] Short-circuit: при ошибке на шаге 1 шаги 2 и 3 не выполняются
- [ ] Типы ошибок разные для каждого шага
- [ ] Workflow запускается через `await workflow()`, не `await workflow`
- [ ] UI показывает текущий шаг и результат

## Как проверить себя

- Все чекбоксы выключены → успех, все шаги зелёные
- Auth fails включён → ошибка на шаге 1, шаги 2-3 серые (skipped)
- Network fails включён → ошибка на шаге 2, шаг 3 серый
- Forbidden включён → ошибка на шаге 3
- Смена чекбоксов и повторный запуск → корректная новая визуализация
