# Задание 1.4: default и defined

## Цель

Понять, как `default()` задаёт значения по умолчанию и как `defined()` запрещает `undefined`.

## Требования

1. Создайте 3 схемы:
   - `string().default('Guest')` — строка с дефолтным значением
   - `number().default(0)` — число с дефолтным значением
   - `string().defined('Value must be defined')` — строка, запрещающая undefined

2. Для default-схем используйте `cast()` чтобы показать, как default подставляет значение

3. Для defined-схемы используйте `validate()` чтобы показать ошибку при undefined

4. Покажите результат каждой схемы

## Чеклист

- [ ] `string().default('Guest')` — cast пустого значения возвращает "Guest"
- [ ] `number().default(0)` — cast пустого значения возвращает 0
- [ ] `string().defined()` — validate с undefined вызывает ошибку
- [ ] Непустые значения проходят все проверки

## Как проверить себя

1. Оставьте поле пустым:
   - `string().default('Guest')` cast — "Guest"
   - `number().default(0)` cast — 0
   - `string().defined()` validate — ошибка

2. Введите "John":
   - `string().default('Guest')` cast — "John"
   - `number().default(0)` cast — NaN (строка не число)
   - `string().defined()` validate — "John"
