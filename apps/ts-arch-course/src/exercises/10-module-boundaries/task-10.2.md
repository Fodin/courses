# Задание 10.2: Cross-Module Contracts

## 🎯 Цель

Создать систему кросс-модульного взаимодействия через shared-контракты: generic Repository, типизированный EventBus и модули, зависящие от минимальных интерфейсов.

## Требования

1. Создайте базовый интерфейс `Entity` (`id`, `createdAt`, `updatedAt`)
2. Создайте generic `Repository<T extends Entity>` с CRUD-методами:
   - `findById`, `findAll`, `create`, `update`, `delete`
   - `create` принимает `Omit<T, 'id' | 'createdAt' | 'updatedAt'>`
3. Создайте `EventBus<TEvents>` с типобезопасными `emit` и `on` (с unsubscribe)
4. Создайте модуль Products с `ProductEvents` и модуль Orders
5. Orders зависит от Products через **минимальный** интерфейс (только `getProduct`)
6. Создайте in-memory реализации Repository и EventBus

## Чеклист

- [ ] `Repository<Product>` и `Repository<Order>` используют один generic контракт
- [ ] `EventBus<ProductEvents>` проверяет тип payload при `emit`
- [ ] `on` возвращает функцию unsubscribe
- [ ] Orders зависит от `{ getProduct: ... }`, а не от всего ProductModule
- [ ] Events доставляются всем подписчикам в порядке подписки
- [ ] In-memory реализации полностью удовлетворяют контрактам

## Как проверить себя

Создайте продукты через ProductModule, заказы через OrderModule, и проверьте, что events доставляются. Убедитесь, что OrderModule не может вызвать `addProduct` или другие методы ProductModule, не указанные в контракте.
