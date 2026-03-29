# Задание 13.3: Infrastructure Layer

## Цель

Реализовать инфраструктурный слой с типизированными репозиториями, Event Store и адаптерами внешних сервисов.

## Требования

1. Определите generic интерфейс `Repository<T, ID>` с методами: findById, findAll, save, delete (все возвращают Result)
2. Реализуйте `InMemoryOrderRepository`, имплементирующий Repository<Order>
3. Определите generic интерфейс `EventStore<E>` с методами: append, getStream, getAllEvents
4. Реализуйте `InMemoryEventStore<E>`
5. Определите интерфейсы внешних сервисов: `NotificationService`, `PaymentGateway`
6. Реализуйте in-memory адаптеры с трекингом вызовов (для тестирования)
7. Продемонстрируйте: CRUD через Repository, запись/чтение событий, вызовы внешних сервисов

## Чеклист

- [ ] Repository<T, ID> -- generic с дефолтом ID = string
- [ ] findById возвращает `Result<T | null>` (null, а не ошибка, для отсутствующих)
- [ ] EventStore хранит события по streamId
- [ ] append добавляет к существующему стриму
- [ ] NotificationService и PaymentGateway возвращают Result
- [ ] In-memory адаптеры трекают вызовы (sent, charges, refunds)
- [ ] refund несуществующей транзакции возвращает ошибку

## Как проверить себя

1. Сохраните и найдите заказ через Repository
2. Удалите заказ -- findById возвращает null
3. Запишите события и прочитайте стрим
4. Сделайте charge и refund через PaymentGateway
5. Попробуйте refund несуществующей транзакции -- получите ошибку
