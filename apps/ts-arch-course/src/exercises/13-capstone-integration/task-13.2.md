# Задание 13.2: Application Layer

## Цель

Создать слой приложения с типизированными Command и Query handlers, использующими Result type и паттерн CQS (Command-Query Separation).

## Требования

1. Определите `Command` как discriminated union: CreateOrder, AddItem, ConfirmOrder, CancelOrder
2. Определите `Query` как discriminated union: GetOrder, ListOrders, GetOrderTotal
3. Создайте типы `CommandHandler<C, R>` и `QueryHandler<Q, R>` с методом `execute`
4. Реализуйте command handlers: createCreateOrderHandler, createAddItemHandler, createConfirmOrderHandler, createCancelOrderHandler
5. Реализуйте query handlers: createGetOrderHandler, createListOrdersHandler
6. Каждый handler принимает зависимости (store) через замыкание и возвращает `Result<T>`
7. Продемонстрируйте полный сценарий: создание, добавление товаров, подтверждение, отмена, запросы

## Чекл��ст

- [ ] Command и Query -- discriminated unions
- [ ] CommandHandler типизирован через `Extract<Command, { type: ... }>`
- [ ] CreateOrder возвращает `Result<string>` (id нового заказа)
- [ ] AddItem для несуществующего заказа возвращает ошибку
- [ ] ConfirmOrder пустого заказа делегирует ошибку из domain
- [ ] ListOrders поддерживает фильтрацию по status
- [ ] Все ошибки передаются через Result, не через throw

## Как проверить себя

1. Создайте заказ через handler -- получите id
2. Добавьте товары -- статус ок
3. Подтвердите пустой заказ -- получите ошибку из domain
4. Запросите список заказов с фильтром по status
5. Попробуйте добавить товар в подтверждённый заказ -- получите ошибку
