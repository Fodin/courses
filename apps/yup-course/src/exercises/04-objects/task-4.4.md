# Задание 4.4: noUnknown и strict

## Цель

Научиться запрещать неизвестные поля с помощью `noUnknown()` и контролировать их поведение через `strict` и `stripUnknown`.

## Требования

1. Создайте `strictUserSchema` с полями name и email, добавьте `.noUnknown()`

2. Реализуйте checkbox для переключения режима strict

3. В strict-режиме: неизвестные поля вызывают ошибку

4. В нестрогом режиме: используйте `stripUnknown: true` для удаления лишних полей

5. Отображайте результат — какие поля остались после валидации

## Чеклист

- [ ] Схема использует `noUnknown()` с кастомным сообщением
- [ ] Checkbox переключает `strict: true/false`
- [ ] strict + extra fields = ошибка
- [ ] non-strict + stripUnknown + extra fields = поля удалены
- [ ] Подпись под кнопкой объясняет текущий режим

## Как проверить себя

1. `{"name": "Alice", "email": "a@b.com"}` — успех в обоих режимах
2. `{"name": "Alice", "email": "a@b.com", "extra": "field"}`:
   - strict: ошибка "Unknown field: extra"
   - non-strict: успех, extra удалён из результата
3. `{"name": "Alice", "email": "a@b.com", "hack": true, "admin": true}`:
   - strict: ошибки для обоих лишних полей
