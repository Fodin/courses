# Задание 7.1: test() — кастомная валидация

## Цель

Научиться создавать кастомные валидаторы с помощью `test()` — как синхронные, так и асинхронные.

## Требования

1. Создайте `passwordSchema` — строковая схема с кастомными тестами:
   - required, min(8)
   - test 'has-uppercase': содержит хотя бы одну заглавную букву
   - test 'has-lowercase': содержит хотя бы одну строчную букву
   - test 'has-digit': содержит хотя бы одну цифру

2. Создайте `usernameSchema` — строковая схема с **асинхронным** тестом:
   - required, min(3)
   - async test 'unique-username': имитация проверки через API
   - Запрещённые имена: 'admin', 'root', 'test', 'user'
   - Добавьте `setTimeout` для имитации задержки API (500ms)

3. Используйте `abortEarly: false` для пароля, чтобы показать все ошибки

## Чеклист

- [ ] `passwordSchema` имеет три `.test()` для uppercase, lowercase, digit
- [ ] Каждый test возвращает `true` для null/undefined (пусть required обрабатывает)
- [ ] `usernameSchema` имеет асинхронный `.test()` с `async/await`
- [ ] Запрещённые имена проверяются case-insensitive
- [ ] Показывается состояние загрузки при async-проверке

## Как проверить себя

1. Password "MyPass123" — успех
2. Password "mypass123" — ошибка "uppercase"
3. Password "MYPASS123" — ошибка "lowercase"
4. Password "MyPassABC" — ошибка "digit"
5. Password "Ab1" — ошибка "min 8"
6. Username "johndoe" — успех (после задержки)
7. Username "admin" — ошибка "already taken"
8. Username "ab" — ошибка "min 3"
