# Задание 11.3: Полный дизайн Notification System

## Цель

Спроектировать систему уведомлений от и до — как на реальном интервью по System Design. Пройти все этапы: требования, каналы доставки, pipeline, data model, retry-стратегии, масштабирование.

## Требования

1. **Requirements** — сформулируйте functional и non-functional требования
2. **Channels** — опишите каналы доставки (Push, Email, SMS, In-App) и их особенности
3. **Pipeline** — спроектируйте notification pipeline от trigger до delivery
4. **Data Model** — спроектируйте таблицы: templates, preferences, delivery_log, device_tokens
5. **Priority System** — опишите систему приоритетов и организацию очередей
6. **Retry Strategy** — для каждого канала: количество повторов, backoff, permanent failures
7. **Architecture** — нарисуйте компоненты системы и их связи

## Чеклист

### Requirements
- [ ] Перечислены 4+ functional requirements (многоканальность, предпочтения, шаблоны, приоритеты)
- [ ] Перечислены 3+ non-functional requirements (масштаб, задержка, exactly-once)
- [ ] Определены типы уведомлений (transactional, promotional, security)

### Channels
- [ ] Push: APNs (iOS) + FCM (Android/Web), device token management
- [ ] Email: delivery service (SendGrid/SES), bounce handling, SPF/DKIM
- [ ] SMS: gateway (Twilio), E.164 format, стоимость, only critical
- [ ] In-App: WebSocket/polling, хранение в БД, badge count

### Pipeline
- [ ] Порядок: trigger → dedup → preference → template → priority queue → router → deliver
- [ ] Дедупликация через idempotency key + Redis
- [ ] Preference check до постановки в очередь (экономия ресурсов)
- [ ] Template render до очереди (готовое сообщение в очереди)

### Data Model
- [ ] Таблица notification_templates (eventType, channel, locale, body, version)
- [ ] Таблица user_preferences (channels, quietHours, timezone, unsubscribed)
- [ ] Таблица delivery_log (status, attempts, failReason, providerMessageId)
- [ ] Таблица device_tokens (userId, token, platform, isValid)

### Priority & Retry
- [ ] 4 уровня приоритета: critical, high, normal, low
- [ ] Физически отдельные очереди (не одна с приоритетом)
- [ ] Per-channel retry: push (3x), email (5x), SMS (2x + fallback)
- [ ] Permanent failure handling (InvalidToken → удалить, HardBounce → disable email)

### Architecture
- [ ] Kafka для ingestion событий от других сервисов
- [ ] Redis для дедупликации и priority queues
- [ ] PostgreSQL для templates, preferences, delivery log
- [ ] Workers с auto-scaling по длине очереди
- [ ] Webhook endpoints для status updates от провайдеров

## Как проверить себя

1. Пройдите по каждой секции чеклиста — все пункты должны быть закрыты
2. «Прогоните» 3 сценария: OTP-код, подтверждение заказа, промо-рассылка
3. Проверьте: что будет, если SendGrid недоступен? (fallback, retry)
4. Проверьте: что будет, если пользователь в тихих часах? (отложить или пропустить)
5. Проверьте: что будет, если отправить 10 млн промо одновременно? (не заблокирует ли critical?)
6. Сравните свой дизайн с эталонным решением (Solution)
