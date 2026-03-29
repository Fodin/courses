# Задание 1.3: Nested Conditionals

## Цель

Научиться создавать вложенные условные типы для многоуровневого ветвления и рекурсивного разворачивания типов.

## Требования

1. Реализуйте тип `TypeName<T>`, определяющий имя типа ('string', 'number', 'boolean', 'undefined', 'null', 'array', 'function', 'object') через цепочку вложенных conditional types
2. Реализуйте тип `DeepUnwrap<T>`, рекурсивно разворачивающий Promise, Array, Set, Map до базового типа
3. Реализуйте систему `ResponseType<M>` для HTTP-методов ('GET', 'POST', 'PUT', 'DELETE'), возвращающую разные типы ответов для каждого метода
4. Реализуйте `SeverityAction<S>` для группировки уровней логирования ('debug'|'info' -> 'log', 'warn' -> 'alert', 'error'|'fatal' -> 'notify')

## Чеклист

- [ ] `TypeName<string>` = 'string', `TypeName<null>` = 'null', `TypeName<number[]>` = 'array'
- [ ] `DeepUnwrap<Promise<string[]>>` разрешается в `string`
- [ ] `DeepUnwrap<Set<Map<string, boolean>>>` разрешается в `boolean`
- [ ] `ResponseType<'GET'>` имеет поле `cached`, а `ResponseType<'POST'>` -- поле `id`
- [ ] `SeverityAction<'debug'>` = 'log', `SeverityAction<'error'>` = 'notify'
- [ ] Создана runtime-функция `simulateRequest` с conditional return type

## Как проверить себя

1. Проверьте `TypeName` для всех 8 категорий типов
2. Убедитесь, что `DeepUnwrap` корректно работает с 3+ уровнями вложенности
3. Вызовите `simulateRequest` с разными методами и проверьте структуру ответа
