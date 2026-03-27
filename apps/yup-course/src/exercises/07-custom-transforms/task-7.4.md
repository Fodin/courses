# Задание 7.4: Цепочки трансформаций

## Цель

Научиться комбинировать несколько `transform()` и `test()` в цепочку для сложной обработки данных.

## Требования

1. Создайте `productSchema` — объектную схему:
   - `sku`: цепочка трансформаций:
     - trim + toUpperCase
     - replace spaces with dashes
     - test: формат "ABC-123" (буквы-цифры)
     - required
   - `price`: цепочка трансформаций:
     - replace comma with dot (европейский формат)
     - strip non-numeric except dot
     - test: positive number (используйте `this.createError` для кастомных сообщений)
     - required
   - `tags`: цепочка трансформаций:
     - trim + lowercase
     - normalize commas: replace `/,\s*/g` → `', '`
     - test: минимум 2 тега
     - required

2. Реализуйте кнопки "Validate" и "Cast Only"

3. Для price test используйте `function` (не стрелочную) для доступа к `this.createError`

## Чеклист

- [ ] SKU: "  abc 123  " → "ABC-123" (trim → upper → replace spaces)
- [ ] Price: "$19,99" → "19.99" (comma→dot → strip non-numeric)
- [ ] Tags: "React,  TypeScript,yup" → "react, typescript, yup"
- [ ] SKU test проверяет формат LETTERS-DIGITS
- [ ] Price test использует `this.createError` для разных ошибок
- [ ] Tags test проверяет минимум 2 тега
- [ ] Cast Only показывает промежуточный результат

## Как проверить себя

1. Defaults: "Cast Only" → увидите трансформированные данные
2. Defaults: "Validate" → успех
3. SKU "widget" → ошибка формата (нет цифр)
4. Price "abc" → ошибка "not a number"
5. Price "-5" → ошибка "positive"
6. Tags "single" → ошибка "at least 2 tags"
