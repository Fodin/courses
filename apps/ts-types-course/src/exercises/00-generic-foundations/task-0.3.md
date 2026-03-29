# Задание 0.3: Inference in Functions

## Цель

Научиться строить generic-функции, в которых TypeScript автоматически выводит типы из аргументов, обеспечивая максимальную типобезопасность без лишних аннотаций.

## Требования

1. Реализуйте `identity<T>(value: T): T` и покажите, что TypeScript выводит конкретный тип
2. Реализуйте `firstElement<T>(arr: T[]): T | undefined` для извлечения первого элемента массива
3. Реализуйте `makePair<A, B>(a: A, b: B): [A, B]` с выводом обоих типов из аргументов
4. Реализуйте `mapArray<T, U>(arr: T[], fn: (item: T) => U): U[]` где `U` выводится из колбэка
5. Реализуйте `createConfig<T extends Record<string, unknown>>(config: T): Readonly<T>` для создания неизменяемой конфигурации
6. Реализуйте `pluck<T, K extends keyof T>(items: T[], key: K): T[K][]` для извлечения массива значений по ключу

## Чеклист

- [ ] `identity('hello')` имеет тип `string`, а `identity(42)` -- тип `number`
- [ ] `firstElement([1, 2, 3])` возвращает `number | undefined`
- [ ] `makePair('key', 42)` возвращает `[string, number]`
- [ ] `mapArray(['a', 'b'], s => s.length)` возвращает `number[]`
- [ ] `createConfig({...})` возвращает `Readonly<...>` с сохранением структуры
- [ ] `pluck(users, 'name')` возвращает `string[]`, а `pluck(users, 'age')` -- `number[]`

## Как проверить себя

1. Наведите курсор на переменные в IDE -- проверьте выведенные типы
2. Попробуйте мутировать результат `createConfig` -- должна быть ошибка
3. Убедитесь, что `pluck` различает типы для разных ключей
