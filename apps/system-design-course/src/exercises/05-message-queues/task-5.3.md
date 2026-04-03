# Задание 5.3: Проектирование Event Pipeline (E-commerce)

## Цель

Спроектировать event-driven pipeline для обработки заказа в e-commerce: от создания до доставки. Для каждого этапа определить тип события, очередь, гарантию доставки, idempotency key и стратегию обработки ошибок.

## Требования

1. Реализуйте интерактивную таблицу с 5 этапами заказа:
   - **Создание заказа** — OrderCreated
   - **Обработка оплаты** — PaymentProcessed / PaymentFailed
   - **Резервирование на складе** — InventoryReserved / InventoryFailed
   - **Отправка в доставку** — ShipmentCreated
   - **Уведомление клиента** — NotificationSent
2. Для каждого этапа покажите:
   - Тип события (event name)
   - Паттерн (Queue или Topic)
   - Гарантия доставки (at-most-once / at-least-once)
   - Idempotency key (что используется для дедупликации)
   - Обработка ошибок (retry policy + fallback)
3. Визуализируйте flow заказа:
   - Текущий этап (выделен цветом)
   - Переключение между этапами по клику
   - Статус: успех / ошибка / ожидание
4. Покажите пример payload события для выбранного этапа (JSON)

## Чеклист

- [ ] 5 этапов заказа с описанием
- [ ] Для каждого этапа: event, pattern, delivery, idempotency key, error handling
- [ ] Визуальный flow с подсветкой текущего этапа
- [ ] Переключение между этапами
- [ ] Пример JSON payload для каждого этапа
- [ ] Обоснование выбора гарантии доставки для каждого этапа
- [ ] Сценарий ошибки: что происходит при сбое на каждом этапе

## Как проверить себя

1. Payment — at-least-once + idempotency (потеря платежа недопустима)
2. Notification — at-most-once допустим (дубль email раздражает, но не критичен)
3. Inventory — at-least-once + idempotency key = orderId (двойное резервирование — проблема)
4. OrderCreated публикуется в Topic (несколько подписчиков: payment, analytics, fraud)
5. Каждый payload содержит orderId, timestamp и достаточно данных для обработки
