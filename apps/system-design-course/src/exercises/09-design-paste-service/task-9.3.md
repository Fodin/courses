# Задание 9.3: Полный дизайн Paste Service

## Цель

Спроектировать Paste Service от и до — как на реальном интервью по System Design. Пройти все этапы: требования, оценка нагрузки, API, модель данных, архитектура, масштабирование.

## Требования

1. **Requirements** — сформулируйте functional и non-functional требования
2. **Capacity Estimation** — рассчитайте QPS, storage (S3 + SQL отдельно), bandwidth
3. **API Design** — опишите REST API endpoints (POST создание, GET чтение, DELETE удаление)
4. **Data Model** — спроектируйте metadata-таблицу (SQL) и схему хранения в S3
5. **Architecture** — опишите write path и read path, включая CDN
6. **Content-Addressable Storage** — опишите дедупликацию контента
7. **Expiration & Cleanup** — опишите стратегию удаления протухших pastes
8. **Scaling** — опишите стратегии масштабирования каждого компонента

## Чеклист

### Requirements
- [ ] Перечислены 3+ functional requirements (создание, чтение, expiration)
- [ ] Перечислены 3+ non-functional requirements (доступность, задержка, масштаб)
- [ ] Определён максимальный размер paste (10 MB)
- [ ] Определено read/write ratio

### Capacity Estimation
- [ ] Рассчитан write QPS и read QPS
- [ ] Рассчитан peak QPS (x2-3 от среднего)
- [ ] Рассчитан объём content storage (S3) на 5 лет
- [ ] Рассчитан объём metadata storage (SQL) на 5 лет
- [ ] Рассчитан bandwidth (incoming + outgoing)

### API Design
- [ ] POST /api/paste — создание (body: content, language?, expiresIn?, isPrivate?)
- [ ] GET /:shortCode — чтение paste (response: content + metadata)
- [ ] GET /:shortCode/raw — raw-текст (для curl, wget)
- [ ] DELETE /api/paste/:shortCode — удаление (auth required)

### Data Model
- [ ] Metadata-таблица в PostgreSQL (shortCode, contentKey, language, expiresAt)
- [ ] Content в S3 с key = SHA-256 hash
- [ ] Индексы по shortCode и expiresAt
- [ ] Обоснован выбор SQL для метаданных, S3 для контента

### Architecture
- [ ] Описан write path: Client → API → S3 + PostgreSQL
- [ ] Описан read path: Client → CDN → API → S3
- [ ] CDN для кэширования публичных pastes
- [ ] Redis для кэширования метаданных

### Content-Addressable Storage
- [ ] SHA-256 хеш контента как ключ S3
- [ ] Дедупликация одинаковых pastes
- [ ] Reference counting при удалении

### Expiration & Cleanup
- [ ] Background job для удаления протухших pastes (каждые 5 мин)
- [ ] Lazy expiration check при чтении
- [ ] CDN cache invalidation при удалении
- [ ] Reference count check перед удалением S3-объекта

### Scaling
- [ ] Stateless API серверы за Load Balancer
- [ ] DB sharding по shortCode
- [ ] S3 — бесконечное хранилище (не нужно шардировать)
- [ ] CDN для read-heavy нагрузки
- [ ] Redis Cluster для кэша метаданных

## Как проверить себя

1. Пройдите по каждой секции чеклиста — все пункты должны быть закрыты
2. «Прогоните» два сценария: создание paste и чтение paste
3. Проверьте: если API-сервер упал — CDN продолжает отдавать кэшированные pastes?
4. Проверьте: paste с TTL 10 мин не отдаётся CDN через 20 мин?
5. Проверьте: одинаковый контент не дублируется в S3?
6. Сравните свой дизайн с эталонным решением (Solution)
