# Задание 6.1: when() — базовое использование

## Цель

Научиться использовать `when()` для условной валидации — когда правила одного поля зависят от значения другого.

## Требования

1. Создайте `accountSchema` — объектную схему с полями:
   - `isBusiness` — boolean, required
   - `companyName` — string, **required только если** `isBusiness === true`
   - `personalName` — string, **required только если** `isBusiness === false`

2. Используйте `when('isBusiness', { is, then, otherwise })` для каждого условного поля

3. Валидируйте с `abortEarly: false` для показа всех ошибок

4. При успехе — покажите данные в зелёном блоке

5. При ошибке — покажите список ошибок в красном блоке

## Чеклист

- [ ] `companyName` использует `.when('isBusiness', { is: true, then: ..., otherwise: ... })`
- [ ] `personalName` использует `.when('isBusiness', { is: false, then: ..., otherwise: ... })`
- [ ] Пустые строки передаются как `undefined` для корректной работы `required()`
- [ ] Валидация с `abortEarly: false`
- [ ] Результат отображается в цветном блоке

## Как проверить себя

1. Business ON + companyName = "Acme" — успех
2. Business ON + companyName пусто — ошибка "Company name is required"
3. Business OFF + personalName = "John" — успех
4. Business OFF + personalName пусто — ошибка "Personal name is required"
5. Business ON — personalName не валидируется (optional)
