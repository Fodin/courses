# Задание 0.5: Generic Factories

## Цель

Научиться создавать типобезопасные фабричные функции, используя generics для конструкторов, builder-паттернов, registry и валидаторов.

## Требования

1. Реализуйте фабрику `createModel<T extends Serializable>(ModelClass: new () => T): T`, где `Serializable` -- интерфейс с методом `serialize(): string`. Создайте минимум 2 класса, реализующих интерфейс
2. Реализуйте фабрику с аргументами конструктора: `createWithArgs<T, TArgs extends unknown[]>(ctor: new (...args: TArgs) => T, ...args: TArgs): T`
3. Реализуйте registry-фабрику с цепочкой вызовов `register().register().create()`
4. Реализуйте builder-фабрику `createBuilder<T>(initial: T)` с методами `set(key, value)` и `build()`, где `build()` возвращает `Readonly<T>`
5. Реализуйте validator-фабрику `createValidator<T>(check, typeName)` с методами `validate` (type guard) и `parse` (бросает ошибку при невалидном значении)

## Чеклист

- [ ] `createModel(UserModel)` возвращает `UserModel` (не `Serializable`)
- [ ] `createWithArgs(ApiClient, 'url', 5000)` корректно типизирует аргументы конструктора
- [ ] Registry корректно работает с chain-вызовами и типобезопасным `create`
- [ ] Builder не позволяет передать значение неправильного типа в `set`
- [ ] `build()` возвращает замороженный объект
- [ ] `validator.validate()` работает как type guard
- [ ] `validator.parse()` бросает ошибку с описанием для невалидных значений

## Как проверить себя

1. Попробуйте вызвать `builder.set('port', 'не число')` -- должна быть ошибка компиляции
2. Вызовите `registry.create('несуществующий')` -- должна быть ошибка
3. После `validator.validate(value)` используйте `value` как типизированное значение
