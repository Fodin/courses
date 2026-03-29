# Зада��ие 13.4: API Layer

## Цель

Построить типобезопасный API-слой с валидацией запросов, маппингом ответов и типизированными контроллерами.

## Требования

1. Создайте validation rules: `required`, `minLength`, `positive` -- каждое возвращает `Result<T>`
2. Определите `RequestValidator<T>` с методом `validate(data: unknown): Result<T, string[]>`
3. Реализуйте валидаторы для CreateOrderRequest и AddItemRequest
4. Определите DTO-типы: `OrderResponse` (с string вместо Money, ISO date вместо timestamp)
5. Реализуйте `toOrderResponse(order)` для маппинга domain -> API
6. Создайте `ApiController` с typed responses: `ApiResponse<T>` (200/201/400/404)
7. Продемонстрируйте: успешные запросы, ошибки валидации, 404

## Чеклист

- [ ] Validation rules возвращают Result, собирают все ошибки
- [ ] CreateOrderValidator проверяет customerId (required) и currency (3 символа)
- [ ] AddItemValidator проверяет: required fields, positive quantity/price, minLength name
- [ ] OrderResponse не содержит domain-типов (Money -> string, timestamp -> ISO)
- [ ] ApiResponse -- discriminated union по status code
- [ ] createOrder возвращает 201, getOrder -- 200, ошибки -- 400, не найден -- 404
- [ ] Controller делегирует бизнес-логику handlers, не содержит логики

## Как проверить себя

1. Создайте заказ с валидными данными -- получите 201
2. Отправьте невалидный запрос -- получите 400 со списком ошибок
3. Добавьте товары и запросите заказ -- проверьте формат ответа
4. Запросите несуществующий заказ -- получите 404
