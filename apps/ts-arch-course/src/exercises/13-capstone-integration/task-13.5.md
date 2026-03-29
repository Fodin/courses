# Задание 13.5: Full Wiring

## Цель

Связать все слои приложения через DI-контейнер, сохраняя полную типобезопасность, и продемонстрировать сквозной сценарий от API-запроса до сохранения событий.

## Требования

1. Создайте generic `Container` с методами: `register(token, factory)`, `resolve(token)`, `has(token)`
2. Контейнер должен кэшировать экземпляры (singleton behavior)
3. Определите `TokenMap` -- маппинг токенов к типам сервисов
4. Создайте `TypedContainer` с `resolve<K extends keyof TokenMap>(token): TokenMap[K]`
5. Реализуйте `wireApplication()`, которая регистрирует все сервисы в правильном порядке
6. Продемонстрируйте полный сквозной сценарий:
   - Создание заказа через API
   - Добавление товаров
   - Подтверждение заказа
   - Проведение оплаты через PaymentGateway
   - Отправка уведомления через NotificationService
   - Сохранение событий в EventStore
7. Покажите состояние инфраструктуры после всех операций

## Чеклист

- [ ] Container кэширует экземпляры (resolve дважды -- один объект)
- [ ] resolve несуществующего сервиса выбрасывает ошибку
- [ ] TokenMap связывает строковые ключи с конкретными типами
- [ ] TypedContainer.resolve('apiController') возвращает ApiController (не unknown)
- [ ] wireApplication регистрирует: infrastructure -> application -> API
- [ ] Сквозной сценарий проходит все слои без ошибок
- [ ] Event stream содержит все события заказа
- [ ] Notifications и payments трекаются

## Как проверить себя

1. Вызовите `wireApplication()` -- контейнер готов
2. Создайте заказ через `api.createOrder` -- получите 201
3. Пройдите полный цикл: create -> addItems -> confirm -> pay -> notify
4. Проверьте EventStore -- все события записаны
5. Проверьте NotificationService и PaymentGateway -- вызовы зафиксированы
6. Убедитесь, что TypedContainer не позволяет resolve('invalidToken')
