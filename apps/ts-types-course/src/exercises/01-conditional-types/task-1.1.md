# Задание 1.1: Basic Conditional Types

## Цель

Научиться создавать базовые условные типы для проверки типов, извлечения вложенных типов через `infer` и фильтрации nullable-значений.

## Требования

1. Реализуйте тип `IsString<T>`, возвращающий `true` для строковых типов и `false` для остальных. Создайте runtime-функцию `checkIsString` с аналогичным поведением
2. Реализуйте тип `IsArray<T>`, проверяющий, является ли `T` массивом
3. Реализуйте тип `ExtractReturnType<T>`, извлекающий возвращаемый тип функции через `infer`. Для не-функций возвращайте `never`
4. Реализуйте тип `ExtractPromiseType<T>`, извлекающий тип из `Promise`. Для не-Promise возвращайте `T` как есть
5. Реализуйте тип `NonNullableCustom<T>`, исключающий `null` и `undefined` из union-типа. Создайте runtime-функцию `filterNullable`

## Чеклист

- [ ] `IsString<"hello">` разрешается в `true`, `IsString<42>` -- в `false`
- [ ] `IsArray<number[]>` разрешается в `true`, `IsArray<string>` -- в `false`
- [ ] `ExtractReturnType<() => boolean>` разрешается в `boolean`
- [ ] `ExtractPromiseType<Promise<string>>` разрешается в `string`
- [ ] `NonNullableCustom<string | null | undefined>` разрешается в `string`
- [ ] Runtime-функции корректно работают с тестовыми данными

## Как проверить себя

1. Создайте type-assertions: `type _Test = IsString<"hello"> extends true ? 'pass' : 'fail'`
2. Проверьте `ExtractReturnType` для функций с разными возвращаемыми типами
3. Убедитесь, что `filterNullable` удаляет все null/undefined из массива
