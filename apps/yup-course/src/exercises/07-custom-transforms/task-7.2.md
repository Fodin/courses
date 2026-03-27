# Задание 7.2: transform()

## Цель

Научиться использовать `transform()` для нормализации данных перед валидацией.

## Требования

1. Создайте `contactSchema` — объектную схему:
   - `email`: transform (trim + lowercase) → email() → required()
   - `phone`: transform (удалить все нецифровые символы) → matches 10-11 цифр → required()
   - `name`: transform (trim + нормализация пробелов: `replace(/\s+/g, ' ')`) → required() → min(2)

2. Реализуйте две кнопки:
   - **Validate** — полная валидация с трансформацией
   - **Cast Only** — только трансформация без валидации (через `schema.cast()`)

3. Покажите результат трансформации, чтобы студент видел разницу между вводом и выводом

## Чеклист

- [ ] Email: "  USER@EXAMPLE.COM  " → "user@example.com"
- [ ] Phone: "+7 (999) 123-45-67" → "79991234567"
- [ ] Name: "  John    Doe  " → "John Doe"
- [ ] transform() стоит **перед** validation rules
- [ ] Cast Only показывает трансформированные данные без валидации

## Как проверить себя

1. Defaults: нажмите "Cast Only" — увидите трансформированные данные
2. Defaults: нажмите "Validate" — успех с трансформированными данными
3. Email пусто → ошибка required
4. Phone "abc" → ошибка (0 цифр, нужно 10-11)
5. Name "A" → ошибка min(2)
