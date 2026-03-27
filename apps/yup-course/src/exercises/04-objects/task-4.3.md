# Задание 4.3: pick, omit, partial

## Цель

Научиться создавать производные схемы из базовой с помощью `pick()`, `omit()` и `partial()`.

## Требования

1. Создайте `fullPersonSchema` с полями: name, age, email, phone (все required)

2. Создайте `publicSchema` через `pick(['name', 'email'])`

3. Создайте `withoutPhoneSchema` через `omit(['phone'])`

4. Создайте `partialSchema` через `partial()`

5. Реализуйте выбор варианта схемы через `<select>` и валидацию JSON-данных

## Чеклист

- [ ] Базовая схема `fullPersonSchema` с 4 обязательными полями
- [ ] `publicSchema` содержит только name и email
- [ ] `withoutPhoneSchema` содержит всё кроме phone
- [ ] `partialSchema` делает все поля необязательными
- [ ] Переключение схемы и повторная валидация тех же данных

## Как проверить себя

1. Full schema + `{"name": "Alice"}` — ошибки (age, email, phone missing)
2. pick schema + `{"name": "Alice", "email": "a@b.com"}` — успех
3. omit schema + `{"name": "Alice", "age": 25, "email": "a@b.com"}` — успех (phone не нужен)
4. partial schema + `{}` — успех (всё опционально)
5. partial schema + `{"email": "bad"}` — ошибка (email формат, хоть и опционален)
