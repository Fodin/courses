# Задание 9.2: Socket.io

## 🎯 Цель

Освоить Socket.io: rooms и namespaces для группировки, acknowledgments для запрос-ответ паттерна, middleware для аутентификации.

## Требования

1. Создайте Socket.io сервер с CORS-настройками, определите namespaces (`/chat`, `/admin`)
2. Реализуйте rooms: join, leave, отправка сообщений в конкретную комнату через `socket.to(room).emit()`
3. Покажите acknowledgments: callback для подтверждения получения, timeout
4. Реализуйте middleware: глобальный (JWT-аутентификация), namespace-уровень (проверка роли), обработка ошибок на клиенте

## Чеклист

- [ ] Namespaces созданы для разных доменов функционала
- [ ] Rooms: join/leave/отправка работают корректно
- [ ] Acknowledgments возвращают результат операции клиенту
- [ ] Middleware проверяет JWT при подключении
- [ ] Namespace middleware ограничивает доступ по роли

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: namespaces изолированы, rooms группируют клиентов, acknowledgments подтверждают операции, middleware блокирует неавторизованных.
