# Задание 9.4: Redis Pub/Sub для масштабирования

## 🎯 Цель

Освоить горизонтальное масштабирование real-time приложений: Redis Adapter для Socket.io, sticky sessions для Load Balancer.

## Требования

1. Покажите проблему: клиенты на разных инстансах не видят сообщения друг друга
2. Подключите `@socket.io/redis-adapter`: pubClient, subClient (duplicate), createAdapter
3. Продемонстрируйте, что `io.emit()` и `io.to(room).emit()` работают across instances через Redis
4. Покажите конфигурацию Nginx с sticky sessions (ip_hash) для WebSocket

## Чеклист

- [ ] Проблема масштабирования описана и понятна
- [ ] Redis Adapter подключен с pub/sub клиентами
- [ ] Broadcast и rooms работают между инстансами
- [ ] Nginx конфигурация включает ip_hash для sticky sessions

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: Redis Adapter настроен, сообщения проходят между инстансами через Redis, rooms работают cross-instance.
