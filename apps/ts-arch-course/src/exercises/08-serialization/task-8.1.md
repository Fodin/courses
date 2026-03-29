# Задание 8.1: Schema Inference

## 🎯 Цель

Создать систему определения схем, из которой TypeScript автоматически выводит типы. Одна схема — и для рантайм-валидации, и для compile-time проверки.

## Требования

1. Создайте тип `SchemaField<T>` с полями `type` (string-литерал) и `required` (boolean)
2. Реализуйте вспомогательную функцию `field(type, required?)` для создания полей
3. Создайте условный тип `InferFieldType<T>`, маппящий `'string'` -> `string`, `'number'` -> `number`, `'boolean'` -> `boolean`
4. Создайте тип `InferSchema<T>`, рекурсивно выводящий тип из определения схемы (опциональные поля -> `T | undefined`)
5. Реализуйте `createSchema(definition)` с методами `validate(data)` и `parse(data)`
6. Создайте схему с минимум 5 полями, включая опциональные

## Чеклист

- [ ] `field('number')` создаёт `SchemaField<'number'>` с `required: true`
- [ ] `field('string', false)` создаёт опциональное поле
- [ ] `InferSchema` выводит правильные типы для всех полей
- [ ] Опциональные поля имеют тип `T | undefined`
- [ ] `validate()` возвращает type guard (`data is InferSchema<T>`)
- [ ] `parse()` возвращает типизированный объект или `null`

## Как проверить себя

Создайте схему с разными типами полей и вызовите `parse()` с валидными и невалидными данными. Убедитесь, что после `parse()` TypeScript знает точный тип каждого поля.
