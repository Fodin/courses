# Задание 10.3: Полный дизайн Distributed Rate Limiter

## Цель

Спроектировать Distributed Rate Limiter как сервис — от требований до масштабирования. Пройти все этапы system design интервью: требования, architecture, алгоритм, distributed coordination, HTTP integration, мониторинг.

## Требования

1. **Requirements** — сформулируйте functional и non-functional требования к rate limiter как сервису
2. **Algorithm Choice** — обоснуйте выбор алгоритма для production (sliding window counter или token bucket)
3. **Architecture** — распределённая архитектура: API servers + Redis + правила
4. **Redis Schema** — ключи, TTL, Lua scripts для атомарных операций
5. **API & HTTP Integration** — middleware, заголовки X-RateLimit-*, 429 response
6. **Multi-tier Limiting** — IP, user, API key, endpoint уровни
7. **Fault Tolerance** — что делать, если Redis недоступен (fail-open vs fail-closed)
8. **Monitoring** — метрики, алерты, дашборды

## Чеклист

### Requirements
- [ ] Перечислены 3+ functional requirements (ограничение запросов, настраиваемые правила, HTTP headers)
- [ ] Перечислены 3+ non-functional requirements (low latency < 5ms, high availability, consistency)
- [ ] Определены типы лимитов (per-IP, per-user, per-endpoint, global)
- [ ] Определено поведение при недоступности rate limiter (fail-open)

### Algorithm Choice
- [ ] Обоснован выбор алгоритма (sliding window counter или token bucket)
- [ ] Описаны trade-offs выбранного алгоритма
- [ ] Объяснено, почему не подходят другие алгоритмы для данного случая

### Architecture
- [ ] Описана distributed архитектура (API nodes + shared Redis)
- [ ] Redis используется как shared state (не локальные счётчики)
- [ ] Lua script для атомарного check-and-increment
- [ ] Описан Redis key schema (rate:{type}:{id}:{window})

### HTTP Integration
- [ ] Rate limiter реализован как middleware (не в каждом endpoint)
- [ ] Заголовки: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- [ ] Ответ 429 Too Many Requests с Retry-After
- [ ] Response body содержит retry_after и описание ошибки

### Multi-tier Limiting
- [ ] Порядок проверки: global → IP → user → endpoint
- [ ] Обоснование порядка (от дешёвого к дорогому)
- [ ] Разные лимиты для разных тарифных планов (Free/Pro/Enterprise)

### Fault Tolerance
- [ ] Fail-open стратегия: Redis down → пропускаем запросы
- [ ] Local fallback: in-memory approximate counter при потере Redis
- [ ] Redis Sentinel / Cluster для HA
- [ ] Circuit breaker для обращений к Redis

### Monitoring
- [ ] Метрики: rate of 429 responses, p99 latency rate limiter, Redis connection errors
- [ ] Алерты: spike в 429 (возможна атака), Redis latency > 10ms
- [ ] Dashboard: top rate-limited users, requests by tier, Redis cluster health

## Как проверить себя

1. Пройдите по каждой секции чеклиста — все пункты должны быть закрыты
2. «Прогоните» сценарий: 1000 req/sec от одного пользователя через 3 API-сервера
3. Проверьте: все 3 сервера видят общий счётчик в Redis?
4. Проверьте: если Redis упал на 5 секунд — что происходит с запросами?
5. Проверьте: клиент получает X-RateLimit-Remaining и Retry-After?
6. Проверьте: DDoS с 10K IP — IP-лимит отсекает на уровне gateway?
7. Сравните свой дизайн с эталонным решением (Solution)
