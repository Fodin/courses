# Задание 7.3: Clean Architecture

## Цель

Реализовать Clean Architecture: Entity с бизнес-правилами, UseCase для сценария, Repository как порт.

## Требования

1. **Domain слой — Entity `Order`:**
   - Поля: `id`, `items: OrderItem[]`, `status: OrderStatus`
   - `OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'cancelled'`
   - Геттер `total` — сумма (price * quantity) по всем items
   - Метод `confirm()` — только из 'pending'
   - Метод `cancel()` — только из 'pending' или 'confirmed'
   - Бросает Error при невалидном переходе

2. **Domain слой — порт `OrderRepository`:**
   - `save(order: Order): void`
   - `findById(id: string): Order | null`

3. **Application слой — `CreateOrderUseCase`:**
   - Принимает `OrderRepository` через конструктор
   - `execute(items: OrderItem[])` — создаёт Order, проверяет total > 0, сохраняет
   - Возвращает созданный Order

4. Продемонстрируйте: создание заказа, confirm, cancel, ошибки при невалидных переходах

## Чеклист

- [ ] Entity `Order` содержит бизнес-правила (не Repository!)
- [ ] `total` вычисляется корректно
- [ ] `confirm()` работает только из 'pending'
- [ ] `cancel()` работает из 'pending' и 'confirmed'
- [ ] `CreateOrderUseCase` не знает о хранилище напрямую
- [ ] Демонстрация всех переходов состояний

## Как проверить себя

- Нажмите кнопку — должны отобразиться операции с заказами
- Успешные переходы: pending → confirmed, pending → cancelled
- Ошибки: confirm из cancelled, cancel из shipped
