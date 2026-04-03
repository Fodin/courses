# Задание 12.4: Полный дизайн мессенджера

## Цель

Спроектировать мессенджер (WhatsApp-like) от и до — как на реальном System Design интервью. Пройти все этапы: требования, протокол коммуникации, delivery statuses, presence, storage, группы, медиа, масштабирование.

## Требования

1. **Requirements** — сформулируйте functional и non-functional требования
2. **Protocol** — обоснуйте выбор WebSocket, опишите WS Gateway architecture
3. **Message Delivery** — спроектируйте протокол доставки с тремя статусами
4. **Presence** — спроектируйте heartbeat-механизм и subscription model
5. **Group Chats** — опишите fan-out strategy и обоснуйте выбор
6. **Storage** — data model, sharding, индексы, sync
7. **Media** — загрузка медиа через pre-signed URL
8. **Architecture** — компоненты системы и их связи

## Чеклист

### Requirements
- [ ] Перечислены 5+ functional requirements (1-to-1, группы, статусы, presence, media, offline, sync)
- [ ] Перечислены 3+ non-functional requirements (задержка, масштаб, надёжность, ordering)
- [ ] Определены масштабные характеристики (число пользователей, сообщений/день)

### WebSocket & Connection Management
- [ ] Обосновано: почему WebSocket, а не HTTP polling / Long Polling / SSE
- [ ] WS Gateway — отдельный stateful сервис для holding connections
- [ ] Redis для маппинга userId → gatewayId
- [ ] L4 Load Balancer с sticky sessions для WebSocket

### Message Delivery
- [ ] Три статуса: SENT (✓), DELIVERED (✓✓), READ (✓✓ синие)
- [ ] SENT — server ack после сохранения в БД
- [ ] DELIVERED — client ack от устройства получателя
- [ ] READ — batch ack при открытии чата
- [ ] Offline queue: сохранить + push notification

### Presence Service
- [ ] Heartbeat каждые 30 сек + Redis TTL 60 сек
- [ ] Subscription model: уведомлять только подписчиков, а не всех контактов
- [ ] «Был в сети X минут назад» через lastSeen

### Group Chats & Fan-out
- [ ] Fan-out on write для малых групп (до 256)
- [ ] Fan-out on read для больших каналов (1000+)
- [ ] Обоснование выбора с trade-offs

### Storage
- [ ] Шардирование по chatId (все сообщения чата на одном шарде)
- [ ] Cassandra/ScyllaDB для write-heavy нагрузки
- [ ] Sync-протокол: lastSyncTimestamp + дельта
- [ ] Индексы для основных запросов

### Media & Infrastructure
- [ ] Pre-signed URL для загрузки медиа напрямую в S3
- [ ] Kafka для message queue (partition по chatId для ordering)
- [ ] CDN для раздачи медиа
- [ ] Push notifications (FCM/APNs) для офлайн-пользователей

## Как проверить себя

1. Пройдите по каждой секции чеклиста — все пункты должны быть закрыты
2. «Прогоните» сценарий: Alice отправляет сообщение Bob, который офлайн. Что происходит на каждом этапе?
3. Проверьте: что будет при потере WebSocket-соединения? (reconnect + sync)
4. Проверьте: как работает группа из 200 человек? Сколько записей создаётся при отправке одного сообщения?
5. Проверьте: как Alice увидит, что Bob печатает? (typing indicator через WS)
6. Сравните свой дизайн с эталонным решением (Solution)
