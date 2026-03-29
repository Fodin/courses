# Задание 0.1: Generic Constraints

## Цель

Научиться использовать ограничения generic-типов (`extends`, `keyof`, множественные constraints) для создания типобезопасных переиспользуемых функций.

## Требования

1. Реализуйте функцию `getProperty<T, K extends keyof T>(obj: T, key: K): T[K]`, которая безопасно извлекает свойство объекта по ключу
2. Реализуйте функцию `logLength<T extends HasLength>(item: T): number`, где `HasLength` -- интерфейс с полем `length: number`. Функция должна возвращать длину переданного значения
3. Реализуйте функцию `getEntityInfo<T extends Identifiable & Timestamped>(entity: T): string`, которая принимает объект с `id` и `createdAt` и возвращает строку с информацией
4. Реализуйте функцию `createInstance<T>(ctor: new () => T): T`, которая создаёт экземпляр переданного класса
5. Реализуйте функцию `mergeObjects<T extends Record<string, unknown>>(a: T, b: Partial<T>): T`, которая объединяет два объекта

## Чеклист

- [ ] `getProperty` корректно извлекает свойства и TypeScript знает точный тип возврата
- [ ] `logLength` принимает только значения с `.length` (string, array, объект с length)
- [ ] `getEntityInfo` требует наличия и `id`, и `createdAt` одновременно
- [ ] `createInstance` создаёт экземпляры классов без аргументов конструктора
- [ ] `mergeObjects` принимает только `Partial<T>` вторым аргументом
- [ ] Все функции демонстрируются с примерами и результаты выводятся в UI

## Как проверить себя

1. Попробуйте вызвать `getProperty(user, 'nonexistent')` -- должна быть ошибка компиляции
2. Попробуйте передать `42` в `logLength` -- должна быть ошибка компиляции
3. Убедитесь, что `getProperty(user, 'name')` возвращает тип `string`, а не `string | number`
