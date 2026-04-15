# Задание 13.1. FP-валидация формы

## Цель

Реализовать две стратегии валидации формы регистрации на основе Either:
- **Either (fail-fast)** — прерывается на первой ошибке (monadic chain)
- **Validation (collect all)** — собирает все ошибки сразу (applicative)

## Требования

1. Реализуй `mapRight(e, f)` — применяет `f` к значению `Right`, `Left` пропускает без изменений.
2. Реализуй `flatMap(e, f)` — если `Right`, передаёт значение в `f` и возвращает её результат; если `Left` — возвращает `e` без вызова `f`.
3. Реализуй четыре валидатора полей:
   - `validateName(name)` — не пустое, 2–50 символов
   - `validateEmail(email)` — содержит `@` и `.`
   - `validateAge(ageStr)` — парсится в число, 18–120
   - `validatePassword(password)` — мин. 8 символов, хотя бы 1 цифра (`\d`), хотя бы 1 заглавная буква (`[A-Z]`)
4. Реализуй `validateEither(data)` через `flatMap`-цепочку: при первой ошибке возвращает `Left(error)`, остальные поля не проверяются.
5. Реализуй `validateCollect(data)`: запускает все четыре валидатора независимо, собирает ошибки в `Left(errors[])`, при успехе возвращает `Right<ValidData>`.

## Чеклист

- [ ] `mapRight` возвращает `Right(f(value))` для Right и исходный Left для Left
- [ ] `flatMap` возвращает `f(value)` для Right (может быть Left или Right) и исходный Left для Left
- [ ] `validateName`: пустое → Left, < 2 симв. → Left, > 50 симв. → Left, иначе Right
- [ ] `validateEmail`: нет `@` → Left, нет `.` → Left, иначе Right
- [ ] `validateAge`: NaN → Left, < 18 → Left, > 120 → Left, иначе Right(number)
- [ ] `validatePassword`: < 8 симв. → Left, нет цифры → Left, нет заглавной → Left, иначе Right
- [ ] `validateEither` останавливается на первой ошибке
- [ ] `validateCollect` возвращает Left с массивом ВСЕХ ошибок при наличии хотя бы одной
- [ ] `validateCollect` возвращает Right<ValidData> только если все поля валидны

## Как проверить себя

1. Переключись на режим "Either (fail-fast)". Введи только пустое имя — форма показывает одну ошибку имени, email/age/password помечены как "не проверено".
2. Переключись на "Validation (collect all)". Оставь все поля пустыми — форма показывает 4 ошибки одновременно.
3. Исправь только имя и email, оставь невалидный возраст и пароль — в collect-режиме показываются ровно 2 ошибки.
4. Заполни все поля корректно — в обоих режимах результат: `Right { name, email, age, password }`.
5. В режиме Either при ошибке имени — `validateEmail` не вызывается (можно проверить через `console.log` внутри валидатора).
