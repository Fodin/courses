# Задание 0.2: Default Type Parameters

## Цель

Научиться использовать дефолтные типовые параметры для создания гибких API, которые просты в использовании по умолчанию, но допускают кастомизацию.

## Требования

1. Создайте интерфейс `ApiResponse<TData = unknown, TError = Error>` с полями `data`, `error`, `status`
2. Создайте интерфейс `Collection<TItem, TKey extends keyof TItem = keyof TItem>` с полями `items` и `indexBy`
3. Реализуйте функцию `createStore<TState = Record<string, unknown>>(initialState: TState)`, возвращающую объект с `getState()` и `setState(partial)`
4. Создайте интерфейс `TypedEvent<T extends EventPayload = EventPayload>` с полями `type` и `payload`, где `EventPayload` содержит `timestamp: number`
5. Продемонстрируйте использование каждого типа как с дефолтными параметрами, так и с явно указанными

## Чеклист

- [ ] `ApiResponse` работает без generic-аргументов (используются дефолты `unknown` и `Error`)
- [ ] `ApiResponse<User>` корректно типизирует `data` как `User | null`
- [ ] `Collection<Product>` допускает любой ключ Product в `indexBy`
- [ ] `Collection<Product, 'id'>` ограничивает `indexBy` только значением `'id'`
- [ ] `createStore` корректно выводит тип состояния из `initialState`
- [ ] `TypedEvent` работает с дефолтным `EventPayload` и с кастомными payload-типами

## Как проверить себя

1. Создайте `ApiResponse` без параметров и убедитесь, что `data` имеет тип `unknown | null`
2. Попробуйте присвоить строку в `indexBy` типа `Collection<Product, 'id'>` -- должна быть ошибка
3. Вызовите `store.setState({ неСуществующееПоле: 1 })` -- должна быть ошибка компиляции
